(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {

        // ── Referências ────────────────────────────────────────────
        const menuToggle     = document.getElementById('menuToggle');
        const sidebar        = document.getElementById('checklistIndex');
        const overlay        = document.getElementById('sidebarOverlay');
        const indexLinks     = document.querySelectorAll('.index-link');
        const sections       = document.querySelectorAll('.case-section');
        const dynamicInputs  = document.querySelectorAll('.dynamic-save');
        const mobileTitleSub = document.getElementById('mobileSectionHint');

        // ── 1. MENU HAMBÚRGUER + OVERLAY ──────────────────────────
        function openSidebar() {
            sidebar.classList.add('open');
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            if (overlay) {
                overlay.classList.add('visible');
                // Força reflow antes de adicionar 'active' para animar
                requestAnimationFrame(() => overlay.classList.add('active'));
            }
            document.body.style.overflow = 'hidden';
        }

        function closeSidebar() {
            sidebar.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            if (overlay) {
                overlay.classList.remove('active');
                // Remove 'visible' após transição terminar
                overlay.addEventListener('transitionend', () => {
                    overlay.classList.remove('visible');
                }, { once: true });
            }
            document.body.style.overflow = '';
        }

        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', closeSidebar);
        }

        // Fechar com Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
        });

        // ── 2. SCROLL SUAVE + FECHAR SIDEBAR ──────────────────────
        indexLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (!target) return;

                const isMobile = window.innerWidth < 992;
                const offset   = isMobile ? 72 : 0;
                const top      = target.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({ top, behavior: 'smooth' });

                if (isMobile) closeSidebar();
            });
        });

        // ── 3. PROGRESSÃO POR SEÇÃO ───────────────────────────────
        function updateProgress(section) {
            const checkboxes = section.querySelectorAll('.custom-checkbox');
            const checked    = section.querySelectorAll('.custom-checkbox:checked');
            const total      = checkboxes.length;
            const done       = checked.length;

            const textEl  = section.querySelector('.progress-pill-text');
            const fillEl  = section.querySelector('.progress-fill');

            if (textEl)  textEl.textContent = `${done}/${total}`;
            if (fillEl)  fillEl.style.width = total > 0 ? `${(done / total) * 100}%` : '0%';
        }

        function updateAllProgress() {
            sections.forEach(updateProgress);
        }

        // ── 4. PERSISTÊNCIA EM SESSIONSTORAGE ─────────────────────
        const storageOk = (() => {
            try {
                sessionStorage.setItem('__t', '1');
                sessionStorage.removeItem('__t');
                return true;
            } catch { return false; }
        })();

        const store = {
            get: (k)    => storageOk ? sessionStorage.getItem(k) : null,
            set: (k, v) => storageOk && sessionStorage.setItem(k, v),
        };

        function loadSession() {
            dynamicInputs.forEach(input => {
                const saved = store.get(input.id);
                if (saved === null) return;

                if (input.type === 'checkbox') {
                    input.checked = saved === 'true';
                    const row = input.closest('.table-row');
                    if (row) row.classList.toggle('row-checked', input.checked);
                } else {
                    input.value = saved;
                }
            });
            updateAllProgress();
        }

        // Usando 'change' para checkbox (mais correto cross-browser/iOS)
        // e 'input' para texto/textarea
        dynamicInputs.forEach(input => {
            const evt = input.type === 'checkbox' ? 'change' : 'input';

            input.addEventListener(evt, () => {
                if (input.type === 'checkbox') {
                    store.set(input.id, input.checked);
                    const row = input.closest('.table-row');
                    if (row) row.classList.toggle('row-checked', input.checked);
                    // Atualiza progresso da seção pai
                    const section = input.closest('.case-section');
                    if (section) updateProgress(section);
                } else {
                    store.set(input.id, input.value);
                }
            });
        });

        loadSession();

        // ── 5. SCROLL: LINK ATIVO + TÍTULO MOBILE ─────────────────
        const sectionMap = {};
        sections.forEach(s => { sectionMap[s.id] = s; });

        // Nomes curtos para o subtítulo mobile
        const sectionNames = {
            'rumo-triagem':      'Fluxo Operacional',
            'rumo-tecnico':      'Análise Gerencial',
            'rumo-operacional':  'Controlo de Qualidade',
        };

        let rafPending = false;

        function onScroll() {
            if (rafPending) return;
            rafPending = true;

            requestAnimationFrame(() => {
                const offset = window.innerWidth < 992 ? 100 : 50;
                const pos    = window.scrollY + offset;
                let   active = null;

                sections.forEach(section => {
                    if (pos >= section.offsetTop) active = section;
                });

                if (active) {
                    const id = active.getAttribute('id');
                    indexLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                    if (mobileTitleSub && sectionNames[id]) {
                        mobileTitleSub.textContent = sectionNames[id];
                    }
                }

                rafPending = false;
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // roda na carga para estado inicial correto

    });
})();
