const divisaBase = $("#divisa-base");
const cantidad = $("#cantidad");
const dia = $("#dia");
const mes = $("#mes");
const anio = $("#anio");
const fechaSeleccionada = $("#fecha-seleccionada");
const divisaSolicitada = $("#divisa-solicitada");
const $botonCalcular = document.querySelector('#boton-calcular');
const resultado = $("#resultado");

fetch("https://api.exchangerate.host/latest")
    .then(respuesta => respuesta.json())
    .then(respuestaJSON => {
        Object.keys(respuestaJSON.rates).forEach(moneda => {
            divisaBase.append(`<option>${moneda}</option>`);
            divisaSolicitada.append(`<option>${moneda}</option>`);
        })
    })
    .catch(error => console.error('ERROR: ', error));

for(let i = 2023; i >= 1999; i--){
    anio.append(`<option>${i}</option>`);
}

for (let i = 1; i <= 12; i++){
    if(i < 10){
        mes.append(`<option>0${i}</option>`);
    } else{
        mes.append(`<option>${i}</option>`);
    }
}

for (let i = 1; i <= 31; i++){
    if(i < 10){
        dia.append(`<option>0${i}</option>`);
    } else{
        dia.append(`<option>${i}</option>`);
    }
}

function procesarMonedas(){
    const $divisaBase = divisaBase.val();
    const $cantidad = Number(cantidad.val());
    const $divisaSolicitada = divisaSolicitada.val();
    let validezCantidad = true;

    if($cantidad < 1){
        validezCantidad = false;
        resultado.text('La cantidad debe ser mayor a cero');
    }

    return [$divisaBase, $divisaSolicitada, $cantidad, validezCantidad];
}

function procesarFecha(){
    const $dia = dia.val();
    const $mes = mes.val();
    const $anio = anio.val();
    let validezFecha = false;
    let fecha;
    
    const fechaInicio = new Date('1999-02-01');
    const fechaActual = new Date();
    const fechaIngresada = new Date(`${$anio}-${$mes}-${$dia}`);

    if(fechaIngresada <= fechaActual && fechaIngresada >= fechaInicio){
        validezFecha = true;
        fecha = `${$anio}-${$mes}-${$dia}`
    } else{
        resultado.text("La fecha ingresada no es válida");
    }
    return [validezFecha, fecha];
}

$botonCalcular.onclick = function(){
    convertirDivisa();
    return false;
}

function convertirDivisa(){
    const divisaBase = procesarMonedas()[0];
    const divisaSolicitada = procesarMonedas()[1];
    const cantidad = procesarMonedas()[2];
    const cantidadValida = procesarMonedas()[3];

    const fechaValida = procesarFecha()[0];
    const fechaIngresada = procesarFecha()[1];

    let linkFetch;

    
    if($('input[name="fecha"]:checked').val() == 'Fecha actual'){
        linkFetch = fetch("https://api.exchangerate.host/latest");
    }
    else if ($('input[name="fecha"]:checked').val() == 'Seleccionar fecha'){
        linkFetch =  fetch(`https://api.exchangerate.host/${fechaIngresada}?base=${divisaBase}`)
    }
    else{
        resultado.text("Por favor seleccione una opción para la fecha de conversión.");
    }

    if(fechaValida && cantidadValida){
        linkFetch
        .then(respuesta => respuesta.json())
        .then(respuestaJSON => {
            const ratio = respuestaJSON.rates[`${divisaSolicitada}`];
            if(ratio){
                resultado.text(`Convertir ${cantidad} ${divisaBase} a ${divisaSolicitada} da como resultado ${(ratio * cantidad).toFixed(2)} ${divisaSolicitada}`);
            } else{
                resultado.text("No hay datos de la moneda solicitada en esta fecha.");
            }
        })
        .catch(error => console.error('ERROR: ', error));
    }
}

//TESTEAR: El caso feliz
//Que la cantidad sea un número mayor a cero