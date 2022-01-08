// Selectores
const cardsContainer = document.getElementById("cards-container")


const getCharacter = () => {
  fetch("https://rickandmortyapi.com/api/character/", {
}) 
.then((res) => res.json())
.then((data) => {
  const newData = data.results
  fillCards(newData)
  console.log(newData)
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
    console.log(item)
    cardsContainer.innerHTML = htmlHolder
  })
}

getCharacter()
