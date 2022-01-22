// Selectores
const textInput =document.querySelector("#text-input")
const searchForm = document.querySelector("#search-form")
const searchBarButton = document.querySelector("#button-submit-search")
const statusSelect = document.querySelector("#select-search")

let currentPage = 1
let lastPage = 0
let itemsHomepage = []


const getInfo = (isHomePage, type) => {
  const wrapperName = `homepage-${type}`
  const fillHomepageCards = document.getElementById(wrapperName)
  fetch(`https://rickandmortyapi.com/api/${type}?page=${currentPage}`) 
  .then((res) => res.json())
  .then((data) => {
    lastPage = data.info.pages
    const newData = data.results

    fillCards(newData, type, wrapperName, fillHomepageCards)
    ifIsHomepageFillCards(isHomePage, newData, type, wrapperName, fillHomepageCards)
    if (isHomePage) {
      seeMoreButton(newData, type, wrapperName, fillHomepageCards)
    } else {
      prevAndNextButtons(type, wrapperName)
    }
})

}

ifIsHomepageFillCards = (isHomepageParam, newData, type, wrapperNameParam, fillHomepageCardsParam) => {
  if (isHomepageParam) {
    itemsHomepage = newData.slice(0,4)
    fillCards(itemsHomepage, type, wrapperNameParam, fillHomepageCardsParam, isHomepageParam)
  }
}



const fillCards = (data, type, wrapperNameParam, fillHomepageCardsParam, isHomepageParam) => {
  let htmlHolder = ""
  data.map((item) => {
    htmlHolder += `
      <div id="${wrapperNameParam}">
        <div class="card" id="${type}-${item.id}" data-id="${item.id}" onclick={cardOnClick(${item.id})}>
          <img src="${item.image}"/>
            <div class="layer-card">
              <h3>${item.name}</h3>
            </div>
        </div>
      </div>
    `
    fillHomepageCardsParam.innerHTML = htmlHolder
  })
  if (isHomepageParam) {
    htmlHolder += `
      <button id="see-more-${type}">See more</button>
    ` 
  }
  fillHomepageCardsParam.innerHTML = htmlHolder
  
}




getInfo(true, "character")
getInfo(true, "location")
getInfo(true, "episode")

const seeMoreButton = (data, type, wrapperNameParam, fillHomepageCardsParam) => {
  const seeMoreContainer = document.querySelector(`#see-more-${type}`)
  seeMoreContainer.onclick = () => {
    fillCards(data, type, wrapperNameParam, fillHomepageCardsParam, false)
    prevAndNextButtons(type, wrapperNameParam)
    // const prevButtons = document.querySelector(`prev-${type}`)
    // const nextButtons = document.querySelector(`next-${type}`)
    // prevButtons.classList.toggle("hide-button")
    // nextButtons.classList.toggle("hide-button")
  }
}

const prevAndNextButtons = (type, wrapperNameParam) => {
  const wrapper = document.querySelector(`#${wrapperNameParam}`)
  const prevNextWrapper = document.createElement('div')
  let prevButtons, nextButtons;
  prevNextWrapper.setAttribute("id", "prev-next-wrapper");
  prevNextWrapper.innerHTML = `
    <button id="prev-${type}">Previous</button>
    <button id="next-${type}">Next</button>
  `
  wrapper.appendChild(prevNextWrapper)
  prevButtons = document.getElementById(`prev-${type}`)
  nextButtons = document.getElementById(`next-${type}`)

  nextButtons.onclick = () => {
    currentPage++
    if (currentPage === lastPage) {
      nextButtons.disabled = true
    }
    if (currentPage > 1) {
      prevButtons.disabled = false
    }
    getInfo(false, type)
  }

  prevButtons.onclick = () => {
    currentPage--
    if (currentPage <= 1) {
      prevButtons.disabled = true
    }
    getInfo(false, type)
  }

  if (currentPage === 1) {
    prevButtons.disabled = true
  }
}

// Funcionalidad Barra busqueda y Status
  const searchCharacters = (name, status) => {
    const cardsContainer = document.querySelector("#cards-container")
    console.log(cardsContainer)
    fetch (`https://rickandmortyapi.com/api/character/?name=${name.toLowerCase()}&status=${status}`)
    .then(res => res.json())
    .then(data => {
      fillCards(data.results, "character", "cards-container", cardsContainer)
    })
  }


  searchForm.onsubmit = (e) => {
    const textInputValue= textInput.value
    e.preventDefault();
    searchCharacters(textInputValue.toLowerCase(), statusSelect.value)
  }

// Funcion abrir info card


const cardOnClick = (item) => {
  console.log(item)
  

}
