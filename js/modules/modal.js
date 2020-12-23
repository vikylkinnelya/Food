function modal() {
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

}

module.exports = modal;