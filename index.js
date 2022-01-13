// Selectores
const cardsContainer = document.getElementById("cards-container")
const prev = document.querySelector("#prev")
const next = document.querySelector("#next")
const seeMore = document.querySelector("#see-more")
let currentPage = 1
let lastPage = 0
let itemsHomepage = []

const getInfo = () => {
  fetch(`https://rickandmortyapi.com/api/character?page=${currentPage}`) 
  .then((res) => res.json())
  .then((data) => {
    lastPage = data.info.pages
    const newData = data.results
    fillCards(newData)
    itemsHomepage = newData.slice(0,4)
    fillHomepageCards(itemsHomepage)

    seeMore.onclick = () => {
      fillCards(newData)

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
          <img src="${item.image}"/>
        </div>
      </div>
    `
    cardsContainer.innerHTML = htmlHolder
  })
}

getInfo()

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
  getInfo()
}

prev.onclick = () => {
  currentPage--
  if (currentPage <= 1) {
    prev.disabled = true
  }
  getInfo()
}