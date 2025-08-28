# CaseClerk AI - Usage Examples

## 🎯 **Common Use Cases**

### **1. Local Development**

```bash
# Quick start (Windows)
double-click quick-start.bat

# Quick start (Mac/Linux)
./quick-start.sh

# Manual start
npm run dev
```

### **2. Testing API Endpoints**

```bash
# Health check
curl http://localhost:8000/health

# Get all cases
curl http://localhost:8000/api/cases

# Create a new case
curl -X POST http://localhost:8000/api/cases \
  -H "Content-Type: application/json" \
  -d '{
    "case_number": "2024-TEST-001",
    "title": "Test Contract Dispute",
    "plaintiff": "John Doe",
    "defendant": "Jane Smith",
    "status": "active"
  }'

# Login with demo user
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@caseclerk.ai",
    "password": "demo123"
  }'
```

### **3. Frontend Navigation**

```
http://localhost:3000/                 # Landing page
http://localhost:3000/dashboard        # Main dashboard
http://localhost:3000/onboarding       # Setup wizard
```

### **4. Building for Production**

```bash
# Build all components
npm run build

# Build individual components
npm run build:frontend
npm run build:backend
npm run build:electron
```

### **5. Desktop Application**

```bash
# Development mode
cd electron
npm run dev

# Build desktop app
npm run dist:win    # Windows installer
npm run dist:mac    # macOS app
npm run dist:linux  # Linux AppImage
```

---

## 🌐 **Deployment Examples**

### **Railway Deployment**

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/caseclerk-ai.git
git push -u origin main

# 2. Deploy to Railway
npm install -g @railway/cli
railway login
railway init
railway up

# 3. Set environment variables
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set BASE44_API_KEY=0fdc722fdcac4237a61e75148cf3f8b1
railway variables set BASE44_API_URL=https://app.base44.com/api/apps/68a362a1664b8f811bac8895
```

### **Docker Deployment**

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **Vercel Frontend + Railway Backend**

```bash
# Deploy frontend to Vercel
cd frontend
npx vercel --prod

# Deploy backend to Railway
cd ../backend
railway init
railway up
```

---

## 🔧 **Customization Examples**

### **Adding a New Page**

1. **Create the page file:**
```typescript
// frontend/src/app/my-page/page.tsx
'use client'

export default function MyPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">My Custom Page</h1>
      <p>This is my custom page content.</p>
    </div>
  );
}
```

2. **Add navigation link:**
```typescript
// Add to your navigation component
<Link href="/my-page">My Page</Link>
```

### **Adding a New API Endpoint**

1. **Create the route file:**
```typescript
// backend/src/api/routes/my-endpoint.ts
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello from my endpoint!' });
});

export default router;
```

2. **Register the route:**
```typescript
// backend/src/index.ts
import myEndpoint from './api/routes/my-endpoint';
app.use('/api/my-endpoint', myEndpoint);
```

### **Customizing the Theme**

```css
/* frontend/src/app/globals.css */
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}

.custom-theme {
  background: linear-gradient(135deg, #your-gradient);
}
```

---

## 🧪 **Testing Examples**

### **Frontend Testing**

```bash
cd frontend
npm test
```

### **Backend Testing**

```bash
cd backend
npm test
```

### **API Testing with Postman**

Import this collection:
```json
{
  "info": { "name": "CaseClerk AI API" },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/health"
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"demo@caseclerk.ai\",\"password\":\"demo123\"}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8000"
    }
  ]
}
```

---

## 🐛 **Debugging Examples**

### **Check Logs**

```bash
# Frontend logs (in browser console)
# Press F12 and check Console tab

# Backend logs (in terminal)
# Look at the terminal where you ran npm run dev

# PM2 logs (if using PM2)
pm2 logs

# Docker logs
docker-compose logs -f caseclerk-backend
docker-compose logs -f caseclerk-frontend
```

### **Common Debug Commands**

```bash
# Check if ports are in use
netstat -an | findstr :3000
netstat -an | findstr :8000

# Kill processes on ports
npx kill-port 3000 8000

# Check Node.js version
node --version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 **Monitoring Examples**

### **Health Monitoring**

```bash
# Run health check script
node deployment/scripts/health-check.js

# Check with curl
curl -f http://localhost:8000/health || echo "Service is down"

# Monitor with watch
watch -n 5 'curl -s http://localhost:8000/health | jq'
```

### **Performance Monitoring**

```bash
# Check memory usage
ps aux | grep node

# Monitor with htop
htop

# Check disk space
df -h

# Monitor logs in real-time
tail -f logs/app.log
```

---

## 🔐 **Security Examples**

### **Generate Secure JWT Secret**

```bash
# Generate random secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### **SSL Certificate Setup**

```bash
# Generate self-signed certificate for development
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Move to SSL directory
mv cert.pem deployment/ssl/caseclerk.ai.crt
mv key.pem deployment/ssl/caseclerk.ai.key
```

---

## 📱 **Mobile Testing**

### **Test on Mobile Device**

1. **Find your local IP:**
```bash
# Windows
ipconfig | findstr IPv4

# Mac/Linux
ifconfig | grep inet
```

2. **Update environment:**
```env
NEXT_PUBLIC_API_URL=http://YOUR_IP:8000
```

3. **Access from mobile:**
```
http://YOUR_IP:3000
```

---

## 🎯 **Production Checklist**

```bash
# 1. Update environment variables
cp .env.example .env.production
# Edit .env.production with production values

# 2. Build for production
NODE_ENV=production npm run build

# 3. Test production build
NODE_ENV=production npm start

# 4. Run security audit
npm audit

# 5. Check for updates
npm outdated

# 6. Deploy
npm run deploy
```