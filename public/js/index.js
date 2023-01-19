//navbar
// window.onscroll = function () {
//   stickyBar()
// };

// let navbar = document.getElementById("navbar");
// // let sticky = navbar.offsetTop;

// function stickyBar() {
//   if (window.pageYOffset >= sticky) {
//     navbar.classList.add("sticky")
//   } else {
//     navbar.classList.remove("sticky");
//   }
// }

async function loadFilter() {
  // quick search regex
  var qsRegex;
  
  // init Isotope
  var $grid = $('.grid').isotope({
    itemSelector: '.fungus-item',
    layoutMode: 'fitRows',
    filter: function () {
      return qsRegex ? $(this).text().match(qsRegex) : true;
    }
  });
  
  // use value of search field to filter
  var $quicksearch = $('.quicksearch').keyup(debounce(function () {
    qsRegex = new RegExp($quicksearch.val(), 'gi');
    $grid.isotope();
  }, 200));
  
  // debounce so filtering doesn't happen every millisecond
  function debounce(fn, threshold) {
    var timeout;
    threshold = threshold || 100;
    return function debounced() {
      clearTimeout(timeout);
      var args = arguments;
      var _this = this;
      function delayed() {
        fn.apply(_this, args);
      }
      timeout = setTimeout(delayed, threshold);
    };
  }
  }

// v searching bar v

// insert fungi according to the database
const gridDiv = document.querySelector('.grid')

// v fungi data array that contains reusable fungi data
let fungiDataArray = []

// generate the blocks of fungi in index.html
async function loadFungi() {
  const res = await fetch('/fungi/fungiData')
  if (res.ok) {
    let data = await res.json()

    let theFungiData = data.data
    fungiDataArray = theFungiData
    // console.log(theFungiData)
 
    for (let fungusData of theFungiData) {

        
          let folderName = fungusData.scientific_name.replace(" ", "_")
        
          let imageName = folderName + "2" 

          gridDiv.innerHTML += `
         <div class="fungus-item" index="${fungusData.id}">
          <img src="/uploads/${imageName}.jpg" class="fungus-img">
          <div class="name"> ${fungusData.scientific_name} </div>
      </div>
    `
          // shortDescriptionDiv.
    }
  }
  loadFilter()
  addButtonToLoadShortDescriptionDiv()

}

loadFungi()



function addButtonToLoadShortDescriptionDiv() {
  let fungiImageBlocks = document.querySelectorAll('.grid > .fungus-item')
  for (let fungusImageBlock of fungiImageBlocks) {
    let fungusIndex = fungusImageBlock.getAttribute('index');
    fungusImageBlock.addEventListener('click', () => {
      createTheShortDescriptionDivWithTheSameIndex(fungusIndex)

    })
  }
}

function createTheShortDescriptionDivWithTheSameIndex(fungusIndexInput) {

  console.log('clicked', fungusIndexInput)

  let containerDiv = document.querySelector('.shortDescriptionContainer');
  
  let infoDiv = containerDiv.querySelector('.sd_div')

  containerDiv.style.display = 'block'

  let closeBtn = containerDiv.querySelector('.closeShortDescriptionDiv')
  closeBtn.addEventListener('click',() => {
    // console.log("closed short description")
    containerDiv.style.display = 'none'
  })

  console.log("fungiDataArray", fungiDataArray)
  // fungusData = fungiDataArray[fungusIndexInput - 1]
  let fungusData = fungiDataArray.find((idInserted) => idInserted.id == fungusIndexInput )

  console.log("fungusData", fungusData)

  let folderName = fungusData.scientific_name.replace(" ", "_")
  let imageName = folderName + "2" 

  infoDiv.innerHTML = `

  <div class="sd_fungusImage" style="background-image: url(../fungi_assets/${folderName}1.jpg);">
  </div>
  <div class="sd_container">
  <div class="sd_familyNameContainer">
      Family Name: </div>
      <div class="sd_familyName">
      ${fungusData.name}
      
  </div>
  </div>

  <div class="sd_container">
  <div class="sd_scientificNameContainer">
      Scientific Name: </div>
      <div class="sd_scientificName">
      ${fungusData.scientific_name}
      
  </div>
  </div>

  <div class="sd_container">
  <div class="sd_commonNameContainer">
      Common Name: </div>
      <div class="sd_commonName">
     ${fungusData.common_name}
      
  </div>
  </div>

  <div class="sd_container">
  <div class="sd_edibilityContainer">
      Edibility: </div>
      <div class="sd_edibility">
      ${fungusData.edibility}
      
  </div>
  </div>

  <a class="sd-a" href="fungi.html?fungus_id=${fungusData.id}">More Info</a>
  `
  // <a href="fungi.html?fungus_id=${fungusData.id}&fungus_scientific_name=${fungusData.scientific_name}">More Info</a>

}





