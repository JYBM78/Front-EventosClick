import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensajeDTO } from '../dto/mensaje-dto';
import { Observable } from 'rxjs';
import { CrearEventoDTO } from '../dto/crear-evento-dto';
import { EditarEventoDTO } from '../dto/editar-evento-dto';



@Injectable({
 providedIn: 'root'
})
export class AdministradorService {


 private adminURL = "http://localhost:8080/api/admin";


 constructor(private http: HttpClient) { }
 private getAuthHeaders(): HttpHeaders {
  const token = sessionStorage.getItem('AuthToken');
  return new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
}



 //public crearEvento(crearEventoDTO: CrearEventoDTO): Observable<MensajeDTO> {
 //  return this.http.post<MensajeDTO>(`${this.adminURL}/crear-evento`, crearEventoDTO);
 //}
 public crearEvento(crearEventoDTO: CrearEventoDTO): Observable<MensajeDTO> {
  return this.http.post<MensajeDTO>(`${this.adminURL}/crear-evento`, crearEventoDTO, { headers: this.getAuthHeaders() });
}


 public actualizarEvento(editarEventoDTO: EditarEventoDTO): Observable<MensajeDTO> {
   return this.http.put<MensajeDTO>(`${this.adminURL}/editar-evento`, editarEventoDTO, { headers: this.getAuthHeaders() });
 }
 

 public obtenerEvento(id: string): Observable<MensajeDTO> {
   return this.http.get<MensajeDTO>(`${this.adminURL}/obtener-evento/${id}`, { headers: this.getAuthHeaders() });
 }


 public eliminarEvento(id: String): Observable<MensajeDTO> {
   return this.http.delete<MensajeDTO>(`${this.adminURL}/eliminar-evento/${id}`, { headers: this.getAuthHeaders() });
 }


 public listarEventosAdmin(): Observable<MensajeDTO> {
   return this.http.get<MensajeDTO>(`${this.adminURL}/listar-todos-eventos-admin`,  { headers: this.getAuthHeaders() });
 }

 


// public subirImagen(imagen: FormData): Observable<MensajeDTO> {
  // return this.http.post<MensajeDTO>(`${this.adminURL}/subir`, imagen);
 //}
 public subirImagen(imagen: FormData): Observable<MensajeDTO> {
  return this.http.post<MensajeDTO>(`${this.adminURL}/subir`, imagen, { headers: this.getAuthHeaders() });
}
public eliminarImagen(idImagen: string): Observable<MensajeDTO> {
  return this.http.delete<MensajeDTO>(`${this.adminURL}/eliminar?idImagen=${idImagen}`, { headers: this.getAuthHeaders() });
}


}
