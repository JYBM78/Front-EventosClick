import { LocalidadDTO } from "./localidad-dto";

export interface InformacionEventoDTO {
   id: string;
   estado: string; 
   nombre: string;
   descripcion: string;
   tipo: string; 
   fechaEvento: Date; 
   ciudad: string;
   imagenPortada: string;
   imagenLocalidades: string;
   localidades: LocalidadDTO[];
 }