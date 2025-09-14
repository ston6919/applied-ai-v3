#!/bin/bash

echo "🚀 Setting up Applied AI Website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Setup backend
echo "🐍 Setting up Django backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Run Django migrations
echo "Running Django migrations..."
python manage.py migrate

# Create superuser (optional)
echo "Creating Django superuser..."
echo "You can skip this step by pressing Ctrl+C"
python manage.py createsuperuser

echo "🎉 Setup complete!"
echo ""
echo "To start the development servers:"
echo "1. Frontend: npm run dev (from project root)"
echo "2. Backend: cd backend && source venv/bin/activate && python manage.py runserver 8010"
echo ""
echo "Frontend: http://localhost:3010"
echo "Backend API: http://localhost:8010"
echo "Admin: http://localhost:8010/admin"
