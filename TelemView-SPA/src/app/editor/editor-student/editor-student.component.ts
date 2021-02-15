//Students list in the editor

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
import { Student } from 'src/app/_models/Student';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-editor-student',
  templateUrl: './editor-student.component.html',
  styleUrls: ['./editor-student.component.css']
})
export class EditorStudentComponent implements OnInit {

  students: Student[];
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
      this.students = data.students;
      this.titleService.setTitle('Telem View - עריכת סטודנטים');

    });
  }
  //open delete modal
  deleteStudent(id, title) {
    const initialState = {
      title: 'מחיקת סטודנט/ית',
      eId: id,
      eTitle: title,
      alert: 'האם ברצונך למחוק את הסטודנט/ית: ',
    };
    this.bsModalRef = this.modalService.show(AlertModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'לא';
    this.bsModalRef.content.approveBtnName = 'כן';

    this.bsModalRef.content.confirm.subscribe((res) => {
      if (res.data === true) {
        this.finalDeleteStudent(id);
        
      }
    });
  }
  //delete after Approve
  finalDeleteStudent(id: number) {
    this.generalService
      .deleteStudent(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.students = this.students.filter((p) => p.id !== id);
        this.bsModalRef.hide();
        this.alertify.success('הסטודנט/ית נמחק/ה בהצלחה');
      }, (error) => {
        this.bsModalRef.hide();
        this.alertify.error('הייתה בעיה במחיקת הסטודנט/ית');
      });
  }
  //open add modal
  addStudentModal() {
    const initialState = {
      input: false,
      label: 'סטודנט/ית:',
      placeHolder: 'סטודנט/ית',
      title: 'הוספת סטודנט/ית חדש/ה',
      isOrganization: false,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.students.map(pt => pt.name),
      alreadyExists: 'הסטודנט/ית כבר במערכת ולכן אין צורך להוסיפו/ה',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.addStudent();
    });
  }
    //add after Approve
  addStudent() {
    this.spinner.show();
    this.data.name = this.newEntity['name'];
    this.generalService
      .addStudent(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.students.unshift(data);
          this.clear();
          this.alertify.success('הסטודנט/ית נוסף/ה בהצלחה');
        },
        (error) => {
          this.alertify.error('הייתה בעיה בשמירת הנתונים, יש לנסות שנית');
            this.clear();
        }
      );
  }
  //open update modal
  updateStudentModal(student) {
    const initialState = {
      input: false,
      label: 'סטודנט/ית:',
      text: student.name,
      placeHolder: 'סטודנט/ית',
      title: 'עריכת סטודנט/ית',
      isOrganization: false,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.students.map(pt => pt.name),
      alreadyExists: 'הסטודנט/ית כבר במערכת',
      isEdit: true
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.updateStudent(student);
    });
  }
  //update after Approve
  updateStudent(student) {
    this.spinner.show();
    this.data.name = this.newEntity['name'];
    this.data.id = student.id;
    
    if(this.newEntity['name'] !== this.students.find(pt => pt.id == student.id).name){
      this.generalService.updateStudent(this.authService.decodedToken.nameid,student.id, this.data)
      .subscribe(
        (data: any) => {
          this.students.find(pt => pt.id == student.id).name=this.data.name;
          this.clear();
          this.alertify.success('הסטודנט/ית עודכן/ה בהצלחה');

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
