// Selectores
const cardsContainer = document.getElementById("cards-container")


const getArt = () => {
  fetch("https://www.metmuseum.org/api/collection/collectionlisting/", {
}) 
.then((res) => res.json())
.then((data) => {
  const newData = data.results
  fillCards(newData)
})
}

const fillCards = (data) => {
  let htmlHolder = ""
  data.map((item) => {
    htmlHolder += `
      <div id="cards-container">
        <div class="card">
          <p>${item.title}</p>
          <img src="${item.image}"/>
          <p>${item.description}</p>
        </div>
      </div>
    `
    console.log(item)
    cardsContainer.innerHTML = htmlHolder
  })
}

getArt()
