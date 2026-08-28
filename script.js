function toggleCard(btn) {
    const details = btn.nextElementSibling;
    const isOpen = details.classList.contains('open');
    details.classList.toggle('open');
    btn.textContent = isOpen ? 'Show Recipe' : 'Hide Recipe';
}

function initCategoryFilter() {
    const buttons = document.querySelectorAll('.cat-btn');
    const sections = document.querySelectorAll('.category-section-block');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const target = button.dataset.target;

            // update which button looks active
            buttons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');

            // show everything, or just the matching section
            sections.forEach((section) => {
                const matches = target === 'all' || section.id === target;
                section.style.display = matches ? '' : 'none';
            });
        });
    });
}

initCategoryFilter();