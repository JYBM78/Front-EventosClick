import { DetalleOrdenDTO } from "./detalleOrden-dto";

export interface InformacionOrdenDTO {
    id: String ,
    idCliente: String ,
    fechaCreacion: Date ,
    codigoPasarela: String ,
    total: number ,
    items: DetalleOrdenDTO [],
    idCupon:string
}