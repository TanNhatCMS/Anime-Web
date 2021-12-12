const menuBtn = document.querySelector('.bx-menu')
const menuFilter = document.querySelector('.menu-filter')
const menuNav = document.querySelector('.menu-nav')
const ranDomlink = document.querySelectorAll('.random-link')

const appBase = {
    eventsHandle: function() {
        menuBtn.onclick = () => {
            menuFilter.style.display = 'block'
            menuNav.style.width = '50%'
        }

        menuFilter.onclick = () => {
            menuFilter.style.display = 'none'
            menuNav.style.width = '0'
        }

        document.onmousedown = (e) => {
            if (e.target.classList.contains('random-link')) {
                localStorage.currentId = localStorage.randomId
            }
        }
    },

    getRandomAnime: function () {
        fetch('https://api.aniapi.com/v1/random/anime/1/true')
            .then(res => res.json())
            .then(data => this.assignRandomAnime(data))
    },

    assignRandomAnime: function (data) {
        const animeObj = data
        localStorage.setItem('randomId', Number(animeObj.data[0].id))
    },

    start: function() {
        this.eventsHandle()
        this.getRandomAnime()
    }
}

appBase.start()