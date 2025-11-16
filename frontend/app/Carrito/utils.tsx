export interface Carrito {
  id: number;
  producto: string;
  precio: number;
  img_url: string;
  cantidad: number;   
}
export const calcularTotal = (carrito: Carrito[] = []): number =>
  carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);