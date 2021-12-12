const genresList = document.querySelector('.body-selection')
let genreItems 
const boxContainer = document.querySelector('.row.main-body')
const filterLoading = document.querySelector('.filter-loading')
const searchTagBox = document.querySelector('.search-tag')
let searchValue
let currentTags = []
let test = []
let tags = []
let currentTagsFormat
let currentAnimeListApi = `https://api.aniapi.com/v1/anime?genres=${currentTagsFormat}&nsfw=true`

const app = {
    errorTags: [
        "Action",
        "Comedy",
        "Drama",
        "Sci-Fi",
        "Samurai",
        "Swordplay",
        "Meta",
        "Shounen",
        "Surreal Comedy",
        "Anachronism",
        "Parody",
        "Male Protagonist",
        "Tragedy",
        "War",
        "Aliens",
        "Philosophy",
        "Memory Manipulation",
        "Dissociative Identities",
        "Gore",
        "Ensemble Cast",
        "Ninja",
        "Kuudere",
        "Robots",
        "LGBTQ+ Themes",
        "Afterlife"
    ],

    getGenres: function () {
        filterLoading.style.display = 'flex'
        fetch('https://api.aniapi.com/v1/resources/1.0/0')
            .then(res => res.json())
            .then(data => this.renderGenres(data))
            .then(() => genreItems = document.querySelectorAll('.item-selects'))
            .then(() => filterLoading.style.display = 'none')
    },

    getAnime: function () {
        fetch(currentAnimeListApi)
            .then(res => res.json())
            .then(data => this.renderAnime(data))
            .then(() => filterLoading.style.display = 'none')
    },

    renderAnime: function (data) {
        let status
        let animes = data
        if (animes.data.documents === undefined) {
            filterLoading.style.display = 'none'
        }
        htmls = animes.data.documents.map((anime) => {
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
            return `
                <div class="col c-2-4 s-6">
                    <a href="../animeWebvideo/index.html" class="box-anime" style="background-image: url(${anime.cover_image});" animeid="${anime.id}">
                        <div class="box-anime__filter anime-item" animeid="${anime.id}">
                            <span class="box-anime__name">
                                ${anime.titles.en}
                            </span>
                            <span class="box-anime__status">
                                ${status}
                            </span>
                        </div>
                    </a>
                </div>               
                `

        }).join('')
        boxContainer.innerHTML = htmls
    },

    renderGenres: function (data) {
        const genresObject = data
        tags = genresObject.data.genres.sort()
        let htmls = tags.map((genre, index) => {
            return `
                <span class="body-selection__item item-selects" index="${index}">${genre}</span>
            `
        }).join('')
        genresList.innerHTML = htmls
        genresList.style.display = 'block'
    },

    eventsHandle: function () {
        document.onclick = (e) => {
            this.handleGenresList(e)
            if (e.target.classList.contains("anime-item")) {
                localStorage.currentId = Number(e.target.attributes.animeid.value)
            }
        }

        // searchTagBox.onkeypress = () => {
        //     this.searchTagHandler()
        // }
    },

    // searchTagHandler: function () {
    //     searchValue = searchTagBox.value
    //     console.log(searchValue)
    //     let text1 = searchValue.split(/\s+/g)
    //     tagLength = tags.length
    //     for (let m = 0; m < tagLength; m++) {
    //         let count = 0
    //         genreItems[m].classList.add('hide')
    //         let text2 = tags[m].split(/\s+/g)
    //         for (i = 0; i < text1.length; i++) {
    //             for (j = 0; j < text2.length; j++) {
    //                 if (text1[i].toLowerCase() == text2[j].toLowerCase()) {
    //                     count += 1
    //                     if (counnt < 2) {
    //                         genreItems[m].classList.remove('hide')
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // },

    handleGenresList: function (e) {
        let tag = e.target.innerHTML.split(' ').join('%20')
            if (e.target.classList.contains('item-selects')) {
                if (currentTags.includes(tag)) {
                    e.target.classList.remove('active')
                    let index = currentTags.indexOf(tag)
                    currentTags.splice(index, 1)
                    this.handleLinkApi()
                    this.getAnime()
                    if (currentTags.length === 0) {
                        boxContainer.innerHTML = ''
                    }
                    else {
                        filterLoading.style.display = 'flex'
                    }
                }
                else {
                    currentTags.push(tag)
                    e.target.classList.add('active')
                    this.handleLinkApi()
                    this.getAnime()
                    filterLoading.style.display = 'flex'
                }
            }
    },

    handleLinkApi: function() {
        let htmls = currentTags.map(tag => {
            return `${tag}`
        }).join(',')
        currentTagsFormat = htmls
        currentAnimeListApi = `https://api.aniapi.com/v1/anime?genres=${currentTagsFormat}&nsfw=true`
    },

    start: function() {
        this.getGenres()
        this.eventsHandle()
    }
}

app.start()