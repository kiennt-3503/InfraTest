// src/client/src/utils/tab-manager.ts

const TAB_ID_KEY = 'TAB_ID';
const TAB_VISIBILITY_KEY = 'TAB_VISIBILITY_';
const ACTIVE_PATH_KEY = 'ACTIVE_TAB_PATH';
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface TabStatus {
  visibilityState: string;
  updatedAt: number;
}

/**
 * Generate or retrieve a unique tab ID from sessionStorage.
 */
export const getOrCreateTabId = (): string => {
  let tabId = sessionStorage.getItem(TAB_ID_KEY);
  if (!tabId) {
    try {
      tabId = crypto.randomUUID();
    } catch {
      tabId = Math.random().toString(36).slice(2) + Date.now();
    }
    sessionStorage.setItem(TAB_ID_KEY, tabId);
  }
  return tabId;
};

const tabId = getOrCreateTabId();

/**
 * Update tab visibility and path status.
 */
const updateTabStatus = () => {
  const isVisible = document.visibilityState === 'visible';
  const currentPath = window.location.pathname + window.location.search;
  const tabStatus: TabStatus = {
    visibilityState: isVisible ? 'visible' : 'hidden',
    updatedAt: Date.now(),
  };

  localStorage.setItem(`${TAB_VISIBILITY_KEY}${tabId}`, JSON.stringify(tabStatus));
  if (isVisible) {
    localStorage.setItem(ACTIVE_PATH_KEY, currentPath);
  }
};

/**
 * Get IDs of currently visible tabs.
 */
export const getActiveTabs = (): string[] => {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith(TAB_VISIBILITY_KEY))
    .filter((key) => {
      const value = localStorage.getItem(key);
      if (!value) return false;
      try {
        const status: TabStatus = JSON.parse(value);
        return status.visibilityState === 'visible';
      } catch {
        return false;
      }
    })
    .map((key) => key.replace(TAB_VISIBILITY_KEY, ''));
};

/**
 * Get the current active path if at least one tab is visible.
 */
export const getCurrentActivePath = (): string | null => {
  const activeTabs = getActiveTabs();
  if (activeTabs.length > 0) {
    const path = localStorage.getItem(ACTIVE_PATH_KEY);
    return typeof path === 'string' ? path : null;
  }
  return null;
};

/**
 * Remove tab status from localStorage when tab is closed.
 */
window.addEventListener('beforeunload', () => {
  localStorage.removeItem(`${TAB_VISIBILITY_KEY}${tabId}`);
  const remainingTabs = getActiveTabs();
  if (remainingTabs.length === 0) {
    localStorage.removeItem(ACTIVE_PATH_KEY);
  }
});

/**
 * Listen for visibility changes.
 */
document.addEventListener('visibilitychange', updateTabStatus);

/**
 * Listen for path changes (popstate only; pushstate is not a standard event).
 * If using a router, call updateTabStatus() after navigation.
 */
window.addEventListener('popstate', updateTabStatus);

// Override pushState and replaceState to update tab status on navigation.
// This is necessary because these methods do not trigger popstate events.
const originalPushState = window.history.pushState;
const originalReplaceState = window.history.replaceState;

window.history.pushState = function (...args) {
  originalPushState.apply(this, args);
  updateTabStatus();
};

window.history.replaceState = function (...args) {
  originalReplaceState.apply(this, args);
  updateTabStatus();
};

// Call on initial load
updateTabStatus();

/**
 * Clean up closed tabs from localStorage.
 */
function cleanupDeadTabs() {
  const now = Date.now();
  const allKeys = Object.keys(localStorage).filter((k) =>
    k.startsWith(TAB_VISIBILITY_KEY)
  );

  for (const key of allKeys) {
    try {
      const value = localStorage.getItem(key);
      if (!value) {
        localStorage.removeItem(key);
        continue;
      }
      const status: TabStatus = JSON.parse(value);
      if (status.visibilityState === 'hidden') {
        if (!status.updatedAt || now - status.updatedAt > CLEANUP_INTERVAL) {
          localStorage.removeItem(key);
        }
      }
    } catch {
      localStorage.removeItem(key);
    }
  }
}

// Periodically clean up dead tabs
setInterval(cleanupDeadTabs, CLEANUP_INTERVAL);
