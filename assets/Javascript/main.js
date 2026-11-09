function formatDate(date) {
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
}

function getTodayDate() {
    return formatDate(new Date());
}

function escapeHTML(value) {
    var symbols = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
        return symbols[char];
    });
}

function setActiveLink() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('nav a');

    for (var i = 0; i < links.length; i++) {
        links[i].classList.toggle('active', links[i].getAttribute('href') === currentPage);
    }
}

setActiveLink();