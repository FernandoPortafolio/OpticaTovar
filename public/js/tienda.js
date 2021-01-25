/*
En este archivo se hacen todas las peticiones AJAX para la pagina de la tienda
*/
class TiendaUI {
  constructor() {
    this.formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    })
    this.currentPage = 1
    this.filter = 0
    this.orderBy = 0
  }

  async updateProducts() {
    let response = await fetch(this.getProductUrl())
    let data = await response.json()

    $('.productos').html('')
    data.items.forEach((producto) => {
      var html = `
          <div class="col-md-4 producto">
            <p class="marca">${producto.marca}</p>
            <img src="img/productos/${
              producto.foto
            }" alt="Imagen del producto" height="170">
            <div class="contenido-producto">
              <p class="description">${producto.descripcion}</p>
              <div class="division"><span></span></div>
              <p class="precio">${this.formatter.format(producto.precio)}</p>
            </div>
            <div class="row justify-content-around">
              <button class="btn btn-sm btn-primary btn-add" data-id=${
                producto.id_producto
              }>
                <i class="fas fa-cart-plus"></i>Lo quiero
              </button>
              <a href="detalle-producto?id_producto=${
                producto.id_producto
              }" class="btn btn-sm btn-info">
                <i class="fas fa-caret-square-right"></i>Ver más
              </a>
            </div>
          </div>`
      $('.productos').append(html)
    })

    //add prodcuts to sessionStorage
    window.sessionStorage.setItem('products', JSON.stringify(data.items))

    $('.btn-add').click(async function (e) {
      e.preventDefault()
      let id_producto = $(this).attr('data-id')
      let producto = data.items.find((prod) => prod.id_producto == id_producto)
      producto.cantidad = 1
      if (await cart.addItem(producto)) {
        cartUI.updateCart(cart)
        Swal.fire('Perfecto!', `Se agregó el producto al carrito`, 'success')
      } else {
        Swal.fire(
          'Lo sentimos!',
          `No hay suficiente producto para satisfacer tu pedido`,
          'warning'
        )
      }
    })
    this.updatePagination(data)
  }

  updatePagination(products) {
    let page = products.page
    let lastPage = products.totalPages
    let previousPage = page == 1 ? -1 : page - 1
    let nextPage = page == lastPage ? -1 : page + 1
    var html = `<li class="d-flex"><p class="mr-5 my-auto text-muted small">Se muestran ${products.start} - ${products.end} de ${products.totalProducts} resultados</p></li>`
    if (previousPage != -1)
      html += `
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" data-page=${previousPage}>
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>`
    for (let i = page - 2; i <= page + 2; i++) {
      if (i > 0 && i <= lastPage) {
        let active = i == this.currentPage ? 'active' : ''
        html += `<li class="page-item ${active}"><a class="page-link" href="#" data-page=${i}>${i}</a></li>`
      }
    }
    if (nextPage != -1)
      html += `
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Next" data-page=${nextPage}>
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>`

    if (products.totalPages > 1) {
      $('.pagination').html(html)
      addPaginationListener()
    } else {
      $('.pagination').html('')
    }
  }

  getProductUrl() {
    return `http://localhost:3000/api/products/pagination?page=${this.currentPage}&filter=${this.filter}&orderBy=${this.orderBy}`
  }
}

class DetalleProductoUI {
  actualizarTotal() {
    let cantidad = $('#quantity').val()
    let precio = $('#precio').val()
    let total = cantidad * precio
    $('#lblPrecio').text(
      total.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    )
  }
}

let tiendaUI = new TiendaUI()
tiendaUI.updateProducts()

//==========================================================
//Pagina tienda  - Events
//==========================================================
function addPaginationListener() {
  $('.pagination a').click(function (e) {
    e.preventDefault()
    let page = $(this).attr('data-page')
    tiendaUI.currentPage = page
    tiendaUI.updateProducts()
  })
}

$('#select_order').change(function (e) {
  e.preventDefault()
  tiendaUI.orderBy = $(this).val()
  tiendaUI.currentPage = 1
  tiendaUI.updateProducts()
})

$('#categorias a').click(function (e) {
  e.preventDefault()
  $('#categorias a').removeClass('category-active')
  $(this).addClass('category-active')

  tiendaUI.currentPage = 1
  tiendaUI.filter = $(this).attr('data-filter')
  tiendaUI.updateProducts()
})

//==========================================================
//Pagina detalle producto - Events
//==========================================================
let detalleProductoUI = new DetalleProductoUI()
$('#quantity').change(function (e) {
  e.preventDefault()
  detalleProductoUI.actualizarTotal()
})

$('.btn-add-many').click(async function (e) {
  e.preventDefault()
  let id_producto = $('#id_producto').val()
  let quantity = $('#quantity').val()
  let products = JSON.parse(window.sessionStorage.getItem('products'))
  let product = products.find((prod) => prod.id_producto == id_producto)
  product.cantidad = parseInt(quantity)
  if (await cart.addItem(product)) {
    cartUI.updateCart(cart)
    Swal.fire(
      'Perfecto!',
      `Se agregaron ${quantity} existencias del producto al carrito`,
      'success'
    )
  } else {
    Swal.fire(
      'Lo sentimos!',
      'No hay suficiente producto para satisfacer tu pedido',
      'warning'
    )
  }
})
