import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { CrearEventoComponent } from './componentes/crear-evento/crear-evento.component';
import { CarritoComponent } from './componentes/carrito/carrito.component';


import { ConfirmarOrdenComponent } from './componentes/confirmar-orden/confirmar-orden.component';
import { DetalleEventoComponent } from './componentes/detalle-evento/detalle-evento.component';
import { RecuperarContraseniaComponent } from './componentes/recuperar-contrasenia/recuperar-contrasenia.component';
import { GestionEventosComponent } from './componentes/gestion-eventos/gestion-eventos.component';

import { LoginGuard } from './guards/permiso.service';
import { RolesGuard } from './guards/roles.service';
import { EditarEventoComponent } from './componentes/editar-evento/editar-evento.component';
import { EditarCuentaComponent } from './componentes/editar-cuenta/editar-cuenta.component';
import { ObtenerCuentaComponent } from './componentes/obtener-cuenta/obtener-cuenta.component';
import { ActivarCuentaComponent } from './componentes/activar-cuenta/activar-cuenta.component';
import { NuevaContraseniaComponent } from './componentes/nueva-contrasenia/nueva-contrasenia.component';
import { CambiarContraseniaOlvidadaComponent } from './componentes/cambiar-contrasenia-olvidada/cambiar-contrasenia-olvidada.component';
import { CambiarContraseniaComponent } from './componentes/cambiar-contrasenia/cambiar-contrasenia.component';



export const routes: Routes = [
    { path: '', component: InicioComponent },  // Ruta raíz
   // { path: 'pago-exitoso',component: PagoExitosoComponent },
  //{ path: 'pago-fallido',component: PagoFallidoComponent },
  //{ path: 'pago-pendiente',component: PagoPendienteComponent },
  { path: 'cambiar-contrasenia/:id', component: CambiarContraseniaComponent },
  { path: 'confirmar-orden/:id', component: ConfirmarOrdenComponent },
   { path: "gestion-eventos", component: GestionEventosComponent,canActivate: [RolesGuard], data: { expectedRole: ["ADMINISTRADOR"] } },
   { path: 'crear-evento', component: CrearEventoComponent,canActivate: [RolesGuard], data: { expectedRole: ["ADMINISTRADOR"] } },  // Ruta para crear evento
   { path: 'detalle-evento/:id', component: DetalleEventoComponent },
   { path: 'carrito', component: CarritoComponent },  // Ruta para el carrito de compras

   { path: 'editar-evento/:id', component: EditarEventoComponent ,canActivate: [RolesGuard], data: { expectedRole: ["ADMINISTRADOR"] } },
  // { path: 'editar-cuenta/:id', component: EditarCuentaComponent  },
   { path: 'editar-cuenta/:id', component: EditarCuentaComponent ,canActivate: [RolesGuard], data: { expectedRole: ["CLIENTE"] } },
   { path: 'obtener-info-cuenta/:id', component: ObtenerCuentaComponent  },
   { path: 'confirmar-orden', component: ConfirmarOrdenComponent },  // Ruta para confirmar orden
   { path: 'recuperar-contrasenia', component: RecuperarContraseniaComponent },  // Ruta para recuperar contraseña
   //{ path: 'historial-compras/:id', component: HistorialComprasComponent },  // Ruta para historial contraseña
   { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
   { path: 'registro', component: RegistroComponent, canActivate: [LoginGuard] },
   { path: 'activar-cuenta', component: ActivarCuentaComponent, },
   { path: 'nueva-contrasenia', component: NuevaContraseniaComponent }, //ruta para cambiar contrasenia sin estar logueado, por ¿Olvidaste tu Contrasenia?
   { path: 'crear-evento', component: CrearEventoComponent, canActivate: [RolesGuard], data: { expectedRole: ["ADMINISTRADOR"] } },
   { path: "gestion-eventos", component: GestionEventosComponent, canActivate: [RolesGuard], data: { expectedRole: ["ADMINISTRADOR"] } },

   { path: "**", pathMatch: "full", redirectTo: "" }  // Redirección a la página de inicio para rutas no encontradas

];
