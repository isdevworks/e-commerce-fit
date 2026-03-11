// Lê os dados do localStorage gravados pela index.html
let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];
const itemsContainer = document.getElementById('items-container');
const totalPriceElement = document.getElementById('total-price');

function renderizarCarrinho() {
    itemsContainer.innerHTML = ''; 
    let total = 0;

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p style="color: #888; text-align: center; padding: 20px 0;">Seu carrinho está vazio.</p>';
    } else {
        // O 'index' marca a posição exata de cada produto na lista
        cart.forEach((item, index) => {
            total += item.price;
            const div = document.createElement('div');
            div.className = 'summary-item';
            div.innerHTML = `
                <span>1x ${item.title}</span>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="color: #fff;">R$ ${item.price.toFixed(2)}</span>
                    <button class="btn-remove-item" onclick="removerItem(${index})" title="Remover este item">❌</button>
                </div>
            `;
            itemsContainer.appendChild(div);
        });
    }

    totalPriceElement.textContent = `R$ ${total.toFixed(2)}`;
}

// NOVA FUNÇÃO: Remove apenas o item clicado
function removerItem(index) {
    cart.splice(index, 1); // Remove 1 elemento na posição 'index'
    localStorage.setItem('techstore_cart', JSON.stringify(cart)); // Atualiza o "banco de dados" do navegador
    renderizarCarrinho(); // Recarrega a lista na tela com o novo total
}

// MANTÉM A FUNÇÃO ANTIGA: Esvazia tudo de uma vez
function limparCarrinho() {
    localStorage.removeItem('techstore_cart');
    cart = [];
    renderizarCarrinho();
}

function processarCheckout() {
    const form = document.getElementById('payment-form');
    // Valida se o cliente preencheu nome, endereço, etc.
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (cart.length === 0) {
        alert("Adicione produtos ao carrinho antes de finalizar a compra!");
        return;
    }

    // Captura os dados da entrega
    const nome = document.getElementById('nome').value;
    const endereco = document.getElementById('endereco').value;
    const numero = document.getElementById('numero').value;
    const cidade = document.getElementById('cidade').value;

    // Monta a lista de produtos
    let resumoPedido = '';
    let total = 0;
    
    cart.forEach(item => {
        resumoPedido += `- 1x ${item.title} (R$ ${item.price.toFixed(2)})\n`;
        total += item.price;
    });

    // Monta a mensagem final do WhatsApp
    const mensagem = `*NOVO PEDIDO - VELLOX NUTRITION* 🚀\n\n` +
                     `*Cliente:* ${nome}\n` +
                     `*Endereço:* ${endereco}, ${numero} - ${cidade}\n\n` +
                     `*Itens do Pedido:*\n${resumoPedido}\n` +
                     `*TOTAL:* R$ ${total.toFixed(2)}\n\n` +
                     `Gostaria de finalizar o pagamento!`;

    // Codifica para URL
    const mensagemCodificada = encodeURIComponent(mensagem);

    // SEU NÚMERO DE WHATSAPP AQUI
    const numeroWhatsApp = "5571991597731"; 

    // Esvazia o carrinho e redireciona
    limparCarrinho();
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`, '_blank');
    window.location.href = 'index.html';
}

// --- AUTOMAÇÃO DE CEP (ViaCEP API) ---

const cepInput = document.getElementById('cep');
const enderecoInput = document.getElementById('endereco');
const cidadeInput = document.getElementById('cidade');
const numeroInput = document.getElementById('numero');

// O evento 'blur' dispara quando o usuário clica fora do campo do CEP
cepInput.addEventListener('blur', async () => {
    // Tira qualquer caractere que não seja número (ex: o tracinho)
    const cepNumeros = cepInput.value.replace(/\D/g, '');

    // Verifica se o CEP tem exatamente 8 dígitos
    if (cepNumeros.length === 8) {
        try {
            // Faz a requisição na API do ViaCEP
            const response = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
            const data = await response.json();

            // Se a API não retornar erro, preenche os campos
            if (!data.erro) {
                enderecoInput.value = data.logradouro;
                cidadeInput.value = data.localidade;
                
                // Joga o cursor piscando direto para o campo de Número
                numeroInput.focus(); 
            } else {
                alert("CEP não encontrado. Por favor, verifique o número digitado.");
                enderecoInput.value = '';
                cidadeInput.value = '';
            }
        } catch (error) {
            console.error("Erro ao buscar o CEP:", error);
            alert("Erro na comunicação com o servidor de CEPs.");
        }
    }
});

// Inicializa a tela
renderizarCarrinho();