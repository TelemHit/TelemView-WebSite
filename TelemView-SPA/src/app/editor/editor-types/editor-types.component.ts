//Types list in the editor
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductTypesResolver } from 'src/app/_resolvers/product-types.resolver';
import { ProductType } from 'src/app/_models/productType';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GeneralDataService } from 'src/app/_services/generalData.service';
import { AuthService } from 'src/app/_services/auth.service';
import { ModalComponent } from '../modal/modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralData } from 'src/app/_models/generalData';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Title } from '@angular/platform-browser';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-editor-types',
  templateUrl: './editor-types.component.html',
  styleUrls: ['./editor-types.component.css'],
  animations: [
    trigger('Fading', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', animate('400ms ease-out')),
      transition(':leave', animate('400ms ease-in')),
    ])
  ]
})
export class EditorTypesComponent implements OnInit {
  productTypes: ProductType[];
  bsModalRef: BsModalRef;
  newEntity: string;
  data: GeneralData = {};

  constructor(
    private generalService: GeneralDataService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService,
    private titleService:Title
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.productTypes = data.productTypes;
      this.titleService.setTitle('Telem View - עריכת סוגי תוצרים');

    });
  }
  //open delete modal
  deletePT(id, title) {
    const initialState = {
      title: 'מחיקת סוג תוצר',
      eId: id,
      eTitle: title,
      alert: 'האם ברצונך למחוק את סוג התוצר: ',
    };
    this.bsModalRef = this.modalService.show(AlertModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'לא';
    this.bsModalRef.content.approveBtnName = 'כן';

    this.bsModalRef.content.confirm.subscribe((res) => {
      if (res.data === true) {
        this.finalDeletept(id);
        
      }
    });
  }
  //delete after Approve
  finalDeletept(id: number) {
    this.generalService
      .deleteProductType(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.bsModalRef.hide();
        this.productTypes = this.productTypes.filter((p) => p.id !== id);
        this.alertify.success('סוג התוצר נמחק בהצלחה');
      },
      (error) => {
        this.bsModalRef.hide();
        this.alertify.error('הייתה בעיה במחיקת סוג התוצר');
      });
  }

  //open add modal
  addPtModal() {
    const initialState = {
      input: false,
      label: 'סוג התוצר:',
      placeHolder: 'סוג התוצר',
      title: 'הוספת סוג תוצר חדש',
      isOrganization: false,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.productTypes.map(pt => pt.title),
      alreadyExists: 'סוג התוצר כבר במערכת ולכן אין צורך להוסיפו',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.addPt();
    });
  }
    //add after Approve
  addPt() {
    this.spinner.show();
    this.data.title = this.newEntity['name'];
    this.generalService
      .addProductType(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.productTypes.unshift(data);
          this.clear();
          this.alertify.success('סוג התוצר נוסף בהצלחה');
        },
        (error) => {
          this.alertify.error('הייתה בעיה בשמירת הנתונים, יש לנסות שנית');
            this.clear();
        }
      );
  }
  //open update modal
  updatePtModal(type) {
    const initialState = {
      input: false,
      label: 'סוג התוצר:',
      text: type.title,
      placeHolder: 'סוג התוצר',
      title: 'עריכת סוג תוצר',
      isOrganization: false,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.productTypes.map(pt => pt.title),
      alreadyExists: 'סוג התוצר כבר במערכת',
      isEdit: true
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.updatePt(type);
    });
  }
    //update after Approve
  updatePt(type) {
    this.spinner.show();
    this.data.title = this.newEntity['name'];
    this.data.id = type.id;
    
    if(this.newEntity['name'] !== this.productTypes.find(pt => pt.id == type.id).title){
      this.generalService.updateProductType(this.authService.decodedToken.nameid,type.id, this.data)
      .subscribe(
        (data: any) => {
          this.productTypes.find(pt => pt.id == type.id).title=this.data.title;
          this.clear();
          this.alertify.success('סוג התוצר עודכן בהצלחה');
        },
        (error) => {
          this.alertify.error('הייתה בעיה בשמירת הנתונים, יש לנסות שנית');
          this.clear();
        });
    } else{
      this.clear();
      this.bsModalRef.hide();
    }
  }
  //clear variables
  clear(){
    this.data={};
    this.newEntity = null;
    this.spinner.hide();
  }
}
