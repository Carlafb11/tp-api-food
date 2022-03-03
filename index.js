// Selectores
const textInput =document.querySelector("#text-input")
const searchForm = document.querySelector("#search-form")
// esta variable nunca se usa
const searchBarButton = document.querySelector("#button-submit-search")
const statusSelect = document.querySelector("#select-search")
const modalCharacterInfo = document.querySelector(".modal-character-container")
const closeModalButton = document.getElementById("close-modal")
const returnHomepageButton = document.querySelector("#return-homepage")
const cardsContainer = document.querySelector("#cards-container")
const overlay = document.getElementById("overlay")
const footerSection = document.querySelector("#footer-section")

let currentPage = 1
let lastPage = 0
let searchPage = 1
let searchLastPage = 0
let itemsHomepage = []

returnHomepageButton.onclick = () => {
  location.reload()
  return false
}


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

// ojo!! falta un const aca!!
ifIsHomepageFillCards = (isHomepageParam, newData, type, wrapperNameParam, fillHomepageCardsParam) => {
  if (isHomepageParam) {
    // muy bien resuelto esto
    itemsHomepage = newData.slice(0,4)
    fillCards(itemsHomepage, type, wrapperNameParam, fillHomepageCardsParam, isHomepageParam)
  }
}

const fillCards = (data, type, wrapperNameParam, fillHomepageCardsParam, isHomepageParam, isSeeMore) => {
  let htmlHolder = ""
  data.map((item) => {
    htmlHolder += `
      <div id="${wrapperNameParam}">
        <div class="card" id="${type}-${item.id}" data-id="${item.id}" onclick="cardOnClick('${item.id}', '${type}', '${isHomepageParam}', '${isSeeMore}')">
          <div class="card-image-wrapper">
            <img src="${item.image}"/>
          </div>
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

  // Todo el codigo que se ejecuta apenas carga la pagina, ponganlo al final de todo
  // Asi es mas facil entender el flujo de ejecución
getInfo(true, "character")
getInfo(true, "location")
getInfo(true, "episode")

const seeMoreButton = (data, type, wrapperNameParam, fillHomepageCardsParam) => {
  const seeMoreContainer = document.querySelector(`#see-more-${type}`)
  seeMoreContainer.onclick = () => {
    const homepageCharacter = document.querySelector("#homepage-character")
    const homepageLocation = document.querySelector("#homepage-location")
    const homepageEpisode = document.querySelector("#homepage-episode")
    

    fillCards(data, type, wrapperNameParam, fillHomepageCardsParam, false, true)
    prevAndNextButtons(type, wrapperNameParam)
    switch(type) {
      // perfecto este switch
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

const prevAndNextButtons = (type, wrapperNameParam, isSearch, name, status) => {
  const wrapper = document.querySelector(`#${wrapperNameParam}`)
  const prevNextWrapper = document.createElement('div')

  // para que declaran esto aca si lo rellenan unas lineas mas abajo? mejor declararlo y darle valor en la misma linea 
  let prevButtons, nextButtons;
  prevNextWrapper.setAttribute("id", "prev-next-wrapper")
  prevNextWrapper.setAttribute("class", "buttons-wrapper")
  prevNextWrapper.innerHTML = `
      <button id="prev-${type}">Previous</button>
      <button id="next-${type}">Next</button>
  `
  wrapper.appendChild(prevNextWrapper)

  // Un bug muy especifico, pero importante, en su pagina. 
  // 1. Voy a la  pagina de personajes
  // 2. Voy a la pagina 2
  // 3. Hago una busqueda, como "rick"
  // 3. Hago click en proxima pagina... no pasa nada
  // Por qué? Porque los siguientes selectores no estan agarrando los botones de la busqueda, 
  // sino los de la pagina de personajes que quedaron mas arriba (ocultos con display none).
  // Revisen la logica del type para darle id a estos botones, porque no esta funcionando bien 
  prevButtons = document.getElementById(`prev-${type}`)
  nextButtons = document.getElementById(`next-${type}`)

  if ((isSearch && searchPage === searchLastPage) || (currentPage === lastPage)) {
    nextButtons.disabled = true
    nextButtons.classList.add("disabled-cta")
  }
  nextButtons.onclick = () => {
    console.log(isSearch)
    if (isSearch) {
      searchPage++
      if (searchPage > 1) {
        prevButtons.disabled = false
      }
      searchCharacters(name, status, searchPage)
    } else {
      currentPage++
      console.log(currentPage)
      if (currentPage > 1) {
        prevButtons.disabled = false
      }
      getInfo(false, type)
    }
  }

  prevButtons.onclick = () => {
    if (isSearch) {
      searchPage--
      if (searchPage <= 1) {
        prevButtons.disabled = true
      }
      searchCharacters(name, status, searchPage)
    } else {
      currentPage--
      if (currentPage <= 1) {
        prevButtons.disabled = true
      }
      getInfo(false, type)
    }
  }

  if (isSearch) {
    if (searchPage === 1) {
      prevButtons.disabled = true
      prevButtons.classList.add("disabled-cta")
    }
  } else {
    if (currentPage === 1) {
      prevButtons.disabled = true
      prevButtons.classList.add("disabled-cta")
    }
  }
}

// Funcionalidad Barra busqueda y Status
  const searchCharacters = (name, status, page) => {
    const cardsContainerResults = document.querySelector("#cards-container-results")

    fetch (`https://rickandmortyapi.com/api/character/?name=${name.toLowerCase()}&status=${status}&page=${page}`)
    .then(res => res.json())
    .then(data => {
      searchLastPage = data.info.pages
      fillCards(data.results, "character", "cards-container-results", cardsContainerResults)
      cardsContainer.style.display = "none"
      if (searchLastPage > 1) {
        prevAndNextButtons("character", "cards-container-results", true, name, status)
      }
    })
  }

  searchForm.onsubmit = (e) => {
    const textInputValue= textInput.value
    e.preventDefault();
    searchCharacters(textInputValue.toLowerCase(), statusSelect.value)
    returnHomepageButton.classList.toggle("hide-button")
  }

// OPEN INFO CARD FUNCTION
const cardOnClick = (id, type, isHomepage, isSeeMore) => {
    fetch (`https://rickandmortyapi.com/api/character/${id}`)
    .then (res => res.json())
    .then(data => {
      if (type === "character") {
        createInfoCard(data, isHomepage, isSeeMore)
        modalStyling(data)
      }
    })
}
const createInfoCard = (data, isHomepage, isSeeMore) => {
  cardsContainer.style.display = "none"
  modalCharacterInfo.classList.remove("hidden")
  footerSection.classList.add("hidden")
  overlay.classList.remove("hidden")
  // falta un const aca 
  modalInformationCharacter = document.querySelector(".modal-information")
  modalInformationCharacter. innerHTML = `
  <div class="name">
    <h2>${data.name}</h2>
  </div> 
  <div class="modal-image">
    <img src = ${data.image}>
  </div>
  <div class="status-container">
    <div class="status-details">
      <p><span>Gender:</span></p> 
      <p id="gender-modal-card">${data.gender}</p>
    </div>
    <div class="status-details">
      <p><span>Status:</span></p>
      <p id="status-modal-card">${data.status}</p>
    </div>
    <div class="status-details">
      <p><span>Specie:</span></p>
      <div class="specie-detail">
        <p id="specie-modal-card">${data.species}</p>
      </div>
    </div>
  </div>
`

  // CLOSE INFOCARD FUNCTION
  closeModalButton.onclick =() => {
    overlay.classList.add("hidden")
    // isHomepage y isSeeMore deberian ser booleanos, no strings 
    // el problema es que en esta linea: <div class="card" id="${type}-${item.id}" data-id="${item.id}" onclick="cardOnClick('${item.id}', '${type}', '${isHomepageParam}', '${isSeeMore}')">
    //   lo convierten en string
    
    if (isHomepage == 'true' || isSeeMore == 'true') {
      cardsContainer.style.display = "block"
    } 
    modalCharacterInfo.classList.add("hidden")
    footerSection.classList.remove("hidden")
  }
}


// Validacion para modal! :)
const modalStyling = (data) => {
  const gender = document.querySelector("#gender-modal-card")
  const status = document.querySelector("#status-modal-card")
  const specie = document.querySelector("#specie-modal-card")

  //gender
  gender.innerHTML = `
    <i class="fas fa-${data.gender === "unknown" ? "question" : data.gender.toLowerCase()}"></i>
    ${data.gender}
  `
  //status
  if (data.status === "Alive") {
    status.style.color = "green"
  }
  else if (data.status === "Dead") {
    status.style.color = "red"
  }
  else if (data.status === "unknown") {
    status.style.color = "lightseagreen"
  }
  if (data.species === "Human") {
    specie.classList.add("human")
  }
  else if (data.species === "Alien") {
    specie.classList.add("alien")
  }
  else {
    specie.classList.add("other")
  }

}
