/*
   Este script configura todos los plugins que se ocupan en AdminLTE
   
   Table Of Content
   
   1. Datatables
   2. Registro de Productos Comprados
   3. Validacion de formulario de registro de usuarios
   4. Calendar para el dashboard
   5. Registro de Productos Vendidos
   6. Chart JS
*/
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

$(function () {
  // ----------------------------------------------------------
  // Datatables
  // ----------------------------------------------------------
  if ($('#tabla').length) {
    $('#tabla')
      .DataTable({
        paging: true,
        lengthChange: true,
        searching: true,
        ordering: true,
        info: true,
        autoWidth: false,
        responsive: true,
        buttons: ['copy', 'csv', 'pdf', 'print'],
        language: {
          paginate: {
            next: 'Siguiente',
            previous: 'Anterior',
            last: 'Último',
            first: 'Primero',
          },
          info: 'Mostrando _START_ - _END_ de _TOTAL_ resultados',
          search: 'Buscar',
          emptytable: 'No hay registros',
          infoEmpty: '0 registros',
        },
      })
      .buttons()
      .container()
      .appendTo('#tabla_wrapper .col-md-6:eq(0)')
  }

  // ----------------------------------------------------------
  //registro de productos comprados
  // ----------------------------------------------------------
  if ($('#table-products').length) {
    $('#btn-registrar').click(function (e) {
      e.preventDefault()
      addProductToTable()
    })

    $('.btn-eliminar').click(function (e) {
      e.preventDefault()
      let tr = $(this).parent().parent()
      tr.remove()
    })
  }

  // ----------------------------------------------------------
  //Validacion de formulario de registro de usuarios
  // ----------------------------------------------------------
  if ($('#contrasena').length) {
    $('#contrasena').keyup(validatePassword)
    $('#rep_contrasena').keyup(validatePassword)
  }

  // ----------------------------------------------------------
  //Calendar para el Dashboard
  // ----------------------------------------------------------
  $('#calendar').datetimepicker({
    format: 'L',
    inline: true,
  })

  // ----------------------------------------------------------
  //registro de productos vendidos
  // ----------------------------------------------------------
  if ($('#table-purchase-products').length) {
    $('#btn-registrar').click(function (e) {
      e.preventDefault()
      addProductToTable()
      updatePurchaseTotal()
    })

    $('.btn-eliminar').click(function (e) {
      e.preventDefault()
      let tr = $(this).parent().parent()
      tr.remove()
    })

    $('#cantidad').change(function (e) {
      e.preventDefault()
      verificarInventario($(this).val())
    })
    updatePurchaseTotal()
  }

  // ----------------------------------------------------------
  //Chart JS
  // ----------------------------------------------------------
  // Sales chart
  if ($('#dashboard').length) {
    var salesChartData = {
      labels: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      datasets: [
        {
          label: 'Ventas por mes',
          backgroundColor: 'rgba(60,141,188,0.9)',
          borderColor: 'rgba(60,141,188,0.8)',
          pointRadius: true,
          pointColor: '#3b8bba',
          pointStrokeColor: 'rgba(60,141,188,1)',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(60,141,188,1)',
          // data: [49, 20, 22, 65, 23, 12, 34, 76, 12, 87, 55, 34],
        },
      ],
    }

    var salesChartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: true,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: true,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
            },
            ticks: {
              precision: 0,
            },
          },
        ],
      },
    }

    setSalesPerMonth(salesChartData, salesChartOptions)

    // Donut Chart
    var pieData = {
      labels: ['En tienda', 'En la página'],
      datasets: [
        {
          // data: [30, 12],
          backgroundColor: ['#f56954', '#f39c12'],
        },
      ],
    }
    var pieOptions = {
      legend: {
        display: true,
      },
      maintainAspectRatio: false,
      responsive: true,
    }

    setSalesPerPlace(pieData, pieOptions)
  }
})

/**
 * Verifica que tanto la password como la repeticion de ella coincidan.
 * Es usada al registrar un usuario en el sistema y en la ventana para recuperar la contraseña
 */
function validatePassword(e) {
  let password = $('#contrasena').val()
  let repPass = $('#rep_contrasena').val()
  if (password !== repPass) {
    $('#rep_contrasena').addClass('is-invalid')
    $('#password_help').text('Las contraseñas no coinciden')
  } else {
    $('#rep_contrasena').removeClass('is-invalid')
    $('#rep_contrasena').addClass('is-valid')
    $('#password_help').text('')
  }
}

/**
 * Esta funcion agrega el precio a un input hidden cuando se registra en la pagina de venta.
 * Esto porque aqui el precio no lo pone el usuario, como en proveedor. Viene del servidor
 * Esto con la finalidad de que se mande por medio de POST como un arreglo.
 */
async function obtenerProductoPrecio() {
  let idProducto = $('#producto').val()

  let response = await fetch(`/api/products/price/${idProducto}`)
  let data = await response.json()

  let precio = data.price

  $('#precio').val(precio)
}

/**
 * Esta funcion agrega un nuevo producto a una tabla.
 * Es llamada tanto en la pagina para registrar una compra como para registrar una venta
 */
function addProductToTable() {
  let contador = $('tbody tr:last th').text() || 0

  let productoId = $('#producto').val()
  let descripcion = $('#producto option:selected').text().trim()
  let cantidad = $('#cantidad').val()
  let precio = $('#precio').val()

  if (cantidad && precio) {
    let exist = false
    $('tbody tr').each(function (index, element) {
      let td = element.children[1]
      if (td.textContent.trim() == descripcion) {
        exist = true
      }
    })
    if (!exist) {
      let tr = `
      <tr>
        <th scope="row">${++contador}</th>
        <td>${descripcion}</td>
        <input type="hidden" name="descripcion" value="${descripcion}">
        <td>${cantidad}</td>
        <input type="hidden" name="cantidad" value="${cantidad}">
        <td class="text-right">${formatter.format(precio)}</td>
        <input type="hidden" name="precio" value="${precio}">
        <input type="hidden" name="id_producto" value="${productoId}">
        <td><button class='btn btn-sm btn-danger btn-eliminar' role='button'><i class="fas fa-trash-alt"></i></button></td>
      </tr>`

      $('#table-body').append(tr)
    }
  }

  $('.btn-eliminar').click(function (e) {
    e.preventDefault()
    let tr = $(this).parent().parent()
    tr.remove()
  })
}

/**
 * Esta funcion es llamada cada que se agrega un producto en la pagina
 * para registrar una venta desde el administrador
 */
function updatePurchaseTotal() {
  let total = 0

  $('tbody tr').each(function (index, element) {
    let precio = element.children[6].value
    let cantidad = element.children[4].value
    total += precio * cantidad
  })

  let iva = total * 0.16
  let subtotal = total - iva

  $('#subtotal').text(formatter.format(subtotal))
  $('#IVA').text(formatter.format(iva))
  $('#total').text(formatter.format(total))
}

/**
 * Esta funcion es llamada cada que cambia el number range de la pagina para vender un producto
 * en AdminLTE. Si se intenta vender mas de un producto en stock aparece una advertencia
 * @param cantidad la cantidad que se quiere verificar
 */
async function verificarInventario(cantidad) {
  let idProducto = $('#producto').val()

  let response = await fetch(`/api/products/stock/${idProducto}`)
  let data = await response.json()

  let stock = data.stock

  if (stock < cantidad) {
    $('#advertencia').removeClass('d-none')
    $('#advertencia').text(
      `Solo quedan ${stock} unidades del producto`
    )
  } else {
    $('#advertencia').addClass('d-none')
  }
}

async function setSalesPerMonth(salesData, salesChartOptions) {
  let response = await fetch('/api/products/sales/month')
  let data = await response.json()

  salesData.datasets[0].data = []

  data.sales.forEach((mes) => {
    salesData.datasets[0].data.push(mes.ventas)
  })

  var salesChartCanvas = document
    .getElementById('revenue-chart-canvas')
    .getContext('2d')

  // This will get the first returned node in the jQuery collection.
  // eslint-disable-next-line no-unused-vars
  var salesChart = new Chart(salesChartCanvas, {
    type: 'line',
    data: salesData,
    options: salesChartOptions,
  })
}

async function setSalesPerPlace(salesData, pieOptions) {
  let response = await fetch('/api/products/sales/place')
  let data = await response.json()

  salesData.datasets[0].data = []
  salesData.datasets[0].data[0] = data.sales_store
  salesData.datasets[0].data[1] = data.sales_page

  var pieChartCanvas = $('#sales-chart-canvas').get(0).getContext('2d')

  // Create pie or douhnut chart
  var pieChart = new Chart(pieChartCanvas, {
    type: 'doughnut',
    data: salesData,
    options: pieOptions,
  })
}
