const firstAPI = 'https://api.aniapi.com/v1/anime'
const secondAPI = 'https://api.aniapi.com/v1/anime?genres=Romance,comedy&nsfw=true'
const moveSlide = document.querySelector('.body-popular__slide-move')
const nextIcon = document.querySelector('.nav-slider-left1')
const prevIcon = document.querySelector('.nav-slider-right1')
const loading = document.querySelector('.loading')
const boxFilter = document.querySelector('.body-popular__item-filter')
const box = document.querySelector('.body-popular__item')
const boxContainer = document.querySelector('.row.main-body')
const bodySelections = document.querySelector('.body-selection')
const selectItems = document.querySelectorAll('.body-selection__item')
const filterLoading = document.querySelector('.filter-loading')

const app = {
    currentIndex: 0,
    genres: [
        {
            api: 'https://api.aniapi.com/v1/anime?genres=Romance,comedy&nsfw=true'
        },
        {
            api: 'https://api.aniapi.com/v1/anime?genres=Action&nsfw=true'
        },
        {
            api: 'https://api.aniapi.com/v1/anime?genres=Adventure&nsfw=true'
        },
        {
            api: 'https://api.aniapi.com/v1/anime?genres=Comedy&nsfw=true'
        },
        {
            api: 'https://api.aniapi.com/v1/anime?genres=Drama&nsfw=true'
        },
        {
            api: 'https://api.aniapi.com/v1/anime?genres=Fantasy&nsfw=true'
        },
        {
            api: 'https://api.aniapi.com/v1/anime?genres=Slice%20of%20Life&nsfw=true'
        },
        {
            api: 'https://api.aniapi.com/v1/anime?genres=Shounen&nsfw=true'
        },
        {
            api: 'https://api.aniapi.com/v1/anime?genres=Shoujo&nsfw=true'
        },
    ],

    renderSlide: function (data) {
        let status
        let animes = data
        htmls = animes.data.documents.map((anime, index) => {
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
            if (index < 25) {
                return `
                <a href="./animeWebvideo/index.html" class='body-popular__link'>
                <div class="item body-popular__item anime-item" animeid="${anime.id}" style="background-image: url(${anime.cover_image})">
                    <div class="body-popular__item-filter">
                        <i class="fas fa-play-circle"></i>
                        <span class="body-popular__item-filter__name">${anime.titles.en}</span>
                        <span class="body-popular__item-filter__status">${status}</span>
                    </div>
                </div>    
            </a>                     
                `
            }
        }).join('')
        moveSlide.innerHTML = htmls
    },

    renderBox: function (data) {
        let status
        let animes = data
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
                <div class="col c-2-4">
                    <a href="./animeWebvideo/index.html" class="box-anime" style="background-image: url(${anime.cover_image});" animeid="${anime.id}">
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

    eventsHandle: function () {
        for (let i = 0; i < 9; i++) {
            selectItems[i].onclick = (e) => {
                filterLoading.style.display = 'flex'
                boxContainer.innerHTML = ''
                selectItems[this.currentIndex].classList.remove('active')
                this.currentIndex = e.target.attributes.index.value
                selectItems[this.currentIndex].classList.add('active')
                this.boxRenderer()
            }
        }
    
        document.onclick = (e) => {
            if (e.target.classList.contains("anime-item")) {
                localStorage.currentId = e.target.attributes.animeid.value
            }
        }
    
    },

    slideRender: function () {
        const slideHandle = new Promise((resolve) => {
            fetch(firstAPI)
                .then(blob => blob.json())
                .then(data => resolve(data));
        })

        slideHandle
            .then((data) => {
                this.renderSlide(data)
            })
            .then(() => {
                loading.style.display = 'none'
            })
            .then(() => {
                $('.owl-carousel').owlCarousel({
                    loop: true,
                    margin: 10,
                    nav: false,
                    autoplay: true,
                    autoplayTimeout: 2000,
                    autoplayHoverPause: true,
                    dots: false,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 3
                        },
                        1000: {
                            items: 5
                        }
                    }
                })

            })
    },

    boxRenderer: function () {
        const boxHandle = new Promise((resolve) => {
            fetch(this.genres[this.currentIndex].api)
                .then(blob => blob.json())
                .then(data => resolve(data));
        })

        boxHandle
            .then((data) => {
                this.renderBox(data)
            })
            .then(() => {
                filterLoading.style.display = 'none'
            })
    },

    start: function () {
        this.slideRender()
        this.boxRenderer()
        this.eventsHandle()
    }
}

app.start()