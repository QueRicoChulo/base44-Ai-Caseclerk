// PM2 Configuration for CaseClerk AI
module.exports = {
  apps: [
    {
      name: 'caseclerk-backend',
      script: './backend/dist/index.js',
      cwd: './',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 8000,
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 8000,
        JWT_SECRET: process.env.JWT_SECRET,
        BASE44_API_KEY: process.env.BASE44_API_KEY,
        BASE44_API_URL: process.env.BASE44_API_URL,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8000,
        JWT_SECRET: process.env.JWT_SECRET,
        BASE44_API_KEY: process.env.BASE44_API_KEY,
        BASE44_API_URL: process.env.BASE44_API_URL,
        DATABASE_URL: process.env.DATABASE_URL,
      },
      // Logging
      log_file: './logs/pm2-combined.log',
      out_file: './logs/pm2-out.log',
      error_file: './logs/pm2-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Process management
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      watch: false,
      
      // Memory management
      max_memory_restart: '1G',
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
    },
    {
      name: 'caseclerk-frontend',
      script: './frontend/server.js',
      cwd: './',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'https://staging-api.caseclerk.ai',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'https://api.caseclerk.ai',
        NEXT_PUBLIC_BASE44_API_KEY: process.env.BASE44_API_KEY,
      },
      // Logging
      log_file: './logs/frontend-combined.log',
      out_file: './logs/frontend-out.log',
      error_file: './logs/frontend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Process management
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      watch: false,
      
      // Memory management
      max_memory_restart: '512M',
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['caseclerk.ai'],
      ref: 'origin/main',
      repo: 'git@github.com:base44/caseclerk-ai.git',
      path: '/var/www/caseclerk-ai',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload pm2.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    },
    staging: {
      user: 'deploy',
      host: ['staging.caseclerk.ai'],
      ref: 'origin/develop',
      repo: 'git@github.com:base44/caseclerk-ai.git',
      path: '/var/www/caseclerk-ai-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload pm2.config.js --env staging',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};