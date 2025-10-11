import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleCarritoDTO } from '../../dto/carrito/detalleCarrito-dto';
import { EventoDTO } from '../../dto/evento-dto';
import Swal from 'sweetalert2';
import { ClienteService } from '../../servicios/cliente.service';
import { TokenService } from '../../servicios/token.service';
import { CarritoDTO } from '../../dto/carrito/carrito-dto';
import { PublicoService } from '../../servicios/publico.service';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit{
  itemsCarrito!: DetalleCarritoDTO[];
  carrito!: CarritoDTO;
  idCuenta!: any;
  // Mapa para almacenar los nombres de los eventos por idEvento
  nombresEventos = new Map<string, string>();
  eventos!: EventoDTO[];

  preciosItem = new Map<string, number>();

  
  itemsSeleccionados: DetalleCarritoDTO[] = [];
  textoBtnEliminar: string = '';

  ngOnInit(): void {
    this.idCuenta = this.tokenService.getIDCuenta();
    this.publicoService.listarTodosEventos().subscribe({
      next: (data) => {
        //console.log(data);
        this.eventos = data.respuesta;
        this.eventos.forEach(evento => {
          this.nombresEventos.set(evento.id, evento.nombre);
        });
        //console.log(this.eventos);
      },
      error: (error) => {
        console.error( error);
      }
    });
    this.obtenerCarrito();
  }
  constructor(
    private clienteService: ClienteService,
    private tokenService: TokenService,
    private publicoService: PublicoService,
    private router: Router
  ) {
    this.actualizarMensaje();
    
  }
  // Método que se ejecuta al hacer clic en el botón
  procederAlPago() {
    // Realiza aquí cualquier acción o validación antes de redirigir
    if (this.carrito && this.carrito.id) {
      console.log('Redirigiendo al pago para la orden:', this.carrito.id);

      // Navegar a la ruta usando el `Router`
      this.router.navigate(['/confirmar-orden', this.carrito.id]);
    } else {
      console.error('Carrito no encontrado');
    }
  }




  public obtenerCarrito() {
    
    this.clienteService.traerCarritoCliente(this.idCuenta).subscribe({
      next: (data) => {
        this.carrito = data.respuesta;
        this.itemsCarrito = this.carrito.items;

        // Obtener el evento para cada item del carrito
        this.itemsCarrito.forEach((item) => {
          this.obtenerEvento(item.idEvento);
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  actualizarCantidad(item: DetalleCarritoDTO) {
    this.obtenerPrecio(item); // Recalcula el precio para el ítem
    this.clienteService.editarItemCarrito(this.carrito.id, item).subscribe({
      next: (data) => {
        //console.log(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
    console.log('Ítem actualizado:', item);
  }






  public obtenerPrecio(item: DetalleCarritoDTO): number {
    // Verificar si ya tenemos el precio calculado para este ítem
    if (this.preciosItem.has(item.idEvento)) {
      return this.preciosItem.get(item.idEvento)! * item.cantidad;
    }
  
    // Buscar el evento en la lista ya cargada en `eventos`
    const evento = this.eventos.find(e => e.id === item.idEvento);
    if (evento) {
      // Encontrar la localidad correcta y su precio
      const localidad = evento.localidades.find(loc => loc.nombre === item.nombreLocalidad);
      if (localidad) {
        const precioTotal = localidad.precio * item.cantidad;
        this.preciosItem.set(item.idEvento, localidad.precio);
        return precioTotal;
      }
    }
  
    // Si no se encuentra el evento o la localidad, devolver 0
    return 0;
  }
  
  
  public obtenerEvento(idEvento: string) {
    // Verificar si el nombre del evento ya está en el mapa para evitar solicitudes duplicadas
    if (!this.nombresEventos.has(idEvento)) {
        // Buscar el evento en la lista `eventos`
        const evento = this.eventos.find(e => e.id === idEvento);
        if (evento) {
          const nombreEvento = evento.nombre;
          this.nombresEventos.set(idEvento, nombreEvento); // Guardar en el mapa para futuros accesos
    
  }
    }
  }

  seleccionarItem(item: DetalleCarritoDTO, estado: boolean) {
    if (estado) {
      this.itemsSeleccionados.push(item);
    } else {
      const index = this.itemsSeleccionados.indexOf(item);
      if (index !== -1) {
        this.itemsSeleccionados.splice(index, 1);
      }
    }
    this.actualizarMensaje();
  }

  actualizarMensaje() {
    const cantidad = this.itemsSeleccionados.length;
    this.textoBtnEliminar = cantidad === 1 ? '1 elemento' : `${cantidad} elementos`;
  }

  confirmarEliminacion() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará los items seleccionados del carrito.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarItems();
        Swal.fire('Eliminados', 'Los items seleccionados han sido eliminados del carrito.', 'success');
      }
    });
  }

  eliminarItem(item: DetalleCarritoDTO) {
    // Implementar lógica para eliminar un solo item si es necesario
    this.clienteService.eliminarItemCarrito(this.carrito.id, item.idDetalleCarrito).subscribe({
      next: (data) => {
        // Guardar el nombre del evento en el mapa
        this.itemsCarrito = this.itemsCarrito.filter(i => i.idDetalleCarrito !== item.idDetalleCarrito);

      // Actualizar el carrito con los nuevos items
      this.carrito.items = this.itemsCarrito;
       console.log(data);
       
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  eliminarItems() {
    this.itemsCarrito = this.itemsCarrito.filter(item => !this.itemsSeleccionados.includes(item));
    this.itemsSeleccionados = [];
    this.actualizarMensaje();
  }

  mostrarCarrito() {
    console.log(this.itemsCarrito);
  }

  trackById(index: number, item: DetalleCarritoDTO) {
    return item.idDetalleCarrito;
  }
}
