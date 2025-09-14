# Applied AI Website

A modern website showcasing Applied AI services with a Next.js frontend and Django REST API backend.

## Project Structure

```
applied-ai-website/
├── frontend/          # Next.js React application
│   ├── app/          # Next.js 13+ app directory
│   ├── components/   # React components
│   └── package.json  # Frontend dependencies
├── backend/          # Django REST API
│   ├── applied_ai/   # Django project settings
│   ├── news/         # News app
│   ├── tools/        # Tools app
│   ├── automations/  # Automations app
│   ├── mastermind/   # Mastermind app
│   └── requirements.txt
└── .do/             # DigitalOcean deployment config
```

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at http://localhost:3010

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8010
```
Backend will be available at http://localhost:8010

### Admin Access
- URL: http://localhost:8010/admin/
- Username: admin
- Password: admin123

## DigitalOcean Deployment

This project is configured for DigitalOcean Apps Platform deployment.

### Deployment Steps

1. **Connect Repository**
   - Go to DigitalOcean Apps Platform
   - Create new app
   - Connect your GitHub repository: `ston6919/applied-ai-v2`

2. **Configure Apps**
   - The `.do/app.yaml` file will automatically configure:
     - Frontend app (Node.js)
     - Backend app (Python/Django)
     - PostgreSQL database

3. **Environment Variables**
   Set these in DigitalOcean Apps Platform:
   - `SECRET_KEY`: Django secret key
   - `DEBUG`: False
   - `DB_NAME`: Database name
   - `DB_USER`: Database user
   - `DB_PASSWORD`: Database password
   - `DB_HOST`: Database host
   - `DB_PORT`: Database port

4. **Deploy**
   - DigitalOcean will automatically build and deploy both apps
   - Frontend will be available at your app's main domain
   - Backend API will be available at `/api` path

### Manual Deployment Commands

If deploying manually:

```bash
# Frontend
cd frontend
npm install
npm run build
npm start

# Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic
gunicorn applied_ai.wsgi:application
```

## Features

- **Modern UI**: Built with Next.js 14 and Tailwind CSS
- **Responsive Design**: Mobile-first approach
- **REST API**: Django REST Framework backend
- **Admin Panel**: Django admin for content management
- **CORS Enabled**: Frontend-backend communication
- **Production Ready**: Configured for deployment

## API Endpoints

- `/api/news/` - News articles
- `/api/tools/` - AI tools
- `/api/automations/` - Automation services
- `/api/mastermind/` - Mastermind program info

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

This project is private and proprietary.