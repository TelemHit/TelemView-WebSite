//Tasks list in the editor
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
import { Task } from 'src/app/_models/task';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-editor-tasks',
  templateUrl: './editor-tasks.component.html',
  styleUrls: ['./editor-tasks.component.css'],
})
export class EditorTasksComponent implements OnInit {
  Tasks: Task[];
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
      this.Tasks = data.tasks;
      this.titleService.setTitle('Telem View - עריכת משימות');

    });
  }
  //open delete modal
  deleteTask(id, title) {
    const initialState = {
      title: 'מחיקת משימה',
      eId: id,
      eTitle: title,
      alert: 'האם ברצונך למחוק את המשימה: ',
    };
    this.bsModalRef = this.modalService.show(AlertModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'לא';
    this.bsModalRef.content.approveBtnName = 'כן';

    this.bsModalRef.content.confirm.subscribe((res) => {
      if (res.data === true) {
        this.finalDeleteTask(id);
        
      }
    });
  }
 //delete after Approve
  finalDeleteTask(id: number) {
    this.generalService
      .deleteTask(this.authService.decodedToken.nameid, id)
      .subscribe(() => {
        this.Tasks = this.Tasks.filter((p) => p.id !== id);
        this.bsModalRef.hide();
        this.alertify.success('המשימה נמחקה בהצלחה')
      }, (error) => {
        this.bsModalRef.hide();
        this.alertify.error('הייתה בעיה במחיקת המשימה')
      });
  }
 //open add modal
  addTaskModal() {
    const initialState = {
      input: false,
      label: 'משימה:',
      placeHolder: 'משימה',
      title: 'הוספת משימה חדשה',
      isOrganization: false,
      isTask: true,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.Tasks.map((pt) => pt.title),
      alreadyExists: 'המשימה כבר במערכת ולכן אין צורך להוסיפה',
      descriptin_label: 'תיאור:',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.addTask();
    });
  }
   //add after Approve
  addTask() {
    this.spinner.show();
    this.data.title = this.newEntity['name'];
    this.data.description = this.newEntity['description'];
    this.generalService
      .addTask(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.Tasks.unshift(data);
          this.clear();
          this.bsModalRef.hide();
          this.alertify.success('המשימה נוספה בהצלחה')

        },
        (error) => {
          this.bsModalRef.content.failMessage =
            'הייתה בעיה בשמירת הנתונים, יש לנסות שנית';
            this.clear();
        }
      );
  }
//open update modal
  updateTaskModal(task) {
    const initialState = {
      input: false,
      label: 'משימה:',
      text: task.title,
      placeHolder: 'משימה',
      title: 'עריכת משימה',
      isOrganization: false,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.Tasks.map((pt) => pt.title),
      alreadyExists: 'המשימה כבר במערכת',
      isTask: true,
      isEdit: true,
      description: task.description,
      descriptin_label: 'תיאור:',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.updateTask(task);
    });
  }
//update after Approve
  updateTask(task) {
    this.spinner.show();
    this.data.title = this.newEntity['name'];
    this.data.description = this.newEntity['description'];
    this.data.id = task.id;
    if (
      this.newEntity['name'] !==
        this.Tasks.find((pt) => pt.id == task.id).title ||
      this.newEntity['description'] !==
        this.Tasks.find((pt) => pt.id == task.id).description
    ) {
      this.generalService
        .updateTask(this.authService.decodedToken.nameid, task.id, this.data)
        .subscribe(
          (data: any) => {
            this.Tasks.find((pt) => pt.id == task.id).title = this.data.title;
            this.Tasks.find(
              (pt) => pt.id == task.id
            ).description = this.data.description;
            this.clear();
            this.bsModalRef.hide();
            this.alertify.success('המשימה עודכנה בהצלחה')
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
//clear variables
  clear() {
    this.data = {};
    this.newEntity = null;
    this.spinner.hide();
  }
}
