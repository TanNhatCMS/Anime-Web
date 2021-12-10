const firstAPI = 'https://api.aniapi.com/v1/anime'
const moveSlide = document.querySelector('.body-popular__slide-move')
const nextIcon = document.querySelector('.nav-slider-left')
const prevIcon = document.querySelector('.nav-slider-right')

const app = {
    renderFirstSlide: function (data) {
        let animes = data
        htmls = animes.data.documents.map((anime, index) => {
            if (index < 25) {
                return `
                    <div class="item body-popular__item" style="background-image: url(${anime.cover_image})"></div>                  
                `
            }
        }).join('')
        moveSlide.innerHTML = htmls
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