if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('../sw_cached_site.js')
            .then(reg => console.log('Service Worker: Registered (Pages)'))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
}

let dataJson = []
const cards = document.querySelector('.events-list__wrapper')
const allSub = document.querySelector('.container__header__subscription-button')

if (localStorage.getItem('all')) {
    allSub.textContent = 'Cancel all my subscriptions'
    allSub.className = 'container__header__subscription-button-error'
}

allSub.addEventListener('click', event => {
    if (!localStorage.getItem('all')) {
        dataJson.forEach(item => {
            localStorage.setItem(item.name, item.startDate)
        })
        localStorage.setItem('all', 'true')
        new Notification('The notification from the calendar', {
            body: 'You will now receive notifications about all conferences',
            icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
        });
        event.target.textContent = 'Cancel all my subscriptions'
        allSub.className = 'container__header__subscription-button-error'
        renderCard(dataJson)
    } else {
        localStorage.clear()
        new Notification('The notification from the calendar', {
            body: 'You have unsubscribed from notifications to all conferences',
            icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
        });
        event.target.textContent = 'Notify me of all upcoming events'
        allSub.className = 'container__header__subscription-button'
        renderCard(dataJson)
    }
})

const logicDate = (date, name) => {
    if (date-Date.now() < 0) {
        new Notification('The notification from the calendar', {
            body: 'Conference ' + name + ' finished',
            icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
        });
        localStorage.removeItem(name)
    } else if (date-Date.now() < 345600000 && date-Date.now() > 172800000 && !localStorage.getItem(name+'-3')){
        new Notification('The notification from the calendar', {
            body: 'Conference ' + name + ' starts in 3 days',
            icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
        });
        localStorage.setItem(name+'-3', 'true')
    } else if (date-Date.now() < 691200000 && date-Date.now() > 518400000 && !localStorage.getItem(name+'-7')) {
        new Notification('The notification from the calendar', {
            body: 'Conference ' + name + ' starts in 7 days',
            icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
        });
        localStorage.setItem(name+'-7', 'true')
    } else if (date-Date.now() < 1296000000 && date-Date.now() > 1123200000 && !localStorage.getItem(name+'-14')) {
        new Notification('The notification from the calendar', {
            body: 'Conference ' + name + ' starts in 14 days',
            icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
        });
        localStorage.setItem(name+'-14', 'true')
    }
}

const setNotifyReload = (data) => {
    dataJson = data
    data.forEach(item => {
        if (localStorage.getItem(item.name)) {
            const date = Date.parse(localStorage.getItem(item.name))
            logicDate(date, item.name)
        }
    })
}

const trueNotify = name => {
    new Notification('The notification from the calendar', {
        body: 'You will now receive a notification about the conference ' + name,
        icon: 'https://img2.freepng.ru/20180415/rse/kisspng-computer-icons-vector-avatar-friends-5ad3420d608ec0.3997693115237944453955.jpg'
    });

    const date = Date.parse(localStorage.getItem(name))

    logicDate(date, name)
}

const realDate = date => {
    if (Date.parse(date) - Date.now() < 0) {
        return 'Finished'
    } else {
        return 'Upcoming'
    }
}

const setNotify = event => {
    const date = event.target.dataset.date
    const name = event.target.dataset.name

    localStorage.setItem(name, date)
    renderCard(dataJson)

    if (!("Notification" in window)) {
        alert('Your browser unsupported HTML Notifications, it needs to be updated.');
    } else if (Notification.permission === "granted") {
        trueNotify(name)
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                trueNotify(name)
            } else {
                alert('You have banned the display of notifications');
            }
        });
    }
}

const clearNotify = (event) => {
    localStorage.removeItem(event.target.dataset.name)
    if (localStorage.getItem('all')) {
        localStorage.removeItem('all')
        allSub.textContent = 'Notify me of all upcoming events'
        allSub.className = 'container__header__subscription-button'
    }
    renderCard(dataJson)
}

const renderCard = confData => {
    cards.textContent = ''
    confData.forEach(item => {
        let button = ''
        if (localStorage.getItem(item.name) && realDate(item.startDate) !== 'Finished') {
            button = `
                <button 
                    class="container__header__notify-button-error" 
                    onclick="clearNotify(event)"
                    data-name="${item.name}"
                >
                Unsub!
                </button>
            `
        } else if (realDate(item.startDate) === 'Finished' && realDate(item.endDate) !== 'Finished') {
            button = `
                <button class="container__header__notify-button-error" disabled>Started</button>
            `
        } else if (realDate(item.startDate) === 'Finished' && realDate(item.endDate) === 'Finished') {
            button = `
                <button class="container__header__notify-button-error" disabled>Finished</button>
            `
        } else {
            button = `
                <button 
                    class="container__header__notify-button" 
                    onclick="setNotify(event)" 
                    data-date="${item.startDate}" 
                    data-name="${item.name}"
                >
                Notify!
                </button>
            `
        }
        cards.insertAdjacentHTML('beforeend', `
            <li class="events-list__element">
                <section class="events-list__element__wrapper">
                    <p class="events-list__element__text">${item.startDate}</p>
                    <p class="events-list__element__text">${item.name}</p>
                    <p class="events-list__element__text">${realDate(item.endDate)}</p>
                </section>
                ${button}
            </li>
        `)
    })
}

const initializeRequest = async() => {
    await fetch('./data.json')
        .then(response => {
            return response.json()
        })
        .then(data => {
            setNotifyReload(data)
            renderCard(data)
        })
}

initializeRequest()