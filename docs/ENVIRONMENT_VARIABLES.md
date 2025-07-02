# Environment Variables

This document outlines the environment variables required for the doug.is website.

## Analytics Configuration

### PostHog Analytics

PostHog is used for comprehensive event tracking and user analytics.

**Required Variables:**
```bash
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  # Optional: defaults to US cloud
```

**Setup Instructions:**
1. Create a PostHog account at https://posthog.com
2. Create a new project
3. Copy the Project API Key from your project settings
4. Add the key to your environment variables
5. Optionally set a custom PostHog host if using self-hosted or EU cloud

**Privacy Configuration:**
The PostHog implementation includes privacy-friendly defaults:
- Session recording disabled
- Console log recording disabled  
- Respects Do Not Track headers
- Person profiles only for identified users
- No default opt-out (users can opt-out if needed)

### Vercel Analytics

Vercel Analytics is automatically configured and requires no additional environment variables.

## Supabase Configuration

### Database Connection

**Required Variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Deployment

### Local Development

1. Copy `.env.local.example` to `.env.local` (if it exists)
2. Add your environment variables to `.env.local`
3. Restart your development server

### Production (Vercel)

1. Add environment variables in your Vercel dashboard
2. Go to Project Settings → Environment Variables
3. Add each variable with appropriate scope (Production, Preview, Development)

## Security Notes

- Never commit actual environment variables to version control
- Use different keys for development and production environments
- Regularly rotate sensitive keys like service role keys
- PostHog API keys are safe to expose client-side (they're prefixed with NEXT_PUBLIC_) 