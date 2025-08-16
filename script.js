// Основная логика: загружаем news.json, формируем карточки, реализуем навигацию
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('news-track');
  const viewport = document.getElementById('news-viewport');
  const prevBtn = document.getElementById('news-prev');
  const nextBtn = document.getElementById('news-next');
  const dotsContainer = document.getElementById('news-dots');

  let items = [];
  let currentIndex = 0;

  function createCard(item){
    const card = document.createElement('article');
    card.className = 'news-card';

    const title = document.createElement('h3');
    title.textContent = item.title;

    const time = document.createElement('time');
    time.textContent = item.date;

    const text = document.createElement('p');
    text.textContent = item.text;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = 'Подробнее →';

    card.appendChild(title);
    card.appendChild(time);
    card.appendChild(text);
    card.appendChild(meta);

    return card;
  }

  function buildUI(newsList){
    items = newsList;
    track.innerHTML = '';
    newsList.forEach(it => {
      const c = createCard(it);
      track.appendChild(c);
    });

    buildDots();
    updateBtns();
  }

  function buildDots(){
    dotsContainer.innerHTML = '';
    // Количество "страниц" = ceil(total / perView) — мы используем ширину viewport
    const perView = getPerView();
    const pages = Math.max(1, Math.ceil(items.length / perView));
    for(let i=0;i<pages;i++){
      const b = document.createElement('button');
      if(i===0) b.classList.add('active');
      b.addEventListener('click', ()=>{
        goTo(i);
      });
      dotsContainer.appendChild(b);
    }
  }

  function getPerView(){
    // Определяем сколько карточек показываем одновременно по ширине
    const vw = viewport.clientWidth;
    return vw > 900 ? 2 : 1;
  }

  function updateBtns(){
    const perView = getPerView();
    const maxIndex = Math.max(0, Math.ceil(items.length / perView) - 1);
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= maxIndex;
    // Обновляем точки
    Array.from(dotsContainer.children).forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentIndex);
    });
  }

  function goTo(pageIndex){
    // Скроллим track влево/вправо — применяем transform
    const perView = getPerView();
    const shift = pageIndex * viewport.clientWidth; // прокрутка на ширину viewport
    track.style.transform = `translateX(-${shift}px)`;
    currentIndex = pageIndex;
    updateBtns();
    createRipple(viewport);
  }

  function next(){
    const perView = getPerView();
    const pages = Math.max(1, Math.ceil(items.length / perView));
    if(currentIndex < pages - 1){
      goTo(currentIndex + 1);
    } else {
      // можно зациклить — но пока просто остаёмся
      createRipple(viewport);
    }
  }

  function prev(){
    if(currentIndex > 0){
      goTo(currentIndex - 1);
    } else {
      createRipple(viewport);
    }
  }

  // Ripple: создаём круг и запускаем анимацию в центре вьюпорта
  function createRipple(container){
    const rect = container.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    // размер круга зависит от большей стороны
    const size = Math.max(rect.width, rect.height) * 1.3;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = rect.width/2 + 'px';
    ripple.style.top = rect.height/2 + 'px';
    container.appendChild(ripple);
    // удалить после завершения анимации
    ripple.addEventListener('animationend', ()=> ripple.remove());
  }

  // Обработчики кнопок
  prevBtn.addEventListener('click', ()=>{
    prev();
  });
  nextBtn.addEventListener('click', ()=>{
    next();
  });

  // при ресайзе пересчитываем UI и корректируем transform
  window.addEventListener('resize', ()=>{
    // пересчитаем transform по текущей странице
    goTo(currentIndex);
    buildDots();
  });

  // Загружаем новости
  fetch('news.json')
    .then(r => r.json())
    .then(data => {
      buildUI(data);
      // Подготовка initial layout — track ширина в зависимости от количества карточек
      // Чтобы transform: translateX работал в px, укажем track ширину равной сумме карточек
      // Но карточки имеют flex-basis и min-width; для простоты устанавливаем track ширину в auto —
      // мы используем translateX по ширине viewport.
      // Установим небольшую задержку, чтобы браузер применил стили
      setTimeout(()=> goTo(0), 80);
    })
    .catch(err => {
      console.error('Ошибка загрузки новостей', err);
      track.innerHTML = '<p style="padding:20px;color:var(--muted)">Не удалось загрузить новости.</p>';
    });
});