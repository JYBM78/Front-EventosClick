import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicoService } from '../../servicios/publico.service';
import { InformacionCuentaDTO } from '../../dto/informacion-cuenta-dto';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AdministradorService , } from '../../servicios/administrador.service';
import {  RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { EditarCuentaDTO } from '../../dto/editar-cuenta-dto';


@Component({
  selector: 'app-obtener-cuenta',
  imports: [RouterModule, ReactiveFormsModule,CommonModule],
  standalone: true,
  templateUrl: './obtener-cuenta.component.html',
  styleUrls: ['./obtener-cuenta.component.css']
})


export class ObtenerCuentaComponent implements OnInit {
  editarCuentaForm!: FormGroup<any>;
  cuenta!: InformacionCuentaDTO;
  codigoCuenta!: string;
  IdCuenta: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private publicoService: PublicoService,
    private adminService: AdministradorService,
    private route: ActivatedRoute
  ) {
    this.crearFormulario();
    

  }

  private crearFormulario() {
    this.editarCuentaForm = this.formBuilder.group(
      {
      //id: [''],
      cedula: [{ value: '', disabled: true },  [Validators.required]],
      nombre: ['', [Validators.required]],
      correo: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
      confirmaPassword: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]] 
  
    },
    { validators: this.passwordsMatchValidator } as AbstractControlOptions
  );
  }
  
  ngOnInit(): void {
    // Obtener el parámetro 'codigo' de la URL
    this.route.paramMap.subscribe(params => {
      this.codigoCuenta = params.get('id') || '';
      if (this.codigoCuenta) {
        this.obtenerCuenta();
        
      } else {
        console.error("Error");
      }
      ///console.log('Código del cupón:', this.codigoCuenta);
      // Aquí puedes llamar un servicio para cargar los detalles del cupón usando el 'codigoCupon'
    });
  }
  public obtenerIdCuenta():String{
      return this.codigoCuenta;
  }


  editarCuenta(): void {
    if (this.editarCuentaForm.valid) {
      const cuentaData: EditarCuentaDTO = {
      id: this.cuenta.id, // este valor debe venir del usuario logueado o un servicio
      nombre: this.editarCuentaForm.get('nombre')?.value,
      correo: this.editarCuentaForm.get('correo')?.value,
      telefono: this.editarCuentaForm.get('telefono')?.value,
      direccion: this.editarCuentaForm.get('direccion')?.value
    };
      this.publicoService.actualizarCuenta(cuentaData).subscribe({
        next: (data) => {
          Swal.fire('¡Éxito!', 'Se ha actualizado la cuenta.', 'success');
          this.obtenerCuenta();
          this.editarCuentaForm.patchValue({
              password: null,
              confirmaPassword: null
            });


        },
        error: (error) => {
          Swal.fire('¡Error!', 'Ocurrió un error al actualizar la cuenta.', 'error');
        }
      });
    } else {
      Swal.fire('¡Error!', 'Por favor, complete todos los campos requeridos.', 'error');
    }
  }

  // Validador personalizado para verificar si las contraseñas coinciden
  passwordsMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmaPassword = form.get('confirmaPassword')?.value;
    if (password && confirmaPassword && password !== confirmaPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  registrar(): void {
    if (this.editarCuentaForm.valid) {
      console.log('Registro exitoso:', this.editarCuentaForm.value);
    }
  }


   
    public obtenerCuenta() {
      // console.log("cupon", String(this.cupon.tipo) );
       this.publicoService.obtenerCuenta(this.codigoCuenta).subscribe({
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
             telefono: this.cuenta.telefono,
             boletas: this.cuenta.boletas
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
  }

