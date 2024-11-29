window.onload = () => {
    "use strict";
    
    // Registrar o Service Worker
    if ("serviceWorker" in navigator) {
       window.addEventListener('load', async () => {
        try{
            let reg;
            reg = await navigator.serviceWorker.register('/sw.js', { type: "module"});

            console.log(' Service worker registrada :) ', reg);
        
        } catch (err) {
            console.log(' Service worker registro falhou :( :', err);
        }
       });
    }

    // Seleciona todos os botões "Ver mais"
    const botoesVerMais = document.querySelectorAll('.botaoVerMais');

    // Adiciona um evento de clique a cada botão "Ver mais"
    botoesVerMais.forEach(botao => {
        botao.addEventListener('click', (e) => {
            // Encontra o card pai e a div detalheReceita
            const card = e.target.closest('.card');
            const detalheReceita = card.querySelector('.detalheReceita');
            
            // Alterna a visibilidade da div detalheReceita
            if (detalheReceita) {
                // Alterna o display entre 'none' e 'flex'
                detalheReceita.style.display = detalheReceita.style.display === 'flex' ? 'none' : 'flex';
            }
            
            // Alterna a classe 'cardExpandido' no card
            card.classList.toggle('cardExpandido');
        });
    });
};

// Função de navegação entre as telas
const $lista = document.querySelectorAll('li');
const telas = {
    TelaInicial: document.querySelector('.TelaInicial'),
    telaMassas: document.querySelector('.telaMassas'),
    telaDoces: document.querySelector('.telaDoces'),
    telaCarne: document.querySelector('.telaCarne'),
};

// Função para definir o link ativo e mostrar a tela correspondente
function linkAtivo() {
    // Vai remover a classe 'ativo' de todos os itens da lista
    $lista.forEach(($li) => {
        $li.classList.remove('ativo');
    });
    
    // Vai adicionar a classe 'ativo' ao item clicado
    this.classList.add('ativo');

    // Vê tela a ser que vai aparecer com base no ícone que foi clicado
    const telaAtiva = this.querySelector('.textoNav').textContent.toLowerCase();

    // Dá um "display: none;" pra todas as telas que não foram clicadas
    Object.values(telas).forEach(tela => {
        tela.style.display = 'none';
    });

    // Mostra a tela de acordo com o item que foi clicado
    if (telaAtiva === 'início') {
        telas.TelaInicial.style.display = 'flex';
    } else if (telaAtiva === 'massas') {
        telas.telaMassas.style.display = 'flex';
    } else if (telaAtiva === 'doces') {
        telas.telaDoces.style.display = 'flex';
    } else if (telaAtiva === 'carnes') {
        telas.telaCarne.style.display = 'flex';
    }
}

// Adiciona o evento de clique a cada item da lista
$lista.forEach(($li) => {
    $li.addEventListener('click', linkAtivo);
});

