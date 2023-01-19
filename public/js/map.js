let map;
var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAd960gdyIxn34ny5fSzJyxh5Vhx17pEiE&callback=initMap';
script.async = true;


const hk = {
  lat: 22.361483,
  lng: 114.164830
};

// const locations = {
//   // AgaricusTrisulphuratusSW: { lat:  22.405653, lng: 114.254310, name: "Agaricus-Trisulphuratus", fungiId: 1 },
//   // ChlorophyllumMolybditesSW: { lat: 22.412986, lng: 114.326645, name: " Chlorophyllum-Molybdites", userId: 2 },
//   // LeucocoprinusBirnbaumiiSW: { lat: 22.360406, lng: 114.152461, name: "Leucocoprinus-Birnbaumii", userId: 3 },

//   AgaricusTrisulphuratusSW: { lat:  22.405653, lng: 114.254310 },
//   ChlorophyllumMolybditesSW: { lat: 22.412986, lng: 114.326645 },
//   LeucocoprinusBirnbaumiiSW: { lat: 22.360406, lng: 114.152461 },


// }


async function initMap() {
  if (urlSeaParResult.has('fungus_id')){
    const formObject = {}
    formObject['fungus_id'] = urlSeaParResult.get('fungus_id')
    console.log(formObject)
    res = await fetch('/fungi/fungiDataAlternative', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject),
    })
    fungiDataForSQL = await res.json()
    console.log(fungiDataForSQL)
    fungiLocationData = fungiDataForSQL.fungiLocations
    console.log(fungiLocationData)
    let GoogleLocationData = [];
    for(let i = 0; i < fungiLocationData.length; i++){
      let formObject = {}
      formObject['location'] = {lat: fungiLocationData[i].location.x, lng: fungiLocationData[i].location.y}
      formObject['location_name'] = fungiLocationData[i].location_name
      GoogleLocationData.push(formObject)
    }
      console.log(GoogleLocationData[0].location)
  map = new google.maps.Map(document.getElementById("map"), {
    center: GoogleLocationData[0].location,
    zoom: 11,
  });
  infoWindow = new google.maps.InfoWindow();
  for (let i = 0; i < fungiLocationData.length; i++){
  const marker = new google.maps.Marker({
    position: GoogleLocationData[i].location,
    map: map,
    title: `<div class="location-name">${GoogleLocationData[i].location_name}</div>`,
    optimized: false,
  });

  marker.addListener("click", () => {
    infoWindow.close()
    infoWindow.setContent(marker.getTitle())
    infoWindow.open(marker.getMap(), marker)
  })

  
    

}
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}
}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation ?
    "Error: The Geolocation service failed." :
    "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}


// function initMap() {
//   const hk= { lat: 22.361483, lng: 114.164830 };

//   let fungiLocation = getFungiLocation()
//   console.table('fungiLocation', fungiLocation);


//   const mapOptions = {
//     // center: { lat: 22.302711, lng: 114.177216 },
//     center: position,
//     zoom: 20,
//     mapId: 'cbf287f2b7d6fbdd'
//   };
//   //insert 入html 
//   const mapDiv = document.getElementById('googleMap');
//   const map = new google.maps.Map(mapDiv, mapOptions);
//   // const infoWindow = new google.maps.InfoWindow();



//     map = new google.maps.Map(document.getElementById("map"), {
//       zoom: 12,
//       center: hk,
//     });

//     const marker = new google.maps.Marker({
//       position: hk,
//       map: map,
//     });
//   }





window.initMap = initMap;

// const marker = new google.maps.Marker({
//   position: hk,
//   map: map,
// });


// async function initMap() {

//   let fungiLocation = await getFungiLocation()
//    console.table('fungiLocation', fungiLocation);



//  map = new google.maps.Map(document.getElementById("map"), {
//    zoom: 12,
//    center: position,
//  });

//  const mapDiv = document.getElementById('googleMap');
//  const map = new google.maps.Map(mapDiv, mapOptions);


//  window.onload = onloadFungiLocation(); 

//  const locationButton = document.querySelector(".custom-map-control-button");
//  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(locationButton);
//  locationButton.addEventListener("click", onloadFungiLocation)

//  // infoWindow = new google.maps.InfoWindow();
//  // const locationButton = document.createElement("button");
//  // locationButton.textContent = "Pan to Current Location";
//  // locationButton.classList.add("custom-map-control-button");
//  function onloadFungiLocation() {
//    if (navigator.geolocation) {
//      navigator.geolocation.getFungiLocation(
//        (position) => {
//          let pos = {
//            lat: position.coords.latitude,
//            lng: position.coords.longitude,
//          };

//          postFungiLocationToServer(pos)

//          infoWindow.setPosition(pos);
//          // infoWindow.setContent("YOU ARE HERE");
//          infoWindow.setContent(/*HTML*/`
//          <div id="youAreHere">
//          <div><i class="fa-solid fa-child-reaching"></i></div>
//          <div>YOU</div>
//          </div>
//          `);

//          infoWindow.open(map);
//          map.setCenter(pos);
//        },
//        () => {
//          handleLocationError(true, infoWindow, map.getCenter());
//        }
//      );
//    } else {
//      // Browser doesn't support Geolocation
//      handleLocationError(false, infoWindow, map.getCenter());
//    }
//  }







//  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
//  locationButton.addEventListener("click", onloadCurrentLocation)
//  // Try HTML5 geolocation.
//  function onloadCurrentLocation() {

//    if (navigator.geolocation) {
//      navigator.geolocation.getCurrentPosition(
//        (position) => {
//          let pos = {
//            lat: position.coords.latitude,
//            lng: position.coords.longitude,
//          };
//          // console.log('current location GPS checking nav.geo pos :', pos);
//          postCurrentLocationToServer(pos)
//          infoWindow.open(map);
//          map.setCenter(pos);
//        },
//        () => {
//          handleLocationError(true, infoWindow, map.getCenter());
//        }
//      );
//    } else {

//      handleLocationError(false, infoWindow, map.getCenter());
//    }
//  }

//  async function postCurrentLocationToServer(pos) {

//    let res = await fetch('/userCurrentLocation', {
//      method: 'POST',
//      headers: {
//        "Content-Type": "application/json"
//      },
//      body: JSON.stringify(pos)
//    })


//    let result = await res.json()

//    console.log('result = ', result)
//  }


//  async function getFungiLocation() {

//    let res = await fetch('/fungiLocation')

//    return await res.json()

//  }


//  let markers = addMarkers(map)
//  console.log(markers)
//  clusterMarkers(map,markers)
//  addPanToMarker(map, markers)


//  // infoWindow.open(map,markers[1]);
//  let infoWindow
//  for (let i = 0; i < markers.length; i++) {
//    infoWindow = new google.maps.InfoWindow({
//      // content: constructInfoWindowContent(locations[Object.keys(locations)[i]]),
//      content: constructInfoWindowContent(locations[Object.keys(locations)[i]]),

//      // position: position,
//      maxWidth: 200,

//    });
//    infoWindows.push(infoWindow)

//    // infoWindow2.open(map, markers[i]);
//  }

//  return map;


// 