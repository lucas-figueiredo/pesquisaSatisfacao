import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { AuthData } from './auth.data.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor( private router: Router, private afAuth: AngularFireAuth, private snackBar: MatSnackBar, private db: AngularFirestore) {}

  login(authData: AuthData) {
    authData.usuario = authData.usuario + '2020' + '@corfio.com';
    authData.senha = '1234567';
    this.afAuth.auth.signInWithEmailAndPassword(
      authData.usuario,
      authData.senha
    ).then(result => {
      this.authSuccess();
    }).catch(error => { console.log(error);
      if ( error.code === 'auth/network-request-failed' ) {
        this.snackBar.open('Erro: Conexão com internet nula ou limitada.', '[x]Fechar', {
          duration: 10000
        });
      } if (error.code === 'auth/user-not-found' ) {
        this.snackBar.open('Erro: CNPJ Inválido ou não cadastrado', '[x]Fechar', {
          duration: 5000
        });
      console.log( 'Cod erro: ' + error );
      }
      });
  }

  getUrl() {
    let url = document.URL;
    // use 45 for firebase and 28 for local test and 37 to pesquisa.corfio.com.br
    //  url = url.slice(45);
    //url = url.slice(28);
    url = url.slice(37);
    console.log(url);
    return url;
  }

  logOut() {
    this.isAuthenticated = false;
    this.authChange.next(false);
    this.router.navigate(['/']);

  }

  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccess() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/pesquisa']);
  }

}
