import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensajeDTO } from '../dto/mensaje-dto';
import { Observable } from 'rxjs';
import { EditarCuentaDTO } from '../dto/editar-cuenta-dto';
import { CambiarPasswordDTO } from '../dto/cambiar-contrasenia-dto';
import { ActivarCuentaDTO } from '../dto/activar-cuenta-dto';


@Injectable({
 providedIn: 'root'
})
export class PublicoService {



 private publicoURL = "http://localhost:8082/api/general";

 

 constructor(private http: HttpClient) { }


 //Preferncia evento usuario
 public obtenerPreferenciasUsuario(idUsuario: string): Observable<[]> {
  return this.http.get<[]>(`${this.publicoURL}/obtener-preferenciasUsuario/${idUsuario}`);
}


 public listarTipos(): Observable<MensajeDTO> {
   return this.http.get<MensajeDTO>(`${this.publicoURL}/listar-tipo-eventos`);
 }


 public listarCiudades(): Observable<MensajeDTO> {
   return this.http.get<MensajeDTO>(`${this.publicoURL}/listar-ciudad-eventos`);
 }


 public listarEventos(): Observable<MensajeDTO> {
   return this.http.get<MensajeDTO>(`${this.publicoURL}/listar-eventos-activos`);
 }

 public listarTodosEventos(): Observable<MensajeDTO> {
  return this.http.get<MensajeDTO>(`${this.publicoURL}/listar-all-evento`);
}



 public obtenerEvento(id: string): Observable<MensajeDTO> {
   return this.http.get<MensajeDTO>(`${this.publicoURL}/obtener-evento/${id}`);
 }

 public obtenerCuenta(id: string): Observable<MensajeDTO> {
  return this.http.get<MensajeDTO>(`${this.publicoURL}/obtener-info-cuenta/${id}`);
}
public actualizarCuenta(editarCuentaDTO:EditarCuentaDTO): Observable<MensajeDTO> {
   return this.http.put<MensajeDTO>(`${this.publicoURL}/editar-perfil`, editarCuentaDTO);
}
// Método para enviar el código de activación al correo
enviarCodigoActivacion(correo: string): Observable<MensajeDTO> {
  return this.http.get<MensajeDTO>(`${this.publicoURL}/enviar-codigo-password/${correo}`);
}

// Método para cambiar la contraseña
cambiarPassword(cambiarPasswordDTO: CambiarPasswordDTO): Observable<MensajeDTO> {
  return this.http.put<MensajeDTO>(`${this.publicoURL}/cambiar-password`, cambiarPasswordDTO);
}
public inactivarCuenta(id: string): Observable<MensajeDTO> {
  return this.http.put<MensajeDTO>(`${this.publicoURL}/eliminar-cuenta/${id}`, {});
}
 public activarCuenta(activarCuentaDTO: ActivarCuentaDTO): Observable<MensajeDTO> {
  return this.http.put<MensajeDTO>(`${this.publicoURL}/activar-cuenta`, activarCuentaDTO);
}
public obtenerEventoId(id: string): Observable<MensajeDTO> {
  return this.http.get<MensajeDTO>(`${this.publicoURL}/obtener-evento/${id}`);
}

reenviarCodigoActivacion(correo: string): Observable<MensajeDTO> {
  return this.http.get<MensajeDTO>(`${this.publicoURL}/enviar-codigo-auth/${correo}`);
}

}

