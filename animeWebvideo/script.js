let currentAnimeId = localStorage.currentId
let currentAnimeApi = 'https://api.aniapi.com/v1/anime/' + currentAnimeId
const animeName = document.querySelector('.animeinfo-name')
const animeGenres = document.querySelector('.animeinfo-genres')
const animeStatus = document.querySelector('.animeinfo-status')
const animeSeason = document.querySelector('.animeinfo-season')
const animeDescription = document.querySelector('.animeinfo-des')
const totalEp = document.querySelector('.ep-nav__bottom--ep')
const epList = document.querySelector('.ep-list')
const subteam = document.querySelectorAll('.subteam-options')
let epItems
const languageOptions = document.querySelectorAll('.animeinfo-option__list span')
let currentSubteam = 'dreamsub'
let currentLocale = "it"
let currentEpisode = 1
let currentVideoApi = `https://api.aniapi.com/v1/episode?anime_id=${currentAnimeId}&number=${currentEpisode}&source=${currentSubteam}&locale=${currentLocale}`
const menuBtn = document.querySelector('.bx-menu')
const menuFilter = document.querySelector('.menu-filter')
const menuNav = document.querySelector('.menu-nav')

const video = document.querySelector('.video')

app = {
    currentEp: 1,
    getAnimeData: function () {
        fetch(currentAnimeApi)
            .then(res => res.json())
            .then(data => this.renderAnime(data))
    },

    renderAnime: function (data) {
        const animeObj = data
        let status
        let season
        let year = animeObj.data.season_year
        let descriptions = animeObj.data.descriptions.en
        let animeEPTotal = animeObj.data.episodes_count
        if (animeObj.data.descriptions.en === "") {
            descriptions = animeObj.data.descriptions.it
        }
        let htmls = animeObj.data.genres.map(genre => {
            return `
                ${genre}
            `
        }).join(',&nbsp')

        switch (animeObj.data.status) {
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

        switch (animeObj.data.season_period) {
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

        animeName.innerHTML = animeObj.data.titles.en
        animeGenres.innerHTML = 'Genres:' + '&nbsp'+ htmls
        animeStatus.innerHTML = 'Status:' + '&nbsp'+ status
        animeSeason.innerHTML = 'Season:' + '&nbsp'+ season + '&nbsp' +year
        animeDescription.innerHTML = descriptions
        totalEp.innerHTML = animeEPTotal + '&nbsp'+ 'episodes in total';
        for (var i = 0; i < animeEPTotal; i++) {
            var listItem = document.createElement("li")
            listItem.className = `ep-item ep-${i + 1}`
            listItem.innerHTML = `episode ${i + 1}`
            epList.appendChild(listItem)
        }
        epItems = document.querySelectorAll('.ep-item')
        epItems[currentEpisode - 1].classList.add('active')
    },

    getVideo: function () {
        this.getCurrentVideoApi()
        fetch(currentVideoApi) 
            .then(res => res.json())
            .then(data => this.renderVideo(data))
    },

    renderVideo: function (data) {
        animeObj = data
        console.log(animeObj)
        if (animeObj.data == "") {
            video.setAttribute('poster','../assets/404.png')
        }
        else {
            video.setAttribute('poster','../assets/loading.png')
            video.attributes.src.value = animeObj.data.documents[0].video
        }
    },

    eventsHandle: function () {
        languageOptions[0].onclick = () =>{
            languageOptions[0].classList.add('active');
            languageOptions[1].classList.remove('active');
            currentLocale = 'en'
            currentSubteam = 'gogoanime'
            subteam[2].click()
            for (var i = 0; i < 3; i++) {
                if (subteam[i].textContent.trim() !== 'gogoanime') {
                    subteam[i].classList.add('hide')
                }
                else {
                    subteam[i].classList.remove('hide')
                }
            }
            this.getVideo()
        }
        languageOptions[1].onclick = () =>{
            languageOptions[1].classList.add('active');
            languageOptions[0].classList.remove('active');
            currentLocale = 'it'
            currentSubteam = 'dreamsub'
            subteam[0].click()
            for (var i = 0; i < 3; i++) {
                if (subteam[i].textContent.trim() === 'gogoanime') {
                    subteam[i].classList.add('hide')
                }
                else {
                    subteam[i].classList.remove('hide')
                }
            }
            this.getVideo()
        }

        document.onclick = (e) => {
            if (e.target.classList.contains('ep-item')) {
                epItems[currentEpisode - 1].classList.remove('active')
                currentEpisode = Number(e.target.classList[1].slice(3)) 
                epItems[currentEpisode - 1].classList.add('active')
                document.querySelector('.ep-nav__bottom--currentep').innerHTML = 'Current ep:' + '&nbsp' + currentEpisode
                this.getVideo()
            }
        }

        for (var i = 0; i < 3; i++) {
            subteam[i].onclick = (e) => {
                currentSubteam = e.target.outerText.trim()
                console.log(currentVideoApi)
                this.getVideo()
            }
        }

        video.addEventListener('error', () => {
            video.setAttribute('poster','../assets/500.png')
        })

        menuBtn.onclick = () => {
            menuFilter.style.display = 'block'
            menuNav.style.width = '50%'
        }

        menuFilter.onclick = () => {
            menuFilter.style.display = 'none'
            menuNav.style.width = '0'
        }
    },

    chooseSubHandler: function () {
        subteam[0].addEventListener('click',() => {
            subteam[0].classList.add('active')
            subteam[1].classList.remove('active')
            subteam[2].classList.remove('active')
        }
    )
        subteam[1].addEventListener('click',() => {
            subteam[1].classList.add('active')
            subteam[2].classList.remove('active')
            subteam[0].classList.remove('active')
        }
    )
        subteam[2].addEventListener('click',() => {
            subteam[2].classList.add('active')
            subteam[0].classList.remove('active')
            subteam[1].classList.remove('active')
        }
    )
    },

    getCurrentVideoApi: function () {
        currentVideoApi = `https://api.aniapi.com/v1/episode?anime_id=${currentAnimeId}&number=${currentEpisode}&source=${currentSubteam}&locale=${currentLocale}`
    },

    start: function () {
        this.getAnimeData()
        this.eventsHandle()
        this.getVideo()
        this.chooseSubHandler()
    }
}

app.start()