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

@Component({
  selector: 'app-editor-organizations',
  templateUrl: './editor-organizations.component.html',
  styleUrls: ['./editor-organizations.component.css'],
})
export class EditorOrganizationsComponent implements OnInit {
  organizations: Organization[];
  bsModalRef: BsModalRef;
  newEntity: string;
  types: ProductType[];

  constructor(
    private generalService: GeneralDataService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.organizations = data.organizations;
      console.log(this.organizations);
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

  getOrgTypes() {
    this.generalService
      .getOrganizationTypes(this.authService.decodedToken.nameid)
      .subscribe((data) => {
        console.log(data);
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
          this.organizations.unshift(data);
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

  clear() {
    this.newEntity = null;
    this.spinner.hide();
  }

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

  updateOrg(org) {
    this.spinner.show();
    const orgData: OrganizationForUpdate = {
      title: this.newEntity['name'],
      organizationTypes: this.newEntity['orgTypes'],
    };
    console.log(this.checkOrgTypes(org, this.newEntity['orgTypes']));
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
              console.log(o['id']);
              newTypes.push(
                {
                  id: o['id'],
                  title: this.types.find(t => t.id == o['id']).title,
                  counter: this.types.find(t => t.id == o['id']).counter
                }
              )
            })
            
            this.clear();
            this.bsModalRef.hide();
          },
          (error) => {
            this.bsModalRef.content.failMessage =
              'הייתה בעיה בשמירת הנתונים, יש לנסות שנית';
            this.clear();
          }
        );
    } else {
      this.clear();
      this.bsModalRef.hide();
    }
  }

  checkOrgTypes(org, newTypes) {
    const oldTypes: OrganizationType[] = this.organizations.find(
      (o) => o.id == org.id
    ).organizationTypes;
    if (oldTypes.length != newTypes.length) return true;
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
      console.log(res.data);
      if (res.data === true) {
        this.finalDeleteOrg(id);
        this.bsModalRef.hide();
      }
    });
  }

  finalDeleteOrg(id: number) {
    this.generalService
      .deleteOrganization(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.organizations = this.organizations.filter((p) => p.id !== id);
      });
  }
}
