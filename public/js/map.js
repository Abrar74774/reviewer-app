// FROM HOME.JS FILE
// const reviews = document.getElementById("reviews");
// const placeName = document.getElementById("place-name");
// const longitude = document.getElementById("longitude");
// const lattitude = document.getElementById("lattitude");
//const addReview = document.getElementById("add-review-btn");
//let marker = new mapboxgl.Marker();

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWJyYXI3NDc3NCIsImEiOiJja2F0ajhiNmswbG9jMnJsMnhjczVydTZlIn0.NW7k7GG4cIi4CUm4-wga6Q";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [25, 25.5],
  zoom: 7,
});

async function getPlaces() {
  const res = await fetch("/api/places");
  const data = await res.json();

  function getRating(object) {
    let stars = "";
    for (let i = 1; i <= object.rating; i++) {
      stars += '<i class="fas fa-star yellow"></i>';
    }
    for (let i = 1; i <= 5 - object.rating; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
    return stars;
  }

  const places = data.data.map((place) => {
    const review = `
            <h1 class="text-xl mb-2 text-xl">Reviews</h1>
            ${place.reviews
              .map(
                (object) => `
                <div class="p-2 h-24 w-full my-2">
                    <span class="py-1 px-3 rounded-md bg-gray-300 shadow-sm" id="username">${
                      object.username
                    }</span>
                    <div class="w-auto px-2 py-1 text-inherit bg-blue-400 rounded-md shadow-sm inline-block">
                        ${getRating(object)}
                    </div>
                    <p id="review" class="my-1 p-2">${object.review}</p>
                </div>
            `
              )
              .join("")}
        `;
    return {
      type: "Feature",
      properties: {
        name: place.name,
        description: review,
        icon: "marker-15",
      },
      geometry: {
        type: "Point",
        coordinates: [
          place.location.coordinates[0],
          place.location.coordinates[1],
        ],
      },
    };
  });

  loadMap(places);
}

function loadMap(places) {
  map.on("load", function () {
    map.addSource("places", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: places,
      },
    });
    // Add a layer showing the places.
    map.loadImage("../images/marker.png", function (error, image) {
      if (error) throw error;
      map.addImage("marker", image);
      map.addLayer({
        id: "places",
        type: "symbol",
        source: "places",
        layout: {
          "icon-image": "marker",
          "icon-allow-overlap": true,
          "icon-size": 0.6,
          "text-field": "{name}",
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 1],
          "text-anchor": "top",
        },
      });
    });

    let mouseOnIcon = false;
    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on("click", "places", function (e) {
      let description = e.features[0].properties.description;
      let name = e.features[0].properties.name;
      let coordinates = e.features[0].geometry.coordinates;
      console.log(coordinates);

      if (window.innerWidth < 1024 && mouseOnIcon) {
        mapElement.style.flex = "3";
        details.style.flex = "2";
      }
      map.flyTo({ center: coordinates });
      reviews.innerHTML = description;

      placeName.innerText = name;
      placeName.style.display = "block";

      reviewPlaceName.innerText = name;

      selectedPlaceName = name;
      selectedPlaceCoordinates = coordinates;
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on("mouseenter", "places", function () {
      mouseOnIcon = true;
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "places", function () {
      mouseOnIcon = false;
      map.getCanvas().style.cursor = "";
    });

    map.on("click", function (e) {
      if (addPlace.style.display === "block") {
        longitude.value = e.lngLat.lng;
        lattitude.value = e.lngLat.lat;

        marker.setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(map);
      } else if (window.innerWidth < 1024 && !mouseOnIcon) {
        mapElement.style.flex = "1";
        details.style.flex = "0";
      }
    });
  });
}

getPlaces();
