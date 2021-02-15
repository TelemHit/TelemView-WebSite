import { Component, OnInit } from '@angular/core';
import { Organization } from 'src/app/_models/organization';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OrganizationForUpdate } from 'src/app/_models/OrganizationForUpdate';
import { GeneralDataService } from 'src/app/_services/generalData.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { OrganizationType } from 'src/app/_models/organizationType';
import { ModalComponent } from '../modal/modal.component';
import { ProductType } from 'src/app/_models/productType';
import { AlertifyService } from 'src/app/_services/alertify.service'
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-editor-organizations',
  templateUrl: './editor-organizations.component.html',
  styleUrls: ['./editor-organizations.component.css'],
})
export class EditorOrganizationsComponent implements OnInit {
  organizations: Organization[];
  bsModalRef: BsModalRef;
  newEntity: string;
  types: OrganizationType[];

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
      this.organizations = data.organizations;
      this.titleService.setTitle('Telem View - עריכת ארגונים');

    });
    this.generalService
      .getOrganizationTypes(this.authService.decodedToken.nameid)
      .subscribe((data: any) => {
        this.types = data;
      });
  }

  // add organization popup configurations
  addOrgModal() {
    const initialState = {
      input: true,
      label: 'שם הארגון:',
      placeHolder: 'שם הארגון',
      title: 'הוספת ארגון חדש',
      isOrganization: true,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.organizations.map((x) => x.title),
      orgTypes: this.types,
      orgTypes_label: 'סוגי ארגונים:',
      alreadyExists: 'הארגון כבר במערכת ולכן אין צורך להוסיפו',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.addOrganization();
      
    });
  }

  //get all organization types
  getOrgTypes() {
    this.generalService
      .getOrganizationTypes(this.authService.decodedToken.nameid)
      .subscribe((data) => {
        return data;
      });
  }

  // add new organization to db
  addOrganization() {
    this.spinner.show();
    const orgData: OrganizationForUpdate = {
      title: this.newEntity['name'],
      organizationTypes: this.newEntity['orgTypes'],
    };

    this.generalService
      .addOrganization(this.authService.decodedToken.nameid, orgData)
      .subscribe(
        (data: Organization) => {
          data.organizationTypes.forEach((o: OrganizationType) => {
                o.title=this.types.find(t => t.id == o['id']).title;
                o.counter= this.types.find(t => t.id == o['id']).counter;
                o.filteredCounter= this.types.find(t => t.id == o['id']).filteredCounter;
          });
          this.organizations.unshift(data);
          this.clear();
          this.alertify.success('הארגון נוסף בהצלחה');
        },
        (error) => {
          this.alertify.error('הייתה בעיה בשמירת הנתונים, יש לנסות שנית');
          this.clear();
        }
      );
  }

  //clear variables
  clear() {
    this.newEntity = null;
    this.spinner.hide();
  }

  //open update modal
  updateOrgModal(org) {
    const initialState = {
      input: true,
      label: 'שם הארגון:',
      placeHolder: 'שם הארגון',
      title: 'הוספת ארגון חדש',
      text: org.title,
      isOrganization: true,
      isEdit: true,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.organizations.map((x) => x.title),
      orgTypes: this.types,
      orgCurrentTypes: org.organizationTypes,
      orgTypes_label: 'סוגי ארגונים:',
      alreadyExists: 'הארגון כבר במערכת ולכן אין צורך להוסיפו',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.updateOrg(org);
    });
  }

  //update after Approve
  updateOrg(org) {
    this.spinner.show();
    const orgData: OrganizationForUpdate = {
      title: this.newEntity['name'],
      organizationTypes: this.newEntity['orgTypes'],
    };

    if (
      this.newEntity['name'] !==
        this.organizations.find((o) => o.id == org.id).title ||
      this.checkOrgTypes(org, this.newEntity['orgTypes'])
    ) {
      this.generalService
        .updateOrganization(
          this.authService.decodedToken.nameid,
          org.id,
          orgData
        )
        .subscribe(
          (data: any) => {
            this.organizations.find((o) => o.id == org.id).title =
              orgData.title;
            this.organizations.find((o) => o.id == org.id).organizationTypes=[];
            let newTypes: OrganizationType[]=this.organizations.find((o) => o.id == org.id).organizationTypes;
            orgData.organizationTypes.forEach((o) => {
              newTypes.push(
                {
                  id: o['id'],
                  title: this.types.find(t => t.id == o['id']).title,
                  counter: this.types.find(t => t.id == o['id']).counter,
                  filteredCounter: this.types.find(t => t.id == o['id']).filteredCounter
                }
              )
            })
            
            this.clear();
            this.alertify.success('הארגון עודכן בהצלחה');
          },
          (error) => {
            this.alertify.error('הייתה בעיה בשמירת הנתונים, יש לנסות שנית');
            this.clear();
          }
        );
    } else {
      this.clear();
      this.bsModalRef.hide();
    }
  }

  //check if organization types updated
  checkOrgTypes(org, newTypes) {
    const oldTypes: OrganizationType[] = this.organizations.find(
      (o) => o.id == org.id
    ).organizationTypes;
    if (oldTypes.length != newTypes.length){
      return true;
    } 
    for (let i = 0; i < oldTypes.length; i++) {
      let match = false;
      for (let n = 0; n < newTypes.length; n++) {
        if (oldTypes[i].id == newTypes[n].id) {
          match = true;
        }
      }
      if (!match) {
        return true;
      }
    }
    return false;
  }

    //open delete modal
  deleteOrg(id: number, title: string) {
    const initialState = {
      title: 'מחיקת ארגון',
      eId: id,
      eTitle: title,
      alert: 'האם ברצונך למחוק את הארגון: ',
    };
    this.bsModalRef = this.modalService.show(AlertModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'לא';
    this.bsModalRef.content.approveBtnName = 'כן';

    this.bsModalRef.content.confirm.subscribe((res) => {
      if (res.data === true) {
        this.finalDeleteOrg(id);
      }
    });
  }

  //delete after Approve
  finalDeleteOrg(id: number) {
    this.generalService
      .deleteOrganization(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.organizations = this.organizations.filter((p) => p.id !== id);
        this.bsModalRef.hide();
        this.alertify.success('הארגון נמחק בהצלחה');
      }, 
      (error) => {
        this.bsModalRef.hide();
        this.alertify.error('הייתה בעיה במחיקת הארגון');
      });
  }

}
