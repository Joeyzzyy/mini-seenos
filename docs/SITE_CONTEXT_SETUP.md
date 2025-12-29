# Site Context Feature Setup Guide

## Overview
The Site Context feature allows users to manage logo, header, and footer elements for their site. This guide explains how to set up the required database tables and storage buckets.

## Database Setup

### 1. Create the `site_contexts` table

Run the SQL migration file in your Supabase SQL Editor:

```bash
supabase-migrations/create_site_contexts.sql
```

Or manually run the SQL commands in Supabase Dashboard > SQL Editor.

### 2. Create the `logos` storage bucket

**In Supabase Dashboard:**

1. Go to **Storage** section
2. Click **New bucket**
3. Set the following:
   - **Name:** `logos`
   - **Public:** ✅ Enabled (so logos can be publicly accessed)
4. Click **Create bucket**

### 3. Set up Storage Policies

After creating the `logos` bucket, set up the following policies:

**In Supabase Dashboard > Storage > logos > Policies:**

#### Policy 1: Allow authenticated users to upload logos
```sql
CREATE POLICY "Allow authenticated users to upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 2: Allow public read access to logos
```sql
CREATE POLICY "Allow public read access to logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');
```

#### Policy 3: Allow users to update their own logos
```sql
CREATE POLICY "Allow users to update their own logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 4: Allow users to delete their own logos
```sql
CREATE POLICY "Allow users to delete their own logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Features

### 1. Logo Upload
- Users can upload logo images (png, jpg, svg, etc.)
- Images are stored in Supabase Storage
- Public URLs are generated for easy access

### 2. Header/Footer Code
- Users can paste HTML code for headers and footers
- Code can be previewed in the modal before saving
- Supports inline CSS and styling

### 3. Management
- List all site contexts in the left sidebar
- Edit existing contexts by clicking on them
- Delete contexts via right-click context menu
- Each context type has its own icon (logo, header, footer)

## Usage

### Adding a new site context:

1. Click the **+** button in the "On Site Context" section
2. Select the type (Logo, Header, or Footer)
3. Enter a name
4. For Logo: Upload an image file
5. For Header/Footer: Paste HTML code and preview
6. Click **Create**

### Editing a site context:

1. Click on any context in the list, OR
2. Right-click and select **Edit**
3. Make your changes
4. Click **Save Changes**

### Deleting a site context:

1. Right-click on a context
2. Select **Delete**
3. Confirm the deletion

## API Endpoints

### GET `/api/site-contexts`
Fetch all site contexts for the authenticated user.

### POST `/api/site-contexts`
Create a new site context.

**Body:**
```json
{
  "type": "logo" | "header" | "footer",
  "name": "string",
  "content": "string (optional, for header/footer)",
  "fileUrl": "string (optional, for logo)"
}
```

### PUT `/api/site-contexts`
Update an existing site context.

**Body:**
```json
{
  "id": "string",
  "name": "string (optional)",
  "content": "string (optional)",
  "fileUrl": "string (optional)"
}
```

### DELETE `/api/site-contexts?id={contextId}`
Delete a site context.

### POST `/api/upload-logo`
Upload a logo image.

**Body:** FormData with `file` field

**Response:**
```json
{
  "success": true,
  "url": "public_url",
  "filename": "original_filename"
}
```

## Troubleshooting

### Logo uploads failing
- Verify the `logos` bucket exists and is public
- Check storage policies are correctly set
- Ensure user is authenticated

### Can't see contexts in sidebar
- Check the database table was created successfully
- Verify Row Level Security policies are active
- Check browser console for errors

### Preview not working for header/footer
- Ensure HTML is valid
- Note: External scripts and styles may not load in preview
- Preview is for layout reference only

