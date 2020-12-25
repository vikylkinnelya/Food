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

export {postData};