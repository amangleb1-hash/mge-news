document.addEventListener('DOMContentLoaded', function() {
  fetch('news.json')
    .then(response => response.json())
    .then(newsList => {
      const container = document.getElementById('news');
      newsList.forEach(item => {
        const article = document.createElement('article');
        const title = document.createElement('h3');
        const date = document.createElement('time');
        const text = document.createElement('p');
        title.textContent = item.title;
        date.textContent = item.date;
        text.textContent = item.text;
        article.appendChild(title);
        article.appendChild(date);
        article.appendChild(text);
        container.appendChild(article);
      });
    })
    .catch(err => console.error('Ошибка загрузки новостей:', err));
});
