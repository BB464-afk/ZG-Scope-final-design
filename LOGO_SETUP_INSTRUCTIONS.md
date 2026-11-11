# Logo Setup Instructions

## ✅ Code Changes Complete

All code files have been updated to use the correct paths for logos in the `/public` folder.

## 📁 Required Action: Move Logo Files

**You need to manually move these 2 files:**

### FROM (current location):
```
/ZGP_Logo_vivid_orange.png
/ZGP_Signet_vivid_orange.png
```

### TO (new location):
```
/public/ZGP_Logo_vivid_orange.png
/public/ZGP_Signet_vivid_orange.png
```

## 🔧 Steps to Complete:

1. **Copy** (don't delete yet) both logo files from the root directory
2. **Paste** them into the `/public` folder
3. **Test** the application - logos should now render properly
4. **Delete** the old logo files from the root directory (optional cleanup)

## ✓ What Will Work After Moving Files:

- ✅ Splash screen logo
- ✅ Login screen logo  
- ✅ Global Settings sidebar - expanded (full logo)
- ✅ Global Settings sidebar - collapsed (signet icon)
- ✅ Project sidebar - expanded (full logo)
- ✅ Project sidebar - collapsed (signet icon)

## 🌐 Portability

Once the logos are in `/public`, the application will work correctly on any PC when you:
- Share the project folder
- Deploy to a server
- Run in development mode
- Build for production

The `/public` folder is the standard location for static assets in Vite projects.
