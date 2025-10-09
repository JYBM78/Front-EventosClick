import { DetalleOrdenDTO } from "./detalleOrden-dto";

export interface CrearOrdenDTO {
    idCliente: String ,
   // fechaVencimiento: Date ,
    codigoPasarela: String ,
    total: number ,
    items: DetalleOrdenDTO [],
    idCupon:string
}