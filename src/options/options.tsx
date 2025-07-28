import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './options.css';

interface UserSettings {
  customPrompt: string;
  isEnabled: boolean;
  timeLimit: number;
  promptLimit: number;
  autoSubmit: boolean;
  allowedSites: string[];
}

const OptionsApp: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    customPrompt: 'continue',
    isEnabled: false,
    timeLimit: 60,
    promptLimit: 10,
    autoSubmit: true,
    allowedSites: [
      'https://chat.openai.com',
      'https://bard.google.com',
      'https://claude.ai',
      'https://chat.anthropic.com',
      'https://poe.com',
      'https://you.com',
      'https://chat.bing.com'
    ]
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSite, setNewSite] = useState('');

  useEffect(() => {
    loadSettings();
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

  const saveSettings = async (newSettings: UserSettings) => {
    setSaving(true);
    try {
      const response = await sendMessageToBackground({ 
        action: 'saveSettings', 
        settings: newSettings 
      });
      if (response.success) {
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const sendMessageToBackground = (message: any): Promise<any> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        resolve(response || { success: false });
      });
    });
  };

  const handleAddSite = () => {
    if (newSite.trim() && !settings.allowedSites.includes(newSite.trim())) {
      const updatedSettings = {
        ...settings,
        allowedSites: [...settings.allowedSites, newSite.trim()]
      };
      saveSettings(updatedSettings);
      setNewSite('');
    }
  };

  const handleRemoveSite = (siteToRemove: string) => {
    const updatedSettings = {
      ...settings,
      allowedSites: settings.allowedSites.filter(site => site !== siteToRemove)
    };
    saveSettings(updatedSettings);
  };

  const handleInputChange = (field: keyof UserSettings, value: any) => {
    const updatedSettings = { ...settings, [field]: value };
    setSettings(updatedSettings);
  };

  const handleSaveChanges = () => {
    saveSettings(settings);
  };

  if (loading) {
    return (
      <div className="options-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="options-container">
      <div className="header">
        <h1>🤖 Auto Prompter Options</h1>
        <p>Configure advanced settings for automatic prompt injection</p>
      </div>

      <div className="content">
        <div className="section">
          <h2>Basic Settings</h2>
          
          <div className="field">
            <label>Custom Prompt Text</label>
            <input
              type="text"
              value={settings.customPrompt}
              onChange={(e) => handleInputChange('customPrompt', e.target.value)}
              placeholder="Enter your custom prompt..."
              className="text-input"
            />
            <small>This text will be automatically entered in chat inputs</small>
          </div>

          <div className="field">
            <label>Time Limit (minutes)</label>
            <input
              type="number"
              value={settings.timeLimit}
              onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 60)}
              min="1"
              max="1440"
              className="number-input"
            />
            <small>Maximum time the extension can run per session (1-1440 minutes)</small>
          </div>

          <div className="field">
            <label>Prompt Limit</label>
            <input
              type="number"
              value={settings.promptLimit}
              onChange={(e) => handleInputChange('promptLimit', parseInt(e.target.value) || 10)}
              min="1"
              max="100"
              className="number-input"
            />
            <small>Maximum number of prompts per session (1-100)</small>
          </div>

          <div className="field checkbox-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.autoSubmit}
                onChange={(e) => handleInputChange('autoSubmit', e.target.checked)}
              />
              <span className="checkmark"></span>
              Auto Submit Prompts
            </label>
            <small>Automatically submit the prompt after entering it</small>
          </div>
        </div>

        <div className="section">
          <h2>Allowed Websites</h2>
          <p>Manage which websites the extension can operate on:</p>
          
          <div className="sites-list">
            {settings.allowedSites.map((site, index) => (
              <div key={index} className="site-item">
                <span className="site-url">{site}</span>
                <button
                  onClick={() => handleRemoveSite(site)}
                  className="remove-button"
                  disabled={saving}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="add-site">
            <input
              type="url"
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              placeholder="https://example.com"
              className="text-input"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSite()}
            />
            <button
              onClick={handleAddSite}
              className="add-button"
              disabled={!newSite.trim() || saving}
            >
              Add Site
            </button>
          </div>
        </div>

        <div className="section">
          <h2>Usage Guidelines</h2>
          <div className="guidelines">
            <div className="guideline">
              <h4>🔒 Permission Required</h4>
              <p>You must grant permission once for each workflow session. The extension respects your privacy and only operates when explicitly allowed.</p>
            </div>
            
            <div className="guideline">
              <h4>⏱️ Time Limits</h4>
              <p>Sessions automatically expire after the configured time limit to prevent excessive automation.</p>
            </div>
            
            <div className="guideline">
              <h4>🔢 Prompt Limits</h4>
              <p>A maximum number of prompts can be sent per session to maintain reasonable usage.</p>
            </div>
            
            <div className="guideline">
              <h4>🌐 Supported Sites</h4>
              <p>Works with ChatGPT, Claude, Bard, and other popular AI chatbots. Custom sites can be added above.</p>
            </div>
          </div>
        </div>

        <div className="actions">
          <button
            onClick={handleSaveChanges}
            className="save-button"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Mount the React app
const container = document.getElementById('options-root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<OptionsApp />);
}
