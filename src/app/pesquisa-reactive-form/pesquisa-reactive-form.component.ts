import { AngularFirestore } from '@angular/fire/firestore';
import { PesquisaReactiveServiceService } from './pesquisa-reactive-service.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { PerguntasAspecTec } from '../pesquisa/perguntasAspecTec.model';
import { PerguntasRep } from '../pesquisa/perguntasRep.model';
import { PerguntasProd } from '../pesquisa/perguntasProd.model';
import { PerguntasComMark } from '../pesquisa/perguntasComMark.model';
import { PerguntasEmbTran } from '../pesquisa/perguntasEmbTran.model';
import { map } from 'rxjs/operators';
import { PerguntasFinais } from '../pesquisa/perguntasFinais.model';

export interface Respostas {
  pergunta?: string;
  respostaCorfio?: string;
  respostaOutros?: string;
}

export interface OptionsCorfio {
  otimo?: string;
  bom?: string;
  regular?: string;
  ruim?: string;
}

@Component({
  selector: 'app-pesquisa-reactive-form',
  templateUrl: './pesquisa-reactive-form.component.html',
  styleUrls: ['./pesquisa-reactive-form.component.css']
})
export class PesquisaReactiveFormComponent implements OnInit {

  respostas: Observable<Respostas[]>;
  respostaCorfio: any;
  fim = false;
  isLinear = false;


  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;

  perguntaFormAspTec: string;
  perguntaFormRep: string;
  perguntaFormImgProd: string;
  perguntaFormComMark: string;
  perguntaFormEmbTran: string;
  perguntaFormFim: string;

  perguntaAspecTec: Observable<PerguntasAspecTec[]>;
  perguntasRep: Observable<PerguntasRep[]>;
  perguntasImgProd: Observable<PerguntasProd[]>;
  perguntasComMark: Observable<PerguntasComMark[]>;
  perguntasEmbTran: Observable<PerguntasEmbTran[]>;
  perguntasFinais: Observable<PerguntasFinais[]>;

  cliente: any;
  user = this.pesqReactService.getUser();
  getRetornoResp: any;
  contaRespostas = 0;
  realCount: any;

  perguntaEspAssTec = 'Assistência Técnica';
  perguntaEspAtendComFab = 'Atendimento do setor comercial na fábrica';
  perguntaEspRep = 'Freqüência de visitas do representante atende a necessidade ?';
  perguntaProduto = 'Quais produtos que sua empresa nos compra:';

  constructor(private formBuilder: FormBuilder,
              private pesqReactService: PesquisaReactiveServiceService,
              private db: AngularFirestore
              ) { }

  ngOnInit() {

    this.getRespostas();
    this.clientesCNPJ();

    this.firstFormGroup = this.formBuilder.group({
      pergunta: [''],
      respostaCorfio: [''],
      respostaOutros: ['']
    });
    this.secondFormGroup = this.formBuilder.group({
      pergunta: [''],
      respostaCorfio: [''],
      respostaOutros: ['']
    });
    this.thirdFormGroup = this.formBuilder.group({
      pergunta: [''],
      respostaCorfio: [''],
      respostaOutros: ['']
    });
    this.fourthFormGroup = this.formBuilder.group({
      pergunta: [''],
      respostaCorfio: [''],
      respostaOutros: ['']
    });
    this.fifthFormGroup = this.formBuilder.group({
      pergunta: [''],
      respostaCorfio: [''],
      respostaOutros: ['']
    });

    this.sixthFormGroup = this.formBuilder.group({
      pergunta: [''],
      respostaMotivo: [''],
      observacao: ['']
    });


    this.perguntaAspecTec = this.db.collection('perguntasAspecTec')
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          pergunta: doc.payload.doc.data()['pergunta']
        };
      });
    }));

    this.perguntasRep = this.db.collection('perguntasRep')
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          pergunta: doc.payload.doc.data()['pergunta']
        };
      });
    }));

    this.perguntasImgProd = this.db.collection('perguntasProd')
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          pergunta: doc.payload.doc.data()['pergunta']
        };
      });
    }));

    this.perguntasComMark = this.db.collection('perguntasComMark')
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          pergunta: doc.payload.doc.data()['pergunta']
        };
      });
    }));

    this.perguntasEmbTran = this.db.collection('perguntasEmbTran')
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          pergunta: doc.payload.doc.data()['pergunta']
        };
      });
    }));

    this.perguntasFinais = this.db.collection('perguntasFinais')
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          pergunta: doc.payload.doc.data()['pergunta']
        };
      });
    }));

    this.db.doc(this.user + '/' + 'fim').valueChanges().subscribe(
      doc => {
        if ( doc['fim'] === true ) {
          this.fim = true;
        }
      }
    );

  } // END ONINIT

  resetForms() {
    return this.firstFormGroup.reset(), this.secondFormGroup.reset(),
           this.thirdFormGroup.reset(), this.fourthFormGroup.reset();
  }


  clientesCNPJ() {
    //console.log("clientesCNPJv2"+"/"+this.user+"2020@corfio.com");
    this.db.doc( 'clientesCNPJv4' + '/' + this.user + '@corfio.com').valueChanges().subscribe(
      doc => this.cliente = doc['nome']
    );
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  saveRespAspecTec(perguntaForm) {
    this.perguntaFormAspTec = perguntaForm;
    let pergunta = this.perguntaFormAspTec;
    let respostaCorfio = this.firstFormGroup.get('respostaCorfio').value;
    let respostaOutros = this.firstFormGroup.get('respostaOutros').value;
    this.pesqReactService.addRespAspTec(pergunta, {respostaCorfio, respostaOutros});
  }

  saveRespRep(perguntaForm) {
    this.perguntaFormRep = perguntaForm;
    let pergunta = this.perguntaFormRep;
    let respostaCorfio = this.secondFormGroup.get('respostaCorfio').value;
    let respostaOutros = this.secondFormGroup.get('respostaOutros').value;
    this.pesqReactService.addRespRep(pergunta, {respostaCorfio, respostaOutros});
  }

  saveRespImgProd(perguntaForm) {
    this.perguntaFormImgProd = perguntaForm;
    let pergunta = this.perguntaFormImgProd;
    let respostaCorfio = this.thirdFormGroup.get('respostaCorfio').value;
    let respostaOutros = this.thirdFormGroup.get('respostaOutros').value;
    this.pesqReactService.addRespImgProd(pergunta, {respostaCorfio, respostaOutros});
  }

  saveRespComMark(perguntaForm) {
    this.perguntaFormComMark = perguntaForm;
    let pergunta = this.perguntaFormComMark;
    let respostaCorfio = this.fourthFormGroup.get('respostaCorfio').value;
    let respostaOutros = this.fourthFormGroup.get('respostaOutros').value;
    this.pesqReactService.addRespComMark(pergunta, {respostaCorfio, respostaOutros});
  }

  saveRespEmbTran(perguntaForm) {
    this.perguntaFormEmbTran = perguntaForm;
    let pergunta = this.perguntaFormEmbTran;
    let respostaCorfio = this.fifthFormGroup.get('respostaCorfio').value;
    let respostaOutros = this.fifthFormGroup.get('respostaOutros').value;
    this.pesqReactService.addRespEmbTran(pergunta, {respostaCorfio, respostaOutros});
  }

  saveRespFinais(perguntaForm) {
    this.perguntaFormFim = perguntaForm;
    let pergunta = this.perguntaFormFim;
    let resposta = this.sixthFormGroup.get('respostaMotivo').value;
    let observacao = this.sixthFormGroup.get('observacao').value;
    this.pesqReactService.addRespFinais(pergunta, {resposta, observacao});
    this.pesqReactService.openSnackBarSaved(pergunta);
  }

  limpaObs() {
    return this.sixthFormGroup.get('observacao').setValue('');
  }

  theEnd(fimStatus) {
    if (this.contaRespostas >= 27)  {
      this.fim = true;
      let fim = this.fim;
      //console.log("setting fim to "+this.fim);
      this.db.collection(this.user).doc('fim').set({fim});
      alert( 'Pesquisa concluida com sucesso, muito obrigado!' );
    } else {
      alert( 'Sua pesquisa ainda não foi concluida, por favor responda todas as perguntas.' );
    }
  }

  getRespostas() {
    //console.log(this.user+" getRespostas()");
    this.db.collection(this.user)
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          ...doc.payload.doc.data()
        };
      });
    }))
    .subscribe( from => {
      this.getRetornoResp = from;
      this.contaRespostas = from.length;
      return this.getRetornoResp;
    });

    /*this.db.firestore.collection(this.user).doc('fim').get()
    .then((docSnapshot) => {
      if (!docSnapshot.exists) {
          console.log("didn't exist, setting to "+this.fim);
          let fim = this.fim;
          this.db.doc(this.user+'/'+'fim').set({fim});
      } else {
        console.log("existed");
      }
    });*/
  }

}
