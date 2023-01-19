let getFungusIndexFromUser = ""
let fungusData = ""
let searchResult = window.location.search
let urlSeaParResult = new URLSearchParams(searchResult)

for (const [key, value] of urlSeaParResult) {
  getFungusIndexFromUser = value
}

// console.log(getFungusIndexFromUser)

async function loadFungus() {
  const res = await fetch('/fungi/fungiData')
  if (res.ok) {
    let data = await res.json()

    let theFungiData = data.data
    fungiDataArray = theFungiData

  } else {
    console.log(res.status)
    return
  }

  fungusData = fungiDataArray.find((idInserted) => idInserted.id == getFungusIndexFromUser )
  // console.log(fungusData)


  // v insert images here v 

  let folderName = fungusData.scientific_name.replace(" ", "_")

  let imgDiv1 = document.querySelector('.fungusImg1')
  imgDiv1.src = `../fungi_assets/${folderName}/${folderName}1.jpg`
  let imgDiv2 = document.querySelector('.fungusImg2')
  imgDiv2.src = `../fungi_assets/${folderName}/${folderName}2.jpg`
  let imgDiv3 = document.querySelector('.fungusImg3')
  imgDiv3.src = `../fungi_assets/${folderName}/${folderName}3.jpg`
  let expandedImgDiv = document.querySelector('#expandedImg')
  expandedImgDiv.src = `../fungi_assets/${folderName}/${folderName}1.jpg`


  // v insert info here v
  let familyNameDiv = document.querySelector('.familyName')
  familyNameDiv.innerHTML = fungusData.name

  let scientificNameDiv = document.querySelector('.scientificName')
  scientificNameDiv.innerHTML = fungusData.scientific_name

  let commonNameDiv = document.querySelector('.commonName')
  commonNameDiv.innerHTML = fungusData.common_name ? fungusData.common_name : "no common name"

  let authorityDiv = document.querySelector('.authority')
  authorityDiv.innerHTML = fungusData.authority

  let synonymDiv = document.querySelector('.synonym')
  synonymDiv.innerHTML = fungusData.synonym ? fungusData.synonym : "no synonym"

  let descriptionDiv = document.querySelector('.descriptions')
  descriptionDiv.innerHTML = fungusData.descriptions

  let habitatDiv = document.querySelector('.habitat')
  habitatDiv.innerHTML = fungusData.habitat

  let localDistributionsDiv = document.querySelector('.localDistributions')
  localDistributionsDiv.innerHTML = fungusData.local_distribution

  let nativeDiv = document.querySelector('.native')
  nativeDiv.innerHTML = fungusData.isNative

  let edibilityDiv = document.querySelector('.edibility')
  edibilityDiv.innerHTML = fungusData.edibility

  let edibilitySourceDiv = document.querySelector('.edibilitySource')
  edibilitySourceDiv.innerHTML = fungusData.edibility_source ? fungusData.edibility_source : "NA"

}


// function loadImgTest() {
//   let imgDiv1 = document.querySelector('.fungusImg1')

//   imgDiv1.src = "../fungi_assets/Agaricus_trisulphuratus/"

// }

// loadImgTest()



loadFungus()

function myFunction(imgs) {
  let expandImg = document.getElementById("expandedImg");
  expandImg.src = imgs.src;
  // expandImg.parentElement.style.display = "block";
}
