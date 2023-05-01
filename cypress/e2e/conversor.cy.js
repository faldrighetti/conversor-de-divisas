const URL = "http://192.168.0.23:8080";

describe('Conversor de monedas', () => {
  beforeEach(() => {
    cy.visit(URL); 
  });

  it('Asegura que no se realice la conversión sin antes agregar la fecha', () => {
    cy.get('#boton-calcular').click();
    cy.get('#resultado').should('have.text', 'Por favor seleccione una opción para la fecha de conversión.');
  });

  it('Se asegura de que la fecha no sea posterior a la actual', () => {
    let $dia, $mes, $anio;
    cy.get('#boton-calcular').click();
    cy.get("#dia").then((dia) => {
      $dia = dia.val();
    })
    cy.get("#mes").then((mes) => {
      $mes = mes.val();
    })
    cy.get("#anio").then((anio) => {
      $anio = anio.val();
    })

    const fechaInicio = new Date('1999-02-01');
    const fechaActual = new Date();
    const fechaIngresada = new Date(`${$anio}-${$mes}-${$dia}`);

    if(fechaIngresada > fechaActual || fechaIngresada < fechaInicio){
      cy.get('#resultado').should('have.text',"La fecha ingresada no es válida");
    }
  });

  it('Se asegura de que la cantidad sea mayor a cero', () => {
    let $cantidad;
    cy.get('#boton-calcular').click();
    cy.get("#cantidad").then((cantidad) => {
      $cantidad = Number(cantidad.val());
    })
    if($cantidad < 1){
      cy.get('#resultado').should('have.text',"La cantidad debe ser mayor a cero");
    }
  });

  it('Evalúa el caso feliz', () => {
    cy.get('#seleccionar-fecha').click();
    cy.get('#dia').select('01');
    cy.get('#mes').select('01');
    cy.get('#anio').select('2020');

    cy.get('#divisa-base').select('USD'); // Especificar cuál es
    cy.get('#divisa-solicitada').select('ARS'); // Especificar cuál es
    cy.get("#cantidad").type('300');

    cy.get('#boton-calcular').click();
    cy.get('#resultado').should('have.text',"Convertir 300 USD a ARS da como resultado 17953.59 ARS");

  });
})
