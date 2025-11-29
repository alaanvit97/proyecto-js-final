# Proyecto Final Ecommerce - JavaScript

## Descripción
Sitio web de e-commerce responsive que consume productos de una API REST, gestiona un carrito de compras dinámico y permite contacto mediante formulario.

## Estructura
* **Header:** Navegación y acceso al carrito.
* **Inicio:** Banner principal con background.
* **Productos:** Cards generadas dinámicamente con JavaScript (Flexbox).
* **Reseñas:** Sección de testimonios maquetada con CSS Grid.
* **Contacto:** Formulario validado con envío a Formspree.

## Tecnologías y Conceptos Aplicados
1. **HTML5 Semántico:** Etiquetas `header`, `nav`, `main`, `section`.
2. **CSS3:**
   - **Flexbox:** Para el menú y el listado de productos.
   - **Grid:** Para la sección de reseñas.
   - **Media Queries:** Para adaptar el formulario en móviles.
   - **Google Fonts:** Tipografía 'Poppins'.
3. **JavaScript (ES6):**
   - **Fetch API:** Consumo de datos de `fakestoreapi.com`.
   - **DOM Manipulation:** Renderizado de cards e items del carrito.
   - **LocalStorage:** Persistencia de datos del carrito.
   - **Eventos:** Manejo de clicks y validación de formulario.

## Instrucciones
1. Abrir `index.html`.
2. Navegar por los productos y agregar al carrito.
3. Verificar que el carrito persiste al recargar la página.