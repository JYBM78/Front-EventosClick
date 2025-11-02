import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-pendiente',
  standalone: true,
  imports: [],
  templateUrl: './pago-pendiente.component.html',
  styleUrl: './pago-pendiente.component.css'
})
export class PagoPendienteComponent {

  constructor(private router: Router) {}

  volverInicio() {
    this.router.navigate(['']);
  }
  volverConfirmarOrden() {
    this.router.navigate(['/carrito']);
  }

}
