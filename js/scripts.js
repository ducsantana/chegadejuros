// Formatar valor monetário no input
document.addEventListener('DOMContentLoaded', function () {
    const valorInput = document.getElementById('valor');

    if (valorInput) {
        valorInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value) {
                value = (parseInt(value) / 100).toFixed(2);
                e.target.value = parseFloat(value).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        });

        valorInput.addEventListener('focus', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value) {
                e.target.value = (parseInt(value) / 100).toFixed(2).replace('.', ',');
            }
        });

        valorInput.addEventListener('blur', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value) {
                value = (parseInt(value) / 100).toFixed(2);
                e.target.value = parseFloat(value).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        });

        // Formatar valor inicial
        const initialValue = 300000;
        valorInput.value = initialValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Atualizar taxa de juros baseado no tipo
    const tipoSelect = document.getElementById('tipo');
    if (tipoSelect) {
        tipoSelect.addEventListener('change', function () {
            const tipo = this.value;
            const taxaInput = document.getElementById('taxa-juros');

            if (tipo === 'imovel') {
                taxaInput.value = '1.0';
            } else {
                taxaInput.value = '2.0';
            }
        });
    }

    // Animação do tooltip do WhatsApp
    const tooltip = document.getElementById('whatsapp-tooltip');
    if (tooltip) {
        setTimeout(() => {
            tooltip.classList.add('hidden');
        }, 4000);
    }

    // Smooth scroll para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Função para calcular financiamento SAC
function calcularSAC(valorFinanciado, prazoMeses, taxaJurosMensal) {
    const amortizacao = valorFinanciado / prazoMeses;
    let saldoDevedor = valorFinanciado;
    let totalPago = 0;
    let primeiraParcela = 0;

    for (let i = 1; i <= prazoMeses; i++) {
        const juros = saldoDevedor * taxaJurosMensal;
        const parcela = amortizacao + juros;

        if (i === 1) {
            primeiraParcela = parcela;
        }

        totalPago += parcela;
        saldoDevedor -= amortizacao;
    }

    return {
        primeiraParcela: primeiraParcela,
        totalPago: totalPago,
        jurosTotais: totalPago - valorFinanciado
    };
}

// Função principal de cálculo
function calcular() {
    // Obter valor formatado e converter para número
    const valorFormatado = document.getElementById('valor').value;
    const valor = parseFloat(valorFormatado.replace(/\./g, '').replace(',', '.'));

    const prazo = parseInt(document.getElementById('prazo').value);
    const tipo = document.getElementById('tipo').value;
    const taxaJurosInput = parseFloat(document.getElementById('taxa-juros').value);

    if (!valor || valor <= 0) {
        alert('Por favor, insira um valor válido para o bem.');
        return;
    }

    // Taxa administrativa do consórcio
    let taxaAdmin = 0.18;
    if (tipo === 'imovel') taxaAdmin = 0.18;
    else if (tipo === 'carro') taxaAdmin = 0.16;
    else if (tipo === 'moto') taxaAdmin = 0.15;
    else if (tipo === 'caminhao') taxaAdmin = 0.17;

    // Cálculos do Consórcio
    const valorTaxa = valor * taxaAdmin;
    const totalConsorcio = valor + valorTaxa;
    const parcelaConsorcio = totalConsorcio / prazo;

    // Cálculos do Financiamento SAC (30% de entrada)
    const entradaFinanciamento = valor * 0.30;
    const valorFinanciado = valor * 0.70;
    const taxaJurosFinanciamento = taxaJurosInput / 100;
    const financiamento = calcularSAC(valorFinanciado, prazo, taxaJurosFinanciamento);
    const totalGeralFinanciamento = entradaFinanciamento + financiamento.totalPago;

    // Economia
    const economia = totalGeralFinanciamento - totalConsorcio;
    const percentualEconomia = (economia / totalGeralFinanciamento) * 100;

    // Exibir resultados do Consórcio
    document.getElementById('primeira-parcela-consorcio').textContent =
        parcelaConsorcio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('total-parcelas-consorcio').textContent =
        totalConsorcio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('total-consorcio').textContent =
        totalConsorcio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('taxa-consorcio').textContent =
        valorTaxa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) +
        ' (' + (taxaAdmin * 100).toFixed(0) + '%)';

    // Exibir resultados do Financiamento
    document.getElementById('entrada-fin').textContent =
        entradaFinanciamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('primeira-parcela-fin').textContent =
        financiamento.primeiraParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('total-parcelas-fin').textContent =
        financiamento.totalPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('total-fin').textContent =
        totalGeralFinanciamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('juros-fin').textContent =
        financiamento.jurosTotais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) +
        ' (' + taxaJurosInput.toFixed(1) + '% a.m.)';

    // Exibir economia
    document.getElementById('economia-total').textContent =
        economia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('percentual-economia').textContent =
        'Você economiza ' + percentualEconomia.toFixed(1) + '% escolhendo o consórcio!';

    document.getElementById('resultado').style.display = 'block';
    document.getElementById('resultado').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Função para toggle FAQ
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('span:last-child');

    if (answer.classList.contains('active')) {
        answer.classList.remove('active');
        icon.textContent = '+';
    } else {
        answer.classList.add('active');
        icon.textContent = '−';
    }
}

// Função para submit da newsletter
async function submitNewsletter(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const feedback = document.getElementById('newsletter-feedback');
    const submitButton = event.target.querySelector('button[type="submit"]');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        feedback.textContent = '❌ Por favor, insira um email válido.';
        feedback.style.display = 'block';
        feedback.style.color = '#ff4444';
        return false;
    }

    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    feedback.style.display = 'none';

    try {
        // REPLACE WITH YOUR GOOGLE APPS SCRIPT URL
        const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyjqjt9fmh6UvHKwfqGLkkMWVvCxnrmkdKE8MCzc6qI0IN_p-IxuDgW56E4h5Qq81fc/exec';

        // Get user's IP (optional - for rate limiting)
        let ipAddress = 'unknown';
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            ipAddress = ipData.ip;
        } catch (e) {
            // IP fetch failed, continue anyway
        }

        // Submit to Google Apps Script
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                source: 'website',
                userAgent: navigator.userAgent,
                ipAddress: ipAddress,
                timestamp: new Date().toISOString()
            })
        });

        // Since we're using no-cors, we can't read the response
        // Assume success if no error was thrown
        feedback.textContent = '✔ Email cadastrado com sucesso! Você receberá nossas novidades em breve.';
        feedback.style.display = 'block';
        feedback.style.color = '#4ade80';
        document.getElementById('email').value = '';

    } catch (error) {
        console.error('Newsletter submission error:', error);
        feedback.textContent = '❌ Erro ao cadastrar email. Por favor, tente novamente.';
        feedback.style.display = 'block';
        feedback.style.color = '#ff4444';
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Quero Economizar';

        // Hide feedback after 5 seconds
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 5000);
    }

    return false;
}