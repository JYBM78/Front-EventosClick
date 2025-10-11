
import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import Swal from 'sweetalert2';
import { CrearCuentaDTO } from '../../dto/crear-cuenta-dto';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EditarCuentaDTO } from '../../dto/editar-cuenta-dto';
import { AdministradorService } from '../../servicios/administrador.service';
import { PublicoService } from '../../servicios/publico.service';
import { InformacionCuentaDTO } from '../../dto/informacion-cuenta-dto';
@Component({
  selector: 'app-editar-cuenta',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './editar-cuenta.component.html',
  styleUrl: './editar-cuenta.component.css'
})
export class EditarCuentaComponent {
  codigoCuenta!: string;
  cuenta !: InformacionCuentaDTO ;
  cuponEditado!: EditarCuentaDTO;

 editarCuentaForm!: FormGroup;

 constructor( private formBuilder: FormBuilder,private PublicoService: PublicoService,private route: ActivatedRoute){
  
  this.crearFormulario();
  

}

 private crearFormulario() {
  this.editarCuentaForm = this.formBuilder.group(
    {
    id:['', [Validators.required]],
    cedula: [{ value: '', disabled: true }, Validators.required],
    nombre: ['', Validators.required],
    correo: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    direccion: ['', Validators.required],
    telefono: ['', Validators.required]
    

  },
  { validators: this.passwordsMatchValidator } as AbstractControlOptions
);
}


 
 

passwordsMatchValidator(formGroup: FormGroup) {
  const password = formGroup.get('password')?.value;
  const confirmaPassword = formGroup.get('confirmaPassword')?.value;
 
 
  // Si las contraseñas no coinciden, devuelve un error, de lo contrario, null
  return password == confirmaPassword ? null : { passwordsMismatch: true };
 }
 
//cupon////////////////////////////////////////////////////////////////////////////////////////////////////////



public obtenerCuenta() {
  // console.log("cupon", String(this.cupon.tipo) );
   this.PublicoService.obtenerCuenta(this.codigoCuenta).subscribe({
     next: (data) => {
       // Verifica que la respuesta tenga el formato correcto antes de continuar
       if (data && data.respuesta) {
         this.cuenta = data.respuesta;
 
         // Asegúrate de que la fecha esté en formato yyyy-MM-dd
         // Asegúrate de que la fecha esté en formato yyyy-MM-dd

         // Llenar el formulario con los datos del cupón
         this.editarCuentaForm.patchValue({
         id: this.cuenta.id,
         cedula: this.cuenta.cedula,
         nombre: this.cuenta.nombre,
         correo: this.cuenta.correo,
         direccion: this.cuenta.direccion,
         telefono: this.cuenta.telefono
         });
       } else {
         console.error('La respuesta no tiene el formato esperado:', data);
         Swal.fire('¡Error!', 'No se pudo cargar el cupón.', 'error');
       }
     },
     error: (error) => {
       console.error('Error al obtener los datos del cupón:', error);
       Swal.fire('¡Error!', 'No se pudo cargar el cupón.', 'error');
     },
   });
 }



ngOnInit(): void {
  // Obtener el parámetro 'codigo' de la URL
  this.route.paramMap.subscribe(params => {
    this.codigoCuenta = params.get('id') || '';
    if (this.codigoCuenta) {
      this.obtenerCuenta();
      
    } else {
      console.error("Código de cupón no encontrado en la URL");
    }
    //console.log('Código del cupón:', this.codigoCuenta);
    // Aquí puedes llamar un servicio para cargar los detalles del cupón usando el 'codigoCupon'
  });
}
public editarCuenta(): void {
  if (this.editarCuentaForm.valid) {
    // Construir el objeto EditarCuentaDTO solo con los campos necesarios
    const cuentaData: EditarCuentaDTO = {
      id: this.editarCuentaForm.get('id')?.value,
      nombre: this.editarCuentaForm.get('nombre')?.value,
      telefono: this.editarCuentaForm.get('telefono')?.value,
      direccion: this.editarCuentaForm.get('direccion')?.value // Este campo es opcional
    };
    console.log(cuentaData);

    this.PublicoService.actualizarCuenta(cuentaData).subscribe({
      next: (data) => {
        Swal.fire('¡Éxito!', 'Se ha actualizado la cuenta.', 'success');
        console.log(data);
        //this.editarCuentaForm.reset(); // Limpiar el formulario tras actualizar la cuenta
      },
      error: (error) => {
        Swal.fire('¡Error!', 'Ocurrió un error al actualizar la cuenta.', 'error');
        console.log(error);

      }
    });
}





}
}

