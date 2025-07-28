import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './popup.css';

interface UserSettings {
  customPrompt: string;
  isEnabled: boolean;
  timeLimit: number;
  promptLimit: number;
  autoSubmit: boolean;
  allowedSites: string[];
}

interface UsageData {
  lastUsed: number;
  promptCount: number;
  sessionStartTime: number;
}

const PopupApp: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    customPrompt: 'continue',
    isEnabled: false,
    timeLimit: 60,
    promptLimit: 10,
    autoSubmit: true,
    allowedSites: []
  });
  
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
    loadUsageData();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await sendMessageToBackground({ action: 'getSettings' });
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsageData = async () => {
    try {
      const response = await sendMessageToBackground({ action: 'getUsageData' });
      if (response.success && response.data) {
        setUsageData(response.data);
      }
    } catch (error) {
      console.error('Failed to load usage data:', error);
    }
  };

  const saveSettings = async (newSettings: UserSettings) => {
    setSaving(true);
    try {
      const response = await sendMessageToBackground({ 
        action: 'saveSettings', 
        settings: newSettings 
      });
      if (response.success) {
        setSettings(newSettings);
        // Notify content scripts of settings update
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            if (tab.id) {
              chrome.tabs.sendMessage(tab.id, { action: 'settingsUpdated' }).catch(() => {
                // Ignore errors for tabs without content script
              });
            }
          });
        });
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetUsage = async () => {
    try {
      await sendMessageToBackground({ action: 'resetUsage' });
      await loadUsageData();
    } catch (error) {
      console.error('Failed to reset usage:', error);
    }
  };

  const sendMessageToBackground = (message: any): Promise<any> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        resolve(response || { success: false });
      });
    });
  };

  const handleToggleEnabled = () => {
    const newSettings = { ...settings, isEnabled: !settings.isEnabled };
    saveSettings(newSettings);
  };

  const handlePromptChange = (value: string) => {
    const newSettings = { ...settings, customPrompt: value };
    setSettings(newSettings);
  };

  const handlePromptBlur = () => {
    saveSettings(settings);
  };

  const handleTimeLimitChange = (value: number) => {
    const newSettings = { ...settings, timeLimit: value };
    saveSettings(newSettings);
  };

  const handlePromptLimitChange = (value: number) => {
    const newSettings = { ...settings, promptLimit: value };
    saveSettings(newSettings);
  };

  const handleAutoSubmitToggle = () => {
    const newSettings = { ...settings, autoSubmit: !settings.autoSubmit };
    saveSettings(newSettings);
  };

  const formatTimeRemaining = () => {
    if (!usageData) return 'N/A';
    
    const sessionDuration = Date.now() - usageData.sessionStartTime;
    const timeLimitMs = settings.timeLimit * 60 * 1000;
    const remaining = timeLimitMs - sessionDuration;
    
    if (remaining <= 0) return 'Expired';
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPromptsRemaining = () => {
    if (!usageData) return settings.promptLimit;
    return Math.max(0, settings.promptLimit - usageData.promptCount);
  };

  if (loading) {
    return (
      <div className="popup-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <div className="header">
        <h1>🤖 Auto Prompter</h1>
        <p>Automatically input prompts to chatbots</p>
      </div>

      <div className="section">
        <div className="toggle-container">
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.isEnabled}
              onChange={handleToggleEnabled}
              disabled={saving}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">
            {settings.isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      <div className="section">
        <label className="field-label">Custom Prompt</label>
        <input
          type="text"
          value={settings.customPrompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          onBlur={handlePromptBlur}
          placeholder="Enter your custom prompt..."
          className="text-input"
          disabled={saving}
        />
        <small>This text will be automatically entered in chat inputs</small>
      </div>

      <div className="section">
        <label className="field-label">Auto Submit</label>
        <div className="toggle-container">
          <label className="toggle small">
            <input
              type="checkbox"
              checked={settings.autoSubmit}
              onChange={handleAutoSubmitToggle}
              disabled={saving}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">
            {settings.autoSubmit ? 'Yes' : 'No'}
          </span>
        </div>
        <small>Automatically submit the prompt after entering it</small>
      </div>

      <div className="section">
        <label className="field-label">Time Limit (minutes)</label>
        <input
          type="number"
          value={settings.timeLimit}
          onChange={(e) => handleTimeLimitChange(parseInt(e.target.value) || 60)}
          min="1"
          max="1440"
          className="number-input"
          disabled={saving}
        />
        <small>Maximum time the extension can run per session</small>
      </div>

      <div className="section">
        <label className="field-label">Prompt Limit</label>
        <input
          type="number"
          value={settings.promptLimit}
          onChange={(e) => handlePromptLimitChange(parseInt(e.target.value) || 10)}
          min="1"
          max="100"
          className="number-input"
          disabled={saving}
        />
        <small>Maximum number of prompts per session</small>
      </div>

      <div className="section usage-section">
        <h3>Current Session</h3>
        <div className="usage-grid">
          <div className="usage-item">
            <span className="usage-label">Time Remaining:</span>
            <span className="usage-value">{formatTimeRemaining()}</span>
          </div>
          <div className="usage-item">
            <span className="usage-label">Prompts Remaining:</span>
            <span className="usage-value">{getPromptsRemaining()}</span>
          </div>
        </div>
        <button 
          onClick={resetUsage}
          className="reset-button"
          disabled={saving}
        >
          Reset Session
        </button>
      </div>

      <div className="section">
        <small className="disclaimer">
          This extension works on ChatGPT, Claude, Bard, and other supported chatbot websites.
          You must grant permission once per workflow session.
        </small>
      </div>

      {saving && (
        <div className="saving-indicator">
          Saving...
        </div>
      )}
    </div>
  );
};

// Mount the React app
const container = document.getElementById('popup-root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<PopupApp />);
}
