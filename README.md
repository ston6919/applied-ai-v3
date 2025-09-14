# Applied AI Website

A modern website for your AI brand built with Next.js and Django.

## Features

- **News Section**: Latest AI news and updates
- **Tools Section**: Curated AI tools and resources
- **Automations Section**: AI-powered automation solutions
- **Mastermind Community**: Exclusive community membership tiers

## Tech Stack

### Frontend (Next.js)
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Responsive design

### Backend (Django)
- Django 4.2 with Django REST Framework
- SQLite database (easily upgradeable to PostgreSQL)
- CORS enabled for frontend communication
- Admin interface for content management

## Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- pip

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3010

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Start development server:
```bash
python manage.py runserver 8010
```

The backend API will be available at http://localhost:8010

## Project Structure

```
applied-ai-website/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── news/              # News section
│   ├── tools/             # Tools section
│   ├── automations/       # Automations section
│   └── mastermind/        # Mastermind section
├── components/            # React components
├── backend/               # Django backend
│   ├── applied_ai/        # Django project settings
│   ├── news/              # News app
│   ├── tools/             # Tools app
│   ├── automations/       # Automations app
│   └── mastermind/        # Mastermind app
└── package.json           # Frontend dependencies
```

## API Endpoints

- `/api/news/articles/` - News articles
- `/api/tools/` - AI tools
- `/api/automations/` - Automation solutions
- `/api/mastermind/tiers/` - Membership tiers
- `/api/mastermind/members/` - Community members

## Admin Interface

Access the Django admin at http://localhost:8010/admin to manage:
- News articles
- AI tools
- Automations
- Membership tiers
- Community members

## Customization

### Adding Content
1. Use the Django admin interface to add news articles, tools, and automations
2. The frontend will automatically display the new content

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for global styles
- Component-specific styles are in individual component files

### Adding New Features
1. Create new Django apps for additional functionality
2. Add corresponding Next.js pages and components
3. Update the navigation in `components/Navbar.tsx`

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `.next`

### Backend (Railway/Heroku/DigitalOcean)
1. Set environment variables
2. Use PostgreSQL for production
3. Configure static file serving
4. Set up SSL certificates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
