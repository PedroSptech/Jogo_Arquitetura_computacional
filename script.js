var pares = [
  { id: 1, pergunta: "O que é a CPU?", resposta: "Parte de um computador onde são realizados cálculos e processamento de instruções." },
  { id: 2, pergunta: "O que é a ULA?", resposta: "Parte do processador que executa operações de cálculos matemáticos e lógicos." },
  { id: 3, pergunta: "O que são os registradores e onde se localizam?", resposta: "Memória mais rápida, dentro do processador, usada para guardar dados temporários durante os cálculos." },
  { id: 4, pergunta: "Quais são os tipos de memória e suas finalidades?", resposta: "RAM: temporária. ROM: permanente (BIOS). EPROM: gravada por UV. Flash: não volátil (SSD/celulares). Massa: lenta, grandes arquivos." },
  { id: 5, pergunta: "O que é o DMA e como funciona?", resposta: "Permite que hardware acesse a memória diretamente sem precisar da CPU — comum em transferências como downloads." },
  { id: 6, pergunta: "O que é o Chip Select (CS)?", resposta: "Pino de controle que ativa ou desativa um componente específico em um barramento compartilhado." },
  { id: 7, pergunta: "O que é o Address Bus e o Data Bus?", resposta: "Address Bus: identifica onde o dado é lido ou gravado. Data Bus: transporta os dados entre componentes." },
  { id: 8, pergunta: "Quais as características dos processadores Intel I5 e I7?", resposta: "I5 (Intel, 2009): 4 núcleos, 4 threads, 2.66 GHz. I7 (Intel, 2008): 4 núcleos, 8 threads, HyperThreading, Nehalem, 45 nm." },
  { id: 9, pergunta: "O que é Dual Core e Quad Core?", resposta: "Dual Core: 2 núcleos independentes (ex: Core i3). Quad Core: 4 núcleos independentes (ex: Core i5)." }
];

var cartas = [];
var cartasViradas = [];
var totalPares = 0;
var tentativas = 0;
var travado = false;
var segundos = 0;
var cronometro;
var iniciou = false;

function embaralhar(vetor) {
  for (var i = vetor.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = vetor[i];
    vetor[i] = vetor[j];
    vetor[j] = temp;
  }
  return vetor;
}

function montarCartas() {
  var todas = [];
  for (var i = 0; i < pares.length; i++) {
    todas.push({ id: pares[i].id, tipo: 'pergunta', texto: pares[i].pergunta });
    todas.push({ id: pares[i].id, tipo: 'resposta', texto: pares[i].resposta });
  }
  return embaralhar(todas);
}

function renderizar() {
  var grade = document.getElementById('grade');
  grade.innerHTML = '';

  for (var i = 0; i < cartas.length; i++) {
    var carta = cartas[i];
    var div = document.createElement('div');
    div.className = 'carta';
    div.indice = i;

    var icone = carta.tipo === 'pergunta' ? '❔' : '✔';
    var etiqueta = carta.tipo === 'pergunta' ? 'Pergunta' : 'Resposta';

    div.innerHTML =
      '<div class="carta-interior">' +
        '<div class="carta-frente">' + icone + '</div>' +
        '<div class="carta-verso ' + carta.tipo + '">' +
          '<span class="etiqueta">' + etiqueta + '</span>' +
          carta.texto +
        '</div>' +
      '</div>';

    div.addEventListener('click', virar);
    grade.appendChild(div);
  }
}

function virar(evento) {
  var el = evento.currentTarget;

  if (travado || el.className.indexOf('virada') > -1 || el.className.indexOf('encontrada') > -1) return;

  if (!iniciou) {
    iniciarCronometro();
    iniciou = true;
  }

  el.className = 'carta virada';
  cartasViradas.push(el);

  if (cartasViradas.length == 2) {
    travado = true;
    tentativas++;
    document.getElementById('tentativas').textContent = tentativas;
    verificarPar();
  }
}

function verificarPar() {
  var cartaA = cartasViradas[0];
  var cartaB = cartasViradas[1];

  var idA = cartas[cartaA.indice].id;
  var idB = cartas[cartaB.indice].id;
  var tipoA = cartas[cartaA.indice].tipo;
  var tipoB = cartas[cartaB.indice].tipo;

  if (idA == idB && tipoA != tipoB) {
    cartaA.className = 'carta encontrada';
    cartaB.className = 'carta encontrada';
    totalPares++;
    document.getElementById('pares').textContent = totalPares;
    cartasViradas = [];
    travado = false;
    if (totalPares == pares.length) {
      setTimeout(mostrarVitoria, 500);
    }
  } else {
    setTimeout(function() {
      cartaA.className = 'carta';
      cartaB.className = 'carta';
      cartasViradas = [];
      travado = false;
    }, 3000);
  }
}

function iniciarCronometro() {
  cronometro = setInterval(function() {
    segundos++;
    document.getElementById('tempo').textContent = segundos + 's';
  }, 1000);
}

function mostrarVitoria() {
  clearInterval(cronometro);
  document.getElementById('resultado').textContent = tentativas + ' tentativas em ' + segundos + 's';
  document.getElementById('vitoria').style.display = 'flex';
}

function restart() {
  clearInterval(cronometro);
  cartas = [];
  cartasViradas = [];
  totalPares = 0;
  tentativas = 0;
  travado = false;
  segundos = 0;
  iniciou = false;
  document.getElementById('tentativas').textContent = '0';
  document.getElementById('pares').textContent = '0';
  document.getElementById('tempo').textContent = '0s';
  document.getElementById('vitoria').style.display = 'none';
  cartas = montarCartas();
  renderizar();
}

cartas = montarCartas();
renderizar();