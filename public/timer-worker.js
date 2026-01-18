// Service Worker for background timer processing
let timerData = null;
let intervalId = null;

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'START_TIMER':
      startBackgroundTimer(data);
      break;
    case 'STOP_TIMER':
      stopBackgroundTimer();
      break;
    case 'CHECK_TIMER':
      checkTimer();
      break;
  }
});

function startBackgroundTimer(data) {
  timerData = {
    startTime: Date.now(),
    endTime: data.endTime,
    sessionType: data.sessionType,
    goal: data.goal
  };

  // Check every 5 seconds
  intervalId = setInterval(() => {
    checkTimer();
  }, 5000);
}

function stopBackgroundTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  timerData = null;
}

function checkTimer() {
  if (!timerData) return;

  const now = Date.now();
  const remaining = timerData.endTime - now;

  if (remaining <= 0) {
    // Timer completed
    self.postMessage({
      type: 'TIMER_COMPLETE',
      data: {
        sessionType: timerData.sessionType,
        goal: timerData.goal
      }
    });

    // Show notification
    self.registration.showNotification('MeLearn Timer Complete!', {
      body: `${timerData.sessionType === 'work' ? 'Work session' : 'Break'} completed!`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'timer-complete',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'View App'
        }
      ]
    });

    stopBackgroundTimer();
  } else {
    // Send progress update
    self.postMessage({
      type: 'TIMER_UPDATE',
      data: {
        remaining: remaining,
        endTime: timerData.endTime
      }
    });
  }
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    // Open or focus the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Keep the service worker alive
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});