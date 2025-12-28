# Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db

# Session Secret (change this to a random string in production)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# SMTP Email Configuration (for contact form)
# You can use services like Gmail, SendGrid, Mailgun, etc.
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Contact Email (where contact form submissions will be sent)
# If not set, will use the email from profile or SMTP_USER
CONTACT_EMAIL=admin@example.com

# Server Port (default: 5000)
PORT=5000

# Node Environment
NODE_ENV=development
```

## Setup Instructions

1. **Database Setup:**
   - Create a PostgreSQL database
   - Update `DATABASE_URL` with your database credentials
   - Run `npm run db:push` to create tables

2. **Create Admin User:**
   - After starting the server, make a POST request to `/api/auth/register` with:
     ```json
     {
       "email": "admin@example.com",
       "password": "your-secure-password"
     }
     ```

3. **Email Configuration:**
   - For Gmail: Use an App Password (not your regular password)
   - For other providers: Update SMTP settings accordingly

4. **Install Dependencies:**
   ```bash
   npm install
   ```

5. **Run Database Migrations:**
   ```bash
   npm run db:push
   ```

6. **Start Development Server:**
   ```bash
   npm run dev
   ```

