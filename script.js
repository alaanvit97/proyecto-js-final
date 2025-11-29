// VARIABLES GLOBALES
const contenedorProductos = document.getElementById('contenedor-productos');
const carritoItemsContainer = document.getElementById('carrito-items');
const contadorCarritoElement = document.getElementById('contador-carrito');
const totalCarritoElement = document.getElementById('carrito-total');
const formulario = document.getElementById('formulario-contacto');
const sidebar = document.getElementById('carrito-sidebar');

// IDs de productos que NO tienen stock (Según FakeStoreAPI: Joyas John Hardy, Chaquetas, etc)
// 5: John Hardy Bracelet, 16: Leather Moto Jacket, 17: Rain Jacket (similar), 19: Opna Short Sleeve
const productosSinStock = [5, 16, 17, 19]; 

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarCarritoHTML();
});

// FETCH API
async function cargarProductos() {
    try {
        const respuesta = await fetch('https://fakestoreapi.com/products');
        const productos = await respuesta.json();
        renderizarProductos(productos);
    } catch (error) {
        contenedorProductos.innerHTML = '<p>Error al cargar productos.</p>';
    }
}

function renderizarProductos(listaProductos) {
    contenedorProductos.innerHTML = '';
    
    listaProductos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('card-producto');
        
        // Verificamos si este producto está en la lista negra de stock
        let botonHTML;
        
        if (productosSinStock.includes(producto.id)) {
            // Si NO tiene stock: Botón gris y deshabilitado
            botonHTML = `<button class="btn-sin-stock" disabled>Sin stock</button>`;
        } else {
            // Si tiene stock: Botón normal naranja con función agregar
            botonHTML = `<button class="btn" onclick="agregarAlCarrito(${producto.id}, '${producto.title}', ${producto.price}, '${producto.image}')">Agregar al Carrito</button>`;
        }

        card.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}">
            <h3>${producto.title}</h3>
            <p><strong>$${producto.price}</strong></p>
            ${botonHTML}
        `;
        
        contenedorProductos.appendChild(card);
    });
}

// CARRITO
function agregarAlCarrito(id, titulo, precio, imagen) {
    const itemExistente = carrito.find(prod => prod.id === id);
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ id, titulo, precio, imagen, cantidad: 1 });
    }
    guardarYActualizar();
    toggleCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(prod => prod.id !== id);
    guardarYActualizar();
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(prod => prod.id === id);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(id);
        } else {
            guardarYActualizar();
        }
    }
}

function vaciarCarrito() {
    carrito = [];
    guardarYActualizar();
}

function guardarYActualizar() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoHTML();
}

function actualizarCarritoHTML() {
    carritoItemsContainer.innerHTML = '';
    let total = 0;
    let totalProductos = 0;
    
    carrito.forEach(prod => {
        total += prod.precio * prod.cantidad;
        totalProductos += prod.cantidad;
        
        const div = document.createElement('div');
        div.classList.add('carrito-item');
        div.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <img src="${prod.imagen}" alt="img">
                <div>
                    <p style="font-size:0.8rem; font-weight:bold;">${prod.titulo.substring(0, 15)}...</p>
                    <p>$${prod.precio}</p>
                </div>
            </div>
            <div class="carrito-controles">
                <button onclick="cambiarCantidad(${prod.id}, -1)">-</button>
                <span>${prod.cantidad}</span>
                <button onclick="cambiarCantidad(${prod.id}, 1)">+</button>
            </div>
            <button onclick="eliminarDelCarrito(${prod.id})" style="color:red; border:none; background:none; cursor:pointer;">🗑️</button>
        `;
        carritoItemsContainer.appendChild(div);
    });
    
    contadorCarritoElement.innerText = totalProductos;
    totalCarritoElement.innerText = total.toFixed(2);
}

function toggleCarrito() {
    sidebar.classList.toggle('active');
}

// FINALIZAR COMPRA
function finalizarCompra() {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
    } else {
        // Mensaje limpio como pediste
        alert('¡Gracias por tu compra!');
        vaciarCarrito();
        toggleCarrito();
    }
}

// FORMULARIO
formulario.addEventListener('submit', (e) => {
    const email = document.getElementById('email').value;
    const errorSpan = document.getElementById('mensaje-error-email');
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!regexEmail.test(email)) {
        e.preventDefault();
        errorSpan.innerText = 'Por favor ingresa un correo válido';
        errorSpan.style.display = 'block';
    } else {
        errorSpan.style.display = 'none';
        alert('Enviando mensaje...');
    }
});
