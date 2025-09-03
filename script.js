const NEWS_DATA = [
  {
    "title": "Кириешки взяли под контроль территории Помидоров, чтобы помешать нападению МГЕ",
    "date": "2025-08-19",
    "text": "Правительство Кириешек объявило о быстрой операции по взятию под контроль ряда приграничных территорий Помидоров. Официальная причина — предотвращение возможной операции МГЕ против Помидоров. Власти Кириешек заявили, что шаг направлен на защиту гражданской инфраструктуры и стабилизацию региона. МГЕ ранее направляло запрос о «добровольной возможности» действий против Помидоров; согласно последним данным, Кириешки предпочли действовать превентивно. Независимые наблюдатели призывают к немедленной дипломатии, чтобы снизить риск дальнейшей эскалации."
  },
  {
    "title": "МГЕ запросило у Кириешек разрешение не вмешиваться в операцию против Помидоров",
    "date": "2025-08-18",
    "text": "По данным официального представителя МГЕ, правительство МГЕ направило в адрес Кириешек формальную просьбу с требованием воздержаться от вмешательства в возможную операцию против государства Помидоры и не оказывать ему защиту. В обращении подчёркивается требование о «добровольной возможности» для действий МГЕ против Помидоров. В Кириешках пока не поступил официальный ответ. Международные наблюдатели отмечают, что подобные запросы серьёзно повышают уровень напряжённости в регионе и могут привести к эскалации, если не будут разрешены дипломатически. Независимая проверка фактов продолжается."
  },
  {
    "title": "Заявление президента Кириешек Михаила",
    "date": "2025-08-18",
    "text": "Президент Кириешек Михаил выступил с заявлением, в котором сообщил, что в подавлении восстания фурри поддержку оказывали все страны: МГЕ, Кириешки, Сухарики, Бульбазаврия, Огурцы, Аксолотли и Помидоры. Независимые источники пока не подтвердили полноту этих утверждений; часть аналитиков отмечает, что заявления требуют дополнительной проверки. В выступлении также упомянуто, что Огурцы и Аксолотли находятся в зависимости от Кириешек. Михаил сообщил о планах временно отойти от государственных обязанностей и покинуть страну в ближайшее время. Примечание: аудиофайлы недоступны."
  },
  {
    "title": "Союзники проводят совместные учения",
    "date": "2025-08-01",
    "text": "Сообщается, что армии МГЕ, Сухариков и Бульбазаврии проводят масштабные учения на границе с Кириешками. Официально это демонстрация силы и готовности к обороне. Жители приграничных городов эвакуируются, напряжение растёт."
  },
  {
    "title": "Кириешки готовятся к переименованию страны",
    "date": "2025-08-10",
    "text": "По инициативе коммунистического правительства в Кириешках назначен референдум о смене названия страны. Предлагаются варианты вроде «Новые Кириешки» и «Советские Кириевци». Международные наблюдатели отмечают спокойную атмосферу – крупных протестов не наблюдается."
  },
  {
    "title": "Восстание фурри в МГЕ подавлено",
    "date": "2025-08-15",
    "text": "Власти МГЕ объявили о завершении операции против восставших фурри. Как стало известно, в штурме участвовали элитные формирования поддержки и известные местные спортсмены («качки»). В МГЕ вводится комендантский час, армия союзников (Сухариков и Бульбазаврии) остаётся в состоянии повышенной боевой готовности."
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // NEWS_DATA embedded by server-side when generating file
  if(typeof NEWS_DATA === 'undefined') { NEWS_DATA = []; }

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

  // Determine mode: all or latest-3
  const showAll = window.SHOW_ALL === true;
  if(showAll){
    renderArticles(NEWS_DATA);
  } else {
    // sort by date descending just in case, then take first 3
    const sorted = NEWS_DATA.slice().sort((a,b) => b.date.localeCompare(a.date));
    renderArticles(sorted.slice(0,3));
  }
});