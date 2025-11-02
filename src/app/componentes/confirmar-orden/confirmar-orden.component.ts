import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from '../../servicios/token.service';
import { ClienteService } from '../../servicios/cliente.service';
import { CarritoDTO } from '../../dto/carrito/carrito-dto';
import { CrearOrdenDTO } from '../../dto/orden/crear-orden-dto';
import { DetalleOrdenDTO } from '../../dto/orden/detalleOrden-dto';
import { DetalleCarritoDTO } from '../../dto/carrito/detalleCarrito-dto';
import { PublicoService } from '../../servicios/publico.service';
import { CommonModule } from '@angular/common';
import { EventoDTO } from '../../dto/evento-dto';
import { MensajeDTO } from '../../dto/mensaje-dto';


@Component({
  selector: 'app-confirmar-orden',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './confirmar-orden.component.html',
  styleUrls: ['./confirmar-orden.component.css']
})
export class ConfirmarOrdenComponent implements OnInit {

  idCarrito!: string;
  carritoCompra!: CarritoDTO;
  orden!: CrearOrdenDTO;
  detallesOrden: DetalleOrdenDTO[] = [];

  codigoCupon: string = '';
  totalPagado: number = 0;
  descuentoAplicable: number = 0;
  totalFinal: number = 0;
  preciosItem = new Map<string, number>(); // Map para almacenar los precios de los eventos por idEvento

    // Definir el mapa de nombres de eventos
    nombresEventos = new  Map<string, string> ();
    eventos!: EventoDTO[];
    idOrden!:string;

  constructor(
    private clienteService: ClienteService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private publicoService: PublicoService
  ) {}

  ngOnInit(): void {
    // Obtener el parámetro 'id' del carrito de la URL
    this.route.paramMap.subscribe(params => {
      this.idCarrito = params.get('id') || '';
      if (this.idCarrito) {
        this.obtenerCarrito();
      } else {
        console.error("Id de carrito no encontrado en la URL");
      }
    });
    this.publicoService.listarTodosEventos().subscribe({
      next: (data) => {
       // console.log(data);
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
  }
  public obtenerPrecioMap(item: DetalleCarritoDTO): number {
    // Verificar si ya tenemos el precio calculado para este ítem
    if (this.preciosItem.has(item.idEvento)) {
      return this.preciosItem.get(item.idEvento)! * item.cantidad;
    }
  
    // Llamar al servicio para obtener el evento y su precio
    this.publicoService.obtenerEvento(item.idEvento).subscribe({
      next: (data) => {
        const evento = data.respuesta as EventoDTO;
  
        // Encontrar la localidad correcta y su precio
        const localidad = evento.localidades.find(loc => loc.nombre === item.nombreLocalidad);
        if (localidad) {
          const precioTotal = localidad.precio * item.cantidad;
          this.preciosItem.set(item.idEvento, localidad.precio);
          //console.log(`Precio actualizado para el ítem con idEvento ${item.idEvento}:`, precioTotal);
        }
      },
      error: (error) => {
        console.error(`Error obteniendo el evento con idEvento ${item.idEvento}`, error);
      }
    });
  
    // Devolver 0 temporalmente hasta que se obtenga el precio
    return 0;
  }

  // Método para obtener los detalles del carrito
  public obtenerCarrito() {
    this.clienteService.traerCarritoId(this.idCarrito).subscribe({
      next: (data) => {
        this.carritoCompra = data.respuesta;
       // this.totalPagado = this.carritoCompra.precioTotal; // Asigna el total del carrito
        this.totalPagado = this.calcularTotalPagado(this.carritoCompra.items);
        this.totalFinal = this.totalPagado; // Inicia con el total pagado antes de aplicar el descuento
        this.detallesOrden = this.convertirItemsACrearOrden(this.carritoCompra.items); // Convierte los items a DetalleOrdenDTO
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
    // Método para calcular el total pagado basado en el precioUnitario de cada item
    public calcularTotalPagado(items: DetalleCarritoDTO[]): number {
      let totalPagado = 0;
    
      for (let item of items) {
        // Verifica si el precio está definido en el mapa, si no, usa 0 como valor predeterminado
        const precioUnitario = this.preciosItem.get(item.idEvento) ?? 0;
        const precioTotalItem = precioUnitario * item.cantidad;
        //console.log(item.cantidad, precioUnitario);

    
        totalPagado += parseFloat(precioTotalItem.toFixed(2));
      }
    
      return parseFloat(totalPagado.toFixed(2));
    }
    
    
    
    // Método para obtener el precio de un item basado en la cantidad y precio unitario
    public obtenerPrecio(item: DetalleCarritoDTO): number {
      if (this.preciosItem.has(item.idEvento)) {

        return this.preciosItem.get(item.idEvento)!;
      }
  
      // Si el precio no está almacenado, se calcula usando el precio unitario
      const precioTotalItem = item.precioUnitario * item.cantidad;
      this.preciosItem.set(item.idEvento, item.precioUnitario); // Almacena el precio para futuros usos
      this.obtenerEventoId(item.idEvento);
      return precioTotalItem;
    }
    public obtenerEventoId(idEvento: string) {
      // Verificar si el nombre del evento ya está en el mapa para evitar solicitudes duplicadas
      //console.log(idEvento);
      if (!this.nombresEventos.has(idEvento)) {
        this.publicoService.obtenerEvento(idEvento).subscribe({
          next: (data) => {
            // Guardar el nombre del evento en el mapa
            this.nombresEventos.set(idEvento, data.respuesta.nombre);
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    }
  

    private convertirItemsACrearOrden(items: DetalleCarritoDTO[]): DetalleOrdenDTO[] {
      const detallesOrden: DetalleOrdenDTO[] = [];
    
      for (let item of items) {
        const detalleOrden: DetalleOrdenDTO = {
          idDetalleOrden: item.idDetalleCarrito,
          idEvento: item.idEvento,
        
          precio: this.preciosItem.get(item.idEvento) ?? item.precioUnitario,
          nombreLocalidad: item.nombreLocalidad,
          cantidad: item.cantidad,
          sillasSeleccionadas: item.sillasSeleccionadas
        };
    
        //console.log(detalleOrden.nombreLocalidad,detalleOrden.idEvento)
        detallesOrden.push(detalleOrden);
      }
    
      return detallesOrden;
    }
    


  // Método para calcular el total final después de aplicar el descuento
  calcularTotalFinal() {
    this.totalFinal = this.totalPagado - this.descuentoAplicable;
  }

  // Método para crear la orden
 public crearOrden() {
  const idCliente = this.tokenService.getIDCuenta();

  this.orden = {
    idCliente: idCliente,
    codigoPasarela: 'CODIGO_PASARELA',
    total: Number(this.obtenerValorFinal()),
    items: this.detallesOrden,
    idCupon: this.codigoCupon || 'no hay'
  };

this.clienteService.crearOrden(this.orden).subscribe({
  next: (respuesta) => {
    if (!respuesta.error) {
      const res = String(respuesta.respuesta);
      alert("✅ Orden creada exitosamente");
      this.idOrden = String(res.split("-")[1]);
      const idLimpio = this.idOrden.replace("ID:", "").trim();
      this.idOrden = idLimpio;
      console.log("Orden creada con ID:", this.idOrden);
    } else {
      alert("❌ Error al crear la orden: " + respuesta.error);
    }
  },
  error: (error) => {
    console.error("❌ Error detallado:", error);

    // Verifica si el backend envía un mensaje específico
    if (error?.error?.respuesta) {
      alert("⚠️ Error del servidor: " + error.error.respuesta);
    } else if (error?.message) {
      alert("⚠️ Error de red: " + error.message);
    } else {
      alert("⚠️ Error desconocido al crear la orden.");
    }
  }
});


  
}


  public obtenerValorFinal():Number{
    return this.calcularTotalPagado(this.carritoCompra.items)-this.descuentoAplicable;
   }

  public confirmarPago() {
  if (!this.idOrden) {
    alert("Primero debes crear la orden antes de pagar.");
    return;
  }
  

  this.clienteService.realizarPago(this.idOrden).subscribe({
    next: (respuesta: MensajeDTO) => {
      if (!respuesta.error) {
        console.log("Redirigiendo a pasarela:", respuesta.respuesta);
        window.location.href = respuesta.respuesta.initPoint;
      } else {
        alert("Error al procesar el pago: " + respuesta.error);
      }
    },
    error: (error) => {
      alert("⚠️ Error al conectar con la pasarela de pago");
      console.error(error);
    }
  });
}

}
