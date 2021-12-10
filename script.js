const firstAPI = 'https://api.aniapi.com/v1/anime'
const moveSlide = document.querySelector('.body-popular__slide-move')
const nextIcon = document.querySelector('.nav-slider-left')
const prevIcon = document.querySelector('.nav-slider-right')
const navBtn = document.querySelectorAll('.nav-slider-btn')
const loading = document.querySelector('.loading')
const boxFilter = document.querySelector('.body-popular__item-filter')
const box = document.querySelector('.body-popular__item')

const app = {
    renderFirstSlide: function (data) {
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
                    <a href="" class='body-popular__link'>
                        <div class="item body-popular__item" style="background-image: url(${anime.cover_image})">
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

    eventsHandle: function () {
        
    },

    start: function () {
        const slideHandle1 = new Promise((resolve) => {
            fetch(firstAPI)
                .then(blob => blob.json())
                .then(data => resolve(data));
        })

        slideHandle1
            .then((data) => {
                this.renderFirstSlide(data)
            })
            .then(() => {
                for (let i = 0; i < 2; i++) {
                    navBtn[i].style.display = 'flex'
                }
                loading.style.display = 'none'
            })
            .then(() => {
                $('.owl-carousel').owlCarousel({
                    loop: true,
                    margin: 10,
                    nav: true,
                    autoplay: true,
                    autoplayTimeout: 2000,
                    autoplayHoverPause: true,
                    dots: false,
                    navText: [
                        nextIcon,
                        prevIcon
                    ],
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
    }
}

app.start()