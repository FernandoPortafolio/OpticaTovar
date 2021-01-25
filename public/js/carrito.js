/**
 * Este script se ocupa de actualizar la barra lateral del carrito y agregar y remover items de ella
 * Cada que se pulsa sobre los botones de agregar o quitar un producto
 */
class Cart {
  constructor() {}

  getItems() {
    let cart = window.sessionStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
  }

  setItems(items) {
    items = JSON.stringify(items)
    window.sessionStorage.setItem('cart', items)
  }

  async addItem(producto) {
    let items = this.getItems()
    let thereIsStock = await this.verifyStock(producto)
    if (!thereIsStock) {
      return false
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.id_producto === producto.id_producto) {
        item.cantidad += producto.cantidad
        item.subtotal = item.cantidad * item.precio
        cart.setItems(items)
        return true
      }
    }

    producto.precio_unitario = producto.precio * 0.84
    items.push(producto)
    cart.setItems(items)
    return true
  }

  removeItem(id) {
    let items = this.getItems()
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.id === id) {
        item.cantidad--
        item.subtotal = item.cantidad * item.precio
        if (item.cantidad <= 0) {
          items.splice(i, 1)
        }
        return cart.setItems(items)
      }
    }

    cart.setItems(items)
  }

  getInfo() {
    let items = this.getItems()
    let total = items.reduce(function (acum, item) {
      acum += item.precio * item.cantidad
      return acum
    }, 0)
    let iva = total * 0.16
    let subtotal = total - iva
    return {
      total,
      iva,
      subtotal,
    }
  }

  async verifyStock(producto) {
    let items = this.getItems()
    let cantidad = producto.cantidad

    let item = items.find((prod) => {
      return prod.id_producto == producto.id_producto
    })

    cantidad += item?.cantidad || 0
    let resp = await fetch(`api/products/stock/${producto.id_producto}`)
    let json = await resp.json()
    return cantidad <= json.stock
  }
}

class CartUI {
  constructor() {
    this.formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    })
  }

  updateCart(cart) {
    let items = cart.getItems()
    let total = 0
    let count = 0
    let html = ``

    items.forEach((producto) => {
      html += `
      <li class="producto">
            <div class="row">
              <div class="col-7">
                <img src="img/productos/${producto.foto}" alt="">
              </div>
              <div class="col-5">
                <p class="marca">${producto.marca}</p>
                <p class="precio">${this.formatter.format(producto.precio)}</p>
                <p class="cantidad">
                  Cant: ${producto.cantidad} 
                  <a><i class="fas fa-minus-circle btn-remove data-id=${
                    producto.id_producto
                  }"></i></a>
                </p>
              </div>
            </div>
          </li>
          <hr>`
      total += producto.precio * producto.cantidad
      count += producto.cantidad
    })

    //add cart html
    $('.contenido-carrito ul').html(html)
    $('#total').text(`${this.formatter.format(total)}`)

    //set number cookie
    Cookies.set('itemsNumber', count)
    this.updateCartCount()

    //btn remove listener
    $('.btn-remove').click(function (e) {
      e.preventDefault()
      let id_producto = $(this).attr('data-id')
      cart.removeItem(id_producto)
      cartUI.updateCart(cart)
    })
  }

  updateCartCount() {
    let numero = Cookies.get('itemsNumber')
    $('#item-in-cart').text(numero ? numero : '0')
  }
}

const cart = new Cart()
const cartUI = new CartUI()
cartUI.updateCart(cart)
