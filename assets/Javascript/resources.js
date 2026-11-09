var resourceButtons = document.querySelectorAll('.resource-filter');
var resourceCards = document.querySelectorAll('.resource-card');

resourceButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        var category = button.getAttribute('data-category');

        resourceButtons.forEach(function (btn) {
            btn.classList.remove('active');
        });

        button.classList.add('active');

        resourceCards.forEach(function (card) {
            var show = category === 'all' || card.getAttribute('data-category') === category;

            card.style.display = show ? '' : 'none';
        });
    });
});