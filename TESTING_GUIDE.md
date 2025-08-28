# CaseClerk AI - Local Testing Guide

## 🚀 Quick Start (Windows)

### Option 1: Automated Startup (Recommended)
```bash
# Double-click the batch file or run in terminal:
start-dev.bat
```

### Option 2: Manual Startup
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

## 🚀 Quick Start (Mac/Linux)

### Option 1: Automated Startup (Recommended)
```bash
./start-dev.sh
```

### Option 2: Manual Startup
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend  
npm install
npm run dev
```

## 📱 Access Points

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health

## 🧪 Testing Features

### 1. Home Page
- Visit: http://localhost:3000
- Should show landing page with CaseClerk AI branding
- Click "View Demo Dashboard" or "Try Demo"

### 2. Dashboard (Demo Mode)
- Visit: http://localhost:3000/dashboard
- Should show dashboard with mock data:
  - Active cases count
  - Document statistics  
  - Recent calls
  - Upcoming events

### 3. Onboarding Flow
- Visit: http://localhost:3000/onboarding
- Multi-step setup process:
  - Professional Profile
  - Jurisdiction & Court
  - Document Storage
  - AI & Integrations
  - Feature Selection

### 4. API Testing

#### Authentication
```bash
# Login (demo user)
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@caseclerk.ai","password":"demo123"}'
```

#### Cases API
```bash
# Get all cases
curl http://localhost:8000/api/cases

# Create new case
curl -X POST http://localhost:8000/api/cases \
  -H "Content-Type: application/json" \
  -d '{"case_number":"2024-TEST-001","title":"Test Case"}'
```

#### Health Check
```bash
curl http://localhost:8000/health
```

## 🔧 Troubleshooting

### Port Conflicts
If ports 3000 or 8000 are in use:

**Windows:**
```bash
netstat -ano | findstr :3000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

### Common Issues

1. **"Module not found" errors**
   ```bash
   cd frontend && npm install
   cd backend && npm install
   ```

2. **TypeScript errors**
   ```bash
   cd frontend && npm run type-check
   cd backend && npm run build
   ```

3. **CORS errors**
   - Check that backend is running on port 8000
   - Verify CORS_ORIGIN in backend/.env

## 🎯 Demo Features Available

### Frontend Features
- ✅ Landing page with feature overview
- ✅ Dashboard with mock data and statistics
- ✅ Onboarding flow (5 steps)
- ✅ Responsive design with Tailwind CSS
- ✅ Modern UI components (shadcn/ui)

### Backend Features  
- ✅ Authentication API (login/register)
- ✅ Cases CRUD API with search
- ✅ Documents API with file upload
- ✅ Users profile management
- ✅ Calendar events API
- ✅ Call logs with transcription
- ✅ AI services integration
- ✅ Health monitoring

### Mock Data Available
- 2 sample cases (contract dispute, DUI case)
- 1 sample document (contract PDF)
- 2 sample call logs with transcripts
- 2 sample calendar events
- Demo user account (demo@caseclerk.ai / demo123)

## 🌐 Production Deployment

When ready for production:

1. **Update Environment Variables**
   ```bash
   # Update backend/.env with production values
   NODE_ENV=production
   JWT_SECRET=your-production-secret
   # Add real API keys
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Deploy with PM2**
   ```bash
   npm run deploy
   ```

## 📊 Performance Notes

- Frontend: Next.js 14 with App Router for optimal performance
- Backend: Express.js with TypeScript for type safety
- Database: Currently using mock data (easily replaceable)
- File Storage: Local uploads directory (configurable)
- AI Integration: Mock responses (ready for real API keys)

## 🔐 Security Features

- JWT authentication with refresh tokens
- Rate limiting on API endpoints
- CORS protection
- Input validation and sanitization
- Secure file upload handling
- Environment variable protection

The system is fully functional for local testing and ready for production deployment!