const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
function unique(arr){ return [...new Set(arr.flat())] }

window.addEventListener('DOMContentLoaded', async () => {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon();
  $('#themeToggle')?.addEventListener('click', toggleTheme);
  const yearEl = $('#year'); if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Carregar projetos com fallback
  try {
    const projects = await fetch('projects.json', {cache:'no-store'}).then(r => r.json());
    initFilters(projects);
    renderProjects(projects);
  } catch(e) {
    console.warn('Falha ao carregar projects.json, usando fallback.', e);
    const fallback = [
      { title:'Exemplo A', summary:'Fallback de exemplo.', category:['Power Apps'], status:'Entregue', tags:['Demo'], links:{}, thumb:'assets/thumbs/cadastro.svg' },
      { title:'Exemplo B', summary:'Fallback de exemplo.', category:['Automate'], status:'Em andamento', tags:['Demo'], links:{}, thumb:'assets/thumbs/rateio.svg' }
    ];
    initFilters(fallback);
    renderProjects(fallback);
  }
});

function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon();
}
function updateThemeIcon(){
  const t = document.documentElement.getAttribute('data-theme') || 'light';
  const btn = document.getElementById('themeToggle');
  if(btn) btn.innerHTML = t === 'dark' ? '🌙' : '☀️';
}

let activeTech = new Set();
let activeStatus = new Set();
let allProjects = [];

function initFilters(projects){
  const techs = unique(projects.map(p => p.category || []));
  const statuses = unique(projects.map(p => [p.status || '']));
  const techChips = document.getElementById('techChips');
  const statusChips = document.getElementById('statusChips');
  if (!techChips || !statusChips) return;
  const makeChip = (label, group) => {
    if(!label) return document.createTextNode('');
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
  techs.forEach(t => { const c = makeChip(t, 'tech'); if(c && c.appendChild) techChips.appendChild(c) });
  statuses.forEach(s => { const c = makeChip(s, 'status'); if(c && c.appendChild) statusChips.appendChild(c) });
}

function renderProjects(projects){
  allProjects = projects;
  filterProjects();
}

function filterProjects(){
  const grid = document.getElementById('projectsGrid');
  if(!grid){ return; }
  grid.innerHTML = '';
  const filtered = allProjects.filter(p => {
    const techOk = activeTech.size ? (p.category||[]).some(c => activeTech.has(c)) : true;
    const statusOk = activeStatus.size ? activeStatus.has(p.status) : true;
    return techOk && statusOk;
  });
  if(filtered.length === 0){
    const empty = document.createElement('p');
    empty.textContent = 'Nenhum projeto encontrado com os filtros selecionados.';
    grid.appendChild(empty);
  } else {
    filtered.forEach(p => grid.appendChild(card(p)));
  }
}

function card(p){
  const el = document.createElement('article');
  el.className = 'card';
  const statusClass = (p.status||'').toLowerCase().includes('entregue') ? 'success' : 'warn';
  const cats = (p.category||[]).map(c => `<span class='tag'>${c}</span>`).join('');
  const tags = (p.tags||[]).slice(0,3).map(t => `<span class='tag'>#${t}</span>`).join('');
  const caseBtn = p.links && p.links.case ? `<a class='btn primary' href='${p.links.case}' target='_self'>Case ▸</a>` : '';
  const repoBtn = p.links && p.links.repo ? `<a class='btn' href='${p.links.repo}' target='_blank' rel='noopener'>Repo</a>` : '';
  el.innerHTML = `
    <img class="thumb" src="${p.thumb||'assets/thumbs/cadastro.svg'}" alt="Thumb do projeto ${p.title||''}">
    <div class="card-body">
      <h3>${p.title||'Projeto'}</h3>
      <p>${p.summary||''}</p>
      <div class="tags">${cats}${tags}</div>
      <span class="badge ${statusClass}">${p.status||''}</span>
    </div>
    <div class="card-actions">${caseBtn}${repoBtn}</div>
  `;
  return el;
}
