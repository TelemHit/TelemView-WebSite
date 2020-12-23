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

@Component({
  selector: 'app-editor-types',
  templateUrl: './editor-types.component.html',
  styleUrls: ['./editor-types.component.css'],
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
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.productTypes = data.productTypes;
      console.log(data.productTypes);
    });
  }

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
      console.log(res.data);
      if (res.data === true) {
        this.finalDeletept(id);
        this.bsModalRef.hide();
      }
    });
  }

  finalDeletept(id: number) {
    this.generalService
      .deleteProductType(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.productTypes = this.productTypes.filter((p) => p.id !== id);
      });
  }

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
  addPt() {
    this.spinner.show();
    this.data.title = this.newEntity['name'];
    this.generalService
      .addProductType(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.productTypes.unshift(data);
          this.clear();
          this.bsModalRef.hide();
        },
        (error) => {
          this.bsModalRef.content.failMessage =
            'הייתה בעיה בשמירת הנתונים, יש לנסות שנית';
            this.clear();
        }
      );
  }

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
          this.bsModalRef.hide();
        },
        (error) => {
          this.bsModalRef.content.failMessage =
            'הייתה בעיה בשמירת הנתונים, יש לנסות שנית';
          this.clear();
        });
    } else{
      this.clear();
      this.bsModalRef.hide();
    }
  }

  clear(){
    this.data={};
    this.newEntity = null;
    this.spinner.hide();
  }
}
