import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicoService } from '../../servicios/publico.service';
import { Router } from '@angular/router';
import { CambiarPasswordDTO } from '../../dto/cambiar-contrasenia-dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nueva-contrasenia',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './nueva-contrasenia.component.html',
  styleUrl: './nueva-contrasenia.component.css'
})
export class NuevaContraseniaComponent {

  nuevaContraseniaForm !: FormGroup;

  constructor(private formBuilder: FormBuilder, private publicoService: PublicoService, private router: Router) { 
    this.crearFormulario();
  }


  private crearFormulario() {
    this.nuevaContraseniaForm = this.formBuilder.group(
      {
        codigoVerificacion: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
        passwordNueva: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
        confirmarContrasena: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]] 
  
    },
    { validators: this.passwordsMatchValidator } as AbstractControlOptions
  );
  }

  public cambiarContrasenia() {
    if (this.nuevaContraseniaForm.valid) {
      const correo = localStorage.getItem('emailRecuperacion');
      const cambiarContrasenia = {...this.nuevaContraseniaForm.value, correo} as CambiarPasswordDTO
    
      this.publicoService.cambiarPassword(cambiarContrasenia).subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Cambio de Contraseña',
            text: 'Contraseña cambiada.',
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

  passwordsMatchValidator(nuevaContraseniaForm: FormGroup) {
    const passwordNueva = nuevaContraseniaForm.get('passwordNueva')?.value;
    const confirmarContrasena = nuevaContraseniaForm.get('confirmarContrasena')?.value;
   
    // Si las contraseñas no coinciden, devuelve un error, de lo contrario, null
    return passwordNueva == confirmarContrasena ? null : { passwordsMismatch: true };
   }

}
