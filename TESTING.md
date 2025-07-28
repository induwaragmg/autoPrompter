# Testing the Auto Prompter Extension

## Quick Test Steps

1. **Load the Extension**
   - Make sure the extension is loaded in `brave://extensions/`
   - Ensure "Auto Prompter" appears in your extensions list

2. **Configure the Extension**
   - Click the extension icon in the toolbar
   - Set custom prompt to "continue" or "tell me more"
   - Enable the extension (toggle should be ON)
   - Set limits (e.g., 5 prompts, 30 minutes)

3. **Test on ChatGPT**
   - Go to https://chat.openai.com
   - Start a new chat
   - Ask a question that would have a long response, like:
     - "Explain artificial intelligence in detail"
     - "Tell me about the history of computers"
   - Wait for ChatGPT to finish responding
   - **The extension should automatically type your keyword and send it**

## What to Look For

✅ **Extension working correctly:**
- After ChatGPT finishes a response, you'll see your keyword appear in the input box
- The keyword gets automatically sent
- ChatGPT responds with more information
- Process repeats until you hit your limits

❌ **Extension not working:**
- Nothing happens after ChatGPT responds
- Input box stays empty
- No automatic typing occurs

## Debugging Steps

1. **Check Browser Console**
   - Press F12 to open developer tools
   - Go to "Console" tab
   - Look for messages starting with "Auto Prompter:"
   - Should see logs like: "Auto Prompter: Content script loaded"

2. **Check Extension Status**
   - Click the extension icon
   - Verify it shows "Enabled"
   - Check remaining prompts/time

3. **Manual Test**
   - Try typing manually in ChatGPT to ensure the input works
   - Check if the extension popup opens correctly

## Common Issues

**Issue: Nothing happens**
- Solution: Make sure you clicked "Enable" in the extension popup

**Issue: Types but doesn't send**
- Solution: Check "Auto Submit" is enabled in settings

**Issue: Only works once**
- Solution: Check your prompt limits aren't set too low

## Expected Behavior

1. You ask ChatGPT a question
2. ChatGPT responds completely
3. Extension waits 2-3 seconds
4. Extension types your keyword (e.g., "continue")
5. Extension presses Enter to send
6. ChatGPT responds with more information
7. Process repeats until limits reached

The extension is now much simpler and should work reliably!
