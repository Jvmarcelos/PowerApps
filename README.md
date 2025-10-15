# Portfólio — João Vitor Souza

Portfólio estático dos projetos em Power Apps, Power Automate e Power BI. Tema Light/Dark, filtros por tecnologia e status, cards gerados via `projects.json`.

## ✨ Recursos
- HTML + CSS + JS (sem frameworks)
- Tema **Light/Dark** (persistência via `localStorage`)
- **Filtros** por tecnologia e status
- **Cards** dinâmicos a partir de `projects.json`
- Layout **responsivo** (desktop → mobile)
- Preparado para **GitHub Pages**

## 🚀 Como usar

1. Edite os links do GitHub e redes em `index.html` (busque por `SEU_USUARIO` e `SEU_LINKEDIN`).
2. Atualize os projetos em `projects.json` (título, resumo, tags, links, status e thumbs).
3. (Opcional) Troque os SVGs em `assets/thumbs/` por capturas reais dos seus apps.

### Rodar localmente
Basta abrir `index.html` no navegador. Se quiser servidor local:
```bash
# Python 3
python -m http.server 8080
# acesse http://localhost:8080
```

### Publicar no GitHub Pages
1. Crie um repositório (ex: `portfolio-jv`).
2. Faça commit/push de todos os arquivos.
3. No GitHub, vá em **Settings → Pages**.
4. Em **Source**, selecione **Deploy from a branch** e aponte para `main` e **/root**.
5. Aguarde a publicação em `https://SEU_USUARIO.github.io/portfolio-jv/`.

> Dica: adicione um arquivo vazio `.nojekyll` (já incluso) para evitar processamento do Jekyll.

## 🖌️ Personalização rápida
- Cores e tokens em `css/styles.css` (seção `:root` e `[data-theme="dark"]`).
- Conteúdos das seções Hero, Roadmap, Sobre e Contato em `index.html`.

## 📄 Licença
Uso pessoal livre. Se reutilizar, mantenha os créditos.
