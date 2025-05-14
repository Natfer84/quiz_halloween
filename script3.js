let preguntas = []; //para meter el array de las preguntas
let indicePregunta = 0; //para luego, cuando demos a siguiente se cargue la siguiente pregunta.
let respuestaCorrecta = 0;
let contadorCorrecta = 0;

// Función para obtener las preguntas de la API
const obtenerPreguntas = function () {
  fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    .then((respuesta) => respuesta.json()) // Convertimos la respuesta a JSON
    .then((data) => {
      preguntas = data.results; // AQUÍ ESTAN TODAS LAS PREGUNTAS
      indicePregunta = 0; // Empezamos desde la primera pregunta
      mostrarPregunta(); // Mostramos la primera pregunta. llamando a la funcicón mostrarPreguntas
    })
    .catch((error) => console.log("Error al obtener las preguntas:", error)); //error que da fetch
};

const mostrarPregunta = function () {
  let preguntaActual = preguntas[indicePregunta]; //empieza por el indice 0
  document.getElementById("pregunta").innerHTML = preguntaActual.question;
  console.log(preguntaActual);

  let respuestas = [
    ...preguntaActual.incorrect_answers,
    preguntaActual.correct_answer,
  ]; // selecciona las correctas y la correcta.
  //let respuestas = primeraPregunta.correct_answer.incorrect_answers;
  respuestas.sort(() => Math.random() - 0.5); // esto mezcla las respuestas para que no coincida simpre la misma posicion con la correcta

  console.log(respuestas);
  //me devuelve un array con las respuestas, las 4.

  //let respuestaCorrectaUsuario =
  document.getElementById("respuesta1").innerHTML = respuestas[0]; // a cada li del html se incluye un arespiesta mediante su posición
  document.getElementById("respuesta2").innerHTML = respuestas[1];
  document.getElementById("respuesta3").innerHTML = respuestas[2];
  document.getElementById("respuesta4").innerHTML = respuestas[3];

  //////// voy a intentar grabar en localStorage las respuestas:
  /*let arrayRespuestas = respuestas;
    // Se guarda en localStorage despues de JSON stringificarlo 
    localStorage.setItem('myArrayRespuestas', JSON.stringify(arrayRespuestas));
    // Obtener el arreglo de localStorage
    arrayRespuestas = localStorage.getItem('myArrayRespuestas');
    // Se parsea para poder ser usado en js con JSON.parse :)
    arrayRespuestas = JSON.parse(arrayRespuestas);
    console.log(arrayRespuestas);*/ /********ESTO FUE UN PRIMER INTENTO, QUE NO ESTÁ MAL, PERO LUEGO ME DI CUENTA QUE SIMPLEMETE VALÍA CON LO SIGUENTE**********/
  localStorage.setItem("respuestas", JSON.stringify(respuestas));
};

function validarRespuesta(resSeleccionada) {
  let respuestaSeleccionada =
    document.querySelectorAll(".lista")[resSeleccionada].textContent;
  console.log(respuestaSeleccionada);

  let respuestaCorrecta = preguntas[indicePregunta].correct_answer;

  console.log(respuestaCorrecta);

  if (respuestaSeleccionada == respuestaCorrecta) {
    document.getElementById("validacion").textContent = "Respuesta correcta!!";
    document.getElementById("validacion").classList.add("muestra");
    contadorCorrecta++; // incrementa a la variable cada respuesta que sea correcta
  } else {
    document.getElementById("validacion").textContent =
      "Respuesta Incorrecta!!";
    document.getElementById("validacion").classList.add("muestra");
  }

  console.log(contadorCorrecta);

  indicePregunta++; //incrementa de uno en uno y eso hace que llame a la siguiente pregunta.

  //aquí vuelvo a grabar el total de las respuestas correctas del juego en localStorage.

  localStorage.setItem("respuestasCorrectas", JSON.stringify(contadorCorrecta));

  console.log(contadorCorrecta);

  document.getElementById("numeroContador").textContent = contadorCorrecta;
}

function siguientePregunta() {
  if (indicePregunta < preguntas.length) {
    mostrarPregunta();
    document.getElementById("validacion").textContent = "";
  } else {
    document.getElementById("fin").textContent = "Se terminó el juego!!";
    //document.getElementById("next-button").style.display = "none";
    finalizarJuego();
  }
}
const botonDiv = document.querySelector("#next-button");
botonDiv.addEventListener("click", siguientePregunta);
obtenerPreguntas();

///Función para empezar nueva partida
function nuevaPartida() {
  if ((indicePregunta == preguntas.length)) {
    document.getElementById("fin").textContent = " ";
    document.getElementById("validacion").textContent =
      " ";
    obtenerPreguntas();
  }
}
const botonNuevaPartida = document.querySelector("#nuevaPartida");
botonNuevaPartida.addEventListener("click", nuevaPartida);

/////////////////////Gráfica/////////////////

function registrarPuntuacion(contadorCorrecta) {
  // Recuperamos las puntuaciones existentes, o inicializamos un array vacío
  let puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];

  // Agregamos la nueva puntuación al array
  puntuaciones.push(contadorCorrecta);

  // Guardamos el array actualizado en localStorage
  localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));
}

// Verificar si los datos existen
function actualizarGrafica() {
  // Recuperamos las puntuaciones guardadas
  const puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
  if (puntuaciones) {
    // Crear la gráfica usando Chart.js
    const canvas = document.getElementById("myChart").getContext("2d");

    new Chart(canvas, {
      type: "bar", // tipo de gráfica (puede ser 'bar', 'line', 'pie', etc.)
      data: {
        labels: ["Partida 1", "Partida 2", "Partida 3"], // Etiquetas para el eje X
        datasets: [
          {
            label: "Puntuación",
            data: puntuaciones, // Los datos obtenidos del localStorage
            backgroundColor: "rgba(255, 200, 100)",
            borderColor: "rgba(255, 200, 100)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  } else {
    console.log("No se encontraron datos en localStorage");
  }
}

function finalizarJuego() {
  registrarPuntuacion(contadorCorrecta); // Guardamos la puntuación del jugador actual
  contadorCorrecta = 0; // Reiniciamos el contador para un nuevo juego
  document.getElementById("numeroContador").textContent = contadorCorrecta; // Actualizamos visualmente

  // Mostramos la gráfica con las puntuaciones acumuladas
  actualizarGrafica();
}
