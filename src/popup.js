const $ = sel => document.querySelector(sel);

function domainFromUrl(url) {
  try {
    const u = new URL(url);
    if (!/^https?:$/i.test(u.protocol)) return null;
    return u.hostname.replace(/^www\./i, '');
  } catch {
    return null;
  }
}

function band(score) {
  if (score >= 7.5) return 'high';
  if (score >= 4) return 'mid';
  return 'low';
}

function renderScore(data) {
  const b = band(data.trust_score);
  $('#root').innerHTML = `
    <div class="score-card">
      <div class="score-circle ${b}">${data.trust_score.toFixed(1)}</div>
      <div class="score-info">
        <div class="score-name">${data.name}</div>
        <div class="score-meta"><strong>${data.total_reviews}</strong> отзывов · ${data.avg_ratings.toFixed(1)}/5</div>
      </div>
    </div>
    <div class="actions">
      <a class="btn primary" href="${data.url}" target="_blank" rel="noopener">Открыть профиль</a>
      <a class="btn" href="${data.url}#review" target="_blank" rel="noopener">Написать отзыв</a>
    </div>
  `;
}

function renderNotFound(domain, data) {
  $('#root').innerHTML = `
    <div class="not-found">
      <div class="domain">${domain}</div>
      <div class="hint">Сайт пока не в каталоге Sites.Reviews</div>
      <a class="btn primary" href="${data.submit_url}" target="_blank" rel="noopener">Добавить и оставить отзыв</a>
    </div>
  `;
}

function renderError(msg) {
  $('#root').innerHTML = `<div class="loading">Ошибка: ${msg}</div>`;
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const domain = tab ? domainFromUrl(tab.url) : null;
  if (!domain) {
    $('#root').innerHTML = `<div class="loading">Откройте обычную страницу (http/https)</div>`;
    return;
  }

  const resp = await chrome.runtime.sendMessage({ type: 'getScore', domain });
  if (resp?.error) {
    renderError(resp.error);
    return;
  }
  if (resp?.found === false) {
    renderNotFound(domain, resp);
    return;
  }
  renderScore(resp);
}

document.addEventListener('DOMContentLoaded', init);
