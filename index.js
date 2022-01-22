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
    seeMoreButton(newData, type, wrapperName, fillHomepageCards)
    prevAndNextButtons(newData, type, wrapperName, fillHomepageCards)
})

}

ifIsHomepageFillCards = (isHomepageParam, newData, type, wrapperNameParam, fillHomepageCardsParam) => {
  if (isHomepageParam) {
    itemsHomepage = newData.slice(0,4)
    fillCards(itemsHomepage, type, wrapperNameParam, fillHomepageCardsParam)
  }
}

const fillCards = (data, type, wrapperNameParam, fillHomepageCardsParam) => {
  let htmlHolder = ""
  data.map((item) => {
    htmlHolder += `
      <div id="${wrapperNameParam}">
        <div class="card">
          <p>${item.name}</p>
        </div>
      </div>
    `
    fillHomepageCardsParam.innerHTML = htmlHolder
  })
  htmlHolder += `
    <button id="see-more-${type}">See more</button>
  `
  fillHomepageCardsParam.innerHTML = htmlHolder
}

getInfo(true, "character")
getInfo(true, "location")
getInfo(true, "episode")

const seeMoreButton = (data, type, wrapperNameParam, fillHomepageCardsParam) => {
  console.log(fillHomepageCardsParam)
  const seeMoreContainer = document.querySelector(`#see-more-${type}`)
  seeMoreContainer.onclick = () => {
    console.log(fillHomepageCardsParam)
    fillCards(data, type, wrapperNameParam, fillHomepageCardsParam)
    seeMoreContainer.style.display = "none"
    prevButtons.classList.toggle("hide-button")
    nextButtons.classList.toggle("hide-button")
  }
}

const prevAndNextButtons = (data, type, wrapperNameParam, fillHomepageCards) => {
  const prevButtons = document.getElementById(`prev-${type}`)
  const nextButtons = document.getElementById(`next-${type}`)

  nextButtons.onclick = () => {
  currentPage++
  if (currentPage === lastPage) {
    nextButtons.disabled = true
  }
  if (currentPage > 1) {
    prevButtons.disabled = false
  }
  getInfo(false, "character")
}

prevButtons.onclick = () => {
  currentPage--
  if (currentPage <= 1) {
    prevButtons.disabled = true
  }
  getInfo(false, "character")
}
  if (currentPage === 1) {
    prevButtons.disabled = true
  }
}


/* <img src="${item.image}"/> */



// Funcionalidad Barra busqueda y Status
  const searchCharacters = (name, status) => {
    const cardsContainer = document.querySelector("#cards-container")
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