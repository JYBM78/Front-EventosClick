export interface DetalleCarritoDTO {
    idDetalleCarrito: string;
    idEvento: string;
    cantidad: number;
    nombreLocalidad: string;
    precioUnitario:number;
    sillasSeleccionadas: string[]; // 🔹 NUEVO campo
}
