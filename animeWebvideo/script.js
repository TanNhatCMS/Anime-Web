let currentAnimeId = localStorage.currentId
let currentAnimeApi = 'https://api.aniapi.com/v1/anime/' + currentAnimeId
const animeName = document.querySelector('.animeinfo-name')
const animeGenres = document.querySelector('.animeinfo-genres')
const animeStatus = document.querySelector('.animeinfo-status')
const animeSeason = document.querySelector('.animeinfo-season')
const animeDescription = document.querySelector('.animeinfo-des')
const totalEp = document.querySelector('.ep-nav__bottom--ep')
const languageOptions = document.querySelectorAll('.animeinfo-option__list span')
let currentLanguage = 'dreamsub'
let currentLocale = "it"
let currentEpisode = 1
let currentVideoApi = `https://api.aniapi.com/v1/episode?anime_id=${currentAnimeId}&number=${currentEpisode}&source=${currentLanguage}&locale=${currentLocale}`

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
        totalEp.innerHTML = animeObj.data.episodes_count + '&nbsp'+ 'episodes in total'
    },

    getVideo: function () {
        fetch(currentVideoApi) 
            .then(res => res.json())
            .then(data => this.renderVideo(data))
    },

    renderVideo: function (data) {
        animeObj = data
        console.log(animeObj.data)
        video.attributes.src.value = animeObj.data.documents[0].video
        console.log(animeObj.data.documents[0].video)
    },

    eventsHandle: function () {
        languageOptions[0].onclick = () =>{
            languageOptions[0].classList.add('active');
            languageOptions[1].classList.remove('active');
            currentLanguage = 'gogoanime'
            currentVideoApi = `https://api.aniapi.com/v1/episode?anime_id=${currentAnimeId}&number=${currentEpisode}&source=${currentLanguage}`
            this.getVideo()
        }
        languageOptions[1].onclick = () =>{
            languageOptions[1].classList.add('active');
            languageOptions[0].classList.remove('active');
            currentLanguage = 'dreamsub'
            currentVideoApi = `https://api.aniapi.com/v1/episode?anime_id=${currentAnimeId}&number=${currentEpisode}&source=${currentLanguage}`
            this.getVideo()
        }
    },

    start: function () {
        this.getAnimeData()
        this.eventsHandle()
        this.getVideo()
    }
}

app.start()