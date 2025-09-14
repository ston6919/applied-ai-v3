# DigitalOcean Deployment Guide

## Step-by-Step Deployment Instructions

### 1. Create DigitalOcean App

1. Go to [DigitalOcean Apps Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Choose "GitHub" as source
4. Select your repository: `ston6919/applied-ai-v2`
5. Choose branch: `main`
6. DigitalOcean will automatically detect the `.do/app.yaml` configuration

### 2. Environment Variables Setup

#### Backend App Environment Variables:
```bash
# Django Settings
SECRET_KEY=your-super-secret-django-key-here
DEBUG=False
ALLOWED_HOSTS=your-backend-domain.com,your-frontend-domain.com

# Database (DigitalOcean provides these automatically)
DB_NAME=applied-ai-db
DB_USER=postgres
DB_PASSWORD=[auto-generated]
DB_HOST=[auto-generated]
DB_PORT=25060

# CORS Settings
FRONTEND_URL=https://your-frontend-domain.com
```

#### Frontend App Environment Variables:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NODE_ENV=production
```

### 3. Database Setup

The database is automatically created by DigitalOcean based on the `.do/app.yaml` configuration:

- **Type**: PostgreSQL 13
- **Size**: db-s-dev-database (smallest/cheapest)
- **Connection**: Automatically configured via environment variables

### 4. Domain Configuration

After deployment, DigitalOcean will provide you with URLs like:
- Frontend: `https://your-app-name-frontend.ondigitalocean.app`
- Backend: `https://your-app-name-backend.ondigitalocean.app`

Update your environment variables with these actual URLs.

### 5. Custom Domain (Optional)

If you have a custom domain:
1. Add your domain in DigitalOcean Apps settings
2. Update DNS records to point to DigitalOcean
3. Update environment variables with your custom domain

### 6. Admin User Creation

After deployment, you'll need to create an admin user. You can do this by:

1. **Option A: SSH into the backend container**
   ```bash
   # In DigitalOcean Apps, go to your backend app
   # Click "Console" tab
   python manage.py createsuperuser
   ```

2. **Option B: Add to build process**
   Add this to your backend build command in `.do/app.yaml`:
   ```yaml
   build_command: pip install -r requirements.txt && python manage.py migrate && echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell
   ```

### 7. Deployment Checklist

- [ ] Repository connected to DigitalOcean
- [ ] Environment variables set for both apps
- [ ] Database automatically created
- [ ] Apps deployed successfully
- [ ] Admin user created
- [ ] Frontend can communicate with backend
- [ ] Custom domain configured (if applicable)

### 8. Troubleshooting

#### Common Issues:

1. **CORS Errors**: Make sure `FRONTEND_URL` is set correctly in backend environment variables
2. **Database Connection**: Verify database environment variables are set
3. **Build Failures**: Check build logs in DigitalOcean Apps dashboard
4. **Admin Access**: Ensure admin user is created after deployment

#### Useful Commands:

```bash
# Check app logs
doctl apps logs <app-id> --type=run

# Check build logs  
doctl apps logs <app-id> --type=build

# SSH into app (if enabled)
doctl apps ssh <app-id>
```

### 9. Cost Estimation

- **Frontend App**: ~$5/month (basic-xxs)
- **Backend App**: ~$5/month (basic-xxs)  
- **Database**: ~$15/month (db-s-dev-database)
- **Total**: ~$25/month

### 10. Scaling

To scale your apps:
1. Go to your app in DigitalOcean dashboard
2. Click on the service you want to scale
3. Adjust instance count or size
4. Deploy changes

## Security Notes

- Never commit `.env` files to Git
- Use strong SECRET_KEY values
- Keep DEBUG=False in production
- Regularly update dependencies
- Monitor app logs for errors
