import { Component, OnInit } from '@angular/core';
import { OrganizationType } from 'src/app/_models/organizationType';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralDataService } from 'src/app/_services/generalData.service';
import { GeneralData } from 'src/app/_models/generalData';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-editor-organization-types',
  templateUrl: './editor-organization-types.component.html',
  styleUrls: ['./editor-organization-types.component.css']
})
export class EditorOrganizationTypesComponent implements OnInit {

  organizationTypes: OrganizationType[];
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
      this.organizationTypes = data.organizations;
      console.log(this.organizationTypes);
    });
  }

  deleteOT(id, title) {
    const initialState = {
      title: 'מחיקת סוג ארגון',
      eId: id,
      eTitle: title,
      alert: 'האם ברצונך למחוק את סוג הארגון: ',
    };
    this.bsModalRef = this.modalService.show(AlertModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'לא';
    this.bsModalRef.content.approveBtnName = 'כן';

    this.bsModalRef.content.confirm.subscribe((res) => {
      console.log(res.data);
      if (res.data === true) {
        this.finalDeleteOt(id);
        this.bsModalRef.hide();
      }
    });
  }

  finalDeleteOt(id: number) {
    this.generalService
      .deleteOrganizationTypes(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.organizationTypes = this.organizationTypes.filter((p) => p.id !== id);
      });
  }

  addOtModal() {
    const initialState = {
      input: false,
      label: 'סוג הארגון:',
      placeHolder: 'סוג הארגון',
      title: 'הוספת סוג ארגון חדש',
      isOrganization: false,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.organizationTypes.map(pt => pt.title),
      alreadyExists: 'סוג הארגון כבר במערכת ולכן אין צורך להוסיפו',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.addOt();
    });
  }
  addOt() {
    this.spinner.show();
    this.data.title = this.newEntity['name'];
    this.generalService
      .addOrganizationTypes(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.organizationTypes.unshift(data);
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

  updateOtModal(type) {
    const initialState = {
      input: false,
      label: 'סוג הארגון:',
      text: type.title,
      placeHolder: 'סוג הארגון',
      title: 'עריכת סוג ארגון',
      isOrganization: false,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.organizationTypes.map(pt => pt.title),
      alreadyExists: 'סוג הארגון כבר במערכת',
      isEdit: true
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.updateOt(type);
    });
  }
  updateOt(type) {
    this.spinner.show();
    this.data.title = this.newEntity['name'];
    this.data.id = type.id;
    
    if(this.newEntity['name'] !== this.organizationTypes.find(pt => pt.id == type.id).title){
      this.generalService.updateOrganizationTypes(this.authService.decodedToken.nameid,type.id, this.data)
      .subscribe(
        (data: any) => {
          this.organizationTypes.find(pt => pt.id == type.id).title=this.data.title;
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
