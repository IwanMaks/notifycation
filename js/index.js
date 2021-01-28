let data = []
const cards = document.querySelector('.cards')

const logicDate = (date, name) => {
    if (date-Date.now() < 0) {
        new Notification('Уведомление от календаря', {
            body: 'Конференция ' + name + ' закончилась',
            icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
        });
        localStorage.removeItem(name)
    } else if (date-Date.now() < 345600000 && date-Date.now() > 172800000 && !localStorage.getItem(name+'-3')){
        new Notification('Уведомление от календаря', {
            body: 'Конференция ' + name + ' начнётся через 3 дня',
            icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
        });
        localStorage.setItem(name+'-3', 'true')
    } else if (date-Date.now() < 691200000 && date-Date.now() > 518400000 && !localStorage.getItem(name+'-7')) {
        new Notification('Уведомление от календаря', {
            body: 'Конференция ' + name + ' начнётся через 7 дней',
            icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
        });
        localStorage.setItem(name+'-7', 'true')
    } else if (date-Date.now() < 1296000000 && date-Date.now() > 1123200000 && !localStorage.getItem(name+'-14')) {
        new Notification('Уведомление от календаря', {
            body: 'Конференция ' + name + ' начнётся через 14 дней',
            icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
        });
        localStorage.setItem(name+'-14', 'true')
    }
}

const setNotifyReload = (data) => {
    data.forEach(item => {
        if (localStorage.getItem(item.name)) {
            const date = Date.parse(localStorage.getItem(item.name))
            logicDate(date, item.name)
        }
    })
}

const trueNotify = name => {
    new Notification('Уведомление от календаря', {
        body: 'Теперь вы получите уведомление о конференции ' + name,
        icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
    });

    const date = Date.parse(localStorage.getItem(name))

    logicDate(date, name)
}

const setNotify = event => {
    const date = event.target.dataset.date
    const name = event.target.dataset.name

    localStorage.setItem(name, date)

    if (!("Notification" in window)) {
        alert('Ваш браузер не поддерживает HTML Notifications, его необходимо обновить.');
    } else if (Notification.permission === "granted") {
        trueNotify(name)
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                trueNotify(name)
            } else {
                alert('Вы запретили показывать уведомления');
            }
        });
    }
}

const dateFormat = date => {
    switch (date.slice(5, 7)) {
        case '01':
            return 'Января'
        case '02':
            return 'Фервраля'
        case '03':
            return 'Марта'
        case '04':
            return 'Апреля'
        case '05':
            return 'Мая'
        case '06':
            return 'Июня'
        case '07':
            return 'Июля'
        case '08':
            return 'Августа'
        case '09':
            return 'Сентября'
        case '10':
            return 'Октября'
        case '11':
            return 'Ноября'
        case '12':
            return 'Декабря'
    }
}

const renderCard = confData => {
    confData.forEach(item => {
        let place = ''
        let date = ''
        let twitter = ''
        if (item.city && item.country) {
            place = `
                <div class="place-and-date">
                    <div class="place">${item.city}, ${item.country}</div>
                    ・
                    <div class="date">${item.startDate.slice(8, 10)} ${dateFormat(item.startDate)}</div>
                </div>
            `
        } else {
            date = `
                <div class="place-and-date">
                    <div class="date">${item.startDate.slice(8, 10)} ${dateFormat(item.startDate)}</div>
                </div>
            `
        }

        if (item.twitter) {
            twitter = `
                <div class="twitter">
                    <a href="https://twitter.com/${item.twitter}" target="_blank">${item.twitter}</a>
                </div>
            `
        }
        cards.insertAdjacentHTML('beforeend', `
            <div class="card">
                <div class="main-info">
                    <div class="conf-name">
                        <a href="${item.url}" target="_blank">${item.name}</a>
                    </div>
                    ${item.city && item.country ? place : date }
                </div>
                <div class="buttons-and-links">
                    <button class="notification" onclick="setNotify(event)" data-date="${item.startDate}" data-name="${item.name}">Notify me!</button>
                    ${twitter}
                </div>
            </div>
        `)
    })
}


const request = new XMLHttpRequest();
request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) {
        return;
    }

    if (request.status === 200) {
        data = JSON.parse(request.response)
        setNotifyReload(data)
        renderCard(data)
    } else {
        console.log('Error');
    }
});
request.open('GET', './data.json');
request.setRequestHeader('Content-Type', 'application/json');
request.send();