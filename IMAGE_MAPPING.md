# Local Image Mapping

This document shows how the local images from `/public/images/` are used throughout the ModBlog application.

## Image Files Available

Located in: `public/images/`

1. `caspar-camille-rubin-0qvBNep1Y04-unsplash.webp` (3.2MB)
2. `christopher-gower-m_HRfLhgABo-unsplash.webp` (1.1MB)
3. `farzad-p-xSl33Wxyc-unsplash.webp` (2.2MB)
4. `ferenc-almasi-eYpcLDXHVb0-unsplash.webp` (1.0MB)
5. `fotis-fotopoulos-DuHKoV44prg-unsplash.webp` (3.3MB)
6. `markus-spiske-MI9-PY5cyNs-unsplash.webp` (4.0MB)
7. `markus-spiske-hvSr_CVecVI-unsplash.webp` (3.4MB)

## Image Usage

### User Avatars

**Author Avatar (John Doe)**
- File: `caspar-camille-rubin-0qvBNep1Y04-unsplash.webp`
- Used in:
  - `lib/sample-data.ts` - Sample author avatar
  - `app/about/page.tsx` - About page author profile
  - `app/api/auth/login/route.ts` - Admin user avatar
  - `app/api/auth/me/route.ts` - Admin user avatar
  - `app/admin/users/page.tsx` - Default user avatar

**Editor Avatar**
- File: `markus-spiske-MI9-PY5cyNs-unsplash.webp`
- Used in:
  - `app/api/auth/login/route.ts` - Editor user avatar
  - `app/api/auth/me/route.ts` - Editor user avatar

### Blog Post Featured Images

The following images are used in rotation for blog post featured images:

1. `markus-spiske-hvSr_CVecVI-unsplash.webp` - Post #1, #6, etc.
2. `ferenc-almasi-eYpcLDXHVb0-unsplash.webp` - Post #2, #7, etc.
3. `fotis-fotopoulos-DuHKoV44prg-unsplash.webp` - Post #3, etc.
4. `christopher-gower-m_HRfLhgABo-unsplash.webp` - Post #4, etc.
5. `farzad-p-xSl33Wxyc-unsplash.webp` - Post #5, etc.

These are assigned cyclically in `lib/sample-data.ts` based on post index:
```javascript
const postImages = [
  '/images/markus-spiske-hvSr_CVecVI-unsplash.webp',
  '/images/ferenc-almasi-eYpcLDXHVb0-unsplash.webp',
  '/images/fotis-fotopoulos-DuHKoV44prg-unsplash.webp',
  '/images/christopher-gower-m_HRfLhgABo-unsplash.webp',
  '/images/farzad-p-xSl33Wxyc-unsplash.webp',
];
```

## Changes Made

### Files Modified

1. **lib/sample-data.ts**
   - Changed author avatar from Unsplash URL to local image
   - Updated post featured images to use local images array
   - Added cycling logic for post images

2. **app/api/auth/login/route.ts**
   - Updated admin and editor user avatars to local images

3. **app/api/auth/me/route.ts**
   - Updated admin and editor user avatars to local images

4. **app/about/page.tsx**
   - Changed author profile image to local image

5. **app/admin/users/page.tsx**
   - Updated default user avatar to local image

6. **next.config.ts**
   - Removed Unsplash domain from `remotePatterns`
   - No longer need external image domain configuration

## Benefits of Local Images

✅ **No External Dependencies** - Works offline
✅ **Faster Loading** - No external network requests
✅ **Better Privacy** - No tracking from external domains
✅ **Consistent Performance** - Not affected by external service issues
✅ **Full Control** - Can optimize and customize images as needed

## Next Steps (Optional)

To further optimize your images, consider:

1. **Resize images** for different use cases (thumbnails, avatars, full-size)
2. **Compress images** to reduce file sizes while maintaining quality
3. **Generate multiple sizes** for responsive images
4. **Use next-gen formats** like AVIF for even better compression

## Image Optimization Tools

- **Sharp** - Node.js image processing library
- **Squoosh** - Web-based image optimizer (squoosh.app)
- **ImageMagick** - Command-line image manipulation
- Next.js built-in image optimization handles this automatically for you!
