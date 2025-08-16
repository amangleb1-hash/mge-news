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
    const vw = viewport.clientWidth;
    return vw > 900 ? 2 : 1;
  }

  function updateBtns(){
    const perView = getPerView();
    const maxIndex = Math.max(0, Math.ceil(items.length / perView) - 1);
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= maxIndex;
    Array.from(dotsContainer.children).forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentIndex);
    });
  }

  function goTo(pageIndex){
    const perView = getPerView();
    const shift = pageIndex * viewport.clientWidth;
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

  function createRipple(container){
    const rect = container.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 1.3;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = rect.width/2 + 'px';
    ripple.style.top = rect.height/2 + 'px';
    container.appendChild(ripple);
    ripple.addEventListener('animationend', ()=> ripple.remove());
  }

  prevBtn.addEventListener('click', ()=>{
    prev();
  });
  nextBtn.addEventListener('click', ()=>{
    next();
  });

  window.addEventListener('resize', ()=>{
    goTo(currentIndex);
    buildDots();
  });

  // Загружаем новости
  fetch('news.json')
    .then(r => r.json())
    .then(data => {
      buildUI(data);
      setTimeout(()=> goTo(0), 80);
    })
    .catch(err => {
      console.error('Ошибка загрузки новостей', err);
      // Не показываем текст ошибки пользователю — просто оставляем пустой трек
      track.innerHTML = '';
    });
});