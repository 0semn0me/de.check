document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const checklistIndex = document.getElementById('checklistIndex');
    const indexLinks = document.querySelectorAll('.index-link');
    const sections = document.querySelectorAll('.case-section');
    const dynamicInputs = document.querySelectorAll('.dynamic-save');

    // ==========================================
    // 1. GESTÃO DO MENU HAMBÚRGUER (MOBILE)
    // ==========================================
    if (menuToggle && checklistIndex) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = checklistIndex.classList.toggle('open');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        document.addEventListener('click', (e) => {
            if (!checklistIndex.contains(e.target) && !menuToggle.contains(e.target)) {
                checklistIndex.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ==========================================
    // 2. ROLAGEM SUAVE INTEGRADA (SMOOTH SCROLL)
    // ==========================================
    indexLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offset = window.innerWidth < 992 ? 80 : 0;
                const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }

            if (window.innerWidth < 992 && checklistIndex && menuToggle) {
                checklistIndex.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // ==========================================
    // 3. PERSISTÊNCIA EM SESSIONSTORAGE (RECARREGAMENTO SALVO)
    // ==========================================
    // Função para carregar os dados salvos previamente na sessão atual
    const loadSessionData = () => {
        dynamicInputs.forEach(input => {
            const savedValue = sessionStorage.getItem(input.id);
            if (savedValue !== null) {
                if (input.type === 'checkbox') {
                    input.checked = savedValue === 'true';
                    // Adiciona classe visual se já estiver marcado
                    const row = input.closest('.table-row');
                    if (row && input.checked) row.classList.add('row-checked');
                } else {
                    input.value = savedValue;
                }
            }
        });
    };

    // Escuta alterações em qualquer campo mapeado e salva imediatamente
    dynamicInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.type === 'checkbox') {
                sessionStorage.setItem(input.id, input.checked);
                // Controla o efeito visual de linha concluída (UX)
                const row = input.closest('.table-row');
                if (row) {
                    if (input.checked) row.classList.add('row-checked');
                    else row.classList.remove('row-checked');
                }
            } else {
                sessionStorage.setItem(input.id, input.value);
            }
        });
    });

    // Executa o carregamento inicial dos dados da sessão
    loadSessionData();

    // ==========================================
    // 4. MONITORIZAÇÃO DE SCROLL (COMPATIBILIDADE UNIVERSAL)
    // ==========================================
    // Substitui o IntersectionObserver por cálculo nativo de coordenadas (blindado contra erros)
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollPosition = window.scrollY + (window.innerWidth < 992 ? 120 : 60);
                
                sections.forEach(section => {
                    const top = section.offsetTop;
                    const height = section.offsetHeight;
                    const id = section.getAttribute('id');

                    if (scrollPosition >= top && scrollPosition < top + height) {
                        indexLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
});
