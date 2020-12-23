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
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.students = data.students;
      console.log(this.students);
    });
  }

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
      console.log(res.data);
      if (res.data === true) {
        this.finalDeleteStudent(id);
        this.bsModalRef.hide();
      }
    });
  }

  finalDeleteStudent(id: number) {
    this.generalService
      .deleteStudent(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.students = this.students.filter((p) => p.id !== id);
      });
  }

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
  addStudent() {
    this.spinner.show();
    this.data.name = this.newEntity['name'];
    this.generalService
      .addStudent(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.students.unshift(data);
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
