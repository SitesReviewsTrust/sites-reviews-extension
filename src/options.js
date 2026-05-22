const $ = sel => document.querySelector(sel);

async function load() {
  const stored = await chrome.storage.sync.get('apiKey');
  $('#apiKey').value = stored.apiKey || '';
}

$('#form').addEventListener('submit', async e => {
  e.preventDefault();
  const apiKey = $('#apiKey').value.trim();
  await chrome.storage.sync.set({ apiKey });
  $('#saved').hidden = false;
  setTimeout(() => { $('#saved').hidden = true; }, 2000);
});

load();
