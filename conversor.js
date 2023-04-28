const divisaBase = $("#divisa-base");
const cantidad = $("#cantidad");
const dia = $("#dia");
const mes = $("#mes");
const anio = $("#anio");
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

function procesarMonedas(){
    const $divisaBase = divisaBase.val();
    const $cantidad = Number(cantidad.val());
    const $divisaSolicitada = divisaSolicitada.val();

    return [$divisaBase, $cantidad, $divisaSolicitada];
}

function validarInputs(){
    const $dia = dia.val();
    const $mes = mes.val();
    const $anio = anio.val();
    let FINAL_MES;

    let diaValido = false;
    let mesValido = false;
    let anioValido = false;

    if($anio >= 1999 && $anio <= 2023){
        anioValido = true;
    }

    if($mes > 0 && $mes < 13){
        mesValido = true;
        if($mes == "1" || $mes == "3" || $mes == "5" || $mes == "7" || $mes == "8" || $mes == "10" || $mes == "12"){
            FINAL_MES = 31;
        }
        else if($mes == "4" || $mes == "6" || $mes == "9" || $mes == "11"){
            FINAL_MES = 30;
        }
        else if($mes == "2" && $anio % 4 === 0){
            FINAL_MES = 29;
        } else{
            FINAL_MES = 28;
        }
    };

    if($dia > 0 && $dia < FINAL_MES){
        diaValido = true;
    }
    console.log(diaValido, mesValido, anioValido);
    return diaValido && mesValido && anioValido;
}

function procesarFecha(){
    const $dia = dia.val();
    const $mes = mes.val();
    const $anio = anio.val();
    let fecha = false;

    if(validarInputs()){
        fecha = `${$anio}-${$mes}-${$dia}`;
    } else if(!$dia && !$mes && !$anio){
        fecha = 'latest';
    } else{
        resultado.text("La fecha ingresada no es válida");
    }
    return fecha;
}

$botonCalcular.onclick = function(){
    convertirDivisaDesdeFecha();
    return false;
}

function convertirDivisaDesdeFecha(){
    const divisaBase = procesarMonedas()[0];
    const cantidad = procesarMonedas()[1];
    const divisaSolicitada = procesarMonedas()[2];
    const fechaIngresada = procesarFecha();

    if(fechaIngresada && cantidad){
        fetch(`https://api.exchangerate.host/${fechaIngresada}?base=${divisaBase}`)
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
    } else if(!cantidad){
        resultado.text("Tiene que ingresar una cantidad");
    }
}

//Dar error para cuando haya uno o dos campos vacíos. En ese caso tengo que mostrar mensaje de error hasta
//que se ingrese una fecha válida.
//Bug: no funciona cuando ingreso fechas de una cifra. Interpreta 05/04/2019 pero se buguea con 5/4/2019
//Idea: hacer un select para las fechas, así queda más limpio y seguro.
//Ver comandos para poder ejecutar http-server y así poder empezar a usar Cypress.

//TESTEAR: El caso feliz
//Que la cantidad sea un número mayor a cero