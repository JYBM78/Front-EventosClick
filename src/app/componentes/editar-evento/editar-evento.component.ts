import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { EditarEventoDTO } from '../../dto/editar-evento-dto';
import { PublicoService } from '../../servicios/publico.service';
import { AdministradorService } from '../../servicios/administrador.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-editar-evento',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.css']
})
export class EditarEventoComponent implements OnInit {
  estados: string[] = [];

  codigoEvento!: string;
  crearEventoForm!: FormGroup;
  tiposDeEvento: string[] = [];
  ciudades: string[] = [];
  imagenPortada?: File;
  imagenLocalidades?: File;
  evento!: EditarEventoDTO;
  eventoEditado!: EditarEventoDTO;


  constructor(
    private formBuilder: FormBuilder,
    private publicoService: PublicoService,
    private adminService: AdministradorService,
    private route: ActivatedRoute
  ) {
    this.crearFormulario();
    this.tiposDeEvento = ['Concierto', 'Fiesta', 'Teatro', 'Deportes'];
    this.ciudades = ['Armenia', 'Cartagena', 'Pereira', 'Cali'];
  }

  

  private crearFormulario() {
    this.crearEventoForm = this.formBuilder.group({
      id: [''],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      localidades: this.formBuilder.array([]),
      fechaEvento: ['', Validators.required],
      imagenPortada: ['', Validators.required],
      imagenLocalidades: ['', Validators.required]
      
      
    });
  }

  

  
  public obtenerEvento() {
    this.adminService.obtenerEvento(this.codigoEvento).subscribe({
      next: (data) => {
        if (data && data.respuesta) {
          const evento = data.respuesta;
          const fechaEvento = evento.fechaEvento
            ? new Date(evento.fechaEvento).toISOString().split('T')[0]
            : '';

            this.crearEventoForm.patchValue({
              id: evento.id,
              nombre: evento.nombre,
              descripcion: evento.descripcion,
              tipo: evento.tipo,
              ciudad: evento.ciudad,
              fechaEvento: evento.fechaEvento,
              imagenLocalidades: evento.imagenLocalidades,
              imagenPortada: evento.imagenPortada
            });

          this.localidades.clear();
          evento.localidades.forEach((localidad: any) => {
            this.localidades.push(this.formBuilder.group({
              nombre: [localidad.nombre, Validators.required],
              precio: [localidad.precio, [Validators.required, Validators.pattern("^[0-9]*$")]],
              capacidadMaxima: [localidad.capacidadMaxima, [Validators.required, Validators.pattern("^[0-9]*$")]]
            }));
          });
        } else {
          Swal.fire('¡Error!', 'No se pudo cargar el evento.', 'error');
        }
      },
      error: () => {
        Swal.fire('¡Error!', 'No se pudo cargar el evento.', 'error');
      }
    });
  }


 

 
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.codigoEvento = params.get('id') || '';
      if (this.codigoEvento) {
        this.obtenerEvento();
      } else {
        console.error("Código de evento no encontrado en la URL");
      }
    });
    this.listarCiudades();
    this.listarTipos();
  }
  

  public editarEvento() {
    if (this.crearEventoForm.valid) {

      console.log(this.crearEventoForm.value);
      const eventoData = this.crearEventoForm.value;

      this.adminService.actualizarEvento(eventoData).subscribe({
        next: (data: { respuesta: any }) => {
          Swal.fire('¡Éxito!', 'El evento ha sido actualizado.', 'success');
          this.crearEventoForm.reset();
        },
        error: (error: { error: { respuesta: string | undefined } }) => {
          Swal.fire('¡Error!', error.error.respuesta || 'Error al actualizar el evento', 'error');
        }
      });
    } else {
      Swal.fire('¡Error!', 'Por favor, complete todos los campos requeridos.', 'error');
    }
  }

  public onFileChange(event: any, tipo: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      tipo == 'localidades' ? (this.imagenLocalidades = file) : (this.imagenPortada = file);
    }
   }
   
  
  get localidades(): FormArray {
    return this.crearEventoForm.get('localidades') as FormArray;
  }
  agregarLocalidad() {
    const localidadFormGroup = this.formBuilder.group({
      nombre: ['', Validators.required],
      precio: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      capacidadMaxima: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
    });
    this.localidades.push(localidadFormGroup);
  }
  
  eliminarLocalidad(indice: number) {
    this.localidades.removeAt(indice);
  }
  
  public listarTipos(){
    this.publicoService.listarTipos().subscribe({
      next: (data) => {
        this.tiposDeEvento = data.respuesta;
      },
      error: (error) => {
        console.error(error);
      },
    });
   }
   
   public listarCiudades(){
    this.publicoService.listarCiudades().subscribe({
      next: (data) => {
        this.ciudades = data.respuesta;
      },
      error: (error) => {
        console.error(error);
      },
    });
   }
   
   public subirImagen(tipo:string){
    const formData = new FormData();
    const imagen = tipo == 'portada' ? this.imagenPortada : this.imagenLocalidades;
    const formControl = tipo == 'portada' ? 'imagenPortada' : 'imagenLocalidades';
   
   
    formData.append('imagen', imagen!);
  
    this.adminService.subirImagen(formData).subscribe({
      next: (data: { respuesta: any; }) => {
        this.crearEventoForm.get(formControl)?.setValue(data.respuesta);
        Swal.fire("Exito!", "Se ha subido la imagen.", "success");
      },
      error: (error: { error: { respuesta: string | undefined; }; }) => {
        Swal.fire("Error!", error.error.respuesta, "error");
      }
    });
   
   
   }
  
   
   
  }
  