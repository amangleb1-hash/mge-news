// Загрузка и отображение списка статей; при клике открывается модальное окно с полным текстом
document.addEventListener('DOMContentLoaded', () => {
  const articlesContainer = document.getElementById('articles');
  const modal = document.getElementById('modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalDate = document.getElementById('modal-date');
  const modalBody = document.getElementById('modal-body');

  // helper: сокращение текста для превью (примерно 160 символов)
  function excerpt(text, n = 160){
    if(text.length <= n) return text;
    return text.slice(0, n).trim() + '…';
  }

  function openModal(item){
    modalTitle.textContent = item.title;
    modalDate.textContent = item.date;
    modalBody.textContent = item.text;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // focus for accessibility
    modalClose.focus();
  }

  function closeModal(){
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalBackdrop.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeModal();
  });

  // загрузка новостей
  fetch('news.json')
    .then(r => r.json())
    .then(data => {
      if(!Array.isArray(data) || data.length === 0){
        articlesContainer.innerHTML = '<p style="color:var(--muted)">Пока нет доступных новостей.</p>';
        return;
      }
      data.forEach(item => {
        const el = document.createElement('article');
        el.className = 'article';
        el.tabIndex = 0;
        const h = document.createElement('h3');
        h.textContent = item.title;
        const t = document.createElement('time');
        t.textContent = item.date;
        const p = document.createElement('p');
        p.textContent = excerpt(item.text, 180);
        el.appendChild(h);
        el.appendChild(t);
        el.appendChild(p);
        // открываем модал при клике или Enter
        el.addEventListener('click', () => openModal(item));
        el.addEventListener('keydown', (e) => { if(e.key === 'Enter') openModal(item); });
        articlesContainer.appendChild(el);
      });
    })
    .catch(err => {
      console.error('Ошибка загрузки новостей', err);
      articlesContainer.innerHTML = '<p style="color:var(--muted)">Пока нет доступных новостей.</p>';
    });
});