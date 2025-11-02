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
import { LocalidadDTO } from '../../dto/localidad-dto';
import { SillaDTO } from '../../dto/Silladto';

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

  localidadSeleccionada: LocalidadDTO | null = null;
  cantidadSeleccionada: number = 1;
  sillasSeleccionadas: SillaDTO[] = [];

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

  seleccionarLocalidad(localidad: LocalidadDTO) {
    this.localidadSeleccionada = localidad;
    this.sillasSeleccionadas = []; // resetear sillas seleccionadas
  }

  alternarSeleccionSilla(silla: SillaDTO) {
    if (!silla.disponible) return; // no permitir selección si no está disponible

    const index = this.sillasSeleccionadas.findIndex(s => s.codigo === silla.codigo);
    if (index !== -1) {
      // quitar si ya estaba seleccionada
      this.sillasSeleccionadas.splice(index, 1);
    } else {
      // agregar silla
      if (this.sillasSeleccionadas.length < this.cantidadSeleccionada) {
        this.sillasSeleccionadas.push(silla);
      } else {
        Swal.fire('Atención', 'Ya seleccionaste el número máximo de sillas.', 'info');
      }
    }
  }

  comprarEntradas() {
    if (!this.localidadSeleccionada) {
      Swal.fire('Atención', 'Por favor selecciona una localidad.', 'warning');
      return;
    }

    if (this.cantidadSeleccionada < 1) {
      Swal.fire('Atención', 'La cantidad debe ser al menos 1.', 'warning');
      return;
    }

    if (this.sillasSeleccionadas.length !== this.cantidadSeleccionada) {
      Swal.fire('Atención', `Debes seleccionar exactamente ${this.cantidadSeleccionada} silla(s).`, 'warning');
      return;
    }

    const detalleCarrito: DetalleCarritoDTO = {
      idDetalleCarrito: this.generarID(),
      idEvento: this.evento.id,
      cantidad: this.cantidadSeleccionada,
      nombreLocalidad: this.localidadSeleccionada.nombre,
      precioUnitario: this.localidadSeleccionada.precio ,
      sillasSeleccionadas: this.sillasSeleccionadas.map(s => s.codigo)
    };

    this.clienteService.agregarItemCarritoUnico(this.idCuenta, detalleCarrito).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Las entradas fueron añadidas al carrito.', 'success')
          .then(() => this.router.navigate(['/carrito']));
      },
      error: () => Swal.fire('¡Error!', 'No se pudo agregar al carrito.', 'error')
    });
  }
}
