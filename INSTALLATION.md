# Loading Extension in Brave Browser - Troubleshooting Guide

## Step-by-Step Instructions

1. **Build the Extension**
   - Run `npm run build` or double-click `dev-setup.bat`
   - Ensure build completes successfully

2. **Open Brave Extensions Page**
   - Open Brave browser
   - Type `brave://extensions/` in the address bar
   - Press Enter

3. **Enable Developer Mode**
   - Look for "Developer mode" toggle in the top-right corner
   - Click to enable it (should turn blue/enabled)

4. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to your project folder: `d:\lessons\autoPrompter`
   - Select the `dist` folder (not the root project folder)
   - Click "Select Folder" or "Open"

## Common Issues & Solutions

### "No manifest found" Error
- ✅ **FIXED**: Make sure you're selecting the `dist` folder, not the root project folder
- ✅ **FIXED**: Ensure the build completed successfully (`npm run build`)
- The manifest.json should be directly inside the `dist` folder

### Extension Won't Load
- Check that Developer mode is enabled
- Try refreshing the extensions page
- Look for any error messages in the extensions page

### Extension Loads But Doesn't Work
- Check the browser console for errors (F12)
- Verify you're on a supported website (ChatGPT, Claude, etc.)
- Make sure the extension is enabled in the popup

## Verification Steps

After loading, you should see:
1. "Auto Prompter" in your extensions list
2. Extension icon in the browser toolbar (may be in the extensions menu)
3. No error messages on the extensions page

## Testing the Extension

1. Click the extension icon to open the popup
2. Set a custom prompt (e.g., "continue")
3. Enable the extension
4. Go to https://chat.openai.com
5. Start a conversation and watch for automatic prompts

## Getting Help

If you're still having issues:
1. Check the browser console (F12) for error messages
2. Verify all files are in the `dist` folder
3. Try rebuilding with `npm run clean && npm run build`
