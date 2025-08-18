document.addEventListener('DOMContentLoaded', () => {
  const NEWS_DATA = [{"title": "Восстание фурри в МГЕ подавлено", "date": "2025-08-15", "text": "Власти МГЕ объявили о завершении операции против восставших фурри. Как стало известно, в штурме участвовали элитные формирования поддержки и известные местные спортсмены («качки»). В МГЕ вводится комендантский час, армия союзников (Сухариков и Бульбазаврии) остаётся в состоянии повышенной боевой готовности. Также стоит отметить что в помощь ещё оказавали такие страны как Кириешки Сухарики Бульбазаврия и другие."}, {"title": "Кириешки готовятся к переименованию страны", "date": "2025-08-10", "text": "По инициативе коммунистического правительства в Кириешках назначен референдум о смене названия страны. Предлагаются варианты вроде «Новые Кириешки» и «Советские Кириевци». Международные наблюдатели отмечают спокойную атмосферу – крупных протестов не наблюдается."}, {"title": "Союзники проводят совместные учения", "date": "2025-08-01", "text": "Сообщается, что армии МГЕ, Сухариков и Бульбазаврии проводят масштабные учения на границе с Кириешками. Официально это демонстрация силы и готовности к обороне. Жители приграничных городов эвакуируются, напряжение растёт."}, {"title": "Заявление президента Кириешек Михаила", "date": "2025-08-18", "text": "Президент Кириешек Михаил выступил с заявлением, в котором сообщил, что в подавлении восстания фурри поддержку оказывали все страны: МГЕ, Кириешки, Сухарики, Бульбазаврия, Огурцы, Аксолотли и Помидоры. Независимые источники пока не подтвердили полноту этих утверждений; часть аналитиков отмечает, что заявления требуют дополнительной проверки. В выступлении также упомянуто, что Огурцы и Аксолотли находятся в зависимости от Кириешек. Михаил сообщил о планах временно отойти от государственных обязанностей и покинуть страну в ближайшее время. Примечание: аудиофайлы недоступны."}];

  const articlesContainer = document.getElementById('articles');
  const modal = document.getElementById('modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalDate = document.getElementById('modal-date');
  const modalBody = document.getElementById('modal-body');

  function excerpt(text, n = 180){
    if(text.length <= n) return text;
    return text.slice(0, n).trim() + '…';
  }

  function openModal(item){
    modalTitle.textContent = item.title;
    modalDate.textContent = item.date;
    modalBody.textContent = item.text;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal(){
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalBackdrop.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });

  function renderArticles(list){
    articlesContainer.innerHTML = '';
    if(!Array.isArray(list) || list.length === 0){
      articlesContainer.innerHTML = '<p style="color:var(--muted)">Пока нет доступных новостей.</p>';
      return;
    }
    list.forEach(item => {
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
      el.addEventListener('click', () => openModal(item));
      el.addEventListener('keydown', (e) => { if(e.key === 'Enter') openModal(item); });
      articlesContainer.appendChild(el);
    });
  }

  // Render embedded news immediately
  renderArticles(NEWS_DATA);
});