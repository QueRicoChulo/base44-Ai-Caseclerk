# CaseClerk AI - One-Click Deployment

Deploy CaseClerk AI to your preferred platform with one click:

## 🚀 **One-Click Deploy Options**

### Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

### Vercel (Frontend Only)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/caseclerk-ai&project-name=caseclerk-ai&repository-name=caseclerk-ai)

### Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/yourusername/caseclerk-ai)

### Heroku
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yourusername/caseclerk-ai)

### DigitalOcean
[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/yourusername/caseclerk-ai)

## 🔧 **Required Environment Variables**

For any deployment, you'll need these environment variables:

```env
JWT_SECRET=your-super-secret-jwt-key
BASE44_API_KEY=your-base44-api-key
BASE44_API_URL=https://app.base44.com/api/apps/your-app-id
```

## 🌐 **Platform Comparison**

| Platform | Free Tier | Database | SSL | Custom Domain | Best For |
|----------|-----------|----------|-----|---------------|----------|
| **Railway** | ✅ $5 credit | ✅ PostgreSQL | ✅ Auto | ✅ Yes | Quick testing |
| **Vercel** | ✅ Generous | ❌ External | ✅ Auto | ✅ Yes | Frontend demos |
| **Render** | ✅ Limited | ✅ PostgreSQL | ✅ Auto | ✅ Yes | Full-stack apps |
| **Heroku** | ✅ 550 hours | ✅ PostgreSQL | ✅ Auto | ✅ Paid | Traditional |
| **DigitalOcean** | ❌ $5/month | ✅ Managed | ✅ Auto | ✅ Yes | Production |

## 📱 **Testing Your Deployment**

Once deployed, test these endpoints:

1. **Frontend**: `https://your-app.platform.com`
2. **Backend Health**: `https://your-app.platform.com/api/health`
3. **API Docs**: `https://your-app.platform.com/api/docs`

## 🔍 **Troubleshooting**

### Common Issues:

1. **Build Failures**: Check Node.js version (requires 18+)
2. **Environment Variables**: Ensure all required vars are set
3. **Database Connection**: Verify DATABASE_URL if using external DB
4. **CORS Errors**: Update CORS_ORIGIN in environment variables

### Debug Commands:

```bash
# Check logs
railway logs  # Railway
vercel logs   # Vercel
heroku logs   # Heroku

# Check environment
railway variables  # Railway
vercel env ls     # Vercel
heroku config     # Heroku
```