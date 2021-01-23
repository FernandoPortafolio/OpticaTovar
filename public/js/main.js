/*
   Este Script configura todos los plugins que se ocupan en la parte de la pagina del negocio
   Ademas se encarga de algunas animaciones como la de la barra del carrito y las FAQ

   Table Of Content
   
   1. Preloader
   2. Typed.js
   3. Menu Cambiante de color
   4. Mapa Leaflet.js
   5. Scroll Reveal.js
   6. Preguntas Frecuentes
   7. Tienda
   8. Menu Toggler Para el carrito

*/
$(document).ready(function () {
  //Configurar el preloader
  if ($('#page-loader').length) {
    $('#page-loader').fadeOut(1000);
  }

  //Configurar Typed.js
  if ($('#typed').length) {
    var typed = new Typed('#typed', {
      strings: [
        'La Óptica que Cortazar prefiere.',
        'Tu mejor Opción.',
        'Óptica Tovar..',
      ],
      typeSpeed: 70,
      backSpeed: 30,
      backDelay: 700,
    });
  }

  //Menu Cambiante de color
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll > 100) {
      $('.navbar').addClass('bg-primary');
      $('.navbar').removeClass('bg-transparent');

      $('.dropdown-menu').removeClass('transparent');
      $('.dropdown-item').removeClass('transparent');
    } else {
      $('.navbar').addClass('bg-transparent');
      $('.navbar').removeClass('bg-primary');

      $('.dropdown-menu').addClass('transparent');
      $('.dropdown-item').addClass('transparent');
    }
  });

  //creamos el mapa con el codigo ofrecido en leafletjs.com
  if ($('#mapa').length) {
    var map = L.map('mapa').setView([20.482314, -100.961799], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([20.482314, -100.961799])
      .addTo(map)
      .bindPopup('Optica Tovar <br> Te esperamos')
      .openPopup();
  }

  //Scrol Reveal
  if ($('.index').length) {
    window.sr = ScrollReveal();
    sr.reveal('#lo-nuevo', {
      duration: 2000,
      origin: 'bottom',
      distance: '300px',
      viewFactor: 0.2,
    });

    sr.reveal('#mapa', {
      duration: 2000,
      origin: 'top',
      distance: '300px',
      viewFactor: 0.2,
    });
  }

  //Preguntas Frecuentes
  if ($('.preguntas').length) {
    $('.pregunta').click(function (e) {
      $(e.target).parent().children().last().slideToggle();
      console.log(
        $(e.target)
          .children()
          .toggleClass('fa-caret-up')
          .toggleClass('fa-caret-down')
      );
    });
  }

  //Tienda
  if ($('.tienda').length) {
    $('.titulo-filtro').click(function (e) {
      $(this).parent().children().last().slideToggle();
      $(this).children().last().toggleClass('fa-plus').toggleClass('fa-minus');
    });
  }

  //Menu Toggler Para el carrito
  $('.toggler').click(function (e) {
    e.preventDefault();
    $('#wrapper').toggleClass('untoggled');
  });

  
});
