import { LocalidadDTO } from "./localidad-dto";


export interface CrearEventoDTO {
    

    nombre: String ,
    descripcion: String ,
    imagenLocalidades: String ,
    tipo: string ,
    fechaEvento: Date ,
    ciudad: String ,
    localidades: LocalidadDTO[] ,
    imagenImportada:String 
   // direccion: string, // Añadido
    //imagenPortada: string, // Añadido para la imagen de portada
}
