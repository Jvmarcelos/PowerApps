// script.js v1.0
const canonical = "https://jvmarcelos.github.io/PowerApps/";
async function loadProjects(){
  try{
    const res = await fetch('projects.json?v=1.0');
    const data = await res.json();
    const grid = document.querySelector('#projectsGrid');
    grid.innerHTML = '';
    data.forEach(p=>{
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="thumb"><object type="image/svg+xml" data="${{p.thumb}}?v=1.0" aria-label="${{p.title}} thumbnail"></object></div>
        <h3>${{p.title}}</h3>
        <p>${{p.short}}</p>
        <div style="margin-top:auto;display:flex;gap:8px;align-items:center;"><a class="btn ghost" href="#case-${{p.id}}">Ver case</a><button class="btn" onclick="downloadCV()">Baixar CV</button></div>
      `;
      grid.appendChild(card);
    });
  }catch(e){console.error('Erro carregando projects.json',e);}
}
function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', cur==='dark'?'':'dark');
  localStorage.setItem('theme', document.documentElement.getAttribute('data-theme')||'');
}
function applySavedTheme(){
  const t = localStorage.getItem('theme')||'';
  if(t) document.documentElement.setAttribute('data-theme', t);
}
function downloadCV(){ alert('Botão de placeholder: adicione o arquivo CV no repositório e substitua o link.'); }
document.addEventListener('DOMContentLoaded', ()=>{ applySavedTheme(); loadProjects(); });
