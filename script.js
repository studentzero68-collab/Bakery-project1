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

function assignRecipeAudienceTags() {
    document.querySelectorAll('.recipe-card').forEach((card) => {
        const audiences = [];

        card.querySelectorAll('.rel-tag').forEach((tag) => {
            if (tag.classList.contains('rel-family')) audiences.push('family');
            if (tag.classList.contains('rel-friend')) audiences.push('friend');
            if (tag.classList.contains('rel-lover')) audiences.push('romantic');
        });

        card.dataset.audience = audiences.join(' ');
    });
}

function applyRelationshipFilter() {
    const activeFilter = document.querySelector('.relationship-btn.active')?.dataset.relationship || 'all';
    const sections = document.querySelectorAll('.category-section-block');

    document.querySelectorAll('.recipe-card').forEach((card) => {
        const section = card.closest('.category-section-block');
        const sectionHidden = section && (section.style.display === 'none' || section.hidden);
        const audiences = card.dataset.audience ? card.dataset.audience.split(' ') : [];
        const matches = activeFilter === 'all' || audiences.includes(activeFilter);
        const cardVisible = !sectionHidden && matches;

        card.style.display = cardVisible ? '' : 'none';
    });

    sections.forEach((section) => {
        const visibleCards = [...section.querySelectorAll('.recipe-card')].some((card) => card.style.display !== 'none');
        if (section.dataset.hiddenByCategory === 'true') {
            section.style.display = 'none';
        }
        if (activeFilter !== 'all' && !visibleCards && !section.classList.contains('placeholder-card')) {
            section.style.display = 'none';
        }
    });
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
                section.dataset.hiddenByCategory = String(!matches);
            });

            applyRelationshipFilter();
        });
    });
}

function initRelationshipFilter() {
    const filter = document.querySelector('.relationship-filter');
    const toggle = document.querySelector('.filter-toggle');
    const buttons = document.querySelectorAll('.relationship-btn');

    if (toggle) {
        toggle.addEventListener('click', () => {
            const isOpen = filter.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            buttons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            applyRelationshipFilter();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card-expand-btn').forEach((button) => {
        button.onclick = null;
        button.addEventListener('click', () => toggleCard(button));
    });

    assignRecipeAudienceTags();
    initCategoryFilter();
    initRelationshipFilter();
    applyRelationshipFilter();
});

window.toggleCard = toggleCard;
window.initCategoryFilter = initCategoryFilter;
window.initRelationshipFilter = initRelationshipFilter;