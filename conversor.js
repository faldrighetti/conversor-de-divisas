const divisaBase = $("#divisa-base");
const cantidad = $("#cantidad");
const dia = $("#dia");
const mes = $("#mes");
const anio = $("#anio");
const divisaSolicitada = $("#divisa-solicitada");
const $botonCalcular = document.querySelector('#boton-calcular');
const resultado = $("#resultado");

function tomarDatos(){
    const $divisaBase = divisaBase.text();//MAL: No tiene que tomar el texto del campo divisa base porque es el select,
    //tiene que tomar el texto de la option elegida. Lo mismo para divisa solicitada.
    const $cantidad = cantidad.text();
    const $dia = dia.text();
    const $mes = mes.text();
    const $anio = anio.text();
    const $divisaSolicitada = divisaSolicitada.text();

    return [$divisaBase, $cantidad, $dia, $mes, $anio, $divisaSolicitada];
}

fetch("https://api.exchangerate.host/latest")
    .then(respuesta => respuesta.json())
    .then(respuestaJSON => {
        Object.keys(respuestaJSON.rates).forEach(moneda => {
            divisaBase.append(`<option>${moneda}</option>`)
            divisaSolicitada.append(`<option>${moneda}</option>`) //ESTO ESTÁ MAL, DA TODAS LAS DIVISAS JUNTAS
            //AEDAFNALLAMD, etc. Tengo que encontrar la manera de que den textos diferentes según la opción elegida.
        })
    })    
    .catch(error => console.error('ERROR: ', error));

$botonCalcular.onclick = function(){
    console.log(tomarDatos())
    return false;
}

function convertirDivisaDesdeFecha(){

    //'https://api.exchangerate.host/2020-04-04'
    //fetch(`https://api.exchangerate.host/${anio}-${mes}-${dia})`
    fetch("https://api.exchangerate.host/latest")
    .then(respuesta => respuesta.json())
    .then(respuesta => console.log(respuesta))
    .catch(error => console.error('ERROR: ', error));
    //Acá tomar las divisas y multiplicar la cantidad por el rate
    //return cantidad
}

function convertirDivisaActual(){
    //Chequear que los campos de fecha estén vacíos para ejecutar esta función.
    //https://api.exchangerate.host/convert?from=USD&to=EUR'
    //amount=1200
    fetch(`https://api.exchangerate.host/convert?from=${divisaBase}&to=${divisaSolicitada}`)
    .then(respuesta => respuesta.json())
    .then(respuesta => console.log(respuesta))
    .catch(error => console.error('ERROR: ', error));
    //Acá tomar las divisas y multiplicar la cantidad por el rate
    //return cantidad
}

//TODO: codear funciones de conversión
// escribir el campo de resultado

//TESTEAR: que los días del mes no puedan ser mayor a 31 ni negativos. Que el mes no sea mayor a 12 ni negativo.
// El caso feliz
//Que la cantidad sea un número mayor a cero
//Que todos o ninguno de los campos de fecha hayan sido completados. No puede haber solo uno o dos escritos.