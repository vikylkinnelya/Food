'use strict';

window.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tabheader__item'), //те три стиля питания
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items'); //родитель для последующего делегирования событий

    function hideTabContent() {
        tabsContent.forEach(tab => {
            tab.classList.add('hide');
            tab.classList.remove('show', 'fade');
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active'); //удаляем класс активности
        });
    }

    function showTabContent(i = 0) { //по умолчанию 0
        tabsContent[i].classList.add('show', 'fade'); //показать 
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('tabheader__item_active'); //добавляем класс активности, чтобы показывалось
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (ev) => { //обертка со всеми табами делегир одинаковое событие от клика на все
        const target = ev.target;
        if (target && target.classList.contains('tabheader__item')) { //ищем таб
            tabs.forEach((el, idx) => { //перебрать все табы
                if (target == el) { //сравнить табы с искомым
                    hideTabContent(); //скрыть старые табы
                    showTabContent(idx); //открыть новый искомый
                }
            });
        }
    });

    const deadline = '2020-12-31';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - new Date(),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`; //добавляется 0 если число однозначное
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector), //вводится при вызове функции
            days = timer.querySelector('#days'), // # for searching айди
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock(); //для того, чтобы часы обновлялись сразу после обновления странцы без перескока

        function updateClock() {
            const t = getTimeRemaining(endtime); //обьект со всеми временами 
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            stopClock();

            function stopClock() {
                if (t.total <= 0) { //если сегодняшняя дата больше дедлайна
                    clearInterval(timeInterval); //интервал очищается дедлайн не считается
                }
            }
        }
    }
    setClock('.timer', deadline);

    //modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach(el => {
        el.addEventListener('click', modalOpen);
    });

    function modalOpen() {
        modal.classList.add('show');
        modal.classList.remove('hide');

        //modal.classList.toggle('show'); //если нет добавляем

        //modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; //экран за модальным окном не прокручивается
        clearInterval(modalTimerId); //после модала он не открывается еще раз
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');

        //modal.classList.toggle('show'); //если есть убираем

        //modal.style.display = 'none';
        document.body.style.overflow = ''; //вернуть прокрутку при закрытии модальног окна
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            //при клике на подложку или на крестик закрывается
            closeModal();
        }
    });

    document.addEventListener('keydown', (ev) => { //при нажатии на клавиатуру
        if (ev.code === 'Escape' && modal.style.display == 'block') {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(modalOpen, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight == document.documentElement.scrollHeight) {
            modalOpen();
            removeEventListener('scroll', showModalByScroll); //после открытия один раз это событие удалыетс
        }
    }
    //window.pageYOffset сколько пролистал 
    //document.documentElement.clientHeight видимая часть для клиента

    window.addEventListener('scroll', showModalByScroll);

    class FoodCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAN();
        }
        changeToUAN() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;
            this.parent.append(element);
        }
    }

    /* 
    //без axios
    getResourse('http://localhost:3000/menu') 
        .then(data => {
            data.forEach(({ img, altimg, title, descr, price}) => { //деструктуриз
                new FoodCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        }); 
        
    const getResourse = async (url) => { //настраивает запрос 
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Couldnt fetch ${url}, status: ${res.status}`);
        }

        return await res.json(); //дожидаетс и возвращает промис
    };    
    */

    axios.get('http://localhost:3000/menu')
        .then(data => data.data.forEach(({ img, altimg, title, descr, price}) => { //деструктуриз
                new FoodCard(img, altimg, title, descr, price, '.menu .container').render();
        }));

    /* 
    //вариант 2
    getResourse('http://localhost:3000/menu')
        .then(data => createCard(data)); // получает масив

    function createCard(data) {
        data.forEach(({
            img,
            altimg,
            title,
            descr,
            price
        }) => {
            const element = document.createElement('div');
            element.classList.add('menu__item');
            element.innerHTML = `
                <img src=${img} alt=${altimg}>
                <h3 class="menu__item-subtitle">${title}</h3>
                <div class="menu__item-descr">${descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${price}</span> грн/день</div>
                </div>
            `;
            document.querySelector('.menu .container').append(element);
        });
    } */

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с Вами свяжемся',
        fail: 'Что-то пошло не так.',
    };

    forms.forEach(el => {
        bindPostData(el);
    });

    const postData = async (url, data) => { //настраивает запрос 
        const res = await fetch(url, { //дождаться результата
            method: 'POST', //посылает запрос на сервер
            headers: {
                'Content-type': 'application/json; charset = UTF-8'
            },
            body: data
        });
        return await res.json(); //дожидаетс и возвращает промис
    };


    function bindPostData(form) {
        form.addEventListener('submit', (ev) => {
            ev.preventDefault(); //без перезагрузки страницы

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto; 
            `; //по центру

            form.insertAdjacentElement('afterend', statusMessage); //вставка изображения под формой(после нее)

            const formData = new FormData(form); //собираем все данные из формы
            //если данные идут на сервер то в html inputa нужно всегда указывать name

            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            //берем данные с формы, превр в массив массивов, после в обьект, после в джос 

            //request.send(formData); //без json
            //request.send(json);

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data); //результат ответа из сервера
                    showThanksModal(message.success); //показать сообщение пользователю что все хорошо
                    statusMessage.remove();
                }).catch(() => { //в плохом случае
                    showThanksModal(message.fail); //показать сообщ что всё плохо
                }).finally(() => { // в любом случае
                    form.reset(); //сбрасывем форму
                });
        });
    }

    function showThanksModal(message) {
        const prevModal = document.querySelector('.modal__dialog');
        prevModal.classList.add('hide');
        modalOpen();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        modal.append(thanksModal);

        setTimeout(() => {
            thanksModal.remove(); //посл 4сек удалется окно благодарн
            prevModal.classList.add('show'); //и возвращается норм модал
            prevModal.classList.remove('hide'); //на будушее если его снова откроют
            closeModal(); //и закрывается модалка вообще
        }, 40000);
    }
    fetch('http://localhost:3000/menu')
        .then(data => data.json());

    const slides = document.querySelectorAll('.offer__slide'),
        prevBtn = document.querySelector('.offer__slider-prev'),
        nextBtn = document.querySelector('.offer__slider-next'),
        currSliderNumber = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width,
        slider = document.querySelector('.offer__slider'),
        indicators = document.createElement('ol'), //точечки слайдера
        dotsList = []; //для установки актив/нет

    let slideIdx = 1,
        totalSliderCount = document.querySelector('#total'),
        offset = 0;
        
    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden'; //скрыть все эл, кот не в зоне видимости

    slides.forEach(slide => slide.style.width = width); //для всех слайдов одинаковую ширину

    slider.style.position = 'relative';
    
    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for (let i = 1; i <= slides.length; i++) {
        const dot = document.createElement('li'); 
        dot.classList.add('dot');
        dot.dataset.idx = `${i}`;
        if (i == 1) {
            dot.style.opacity = 1; //первая кнопка сначала всегда активна
        }
        indicators.append(dot);
        dotsList.push(dot);
    }

    function makeDotsOpacity() {
        dotsList.forEach(el => el.style.opacity = '0.5'); //все кнопки гаснут
        dotsList[slideIdx-1].style.opacity = 1; //горит активная
    }

    function deleteNotDig(str) {
        return +str.replace(/\D/g, '');
    }

    dotsList.forEach( el => el.addEventListener('click', (ev) => {
        slideIdx = ev.target.dataset.idx;
        offset = deleteNotDig(width);
        offset = deleteNotDig(width) * (slideIdx-1);
        slidesField.style.transform = `translateX(-${offset}px)`; 
        
        currSliderNumber.innerText = getZero(slideIdx); //добавить 0 к текущему номеру
        
        makeDotsOpacity();
    }));

    nextBtn.addEventListener('click',() => {
        if (offset == deleteNotDig(width) * (slides.length - 1)) { //если максимум, перейти в начало
            offset = 0;
        } else {
            offset += deleteNotDig(width); //отступ увеличивается на один слайд
        }
        slidesField.style.transform = `translateX(-${offset}px)`;
        
        if (slideIdx == slides.length) { 
            slideIdx = 1; //если у самого конца -- перейти в начало
        } else {
            slideIdx++;
        }
        
        currSliderNumber.innerText = getZero(slideIdx);
        
        makeDotsOpacity();
    });

    prevBtn.addEventListener('click',() => {
        if (offset == 0) { //если минимум -- перейти в конец
            offset = deleteNotDig(width) * (slides.length - 1);
        } else {
            offset -= deleteNotDig(width); //уменьшение отступа на один слайд
        }
        slidesField.style.transform = `translateX(-${offset}px)`;
    
        if (slideIdx == 1) {
            slideIdx = slides.length; //если у самого начала -- перейти в конец
        } else {
            slideIdx--;
        }
        
        currSliderNumber.innerText = getZero(slideIdx);

        makeDotsOpacity();
    });
    
    currSliderNumber.innerText = getZero(slideIdx);
    getZero(totalSliderCount.textContent);

    /*
    //вариант попроще
    function showSliders(curr = slideIdx) {
        slides.forEach( el => el.classList.add('hide'));
        
        if (curr > slides.length) {
            slideIdx = 1;
        }
        if (curr < 1) {
            slideIdx = 1;
        }
        
        slides[slideIdx-1].classList.remove('hide');
        slides[slideIdx-1].classList.add('show');
        
        currSliderNumber.innerText = getZero(slideIdx);
    }
    showSliders();

    nextBtn.addEventListener('click', (ev) => {
        slideIdx++;
        showSliders(slideIdx);
        
    });

    prevBtn.addEventListener('click', (ev) => {
        slideIdx--;
        showSliders(slideIdx);
    }); */

    
    const result = document.querySelector('.calculating__result span');
    
    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }
    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function calcTotal () {
        if (!sex || !height || !weight || !age || !ratio){ //если чтото не заполнено
            result.textContent = ('_____');
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }
    calcTotal();

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.remove(activeClass);
            if (el.getAttribute('id') === localStorage.getItem('sex')) {
                el.classList.add(activeClass);
            }
            if (el.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                el.classList.add(activeClass);
            }       
        });
    }
    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');


    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector); //все дивы внутри родителя

        elements.forEach( el => {
            el.addEventListener('click', (ev) => {
                if (ev.target.getAttribute('data-ratio')) { 
                    ratio = +ev.target.getAttribute('data-ratio'); //рацион
                    localStorage.setItem('ratio', +ev.target.getAttribute('data-ratio')); //сохр в браузере знач польз
                } else {
                    sex = ev.target.getAttribute('id'); //получаем пол
                    localStorage.setItem('sex', ev.target.getAttribute('id')); //сохр в браузере значение пользователя
                }
                elements.forEach(el => el.classList.remove(activeClass)); //скрыть активн неактивных
            
                ev.target.classList.add(activeClass); //класс активности для выбранного
                calcTotal();
            });
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active'); //для пола
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active'); //для физ активности

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) { //при вводе букв
                input.style.boxShadow = '0px 4px 13px 5px rgba(255, 0, 0, 0.2)'; //горит подсветка
            } else {
                input.style.boxShadow = '0 4px 15px rgba(0,0,0,.2)'; //если цифры , подсветка убирается
            }
            
            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');


});
