const divisaBase = $("#divisa-base");
const cantidad = $("#cantidad");
const dia = $("#dia");
const mes = $("#mes");
const anio = $("#anio");
const divisaSolicitada = $("#divisa-solicitada");
const $botonCalcular = document.querySelector('#boton-calcular');
const resultado = $("#resultado");

function tomarDatos(){
    const $divisaBase = divisaBase.val();
    const $cantidad = Number(cantidad.val());
    const $dia = dia.val();
    const $mes = mes.val();
    const $anio = anio.val();
    const fecha = `${$anio}-${$mes}-${$dia}`;
    const $divisaSolicitada = divisaSolicitada.val();

    return [$divisaBase, $cantidad, fecha, $divisaSolicitada];
}

fetch("https://api.exchangerate.host/latest")
    .then(respuesta => respuesta.json())
    .then(respuestaJSON => {
        Object.keys(respuestaJSON.rates).forEach(moneda => {
            divisaBase.append(`<option>${moneda}</option>`)
            divisaSolicitada.append(`<option>${moneda}</option>`) 
        })
    })    
    .catch(error => console.error('ERROR: ', error));

$botonCalcular.onclick = function(){
    if(dia.val() !== '' && mes.val() !== '' && anio.val() !== ''){
        convertirDivisaDesdeFecha()
    }

    return false;
}

function convertirDivisaDesdeFecha(){
    const divisaBase = tomarDatos()[0];
    const cantidad = tomarDatos()[1];
    const fechaIngresada = tomarDatos()[2];
    const divisaSolicitada = tomarDatos()[3];

    fetch(`https://api.exchangerate.host/${fechaIngresada}?base=${divisaBase}`)
    .then(respuesta => respuesta.json())
    .then(respuesta => {
        const ratio = respuesta.rates[`${divisaSolicitada}`];
        resultado.text(`Convertir ${cantidad} ${divisaBase} a ${divisaSolicitada} da como resultado ${(ratio * cantidad).toFixed(2)} ${divisaSolicitada}`);
        })
    .catch(error => console.error('ERROR: ', error));

    //Si ningún input está vacío, que siga el código de arriba
    //Si todos están vacíos, que tome el latest.
    //Si uno o dos están vacíos, que dé mensaje de error.
}

//TODO: codear funciones de conversión
// escribir el campo de resultado

//TESTEAR: que los días del mes no puedan ser mayor a 31 ni negativos. Que el mes no sea mayor a 12 ni negativo.
// El caso feliz
//Que la cantidad sea un número mayor a cero
//Que todos o ninguno de los campos de fecha hayan sido completados. No puede haber solo uno o dos escritos.