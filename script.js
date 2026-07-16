document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const checklistIndex = document.getElementById('checklistIndex');
    const indexLinks = document.querySelectorAll('.index-link');

    // 1. GESTÃO DO MENU HAMBÚRGUER (Apenas Dispositivos Móveis)
    if (menuToggle && checklistIndex) {
        // Evento para Abrir / Fechar ao clicar no botão hambúrguer
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que o clique feche o menu imediatamente
            const isOpen = checklistIndex.classList.toggle('open');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        // Fecho Inteligente: Se clicar fora do menu lateral, ele fecha sozinho
        document.addEventListener('click', (e) => {
            if (!checklistIndex.contains(e.target) && !menuToggle.contains(e.target)) {
                checklistIndex.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 2. NAVEGAÇÃO INTERNA E FEEDBACK VISUAL DO ÍNDICE
    indexLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove a classe ativa de todos os links e adiciona ao atual
            indexLinks.forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            // UX Mobile: Se estiver num ecrã pequeno, fecha a gaveta ao escolher a secção
            if (window.innerWidth < 992 && checklistIndex && menuToggle) {
                checklistIndex.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
});
