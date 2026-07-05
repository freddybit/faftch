import { describe, it, expect } from '@jest/globals';

describe('FAFTch Suite de Pruebas Inicial', () => {
  it('Debería sumar dos números correctamente (Prueba de entorno)', () => {
    const suma = (a: number, b: number) => a + b;
    expect(suma(2, 3)).toBe(5);
  });
});