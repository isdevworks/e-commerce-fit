// O mesmo JavaScript de antes, mantendo a compatibilidade com o checkout.html
let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];
const cartCountElement = document.getElementById('cart-count');
const cartButton = document.getElementById('cart-button');

cartCountElement.textContent = cart.length;

const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const card = event.target.closest('.product-card');
        const title = card.querySelector('.product-title').innerText;
        const priceText = card.querySelector('.product-price').innerText;
        const price = parseFloat(priceText.replace('R$ ', ''));

        cart.push({ title: title, price: price });
        localStorage.setItem('techstore_cart', JSON.stringify(cart));
        cartCountElement.textContent = cart.length;

        const originalText = button.textContent;
        button.textContent = "ADCIONADO!";
        button.style.backgroundColor = "#27ae60"; // Fica verde rapidamente para confirmar
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = "var(--primary-color)";
        }, 1000);
    });
});

cartButton.addEventListener('click', () => {
    if(cart.length === 0) {
        alert("Seu carrinho está vazio. Adicione suplementos para crescer!");
    } else {
        window.location.href = 'checkout.html';
    }
});

// Lógica de Filtro de Categorias
const categoryBoxes = document.querySelectorAll('.category-box');
const products = document.querySelectorAll('.product-card');

categoryBoxes.forEach(box => {
    box.addEventListener('click', () => {
        // Pega qual categoria foi clicada (massa, forca, ou todos)
        const targetCategory = box.getAttribute('data-target');

        // Efeito visual de seleção nas caixas (remove de todas, adiciona na clicada)
        categoryBoxes.forEach(b => b.style.borderColor = 'transparent');
        box.style.borderColor = 'var(--primary-color)';

        // Esconde ou mostra os produtos
        products.forEach(product => {
            const productCategory = product.getAttribute('data-category');
            
            if (targetCategory === 'todos' || targetCategory === productCategory) {
                // A CORREÇÃO ESTÁ AQUI NA LINHA ABAIXO:
                product.style.display = 'flex'; // Troque 'block' por 'flex'
            } else {
                product.style.display = 'none'; // Esconde o produto
            }
        });
    });
});