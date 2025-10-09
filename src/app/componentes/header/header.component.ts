import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../servicios/token.service';
import { EditarCuentaDTO } from '../../dto/editar-cuenta-dto';


@Component({
 selector: 'app-header',
 standalone: true,
 imports: [RouterModule],
 templateUrl: './header.component.html',
 styleUrl: './header.component.css'
})
export class HeaderComponent {
 title = 'EventosClick';
 isLogged = false;
 correo: string = "";
 IdCuenta: string = "";



 constructor(private tokenService: TokenService) {
   this.isLogged = this.tokenService.isLogged();
   if (this.isLogged) {
     this.correo = this.tokenService.getCorreo();
     this.IdCuenta = this.tokenService.getIDCuenta();
   }
 }


 public logout() {
   this.tokenService.logout();
 }



}

