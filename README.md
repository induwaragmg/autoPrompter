# Auto Prompter Browser Extension

A Brave browser extension that automatically inputs custom prompts to ChatGPT-like chatbots with user permission and usage limits.

## Key Features

- ✅ **Smart Response Detection**: Waits for AI responses to complete before sending the next prompt
- 🔒 **User Permission Required**: Respects user privacy - requires explicit permission for each session
- ⏱️ **Time Limits**: Configurable session time limits (1-1440 minutes)
- 🔢 **Prompt Limits**: Configurable prompt count limits (1-100 per session)
- 🚀 **Auto Submit**: Optional automatic submission after entering prompts
- 🌐 **Multi-Site Support**: Works with ChatGPT, Claude, Bard, and other popular AI chatbots
- 🎯 **Intelligent Timing**: Detects when responses are complete using multiple indicators
- 📊 **Usage Tracking**: Real-time monitoring of session limits and usage
- 🛡️ **Safe Operation**: Built-in cooldowns and safety checks

## Supported Platforms

- **ChatGPT** (chat.openai.com)
- **Claude** (claude.ai, chat.anthropic.com)
- **Google Bard** (bard.google.com)
- **Poe** (poe.com)
- **You.com** (you.com)
- **Bing Chat** (chat.bing.com)
- **Custom Sites** (configurable in options)

## Installation

### Development Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Open Brave browser and navigate to `brave://extensions/`
5. Enable "Developer mode" in the top right
6. Click "Load unpacked" and select the `dist` folder

### Production Installation

1. Download the latest release from the releases page
2. Open Brave browser and navigate to `brave://extensions/`
3. Drag and drop the `.crx` file into the extensions page

## Usage

### Initial Setup

1. Click the Auto Prompter extension icon in the toolbar
2. Configure your custom prompt text (default: "continue")
3. Set your desired time and prompt limits
4. Enable the extension using the toggle switch

### Workflow

1. Navigate to a supported chatbot website
2. Start a conversation with the AI
3. The extension will automatically detect appropriate moments to send your custom prompt
4. Grant permission when prompted (once per session)
5. The extension will continue operating within your configured limits

### How Response Completion Detection Works

The extension uses multiple indicators to determine when an AI response is complete:

1. **Text Stability**: Monitors when response text stops changing
2. **UI Elements**: Looks for completion buttons (Copy, Regenerate, Edit)
3. **Sentence Completion**: Checks for proper sentence endings
4. **Streaming Indicators**: Ensures no active typing/loading indicators
5. **Timing**: Waits 3 seconds after text stabilizes before acting

### Workflow Example

1. Navigate to ChatGPT and start a conversation
2. Ask: "Explain quantum computing"
3. Extension waits for complete response
4. Automatically sends "continue" when response is finished
5. AI provides more detailed information
6. Process repeats within your configured limits

### Configuration Options

- **Custom Prompt**: The text to automatically send (e.g., "continue", "please elaborate", "tell me more")
- **Auto Submit**: Whether to automatically submit the prompt or just enter it
- **Time Limit**: Maximum session duration (1-1440 minutes)
- **Prompt Limit**: Maximum number of prompts per session (1-100)
- **Allowed Sites**: Websites where the extension can operate

## Development

### Scripts

- `npm run build` - Build the extension for production
- `npm run dev` - Build and watch for changes during development
- `npm run clean` - Clean the dist directory
- `npm run lint` - Run TypeScript and ESLint checks
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
src/
├── background/          # Background service worker
│   └── background.ts
├── content/            # Content scripts
│   └── contentScript.ts
├── popup/              # Extension popup
│   ├── popup.html
│   ├── popup.tsx
│   └── popup.css
├── options/            # Options page
│   ├── options.html
│   ├── options.tsx
│   └── options.css
├── assets/             # Icons and static assets
└── manifest.json       # Extension manifest
```

### Tech Stack

- **TypeScript** - Type-safe JavaScript
- **React** - UI framework for popup and options
- **Webpack** - Module bundler and build tool
- **Manifest V3** - Latest Chrome extension platform
- **Chrome Extension APIs** - Browser integration

## Privacy & Security

- **No Data Collection**: The extension does not collect or transmit any personal data
- **Local Storage Only**: All settings are stored locally in your browser
- **Permission-Based**: Requires explicit user permission for each session
- **Limited Scope**: Only operates on explicitly allowed websites
- **Session-Based**: All permissions and usage data reset when you navigate away

## Testing the Extension

### Loading the Extension in Brave

1. Build the extension: `npm run build`
2. Open Brave browser
3. Navigate to `brave://extensions/`
4. Enable "Developer mode" (toggle in top-right)
5. Click "Load unpacked"
6. Select the `dist` folder from this project
7. The extension should appear in your extensions list

### Testing Steps

1. **Basic Setup**:
   - Click the extension icon in the toolbar
   - Set your custom prompt (e.g., "continue", "tell me more")
   - Enable the extension using the toggle
   - Set reasonable limits (e.g., 5 prompts, 30 minutes)

2. **Test on ChatGPT**:
   - Go to `chat.openai.com`
   - Start a new conversation
   - Ask a question that might have a long response
   - Watch the extension wait for the response to complete
   - See it automatically send your custom prompt

3. **Verify Safety Features**:
   - Check that it respects your time/prompt limits
   - Confirm it asks for permission when limits are reached
   - Test the reset functionality in the popup

### Troubleshooting

### Extension Not Working

1. Ensure you're on a supported website
2. Check that the extension is enabled in the popup
3. Verify you haven't exceeded time or prompt limits
4. Try resetting the session in the popup

### Prompt Not Submitting

1. Check that "Auto Submit" is enabled in settings
2. Verify the chatbot interface is fully loaded
3. Some sites may require manual submission

### Response Not Completing Detection

1. The extension may be too sensitive - try increasing the `RESPONSE_COMPLETE_DELAY` in contentScript.ts
2. Some sites may use different completion indicators
3. Check browser console for any errors
4. Verify the site selectors are correct for the current website layout

### Manual Testing Commands

Use browser console on supported sites to test selectors:
```javascript
// Test input selector
document.querySelector('[data-id="root"] textarea')

// Test message selector  
document.querySelectorAll('[data-message-author-role="assistant"]')

// Test completion indicators
document.querySelector('button[aria-label*="Copy"]')
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Submit a pull request with a clear description

## License

MIT License - see LICENSE file for details

## Changelog

### Version 1.0.0
- Initial release
- Support for major AI chatbot platforms
- Configurable prompts and limits
- User permission system
- Session-based usage tracking
