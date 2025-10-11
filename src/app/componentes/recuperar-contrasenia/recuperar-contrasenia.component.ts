import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PublicoService } from '../../servicios/publico.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasenia',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule, CommonModule],
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrl: './recuperar-contrasenia.component.css'
})
export class RecuperarContraseniaComponent {

  recuperarContraseniaForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private publicService: PublicoService, private router: Router) {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.recuperarContraseniaForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],  // Validación para email
    });
  }

  public validar() {
    if (this.recuperarContraseniaForm.valid) {
      const correo = this.recuperarContraseniaForm.get('email')?.value;
      this.publicService.enviarCodigoActivacion(correo).subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Código Enviado',
            text: 'Se ha enviado un código para reestablecer tu contraseña',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            if (result.isConfirmed){
              this.router.navigate(['/nueva-contrasenia']);
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
    
    localStorage.setItem('emailRecuperacion', this.recuperarContraseniaForm.value.email);

  
  }


}
