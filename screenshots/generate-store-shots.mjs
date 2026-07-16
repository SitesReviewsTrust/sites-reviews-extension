import fs from 'fs';
const API='https://sites.reviews/api/public/v1';
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const band=s=>s>=7.5?'high':s>=4?'mid':'low';
const plural=(n,one,few,many)=>{const a=Math.abs(n)%100,n1=a%10;if(a>10&&a<20)return many;if(n1>1&&n1<5)return few;if(n1===1)return one;return many;};
const shortName=name=>{let s=String(name||'').split(/\s[—–-]\s|[|·]/)[0].trim();s=s.replace(/[.,;:]+$/,'').trim();if(s.length>34)s=s.slice(0,33).trim()+'…';return s||String(name||'').slice(0,34);};
const meaningful=s=>{const t=String(s||'').replace(/[-–—\s.,;:]/g,'').toLowerCase();return t.length>0&&t!=='нет'&&t!=='no';};
const starsHtml=n=>{n=Math.round(Number(n)||0);let o='';for(let i=1;i<=5;i++)o+=i<=n?'★':'<span class="off">★</span>';return o;};
const reviewSnippet=r=>{const clean=s=>esc(String(s||'').replace(/\s+/g,' ').trim());const p=[];if(meaningful(r.pros))p.push('<span class="p">+ '+clean(r.pros).slice(0,90)+'</span>');if(meaningful(r.cons))p.push('<span class="c">− '+clean(r.cons).slice(0,90)+'</span>');if(p.length)return '<div class="rv-pc">'+p.join('<br>')+'</div>';const b=clean(r.body||r.body_en);return b?'<p class="rv-body">'+b+'</p>':'';};
const renderReviews=rv=>{if(!rv||!rv.length)return '';const it=rv.slice(0,3).map(r=>`<div class="rv"><div class="rv-top"><span class="rv-title">${esc(r.title||'Отзыв')}</span><span class="stars">${starsHtml(r.stars)}</span></div>${reviewSnippet(r)}${r.author?`<div class="rv-auth">${esc(r.author)}</div>`:''}</div>`).join('');return `<div class="sec-t">Отзывы</div>${it}`;};
function popupBiz(biz,reviews){
 const b=band(biz.trust_score);const ai=biz.ai_summary&&typeof biz.ai_summary==='object'?biz.ai_summary:null;
 const verdict=((ai&&ai.verdict)||biz.ai_about||'').trim();const pros=ai&&Array.isArray(ai.pros)?ai.pros:[];const cons=ai&&Array.isArray(ai.cons)?ai.cons:[];
 const rating=Number(biz.avg_ratings||0).toFixed(1);const total=Number(biz.total_reviews||0);const noReviews=total===0;
 return `<div class="hd"><div class="circle ${noReviews?'none':b}">${noReviews?'—':Number(biz.trust_score).toFixed(1)}</div><div class="hd-info"><div class="hd-name"><span class="name-txt">${esc(shortName(biz.name))}</span>${biz.is_verified?'<span class="verified"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z"/><path d="M9 12l2 2 4-4"/></svg></span>':''}</div><div class="hd-meta">${noReviews?'Оценки пока нет':`<span class="stars">${starsHtml(rating)}</span> ${rating}/5 · ${total} ${plural(total,'отзыв','отзыва','отзывов')}`}</div></div></div>
 ${(verdict||pros.length||cons.length)?`<div class="ai"><span class="lbl"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 6.9L21 11l-6.6 2.1L12 20l-2.4-6.9L3 11l6.6-2.1z"/></svg> AI-сводка отзывов</span>${verdict?`<p>${esc(verdict).slice(0,190)}${verdict.length>150?'…':''}</p>`:''}${pros.length?`<div class="chips">${pros.slice(0,3).map(p=>`<span class="chip p">+ ${esc(p)}</span>`).join('')}</div>`:''}${cons.length?`<div class="chips">${cons.slice(0,3).map(c=>`<span class="chip c">− ${esc(c)}</span>`).join('')}</div>`:''}</div>`:''}
 ${renderReviews(reviews)}
 <div class="rate"><div class="rate-t">${noReviews?'Станьте первым, кто оценит этот сайт':'Поделитесь мнением об этом сайте'}</div><div class="picker">${[1,2,3,4,5].map(()=>`<span>★</span>`).join('')}</div></div>
 <div class="actions"><a class="btn primary">Открыть профиль</a><a class="btn">Все отзывы</a></div>`;
}
const popupNotFound=domain=>`<div class="nf"><div class="dom">${esc(domain)}</div><div class="hint">Об этом сайте ещё нет отзывов.<br>Оставьте первый — и он появится в каталоге.</div><button class="btn primary" style="flex:none;padding:11px 20px">Оставить первый отзыв</button></div>`;

const EXT=`<svg viewBox="0 0 128 128" width="34" height="34"><rect width="128" height="128" rx="28" fill="#2563eb"/><path d="M36 66 L56 86 L94 44" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const badge=(txt,cls)=>txt?`<span class="badge ${cls}">${txt}</span>`:'';
function scene({domain,badgeTxt,badgeCls,headline,sub,popup}){
 return `<div class="left"><div class="logo">${EXT.replace('34','28').replace('34','28')}<span>Sites.Reviews</span></div><h1>${headline}</h1><p>${sub}</p></div>
 <div class="browser"><div class="bar"><span class="dots"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></span><div class="url"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a95a3" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg> ${esc(domain)}</div><div class="exticon">${EXT}${badge(badgeTxt,badgeCls)}</div></div><div class="popup-wrap"><div class="win">${popup}<footer><a>Sites.Reviews</a></footer></div></div></div>`;
}
const css=fs.readFileSync('src/popup.css','utf8');
const frame=inner=>`<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>
*{box-sizing:border-box}
${css}
html,body{width:1280px;height:800px;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;overflow:hidden}
:root{--bg:#fff;--fg:#17212B;--muted:#6B7280;--panel:#f5f7fb;--primary:#2A7BFF;--green:#23B26D;--orange:#FFB02E;--red:#EF4444;--star:#FFB02E;--border:#ECEFF4}
.win{background:var(--bg)}
.ai .chip.p{color:#17925a}.ai .chip.c{color:#d64545}
.stage{width:1280px;height:800px;position:relative;background:linear-gradient(135deg,#eaf2ff 0%,#f6fbff 55%,#ffffff 100%)}
.left{position:absolute;left:80px;top:230px;width:470px}
.left .logo{display:flex;align-items:center;gap:11px;margin-bottom:26px}
.left .logo span{font-weight:700;font-size:20px;color:#2563eb}
.left h1{font-weight:800;font-size:43px;line-height:1.16;color:#0d1b2a;margin:0}
.left p{font-size:18px;color:#55677a;line-height:1.55;margin:22px 0 0;max-width:430px}
.browser{position:absolute;left:640px;top:118px;width:700px;background:#fff;border-radius:16px 0 0 16px;box-shadow:0 30px 80px rgba(20,40,80,.18);overflow:hidden}
.bar{height:58px;display:flex;align-items:center;gap:16px;padding:0 18px;border-bottom:1px solid #eef1f5;background:#fbfcfe}
.dots{display:flex;gap:7px}.dots i{width:12px;height:12px;border-radius:50%;display:block}
.url{flex:1;max-width:360px;height:34px;background:#fff;border:1px solid #e6eaf0;border-radius:18px;display:flex;align-items:center;gap:7px;padding:0 14px;font-size:13px;color:#3a4656}
.exticon{position:relative;margin-left:auto;line-height:0}
.badge{position:absolute;right:-5px;bottom:-5px;min-width:20px;height:16px;padding:0 4px;border-radius:8px;color:#fff;font:700 10px/16px sans-serif;text-align:center;box-shadow:0 0 0 2px #fbfcfe}
.badge.high{background:#23b26d}.badge.mid{background:#f59e0b}.badge.low{background:#dc2626}
.popup-wrap{padding:12px 18px 22px 40px}
.win{width:344px;border-radius:14px;overflow:hidden;box-shadow:0 14px 40px rgba(20,40,80,.16);border:1px solid #eef1f5}
.win #root,.win .nf{}
.picker span{pointer-events:none}
</style></head><body><div class="stage">${inner}</div></body></html>`;

const oz=await (await fetch(`${API}/business/ozon.ru`)).json();
const ozr=await (await fetch(`${API}/reviews/ozon.ru?per_page=2`)).json();
const tk=await (await fetch(`${API}/business/tinkoff.ru`)).json();
const tkr=await (await fetch(`${API}/reviews/tinkoff.ru?per_page=2`)).json();

const s1=frame(scene({domain:'ozon.ru',badgeTxt:'9.6',badgeCls:'high',headline:'Trust Score любого сайта — прямо во время сёрфинга',sub:'Заходите на сайт — и сразу видите оценку доверия на основе реальных отзывов. Без регистрации и настройки.',popup:`<div id="root">${popupBiz(oz,ozr.reviews)}</div>`}));
const s2=frame(scene({domain:'tinkoff.ru',badgeTxt:'7.4',badgeCls:'mid',headline:'AI-сводка отзывов: плюсы и минусы сайта сразу',sub:'Вердикт и ключевые «за» и «против» по реальным отзывам — не листая сотни комментариев вручную.',popup:`<div id="root">${popupBiz(tk,tkr.reviews)}</div>`}));
const s3=frame(scene({domain:'example.com',badgeTxt:'',badgeCls:'',headline:'Сайта нет в каталоге?\nОставьте первый отзыв в один клик',sub:'Одна кнопка добавляет сайт в Sites.Reviews и открывает форму отзыва. Каталог растёт сам.',popup:popupNotFound('example.com')}));
fs.writeFileSync(process.argv[2]+'/s1.html',s1);
fs.writeFileSync(process.argv[2]+'/s2.html',s2.replace(/\n/g,' '));
fs.writeFileSync(process.argv[2]+'/s3.html',s3.replace('Сайта нет в каталоге?\nОставьте','Сайта нет в каталоге?<br>Оставьте'));
console.log('ok');
