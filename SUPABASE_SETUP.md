# Supabase Database Setup Instructions

## Overview
Your application now supports both local file storage (development) and Supabase database storage (production). The system automatically uses files locally and database when deployed.

## Current Status
- ✅ Supabase client installed
- ✅ Database service layer created
- ✅ SQL schema prepared
- ✅ Environment variables configured
- 🔄 **Next: Set up Supabase project**

## Setup Steps

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### 2. Set Up Database
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL to create tables

### 3. Get Your Credentials
1. Go to **Settings** → **API**
2. Copy your:
   - Project URL
   - Anon/Public key

### 4. Update Environment Variables
In your `.env.local` file, uncomment and update:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Set Up Storage Buckets (for report files)
1. Go to **Storage** in Supabase dashboard
2. Create two buckets:
   - `report-charts` (for PNG files)
   - `report-data` (for JSON files)
3. Make both buckets **public**

### 6. Test the Setup
1. Set `USE_DATABASE=true` in `.env.local`
2. Restart your development server
3. Test form submission and report generation

## How It Works

### Development Mode (USE_DATABASE=false)
- Uses local files in `data/` directory
- No internet connection required
- Perfect for development

### Production Mode (USE_DATABASE=true)
- Uses Supabase database
- Files stored in Supabase Storage
- Persistent data across deployments

## Migration
When you're ready to switch to database:
1. Set `USE_DATABASE=true` in your environment
2. Your existing data will remain in files
3. New data will go to database
4. You can manually migrate existing data if needed

## Deployment
When deploying to Render or other platforms:
1. Add environment variables to your deployment platform
2. The app will automatically use database storage
3. Your data will persist across deployments

## Benefits
- ✅ **No functionality changes** - everything works the same
- ✅ **Free tier** - 500MB database + 1GB storage
- ✅ **Automatic backups** - Supabase handles this
- ✅ **Scalable** - can handle thousands of submissions
- ✅ **Real-time** - potential for live updates
- ✅ **Secure** - built-in authentication and RLS