# Simple Auto-Clicker Test Guide

## What Changed
- **No automatic detection** - removes complex logic that wasn't working
- **Manual button trigger** - you click when you want to send the prompt
- **Simple auto-clicker** - just types and sends, no waiting for responses
- **Floating button** - appears on ChatGPT page for easy access

## How to Test

### 1. Load Extension
```
1. Open Brave browser
2. Go to brave://extensions/
3. Make sure "Developer mode" is ON (top right toggle)
4. Click "Load unpacked"
5. Select the 'dist' folder from your project
```

### 2. Enable Extension
```
1. Click the extension icon in the toolbar (🧩 puzzle piece)
2. Click on "Auto Prompter" 
3. Toggle "Enable Auto Prompter" to ON
4. Close the popup
```

### 3. Test on ChatGPT
```
1. Go to https://chatgpt.com
2. You should see a blue floating button in top-right: "🤖 Send 'continue'"
3. Ask ChatGPT any question: "Explain artificial intelligence"
4. Wait for ChatGPT to finish responding
5. Click the blue "🤖 Send 'continue'" button
6. Watch it type "continue" and press Enter automatically
7. ChatGPT should respond with more content
8. Click the button again to send "continue" again
```

## Expected Behavior

### ✅ What Should Work:
- Blue button appears on ChatGPT page
- Button shows current keyword ("continue" by default)
- Click button → types "continue" → sends automatically
- Button temporarily shows "Processing..." during action
- Can click again after 2 seconds to repeat

### ❌ What Won't Work:
- Button grayed out = extension is disabled in popup
- "Chat input not found" = couldn't find the text input
- "Wait for chat to be ready" = input is disabled/busy

## Troubleshooting

### If button doesn't appear:
1. Check console for errors (F12 → Console)
2. Refresh the ChatGPT page
3. Make sure extension is enabled in popup

### If button doesn't type:
1. Click in the ChatGPT input box first
2. Make sure the input isn't disabled
3. Check browser console for error messages

### If nothing happens:
1. Open browser console (F12)
2. Look for "Auto Prompter:" messages
3. Report any red error messages

## Console Messages
You should see:
```
Auto Prompter: Content script loaded
Auto Prompter: Found input with selector: textarea[data-id]
Auto Prompter: Button clicked
Auto Prompter: Typed "continue"
Auto Prompter: Sent Enter key
```

## Quick Debug
Open console (F12) and run:
```javascript
// Check if extension loaded
console.log(document.querySelector('#auto-prompter-btn'));

// Check if input found
console.log(document.querySelector('textarea[data-id]'));
```

This is much simpler - just click the button when you want to send the prompt!
