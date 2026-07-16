const API = 'https://sites.reviews/api/public/v1';
const $ = (sel) => document.querySelector(sel);

function domainFromUrl(url) {
  try {
    const u = new URL(url);
    if (!/^https?:$/i.test(u.protocol)) return null;
    return u.hostname.replace(/^www\./i, '');
  } catch {
    return null;
  }
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function band(score) {
  if (score >= 7.5) return 'high';
  if (score >= 4) return 'mid';
  return 'low';
}

// Короткое имя бренда: отсекаем описание после « — », « | », «·» и хвостовую пунктуацию.
function shortName(name) {
  let s = String(name || '').split(/\s[—–-]\s|[|·]/)[0].trim();
  s = s.replace(/[.,;:]+$/, '').trim();
  if (s.length > 34) s = s.slice(0, 33).trim() + '…';
  return s || String(name || '').slice(0, 34);
}

// Есть ли содержательный текст (не пустой, не прочерк «–»/«-»/«нет»).
function meaningful(s) {
  const t = String(s || '').replace(/[-–—\s.,;:]/g, '').toLowerCase();
  return t.length > 0 && t !== 'нет' && t !== 'no';
}

function starsHtml(n) {
  n = Math.round(Number(n) || 0);
  let out = '';
  for (let i = 1; i <= 5; i++) out += i <= n ? '★' : '<span class="off">★</span>';
  return out;
}

// Короткий сниппет из pros/cons или тела отзыва.
function reviewSnippet(r) {
  const clean = (s) => esc(String(s || '').replace(/\s+/g, ' ').trim());
  const parts = [];
  if (meaningful(r.pros)) parts.push('<span class="p">+ ' + clean(r.pros).slice(0, 90) + '</span>');
  if (meaningful(r.cons)) parts.push('<span class="c">− ' + clean(r.cons).slice(0, 90) + '</span>');
  if (parts.length) return '<div class="rv-pc">' + parts.join('<br>') + '</div>';
  const body = clean(r.body || r.body_en);
  return body ? '<p class="rv-body">' + body + '</p>' : '';
}

function renderReviews(reviews) {
  if (!reviews || !reviews.length) return '';
  const items = reviews.slice(0, 3).map((r) => `
    <div class="rv">
      <div class="rv-top">
        <span class="rv-title">${esc(r.title || 'Отзыв')}</span>
        <span class="stars">${starsHtml(r.stars)}</span>
      </div>
      ${reviewSnippet(r)}
      ${r.author ? `<div class="rv-auth">${esc(r.author)}</div>` : ''}
    </div>`).join('');
  return `<div class="sec-t">Отзывы</div>${items}`;
}

function renderBusiness(biz, reviews) {
  const b = band(biz.trust_score);
  const ai = biz.ai_summary && typeof biz.ai_summary === 'object' ? biz.ai_summary : null;
  const verdict = ((ai && ai.verdict) || biz.ai_about || '').trim();
  const pros = ai && Array.isArray(ai.pros) ? ai.pros : [];
  const cons = ai && Array.isArray(ai.cons) ? ai.cons : [];
  const rating = Number(biz.avg_ratings || 0).toFixed(1);
  const reviewUrl = biz.url + '/review';

  $('#root').innerHTML = `
    <div class="hd">
      <div class="circle ${b}">${Number(biz.trust_score).toFixed(1)}</div>
      <div class="hd-info">
        <div class="hd-name">
          <span class="name-txt">${esc(shortName(biz.name))}</span>
          ${biz.is_verified ? '<span class="verified" title="Проверено"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z"/><path d="M9 12l2 2 4-4"/></svg></span>' : ''}
        </div>
        <div class="hd-meta"><span class="stars">${starsHtml(rating)}</span> ${rating}/5 · ${biz.total_reviews} отзывов</div>
      </div>
    </div>

    ${(verdict || pros.length || cons.length) ? `<div class="ai">
      <span class="lbl"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 6.9L21 11l-6.6 2.1L12 20l-2.4-6.9L3 11l6.6-2.1z"/></svg> AI-сводка отзывов</span>
      ${verdict ? `<p>${esc(verdict).slice(0, 220)}${verdict.length > 220 ? '…' : ''}</p>` : ''}
      ${pros.length ? `<div class="chips">${pros.slice(0, 4).map((p) => `<span class="chip p">+ ${esc(p)}</span>`).join('')}</div>` : ''}
      ${cons.length ? `<div class="chips">${cons.slice(0, 3).map((c) => `<span class="chip c">− ${esc(c)}</span>`).join('')}</div>` : ''}
    </div>` : ''}

    ${renderReviews(reviews)}

    <div class="rate">
      <div class="rate-t">Поделитесь мнением об этом сайте</div>
      <div class="picker" id="picker">
        ${[1, 2, 3, 4, 5].map((i) => `<span data-v="${i}">★</span>`).join('')}
      </div>
    </div>

    <div class="actions">
      <a class="btn primary" href="${esc(biz.url)}" target="_blank" rel="noopener">Открыть профиль</a>
      <a class="btn" href="${esc(biz.url)}#reviews" target="_blank" rel="noopener">Все отзывы</a>
    </div>
  `;

  // Звёздный пикер → открыть авторизованный флоу отзыва (антиспам на стороне сайта).
  const picker = $('#picker');
  const spans = [...picker.querySelectorAll('span')];
  spans.forEach((s) => {
    const v = Number(s.dataset.v);
    s.addEventListener('mouseenter', () => spans.forEach((x) => x.classList.toggle('on', Number(x.dataset.v) <= v)));
    s.addEventListener('click', () => chrome.tabs.create({ url: reviewUrl }));
  });
  picker.addEventListener('mouseleave', () => spans.forEach((x) => x.classList.remove('on')));
}

function renderNotFound(domain) {
  const submitUrl = 'https://sites.reviews/businesses/add?website=' + encodeURIComponent(domain);
  $('#root').innerHTML = `
    <div class="nf">
      <div class="dom">${esc(domain)}</div>
      <div class="hint">Сайт пока не в каталоге Sites.Reviews</div>
      <a class="btn primary" style="display:inline-block;flex:none;padding:9px 18px" href="${esc(submitUrl)}" target="_blank" rel="noopener">Добавить и оставить отзыв</a>
    </div>`;
}

function renderMessage(text) {
  $('#root').innerHTML = `<div class="loading">${esc(text)}</div>`;
}

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) return null;
  return r.json();
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const domain = tab ? domainFromUrl(tab.url) : null;
  if (!domain) {
    renderMessage('Откройте обычную страницу (http/https)');
    return;
  }

  try {
    const biz = await fetchJson(`${API}/business/${encodeURIComponent(domain)}`);
    if (!biz || biz.found === false || biz.trust_score == null) {
      renderNotFound(domain);
      return;
    }
    const rev = await fetchJson(`${API}/reviews/${encodeURIComponent(domain)}?per_page=3`);
    renderBusiness(biz, rev ? rev.reviews : []);
  } catch (e) {
    renderMessage('Не удалось загрузить данные');
  }
}

document.addEventListener('DOMContentLoaded', init);
