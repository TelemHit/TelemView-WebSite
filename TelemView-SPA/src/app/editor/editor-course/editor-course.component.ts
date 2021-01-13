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
import { Course } from 'src/app/_models/Course';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-editor-course',
  templateUrl: './editor-course.component.html',
  styleUrls: ['./editor-course.component.css']
})
export class EditorCourseComponent implements OnInit {

  courses: Course[];
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
      this.courses = data.courses;
      this.titleService.setTitle('Telem View - עריכת קורסים');
    });
  }

  deleteCourse(id, title) {
    const initialState = {
      title: 'מחיקת קורס',
      eId: id,
      eTitle: title,
      alert: 'האם ברצונך למחוק את הקורס: ',
    };
    this.bsModalRef = this.modalService.show(AlertModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'לא';
    this.bsModalRef.content.approveBtnName = 'כן';

    this.bsModalRef.content.confirm.subscribe((res) => {
      if (res.data === true) {
        this.finalDeleteCourse(id);
      }
    });
  }

  finalDeleteCourse(id: number) {
    this.generalService
      .deleteCourse(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.courses = this.courses.filter((p) => p.id !== id);
        this.bsModalRef.hide();
        this.alertify.success('הקורס נמחק בהצלחה');
      }, (error) => {
        this.bsModalRef.hide();
        this.alertify.error('הייתה בעיה במחיקת הקורס');
      });
  }

  addCourseModal() {
    const initialState = {
      input: false,
      input_2: true,
      label_2: 'מספר הקורס:',
      placeHolder_2: 'מספר הקורס',
      label: 'קורס:',
      placeHolder: 'קורס',
      title: 'הוספת קורס חדש',
      isOrganization: false,
      isNumberNeeded: true,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.courses.map(pt => pt.title),
      alreadyExists: 'הקורס כבר במערכת ולכן אין צורך להוסיפו',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.addCourse();
    });
  }
  addCourse() {
    this.spinner.show();
    this.data.title = this.newEntity['name'];
    this.data.number = this.newEntity['number'];
    this.generalService
      .AddCourse(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.courses.unshift(data);
          this.clear();
          this.bsModalRef.hide();
          this.alertify.success('הקורס נוסף בהצלחה');
        },
        (error) => {
          this.bsModalRef.content.failMessage =
            'הייתה בעיה בשמירת הנתונים, יש לנסות שנית';
            this.clear();
        }
      );
  }

  updateCourseModal(course) {
    const initialState = {
      input: false,
      input_2: true,
      label_2: 'מספר הקורס:',
      placeHolder_2: 'מספר הקורס',
      label: 'קורס:',
      placeHolder: 'קורס',
      isEdit: true,
      title: 'הוספת קורס חדש',
      isOrganization: false,
      isNumberNeeded: true,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.courses.map(pt => pt.title),
      alreadyExists: 'הקורס כבר במערכת ולכן אין צורך להוסיפו',
      text: course.title,
      courseNumber: course.number
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.updateCourse(course);
    });
  }
  updateCourse(course) {
    this.spinner.show();
    this.data.title = this.newEntity['name'];
    this.data.number = this.newEntity['number'];
    this.data.id = course.id;
    
    if(this.newEntity['name'] !== this.courses.find(pt => pt.id == course.id).title
    || this.newEntity['number'] !== this.courses.find(pt => pt.id == course.id).number
    ){
      this.generalService.updateCourse(this.authService.decodedToken.nameid,course.id, this.data)
      .subscribe(
        (data: any) => {
          this.courses.find(pt => pt.id == course.id).title=this.data.title;
          this.courses.find(pt => pt.id == course.id).number=this.data.number;
          this.clear();
          this.bsModalRef.hide();
          this.alertify.success('הקורס עודכן בהצלחה');
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


