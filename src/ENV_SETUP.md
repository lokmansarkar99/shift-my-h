# Environment Variables Setup

## Required Environment Variables

### 1. getAddress.io API Key (for UK Address Lookup)

**Variable Name:** `GETADDRESS_API_KEY`

**How to Get:**
1. Visit https://getaddress.io
2. Sign up for an account (free tier available)
3. Copy your API key from the dashboard
4. Add it to Supabase environment variables

**In Supabase Dashboard:**
1. Go to Project Settings → Edge Functions → Environment Variables
2. Click "Add variable"
3. Name: `GETADDRESS_API_KEY`
4. Value: Your API key
5. Save

**For Local Development (Vite):**

Create a `.env` file in the root directory:

```env
VITE_GETADDRESS_API_KEY=your-api-key-here
```

Or use:

```env
NEXT_PUBLIC_GETADDRESS_API_KEY=your-api-key-here
```

### 2. Already Configured Variables

The following environment variables have already been set up:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `NEXT_PUBLIC_MAPBOX_TOKEN`

## Important Notes

- **Never commit** `.env` files to version control
- The system works without `GETADDRESS_API_KEY` (manual address entry will be used)
- All API errors are handled silently - users will never see technical error messages
- Address lookup results are cached for 24 hours to minimize API calls

## Deployment Checklist

✅ Add `GETADDRESS_API_KEY` to Supabase environment variables  
✅ Restart Edge Functions after adding new variables  
✅ Test address lookup on staging/production  
✅ Verify manual entry fallback works if API fails  
