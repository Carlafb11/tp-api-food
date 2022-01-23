// Selectores
const textInput =document.querySelector("#text-input")
const searchForm = document.querySelector("#search-form")
const searchBarButton = document.querySelector("#button-submit-search")
const statusSelect = document.querySelector("#select-search")
const modalCharacterInfo = document.querySelector(".modal-character-container")
const closeModalButton = document.getElementById("close-modal")


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
      <div class="buttons-wrapper">
        <button id="see-more-${type}">See more</button>
      </div>
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
    const homepageCharacter = document.querySelector("#homepage-character")
    const homepageLocation = document.querySelector("#homepage-location")
    const homepageEpisode = document.querySelector("#homepage-episode")
    const returnHomepageButton = document.querySelector("#return-homepage")

    returnHomepageButton.onclick = () => {
      location.reload()
      return false
    }

    fillCards(data, type, wrapperNameParam, fillHomepageCardsParam, false)
    prevAndNextButtons(type, wrapperNameParam)
    switch(type) {
      case "character":
        homepageLocation.style.display = "none"  
        homepageEpisode.style.display = "none"
        returnHomepageButton.classList.toggle("hide-button")
        break
      case "location":
        homepageCharacter.style.display = "none"  
        homepageEpisode.style.display = "none"
        searchForm.style.display = "none"
        returnHomepageButton.classList.toggle("hide-button")
      break
      case "episode":
        homepageCharacter.style.display = "none"  
        homepageLocation.style.display = "none"
        searchForm.style.display = "none"
        returnHomepageButton.classList.toggle("hide-button")
      break
    }
  }
}

const prevAndNextButtons = (type, wrapperNameParam) => {
  const wrapper = document.querySelector(`#${wrapperNameParam}`)
  const prevNextWrapper = document.createElement('div')
  let prevButtons, nextButtons
  prevNextWrapper.setAttribute("id", "prev-next-wrapper")
  prevNextWrapper.setAttribute("class", "buttons-wrapper")
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
      nextButtons.classList.add("disabled-cta")
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
    prevButtons.classList.add("disabled-cta")
  }
}
const cardsContainer = document.querySelector("#cards-container")
// Funcionalidad Barra busqueda y Status
  const searchCharacters = (name, status) => {
    const cardsContainerResults = document.querySelector("#cards-container-results")
    const cardsContainer = document.querySelector("#cards-container")

    fetch (`https://rickandmortyapi.com/api/character/?name=${name.toLowerCase()}&status=${status}`)
    .then(res => res.json())
    .then(data => {
      fillCards(data.results, "character", "cards-container-results", cardsContainerResults)
      cardsContainer.style.display = "none"
      prevAndNextButtons()
    })
  }


  searchForm.onsubmit = (e) => {
    const textInputValue= textInput.value
    e.preventDefault();
    searchCharacters(textInputValue.toLowerCase(), statusSelect.value)
  }

// Funcion abrir info card
const cardOnClick = (item, type) => {
  console.log (item)
    fetch (`https://rickandmortyapi.com/api/character/${item}`)
    .then (res => res.json())
    .then(data => {
      createInfoCard(data)
    })
}
const createInfoCard = (data) => {
  cardsContainer.style.display = "none"
  const overlay = document.getElementById("overlay")
  modalCharacterInfo.classList.remove("hidden")
  overlay.classList.remove("hidden")
  modalInformationCharacter = document.querySelector(".modal-information")
modalInformationCharacter. innerHTML = `
  <div class="modal-image">
    <img src = ${data.image}>
  </div>

  <div class="detail-character">
    <div class="name">
      <h2>${data.name}</h2>
    </div> 
    <div class="character-details">
        <p>${data.gender}</p> 
        <div class="status-container">
          <h3>${data.status}</h3>
          <h3>${data.species}</h3>
        </div>
    </div>     
  </div>
`

}

// cerrar infocard

closeModalButton.onclick =() => {
overlay.classList.add("hidden")
cardsContainer.style.display ="block"
modalCharacterInfo.classList.add("hidden")
}