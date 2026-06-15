# Estrutura limpa do Fleet Health Score Geotab

## Objetivo da limpeza

Consolidar o projeto em uma única estrutura estável, removendo pastas temporárias de versões antigas do relatório PDF.

## Estrutura final recomendada

```text
fleet-health-score-geotab/
├─ assets/
│  └─ rotagyn-logo.svg
├─ reports/
│  ├─ index.html
│  ├─ boot.js
│  ├─ premium.js
│  ├─ premium.css
│  └─ pdf-print-fix.js
├─ translations/
├─ .nojekyll
├─ README.md
├─ addin-config.json
├─ icon.svg
├─ index.html
└─ manifest.json
```

## Pastas removidas

As pastas abaixo eram pontos de entrada temporários ou versões antigas do relatório:

- `reports4/`
- `reports41/`
- `reports44/`

A rota oficial do relatório PDF agora é:

```text
/reports/
```

## Arquivos antigos dentro de `reports/` que podem ser removidos

Depois de aplicar esta versão, mantenha apenas:

- `reports/index.html`
- `reports/boot.js`
- `reports/premium.js`
- `reports/premium.css`
- `reports/pdf-print-fix.js`

Remova arquivos versionados antigos como:

- `reports/boot-v4.js`
- `reports/boot-v41.js`
- `reports/table-fix-v42.css`
- `reports/canvas-table-text-fix-v45.js`
- `reports/no-logo-stable-v47.js`
- `reports/premium-removal.js`
- `reports/pdf-canvas-removal.js`

## Motivo

O projeto estava acumulando pastas e arquivos de teste. Isso dificultava manutenção, cache busting e deploy no GitHub Pages. Com uma única rota estável, qualquer melhoria futura entra em `reports/` e o `addin-config.json` recebe apenas o bump de versão.
