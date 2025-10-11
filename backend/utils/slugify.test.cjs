const { slugify } = require('./slugify.cjs');

describe('slugify', () => {
  it('debe convertir el texto a un slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('debe eliminar caracteres especiales', () => {
    expect(slugify('¡Hola, Mundo!')).toBe('hola-mundo');
  });

  it('debe manejar caracteres acentuados', () => {
    expect(slugify('crème brûlée')).toBe('creme-brulee');
  });

  it('debe manejar múltiples espacios', () => {
    expect(slugify('  espacios al principio y al final  ')).toBe('espacios-al-principio-y-al-final');
  });

  it('debe manejar múltiples guiones', () => {
    expect(slugify('un--texto---con--guiones')).toBe('un-texto-con-guiones');
  });

  it('debe manejar texto vacío', () => {
    expect(slugify('')).toBe('');
  });
});
