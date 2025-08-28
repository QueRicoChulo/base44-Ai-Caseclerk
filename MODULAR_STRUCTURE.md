# CaseClerk AI - Modular Structure & File Classification

## 📁 Complete Project Structure

```
caseclerk-ai/
├── 📱 frontend/                          # Next.js App Router Frontend
│   ├── src/
│   │   ├── app/                         # Next.js 13+ App Router
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx             # Dashboard page (new 1.txt)
│   │   │   ├── cases/
│   │   │   │   └── page.tsx             # Cases listing (new 3.txt)
│   │   │   └── onboarding/
│   │   │       └── page.tsx             # Onboarding flow (new 2.txt)
│   │   ├── components/
│   │   │   ├── cases/
│   │   │   │   ├── CaseCard.tsx         # Case summary card (new 15.txt)
│   │   │   │   ├── CreateCaseModal.tsx  # Case creation modal (new 16.txt)
│   │   │   │   └── details/
│   │   │   │       └── DocumentsTab.tsx # Documents tab (new 20.txt)
│   │   │   ├── onboarding/
│   │   │   │   └── ProfileStep.tsx      # Profile step (new 10.txt)
│   │   │   └── upload/
│   │   │       └── FileProcessingList.tsx # File processing (new 25.txt)
│   │   └── entities/                    # Data models & API clients
│   ├── package.json                     # Frontend dependencies
│   ├── next.config.js                   # Next.js configuration
│   ├── tsconfig.json                    # TypeScript config
│   └── tailwind.config.js               # Tailwind CSS config
│
├── 🔧 backend/                          # Node.js/TypeScript Backend
│   ├── src/
│   │   ├── api/
│   │   │   └── entities/
│   │   │       └── CallLog.ts           # CallLog API (new 35.txt)
│   │   ├── services/                    # Business logic
│   │   ├── utils/                       # Utility functions
│   │   ├── types/                       # TypeScript definitions
│   │   └── index.ts                     # Server entry point
│   ├── package.json                     # Backend dependencies
│   └── tsconfig.json                    # TypeScript config
│
├── 🖥️ electron/                         # Electron Desktop App
│   ├── src/
│   │   ├── main.ts                      # Main process
│   │   └── preload.ts                   # Preload script
│   ├── assets/                          # App icons & resources
│   ├── package.json                     # Electron dependencies
│   └── tsconfig.json                    # TypeScript config
│
├── 🚀 deployment/                       # Deployment & Infrastructure
│   ├── scripts/
│   │   └── deploy.sh                    # Deployment automation
│   ├── pm2.config.js                    # Process management
│   └── nginx.conf                       # Reverse proxy config
│
├── ⚙️ config/                           # Configuration Files
│   └── api.env                          # API keys (new 38.txt)
│
├── 📄 Root Files
│   ├── package.json                     # Workspace configuration
│   ├── README.md                        # Project documentation
│   ├── .gitignore                       # Git ignore rules
│   └── MODULAR_STRUCTURE.md            # This file
```

## 🔄 File Mapping & Classification

### Original Files → New Structure

| Original File | New Location | Module | Type | Description |
|---------------|--------------|---------|------|-------------|
| `new 1.txt` | `frontend/src/app/dashboard/page.tsx` | Frontend | Page | Dashboard overview page |
| `new 2.txt` | `frontend/src/app/onboarding/page.tsx` | Frontend | Page | User onboarding flow |
| `new 3.txt` | `frontend/src/app/cases/page.tsx` | Frontend | Page | Cases listing and management |
| `new 10.txt` | `frontend/src/components/onboarding/ProfileStep.tsx` | Frontend | Component | Profile setup step |
| `new 15.txt` | `frontend/src/components/cases/CaseCard.tsx` | Frontend | Component | Case summary card |
| `new 16.txt` | `frontend/src/components/cases/CreateCaseModal.tsx` | Frontend | Component | Case creation modal |
| `new 20.txt` | `frontend/src/components/cases/details/DocumentsTab.tsx` | Frontend | Component | Documents tab view |
| `new 25.txt` | `frontend/src/components/upload/FileProcessingList.tsx` | Frontend | Component | File upload processing |
| `new 35.txt` | `backend/src/api/entities/CallLog.ts` | Backend | API | CallLog entity API |
| `new 38.txt` | `config/api.env` | Config | Environment | API keys and config |

## 🏗️ Module Breakdown

### 1. Frontend (Next.js App Router)
**Purpose**: User interface and client-side logic
**Technology**: Next.js 14, React 18, TypeScript, Tailwind CSS

**Structure**:
- **Pages** (`src/app/`): Route-based pages using App Router
- **Components** (`src/components/`): Reusable UI components
- **Entities** (`src/entities/`): Data models and API clients
- **Utils** (`src/utils/`): Helper functions and utilities

**Key Features**:
- Server-side rendering with Next.js App Router
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Component-based architecture
- Real-time updates and state management

### 2. Backend (Node.js/TypeScript)
**Purpose**: API services, business logic, and data management
**Technology**: Node.js, Express, TypeScript

**Structure**:
- **API** (`src/api/`): REST endpoints and controllers
- **Services** (`src/services/`): Business logic layer
- **Utils** (`src/utils/`): Server utilities
- **Types** (`src/types/`): Shared TypeScript definitions

**Key Features**:
- RESTful API design
- Base44 platform integration
- Authentication and authorization
- File upload and processing
- Error handling and logging

### 3. Electron Desktop
**Purpose**: Cross-platform desktop application
**Technology**: Electron, TypeScript

**Structure**:
- **Main Process** (`src/main.ts`): Application lifecycle
- **Preload** (`src/preload.ts`): Secure IPC bridge
- **Assets**: Icons and resources

**Key Features**:
- Cross-platform compatibility
- Auto-updates
- Native OS integration
- Secure IPC communication
- Offline capabilities

### 4. Deployment & Infrastructure
**Purpose**: Production deployment and process management
**Technology**: PM2, Nginx, Bash

**Components**:
- **PM2 Configuration**: Process clustering and management
- **Nginx Configuration**: Reverse proxy and load balancing
- **Deployment Scripts**: Automated build and deploy
- **Health Checks**: Service monitoring

**Key Features**:
- Zero-downtime deployments
- Load balancing and clustering
- SSL termination
- Automated backups
- Health monitoring

## 🔧 Configuration & Environment

### Environment Files
- `frontend/.env.local`: Frontend environment variables
- `backend/.env`: Backend environment variables
- `config/api.env`: Shared API configuration
- `deployment/.env`: Deployment-specific variables

### Package Management
- **Root**: Workspace configuration with npm workspaces
- **Frontend**: Next.js and React dependencies
- **Backend**: Node.js server dependencies
- **Electron**: Desktop app dependencies

## 🚀 Development Workflow

### Local Development
```bash
npm run dev              # Start frontend + backend
npm run dev:frontend     # Frontend only (:3000)
npm run dev:backend      # Backend only (:8000)
npm run dev:electron     # Desktop app
```

### Production Build
```bash
npm run build           # Build all modules
npm run deploy          # Deploy to production
```

### Testing
```bash
npm test               # Run all tests
npm run lint           # Lint all code
```

## 📚 Documentation Standards

All modules follow consistent documentation patterns:
- **JSDoc comments** for all functions and classes
- **TypeScript interfaces** for type definitions
- **Component props documentation**
- **API endpoint specifications**
- **README files** for each module

## 🔒 Security Considerations

- **Context isolation** in Electron
- **CORS configuration** for API
- **Input validation** and sanitization
- **Secure file uploads**
- **JWT authentication**
- **HTTPS enforcement**

## 🎯 Benefits of This Structure

1. **Modularity**: Clear separation of concerns
2. **Scalability**: Easy to add new features and modules
3. **Maintainability**: Well-documented and organized code
4. **Type Safety**: Full TypeScript coverage
5. **Development Experience**: Hot reloading and fast builds
6. **Production Ready**: Optimized builds and deployment
7. **Cross-Platform**: Web, desktop, and mobile support

This modular structure provides a solid foundation for the CaseClerk AI application, enabling efficient development, easy maintenance, and seamless deployment across multiple platforms.