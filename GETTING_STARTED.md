# CaseClerk AI - Getting Started Guide

## 🎯 **Quick Start (5 Minutes)**

### **Prerequisites**
- Node.js 18+ installed ([Download here](https://nodejs.org/))
- Git installed ([Download here](https://git-scm.com/))
- Code editor (VS Code recommended)

### **Step 1: Install Dependencies**

Open your terminal in the project directory and run:

```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install:all
```

### **Step 2: Environment Setup**

```bash
# Copy the environment template
copy .env.example .env

# Edit the .env file with your settings
notepad .env
```

**Minimum required settings in `.env`:**
```env
# Basic Configuration
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Base44 Integration (Use provided demo keys)
BASE44_API_KEY=0fdc722fdcac4237a61e75148cf3f8b1
BASE44_API_URL=https://app.base44.com/api/apps/68a362a1664b8f811bac8895

# Frontend URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### **Step 3: Start Development Servers**

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000

### **Step 4: Access the Application**

Open your browser and go to:
- **Main App**: http://localhost:3000
- **API Health**: http://localhost:8000/health

---

## 🖥️ **Using the Application**

### **First Time Setup**

1. **Open the App**: Go to http://localhost:3000
2. **Welcome Screen**: You'll see the CaseClerk AI landing page
3. **Try Demo**: Click "View Demo Dashboard" to see the demo
4. **Onboarding**: Click "Complete Setup" to go through onboarding

### **Demo Features Available**

#### **Dashboard** (http://localhost:3000/dashboard)
- View active cases summary
- See document statistics
- Check recent calls
- Monitor upcoming events

#### **Onboarding Flow** (http://localhost:3000/onboarding)
- Professional profile setup
- Jurisdiction configuration
- Storage preferences
- API keys setup
- Feature selection

### **API Testing**

Test the backend APIs directly:

```bash
# Health check
curl http://localhost:8000/health

# Get demo cases
curl http://localhost:8000/api/cases

# Login (demo user)
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@caseclerk.ai","password":"demo123"}'
```

---

## 🌐 **Online Deployment**

### **Option 1: Railway (Recommended)**

1. **Create GitHub Repository**:
```bash
git init
git add .
git commit -m "Initial CaseClerk AI setup"
git remote add origin https://github.com/yourusername/caseclerk-ai.git
git push -u origin main
```

2. **Deploy to Railway**:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize and deploy
railway init
railway up
```

3. **Set Environment Variables**:
```bash
railway variables set JWT_SECRET=your-jwt-secret-here
railway variables set BASE44_API_KEY=0fdc722fdcac4237a61e75148cf3f8b1
railway variables set BASE44_API_URL=https://app.base44.com/api/apps/68a362a1664b8f811bac8895
```

### **Option 2: Vercel (Frontend Only)**

```bash
cd frontend
npx vercel --prod
```

---

## 🖥️ **Desktop Application**

### **Development Mode**
```bash
cd electron
npm install
npm run dev
```

### **Build Desktop App**
```bash
cd electron

# Build for your platform
npm run dist:win    # Windows
npm run dist:mac    # macOS  
npm run dist:linux  # Linux
```

---

## 🔧 **Customization**

### **Adding Your Own API Keys**

Edit `.env` file:
```env
# AI Services
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here

# Telephony
VONAGE_API_KEY=your-vonage-key-here
VONAGE_API_SECRET=your-vonage-secret-here
```

### **Changing Branding**

1. **Logo**: Replace images in `frontend/public/`
2. **Colors**: Edit `frontend/src/app/globals.css`
3. **App Name**: Update `package.json` files

### **Adding Features**

1. **Frontend Pages**: Add to `frontend/src/app/`
2. **Backend APIs**: Add to `backend/src/api/routes/`
3. **Database Models**: Add to `frontend/src/entities/`

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Port Already in Use**
```bash
# Kill processes on ports 3000 and 8000
npx kill-port 3000 8000
```

#### **Module Not Found**
```bash
# Reinstall dependencies
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

#### **TypeScript Errors**
```bash
# Check TypeScript
cd frontend && npm run type-check
cd backend && npm run build
```

#### **Environment Variables Not Loading**
- Ensure `.env` file is in the root directory
- Restart the development servers after changes
- Check for typos in variable names

### **Getting Help**

1. **Check Logs**: Look at terminal output for errors
2. **Browser Console**: Check for frontend errors (F12)
3. **API Testing**: Use curl or Postman to test endpoints
4. **GitHub Issues**: Report bugs or ask questions

---

## 📱 **Production Checklist**

Before deploying to production:

- [ ] Update JWT_SECRET to a secure random string
- [ ] Add your own API keys
- [ ] Configure SSL certificates
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test all features
- [ ] Update CORS origins
- [ ] Set NODE_ENV=production

---

## 🎯 **Next Steps**

1. **Explore the Code**: Look at the modular architecture
2. **Add Your Data**: Replace demo data with real cases
3. **Customize UI**: Update colors, fonts, and branding
4. **Add Features**: Extend with your specific requirements
5. **Deploy**: Choose your preferred hosting platform
6. **Monitor**: Set up logging and health checks

---

## 📚 **Learning Resources**

- **Next.js**: https://nextjs.org/docs
- **Express.js**: https://expressjs.com/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Electron**: https://www.electronjs.org/docs

---

## 🆘 **Support**

- **Documentation**: Check the README.md
- **API Reference**: Visit http://localhost:8000/api/docs
- **GitHub Issues**: Report problems
- **Email**: support@caseclerk.ai (for enterprise support)