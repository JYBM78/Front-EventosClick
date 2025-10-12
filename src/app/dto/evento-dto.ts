import { LocalidadDTO } from "./localidad-dto";

export interface EventoDTO {
   id:string,
   nombre:string,
   descripcion:string,
   fechaEvento:Date,
   tipo:string,
   direccion:string,
   ciudad:string,
   localidades:LocalidadDTO[],
   imagenPortada:string,
   imagenLocalidades:string,
   estado:string
}