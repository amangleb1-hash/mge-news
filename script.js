function openArticle(title, text) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-text').innerText = text;
    document.getElementById('article-modal').style.display = 'block';
}

function closeArticle() {
    document.getElementById('article-modal').style.display = 'none';
}

// Закрытие по клику вне окна
window.onclick = function(event) {
    let modal = document.getElementById('article-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}