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
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.tags = data.tags;
      console.log(this.tags);
    });
  }

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
      console.log(res.data);
      if (res.data === true) {
        this.finalDeleteTag(id);
        this.bsModalRef.hide();
      }
    });
  }

  finalDeleteTag(id: number) {
    this.generalService
      .deleteTag(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.tags = this.tags.filter((p) => p.id !== id);
      });
  }

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
        },
        (error) => {
          this.bsModalRef.content.failMessage =
            'הייתה בעיה בשמירת הנתונים, יש לנסות שנית';
            this.clear();
        }
      );
  }

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
