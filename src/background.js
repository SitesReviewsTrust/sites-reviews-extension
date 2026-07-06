// Background service worker: следит за активной вкладкой, обновляет badge.
// Публичный read-API Sites.Reviews (без ключа, throttle 60/мин/IP).
const API_BASE = 'https://sites.reviews/api/public/v1';

async function setBadge(tabId, score) {
  if (score === null || score === undefined) {
    await chrome.action.setBadgeText({ text: '', tabId });
    return;
  }
  const band = score >= 7.5 ? '#2ECC71' : score >= 4 ? '#FFB02E' : '#EF4444';
  await chrome.action.setBadgeBackgroundColor({ color: band, tabId });
  await chrome.action.setBadgeText({ text: score.toFixed(1), tabId });
}

function domainFromUrl(url) {
  try {
    const u = new URL(url);
    if (!/^https?:$/i.test(u.protocol)) return null;
    return u.hostname.replace(/^www\./i, '');
  } catch {
    return null;
  }
}

const cache = new Map();
async function fetchScore(domain) {
  if (cache.has(domain)) return cache.get(domain);

  try {
    const r = await fetch(`${API_BASE}/check?domain=${encodeURIComponent(domain)}`);
    if (!r.ok) return { error: 'http_' + r.status };
    const data = await r.json();
    cache.set(domain, data);
    setTimeout(() => cache.delete(domain), 1000 * 60 * 15); // 15 min TTL
    return data;
  } catch (e) {
    return { error: 'network' };
  }
}

async function updateTab(tabId, url) {
  const domain = domainFromUrl(url);
  if (!domain) {
    await setBadge(tabId, null);
    return;
  }
  const data = await fetchScore(domain);
  if (data?.found === false || data?.error) {
    await setBadge(tabId, null);
    return;
  }
  await setBadge(tabId, data?.trust_score ?? null);
}

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  if (tab.url) await updateTab(tabId, tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    updateTab(tabId, tab.url);
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'getScore' && msg.domain) {
    fetchScore(msg.domain).then(sendResponse);
    return true;
  }
});
