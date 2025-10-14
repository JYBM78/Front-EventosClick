import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CambiarPasswordDTO } from '../../dto/cambiar-contrasenia-dto';
import { PublicoService } from '../../servicios/publico.service';

@Component({
  selector: 'app-cambiar-contrasenia',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule],  // IMPORTACIÓN NECESARIA AQUÍ
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.css']
})
export class CambiarContraseniaComponent implements OnInit {
  cambioContraseniaForm!: FormGroup;
  codigoCuenta!: string;
  emailCuenta!: string;

  constructor(
    private formBuilder: FormBuilder,
    private publicoService: PublicoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
    // Inicializa el formulario
    this.cambioContraseniaForm = this.formBuilder.group({
      nombreUsuario: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      codigoVerificacion: ['', Validators.required],
      contraseniaAnterior: ['', Validators.required],
      nuevaContrasenia: ['', Validators.required],
      confirmarNuevaContrasenia: ['', Validators.required]
    });

    // Cargar el código de cuenta de la URL
    this.route.paramMap.subscribe(params => {
      this.codigoCuenta = params.get('id') || '';
      if (this.codigoCuenta) {
        this.obtenerCuenta();
      } else {
        console.error("Código de cuenta no encontrado en la URL");
      }
    });
  }

  public obtenerIdCuenta():String{
      return this.codigoCuenta;
  }

  

  inactivarCuenta(): void {
        Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Deseas inactivar tu cuenta? Esta acción no se puede deshacer.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, inactivar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.publicoService.inactivarCuenta(this.codigoCuenta).subscribe({
              next: () => {
                Swal.fire('Cuenta Inactivada', 'Tu cuenta ha sido inactivada exitosamente.', 'success');
              },
              error: (error) => {
                Swal.fire('Error', 'Hubo un problema al inactivar la cuenta.', 'error');
                console.error(error);
              },
            });
          }
        });
      }
      
  obtenerCuenta() {
    this.publicoService.obtenerCuenta(this.codigoCuenta).subscribe({
      next: (data) => {
        if (data && data.respuesta) {
          this.cambioContraseniaForm.patchValue({
            nombreUsuario: data.respuesta.nombre,
            email: data.respuesta.correo
            
          });
          this.emailCuenta= data.respuesta.correo;
        } else {
          Swal.fire('¡Error!', 'No se pudo cargar la cuenta.', 'error');
        }
      },
      error: () => {
        Swal.fire('¡Error!', 'No se pudo cargar la cuenta.', 'error');
      }
    });
  }

  obtenerCodigoVerificacion() {
    const email = this.cambioContraseniaForm.get('email')?.value;
    this.publicoService.enviarCodigoActivacion(email).subscribe({
      next: () => {
        Swal.fire('Código enviado', 'El código de verificación ha sido enviado a su email.', 'success');
      },
      error: () => {
        Swal.fire('¡Error!', 'Ocurrió un error al enviar el código.', 'error');
      }
    });
  }

  guardar() {
    const nuevaContrasenia = this.cambioContraseniaForm.get('nuevaContrasenia')?.value;
    const confirmarNuevaContrasenia = this.cambioContraseniaForm.get('confirmarNuevaContrasenia')?.value;

    if (nuevaContrasenia !== confirmarNuevaContrasenia) {
      Swal.fire('Error', 'La nueva contraseña y la confirmación no coinciden.', 'error');
      return;
    }

    const cambio: CambiarPasswordDTO = {
      correo: this.emailCuenta,
      codigoVerificacion: this.cambioContraseniaForm.get('codigoVerificacion')?.value,
      passwordNueva: nuevaContrasenia
    };
    console.log(cambio.correo);

    this.publicoService.cambiarPassword(cambio).subscribe({
      next: () => {
        this.cambioContraseniaForm.patchValue({
              contraseniaAnterior: null,
              nuevaContrasenia: null,
              confirmarNuevaContrasenia:null
            });
        Swal.fire('Éxito', 'La contraseña ha sido cambiada exitosamente.', 'success');
      },
      error: () => {
        Swal.fire('¡Error!', 'Ocurrió un error al cambiar la contraseña.', 'error');
      }
    });
  }

  volver() {
    Swal.fire('Redirigiendo', 'Volviendo a la página anterior.', 'info');
  }
}
