// const API_BASE = 'http://localhost:3001';  // Development
const API_BASE = 'https://proxy-promocoes-dinamicas.onrender.com';  // Production

const form = document.getElementById('promo-form');
const submitBtn = document.getElementById('submit-btn');
const viewBtn   = document.getElementById('view-btn'); 
const vitrine = document.getElementById('vitrine');
const loadingEl = document.getElementById('loading');

const requiredFields = ['program', 'id_customer'];

function checkRequired() {
  const allFilled = requiredFields.every(id =>
    document.getElementById(id).value.trim() !== ''
  );
  submitBtn.disabled = !allFilled;
}

requiredFields.forEach(id =>
  document.getElementById(id).addEventListener('input', checkRequired)
);

form.addEventListener('submit', async e => {
  e.preventDefault();

  viewBtn.style.display = 'none';

  const params = {};
  new FormData(form).forEach((value, key) => {
    if (value.trim() !== '') params[key] = value.trim();
  });
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE}/promotions?${query}`;

  loadingEl.style.display = 'block';
  vitrine.innerHTML = '';

  try {
    const res = await fetch(url);
    const data = await res.json();
    loadingEl.style.display = 'none';

    renderVitrine(data.payload);

    const originalUrl = `https://southamerica-east1-prj-appcorp-datahub-cdp-prd.cloudfunctions.net/get-allocations-function?${query}`;
    viewBtn.onclick        = () => window.open(originalUrl, '_blank');
    viewBtn.style.display  = 'block';

  } catch (err) {
    console.error(err);
    loadingEl.style.display = 'none';
    vitrine.innerHTML = '<p class="empty-message">Sem promoções disponíveis 😔</p>';
  }
});

function renderVitrine(items) {
  vitrine.innerHTML = '';
  if (!items || items.length === 0) {
    vitrine.innerHTML = '<p class="empty-message">Sem promoções disponíveis 😔</p>';
    return;
  }
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'vitrine-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.description}">
      <div class="info">
        <p class="description" title="${item.description}">
          ${item.description}
        </p>
        <p class="dynamic">${item.dynamic}</p>
      </div>
    `;
    vitrine.appendChild(div);
  });
}
