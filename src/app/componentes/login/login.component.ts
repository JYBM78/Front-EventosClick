import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { LoginDTO } from '../../dto/login-dto';
import Swal from 'sweetalert2';
import { TokenService } from '../../servicios/token.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],  // Importa ReactiveFormsModule y CommonModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;


  constructor(private formBuilder: FormBuilder, private authService: AuthService,private tokenService: TokenService) {
    
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
   
  
