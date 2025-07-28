// Global type declarations for Chrome Extension APIs
declare global {
  namespace chrome {
    namespace runtime {
      function sendMessage(message: any, responseCallback?: (response: any) => void): void;
      const onMessage: {
        addListener(callback: (message: any, sender: any, sendResponse: (response: any) => void) => boolean | void): void;
      };
      interface MessageSender {
        tab?: chrome.tabs.Tab;
        frameId?: number;
        id?: string;
        url?: string;
        tlsChannelId?: string;
      }
    }
    
    namespace tabs {
      interface Tab {
        id?: number;
        url?: string;
        title?: string;
        active?: boolean;
      }
      
      function query(queryInfo: any, callback: (result: Tab[]) => void): void;
      function sendMessage(tabId: number, message: any): Promise<any>;
      
      const onUpdated: {
        addListener(callback: (tabId: number, changeInfo: any, tab: Tab) => void): void;
      };
    }
    
    namespace storage {
      namespace sync {
        function get(keys?: string | string[] | Record<string, any> | null): Promise<Record<string, any>>;
        function set(items: Record<string, any>): Promise<void>;
      }
      
      namespace local {
        function get(keys?: string | string[] | Record<string, any> | null): Promise<Record<string, any>>;
        function set(items: Record<string, any>): Promise<void>;
      }
    }
    
    namespace alarms {
      interface Alarm {
        name: string;
        scheduledTime: number;
        periodInMinutes?: number;
      }
      
      function create(name: string, alarmInfo: { periodInMinutes?: number }): void;
      
      const onAlarm: {
        addListener(callback: (alarm: Alarm) => void): void;
      };
    }
  }
}

export {};
