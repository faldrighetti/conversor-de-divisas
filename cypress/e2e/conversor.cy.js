const URL = "http://192.168.0.23:8080";

describe('Conversor de monedas', () => {
  beforeEach(() => {
    cy.visit(URL);
  });

  it('Se asegura de que no haya una opción seleccionada de fecha al empezar', () => {

  })

  it('Se asegura de que la fecha no sea posterior a la actual', () => {
    
  });

  it('Se asegura de que la cantidad sea mayor a cero', () => {
    cy.get('#boton-calcular').click();
    //cy.get('#cantidad').should() SER MAYOR A CERO
    });
    
  /*Tests a realizar:
  Que la cantidad sea mayor a cero
  Que la fecha no sea posterior a la actual
  El caso feliz
  Que no pase nada si no hay un radio button checked
  */
})
