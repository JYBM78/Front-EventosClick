import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { PublicoService } from '../../servicios/publico.service';
import { ClienteService } from '../../servicios/cliente.service';
import { TokenService } from '../../servicios/token.service';

import { InformacionEventoDTO } from '../../dto/informacion-evento-dto';
import { DetalleCarritoDTO } from '../../dto/carrito/detalleCarrito-dto';

@Component({
  selector: 'app-detalle-evento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css']
})
export class DetalleEventoComponent {
  codigoEvento: string = '';
  evento!: InformacionEventoDTO;
  idCuenta!: string;

  localidadSeleccionada: any = null;
  cantidadSeleccionada: number = 1;

  constructor(
    private route: ActivatedRoute,
    private publicoService: PublicoService,
    private router: Router,
    private clienteService: ClienteService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const codigoEvento = params['id'];
      this.obtenerEventoId(codigoEvento);
    });
    this.idCuenta = this.tokenService.getIDCuenta();
  }

  generarID(): string {
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
  }

  obtenerEventoId(id: string): void {
    this.publicoService.obtenerEvento(id).subscribe({
      next: (data) => {
        if (data && data.respuesta) {
          this.evento = data.respuesta;
        } else {
          Swal.fire('¡Error!', 'No se pudo cargar el evento.', 'error');
        }
      },
      error: () => Swal.fire('¡Error!', 'No se pudo cargar el evento.', 'error')
    });
  }

  comprarEntradas() {
    // Validar selección
    if (!this.localidadSeleccionada) {
      Swal.fire('Atención', 'Por favor selecciona una localidad.', 'warning');
      return;
    }

    if (this.cantidadSeleccionada < 1) {
      Swal.fire('Atención', 'La cantidad debe ser al menos 1.', 'warning');
      return;
    }

    // Crear detalle para el carrito
    const detalleCarrito: DetalleCarritoDTO = {
      idDetalleCarrito: this.generarID(),
      idEvento: this.evento.id,
      cantidad: this.cantidadSeleccionada,
      nombreLocalidad: this.localidadSeleccionada.nombre,
      precioUnitario: this.localidadSeleccionada.precio
    };

    // Llamar al servicio de cliente para agregar al carrito
    this.clienteService.agregarItemCarritoUnico(this.idCuenta, detalleCarrito).subscribe({
      next: (data) => {
        Swal.fire('¡Éxito!', 'La entrada se añadió al carrito.', 'success')
          .then(() => this.router.navigate(['/carrito']));
      },
      error: () => Swal.fire('¡Error!', 'No se pudo agregar al carrito.', 'error')
    });
  }
}
