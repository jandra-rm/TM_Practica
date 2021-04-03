/*!
    * Start Bootstrap - Freelancer v6.0.5 (https://startbootstrap.com/theme/freelancer)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
    */
(function ($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 71)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Scroll to top button appear
  $(document).scroll(function () {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function () {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 80
  });

  // Collapse Navbar
  var navbarCollapse = function () {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Floating label headings for the contact form
  $(function () {
    $("body").on("input propertychange", ".floating-label-form-group", function (e) {
      $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function () {
      $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function () {
      $(this).removeClass("floating-label-form-group-with-focus");
    });
  });


  //Carousel
  $(document).ready(function () {
    // Activate Carousel
    $("#myCarousel").carousel();

    // Enable Carousel Indicators
    $(".item1").click(function () {
      $("#myCarousel").carousel(0);
    });
    $(".item2").click(function () {
      $("#myCarousel").carousel(1);
    });
    $(".item3").click(function () {
      $("#myCarousel").carousel(2);
    });
    $(".item4").click(function () {
      $("#myCarousel").carousel(3);
    });

    // Enable Carousel Controls
    $(".left").click(function () {
      $("#myCarousel").carousel("prev");
    });
    $(".right").click(function () {
      $("#myCarousel").carousel("next");
    });
  });

})(jQuery); // End of use strict


// Prueba de imágenes con JSON
function myFunction(arr) {
  var i;
  for (i = 0; i < arr[0].length; i++) {
    var a = document.createElement('div');
    a.className = 'col-md-6 col-lg-4 mb-5';

    var b = document.createElement('div');
    b.className = 'portfolio-item mx-auto';
    b.attr("data-toggle", "modal");
    b.attr("data-target", "#portfolioModal1");
    a.appendChild(b);

    var img = document.createElement('img');
    img.src = arr[0][i];
    b.appendChild(img);

    var c = document.createElement('div');
    c.className = 'portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100';
    b.appendChild(c);

    var d = document.createElement('div');
    d.className = 'portfolio-item-caption-content text-center text-white sport';
    d.innerHTML = arr[1][i].display;
    c.appendChild(d);

    document.getElementById("catalogo").appendChild(a);
  }
}

//$(document).addEventListener('DOMContentLoaded', function () {
function prueba(){
  var xmlhttp = new XMLHttpRequest();
  var url = "datos.json";

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var myArr = JSON.parse(this.responseText);
      myFunction(myArr);
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();

//}, false);
}