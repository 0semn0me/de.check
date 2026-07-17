(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('checklistIndex');
        const overlay = document.getElementById('sidebarOverlay');
        const mobileTitleSub = document.getElementById('mobileSectionHint');
        const indexLinks = Array.from(document.querySelectorAll('.index-link'));
        const sections = Array.from(document.querySelectorAll('.case-section'));
        const dynamicInputs = Array.from(document.querySelectorAll('.dynamic-save'));
        const desktopMediaQuery = window.matchMedia('(min-width: 992px)');
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        let overlayTimer = null;
        let scrollFramePending = false;
        let sidebarIsOpen = false;

        const sectionNames = {
            'rumo-triagem': 'Fluxo Operacional',
            'rumo-tecnico': 'Análise Gerencial',
            'rumo-operacional': 'Controlo de Qualidade'
        };

        const storageAvailable = (() => {
            try {
                const testKey = '__checklist_storage_test__';
                sessionStorage.setItem(testKey, '1');
                sessionStorage.removeItem(testKey);
                return true;
            } catch (error) {
                return false;
            }
        })();

        const storage = {
            get(key) {
                if (!storageAvailable || !key) {
                    return null;
                }

                try {
                    return sessionStorage.getItem(key);
                } catch (error) {
                    return null;
                }
            },

            set(key, value) {
                if (!storageAvailable || !key) {
                    return;
                }

                try {
                    sessionStorage.setItem(key, String(value));
                } catch (error) {
                    return;
                }
            }
        };

        function isDesktop() {
            return desktopMediaQuery.matches;
        }

        function clearOverlayTimer() {
            if (overlayTimer !== null) {
                window.clearTimeout(overlayTimer);
                overlayTimer = null;
            }
        }

        function updateMenuAccessibility(open) {
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', String(open));
                menuToggle.setAttribute(
                    'aria-label',
                    open ? 'Fechar mapa do checklist' : 'Abrir mapa do checklist'
                );
            }

            if (sidebar) {
                sidebar.setAttribute(
                    'aria-hidden',
                    isDesktop() ? 'false' : String(!open)
                );

                if (isDesktop()) {
                    sidebar.removeAttribute('tabindex');
                } else {
                    sidebar.setAttribute('tabindex', '-1');
                }
            }

            if (overlay) {
                overlay.setAttribute('aria-hidden', String(!open));
            }
        }

        function showOverlay() {
            if (!overlay || isDesktop()) {
                return;
            }

            clearOverlayTimer();
            overlay.classList.add('visible');

            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                    overlay.classList.add('active');
                });
            });
        }

        function hideOverlay(immediate = false) {
            if (!overlay) {
                return;
            }

            clearOverlayTimer();
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');

            if (immediate || reducedMotionQuery.matches) {
                overlay.classList.remove('visible');
                return;
            }

            overlayTimer = window.setTimeout(() => {
                overlay.classList.remove('visible');
                overlayTimer = null;
            }, 320);
        }

        function openSidebar() {
            if (!menuToggle || !sidebar || isDesktop()) {
                return;
            }

            sidebarIsOpen = true;
            sidebar.classList.add('open');
            menuToggle.classList.add('active');
            updateMenuAccessibility(true);
            showOverlay();
            document.body.style.overflow = 'hidden';

            window.requestAnimationFrame(() => {
                sidebar.focus({ preventScroll: true });
            });
        }

        function closeSidebar(options = {}) {
            const {
                returnFocus = false,
                immediate = false
            } = options;

            sidebarIsOpen = false;

            if (sidebar) {
                sidebar.classList.remove('open');
            }

            if (menuToggle) {
                menuToggle.classList.remove('active');
            }

            updateMenuAccessibility(false);
            hideOverlay(immediate);
            document.body.style.overflow = '';

            if (returnFocus && menuToggle && !isDesktop()) {
                menuToggle.focus({ preventScroll: true });
            }
        }

        function synchronizeResponsiveState() {
            clearOverlayTimer();

            if (isDesktop()) {
                sidebarIsOpen = false;
                document.body.style.overflow = '';

                if (sidebar) {
                    sidebar.classList.remove('open');
                    sidebar.setAttribute('aria-hidden', 'false');
                    sidebar.removeAttribute('tabindex');
                }

                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.setAttribute('aria-label', 'Abrir mapa do checklist');
                }

                if (overlay) {
                    overlay.classList.remove('active', 'visible');
                    overlay.setAttribute('aria-hidden', 'true');
                }

                return;
            }

            if (sidebar) {
                sidebar.setAttribute('tabindex', '-1');
                sidebar.setAttribute('aria-hidden', String(!sidebarIsOpen));
            }

            updateMenuAccessibility(sidebarIsOpen);

            if (!sidebarIsOpen) {
                document.body.style.overflow = '';
                hideOverlay(true);
            }
        }

        function getSectionCheckboxes(section) {
            if (!section) {
                return [];
            }

            return Array.from(
                section.querySelectorAll(
                    'input.custom-checkbox[type="checkbox"]'
                )
            );
        }

        function updateProgress(section) {
            if (!section) {
                return;
            }

            const checkboxes = getSectionCheckboxes(section);
            const total = checkboxes.length;
            const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
            const percentage = total > 0
                ? Math.round((completed / total) * 100)
                : 0;

            const progressElement = section.querySelector('.progress-pill');
            const progressText = section.querySelector('.progress-pill-text');
            const progressFill = section.querySelector('.progress-fill');

            if (progressText) {
                progressText.textContent = `${completed}/${total}`;
            }

            if (progressFill) {
                progressFill.style.width = `${percentage}%`;
            }

            if (progressElement) {
                progressElement.setAttribute('aria-valuemin', '0');
                progressElement.setAttribute('aria-valuemax', String(total));
                progressElement.setAttribute('aria-valuenow', String(completed));
                progressElement.setAttribute(
                    'aria-valuetext',
                    `${completed} de ${total} ${total === 1 ? 'tarefa concluída' : 'tarefas concluídas'}`
                );
            }
        }

        function updateAllProgress() {
            sections.forEach((section) => {
                updateProgress(section);
            });
        }

        function updateCheckedRow(input) {
            if (!input || input.type !== 'checkbox') {
                return;
            }

            const row = input.closest('.table-row');

            if (row) {
                row.classList.toggle('row-checked', input.checked);
            }
        }

        function loadSavedValues() {
            dynamicInputs.forEach((input) => {
                if (!input.id) {
                    return;
                }

                const savedValue = storage.get(input.id);

                if (savedValue === null) {
                    updateCheckedRow(input);
                    return;
                }

                if (input.type === 'checkbox') {
                    input.checked = savedValue === 'true';
                    updateCheckedRow(input);
                    return;
                }

                input.value = savedValue;
            });

            updateAllProgress();
        }

        function saveInputValue(input) {
            if (!input || !input.id) {
                return;
            }

            if (input.type === 'checkbox') {
                storage.set(input.id, input.checked);
                updateCheckedRow(input);

                const section = input.closest('.case-section');

                if (section) {
                    updateProgress(section);
                }

                return;
            }

            storage.set(input.id, input.value);
        }

        function getScrollOffset() {
            return isDesktop() ? 32 : 80;
        }

        function scrollToSection(section) {
            if (!section) {
                return;
            }

            const targetPosition =
                section.getBoundingClientRect().top +
                window.scrollY -
                getScrollOffset();

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: reducedMotionQuery.matches ? 'auto' : 'smooth'
            });
        }

        function setActiveSection(sectionId) {
            if (!sectionId) {
                return;
            }

            indexLinks.forEach((link) => {
                const isActive = link.getAttribute('href') === `#${sectionId}`;

                link.classList.toggle('active', isActive);

                if (isActive) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });

            if (mobileTitleSub && sectionNames[sectionId]) {
                mobileTitleSub.textContent = sectionNames[sectionId];
            }
        }

        function findActiveSection() {
            if (sections.length === 0) {
                return null;
            }

            const referencePosition = window.scrollY + getScrollOffset() + 24;
            let activeSection = sections[0];

            sections.forEach((section) => {
                if (section.offsetTop <= referencePosition) {
                    activeSection = section;
                }
            });

            const viewportBottom = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (
                viewportBottom >= documentHeight - 2 &&
                sections.length > 0
            ) {
                activeSection = sections[sections.length - 1];
            }

            return activeSection;
        }

        function updateActiveSection() {
            const activeSection = findActiveSection();

            if (activeSection && activeSection.id) {
                setActiveSection(activeSection.id);
            }
        }

        function handleScroll() {
            if (scrollFramePending) {
                return;
            }

            scrollFramePending = true;

            window.requestAnimationFrame(() => {
                updateActiveSection();
                scrollFramePending = false;
            });
        }

        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                if (sidebarIsOpen || sidebar.classList.contains('open')) {
                    closeSidebar({ returnFocus: true });
                } else {
                    openSidebar();
                }
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                closeSidebar({ returnFocus: true });
            });

            overlay.addEventListener('transitionend', (event) => {
                if (
                    event.propertyName === 'opacity' &&
                    !overlay.classList.contains('active')
                ) {
                    clearOverlayTimer();
                    overlay.classList.remove('visible');
                }
            });
        }

        document.addEventListener('keydown', (event) => {
            if (
                event.key === 'Escape' &&
                sidebar &&
                sidebar.classList.contains('open')
            ) {
                event.preventDefault();
                closeSidebar({ returnFocus: true });
            }
        });

        indexLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetSelector = link.getAttribute('href');

                if (!targetSelector || !targetSelector.startsWith('#')) {
                    return;
                }

                const targetSection = document.querySelector(targetSelector);

                if (!targetSection) {
                    return;
                }

                event.preventDefault();
                setActiveSection(targetSection.id);

                if (!isDesktop()) {
                    closeSidebar();
                }

                scrollToSection(targetSection);

                if (window.history && typeof window.history.replaceState === 'function') {
                    window.history.replaceState(null, '', targetSelector);
                }
            });
        });

        dynamicInputs.forEach((input) => {
            if (!input.id) {
                return;
            }

            const eventName = input.type === 'checkbox' ? 'change' : 'input';

            input.addEventListener(eventName, () => {
                saveInputValue(input);
            });
        });

        if (typeof desktopMediaQuery.addEventListener === 'function') {
            desktopMediaQuery.addEventListener('change', () => {
                synchronizeResponsiveState();
                updateActiveSection();
            });
        } else if (typeof desktopMediaQuery.addListener === 'function') {
            desktopMediaQuery.addListener(() => {
                synchronizeResponsiveState();
                updateActiveSection();
            });
        }

        window.addEventListener('resize', () => {
            synchronizeResponsiveState();
            handleScroll();
        }, { passive: true });

        window.addEventListener('orientationchange', () => {
            window.setTimeout(() => {
                synchronizeResponsiveState();
                updateActiveSection();
            }, 100);
        });

        window.addEventListener('scroll', handleScroll, { passive: true });

        synchronizeResponsiveState();
        loadSavedValues();
        updateActiveSection();
    });
})();
