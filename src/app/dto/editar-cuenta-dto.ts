export interface EditarCuentaDTO {
    
    id: String;
    nombre: string;
    telefono: string;
    correo?:String,
    direccion?: string; // Opcional, ya que puede no estar presente
  }
  