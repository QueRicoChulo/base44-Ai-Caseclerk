#!/usr/bin/env node

/**
 * CaseClerk AI - Health Check Script
 * Monitors application health and sends alerts if issues are detected
 */

const http = require('http');
const https = require('https');
const { exec } = require('child_process');

class HealthChecker {
  constructor() {
    this.config = {
      frontend: {
        url: process.env.FRONTEND_URL || 'http://localhost:3000',
        timeout: 5000
      },
      backend: {
        url: process.env.BACKEND_URL || 'http://localhost:8000/health',
        timeout: 5000
      },
      database: {
        enabled: process.env.CHECK_DATABASE === 'true',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432
      },
      redis: {
        enabled: process.env.CHECK_REDIS === 'true',
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
      },
      alerts: {
        slack: process.env.SLACK_WEBHOOK,
        email: process.env.ALERT_EMAIL
      }
    };
  }

  async checkEndpoint(url, timeout = 5000) {
    return new Promise((resolve) => {
      const client = url.startsWith('https') ? https : http;
      const startTime = Date.now();

      const req = client.get(url, { timeout }, (res) => {
        const responseTime = Date.now() - startTime;
        const isHealthy = res.statusCode >= 200 && res.statusCode < 400;

        resolve({
          healthy: isHealthy,
          statusCode: res.statusCode,
          responseTime,
          error: null
        });
      });

      req.on('error', (error) => {
        resolve({
          healthy: false,
          statusCode: null,
          responseTime: Date.now() - startTime,
          error: error.message
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          healthy: false,
          statusCode: null,
          responseTime: timeout,
          error: 'Request timeout'
        });
      });
    });
  }

  async checkDatabase() {
    if (!this.config.database.enabled) {
      return { healthy: true, message: 'Database check disabled' };
    }

    return new Promise((resolve) => {
      exec(`pg_isready -h ${this.config.database.host} -p ${this.config.database.port}`, (error, stdout, stderr) => {
        resolve({
          healthy: !error,
          message: error ? stderr : 'Database connection OK',
          error: error ? error.message : null
        });
      });
    });
  }

  async checkRedis() {
    if (!this.config.redis.enabled) {
      return { healthy: true, message: 'Redis check disabled' };
    }

    return new Promise((resolve) => {
      exec(`redis-cli -h ${this.config.redis.host} -p ${this.config.redis.port} ping`, (error, stdout, stderr) => {
        const isHealthy = !error && stdout.trim() === 'PONG';
        resolve({
          healthy: isHealthy,
          message: isHealthy ? 'Redis connection OK' : (stderr || 'Redis connection failed'),
          error: error ? error.message : null
        });
      });
    });
  }

  async checkDiskSpace() {
    return new Promise((resolve) => {
      exec("df -h / | awk 'NR==2{print $5}' | sed 's/%//'", (error, stdout, stderr) => {
        if (error) {
          resolve({
            healthy: false,
            usage: null,
            error: error.message
          });
          return;
        }

        const usage = parseInt(stdout.trim());
        const isHealthy = usage < 90; // Alert if disk usage > 90%

        resolve({
          healthy: isHealthy,
          usage: `${usage}%`,
          error: null
        });
      });
    });
  }

  async checkMemory() {
    return new Promise((resolve) => {
      exec("free | grep Mem | awk '{print ($3/$2) * 100.0}'", (error, stdout, stderr) => {
        if (error) {
          resolve({
            healthy: false,
            usage: null,
            error: error.message
          });
          return;
        }

        const usage = parseFloat(stdout.trim());
        const isHealthy = usage < 90; // Alert if memory usage > 90%

        resolve({
          healthy: isHealthy,
          usage: `${usage.toFixed(1)}%`,
          error: null
        });
      });
    });
  }

  async sendAlert(message) {
    const alerts = [];

    // Slack notification
    if (this.config.alerts.slack) {
      try {
        const response = await fetch(this.config.alerts.slack, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 CaseClerk AI Health Alert\n${message}`,
            username: 'Health Monitor',
            icon_emoji: ':warning:'
          })
        });
        alerts.push(`Slack: ${response.ok ? 'Sent' : 'Failed'}`);
      } catch (error) {
        alerts.push(`Slack: Error - ${error.message}`);
      }
    }

    // Email notification (requires sendmail or similar)
    if (this.config.alerts.email) {
      exec(`echo "${message}" | mail -s "CaseClerk AI Health Alert" ${this.config.alerts.email}`, (error) => {
        alerts.push(`Email: ${error ? 'Failed' : 'Sent'}`);
      });
    }

    return alerts;
  }

  async runHealthCheck() {
    console.log('🏥 Starting CaseClerk AI Health Check...\n');

    const results = {
      timestamp: new Date().toISOString(),
      overall: true,
      checks: {}
    };

    // Check Frontend
    console.log('Checking Frontend...');
    results.checks.frontend = await this.checkEndpoint(this.config.frontend.url, this.config.frontend.timeout);
    console.log(`Frontend: ${results.checks.frontend.healthy ? '✅' : '❌'} (${results.checks.frontend.responseTime}ms)`);

    // Check Backend
    console.log('Checking Backend...');
    results.checks.backend = await this.checkEndpoint(this.config.backend.url, this.config.backend.timeout);
    console.log(`Backend: ${results.checks.backend.healthy ? '✅' : '❌'} (${results.checks.backend.responseTime}ms)`);

    // Check Database
    console.log('Checking Database...');
    results.checks.database = await this.checkDatabase();
    console.log(`Database: ${results.checks.database.healthy ? '✅' : '❌'} ${results.checks.database.message}`);

    // Check Redis
    console.log('Checking Redis...');
    results.checks.redis = await this.checkRedis();
    console.log(`Redis: ${results.checks.redis.healthy ? '✅' : '❌'} ${results.checks.redis.message}`);

    // Check System Resources
    console.log('Checking System Resources...');
    results.checks.disk = await this.checkDiskSpace();
    results.checks.memory = await this.checkMemory();
    console.log(`Disk Usage: ${results.checks.disk.healthy ? '✅' : '❌'} ${results.checks.disk.usage || 'Unknown'}`);
    console.log(`Memory Usage: ${results.checks.memory.healthy ? '✅' : '❌'} ${results.checks.memory.usage || 'Unknown'}`);

    // Determine overall health
    results.overall = Object.values(results.checks).every(check => check.healthy);

    console.log(`\n🎯 Overall Health: ${results.overall ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);

    // Send alerts if unhealthy
    if (!results.overall) {
      const unhealthyChecks = Object.entries(results.checks)
        .filter(([_, check]) => !check.healthy)
        .map(([name, check]) => `${name}: ${check.error || check.message || 'Failed'}`)
        .join('\n');

      const alertMessage = `CaseClerk AI health check failed at ${results.timestamp}\n\nFailed checks:\n${unhealthyChecks}`;
      
      console.log('\n📢 Sending alerts...');
      const alertResults = await this.sendAlert(alertMessage);
      console.log(`Alerts: ${alertResults.join(', ')}`);
    }

    // Output JSON for monitoring systems
    if (process.argv.includes('--json')) {
      console.log('\n' + JSON.stringify(results, null, 2));
    }

    // Exit with appropriate code
    process.exit(results.overall ? 0 : 1);
  }
}

// Run health check
const healthChecker = new HealthChecker();
healthChecker.runHealthCheck().catch(error => {
  console.error('Health check failed:', error);
  process.exit(1);
});