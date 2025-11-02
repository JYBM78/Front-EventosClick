import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  imports: [],
  templateUrl: './pago-exitoso.component.html',
  styleUrl: './pago-exitoso.component.css'
})
export class PagoExitosoComponent {
  constructor(private router: Router) {}

  volverInicio() {
    this.router.navigate(['']);
  }

  volverConfirmarOrden() {
    this.router.navigate(['/confirmar-orden']);
  }

}
