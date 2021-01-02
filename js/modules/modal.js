function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('hide');
    modal.classList.remove('show');

    //modal.classList.toggle('show'); //если есть убираем

    //modal.style.display = 'none';
    document.body.style.overflow = ''; //вернуть прокрутку при закрытии модальног окна
}

function modalOpen(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide');

    //modal.classList.toggle('show'); //если нет добавляем

    //modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; //экран за модальным окном не прокручивается
    console.log(modalTimerId);
    if (modalTimerId) {
        clearInterval(modalTimerId); //после модала он не открывается еще раз
    } 
}

function modal(trigerSelector, modalSelector, modalTimerId) {

    const modalTrigger = document.querySelectorAll(trigerSelector),
        modal = document.querySelector(modalSelector);

    modalTrigger.forEach(el => {
        el.addEventListener('click', () => modalOpen(modalSelector, modalTimerId)); 
        //чтобы модалопен не вызывалась сразу же
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            //при клике на подложку или на крестик закрывается
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (ev) => { //при нажатии на клавиатуру
        if (ev.code === 'Escape' && modal.style.display == 'block') {
            closeModal(modalSelector);
        }
    });

    

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight == document.documentElement.scrollHeight) {
            modalOpen(modalSelector, modalTimerId);
            removeEventListener('scroll', showModalByScroll); //после открытия один раз это событие удалыетс
        }
    }
    //window.pageYOffset сколько пролистал 
    //document.documentElement.clientHeight видимая часть для клиента

    window.addEventListener('scroll', showModalByScroll);
    
}

export default modal;
export {
    closeModal
};
export {
    modalOpen
};