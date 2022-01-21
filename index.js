// Selectores
const cardsContainer = document.getElementById("cards-container")
const prev = document.querySelector("#prev")
const next = document.querySelector("#next")
const seeMore = document.querySelector("#see-more")
const textInput =document.querySelector("#text-input")
const searchForm = document.querySelector("#search-form")
const searchBarButton = document.querySelector("#button-submit-search")
const statusSelect = document.querySelector("#select-search")

let currentPage = 1
let lastPage = 0
let itemsHomepage = []


const getInfo = (isHomePage, type) => {
  fetch(`https://rickandmortyapi.com/api/${type}?page=${currentPage}`) 
  .then((res) => res.json())
  .then((data) => {
    lastPage = data.info.pages
    const newData = data.results
    if (type === "character") {
      fillCards(newData)
      if (isHomePage) {
        itemsHomepage = newData.slice(0,4)
        fillHomepageCards(itemsHomepage)
      }
    } 
    seeMore.onclick = () => {
      fillCards(newData)
      seeMore.style.display = "none"
      prev.classList.toggle("hide-button")
      next.classList.toggle("hide-button")
    }
})
}

fillHomepageCards = (data) => {
  let htmlHolder = ""
  data.map((item) => {
    htmlHolder += `
      <div id="cards-container">
        <div class="card">
          <p>${item.name}</p>
          <p>${item.status}</p>
          <img src="${item.image}"/>
        </div>
      </div>
    `
    cardsContainer.innerHTML = htmlHolder
  })
}


const fillCards = (data) => {
  let htmlHolder = ""
  data.map((item) => {
    htmlHolder += `
      <div id="cards-container">
        <div class="card">
          <p>${item.name}</p>
          <p>${item.status}</p>
          <img src="${item.image}"/>
        </div>
      </div>
    `
    cardsContainer.innerHTML = htmlHolder
  })
}

getInfo(true, "character")

prevValidation = () => {
  if (currentPage === 1) {
    prev.disabled = true
  }
}

prevValidation()

next.onclick = () => {
  currentPage++
  if (currentPage === lastPage) {
    next.disabled = true
  }
  if (currentPage > 1) {
    prev.disabled = false
  }
  getInfo(false, "character")
}

prev.onclick = () => {
  currentPage--
  if (currentPage <= 1) {
    prev.disabled = true
  }
  getInfo(false, "character")
}



// Funcionalidad Barra busqueda y Status


  const searchCharacters = (name, status) => {
    fetch (`https://rickandmortyapi.com/api/character/?name=${name.toLowerCase()}&status=${status}`)
    .then(res => res.json())
    .then(data => {
      fillCards(data.results)
    })
  }


  

  searchForm.onsubmit = (e) => {
    e.preventDefault();
    searchCharacters(textInput.toLowerCase().value, statusSelect.value)
  }


