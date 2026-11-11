# Logo Files Setup Instructions

This folder must contain three logo files for production deployment:

## Required Files:

### 1. logo-white-full.png
- **Usage**: Splash screen
- **Description**: White full Zauner Group logo with text
- **Source**: figma:asset/301df62b877908e9d6546f9de811b1ad0d6e9602.png
- **Background**: Dark background (splash screen uses dark gradient)
- **Recommended Size**: High resolution, transparent background

### 2. logo-orange-full.png
- **Usage**: Login screen and expanded sidebar
- **Description**: Orange full Zauner Group logo with "ZAUNER GROUP" text
- **Source**: figma:asset/7bd44ae2f33161aa0a1d56b560d98e3e79b83ecd.png
- **Background**: Light/white backgrounds
- **Recommended Size**: ~180px width for sidebar display

### 3. logo-icon-orange.png
- **Usage**: Collapsed sidebar
- **Description**: Orange ZG symbol icon only (no text)
- **Source**: figma:asset/fd020daddac9cea4234c91c89e8461789bc7bb8a.png  
- **Background**: Light/white backgrounds
- **Recommended Size**: Square icon, ~40-48px

## Deployment Checklist:

- [ ] All three logo files are present in /public folder
- [ ] Files are named exactly as specified above
- [ ] Images are optimized for web (compressed PNG)
- [ ] Images have transparent backgrounds where appropriate
- [ ] Test all logo displays: Splash, Login, Sidebar (expanded), Sidebar (collapsed)

## Implementation:

The application uses the centralized Logo component (`/src/app/components/Logo.tsx`) which:
- References logos from /public folder using absolute paths
- Includes error handling and fallback displays
- Works consistently across all environments

DO NOT use figma:asset references in production code.
