let frames = 0;
const somDeHit = new Audio();
somDeHit.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );

        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            (this.x + this.largura), this.y,
            this.largura, this.altura,
        );
    },
}
function criaChao(){
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza(){
            const movimentoDoChao = 1;
            const repeteEm = this.largura / 2;
            const movimentacao = chao.x - movimentoDoChao;

            chao.x = movimentacao % repeteEm;
        },
        desenha() {
            contexto.drawImage(
                sprites,
                this.spriteX, this.spriteY,
                this.largura, this.altura,
                this.x, this.y,
                this.largura, this.altura,
            );
    
            contexto.drawImage(
                sprites,
                this.spriteX, this.spriteY,
                this.largura, this.altura,
                (this.x + this.largura), this.y,
                this.largura, this.altura,
            );
        },
    };

    return chao;
}


function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY) {
        return true
    }

    return false;
}

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        gravidade: 0.25,
        velocidade: 0,
        pulo: 4.6,
        pula(){
            this.velocidade = - flappyBird.pulo;
        },
        atualiza(){
            if(fazColisao(flappyBird, globais.chao)){
                somDeHit.play();
                setTimeout(() => {
                    mudaParaTela(Telas.inicio)
                }, 500);
                return;
            } 
            this.velocidade += this.gravidade 
            this.y = this.y + this.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0 },
            { spriteX: 0, spriteY: 26 },
            { spriteX: 0, spriteY: 52 },
        ],
        frameAtual: 0,
        atualizaOFrameAtual() {
            const intervaloDeFrames = 8;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if(passouOIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + this.frameAtual;
                const baseRepeticao = this.movimentos.length;
                this.frameAtual = incremento % baseRepeticao;
            }
        },
        desenha() {
            this.atualizaOFrameAtual();
            const { spriteX, spriteY } = this.movimentos[this.frameAtual];
            contexto.drawImage(
                sprites,
                spriteX, spriteY,
                this.largura, this.altura,
                this.x, this.y,
                this.largura, this.altura,
            ); 
        }
    };

    return flappyBird;
};

const mensagemGetReady = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );
    }
}

const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa){
        telaAtiva.inicializa();
    }
}

function criaCanos(){
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenha() {
            const yRandom = -150;
            const espacamentoEntreCanos = 90;

            const canoCeuX = 220;
            const canoCeuY = yRandom;

            contexto.drawImage(
                sprites,
                canos.ceu.spriteX, canos.ceu.spriteY,
                canos.largura, canos.altura,
                canoCeuX, canoCeuY,
                canos.largura, canos.altura,
            )

            const canoChaoX = 220;
            const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;

            contexto.drawImage(
                sprites,
                canos.chao.spriteX, canos.chao.spriteY,
                canos.largura, canos.altura,
                canoChaoX, canoChaoY,
                canos.largura, canos.altura,
            )
        }
    };

    return canos;
}

const Telas = {
    inicio: {
        inicializa(){
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            globais.canos.desenha();
            // mensagemGetReady.desenha();
        },
        click() {
            mudaParaTela(Telas.jogo);
        },
        atualiza() {
            globais.chao.atualiza();
        }
    },
    jogo: {
        desenha() {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
        },
        click() {
            globais.flappyBird.pula();
        },
        atualiza() {
            globais.flappyBird.atualiza();
        },
    }
}

function loop() {

    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
})
mudaParaTela(Telas.inicio)
loop();