import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivarCuentaDTO } from '../../dto/activar-cuenta-dto';
import { PublicoService } from '../../servicios/publico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activar-cuenta',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './activar-cuenta.component.html',
  styleUrl: './activar-cuenta.component.css'
})
export class ActivarCuentaComponent {

  formulario!: FormGroup;

  constructor(private formBuilder: FormBuilder, private publicService: PublicoService, private router: Router) {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', [Validators.required]],
      accion: [false]
    });
  }

  activarCuenta() {
    if (this.formulario) {
      const activarCuenta = this.formulario.value as ActivarCuentaDTO;
      // Llamar al servicio para activar cuenta
      this.publicService.activarCuenta(activarCuenta).subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Cuenta activa',
            text: 'La cuenta se ha activado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            if (result.isConfirmed){
              this.router.navigate(['/login']);
            }
          })
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
        }
      });
    } else {
      console.error('Formulario no inicializado');
    }
  }
  
  reenviarCodigo() {
    if (this.formulario) {
      const correo = this.formulario.get('email')?.value ;
      // Llamar al servicio para reenviar código
      this.publicService.reenviarCodigoActivacion(correo).subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Código reenviado',
            text: 'El código ha sido reenviado a su correo electrónico',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
        }
      });
    } else {
      console.error('Formulario no inicializado');
    }
  }

}
