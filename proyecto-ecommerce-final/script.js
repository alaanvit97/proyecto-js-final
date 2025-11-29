// --- VARIABLES GLOBALES ---
const contenedorProductos = document.getElementById('contenedor-productos');
const carritoItemsContainer = document.getElementById('carrito-items');
const contadorCarritoElement = document.getElementById('contador-carrito');
const totalCarritoElement = document.getElementById('carrito-total');
const formulario = document.getElementById('formulario-contacto');
const sidebar = document.getElementById('carrito-sidebar');

// Uso de localStorage para persistencia
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// --- AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarCarritoHTML();
});

// --- FETCH API (Consumir datos) ---
async function cargarProductos() {
    try {
        const respuesta = await fetch('https://fakestoreapi.com/products');
        const productos = await respuesta.json();
        renderizarProductos(productos);
    } catch (error) {
        contenedorProductos.innerHTML = '<p>Error al cargar productos.</p>';
        console.error(error);
    }
}

// --- DOM (Visualización de Productos) ---
function renderizarProductos(listaProductos) {
    contenedorProductos.innerHTML = ''; // Limpiar loader
    
    listaProductos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('card-producto');
        
        // Creamos el HTML de la card
        card.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}">
            <h3>${producto.title}</h3>
            <p><strong>$${producto.price}</strong></p>
            <button class="btn" onclick="agregarAlCarrito(${producto.id}, '${producto.title}', ${producto.price}, '${producto.image}')">
                Agregar al Carrito
            </button>
        `;
        
        contenedorProductos.appendChild(card);
    });
}

// --- LÓGICA DEL CARRITO (Agregar, Editar, Eliminar, Total) ---

function agregarAlCarrito(id, titulo, precio, imagen) {
    const itemExistente = carrito.find(prod => prod.id === id);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ id, titulo, precio, imagen, cantidad: 1 });
    }
    
    guardarYActualizar();
    toggleCarrito(); // Abrir carrito al comprar
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
    // Guardar en Storage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    // Actualizar DOM
    actualizarCarritoHTML();
}

// Visualización de productos en el carrito y Total Dinámico
function actualizarCarritoHTML() {
    carritoItemsContainer.innerHTML = '';
    
    let total = 0;
    let totalProductos = 0;
    
    carrito.forEach(prod => {
        const subtotal = prod.precio * prod.cantidad;
        total += subtotal;
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
    
    // Actualizar contadores y totales
    contadorCarritoElement.innerText = totalProductos;
    totalCarritoElement.innerText = total.toFixed(2);
}

// --- FUNCIONES EXTRA (Mostrar/Ocultar Carrito) ---
function toggleCarrito() {
    sidebar.classList.toggle('active');
}

function finalizarCompra() {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
    } else {
        alert('¡Gracias por tu compra! (Simulada)');
        vaciarCarrito();
        toggleCarrito();
    }
}

// --- DOM (Validación Formulario) ---
formulario.addEventListener('submit', (e) => {
    const email = document.getElementById('email').value;
    const errorSpan = document.getElementById('mensaje-error-email');
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex estándar para email
    
    if (!regexEmail.test(email)) {
        e.preventDefault(); // Detener envío
        errorSpan.innerText = 'Por favor ingresa un correo válido';
        errorSpan.style.display = 'block';
    } else {
        errorSpan.style.display = 'none';
        alert('Enviando mensaje...');
    }
});