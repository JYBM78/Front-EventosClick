import { Component } from '@angular/core';
import { EventoDTO } from '../../dto/evento-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from '../../servicios/eventos.service';
import { PublicoService } from '../../servicios/publico.service';

import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { InformacionEventoDTO } from '../../dto/informacion-evento-dto';
import { DetalleCarritoDTO } from '../../dto/carrito/detalleCarrito-dto';
import { ClienteService } from '../../servicios/cliente.service';
import { TokenService } from '../../servicios/token.service';

@Component({
  selector: 'app-detalle-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css']
})
export class DetalleEventoComponent {
  codigoEvento: string = '';
  evento!: InformacionEventoDTO ;
  crearEventoForm!: FormGroup;
  localidades!: FormArray;
  itemCarritoDTO!: DetalleCarritoDTO;
  idCuenta!: any;



  constructor(
    private route: ActivatedRoute,
    private publicoService: PublicoService,
    private router: Router,
    private clienteService: ClienteService,
    private tokenService: TokenService
  ) {}

  generarID(): string {
    // Crea un ID único basado en la fecha actual y un número aleatorio
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

  comprarEntradas() {
    console.log('Entrando en el flujo de compra de entradas para el evento:', this.evento.id);
    
    // Recorre cada localidad en el evento y crea un DetalleCarritoDTO para cada una
    this.evento.localidades.forEach((localidad) => {
        const cantidad =  1;

        // Solo agregar al carrito si la cantidad es mayor a 0
        if (cantidad > 0) {
            const detalleCarrito: DetalleCarritoDTO = {
                idDetalleCarrito: this.generarID(), // Método para generar un ID único
                idEvento: this.evento.id,
                cantidad: cantidad,
                nombreLocalidad: localidad.nombre,
                precioUnitario: localidad.precio
            };
            
            // Añade el detalle al carrito (asumiendo que tienes un array itemCarritoDTO)
            this.clienteService.agregarItemCarritoUnico(this.idCuenta, detalleCarrito).subscribe({
              next: (data) => {
                if (data && data.respuesta) {
                  this.evento = data.respuesta;
                } else {
                  Swal.fire('¡Error!', 'No se pudo cargar el evento.', 'error');
                }
              },
              error: () => {
                Swal.fire('¡Error!', 'No se pudo cargar el evento.', 'error');
              }
            });
            //this.itemCarritoDTO.push(detalleCarrito);
        }
    });

    // Navegar a la página de compra
    this.router.navigate(['/carrito']);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const codigoEvento = params['id'];
      this.obtenerEventoId(codigoEvento);
    });
    this.idCuenta = this.tokenService.getIDCuenta();
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
      error: () => {
        Swal.fire('¡Error!', 'No se pudo cargar el evento.', 'error');
      }
    });
  }
}