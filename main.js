let subtotal = 0
let detalle = ""

function mostrarMensaje(idCaja, texto, color) {
    let caja = document.getElementById(idCaja)
    caja.textContent = texto
    caja.style.color = color
}

function obtenerEnvio(zona) {
    let costo = 6
    if (zona == "Puerto / Malecón Chancay") {
        costo = 5
    } else if (zona == "Cercado de Chancay") {
        costo = 8
    } else if (zona == "Zona Playa / Costa") {
        costo = 10
    }
    return costo
}

function obtenerDescuento(monto) {
    let descuento = 0
    if (monto >= 500) {
        descuento = monto * 0.10
    }
    return descuento
}

function telefonoValido(telefono) {
    let digitos = 0
    for (let i = 0; i < telefono.length; i++) {
        let letra = telefono[i]
        if (letra >= "0" && letra <= "9") {
            digitos++
        } else if (letra != " ") {
            return false
        }
    }
    return digitos == 9
}

function calcularCotizador() {
    let select = document.getElementById("producto-cotizar")
    let inputCant = document.getElementById("cantidad-cotizar")
    let opcion = select.options[select.selectedIndex]
    let precio = Number(select.value)
    let stock = Number(opcion.getAttribute("data-stock"))
    let cantidad = Number(inputCant.value)

    if (stock <= 0) {
        cantidad = 0
        inputCant.value = 0
        mostrarMensaje("aviso-cotizador", "Producto sin stock", "red")
    } else if (cantidad <= 0) {
        cantidad = 1
        inputCant.value = 1
        mostrarMensaje("aviso-cotizador", "Cantidad mínima: 1", "orange")
    } else if (cantidad > stock) {
        cantidad = stock
        inputCant.value = stock
        mostrarMensaje("aviso-cotizador", "Stock máximo: " + stock, "orange")
    } else {
        mostrarMensaje("aviso-cotizador", "Cotización lista", "green")
    }

    let total = precio * cantidad
    document.getElementById("cot-stock").textContent = stock > 0 ? stock : "Agotado (0)"
    document.getElementById("cot-unitario").textContent = "S/ " + precio.toFixed(2)
    document.getElementById("cot-cantidad").textContent = cantidad
    document.getElementById("cot-total").textContent = "S/ " + total.toFixed(2)
}

function guardarCotizador(e) {
    e.preventDefault()

    let select = document.getElementById("producto-cotizar")
    let inputCant = document.getElementById("cantidad-cotizar")
    let opcion = select.options[select.selectedIndex]
    let nombre = opcion.getAttribute("data-nombre")
    let precio = Number(select.value)
    let stock = Number(opcion.getAttribute("data-stock"))
    let cantidad = Number(inputCant.value)

    if (stock <= 0 || cantidad <= 0) {
        mostrarMensaje("aviso-cotizador", "No hay stock para guardar", "red")
        return
    }

    stock -= cantidad
    opcion.setAttribute("data-stock", stock)

    let monto = precio * cantidad
    subtotal += monto
    detalle += "• " + nombre + " x" + cantidad + " - S/ " + monto.toFixed(2) + "<br>"

    mostrarMensaje("aviso-cotizador", "Guardado (+S/ " + monto.toFixed(2) + ") | Acumulado: S/ " + subtotal.toFixed(2), "green")
    inputCant.value = stock > 0 ? 1 : 0
    calcularCotizador()
    mostrarResumenCotizador()
}

function mostrarResumenCotizador() {
    let zona = document.getElementById("zona-entrega").value
    let envio = obtenerEnvio(zona)
    let descuento = obtenerDescuento(subtotal)
    let total = subtotal - descuento + envio

    let itemsTexto = detalle != "" ? detalle : "<p>Sin productos guardados aún</p>"
    let promoTexto = descuento > 0 ? "-S/ " + descuento.toFixed(2) : "S/ 0.00"

    document.getElementById("resumen-pedido-items").innerHTML =
        "<div>" + itemsTexto + "</div>" +
        "<p>Subtotal: S/ " + subtotal.toFixed(2) + "</p>" +
        "<p>Descuento: " + promoTexto + "</p>" +
        "<p>Envío (" + zona + "): S/ " + envio.toFixed(2) + "</p>"

    document.getElementById("pedido-total").textContent = "S/ " + total.toFixed(2)
}

function confirmarEnCotizador(e) {
    e.preventDefault()

    let nombre = document.getElementById("nombre-cliente").value.trim()
    let telefono = document.getElementById("telefono-cliente").value.trim()
    let zona = document.getElementById("zona-entrega").value
    let notas = document.getElementById("notas-pedido").value.trim()

    if (subtotal == 0) {
        mostrarMensaje("mensaje-pedido", "Agrega al menos un equipo a tu cotización", "red")
        return
    }

    if (nombre.length < 3) {
        mostrarMensaje("mensaje-pedido", "Escribe tu nombre (mínimo 3 letras)", "red")
        return
    }

    if (!telefonoValido(telefono)) {
        mostrarMensaje("mensaje-pedido", "Escribe un celular de 9 dígitos", "red")
        return
    }

    mostrarMensaje("mensaje-pedido", "Cotización confirmada con éxito", "green")

    let envio = obtenerEnvio(zona)
    let descuento = obtenerDescuento(subtotal)
    let total = subtotal - descuento + envio
    let notaModal = notas != "" ? notas : "Ninguna"

    document.getElementById("detalle-modal-pedido").innerHTML =
        "<p>Cliente: " + nombre + "</p>" +
        "<p>Teléfono: " + telefono + "</p>" +
        "<p>Cotizado:<br>" + detalle + "</p>" +
        "<p>Descuento: S/ " + descuento.toFixed(2) + "</p>" +
        "<p>Envío: " + zona + " (S/ " + envio.toFixed(2) + ")</p>" +
        "<p>Total: S/ " + total.toFixed(2) + "</p>" +
        "<p>Nota: " + notaModal + "</p>"

    document.getElementById("modal-check").checked = true

    subtotal = 0
    detalle = ""
    mostrarResumenCotizador()
}

function iniciar() {
    let form = document.getElementById("form-cotizador")
    if (!form) {
        return
    }

    document.getElementById("producto-cotizar").addEventListener("change", calcularCotizador)
    document.getElementById("cantidad-cotizar").addEventListener("input", calcularCotizador)
    form.addEventListener("submit", guardarCotizador)
    document.getElementById("zona-entrega").addEventListener("change", mostrarResumenCotizador)
    document.getElementById("form-confirmar-cotizacion").addEventListener("submit", confirmarEnCotizador)

    calcularCotizador()
    mostrarResumenCotizador()
}

document.addEventListener("DOMContentLoaded", iniciar)