/* Variáveis de Cores e Design (Tokens de Estilo) */
:root {
    --bg-main: #f8fafc;
    --card-bg: #ffffff;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border-default: #e2e8f0;
    --radius: 12px;
    
    /* Cores de Contexto (As Abas/Banners Dinâmicos) */
    --triagem-bg: #e0f2fe;     --triagem-text: #0369a1;
    --tecnico-bg: #fff7ed;      --tecnico-text: #c2410c;
    --operacional-bg: #f0fdf4;  --operacional-text: #15803d;
}

/* 1. RESET GLOBAL COMPLETO (Garante consistência entre iOS, Android e PC) */
* {
    box-sizing: border-box;
    margin: 0; 
    padding: 0;
}

html {
    scroll-behavior: smooth; /* Rolagem suave nativa */
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}

body {
    background-color: var(--bg-main);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: var(--text-main);
    min-height: 100vh;
}

/* 2. LAYOUT MOBILE-FIRST (Barra do topo fixa para telemóveis) */
.mobile-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: var(--card-bg);
    border-bottom: 1px solid var(--border-default);
    position: fixed;
    top: 0; left: 0; right: 0; z-index: 100;
}

.hamburger-btn {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 24px; height: 24px;
    background: transparent; border: none; cursor: pointer;
}

.hamburger-btn span {
    width: 24px; height: 2px; background: var(--text-main);
    transition: transform 0.3s, opacity 0.3s;
}

/* Transformação do Ícone Hambúrguer em "X" quando aberto */
.hamburger-btn.active span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
.hamburger-btn.active span:nth-child(2) { opacity: 0; }
.hamburger-btn.active span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

.mobile-title { font-size: 1.15rem; font-weight: 600; }

/* Menu Lateral Escondido (Comportamento de gaveta no Mobile) */
.checklist-sidebar {
    position: fixed;
    top: 57px; left: -280px;
    width: 280px; height: calc(100vh - 57px);
    background: var(--card-bg);
    box-shadow: 4px 0 15px rgba(0,0,0,0.05);
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 90;
    padding: 24px;
}

.checklist-sidebar.open { left: 0; }

.sidebar-header {
    font-size: 0.85rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 16px;
}

.sidebar-links { display: flex; flex-direction: column; gap: 8px; }

.index-link {
    text-decoration: none; color: var(--text-main); padding: 10px 14px;
    border-radius: 8px; font-size: 0.95rem; transition: background 0.2s;
}
.index-link:hover { background: var(--bg-main); }
.index-link.active { background: var(--border-default); font-weight: 600; }

/* Contentor da Planilha (Compensação de 90px para não ficar sob a barra fixa) */
.spreadsheet-container {
    padding: 16px;
    margin-top: 90px; 
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.case-section {
    background: var(--card-bg);
    border: 2px solid var(--border-default);
    border-radius: var(--radius);
    overflow: hidden;
}

/* 3. IDENTIDADE CRUMÁTICA DAS SECÇÕES (As Abas Coloridas) */
.section-triagem { border-color: var(--triagem-text); }
.section-triagem .section-banner { background: var(--triagem-bg); color: var(--triagem-text); }

.section-tecnico { border-color: var(--tecnico-text); }
.section-tecnico .section-banner { background: var(--tecnico-bg); color: var(--tecnico-text); }

.section-operacional { border-color: var(--operacional-text); }
.section-operacional .section-banner { background: var(--operacional-bg); color: var(--operacional-text); }

.section-banner { padding: 14px 20px; }
.section-banner h2 { font-size: 1.1rem; font-weight: 600; }

/* Bloco de Inputs Técnicos do Topo */
.spreadsheet-meta-inputs {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 16px;
    background-color: var(--bg-main);
    border-bottom: 1px solid var(--border-default);
}

.meta-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 140px;
}

.meta-field label {
    font-size: 0.8rem; font-weight: 600; color: var(--text-muted);
}

.cell-input-border {
    padding: 8px 12px;
    border: 1px solid var(--border-default);
    border-radius: 6px;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;
}
.cell-input-border:focus { border-color: var(--triagem-text); }

/* Organização de Linhas Estilo Planilha */
.table-wrapper { width: 100%; overflow-x: auto; }

.table-row {
    display: grid;
    grid-template-columns: 40px 1fr;
    align-items: start;
    border-bottom: 1px solid var(--border-default);
    padding: 14px 16px;
    background-color: var(--card-bg);
    transition: background-color 0.15s;
}
.table-row:last-child { border-bottom: none; }
.table-row:hover { background-color: var(--bg-main); }

.cell-check input[type="checkbox"] {
    width: 18px; height: 18px; cursor: pointer; margin-top: 2px;
}

.cell-text label {
    cursor: pointer; display: block; width: 100%; font-size: 0.95rem; line-height: 1.4;
}

/* Área de Texto Longo (TXT de Andamento) */
.table-row-special {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    border-bottom: 1px solid var(--border-default);
}
.table-row-special label { font-size: 0.9rem; font-weight: 600; }
.table-row-special textarea {
    width: 100%; padding: 12px;
    border: 1px solid var(--border-default); border-radius: 6px;
    font-family: inherit; font-size: 0.9rem; resize: vertical; outline: none;
}
.table-row-special textarea:focus { border-color: var(--triagem-text); }

/* Linhas com Cores de Alerta Estratégicas (UX de Destaque) */
.warning-row { background-color: #fffbeb; }
.alert-row { background-color: #fef2f2; border-left: 4px solid #ef4444; }
.info-row { background-color: #f0fdfa; font-style: italic; }

/* 4. COMPORTAMENTO E DESIGN PARA COMPUTADORES (Ecrãs Grandes) */
@media (min-width: 992px) {
    .mobile-header { display: none; } /* Remove barra móvel no PC */
    
    .app-grid {
        display: grid;
        grid-template-columns: 280px 1fr; /* Índice e Planilha estáveis lado a lado */
        gap: 32px;
        max-width: 1400px;
        margin: 0 auto;
        padding: 32px;
    }

    .checklist-sidebar {
        position: sticky; top: 32px; left: 0;
        width: 100%; height: auto;
        box-shadow: none; background: transparent; padding: 0;
    }

    .spreadsheet-container { padding: 0; margin-top: 0; }
}
