import { Component } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../servicios/auth.service';
import { CrearCuentaDTO } from '../../dto/crear-cuenta-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  registroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.crearFormulario();
  }

  private crearFormulario(): void {
    this.registroForm = this.fb.group(
      {
        cedula: ['', Validators.required],
        nombre: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
        direccion: [''],
        telefono: [''],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmaPassword: ['', Validators.required],
        terminos: [false] // 👈 ya no usa Validators.requiredTrue
      },
      { validators: [this.passwordsMatchValidator] }
    );
  }

  private passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmaPassword = formGroup.get('confirmaPassword')?.value;
    return password === confirmaPassword ? null : { passwordsMismatch: true };
  }

  public registrar(): void {
    // 1️⃣ Verificar si el checkbox está marcado
    if (!this.registroForm.get('terminos')?.value) {
      Swal.fire({
        title: 'Debes aceptar los términos',
        text: 'Por favor acepta los términos y condiciones para continuar.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    // 2️⃣ Verificar si el formulario es válido
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos requeridos.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    // 3️⃣ Enviar datos al backend
    const crearCuenta = this.registroForm.value as CrearCuentaDTO;

    this.authService.crearCuenta(crearCuenta).subscribe({
      next: () => {
        Swal.fire({
          title: 'Cuenta creada',
          text: 'La cuenta se ha creado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/activar-cuenta']);
          }
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error?.respuesta || 'Ocurrió un error al crear la cuenta.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
