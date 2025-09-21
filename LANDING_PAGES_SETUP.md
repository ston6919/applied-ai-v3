# Landing Pages Setup Guide

## Overview
This system allows you to create landing pages that collect email addresses and additional information from visitors, automatically adding them to your MailerLite lists.

## Features
- Multi-step form (email → name → business type)
- Automatic MailerLite integration
- Template delivery upon completion
- Easy landing page creation via Django admin
- Management commands for quick setup

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure MailerLite
1. Get your API key from [MailerLite Dashboard](https://dashboard.mailerlite.com/integrations/api)
2. Create a `.env` file in the backend directory:
```bash
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# MailerLite API Key
MAILERLITE_API_KEY=your-mailerlite-api-key-here
```

### 3. Run Migrations
```bash
python manage.py migrate
```

### 4. Create a Superuser (if needed)
```bash
python manage.py createsuperuser
```

### 5. Start the Backend
```bash
python manage.py runserver 8010
```

### 6. Start the Frontend
```bash
cd frontend
npm run dev -- -p 3010
```

## Creating Landing Pages

### Method 1: Django Admin
1. Go to `http://localhost:8010/admin/`
2. Navigate to "Landing Pages" → "Landing pages"
3. Click "Add Landing Page"
4. Fill in the details:
   - **Title**: Display name for your landing page
   - **Slug**: URL-friendly version (e.g., "ai-automation-template")
   - **Description**: Brief description shown to visitors
   - **Template Content**: The content/template you'll deliver
   - **MailerLite Group ID**: The group ID from MailerLite where subscribers will be added
   - **Is Active**: Check to make the page live

### Method 2: Management Command
```bash
python manage.py create_landing_page "Your Title" "your-slug" \
  --description "Your description" \
  --template "Your template content here" \
  --group-id "your-mailerlite-group-id"
```

## Accessing Landing Pages
Once created, your landing pages will be available at:
`http://localhost:3010/landing/your-slug`

## How It Works

### Step 1: Email Collection
- Visitor enters email address
- System adds them to MailerLite group (if not already subscribed)
- Moves to next step

### Step 2: Name Collection
- Visitor enters first name
- System updates MailerLite subscriber with name
- Moves to final step

### Step 3: Business Type
- Visitor selects their goal:
  - "Implement in My Business" - wants to use AI in their own business
  - "Sell AI Services" - wants to offer AI services to others
- System updates MailerLite with this information
- Template is delivered

### Step 4: Template Delivery
- Visitor sees the template content
- Receives confirmation that template was sent to their email

## MailerLite Integration

The system automatically:
- Creates new subscribers if they don't exist
- Adds existing subscribers to the specified group
- Updates subscriber information (name, business type)
- Handles errors gracefully if MailerLite is unavailable

## Customization

### Styling
The landing page uses Tailwind CSS classes. You can customize the appearance by modifying the component in `frontend/app/landing/[slug]/page.tsx`.

### Form Steps
You can modify the form steps by editing the `LandingPageSubmissionStepSerializer` in `backend/landing_pages/serializers.py` and the corresponding frontend component.

### Template Content
Templates can include any text content. For rich formatting, you can use HTML in the template content field.

## Troubleshooting

### MailerLite API Issues
- Verify your API key is correct
- Check that the group ID exists in MailerLite
- Ensure your MailerLite account is active

### Landing Page Not Found
- Check that the slug is correct
- Verify the landing page is marked as active
- Ensure the backend is running

### Form Submission Errors
- Check browser console for JavaScript errors
- Verify backend API is accessible
- Check Django logs for server errors

## Example Usage

Create a landing page for an AI prompt template:
```bash
python manage.py create_landing_page "AI Prompt Engineering Guide" "prompt-guide" \
  --description "Master the art of AI prompt engineering with our comprehensive guide" \
  --template "AI Prompt Engineering Guide

1. BE SPECIFIC
   - Use clear, detailed instructions
   - Include context and examples
   - Specify the desired output format

2. PROVIDE CONTEXT
   - Give background information
   - Explain the use case
   - Include relevant constraints

3. USE EXAMPLES
   - Show good and bad examples
   - Demonstrate the desired style
   - Provide multiple scenarios

4. ITERATE AND REFINE
   - Test different phrasings
   - Adjust based on results
   - Document what works best" \
  --group-id "your-group-id"
```

Then share the URL: `http://localhost:3010/landing/prompt-guide`
