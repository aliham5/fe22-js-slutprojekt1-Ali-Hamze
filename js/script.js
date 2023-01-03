const apiKey = "7e698065af42f3ccdb7b6bc638e15662"
const baseUrl = "https://www.flickr.com/services/rest/"
const urlWithKey = `${baseUrl}?method=flickr.photos.search&api_key=${apiKey}&`
function createUrlData(text, sort, page, pageAmount) {
  return `${urlWithKey}text=${text}&sort=${sort}&page=${page}&per_page=${pageAmount}&format=json&nojsoncallback=1`
}
function fetchData(text, sort, page, pageAmount) {
  return fetch(createUrlData(text, sort, page, pageAmount))
    .then(response => response.json())
    .then(res => res.photos.photo)
}

const baseImageUrl = "https://live.staticflickr.com/"
function createImageUrl(server, imageId, secret, size) {
  return `${baseImageUrl}${server}/${imageId}_${secret}_${size}.jpg`
}
function fetchImageUrl(server, imageId, secret, size) {
  return fetch(createImageUrl(server, imageId, secret, size))
    .then(response => response.url)
}
function fetchAllData(text, sort, page, pageAmount, size, preCallback, urlCallback) {
  return fetchData(text, sort, page, pageAmount)
    .then(result => {
      preCallback()

      for (let i = 0; i < result.length; i++) {
        const item = result[i]
        const imageId = item.id;
        const secret = item.secret;
        const server = item.server;
        fetchImageUrl(server, imageId, secret, size)
          .then(url => urlCallback(url))
      }
    })
}

const textFieldElement = $("#text-field")
const sortSelectFieldElement = $("#sort-select-field")
const imageSizeSelectFieldElement = $("#image-size-select-field")
const imageAmountSelectFieldElement = $("#image-amount-select-field")
const content = $("#content")
const errorContent = $("#error-content")
const loadingElement = $("#loading-element")
loadingElement.hide()

$(document).ready(function(){
  $("#form").submit(function(event) {
    event.preventDefault()

    const isTextValid = textFieldElement.val() !== "" && textFieldElement.val() !== undefined 
    const isSortValid = sortSelectFieldElement.val() !== "" && sortSelectFieldElement.val() !== undefined 
    const isPageAmountValid = imageAmountSelectFieldElement.val() !== "" && imageAmountSelectFieldElement.val() !== undefined 
    const isSizeValid = imageSizeSelectFieldElement.val() !== "" && imageSizeSelectFieldElement.val() !== undefined 
    const isValid = isTextValid && isSortValid && isPageAmountValid && isSizeValid

    if (isValid) {
      fetchAllData(
        textFieldElement.val(), 
        sortSelectFieldElement.val(), 
        "1", 
        imageAmountSelectFieldElement.val(), 
        imageSizeSelectFieldElement.val(),
        // pre callback
        () => { 
          content.empty()
          errorContent.empty()
          loadingElement.show()
        },
        // success callback
        (url) => {
          const imageElement = document.createElement("img")
          imageElement.src = url;
          content.append(imageElement)
          loadingElement.hide()
        }
      )
    }
    else {
      const pElement = document.createElement("p")
      pElement.innerHTML = "Fyll i alla fält för att söka efter bilder."
      errorContent.append(pElement)
      loadingElement.hide()
    }
  })
});









