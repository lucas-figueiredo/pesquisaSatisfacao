import { RespostasClass } from './respostas.model';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

export interface User {
    id: string;
    respostaCorfio: string;
    respostaOutros: string;
}

@Component({
  selector: 'app-user-respostas',
  templateUrl: './user-respostas.component.html',
  styleUrls: ['./user-respostas.component.css']
})
export class UserRespostasComponent implements OnInit {
  private usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

constructor( private db: AngularFirestore ) {

}

usersCnpj = [
'830600120001392020'
];

  currentUser: any;
  respostasUsers: any[] = [];
  respostasUsersGeral: any;

  ngOnInit() {
    console.log("enter");
    this.consultaUserResp();

  }


  consultateste() {
    this.db.collection('respostasgeral')
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          pergunta: doc.payload.doc.data()['from'],
          ...doc.payload.doc.data()
        };
      });
    }))
    .subscribe( from => {
      console.log('resposta geral data');
      console.log(from);
      this.respostasUsersGeral = from;

    });
  }

  consultaUserResp() {
    this.usersCnpj.forEach(element => {
      console.log(element);
      this.usersCollection = this.db.collection(element);
      this.users = this.usersCollection.snapshotChanges()
      .pipe(map(array => {
        return array.map(doc => {
          return {
            id: doc.payload.doc.id,
            respostaCorfio: doc.payload.doc.data()['respostaCorfio'],
            respostaOutros: doc.payload.doc.data()['respostaOutros']
          };
        });
      }));
    });
  }

  loopUsers(user) {
    this.db.collection(user)
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          respostaCorfio: doc.payload.doc.data()['respostaCorfio'],
          respostaOutros: doc.payload.doc.data()['respostaOutros']
        };
      });
    }));
  }

  consultaGravaRespostasAuto(user) {
    this.db.collection(user)
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          respostas: doc.payload.doc.data()
        };
      });
    }))
    .subscribe( from => {
      this.currentUser = user;
      this.respostasUsers = from;
      // console.log( user );
      console.log( from );
      //  this.db.collection('respostasgeral').doc(user).set( {from} );
    });
    // this.db.collection('respostasgeral').add(user);

  }


  respostasGeral() {
    this.db.collection('respostasgeral')
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          pergunta: doc.payload.doc.data()['from'],
          ...doc.payload.doc.data()
        };
      });
    }))
    .subscribe( from => {
      console.log('resposta geral data');
      console.log(from);
      this.respostasUsersGeral = from;

    });
  }

}
