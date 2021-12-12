const menuBtn = document.querySelector('.bx-menu')
const menuFilter = document.querySelector('.menu-filter')
const menuNav = document.querySelector('.menu-nav')
const ranDomlink = document.querySelectorAll('.random-link')
const searchBox = document.querySelector('.header-interact__item-search')
const searchList = document.querySelector('.header-interact-search__list')
let currentSearchValue
let currentSearchApi

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

        searchBox.onfocus = () => {
            searchList.style.display = "block"
        }

        // searchBox.onblur = () => {
        //     searchList.style.display = "none"
        // }

        searchBox.onkeypress = () => {
            if (searchBox.value !== currentSearchValue) {
                currentSearchValue = searchBox.value.split(' ').join('%20')
                currentSearchApi = `https://api.aniapi.com/v1/anime?title=${currentSearchValue}&nsfw=true`
                this.getSearchAnime()
            }
        }
    },

    getSearchAnime: function () {
        fetch(currentSearchApi)
            .then(res => res.json())
            .then(data => this.renderSearchAnime(data))
    },

    renderSearchAnime: function (data) {
        let status
        let season
        animeObj = data
        htmls = animeObj.data.documents.map((anime, index) => {
            if (index < 10) {
                switch (anime.status) {
                    case 0:
                        status = 'Finished'
                        break;
                    case 1:
                        status = 'Releasing'
                        break;
                    case 2:
                        status = 'Not yet released'
                        break;
                    case 3:
                        status = 'Cancelled'
                }
    
                switch (anime.season_period) {
                    case 0:
                        season = 'Winter'
                        break;
                    case 1:
                        season = 'Spring'
                        break;
                    case 2:
                        season = 'Summer'
                        break;
                    case 3:
                        season = 'Fall'
                        break;
                    case 4:
                        season = ''
                }
    
                return `
                    <li class="header-interact-search__item">
                    <a href="" class="header-interact-search__item-link">
                        <img class="header-interact-search__item-img" src="${anime.cover_image}" alt="">
                        <div class="search__item-contain">
                            <span class="header-interact-search__item-name">
                                ${anime.titles.en}
                            </span>
                            <span class="header-interact-search__item-status">
                                <span class="search__item-status__status">
                                    ${status}
                                </span>
                                <span class="search__item-status__season">
                                    ${season + '&nbsp'+ anime.season_year}
                                </span>
                            </span>
                        </div>
                        </a>
                    </li>
                `   
            }
        }).join('')
        searchList.innerHTML = htmls
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