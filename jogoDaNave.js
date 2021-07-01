var dirxJ, diryJ, jog, velJ, velT, velB, pjx, pjy
var tamTelaH, tamTelaW
var jogo
var frames
var contBombas, bombasTotal, tmpCriaBomba
var vidaPlaneta, barraPlaneta
var ie, isom
var telaMsg, mensagem

function teclaDw(event){

    if(event.keyCode == 38){ // Cima
        diryJ = -4
    }else if(event.keyCode == 40){ // Baixo
        diryJ = 4
    }
    if(event.keyCode == 37){ // Esquerda
        dirxJ = -4
    }else if(event.keyCode = 39){ // Direita
        dirxJ = 4
    }
    if(event.keyCode == 32){ // Espaço / tiro
        atirar(pjx+17,pjy)
    }
}

function teclaUp(event){

    if((event.keyCode == 38) || (event.keyCode == 40)){
        diryJ = 0
    }
    if((event.keyCode == 37) || (event.keyCode == 39)){
        dirxJ = 0
    }
    if(event.keyCode == 32){ // Espaço / tiro
        atirar(0,0)
    }
}

function criarBombas(){
    if(jogo){
        var y = 0
        var x = Math.random() * tamTelaW
        var bomba = document.createElement("div")
        var att1 = document.createAttribute("class")
        var att2 = document.createAttribute("style")
        att1.value = "bomba"
        att2.value = "top:"+y+"px;left:"+x+"px"
        bomba.setAttributeNode(att1)
        bomba.setAttributeNode(att2)
        document.body.appendChild(bomba)
        contBombas--
    }
}

function controlaBomba(){
    bombasTotal = document.getElementsByClassName("bomba")
    var tam = bombasTotal.length
    for(var i = 0; i < tam; i++){
        if(bombasTotal[i]){
            var pi = bombasTotal[i].offsetTop
            pi += velB
            bombasTotal[i].style.top = pi + "px"
            if(pi > tamTelaH){
                vidaPlaneta -= 10
                criaExplosao(2, bombasTotal[i].offsetLeft, null)
                bombasTotal[i].remove()
            }
        }
    }
}
function atirar(x,y){
    var tiro = document.createElement("div")
    var att1 = document.createAttribute("class")
    var att2 = document.createAttribute("style")
    att1.value = "tiroJog"
    att2.value = "top:"+y+"px;left:"+x+"px"
    tiro.setAttributeNode(att1)
    tiro.setAttributeNode(att2)
    document.body.appendChild(tiro)
}

function controleTiro(){
    var tiros = document.getElementsByClassName("tiroJog")
    var tam = tiros.length

    for(var i = 0; i < tam; i++){
        if(tiros[i]){
            var pt = tiros[i].offsetTop
            pt -= velT
            tiros[i].style.top = pt + "px"
            colisaoTiroBomba(tiros[i])
            if(pt < 0){
                tiros[i].remove()
            }
        }
    }
}

function colisaoTiroBomba(tiro){
    var tam = bombasTotal.length
    for(var i = 0; i < tam; i++){
        if(bombasTotal[i]){
            if(
              (
                  (tiro.offsetTop <= (bombasTotal[i].offsetTop + 40)) && //cima tiro com parte de baixo bomba
                  ((tiro.offsetTop + 6) >= (bombasTotal[i].offsetTop)) //baixo tiro com cima bomba
              )
              &&
              (
                  (tiro.offsetLeft <= (bombasTotal[i].offsetLeft + 40)) && // esquerda tiro com parte direita da bomba
                  ((tiro.offsetLeft + 6) >= (bombasTotal[i].offsetLeft)) // parte direita tiro com parte esquerda da bomba  
              )  
            ){
                criaExplosao(1, bombasTotal[i].offsetLeft-25, bombasTotal[i].offsetTop)
                bombasTotal[i].remove()
                tiro.remove()
            }
        }
    }
}

function criaExplosao(tipo,x,y){
    if(document.getElementById("explosao"+(ie-2))){
        document.getElementById("explosao"+(ie-2)).remove()
    }

    var explosao = document.createElement("div")
    var img = document.createElement("img")
    var som = document.createElement("audio")
    // Atributos para div
    var att1 = document.createAttribute("class")
    var att2 = document.createAttribute("style")
    var att3 = document.createAttribute("id")
    // Atributos para imagem
    var att4 = document.createAttribute("src")
    // Atributos para o audio
    var att5 = document.createAttribute("src")
    var att6 = document.createAttribute("id")

    att3.value = "explosao"+ie
    if(tipo == 1){
        att1.value = "explosaoAr"
        att2.value = "top:"+y+"px; left:"+x+"px;"
        att4.value = "explosao_ar.gif?" + new Date()
    }else{
        att1.value = "explosaoChao"
        att2.value = "top:"+(tamTelaH-57)+"px; left:"+(x-17)+"px;"
        att4.value = "explosao_chao.gif?" + new Date()
    }
    att5.value = "ex1.mp3?" + new Date()
    att6.value = "som"+isom

    explosao.setAttributeNode(att1)
    explosao.setAttributeNode(att2)
    explosao.setAttributeNode(att3)

    img.setAttributeNode(att4)

    som.setAttributeNode(att5)
    som.setAttributeNode(att6)

    explosao.appendChild(img)
    explosao.appendChild(som)

    document.body.appendChild(explosao)
    document.getElementById("som"+isom).play()

    ie++
    isom++
}

function controlaJogador(){
    pjx += dirxJ + velJ
    pjy += diryJ + velJ
    jog.style.top = pjy + "px"
    jog.style.left = pjx + "px"
}

function gerenciaGame(){
    barraPlaneta.style.width = vidaPlaneta + "px"
    if(contBombas <= 0){    
        jogo = false
        clearInterval(tmpCriaBomba)
        telaMsg.style.backgroundImage = "url('vitoria.gif')"
        telaMsg.style.backgroundPosition = "center"
        telaMsg.style.backgroundSize = "cover"
        telaMsg.style.display = "block"
    }
    else if(vidaPlaneta <= 0){
        jogo = false
        clearInterval(tmpCriaBomba)
        telaMsg.style.backgroundImage = "url('derrota.jpg')"
        telaMsg.style.backgroundPosition = "center"
        telaMsg.style.backgroundSize = "cover"
        telaMsg.style.display = "block"
    }
}

function gameLoop(){
    if(jogo){
        controlaJogador()
        controleTiro()
        controlaBomba()
    }
    gerenciaGame()
    frames = requestAnimationFrame(gameLoop)
}

function reinicia(){
    mensagem = document.getElementById("mensagem")
    mensagem.style.display = "none"
    bombasTotal = document.getElementsByClassName("bomba")
    var tam = bombasTotal.length
    for(var i = 0; i < tam; i++){
        if(bombasTotal[i]){
            bombasTotal[i].remove()
        }
    }
    telaMsg.style.display = "none"
    clearInterval(tmpCriaBomba)
    cancelAnimationFrame(frames)
    vidaPlaneta = 100
    pjx = tamTelaW / 2
    pjy = tamTelaH / 2
    jog.style.top = pjy + "px"
    jog.style.left = pjx + "px"
    contBombas = 15
    jogo = true
    tmpCriaBomba = setInterval(criarBombas,1700)
    gameLoop()
}

function inicia(){
    jogo = false

    //Ini tela
    tamTelaH = window.innerHeight
    tamTelaW = window.innerWidth

    //Ini Jogador  
    dirxJ = diryJ = 0
    pjx = tamTelaW / 2
    pjy = tamTelaH / 2
    
    velJ = 0
    velT = 4
    velB = 2

    jog = document.getElementById("naveJog")
    jog.style.top = pjy + "px"
    jog.style.left = pjx + "px"

    
    contBombas = 15
    vidaPlaneta = 100
    barraPlaneta = document.getElementById("barraPlaneta")
    barraPlaneta.style.width = vidaPlaneta + "px"
    ie = 0
    isom = 0

    telaMsg = document.getElementById("telaMsg")
    telaMsg.style.backgroundImage = "url('intro.png')"
    telaMsg.style.display = "block"
    document.getElementById("btnJogar").addEventListener("click",reinicia)

}

window.addEventListener("load", inicia)
document.addEventListener("keydown",teclaDw)
document.addEventListener("keyup",teclaUp)
