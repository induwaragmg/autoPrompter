# Copilot Instructions for Auto Prompter Extension

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Brave browser extension built with TypeScript, React, and Webpack that automatically inputs custom prompts to ChatGPT-like chatbots.

## Key Technologies

- **Manifest V3** Chrome Extension APIs
- **TypeScript** for type safety
- **React** for UI components
- **Webpack** for building and bundling
- **Chrome Extension APIs** for browser integration

## Architecture

- `background/background.ts` - Service worker handling permissions, storage, and coordination
- `content/contentScript.ts` - Injected script that detects and interacts with chatbot interfaces
- `popup/` - Extension popup for quick settings and status
- `options/` - Full options page for detailed configuration

## Coding Guidelines

1. **Type Safety**: Always use proper TypeScript types, especially for Chrome extension APIs
2. **Error Handling**: Wrap Chrome API calls in try-catch blocks
3. **Permission Checks**: Always verify permissions before performing actions
4. **Site Compatibility**: Use flexible selectors that work across different chatbot platforms
5. **User Privacy**: Never collect or transmit user data; store everything locally

## Browser Extension Specifics

- Use `chrome.runtime.sendMessage()` for communication between scripts
- Store settings in `chrome.storage.sync` and session data in `chrome.storage.local`
- Content scripts must handle dynamic DOM changes with MutationObserver
- Background script manages permissions and enforces usage limits
- All user interactions require explicit permission

## DOM Interaction Patterns

- Use site-specific selectors for different chatbot platforms
- Wait for elements to be available before interacting
- Trigger proper events when setting input values
- Check element visibility before interaction
- Handle both textarea and contenteditable inputs

## Security Considerations

- Validate all user inputs
- Respect site CSP policies
- Use minimal required permissions
- Implement proper rate limiting
- Session-based permission model
