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
import { Lecturer } from 'src/app/_models/lecturer';

@Component({
  selector: 'app-editor-lecturer',
  templateUrl: './editor-lecturer.component.html',
  styleUrls: ['./editor-lecturer.component.css']
})
export class EditorLecturerComponent implements OnInit {

  lecturers: Lecturer[];
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
      this.lecturers = data.lecturers;
      console.log(this.lecturers);
    });
  }

  deleteLecturer(id, title) {
    const initialState = {
      title: 'מחיקת מרצה',
      eId: id,
      eTitle: title,
      alert: 'האם ברצונך למחוק את המרצה: ',
    };
    this.bsModalRef = this.modalService.show(AlertModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'לא';
    this.bsModalRef.content.approveBtnName = 'כן';

    this.bsModalRef.content.confirm.subscribe((res) => {
      console.log(res.data);
      if (res.data === true) {
        this.finalDeleteLecturer(id);
        this.bsModalRef.hide();
      }
    });
  }

  finalDeleteLecturer(id: number) {
    this.generalService
      .deleteLecturer(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.lecturers = this.lecturers.filter((p) => p.id !== id);
      });
  }

  addLecturerModal() {
    const initialState = {
      input: false,
      label: 'מרצה:',
      placeHolder: 'מרצה',
      title: 'הוספת מרצה חדש/ה',
      isOrganization: false,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.lecturers.map(pt => pt.name),
      alreadyExists: 'המרצה כבר במערכת ולכן אין צורך להוסיפו/ה',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.addLecturer();
    });
  }
  addLecturer() {
    this.spinner.show();
    this.data.name = this.newEntity['name'];
    this.generalService
      .addLecturer(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.lecturers.unshift(data);
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

  updateLecturerModal(lect) {
    const initialState = {
      input: false,
      label: 'מרצה:',
      text: lect.name,
      placeHolder: 'מרצה',
      title: 'עריכת מרצה',
      isOrganization: false,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.lecturers.map(pt => pt.name),
      alreadyExists: 'המרצה כבר במערכת',
      isEdit: true
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.updateLecturer(lect);
    });
  }

  updateLecturer(lect) {
    this.spinner.show();
    this.data.name = this.newEntity['name'];
    this.data.id = lect.id;
    
    if(this.newEntity['name'] !== this.lecturers.find(pt => pt.id == lect.id).name){
      this.generalService.updateLecturer(this.authService.decodedToken.nameid,lect.id, this.data)
      .subscribe(
        (data: any) => {
          this.lecturers.find(pt => pt.id == lect.id).name=this.data.name;
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
