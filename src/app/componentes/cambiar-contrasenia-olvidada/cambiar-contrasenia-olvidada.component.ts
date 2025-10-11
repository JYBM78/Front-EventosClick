import { Component } from '@angular/core';

@Component({
  selector: 'app-cambiar-contrasenia-olvidada',
  standalone: true,
  imports: [],
  templateUrl: './cambiar-contrasenia-olvidada.component.html',
  styleUrl: './cambiar-contrasenia-olvidada.component.css'
})
export class CambiarContraseniaOlvidadaComponent {
  nombreUsuario: string = ''; // Puedes obtener este valor dinámicamente
  emailUsuario: string = ''; // Puedes obtener este valor dinámicamente
}
