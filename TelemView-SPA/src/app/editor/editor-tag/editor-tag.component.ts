//Tags list in the editor

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
import { Tag } from 'src/app/_models/Tag';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-editor-tag',
  templateUrl: './editor-tag.component.html',
  styleUrls: ['./editor-tag.component.css']
})
export class EditorTagComponent implements OnInit {

  tags: Tag[];
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
      this.tags = data.tags;
      this.titleService.setTitle('Telem View - עריכת תגיות');
    });
  }
  //open delete modal
  deleteTag(id, title) {
    const initialState = {
      title: 'מחיקת תגית',
      eId: id,
      eTitle: title,
      alert: 'האם ברצונך למחוק את התגית: ',
    };
    this.bsModalRef = this.modalService.show(AlertModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'לא';
    this.bsModalRef.content.approveBtnName = 'כן';

    this.bsModalRef.content.confirm.subscribe((res) => {
      if (res.data === true) {
        this.finalDeleteTag(id);
      }
    });
  }
 //delete after Approve
  finalDeleteTag(id: number) {
    this.generalService
      .deleteTag(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.tags = this.tags.filter((p) => p.id !== id);
        this.bsModalRef.hide();
        this.alertify.success('התגית נמחקה בהצלחה')
      }, (error) => {
        this.bsModalRef.hide();
        this.alertify.error('הייתה בעיה במחיקת התגית')
      });
  }
//open add modal
  addTagModal() {
    const initialState = {
      input: false,
      label: 'תגית:',
      placeHolder: 'תגית',
      title: 'הוספת תגית חדשה',
      isOrganization: false,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.tags.map(pt => pt.title),
      alreadyExists: 'התגית כבר במערכת ולכן אין צורך להוסיפה',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.addTag();
    });
  }
  //add after Approve
  addTag() {
    this.spinner.show();
    this.data.title = this.newEntity['name'];
    this.generalService
      .addTag(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.tags.unshift(data);
          this.clear();
          this.bsModalRef.hide();
          this.alertify.success('התגית נוספה בהצלחה')

        },
        (error) => {
          this.bsModalRef.content.failMessage =
            'הייתה בעיה בשמירת הנתונים, יש לנסות שנית';
            this.clear();
        }
      );
  }
//open update modal
  updateTagModal(tag) {
    const initialState = {
      input: false,
      label: 'תגית:',
      text: tag.title,
      placeHolder: 'תגית',
      title: 'עריכת תגית',
      isOrganization: false,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.tags.map(pt => pt.title),
      alreadyExists: 'התגית כבר במערכת',
      isEdit: true
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.updateTag(tag);
    });
  }
  //update after Approve
  updateTag(tag) {
    this.spinner.show();
    this.data.title = this.newEntity['name'];
    this.data.id = tag.id;
    
    if(this.newEntity['name'] !== this.tags.find(pt => pt.id == tag.id).title){
      this.generalService.updateTag(this.authService.decodedToken.nameid,tag.id, this.data)
      .subscribe(
        (data: any) => {
          this.tags.find(pt => pt.id == tag.id).title=this.data.title;
          this.clear();
          this.bsModalRef.hide();
          this.alertify.success('התגית עודכנה בהצלחה')

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
//clear variables
  clear(){
    this.data={};
    this.newEntity = null;
    this.spinner.hide();
  }

}
