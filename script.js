function toggleCard(btn) {
    const details = btn.nextElementSibling;
    const isOpen = details.classList.contains('open');
    details.classList.toggle('open');
    btn.textContent = isOpen ? 'Show Recipe' : 'Hide Recipe';
}