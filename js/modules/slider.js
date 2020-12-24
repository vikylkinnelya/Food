function slides() {
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
        dotsList[slideIdx - 1].style.opacity = 1; //горит активная
    }

    function deleteNotDig(str) {
        return +str.replace(/\D/g, '');
    }

    dotsList.forEach(el => el.addEventListener('click', (ev) => {
        slideIdx = ev.target.dataset.idx;
        offset = deleteNotDig(width);
        offset = deleteNotDig(width) * (slideIdx - 1);
        slidesField.style.transform = `translateX(-${offset}px)`;

        currSliderNumber.innerText = getZero(slideIdx); //добавить 0 к текущему номеру

        makeDotsOpacity();
    }));

    nextBtn.addEventListener('click', () => {
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

    prevBtn.addEventListener('click', () => {
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
}

module.exports = slides;