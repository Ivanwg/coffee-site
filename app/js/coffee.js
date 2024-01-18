// Burger-Nenu
let burgerMenu = document.querySelector('.menu-burger')
let menuOverlay = document.querySelector('.header-menu__nav')
burgerMenu.addEventListener('click', function() {
    this.classList.toggle('open-menu')
    menuOverlay.classList.toggle('active-menu')
    document.body.classList.toggle('fixed-page')
})

// Gsap-Animation
let tl = gsap.timeline()  // эти анимашки будут для всех экранов
tl
  .to('.header-menu__cake', {scale: 1, duration: 0.8})
  .to('.svg-1', {scale: 1, duration: 0.8})
  .to('.svg-2', {scale: 1, duration: 0.8})

  // Эти анимашки будут только на to+ px
  ScrollTrigger.matchMedia({
      
      "(min-width: 1500px)": function() {
          
          let t2 = gsap.timeline()

          t2
              .from('.header-title-1', {scrollTrigger: {
                  trigger: 'header',
                  start: 'start start',
                  end: '250px',  // непонятно за что отвечает это свойство
                  scrub: true,
              },
                  opacity: 0, 
                  xPercent: -50, 
          })
              .from('.header-title-3', {scrollTrigger: {
                  trigger: 'header',
                  start: '55% 30%',
                  end: '600px',
                  scrub: true,
              },
                  opacity: 0, 
                  xPercent: -50, 
          })
              .from('.header-title-2', {scrollTrigger: {
                  trigger: 'header',
                  start: '70% 40%',
                  end: '700px',   
                  scrub: true,
              },
                  opacity: 0, 
                  yPercent: -50, 
          })

      }})
// эти тоже для всех
gsap.from('.cookies img', {opacity: 0, yPercent: 80, duration: 0.6, stagger: 0.2}, '+=0.5')




// BigSlider
const swiper = new Swiper('#big-slider', {
      navigation: {
          prevEl: '.bigswiper-button-prev',
          nextEl: '.bigswiper-button-next',
          enabled: true,  
                     
      },
      pagination: {
          el: '.big-pagination', 
          clickable: true,
      },
      slidesPerView: 1,
      loop: true,

  })
  // MenuSliders
const swiperMenu = new Swiper('#menu-slider', {

      navigation: {
          prevEl: '',
          nextEl: '',
          enabled: true,  
                     
      },

      slidesPerView: 2,
      spaceBetween: 15,

      breakpoints: {
        700: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
        1024: {
          enabled: false,
          slidesPerView: 5,
          spaceBetween: 32,
        }
    }

  })

  // Order-Slider
let newSliderNav = new Swiper('#slider-nav', {

    slidesPerView: 3,
    spaceBetween: 20,
    direction: 'horizontal',

    breakpoints: {
        1024: {
           direction: 'vertical',
          },
}

})
let newSliderMain = new Swiper('#slider-main', {

    slidesPerView: 1,

    thumbs: {
        swiper: newSliderNav,
    },

    breakpoints: {
        1024: {
           direction: 'vertical',  // для вертикального перелистывания
          },
        }
})



// ------------------------------------------------------------------ //

// ------TABS------
let tabButtons = document.querySelectorAll('.tabs__btn')
let tabItems = document.querySelectorAll('.tabs__item')

tabButtons.forEach((button) => {
    button.addEventListener('click', (event) => {

        const tabAttribute = event.target.getAttribute('data-tab')

        tabButtons.forEach(el => {
            el.classList.remove('active-tab-btn')
        })
        tabItems.forEach(el => {
            el.classList.add('tab__item--hidden')
        })

        button.classList.add('active-tab-btn')
        document.getElementById(tabAttribute).classList.remove('tab__item--hidden')

    })
})

document.querySelector('[data-tab="tab1"]').classList.add('active-tab-btn')
document.getElementById('tab1').classList.remove('tab__item--hidden')




// ----------------------КАЛЬКУЛЯТОР ЦЕН----------------------

// Radio-buttons + Checkbox-buttons
let drinkList = document.querySelectorAll('.calc__radio-button')
let optionList = document.querySelectorAll('.calc__check-button')
// Ползунок, его значени, Итоговая цена
let range = document.querySelector('#range')
let rangeValue = document.querySelector('#range-value')
let total = document.querySelector('#total')


drinkList.forEach((el) => {
    el.addEventListener('click', drinkUpdate)
})
function drinkUpdate(event){
    currentPrice.drink = event.target.id
    totalPriceUpdate()
} 
 

range.addEventListener('input', rangeUpdate)
function rangeUpdate(){
    if (+range.value >= 10 && +range.value < 15){   
        rangeValue.value = this.value + '\u{1F642}'
    } else if(+range.value >= 15){
        rangeValue.value = this.value + "\u{1F601}"   
    } else{
        rangeValue.value = this.value
    }
    currentPrice.range = this.value
    totalPriceUpdate()
}


optionList.forEach((el) => { 
    el.addEventListener('click', optionUpdate)
})
function optionUpdate(event){
    if (event.target.checked){
        currentPrice.option.push(event.target.id)
    } else{
        let optIndex = currentPrice.option.indexOf(event.target.id)
        currentPrice.option.splice(optIndex, 1)
    }
    totalPriceUpdate()
}




// "Глобальный" объект с распределёнными объектами всех цен, (id инпута - цена)
const globalPrice = {
    drink: {
        'cappuccino': 180,
        'raf': 230,
        'black': 300,
        'irish': 320,
    },
    option: {
        'music': 6000,
        'delivery': 4000,
    }
}

// Динамический объект, в который добавляются/удаляются позиции. 
let currentPrice = {
    drink: 'cappuccino',
    range: 4,
    option: [],
//Функцию, которая является свойством Объекта, называют методом этого Объекта
// то же самое, что и "getDrinkPrice: function(){...}"
    getDrinkPrice(){
        return globalPrice.drink[this.drink]
    }, 
    getOptionPrice(){
        let optionSum = 0
        if (currentPrice.option.length > 0){
            currentPrice.option.forEach((opt) => {
                optionSum += globalPrice.option[opt]
            })
        }
        return optionSum
    },
}

function totalPriceUpdate(){
    let drinkTotal = currentPrice.getDrinkPrice()
    let optionTotal = currentPrice.getOptionPrice()
    total.value = currentPrice.range*drinkTotal + optionTotal
}
totalPriceUpdate()  // просто вызываем функцию, чтобы первичная цена показывалась СРАЗУ, до того как нажали на кнопки/двинули ползунок, и по клику на них запустилась эта функция
//---------------------------------------------------------------------------



// Form-Validation
function validation(form){

    function removeError(input){
        let inputParent = input.closest('.form__group')
        
        if (input.classList.contains('error')){
            inputParent.querySelector('.error-label').remove()
            input.classList.remove('error')
        }
    }

    function createError(input, text){
        let inputParent = input.closest('.form__group')
        let errorParagraph = document.createElement('p')

        input.classList.add('error')
        errorParagraph.classList.add('error-label')
        errorParagraph.textContent = text

        inputParent.append(errorParagraph)
    }


    let result = true

    let formInputs = document.querySelectorAll('.form__input')
    formInputs.forEach(input => {

        removeError(input)

        if (input.value == ''){
            createError(input, 'Поле не заполнено!')
            result = false
        }
    })

    return result
}

document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault()

    if (validation(this) == true) {
        alert('Форма проверена успешно!')
    }
})
// Input-TMask
let formPhone = document.querySelector('#input-3')
let im = new Inputmask('+7 (999) 999-99-99', {showMaskOnHover: false})
im.mask(formPhone)




// Yandex-Maps
let center1 = [48.711899032755625,44.52867520992572];
let center2 = [48.71404837260602,44.52314968623036];
let center3 = [48.710824939606304,44.51458807505484];

function init() {

	let map1 = new ymaps.Map('tab1', {
		center: center1,
		zoom: 16,
        controls: []
	});
    
   
    let map2 = new ymaps.Map('tab2', {
		center: center2,
		zoom: 16,
        controls: []
	});


    let map3 = new ymaps.Map('tab3', {
		center: center3,
		zoom: 16,
        controls: []
	});

    
    const mapArray = [map1, map2, map3]
    const cords = [center1, center2, center3]
    mapArray.forEach((map, el) => {
        let mapMark = new ymaps.Placemark(cords[el], {}, {
            iconLayout: 'default#image',
            iconImageHref: '../img/menuSliders/map-icon/mapMark.svg',
            iconImageSize: [40, 45]
        })
        map.geoObjects.add(mapMark)
    })

    // исправление ошибки с ресайзом
    const observer = new ResizeObserver(entries => mapArray.forEach((map) => 
        map.container.fitToViewport()));
    tabItems.forEach((node) => observer.observe(node));
}
ymaps.ready(init);
