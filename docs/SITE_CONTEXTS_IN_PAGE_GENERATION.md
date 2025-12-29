# Site Contexts in Page Generation

## Overview

The content production system now supports automatic integration of site-wide HTML components (header, footer, head tags) when generating HTML pages.

## Features

### 1. Get Site Contexts Tool

**Tool Name**: `get_site_contexts`

**Purpose**: Retrieve user's saved site-wide components before generating pages.

**Parameters**:
- `user_id` (required): The user ID to fetch contexts for
- `types` (optional): Specific context types to fetch (`logo`, `header`, `footer`, `meta`)

**Returns**:
```typescript
{
  success: boolean;
  contexts: Record<string, { content?: string; fileUrl?: string; updatedAt: string }>;
  message: string;
  logo: string | null;      // Direct access to logo URL
  header: string | null;    // Direct access to header HTML
  footer: string | null;    // Direct access to footer HTML
  head: string | null;      // Direct access to head tag content
}
```

**Example Usage**:
```typescript
// AI calls this to check user's site contexts
await get_site_contexts({
  user_id: "user-123",
  types: ["header", "footer", "meta"]
});
```

### 2. Enhanced HTML Assembly

**Tool Name**: `assemble_html_page` (Updated)

**New Parameter**:
- `user_id` (optional): If provided, automatically fetches and integrates site contexts

**Integration Logic**:

1. **Header Integration**: Inserted before `<main>` tag
2. **Footer Integration**: Inserted after `</main>` tag
3. **Head Tags Integration**:
   - Extracts content from user's saved `<head>` tag
   - Merges with page-specific SEO meta tags
   - Page-specific title and description take precedence if not in custom head content

**Example HTML Structure**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Merged head content: user's custom tags + page-specific SEO -->
  <title>Page Title</title>
  <meta name="description" content="...">
  <!-- User's custom meta tags, stylesheets, scripts -->
  <style>...</style>
</head>
<body>
  <!-- User's custom header -->
  <header>...</header>
  
  <!-- Page content -->
  <main>
    <article>
      <h1>Page Title</h1>
      <!-- Sections -->
    </article>
  </main>
  
  <!-- User's custom footer -->
  <footer>...</footer>
</body>
</html>
```

## Workflow

### For AI Assistant:

```
1. [Optional] Call get_site_contexts(user_id) to check available contexts
   ↓
2. Draft all page sections
   ↓
3. Generate images for sections with placeholders
   ↓
4. Call assemble_html_page with user_id parameter
   ↓  (Tool automatically fetches and integrates contexts)
5. Save final HTML page
```

### For Developers:

**Setting Up Site Contexts**:

Users can save their site contexts through the UI:
1. Click "On Site Context" in the left sidebar
2. Upload logo, add header/footer HTML, paste head tags
3. Contexts are saved to `site_contexts` table

**Database Schema**:

```sql
site_contexts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL, -- 'logo' | 'header' | 'footer' | 'meta'
  content TEXT,       -- HTML content for header/footer/meta
  file_url TEXT,      -- URL for logo
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, type)
)
```

## Benefits

1. **Consistent Branding**: All generated pages automatically include user's header and footer
2. **SEO Optimization**: User's head tags (analytics, meta tags, etc.) are included in every page
3. **Time Saving**: No need to manually add header/footer to each generated page
4. **Flexibility**: Users can update their header/footer once, and all future pages will use the latest version

## Metadata in Response

The `assemble_html_page` tool now returns metadata about integrated contexts:

```typescript
{
  success: true,
  html_content: "...",
  metadata: {
    item_id: "...",
    page_title: "...",
    sections_count: 5,
    images_count: 3,
    has_custom_header: true,   // New
    has_custom_footer: true,   // New
    has_custom_head: true,     // New
    createdAt: "..."
  }
}
```

## Example Conversation Flow

**User**: "Generate a page about AI tools"

**AI**:
1. ✅ Creates plan
2. ✅ Calls `get_site_contexts(user_id)` → Finds header, footer, and head tags
3. ✅ Drafts all sections
4. ✅ Generates images
5. ✅ Calls `assemble_html_page(user_id, ...)` → Header, footer, and head tags automatically integrated
6. ✅ Saves final page

**Result**: Complete branded HTML page with user's header, footer, analytics, and styling!

## Notes

- If `user_id` is not provided or user has no saved contexts, pages are generated with default styling
- Head tag merging is intelligent: page-specific SEO tags won't be duplicated if already present in custom head content
- Header and footer HTML is inserted as-is, so users have full control over styling and scripts

