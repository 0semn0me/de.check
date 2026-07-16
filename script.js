document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const checklistIndex = document.getElementById('checklistIndex');
    const indexLinks = document.querySelectorAll('.index-link');
    const sections = document.querySelectorAll('.case-section');

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

        // Fecho Automático ao Clicar Fora
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
            e.preventDefault(); // Previne o comportamento ruidoso de salto do link HTML
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Calcula o recuo necessário caso esteja no Mobile (devido ao header fixo)
                const offset = window.innerWidth < 992 ? 80 : 0;
                const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }

            // UX Mobile: Fecha a gaveta após o clique
            if (window.innerWidth < 992 && checklistIndex && menuToggle) {
                checklistIndex.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // ==========================================
    // 3. MONITORIZAÇÃO DE SCROLL (INTERSECTION OBSERVER)
    // ==========================================
    // Destaca a aba lateral automaticamente quando o utilizador roda a página
    const observerOptions = {
        root: null,
        rootMargin: window.innerWidth < 992 ? '-100px 0px -60% 0px' : '-40px 0px -70% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove destaque de todos e ativa apenas o correspondente
                indexLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));
});
