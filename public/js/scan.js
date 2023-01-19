let alertString = "Your image was submitted. Now you can update the new information or read more information for the mushroom."
let base64String = "";
let currentImage;
const fungiList = ["Agaricus trisulphuratus", "Chlorophyllum molybdites", "Leucocoprinus birnbaumii", "Amanita exitialis",
  "Amanita farinosa", "Amanita pseudoporphyria", "Auricularia cornea",
  "Gymnopilus aeruginosus", "Pseudosperma rimosum", "Phallus multicolor", "Ganoderma applanatum",
  "Ganoderma lingzhi", "Ganoderma tropicum", "Pseudofavolus tenuis", "Pycnoporus sanguineus",
  "Sanguinoderma rugosum", "Trametes versicolor", "Coprinellus micaceus", "Schizophyllum commune",
  "Xylobolus spectabilis"
]
let currentFungiId;
const getBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.replace('data:', '').replace(/^.+,/, ''));
  reader.onerror = error => reject(error);
})




const fungiFormElement = document.querySelector('#fungi-contact-form');
fungiFormElement.addEventListener('submit', predictFungi)
async function predictFungi(e) {
  e.preventDefault();
  const form = e.target

  const file = form.fungiImg.files[0]

  // formData.append('image', file)

  //const res = await fetch('/fungi_gallery/contact', {
  //  method: 'POST',
  //  body: formData
  //})
  const formData = new FormData(fungiFormElement)
  const reader = new FileReader();
  reader.onloadend = () => {
    // Use a regex to remove data url part
    base64String = reader.result
      .replace('data:', '')
      .replace(/^.+,/, '');

    console.log(base64String);
    return base64String
    // Logs wL2dvYWwgbW9yZ...
  };
  reader.readAsDataURL(file)
  base64String = await getBase64(file)
  //alert(base64String);
  const formObject = {}
  formObject['base64String'] = base64String
  const res02 = await fetch('http://localhost:8000/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formObject),
  })
  let scanInf = document.getElementsByClassName("scan-inf")[0]
  console.log(scanInf)
  if (res02.ok) {
    //form.reset()
    let mushroomInfoElement = document.getElementsByClassName("mushroom-info")
    for (let i = 0; i < mushroomInfoElement.length; i++) {
      infoElement = document.getElementsByClassName("mushroom-info")[i]
      infoElement.style.display = "flex"
    }

    currentImage = form.fungiImg.files[0]
    const result02 = await res02.json()
    base64String = await getBase64(file)
    scanInf.style.display = "none"
    //alert(result02.message)
    console.log(result02.message)
    document.getElementById("predict-result").innerHTML = result02.className
    getLocation02()



    for (let i = 0; i < fungiList.length; i++) {
      if (fungiList[i] === result02.className) {
        fungus_id = i + 1
      }
    }
    let location = document.getElementById("mushroom-address").innerHTML

    console.log('fungiList=' + fungus_id)
    let moreInfoPageElement = document.getElementsByClassName("more-info-div")[0]
    moreInfoPageElement.innerHTML = `<a href="fungi.html?fungus_id=${fungus_id}">More Info</a>`
  }
}

const UploadFormElement = document.querySelector('#upload-form');
UploadFormElement.addEventListener('submit', uploadFungi)
async function uploadFungi(e) {
  e.preventDefault()
  const formData = new FormData(UploadFormElement)
  let location = document.getElementById("mushroom-address").innerHTML
  let latlngString = location.split(', ').join(',')
  console.log(latlngString)
  let fungiName = document.getElementById("predict-result").innerHTML
  const userId = await loadUser()
  formData.append('userId', userId)
  formData.append('image', currentImage)
  formData.append('location', location)
  formData.append('fungiName', fungiName)
  const resForLocationName = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlngString}&language=en&key=AIzaSyBGwlJ0Ex9sdPkD8dOEuVytxBesNHua6NA`)
  const ForLocationName = await resForLocationName.json()
  formData.append('locationName', ForLocationName.results[1].formatted_address)

  const res = await fetch('/fungi_gallery/contact', {
    method: 'POST',
    body: formData
  })



  console.log(formData)
  if (res.ok) {
    alert("file upload!")
  }
}


function showPreview(event) {
  if (event.target.files.length > 0) {
    let src = URL.createObjectURL(event.target.files[0]);
    let preview = document.getElementById("file-ip-1-preview");
    preview.src = src;
    preview.style.display = "block";
  }
}


// Get the modal
// let modal = document.getElementById("submit-info");
let modal = document.getElementById("myModal");

// Get the button that opens the modal
// let btn = document.getElementById("fungi-popup");
let btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
//btn.onclick = function () {
//  modal.style.display = "block";
//}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";

  }
}


function clickAlert() {
  alert(alertString);
}



let x = document.getElementById("location");

//function getlocation() {
// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(showPosition)
// } else {
//   alert("Sorry! your browser is not supporting")
//  }
//}

//function showPosition(position) {
// let x = "Your current location is (" + "Latitude: " + position.coords.latitude + ", " + "Longitude: " + position.coords.longitude + ")";
//  document.getElementById("location").innerHTML = x;
//}


function getLocation02() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition02)
  } else {
    alert("Sorry! your browser is not supporting")
  }
}

function showPosition02(position) {
  let x = position.coords.latitude + ", " + position.coords.longitude;
  document.getElementById("mushroom-address").innerHTML = x;
}





// (() => {
//     // The width and height of the captured photo. We will set the
//     // width to the value defined here, but the height will be
//     // calculated based on the aspect ratio of the input stream.

//     const width = 320; // We will scale the photo width to this
//     let height = 0; // This will be computed based on the input stream

//     // |streaming| indicates whether or not we're currently streaming
//     // video from the camera. Obviously, we start at false.

//     let streaming = false;

//     // The various HTML elements we need to configure or control. These
//     // will be set by the startup() function.

//     let video = null;
//     let canvas = null;
//     let photo = null;
//     let startbutton = null;

//     function showViewLiveResultButton() {
//       if (window.self !== window.top) {
//         // Ensure that if our document is in a frame, we get the user
//         // to first open it in its own tab or window. Otherwise, it
//         // won't be able to request permission for camera access.
//         document.querySelector(".contentarea").remove();
//         const button = document.createElement("button");
//         button.textContent = "View live result of the example code above";
//         document.body.append(button);
//         button.addEventListener('click', () => window.open(location.href));
//         return true;
//       }
//       return false;
//     }

//     function startup() {
//       if (showViewLiveResultButton()) { return; }
//       video = document.getElementById('video');
//       canvas = document.getElementById('canvas');
//       photo = document.getElementById('photo');
//       startbutton = document.getElementById('startbutton');

//       navigator.mediaDevices.getUserMedia({video: true, audio: false})
//         .then((stream) => {
//           video.srcObject = stream;
//           video.play();
//         })
//         .catch((err) => {
//           console.error(`An error occurred: ${err}`);
//         });

//       video.addEventListener('canplay', (ev) => {
//         if (!streaming) {
//           height = video.videoHeight / (video.videoWidth/width);

//           // Firefox currently has a bug where the height can't be read from
//           // the video, so we will make assumptions if this happens.

//           if (isNaN(height)) {
//             height = width / (4/3);
//           }

//           video.setAttribute('width', width);
//           video.setAttribute('height', height);
//           canvas.setAttribute('width', width);
//           canvas.setAttribute('height', height);
//           streaming = true;
//         }
//       }, false);

//       startbutton.addEventListener('click', (ev) => {
//         takepicture();
//         ev.preventDefault();
//       }, false);

//       clearphoto();
//     }

//     // Fill the photo with an indication that none has been
//     // captured.

//     function clearphoto() {
//       const context = canvas.getContext('2d');
//       context.fillStyle = "#AAA";
//       context.fillRect(0, 0, canvas.width, canvas.height);

//       const data = canvas.toDataURL('image/png');
//       photo.setAttribute('src', data);
//     }

//     // Capture a photo by fetching the current contents of the video
//     // and drawing it into a canvas, then converting that to a PNG
//     // format data URL. By drawing it on an offscreen canvas and then
//     // drawing that to the screen, we can change its size and/or apply
//     // other changes before drawing it.

//     function takepicture() {
//       const context = canvas.getContext('2d');
//       if (width && height) {
//         canvas.width = width;
//         canvas.height = height;
//         context.drawImage(video, 0, 0, width, height);

//         const data = canvas.toDataURL('image/png');
//         photo.setAttribute('src', data);
//       } else {
//         clearphoto();
//       }
//     }

//     // Set up our event listener to run the startup process
//     // once loading is complete.
//     window.addEventListener('load', startup, false);
//   })();