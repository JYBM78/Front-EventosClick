import { LocalidadDTO } from "./localidad-dto";

export interface EditarEventoDTO {
    id: String,
    nombre: string ,
    descripcion: String ,
    imagenLocalidades: String ,
    tipo: string ,
    fechaEvento: Date ,
    ciudad: String ,
    localidades: LocalidadDTO[] ,
    imagenImportada :String 

}