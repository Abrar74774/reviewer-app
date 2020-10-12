const mapElement = document.getElementById("map");
const details = document.getElementById("details");

const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");

const placeName = document.getElementById("place-name");
const longitude = document.getElementById("longitude");
const lattitude = document.getElementById("lattitude");

const welcome = document.getElementById("welcome");
const buttonDisplay = document.getElementById("button-display");
const addPlaceForm = document.getElementById("add-place-form");
const addReviewForm = document.getElementById("add-review-form");

const tooltip = document.getElementById("tooltip");
const addReviewBtn = document.getElementById("add-review-btn");
const addPlaceBtn = document.getElementById("add-place-btn");
const back = document.getElementById("back-btn");

const desc = document.getElementById("desc");
const addPlace = document.getElementById("add-place");
const addReview = document.getElementById("add-review");

const backFromReview = document.getElementById("back-from-review");
const reviewPlaceName = document.getElementById("add-review-place-name");
const star1 = document.getElementById("star1");
const star2 = document.getElementById("star2");
const star3 = document.getElementById("star3");
const star4 = document.getElementById("star4");
const star5 = document.getElementById("star5");
let reviewStarsArray = [star1, star2, star3, star4, star5];
let rating = 0;

let marker = new mapboxgl.Marker();
let selectedPlaceCoordinates = [];
let selectedPlaceName = "";
let username = "";
console.log(placeName);

// Check if logged in
fetch("/info")
  .then((res) => res.json())
  .then((data) => {
    if (data.username) {
      username = data.username;
      welcome.innerText = "Hello " + data.username;
      buttonDisplay.style.display = "block";

      loginBtn.style.display = "none";
      registerBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    }
  });

window.addEventListener("load", () => {
  reviewStarsArray.forEach((star) => {
    star.addEventListener("mouseover", () => {
      reviewStarsArray
        .slice(0, reviewStarsArray.indexOf(star) + 1)
        .forEach((arrayElement) => {
          arrayElement.classList.add("yellow-hover");
        });
    });
    star.addEventListener("mouseout", () => {
      reviewStarsArray
        .slice(0, reviewStarsArray.indexOf(star) + 1)
        .forEach((arrayElement) => {
          arrayElement.classList.remove("yellow-hover");
        });
    });
    star.addEventListener("click", () => {
      reviewStarsArray.forEach((element) => {
        element.classList.remove("yellow");
      });
      reviewStarsArray
        .slice(0, reviewStarsArray.indexOf(star) + 1)
        .forEach((arrayElement) => {
          arrayElement.classList.add("yellow");
        });
      rating = reviewStarsArray.indexOf(star) + 1;
      console.log(rating);
    });
  });
});

addReviewBtn.addEventListener("click", () => {
  if (placeName.innerText == "") {
    tooltip.style.display = "block";
    setTimeout(() => (tooltip.style.display = "none"), 5000);
  } else {
    desc.style.display = "none";
    addPlace.style.display = "none";
    addReview.style.display = "block";
  }
});

addPlaceBtn.addEventListener("click", () => {
  desc.style.display = "none";
  addPlace.style.display = "block";
  addReview.style.display = "none";
  //addPlace.style.display = 'none';
  //back.style.display = 'block';
});

back.addEventListener("click", () => {
  desc.style.display = "block";
  addPlace.style.display = "none";
  //addPlace.style.display = 'block';
  //back.style.display = 'none';
});

backFromReview.addEventListener("click", () => {
  desc.style.display = "block";
  addReview.style.display = "none";
  //addPlace.style.display = 'block';
  //back.style.display = 'none';
});

addPlaceForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("/api/places", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name: addPlaceForm.name.value,
      location: {
        coordinates: [
          addPlaceForm.longitude.value,
          addPlaceForm.lattitude.value,
        ],
      },
      reviews: [],
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
  mapboxgl.removeMarker();
  desc.style.display = "block";
  addPlace.style.display = "none";
});

addReviewForm.addEventListener("submit", (e) => {
  console.log("PUT request sent");
  e.preventDefault();
  fetch("/api/places", {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name: selectedPlaceName,
      location: {
        coordinates: selectedPlaceCoordinates,
      },
      pushReview: {
        username: username,
        rating: rating,
        review: addReviewForm.review.value,
      },
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
  desc.style.display = "block";
  addReview.style.display = "none";
});

logoutBtn.addEventListener("click", () => {
  fetch("/logout").then((window.location = "/"));
});
