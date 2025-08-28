# CaseClerk AI - Legal Practice Management System

<div align="center">
  <img src="https://via.placeholder.com/200x200/f59e0b/ffffff?text=CaseClerk+AI" alt="CaseClerk AI Logo" width="200"/>
  
  **AI-Powered Legal Practice Management for Modern Law Firms**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
</div>

---

## 🎯 **Overview**

CaseClerk AI is a comprehensive legal practice management system that combines traditional case management with cutting-edge AI capabilities. Built for modern law firms, it streamlines workflows, automates routine tasks, and provides intelligent insights to help legal professionals focus on what matters most.

### ✨ **Key Features**

- **🏛️ Case Management** - Complete CRUD operations for legal cases with intelligent categorization
- **📄 Document Processing** - AI-powered document analysis, extraction, and organization
- **📞 AI Calling System** - Automated call logging with transcription and sentiment analysis
- **📅 Smart Calendar** - Intelligent scheduling with conflict detection and automated reminders
- **🔍 Legal Research** - AI-assisted legal research with case law and statute analysis
- **📊 Analytics Dashboard** - Real-time insights and performance metrics
- **🖥️ Desktop Application** - Cross-platform Electron app for offline access
- **🔐 Enterprise Security** - JWT authentication, role-based access, and data encryption

---

## 🏗️ **Architecture**

CaseClerk AI follows a modular, microservices-inspired architecture:

```
CaseClerk AI/
├── 🎨 frontend/          # Next.js 14 App Router (React/TypeScript)
├── ⚙️ backend/           # Node.js/Express API Server (TypeScript)
├── 🖥️ electron/          # Desktop Application (Electron)
├── 🚀 deployment/        # Docker, Nginx, PM2 configurations
├── 📋 docs/              # Documentation and guides
└── 🔧 scripts/           # Utility and deployment scripts
```

### 🛠️ **Technology Stack**

**Frontend:**
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui component library
- Lucide React icons

**Backend:**
- Node.js with Express.js
- TypeScript for type safety
- JWT authentication
- Multer for file uploads
- Winston for logging

**Desktop:**
- Electron for cross-platform support
- Auto-updater functionality
- Native system integration

**Deployment:**
- Docker & Docker Compose
- Nginx reverse proxy
- PM2 process management
- SSL/TLS encryption

**External Integrations:**
- Base44 Platform API
- OpenAI GPT models
- Anthropic Claude
- ElevenLabs voice synthesis
- Vonage/Twilio telephony

---

## 🚀 **Quick Start**

### Prerequisites

- **Node.js** 18+ and npm 8+
- **Git** for version control
- **Docker** (optional, for containerized deployment)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/base44/caseclerk-ai.git
cd caseclerk-ai

# Install all dependencies
npm run install:all
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**
```env
JWT_SECRET=your-super-secret-jwt-key
BASE44_API_KEY=your-base44-api-key
BASE44_API_URL=https://app.base44.com/api/apps/your-app-id
```

### 3. Development Mode

```bash
# Start both frontend and backend in development mode
npm run dev

# Or start individually
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:8000
```

### 4. Production Deployment

```bash
# Build all applications
npm run build

# Deploy with PM2
npm run deploy

# Or deploy with Docker
npm run docker:up
```

---

## 📱 **Applications**

### 🌐 **Web Application**
Access CaseClerk AI through your browser at `http://localhost:3000`

**Features:**
- Responsive design for desktop and mobile
- Real-time updates and notifications
- Offline-capable with service workers
- Progressive Web App (PWA) support

### 🖥️ **Desktop Application**
Native desktop experience with additional features:

```bash
# Development
cd electron
npm run dev

# Build for your platform
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

**Desktop-Exclusive Features:**
- Native file system integration
- System notifications
- Offline document access
- Auto-updater

---

## 🔧 **Configuration**

### Environment Variables

CaseClerk AI uses environment variables for configuration. See `.env.example` for all available options.

**Core Configuration:**
```env
# Application
NODE_ENV=production
APP_URL=https://caseclerk.ai

# Security
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://caseclerk.ai

# Base44 Integration
BASE44_API_KEY=your-api-key
BASE44_API_URL=your-api-url

# AI Services
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

### Database Configuration

CaseClerk AI can work with multiple data sources:

1. **Base44 Platform** (Recommended)
2. **PostgreSQL** (Local database)
3. **MongoDB** (Alternative)

```env
# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/caseclerk_ai

# MongoDB
MONGODB_URI=mongodb://localhost:27017/caseclerk_ai
```

---

## 🚀 **Deployment**

### Docker Deployment (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### PM2 Deployment

```bash
# Start with PM2
pm2 start deployment/pm2.config.js --env production

# Monitor processes
pm2 monit

# View logs
pm2 logs
```

### Manual Deployment

```bash
# Build applications
npm run build

# Start production servers
npm run start:backend &
npm run start:frontend &
```

### Nginx Configuration

The included Nginx configuration provides:
- SSL/TLS termination
- Load balancing
- Static file serving
- Security headers
- Rate limiting

---

## 📊 **Monitoring & Health Checks**

### Health Check Endpoint

```bash
# Check application health
curl http://localhost:8000/health

# Detailed health check
node deployment/scripts/health-check.js
```

### Monitoring Dashboard

Access real-time metrics at:
- **Application**: `http://localhost:3000/dashboard`
- **PM2 Monitor**: `pm2 monit`
- **Docker Stats**: `docker stats`

### Logging

Logs are available in multiple formats:
- **Application logs**: `./logs/app.log`
- **PM2 logs**: `pm2 logs`
- **Docker logs**: `docker-compose logs`

---

## 🔐 **Security**

CaseClerk AI implements enterprise-grade security:

### Authentication & Authorization
- JWT-based authentication
- Refresh token rotation
- Role-based access control (RBAC)
- Session management

### Data Protection
- Encryption at rest and in transit
- Secure file upload handling
- Input validation and sanitization
- SQL injection prevention

### Network Security
- HTTPS/TLS encryption
- CORS protection
- Rate limiting
- Security headers (HSTS, CSP, etc.)

### Compliance
- GDPR compliance features
- Audit logging
- Data retention policies
- Privacy controls

---

## 🧪 **Testing**

```bash
# Run all tests
npm test

# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

---

## 📚 **API Documentation**

### Authentication

```bash
# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password",
  "full_name": "John Doe"
}
```

### Cases API

```bash
# Get all cases
GET /api/cases

# Create case
POST /api/cases
{
  "case_number": "2024-CV-001",
  "title": "Contract Dispute",
  "plaintiff": "John Doe",
  "defendant": "Jane Smith"
}

# Get case by ID
GET /api/cases/:id

# Update case
PUT /api/cases/:id

# Delete case
DELETE /api/cases/:id
```

### Documents API

```bash
# Upload document
POST /api/documents
Content-Type: multipart/form-data

# Get documents
GET /api/documents

# Process with AI
POST /api/documents/:id/analyze
```

For complete API documentation, visit `/api/docs` when the server is running.

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Style

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Conventional Commits** for commit messages

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 **Support**

### Documentation
- [Installation Guide](docs/installation.md)
- [Configuration Guide](docs/configuration.md)
- [API Reference](docs/api.md)
- [Deployment Guide](docs/deployment.md)

### Community
- **GitHub Issues**: [Report bugs or request features](https://github.com/base44/caseclerk-ai/issues)
- **Discussions**: [Community discussions](https://github.com/base44/caseclerk-ai/discussions)
- **Email**: support@caseclerk.ai

### Professional Support
For enterprise support, custom development, or consulting services, contact us at enterprise@caseclerk.ai.

---

## 🙏 **Acknowledgments**

- **Base44 Platform** for backend infrastructure
- **OpenAI** for AI capabilities
- **Vercel** for Next.js framework
- **shadcn/ui** for component library
- **Tailwind CSS** for styling system

---

<div align="center">
  <p>Made with ❤️ by the Base44 team</p>
  <p>
    <a href="https://caseclerk.ai">Website</a> •
    <a href="https://github.com/base44/caseclerk-ai">GitHub</a> •
    <a href="https://twitter.com/caseclerk_ai">Twitter</a> •
    <a href="mailto:hello@caseclerk.ai">Contact</a>
  </p>
</div>