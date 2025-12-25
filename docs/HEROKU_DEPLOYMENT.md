# Heroku Backend Deployment Guide 🚀

This guide explains how to deploy the **Tokova Backend Server** (`apps/server`) to Heroku.

## 1. Prerequisites
*   [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed.
*   Logged in to Heroku (`heroku login`).
*   Git repository initialized and committed.

## 2. Prepare Application (Already Done)
We have already:
*   Created a `Procfile` in `apps/server/`.
*   Configured `main.ts` to use `process.env.PORT`.
*   Ensured `package.json` has `build` and `start:prod` scripts.

## 3. Create Heroku App
Run the following commands in your terminal (root directory):

```bash
heroku create tokova-backend
```
*(Replace `tokova-backend` with a unique name)*

## 4. Configure Environment Variables
You need to set the production environment variables on Heroku.

```bash
heroku config:set NODE_ENV=production --app tokova-backend
heroku config:set APP_NAME=Tokova --app tokova-backend
heroku config:set FRONTEND_URL=https://your-frontend-domain.com --app tokova-backend
heroku config:set ADMIN_URL=https://your-admin-domain.com --app tokova-backend
heroku config:set VENDOR_URL=https://your-vendor-domain.com --app tokova-backend

# Database (Supabase)
heroku config:set DATABASE_URL=postgres://user:pass@host:5432/db --app tokova-backend

# JWT Secrets (Use the generated ones)
heroku config:set JWT_SECRET=... --app tokova-backend
heroku config:set JWT_REFRESH_SECRET=... --app tokova-backend
heroku config:set JWT_EXPIRES_IN=1h --app tokova-backend
heroku config:set JWT_REFRESH_EXPIRES_IN=7d --app tokova-backend

# Mailgun
heroku config:set MAILGUN_API_KEY=... --app tokova-backend
heroku config:set MAILGUN_DOMAIN=... --app tokova-backend
heroku config:set MAILGUN_FROM=... --app tokova-backend

# Stripe
heroku config:set STRIPE_SECRET_KEY=... --app tokova-backend
heroku config:set STRIPE_PUBLISHABLE_KEY=... --app tokova-backend
heroku config:set STRIPE_WEBHOOK_SECRET=... --app tokova-backend
heroku config:set STRIPE_PLATFORM_FEE_PERCENT=10 --app tokova-backend

# Appwrite (If used)
heroku config:set APPWRITE_ENDPOINT=... --app tokova-backend
heroku config:set APPWRITE_PROJECT_ID=... --app tokova-backend
heroku config:set APPWRITE_API_KEY=... --app tokova-backend
heroku config:set APPWRITE_BUCKET_ID=... --app tokova-backend
```

## 5. Deploy using Git Subtree
Since `server` is in a subfolder (`apps/server`), we use `git subtree` to deploy only that folder to Heroku's root.

Run this command from the **root** of your repository:

```bash
git subtree push --prefix apps/server heroku main
```

**Note:** If `heroku` remote is not found, add it first:
```bash
heroku git:remote -a tokova-backend
```

## 6. Verify Deployment
Monitor logs to ensure everything started correctly:
```bash
heroku logs --tail --app tokova-backend
```

If successful, your API will be accessible at: `https://tokova-backend.herokuapp.com/api`

---

## 🛑 Troubleshooting

### Build Failures
*   Ensure `@nestjs/cli` is in `devDependencies`.
*   Ensure `start:prod` script points to `dist/main`.

### Database Connection Errors
*   Ensure `DATABASE_URL` is correct and accessible from Heroku IP ranges (Supabase usually allows this).
*   If using SSL, ensure `sslmode=require` is in the URL.
