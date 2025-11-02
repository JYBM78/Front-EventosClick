import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { ClienteService } from '../../servicios/cliente.service';
import { TokenService } from '../../servicios/token.service';
import { PublicoService } from '../../servicios/publico.service';

import { CarritoDTO } from '../../dto/carrito/carrito-dto';
import { DetalleCarritoDTO } from '../../dto/carrito/detalleCarrito-dto';
import { EventoDTO } from '../../dto/evento-dto';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  carrito!: CarritoDTO;
  itemsCarrito: DetalleCarritoDTO[] = [];
  eventos: EventoDTO[] = [];
  idCuenta!: string;

  nombresEventos = new Map<string, string>();
  preciosItem = new Map<string, number>();

  constructor(
    private clienteService: ClienteService,
    private tokenService: TokenService,
    private publicoService: PublicoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idCuenta = this.tokenService.getIDCuenta();
    this.cargarEventos();
    this.obtenerCarrito();
  }

  // 🔹 Obtener todos los eventos y guardar sus nombres
  private cargarEventos() {
    this.publicoService.listarTodosEventos().subscribe({
      next: (data) => {
        this.eventos = data.respuesta;
        this.eventos.forEach(evento => this.nombresEventos.set(evento.id, evento.nombre));
      },
      error: (err) => console.error('Error al cargar eventos:', err)
    });
  }

  // 🔹 Cargar el carrito del cliente
  private obtenerCarrito() {
    this.clienteService.traerCarritoCliente(this.idCuenta).subscribe({
      next: (data) => {
        this.carrito = data.respuesta;
        this.itemsCarrito = this.carrito.items || [];
      },
      error: (err) => console.error('Error al cargar carrito:', err)
    });
  }

  // 🔹 Actualiza cantidad de entradas en el carrito
  actualizarCantidad(item: DetalleCarritoDTO) {
    this.clienteService.editarItemCarrito(this.carrito.id, item).subscribe({
      next: () => console.log('Cantidad actualizada:', item),
      error: (err) => console.error('Error al actualizar cantidad:', err)
    });
  }

  // 🔹 Calcula el precio total del ítem
  obtenerPrecio(item: DetalleCarritoDTO): number {
    const evento = this.eventos.find(e => e.id === item.idEvento);
    const localidad = evento?.localidades.find(l => l.nombre === item.nombreLocalidad);
    return localidad ? localidad.precio * item.cantidad : 0;
  }

  // 🔹 Eliminar un ítem del carrito
  eliminarItem(item: DetalleCarritoDTO) {
    Swal.fire({
      title: '¿Eliminar este ítem?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.clienteService.eliminarItemCarrito(this.carrito.id, item.idDetalleCarrito).subscribe({
          next: () => {
            this.itemsCarrito = this.itemsCarrito.filter(i => i.idDetalleCarrito !== item.idDetalleCarrito);
            Swal.fire('Eliminado', 'El ítem fue eliminado del carrito', 'success');
          },
          error: (err) => console.error('Error al eliminar ítem:', err)
        });
      }
    });
  }

  // 🔹 Redirige a la vista de pago
  procederAlPago() {
    if (this.carrito?.id) {
      this.router.navigate(['/confirmar-orden', this.carrito.id]);
    } else {
      Swal.fire('Error', 'No se encontró el carrito activo.', 'error');
    }
  }

  trackById(index: number, item: DetalleCarritoDTO) {
    return item.idDetalleCarrito;
  }
}
