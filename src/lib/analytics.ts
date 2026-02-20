type EventData = Record<string, string | number | boolean>;
type QueuedEvent = { name: string; data?: EventData };
type UmamiGlobal = { umami?: { track: (name: string, data?: EventData) => void } };

let isLoaded = false;
const queue: QueuedEvent[] = [];

const getUmami = () => (globalThis as UmamiGlobal).umami;

const flushQueue = (): void => {
  isLoaded = true;
  while (queue.length > 0) {
    const event = queue.shift()!;
    getUmami()?.track(event.name, event.data);
  }
};

export const loadUmami = (): void => {
  if (import.meta.env.VITE_ENVIRONMENT !== 'production') return;

  const scriptUrl = import.meta.env.VITE_UMAMI__SCRIPT_URL;
  const websiteId = import.meta.env.VITE_UMAMI__WEBSITE_ID;
  if (!scriptUrl || !websiteId) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = scriptUrl;
  script.dataset.websiteId = websiteId;
  script.onload = flushQueue;
  document.head.appendChild(script);
};

export const track = (eventName: string, eventData?: EventData): void => {
  if (!('document' in globalThis)) return;

  const umami = getUmami();
  if (isLoaded && umami) umami.track(eventName, eventData);
  else queue.push({ name: eventName, data: eventData });
};
