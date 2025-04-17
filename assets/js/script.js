'use strict';

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
      elements[i].addEventListener(eventType, callback);
  }
}

let availableTables = 30;
let reservationsList = [];

const handleReservationSubmit = function (event) {
    event.preventDefault();

    const name = document.querySelector('input[name="name"]').value;
    const phone = document.querySelector('input[name="phone"]').value;
    const person = document.querySelector('select[name="person"]').value;
    const date = document.querySelector('input[name="reservation-date"]').value;
    const time = document.querySelector('select[name="time"]').value;
    const message = document.querySelector('textarea[name="message"]').value;

    const newReservation = {
        name,
        phone,
        person,
        date,
        time,
        message
    };

    if (availableTables > 0) {
        reservationsList.push(newReservation);
        availableTables--;
        updateTableCount();
        loadReservation();
        event.target.reset();
    } else {
        console.error('No tables available');
    }
}

const completeReservation = function (index) {
    availableTables++;
    reservationsList.splice(index, 1);
    updateTableCount();
    loadReservation();
}

const loadReservation = function () {
    const reservationList = document.getElementById('reservation-list');
    reservationList.innerHTML = reservationsList.map((reservation, index) => `
        <li>
            <strong>Name:</strong> ${reservation.name}<br>
            <strong>Phone:</strong> ${reservation.phone}<br>
            <strong>People:</strong> ${reservation.person}<br>
            <strong>Date:</strong> ${reservation.date}<br>
            <strong>Time:</strong> ${reservation.time}<br>
            <strong>Message:</strong> ${reservation.message}<br>
            <button class="complete-btn" onclick="completeReservation(${index})">Complete</button>
        </li>
    `).join('');

    updateTableCount();
}

const updateTableCount = function () {
    const tableCountElement = document.getElementById('table-count');
    tableCountElement.textContent = availableTables;
}

const saveReservation = function (reservation) {
  try {
      const conn = new ActiveXObject("ADODB.Connection");
      const connStr = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\Users\\vydy3\\OneDrive\\Desktop\\Restaurant\\Restaurant\\Reservations.accdb;Persist Security Info=False;";
      conn.Open(connStr);
      
      const rs = new ActiveXObject("ADODB.Recordset");
      rs.Open("Reservations", conn, 1, 3); // 1 = adOpenKeyset, 3 = adLockOptimistic

      rs.AddNew();
      rs.Fields("Name").Value = reservation.name;
      rs.Fields("Phone").Value = reservation.phone;
      rs.Fields("Person").Value = reservation.person;
      rs.Fields("Date").Value = reservation.date;
      rs.Fields("Time").Value = reservation.time;
      rs.Fields("Message").Value = reservation.message;
      rs.Update();

      rs.Close();
      conn.Close();
  } catch (e) {
      console.error("Error: " + e.message);
  }
};

document.addEventListener("DOMContentLoaded", function () {
    const reservationForm = document.querySelector('.form-left');

    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservationSubmit);
    }

    loadReservation();
});

document.addEventListener("DOMContentLoaded", function () {
  const preloader = document.querySelector("[data-preaload]");

  if (preloader) {
      preloader.classList.add("loaded");
      document.body.classList.add("loaded");
  }

  const navbar = document.querySelector("[data-navbar]");
  const navTogglers = document.querySelectorAll("[data-nav-toggler]");
  const overlay = document.querySelector("[data-overlay]");

  const toggleNavbar = function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("nav-active");
  }

  if (navTogglers.length > 0) {
    addEventOnElements(navTogglers, "click", toggleNavbar);
  }

  const header = document.querySelector("[data-header]");
  const backTopBtn = document.querySelector("[data-back-top-btn]");

  let lastScrollPos = 0;

  const hideHeader = function () {
    const isScrollBottom = lastScrollPos < window.scrollY;
    if (isScrollBottom) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }

    lastScrollPos = window.scrollY;
  }

  window.addEventListener("scroll", function () {
    if (window.scrollY >= 50) {
      if (header) {
        header.classList.add("active");
        hideHeader();
      }
      if (backTopBtn) {
        backTopBtn.classList.add("active");
      }
    } else {
      if (header) {
        header.classList.remove("active");
      }
      if (backTopBtn) {
        backTopBtn.classList.remove("active");
      }
    }
  });
  const heroSlider = document.querySelector("[data-hero-slider]");
  const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");

  let currentSlidePos = 0;
  let lastActiveSliderItem = heroSliderItems[0];

  const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
  const heroSliderNextBtn = document.querySelector("[data-next-btn]");

  const updateSliderPos = function () {
    if (lastActiveSliderItem) {
      lastActiveSliderItem.classList.remove("active");
    }

    if (heroSliderItems[currentSlidePos]) {
      heroSliderItems[currentSlidePos].classList.add("active");
      lastActiveSliderItem = heroSliderItems[currentSlidePos];
    }
  }

  const slideNext = function () {
    if (currentSlidePos >= heroSliderItems.length - 1) {
        currentSlidePos = 0;
    } else {
        currentSlidePos++;
    }

    updateSliderPos();
  }

  if (heroSliderNextBtn) {
    heroSliderNextBtn.addEventListener("click", slideNext);
  }

  const slidePrev = function () {
    if (currentSlidePos <= 0) {
        currentSlidePos = heroSliderItems.length - 1;
    } else {
        currentSlidePos--;
    }

    updateSliderPos();
  }

  if (heroSliderPrevBtn) {
    heroSliderPrevBtn.addEventListener("click", slidePrev);
  }

  let autoSlideInterval;

  const autoSlide = function () {
    autoSlideInterval = setInterval(function () {
      slideNext();
    }, 7000);
  }

  if (heroSliderNextBtn && heroSliderPrevBtn) {
    addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
        clearInterval(autoSlideInterval);
    });

    addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);
  }

  window.addEventListener("load", autoSlide);

  const parallaxItems = document.querySelectorAll("[data-parallax-item]");

  let x, y;

  window.addEventListener("mousemove", function (event) {
    x = (event.clientX / window.innerWidth * 10) - 5;
    y = (event.clientY / window.innerHeight * 10) - 5;

    x = x - (x * 2);
    y = y - (y * 2);

    for (let i = 0, len = parallaxItems.length; i < len; i++) {
      x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
      y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
      parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
    }
  });
});
