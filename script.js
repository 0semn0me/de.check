document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const checklistIndex = document.getElementById('checklistIndex');
    const indexLinks = document.querySelectorAll('.index-link');

    // 1. Controlo do Menu Hambúrguer (Mobile)
    if (menuToggle && checklistIndex) {
        menuToggle.addEventListener('click', () => {
            const isOpen = checklistIndex.classList.toggle('open');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        // Fecha o menu lateral automaticamente ao clicar num link (Melhor UX no mobile)
        indexLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    checklistIndex.classList.remove('open');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // 2. Destacar a aba ativa no Índice com base no clique
    indexLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            indexLinks.forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
});
