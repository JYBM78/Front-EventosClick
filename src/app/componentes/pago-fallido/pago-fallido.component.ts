import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-fallido',
  standalone: true,
  imports: [],
  templateUrl: './pago-fallido.component.html',
  styleUrl: './pago-fallido.component.css'
})
export class PagoFallidoComponent {

  constructor(private router: Router) {}

  volverInicio() {
    this.router.navigate(['']);
  }
  volverConfirmarOrden() {
    this.router.navigate(['/carrito']);
  }

}
