// Simple analytics tracking
// Can be extended to use Google Analytics, Plausible, or other services

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

const ANALYTICS_KEY = 'solana-workshop-analytics';

export function trackEvent(name: string, properties?: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  const event: AnalyticsEvent = {
    name,
    properties,
    timestamp: new Date(),
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', event);
  }

  // Store locally for now (can be sent to analytics service)
  try {
    const stored = localStorage.getItem(ANALYTICS_KEY);
    const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];
    events.push(event);
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.shift();
    }
    
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error tracking event:', error);
  }

  // Send to external analytics service (if configured)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', name, properties);
  }
}

// Predefined event trackers
export const analytics = {
  // Page views
  pageView: (path: string) => {
    trackEvent('page_view', { path });
  },

  // Module events
  moduleStarted: (moduleId: string) => {
    trackEvent('module_started', { module_id: moduleId });
  },

  moduleCompleted: (moduleId: string, timeSpent?: number) => {
    trackEvent('module_completed', { 
      module_id: moduleId,
      time_spent: timeSpent 
    });
  },

  // Wallet events
  walletConnected: (walletType: string) => {
    trackEvent('wallet_connected', { wallet_type: walletType });
  },

  walletDisconnected: () => {
    trackEvent('wallet_disconnected');
  },

  // AI Assistant events
  aiChatStarted: () => {
    trackEvent('ai_chat_started');
  },

  aiMessageSent: (messageLength: number) => {
    trackEvent('ai_message_sent', { message_length: messageLength });
  },

  aiSuggestedQuestionClicked: (question: string) => {
    trackEvent('ai_suggested_question', { question });
  },

  // Navigation events
  externalLinkClicked: (url: string) => {
    trackEvent('external_link_clicked', { url });
  },

  downloadStarted: (resource: string) => {
    trackEvent('download_started', { resource });
  },

  // Search events
  searchPerformed: (query: string) => {
    trackEvent('search_performed', { query });
  },

  // Error events
  errorOccurred: (error: string, context?: string) => {
    trackEvent('error_occurred', { error, context });
  },
};

// Get analytics summary
export function getAnalyticsSummary(): {
  totalEvents: number;
  eventsByType: Record<string, number>;
  recentEvents: AnalyticsEvent[];
} {
  if (typeof window === 'undefined') {
    return { totalEvents: 0, eventsByType: {}, recentEvents: [] };
  }

  try {
    const stored = localStorage.getItem(ANALYTICS_KEY);
    const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];

    const eventsByType: Record<string, number> = {};
    events.forEach(event => {
      eventsByType[event.name] = (eventsByType[event.name] || 0) + 1;
    });

    return {
      totalEvents: events.length,
      eventsByType,
      recentEvents: events.slice(-10).reverse(),
    };
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return { totalEvents: 0, eventsByType: {}, recentEvents: [] };
  }
}

// Clear analytics data
export function clearAnalytics(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ANALYTICS_KEY);
}
