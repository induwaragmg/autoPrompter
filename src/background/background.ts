// Background service worker for Auto Prompter extension

interface UserSettings {
  customPrompt: string;
  isEnabled: boolean;
  timeLimit: number; // in minutes
  promptLimit: number; // number of prompts
  autoSubmit: boolean;
  allowedSites: string[];
}

interface UsageData {
  lastUsed: number;
  promptCount: number;
  sessionStartTime: number;
}

class AutoPrompterBackground {
  private defaultSettings: UserSettings = {
    customPrompt: "continue",
    isEnabled: false,
    timeLimit: 60, // 1 hour
    promptLimit: 10,
    autoSubmit: true,
    allowedSites: [
      "https://chat.openai.com",
      "https://bard.google.com", 
      "https://claude.ai",
      "https://chat.anthropic.com",
      "https://poe.com",
      "https://you.com",
      "https://chat.bing.com"
    ]
  };

  constructor() {
    this.initializeExtension();
    this.setupEventListeners();
  }

  private async initializeExtension(): Promise<void> {
    // Initialize default settings if not exists
    const settings = await this.getSettings();
    if (!settings) {
      await this.saveSettings(this.defaultSettings);
    }

    // Initialize usage data
    const usageData = await this.getUsageData();
    if (!usageData) {
      await this.resetUsageData();
    }
  }

  private setupEventListeners(): void {
    // Listen for messages from content scripts and popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async response
    });

    // Listen for tab updates to reset session when navigating away
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.handleTabUpdate(tab.url);
      }
    });

    // Set up alarm for time limit checks
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'checkTimeLimit') {
        this.checkTimeLimit();
      }
    });

    // Create recurring alarm to check time limits
    chrome.alarms.create('checkTimeLimit', { periodInMinutes: 1 });
  }

  private async handleMessage(
    message: any, 
    sender: any, 
    sendResponse: (response: any) => void
  ): Promise<void> {
    try {
      switch (message.action) {
        case 'getSettings':
          const settings = await this.getSettings();
          sendResponse({ success: true, data: settings });
          break;

        case 'saveSettings':
          await this.saveSettings(message.settings);
          sendResponse({ success: true });
          break;

        case 'checkPermission':
          const canUse = await this.checkUsagePermission();
          sendResponse({ success: true, canUse });
          break;

        case 'recordUsage':
          await this.recordPromptUsage();
          sendResponse({ success: true });
          break;

        case 'getUsageData':
          const usageData = await this.getUsageData();
          sendResponse({ success: true, data: usageData });
          break;

        case 'resetUsage':
          await this.resetUsageData();
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background script error:', error);
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  private async handleTabUpdate(url: string): Promise<void> {
    const settings = await this.getSettings();
    if (!settings?.isEnabled) return;

    // Check if user navigated away from allowed chatbot sites
    const isAllowedSite = settings.allowedSites.some(site => url.startsWith(site));
    if (!isAllowedSite) {
      // Reset session when leaving chatbot sites
      await this.resetUsageData();
    }
  }

  private async checkTimeLimit(): Promise<void> {
    const settings = await this.getSettings();
    const usageData = await this.getUsageData();
    
    if (!settings?.isEnabled || !usageData) return;

    const currentTime = Date.now();
    const sessionDuration = currentTime - usageData.sessionStartTime;
    const timeLimitMs = settings.timeLimit * 60 * 1000;

    if (sessionDuration >= timeLimitMs) {
      // Time limit exceeded, disable extension for this session
      await this.saveSettings({ ...settings, isEnabled: false });
      
      // Notify content scripts
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, { 
              action: 'timeLimitExceeded' 
            }).catch(() => {
              // Ignore errors for tabs without content script
            });
          }
        });
      });
    }
  }

  private async checkUsagePermission(): Promise<boolean> {
    const settings = await this.getSettings();
    const usageData = await this.getUsageData();

    if (!settings?.isEnabled) return false;
    if (!usageData) return false;

    // Check prompt count limit
    if (usageData.promptCount >= settings.promptLimit) {
      return false;
    }

    // Check time limit
    const currentTime = Date.now();
    const sessionDuration = currentTime - usageData.sessionStartTime;
    const timeLimitMs = settings.timeLimit * 60 * 1000;

    if (sessionDuration >= timeLimitMs) {
      return false;
    }

    return true;
  }

  private async recordPromptUsage(): Promise<void> {
    const usageData = await this.getUsageData();
    if (!usageData) return;

    const updatedUsage: UsageData = {
      ...usageData,
      promptCount: usageData.promptCount + 1,
      lastUsed: Date.now()
    };

    await chrome.storage.local.set({ usageData: updatedUsage });
  }

  private async getSettings(): Promise<UserSettings | null> {
    const result = await chrome.storage.sync.get(['settings']);
    return result.settings || null;
  }

  private async saveSettings(settings: UserSettings): Promise<void> {
    await chrome.storage.sync.set({ settings });
  }

  private async getUsageData(): Promise<UsageData | null> {
    const result = await chrome.storage.local.get(['usageData']);
    return result.usageData || null;
  }

  private async resetUsageData(): Promise<void> {
    const usageData: UsageData = {
      lastUsed: 0,
      promptCount: 0,
      sessionStartTime: Date.now()
    };
    await chrome.storage.local.set({ usageData });
  }
}

// Initialize the background script
new AutoPrompterBackground();
