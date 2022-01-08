// Selectores
const cardsContainer = document.getElementById("cards-container")

const getRecipes = () => {
  fetch("https://tasty.p.rapidapi.com/recipes/list?size=10", {
  "method": "GET",
  "headers": {
    "x-rapidapi-host": "tasty.p.rapidapi.com",
    "x-rapidapi-key": "f82e3258edmsh10d1e49dfdbeb24p1024ebjsn5fe5947b5971"
  }
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
        <img height="100" src="${item.thumbnail_url}" />
        <p>${item.name}</p>
      </div>
    `
    console.log(item)
    cardsContainer.innerHTML = htmlHolder
  })
}

getRecipes()