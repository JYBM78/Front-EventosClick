import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { LoginDTO } from '../../dto/login-dto';
import Swal from 'sweetalert2';
import { TokenService } from '../../servicios/token.service';
import { RouterModule } from '@angular/router';
import { NgxCaptchaModule } from 'ngx-captcha';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule,NgxCaptchaModule],  // Importa ReactiveFormsModule y CommonModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;
  captchaValido!: Boolean;
token: string | null = null;
siteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

onCaptchaSuccess(token: string) {
  this.http.post<any>('https://eventosclick.onrender.com/api/general/validate', { token }).subscribe({
    next: (data) => {
      // data tiene la estructura { error: false, respuesta: true/false }
      const isValid = data.respuesta;
      this.captchaValido = isValid;
      console.log('¿Captcha válido?:', isValid);

      if (isValid) {
        console.log(' Validación exitosa: El reCAPTCHA se verificó correctamente');
      } else {
        console.log(' Validación fallida: El reCAPTCHA no es válido, intenta nuevamente.');
      }
    },
    error: (error) => {
      console.error(' Error al validar el reCAPTCHA:', error);
      console.error('Detalle del error:', error.error?.respuesta || 'No se pudo verificar el reCAPTCHA');
    }
  });
}



onCaptchaExpired() {
  this.captchaValido = false;
  this.token = null;
  console.log('Captcha expiró');
}
onCaptchaError(error: any) {
    console.error('Error en captcha:', error);
  }



  constructor(private formBuilder: FormBuilder, private authService: AuthService,private tokenService: TokenService,private http: HttpClient ) {
    
    this.crearFormulario();
    
  }

  private crearFormulario() {
    this.loginForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],  // Validación para email
      password: ['', [Validators.required, Validators.minLength(5)]]  // Validación para contraseña
    });
  }

  public login() {
   
  
    const loginDTO = this.loginForm.value as LoginDTO;
    console.log(loginDTO);
  
    this.authService.iniciarSesion(loginDTO).subscribe({
      next: (data) => {
        this.tokenService.login(data.respuesta.token);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.respuesta
        });
      },
    });
  }
  
   
   
   }
   
  
