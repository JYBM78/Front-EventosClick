import { DetalleCarritoDTO } from "./detalleCarrito-dto";

export interface CarritoDTO {
    id: string;
    fecha: string; // En TypeScript, las fechas suelen manejarse como string en formato ISO
    items: DetalleCarritoDTO[]; // Lista de DetalleCarritoDTO
    idUsuario: string;
    precioTotal:number;
}
