# Auto-Repeat Extension Guide 🚀

## What's New - Auto-Repeat Mode!

Now the extension has **automatic repeat functionality** - click once to start, click again to stop!

## How It Works

### 🔥 Start Auto-Sending
1. Go to Claude AI or ChatGPT
2. Ask any question and wait for response
3. Click the blue button: **"🚀 Start Auto-Sending 'continue'"**
4. **Extension automatically repeats every 5 seconds!**

### ⏹️ Stop Auto-Sending  
1. Button changes to red: **"⏹️ Stop Auto-Sending"**
2. Click the red button to stop the automatic sending
3. Button returns to blue and ready to start again

## Button States

| Button Color | Text | Action |
|-------------|------|---------|
| 🔵 Blue | "🚀 Start Auto-Sending" | Click to START automatic sending |
| 🔴 Red | "⏹️ Stop Auto-Sending" | Click to STOP automatic sending |
| 🟡 Yellow | "⏳ Processing..." | Currently typing/sending (wait) |
| ⚫ Gray | "🔒 Extension Disabled" | Enable in popup first |

## Testing Steps

1. **Load Extension**: Reload extension in `brave://extensions/`
2. **Enable**: Click extension icon → toggle ON
3. **Go to Chat**: Open Claude AI or ChatGPT  
4. **Ask Question**: "Explain quantum physics"
5. **Wait for Response**: Let AI finish completely
6. **Start Auto**: Click blue "🚀 Start Auto-Sending" button
7. **Watch Magic**: Extension sends "continue" every 5 seconds automatically!
8. **Stop When Done**: Click red "⏹️ Stop Auto-Sending" button

## Timing

- **First Send**: Immediate when you click "Start"
- **Repeat Interval**: Every 5 seconds after that
- **Processing Delay**: 2 seconds between type and next send

## What You'll See

```
1. Click "Start" → Button turns red "Stop Auto-Sending"
2. Types "continue" → Sends automatically  
3. Waits 5 seconds → Types "continue" again
4. Repeats forever until you click "Stop"
5. Click "Stop" → Button turns blue "Start Auto-Sending"
```

## Console Messages
```
Auto Prompter: Starting auto-sending mode
Auto Prompter: Typed "continue"
Auto Prompter: Sent Enter key
Auto Prompter: Auto-sending next prompt
Auto Prompter: Typed "continue"
...continues every 5 seconds...
Auto Prompter: Stopping auto-sending mode
```

## Perfect for:
- Getting long detailed responses from Claude/ChatGPT
- Continuing stories or explanations
- Deep dives into topics
- Automatic content generation

**Just click once and let it run! Click again to stop! 🎯**
