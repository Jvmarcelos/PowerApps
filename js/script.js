// Utilitários
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

// Tema
const themeToggle = () => {
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon();
}
const updateThemeIcon = () => {
  const t = document.documentElement.getAttribute('data-theme') || 'light';
  const btn = $('#themeToggle');
  if(btn) btn.innerHTML = t === 'dark' ? '🌙' : '☀️';
}

window.addEventListener('DOMContentLoaded', async () => {
  // Restaurar tema
  const saved = localStorage.getItem('theme');
  if(saved){ document.documentElement.setAttribute('data-theme', saved); }
  updateThemeIcon();
  $('#themeToggle')?.addEventListener('click', themeToggle);
  $('#year').textContent = new Date().getFullYear();

  // Carregar projetos
  const projects = await fetch('projects.json').then(r => r.json());
  initFilters(projects);
  renderProjects(projects);
});

function unique(arr){ return [...new Set(arr.flat())] }

let activeTech = new Set();
let activeStatus = new Set();

function initFilters(projects){
  const techs = unique(projects.map(p => p.category));
  const statuses = unique(projects.map(p => [p.status]));
  const techChips = $('#techChips');
  const statusChips = $('#statusChips');

  const makeChip = (label, group) => {
    const el = document.createElement('button');
    el.className = 'chip'; el.type = 'button'; el.textContent = label;
    el.addEventListener('click', () => {
      const set = group === 'tech' ? activeTech : activeStatus;
      if(set.has(label)) set.delete(label); else set.add(label);
      el.classList.toggle('active');
      filterProjects();
    });
    return el;
  }

  techs.forEach(t => techChips.appendChild(makeChip(t, 'tech')));
  statuses.forEach(s => statusChips.appendChild(makeChip(s, 'status')));
}

let allProjects = [];

function renderProjects(projects){
  allProjects = projects;
  filterProjects();
}

function filterProjects(){
  const grid = $('#projectsGrid');
  grid.innerHTML = '';
  const filtered = allProjects.filter(p => {
    const techOk = activeTech.size ? p.category.some(c => activeTech.has(c)) : true;
    const statusOk = activeStatus.size ? activeStatus.has(p.status) : true;
    return techOk && statusOk;
  });
  filtered.forEach(p => grid.appendChild(card(p)));
}

function card(p){
  const el = document.createElement('article');
  el.className = 'card';
  const statusClass = p.status.toLowerCase().startsWith('entregue') ? 'success' : 'warn';
  el.innerHTML = `
    <img class="thumb" src="${p.thumb}" alt="Thumb do projeto ${p.title}">
    <div class="card-body">
      <h3>${p.title}</h3>
      <p>${p.summary}</p>
      <div class="tags">
        ${p.category.map(c => `<span class='tag'>${c}</span>`).join('')}
        ${p.tags.slice(0,3).map(t => `<span class='tag'>#${t}</span>`).join('')}
      </div>
      <span class="badge ${statusClass}">${p.status}</span>
    </div>
    <div class="card-actions">
      ${p.links.case ? `<a class='btn primary' href='${p.links.case}' target='_self'>Case ▸</a>` : ''}
      ${p.links.repo ? `<a class='btn' href='${p.links.repo}' target='_blank' rel='noopener'>Repo</a>` : ''}
    </div>
  `;
  return el;
}
