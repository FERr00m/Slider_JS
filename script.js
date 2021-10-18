window.addEventListener('DOMContentLoaded', function() {
    try {
      let counterOfSliders = 1;

      class SliderCarousel {
        constructor({
          main,
          wrap,
          next,
          prev,
          infinity = false,
          position = 0,
          slidesToShow = 3,
          responsive = [],
          number = 1,
          autoplay = {bool: false, time: 0},
          interval,

        }) {
          if (!main || !wrap) {
            console.warn('slider-carousel: Необходимо 2 свойства, "main" и "wrap"!');
          }
          this.main = document.querySelector(main);
          this.wrap = document.querySelector(wrap);
          this.slides = document.querySelector(wrap).children;
          this.next = document.querySelector(next);
          this.prev = document.querySelector(prev);
          this.slidesToShow = slidesToShow;
          this.options = {
            position,
            infinity,
            widthSlide: Math.floor(100 / this.slidesToShow),
          };
          this.responsive = responsive,
          this.number = number;
          this.autoplay = autoplay,
          this.interval = interval;
        }

        init() {
          this.addGloClass();
          this.addStyle();

          if (this.prev && this.next) {
            this.controlSlider();
          } else {
            this.addArrow();
            this.controlSlider();
          }
          if (this.autoplay.bool) {
            this.startSlide();
            this.main.addEventListener('mouseover', event => {
              if (event.target.matches('.slider-btn img, button.btn, a.slider-item__name>p')) {
                this.stopSlide();
              }
            });

            this.main.addEventListener('mouseout', event => {
              if (event.target.matches('.slider-btn img, button.btn, a.slider-item__name>p')) {
                this.startSlide();
              }
            });
          }
          if (this.responsive) {
            this.responseInit();
          }
        }

        addGloClass() {
          this.main.classList.add('glo-slider');
          this.wrap.classList.add('glo-slider__wrap');
          for (const item of this.slides) {
            item.classList.add(`glo-slider__item${this.number}`);
          }
        }

        addStyle() {
          let style = document.getElementById('sliderCarousel-style');

          if (!style) {
            style = document.createElement('style');
            style.id = 'sliderCarousel-style';

            style.textContent = `
              .glo-slider {
                overflow: hidden;
              }
              .glo-slider__wrap {
                display: flex !important;
                transition: transform 0.5s !important;
                will-change: transform !important;
              }
              .glo-slider__item${this.number} {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                flex: 0 0 ${this.options.widthSlide}% !important;
              }
            `;
          } else {
              style.insertAdjacentText('beforeend', `
                .glo-slider__item${this.number} {
                  flex: 0 0 ${this.options.widthSlide}% !important;
                }
              `)
          }
          document.head.appendChild(style);
        }

        controlSlider() {
          this.prev.addEventListener('click', this.prevSlider.bind(this));
          this.next.addEventListener('click', this.nextSlider.bind(this));
        }

        prevSlider() {
          if (this.options.infinity || this.options.position > 0) {
            --this.options.position;

          if (this.options.position < 0) {
            this.options.position = this.slides.length - this.slidesToShow;
          }

          this.wrap.style.transform = `translateX(-${this.options.position * this.options.widthSlide}%)`;
          }
        }

        nextSlider() {
          if (this.options.infinity || this.options.position < this.slides.length - this.slidesToShow) {
            ++this.options.position;
            if (this.options.position > this.slides.length - this.slidesToShow) {
              this.options.position = 0;
            }
            this.wrap.style.transform = `translateX(-${this.options.position * this.options.widthSlide}%)`;
          }
        }

        addArrow() {
          this.prev = document.createElement('button');
          this.next = document.createElement('button');

          this.prev.className = 'glo-slider__prev';
          this.next.className = 'glo-slider__next';

          this.main.appendChild(this.prev);
          this.main.appendChild(this.next);

          const style = document.createElement('style');
          style.textContent = `
            .glo-slider__prev,
            .glo-slider__next {
              margin: 0 10px;
              border: 20px solid transparent;
              background: transparent;
            }
            .glo-slider__next {
              border-left-color: #19b5fe;
            }
            .glo-slider__prev {
              border-right-color: #19b5fe;
            }
            .glo-slider__prev:hover,
            .glo-slider__next:hover,
            .glo-slider__prev:focus,
            .glo-slider__next:focus {
              background: transparent;
              outline: transparent;
            }
          `;
          document.head.appendChild(style);
        }

        autoPlaySlide = () => {
          this.nextSlider();
        };

        startSlide = (time = this.autoplay.time) => {
          this.interval = setInterval(this.autoPlaySlide, time);
        };

        stopSlide = () => {
          clearInterval(this.interval);
        };

        responseInit() {
          const slidesToShowDefault = this.slidesToShow,
            allResponse = this.responsive.map(item => item.breakpoint),
            maxResponse = Math.max(...allResponse);

          const checkResponse = () => {
            const widthWindow = document.documentElement.clientWidth;

            if (widthWindow < maxResponse) {
              for (let i = 0; i < allResponse.length; i++) {
                if (widthWindow < allResponse[i]) {
                  this.slidesToShow = this.responsive[i].slidesToShow;
                  this.options.widthSlide = Math.floor(100 / this.slidesToShow);
                  this.addStyle();
                }
              }
            } else {
              this.slidesToShow = slidesToShowDefault;
              this.options.widthSlide = Math.floor(100 / this.slidesToShow);
              this.addStyle();
            }
          };

          checkResponse();
          //window.addEventListener('resize', checkResponse);
        }
      }
      //Sliders
      const datesSlider = new SliderCarousel({
        main: '#new-employees',
        wrap: '#new-employees .slider-wrapper',
        next: '.js-slider-btn-right.new-employees',
        prev: '.js-slider-btn-left.new-employees',
        slidesToShow: 1,
        infinity: true,
        responsive: false,
        number: counterOfSliders,
        autoplay: {bool: true, time: 5000}
      });
      datesSlider.init()
      counterOfSliders++

    } catch (error) {
        console.error(error);
    }
})
