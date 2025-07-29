// Content script for Auto Prompter extension
// Simple auto-clicker: User clicks button, types keyword, sends, repeats

class AutoPrompterContent {
  private isEnabled = false;
  private currentPrompt = 'continue';
  private isProcessing = false;
  private triggerButton: HTMLElement | null = null;
  private isAutoRunning = false;
  private autoInterval: number | null = null;
  private readonly AUTO_DELAY = 5000; // Wait 5 seconds between auto-sends

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    console.log('Auto Prompter: Content script loaded');
    
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      setTimeout(() => this.setup(), 1000);
    }

    // Listen for messages from background/popup
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
        this.handleMessage(message, sendResponse);
        return true;
      });
    }
  }

  private async setup(): Promise<void> {
    await this.updateSettings();
    this.createTriggerButton();
  }

  private async updateSettings(): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        const response = await this.sendMessageToBackground({ action: 'getSettings' });
        if (response.success && response.data) {
          this.isEnabled = response.data.isEnabled;
          this.currentPrompt = response.data.customPrompt || 'continue';
        }
      }
    } catch (error) {
      console.log('Auto Prompter: Using default settings');
    }
  }

  private handleMessage(message: any, sendResponse: any): void {
    switch (message.action) {
      case 'settingsUpdated':
        this.updateSettings();
        this.updateButtonState();
        sendResponse({ success: true });
        break;
      default:
        sendResponse({ success: false });
    }
  }

  private createTriggerButton(): void {
    // Remove existing button if any
    if (this.triggerButton) {
      this.triggerButton.remove();
    }

    // Create floating button
    this.triggerButton = document.createElement('div');
    this.triggerButton.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: #667eea;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        user-select: none;
        transition: all 0.2s ease;
      " id="auto-prompter-btn">
        🤖 Send "${this.currentPrompt}"
      </div>
    `;

    document.body.appendChild(this.triggerButton);

    // Add click handler
    const button = this.triggerButton.querySelector('#auto-prompter-btn') as HTMLElement;
    button.addEventListener('click', () => this.onButtonClick());
    button.addEventListener('mouseenter', () => {
      button.style.background = '#5a6fd8';
      button.style.transform = 'scale(1.05)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.background = this.isProcessing ? '#95a5a6' : '#667eea';
      button.style.transform = 'scale(1)';
    });

    this.updateButtonState();
  }

  private updateButtonState(): void {
    const button = this.triggerButton?.querySelector('#auto-prompter-btn') as HTMLElement;
    if (!button) return;

    if (!this.isEnabled) {
      button.style.background = '#95a5a6';
      button.style.cursor = 'not-allowed';
      button.innerHTML = '🔒 Extension Disabled';
    } else if (this.isAutoRunning) {
      button.style.background = '#e74c3c';
      button.style.cursor = 'pointer';
      button.innerHTML = '⏹️ Stop Auto-Sending';
    } else if (this.isProcessing) {
      button.style.background = '#f39c12';
      button.style.cursor = 'wait';
      button.innerHTML = '⏳ Processing...';
    } else {
      button.style.background = '#667eea';
      button.style.cursor = 'pointer';
      button.innerHTML = `🚀 Start Auto-Sending "${this.currentPrompt}"`;
    }
  }

  private async onButtonClick(): Promise<void> {
    if (!this.isEnabled || this.isProcessing) return;

    console.log('Auto Prompter: Button clicked');
    
    if (this.isAutoRunning) {
      // Stop auto-sending
      this.stopAutoSending();
    } else {
      // Start auto-sending
      this.startAutoSending();
    }
  }

  private startAutoSending(): void {
    console.log('Auto Prompter: Starting auto-sending mode');
    this.isAutoRunning = true;
    this.updateButtonState();
    
    // Send first prompt immediately
    this.sendPrompt();
    
    // Set up interval for repeated sending
    this.autoInterval = window.setInterval(() => {
      if (this.isAutoRunning && !this.isProcessing) {
        console.log('Auto Prompter: Auto-sending next prompt');
        this.sendPrompt();
      }
    }, this.AUTO_DELAY);
  }

  private stopAutoSending(): void {
    console.log('Auto Prompter: Stopping auto-sending mode');
    this.isAutoRunning = false;
    
    if (this.autoInterval) {
      clearInterval(this.autoInterval);
      this.autoInterval = null;
    }
    
    this.updateButtonState();
  }

  private async sendPrompt(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.updateButtonState();

    try {
      // Find input element
      const inputElement = this.findInputElement();
      if (!inputElement) {
        console.log('Auto Prompter: Input element not found');
        this.showNotification('❌ Chat input not found');
        return;
      }

      // Check if input is available (not disabled)
      if (!this.isInputAvailable(inputElement)) {
        console.log('Auto Prompter: Input not available');
        this.showNotification('⏳ Wait for chat to be ready');
        return;
      }

      // Type the prompt
      this.setInputValue(inputElement, this.currentPrompt);
      this.triggerInputEvents(inputElement);

      console.log(`Auto Prompter: Typed "${this.currentPrompt}"`);

      // Submit with Enter key
      setTimeout(() => {
        this.submitWithEnter(inputElement);
        
        // Wait a bit then enable button again
        setTimeout(() => {
          this.isProcessing = false;
          this.updateButtonState();
        }, 2000);
      }, 300);

      // Record usage
      try {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
          await this.sendMessageToBackground({ action: 'recordUsage' });
        }
      } catch (error) {
        console.log('Auto Prompter: Could not record usage');
      }

    } catch (error) {
      console.error('Auto Prompter: Failed to send prompt', error);
      this.isProcessing = false;
      this.updateButtonState();
    }
  }

  private findInputElement(): HTMLElement | null {
    // Try ChatGPT specific selectors first, then general ones
    const selectors = [
      'textarea[data-id]',
      '#prompt-textarea', 
      '[data-testid="textbox"]',
      'textarea[placeholder*="Message"]',
      '[contenteditable="true"][role="textbox"]',
      'textarea',
      '[contenteditable="true"]'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element && this.isElementVisible(element)) {
        console.log(`Auto Prompter: Found input with selector: ${selector}`);
        return element;
      }
    }

    console.log('Auto Prompter: No input element found');
    return null;
  }

  private isInputAvailable(element: HTMLElement): boolean {
    // Check if input is not disabled and visible
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return !element.disabled && !element.readOnly;
    }
    return true; // For contenteditable elements
  }

  private isElementVisible(element: Element): boolean {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && 
           style.visibility !== 'hidden' && 
           style.display !== 'none';
  }

  private setInputValue(element: HTMLElement, value: string): void {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      // Use native setter for React compatibility
      const proto = Object.getPrototypeOf(element);
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(element, value);
      } else {
        element.value = value;
      }
    } else if (element.contentEditable === 'true') {
      element.textContent = value;
      element.innerText = value;
    }
  }

  private triggerInputEvents(element: HTMLElement): void {
    // Focus first
    element.focus();
    // Input event (for React)
    const inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);
    // Change event
    const changeEvent = new Event('change', { bubbles: true });
    element.dispatchEvent(changeEvent);
    // Keydown/keyup for Enter (simulate typing)
    const keydownEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(keydownEvent);
    const keyupEvent = new KeyboardEvent('keyup', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(keyupEvent);
  }

  private submitWithEnter(element: HTMLElement): void {
    // Focus the element first
    element.focus();
    // For ChatGPT, trigger keydown, keyup, and input events
    const keydownEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(keydownEvent);
    const keyupEvent = new KeyboardEvent('keyup', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(keyupEvent);
    // Also dispatch input event for React
    const inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);
    console.log('Auto Prompter: Sent Enter key and input events');
  }

  private showNotification(message: string): void {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      z-index: 10001;
      font-family: Arial, sans-serif;
      font-size: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  private async sendMessageToBackground(message: any): Promise<any> {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage(message, (response: any) => {
          resolve(response || { success: false });
        });
      } else {
        resolve({ success: false });
      }
    });
  }

  public destroy(): void {
    if (this.triggerButton) {
      this.triggerButton.remove();
      this.triggerButton = null;
    }
    
    // Stop auto-sending if active
    if (this.autoInterval) {
      clearInterval(this.autoInterval);
      this.autoInterval = null;
    }
    
    this.isAutoRunning = false;
  }
}

// Initialize content script
const autoPrompter = new AutoPrompterContent();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  autoPrompter.destroy();
});
