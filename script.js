function toggleCard(btn) {
    const details = btn?.nextElementSibling;

    if (!details || !details.classList) {
        return;
    }

    const isOpen = details.classList.contains('open');
    const nextState = !isOpen;

    details.classList.toggle('open', nextState);
    btn.textContent = nextState ? 'Hide Recipe' : 'Show Recipe';
    btn.setAttribute('aria-expanded', String(nextState));
}

function initCategoryFilter() {
    const buttons = document.querySelectorAll('.cat-btn');
    const sections = document.querySelectorAll('.category-section-block');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const target = button.dataset.target;

            buttons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');

            sections.forEach((section) => {
                const matches = target === 'all' || section.id === target;
                section.style.display = matches ? '' : 'none';
                section.hidden = !matches;
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card-expand-btn').forEach((button) => {
        button.onclick = null;
        button.addEventListener('click', () => toggleCard(button));
    });

    initCategoryFilter();
});

window.toggleCard = toggleCard;
window.initCategoryFilter = initCategoryFilter;