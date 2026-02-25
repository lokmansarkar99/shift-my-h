# UK Address Lookup Setup

ShiftMyHome uses **getAddress.io** for UK postcode and address autocomplete.

## Setup Instructions

### 1. Get API Key

1. Sign up at [getAddress.io](https://getaddress.io)
2. Choose a plan (free tier available for testing)
3. Copy your API key from the dashboard

### 2. Add Environment Variable

Add the API key to your Supabase environment variables:

**Variable Name:** `GETADDRESS_API_KEY`  
**Value:** Your getAddress.io API key

The system will automatically use this key for address lookups.

### 3. Alternative: Local Development

For local development with Vite, you can also use:

**Variable Name:** `VITE_GETADDRESS_API_KEY`  
**Value:** Your getAddress.io API key

Add this to your `.env` file:
```
VITE_GETADDRESS_API_KEY=your-api-key-here
```

## How It Works

- **Autocomplete**: As users type, suggestions appear from getAddress.io
- **Postcode Lookup**: Full postcode returns all addresses at that location
- **Address Details**: Includes coordinates (latitude/longitude) for mapping
- **Fallback**: If API is unavailable, users can enter addresses manually
- **No Error Messages**: Technical errors are hidden from users

## Features

✅ Real-time autocomplete  
✅ Postcode validation  
✅ Address parsing (house number, street, city, etc.)  
✅ Coordinates for mapping  
✅ Silent fallback to manual entry  
✅ 24-hour result caching  
✅ Rate limit handling  

## API Documentation

- **Website**: https://getaddress.io
- **API Docs**: https://documentation.getaddress.io
- **Support**: support@getaddress.io

## No Configuration Required

If no API key is provided:
- Address lookup will be disabled
- Users can still enter addresses manually
- No error messages will be shown to users
