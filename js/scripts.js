const filtersElement = document.getElementById('filters');
const galleryElement = document.getElementById('gallery');
const cartProductsElement = document.getElementById('cart-products');
const cartImageElement = document.getElementById('cart-image');
const cartQuantityElement = document.getElementById('cart-quantity');
const totalOrderContainerElement = document.getElementById('total-order-container');
const totalOrderElement = document.getElementById('total-order');

// Creamos un array donde se guardarán los productos agregados con su nombre, precio y cantidad

// Hay que asegurarse de que cartContent siempre sea un arreglo válido con objetos que tengan las propiedades price y quantity. De lo contrario, podría provocar errores
let cartContent = [];

// Reduce: Recorre el array cartContent, acumulando el precio total de los productos
// toFixed(2): Redondea el número a 2 decimales
const updateTotalOrderInDOM = () => {
  const totalOrder = cartContent.reduce((acc, product) => product.price * product.quantity + acc, 0);
  totalOrderElement.textContent = '$' + totalOrder.toFixed(2);
};

// Actualizar la cantidad total de productos. Esta función calcula la cantidad total de productos en el carrito y actualiza el elemento cartQuantityElement
// Luego, llama a la función para actualizar el total del pedido
const updateProductsQuantityInDOM = () => {
  const totalQuantity = cartContent.reduce((acc, product) => product.quantity + acc, 0);
  cartQuantityElement.textContent = totalQuantity;
  updateTotalOrderInDOM();
};

// Mostrar o el svg del carrito
const updateCartInDOM = () => {
  const fragment = document.createDocumentFragment();
  if (cartContent.length === 0) {
    cartImageElement.classList.remove('hide');
    totalOrderContainerElement.classList.add('hide');
  } else {
    cartImageElement.classList.add('hide');
    totalOrderContainerElement.classList.remove('hide');
    }

// Recorrer los productos del carrito. Se utiliza el método forEach para iterar sobre todos los productos almacenados en el array cartContent

    cartContent.forEach(product => {
      
     // <div> que contendrá toda la información de un producto del carrito
     // Se le asigna la clase full-cart para que tenga estilos predefinidos del CSS
    const newCartProduct = document.createElement('div');
    newCartProduct.classList.add('cart-product');

    const newCartProductName = document.createElement('p');
    newCartProduct.classList.add('cart-product-name');
    newCartProductName.textContent = product.name;

    // append,  hace que el <p> (el nombre del producto) se agregue dentro del <div> (el contenedor del producto).
    newCartProduct.append(newCartProductName);

    // <div> para organizar la cantidad, precio unitario, precio total y el botón de eliminar
    const newCartProductInfo = document.createElement('div');
    newCartProductInfo.classList.add('cart-product-info');

        const newCartProductQuantity = document.createElement('span');
        newCartProductQuantity.classList.add('cart-product-quantity');
        newCartProductQuantity.textContent = product.quantity + 'x';

        const newCartProductPriceSingle = document.createElement('span');
        newCartProductPriceSingle.classList.add('cart-product-price-single');
        newCartProductPriceSingle.textContent = '@' + product.price;

        const newCartProductPriceTotal = document.createElement('span');
        newCartProductPriceTotal.classList.add('cart-product-price-total');
        const totalPrice = product.price * product.quantity;
        newCartProductPriceTotal.textContent = '$' + totalPrice.toFixed(2);

        const newCartProductIconRemove = document.createElement('img');
        newCartProductIconRemove.classList.add('cart-product-icon-remove');
        newCartProductIconRemove.src = './assets/images/icon-remove-item.svg';

        // Se agrega un evento click al botón creado anteriormente. Al hacer clic, se ejecuta la función removeProductFromCart(product.name)
        newCartProductIconRemove.addEventListener('click', () => removeProductFromCart(product.name));

    newCartProductInfo.append(
      newCartProductQuantity,
      newCartProductPriceSingle,
      newCartProductPriceTotal,
      newCartProductIconRemove
    );

    newCartProduct.append(newCartProductInfo);

    fragment.append(newCartProduct);
  });

  console.log(cartContent);

// Antes de agregar el nuevo contenido, se vacía el contenedor principal del carrito (cartProductsElement) para evitar duplicados
// Luego, se inserta el fragmento con todos los productos.
  cartProductsElement.textContent = '';
  cartProductsElement.append(fragment);
  updateProductsQuantityInDOM();
};

// Creamos una función para añadir productos al carrito, para ello le pasamos dos parametros, nombre y precio 

// Con la segunda línea modificamos el carrito de compras, al agregar un nuevo producto a cartContent, lo haremos a través de push (método de los arrays), que se utiliza para agregar un nuevo elemento al final del array, en esto caso añadimos un objeto con tres propiedades

// quantity es 1 porque estamos agregando el producto por primera vez 

const addProductToCart = (name, price) => {
  cartContent.push({ name: name, price: price, quantity: 1 });
  updateCartInDOM();
};

// Incrementar la cantidad de un producto específico en el carrito y actualizar tanto el contenido del DOM como la lógica interna del carrito

// find devuelve el primer producto que cumpla con la condición proporcionada en la función, en este caso que nombre sea igual pr

// Aumentamos cantidad

const incrementProductQuantity = (name, element) => {
  const productSelected = cartContent.find(product => product.name === name);
  productSelected.quantity++;
  element.textContent = productSelected.quantity; // No olvidar esto
  updateCartInDOM();
};

// element: Este es el elemento que recibe la acción, posiblemente el botón de eliminar o algo similar.
// parentElement: Selecciona el contenedor inmediato del element. En este caso, si element es un botón dentro de un <div>, parentElement seleccionará ese <div>.
// parentElement.parentElement: Esto selecciona el contenedor de nivel superior. Si element es un botón dentro de un contenedor de producto, esta línea selecciona el contenedor principal del producto.


const setRemoveProductEffect = element => {
  const productContainer = element.parentElement.parentElement;
  element.classList.remove('show-button');
  productContainer.classList.remove('product-image-container-selected');
};

// filter: para crear un nuevo array que elimine el producto cuyo nombre coincide con el name proporcionado.
// querySelectorAll([data-name="${name}"]) busca todos los elementos en el DOM que tengan un atributo data-name con el valor de name
// Usaremos el índice 1 más adelante para acceder a un botón específico

const removeProductFromCart = (name, element) => {
  cartContent = cartContent.filter(product => product.name !== name);
  const productButtons = document.querySelectorAll(`[data-name="${name}"]`);
  productButtons[1].classList.remove('show-button');
  productButtons[1].parentElement.parentElement.classList.remove('product-image-container-selected');
  productButtons[1].children[1].textContent = 1; // Importante
  updateCartInDOM();
  if (!element) return;

  setRemoveProductEffect(element);
};

const decrementProductQuantity = (name, element) => {
  const productSelected = cartContent.find(product => product.name === name);

  if (productSelected.quantity === 1) {
    removeProductFromCart(name, element);
  } else {
    productSelected.quantity--;
    element.textContent = productSelected.quantity; // No olvidar esto
  }

  updateCartInDOM();
};

const setAddProductEffect = element => {
  const buttonQuantity = element.nextElementSibling;
  const productContainer = element.parentElement.parentElement;
  buttonQuantity.classList.add('show-button');
  productContainer.classList.add('product-image-container-selected');
  addProductToCart(element.dataset.name, element.dataset.price);
};

// ?

const handleGalleryClick = event => {
  const type = event.target.dataset.type;

  if (!type) return;

  if (type === 'add') {
    setAddProductEffect(event.target);
    return;
  }

  const name = event.target.parentElement.dataset.name;

  if (type === 'increment') {
    incrementProductQuantity(name, event.target.previousElementSibling);
  } else if (type === 'decrement') {
    decrementProductQuantity(name, event.target.nextElementSibling);
  }
};

const setFilters = event => {
  const filter = event.target.dataset.filter;

  if (!filter) return;

  for (const filter of filtersElement.children) {
    filter.classList.remove('filter-active');
  }

  event.target.classList.add('filter-active');
};

filtersElement.addEventListener('click', setFilters);
galleryElement.addEventListener('click', handleGalleryClick);