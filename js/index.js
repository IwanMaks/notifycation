let data = []
const cards = document.querySelector('.cards')

const setNotify = () => {
    if (!("Notification" in window)) {
        alert('Ваш браузер не поддерживает HTML Notifications, его необходимо обновить.');
    } else if (Notification.permission === "granted") {
        let notification = new Notification('Уведомление от календаря', {
            body: 'Теперь вы получите уведомление об этом событии',
            icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
        });

        function clickFunc() { alert('Пользователь кликнул на уведомление'); }

        notification.onclick = clickFunc;
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {

            if (permission === "granted") {
                let notification = new Notification('Уведомление от календаря', {
                    body: 'Теперь вы получите уведомление об этом событии',
                    icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
                });

            } else {
                alert('Вы запретили показывать уведомления');
            }
        });
    } else {
        Notification.requestPermission(function (permission) {
            permission = "granted"
            if (permission === "granted") {
                let notification = new Notification('Уведомление от календаря', {
                    body: 'Теперь вы получите уведомление об этом событии',
                    icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
                });

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
        console.log(item.startDate.slice(8, 10))
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
                    ${item.city && item.country ? place : date
                    }
                </div>
                <div class="buttons-and-links">
                    <button class="notification" onclick="setNotify()">Notify me!</button>
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
        renderCard(data)
    } else {
        console.log('Error');
    }
});
request.open('GET', './data.json');
request.setRequestHeader('Content-Type', 'application/json');
request.send();