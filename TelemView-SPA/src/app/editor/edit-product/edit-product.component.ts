import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Product } from 'src/app/_models/product';
import { ProductsService } from 'src/app/_services/products.service';
import { ActivatedRoute } from '@angular/router';
import {
  NgForm,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { DataForHome } from 'src/app/_models/dataForHome';
import { Media } from 'src/app/_models/media';
import { repeatWhen } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeneralDataService } from 'src/app/_services/generalData.service';
import { GeneralData } from 'src/app/_models/generalData';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalComponent } from 'src/app/editor/modal/modal.component';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Tag } from 'src/app/_models/Tag';
import { Student } from 'src/app/_models/Student';
import { Course } from 'src/app/_models/Course';
import { Lecturer } from 'src/app/_models/lecturer';
import { OrganizationForUpdate } from 'src/app/_models/OrganizationForUpdate';
import { LinkVideoModalComponent } from '../link-video-modal/link-video-modal.component';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  product: Product;
  generalData: DataForHome[];
  orgSelectedValue: number;
  selectedFiles: FileList;
  progressInfos = [];
  message = '';
  basicUrl = environment.imageslUrl;
  fileInfos: Observable<any>;
  fileUpload = false;
  data: GeneralData = {};
  year: Date;
  newEntity = '';
  bsModalRef: BsModalRef;
  bsConfig: Partial<BsDatepickerConfig>;
  studentAlertMessage: string;
  tagAlertMessage: string;
  courseAlertMessage: string;
  lecturerAlertMessage: string;
  productForm: FormGroup;
  quillCounter: number;

  @ViewChild('MediaUpload', { static: true }) mediaUpload: ElementRef;
  @ViewChild('EditForm', { static: true }) editForm: NgForm;


  public onAddedStudentFunc = this.beforeAddStudent.bind(this);
  public onAddedTagFunc = this.beforeAddTag.bind(this);
  public onAddedCourseFunc = this.beforeAddCourse.bind(this);
  public onAddedLecturerFunc = this.beforeAddLecturer.bind(this);
  

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private generalDataService: GeneralDataService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      data.product.media.forEach((media) => {
        if (media.type === 'video') {
          media.urlForShow = this.safeURL(media.url);
        }
      });
      this.product = data.product;
      this.generalData = data.dataforhome;
      this.year = new Date(this.product.yearOfCreation, 0);
      console.log(this.year);
    });

    //initialize form
    this.createProductForm();
    this.patch();
    console.log(this.productForm.controls.media);
    // datepicker configurations
    this.bsConfig = {
      containerClass: 'theme-green',
      dateInputFormat: 'YYYY',
      minMode: 'year',
      maxDate: new Date(),
    };
  }

  // Creating form
  createProductForm() {
    this.productForm = this.formBuilder.group(
      {
        title: [
          this.product.title,
          [
            Validators.minLength(2),
            Validators.maxLength(100),
            Validators.required,
          ],
        ],
        brief: [
          this.product.brief,
          [
            Validators.minLength(2),
            Validators.maxLength(100),
            Validators.required,
          ],
        ],
        taskId: [this.product.taskId, Validators.required],
        tags: [this.product.tags, Validators.required],
        description: [
          this.product.description,
          [
            Validators.minLength(2),
            Validators.required
          ],
        ],
        students: [this.product.students, Validators.required],
        organizationId: [this.product.organizationId, Validators.required],
        yearOfCreation: [this.year, Validators.required],
        degree: [this.product.degree, Validators.required],
        productTypeId: [this.product.productTypeId, Validators.required],
        productUrl: [this.product.productUrl, Validators.required],
        courses: [this.product.courses, Validators.required],
        lecturers: [this.product.lecturers, Validators.required],
        media: this.formBuilder.array([]),
      },
      { validator: this.isUrl }
    );
  }
  // Check if url
  isUrl(g: FormGroup) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      g.controls.productUrl.value
    )
      ? null
      : { notUrl: true };
  }

  // make url safe for angular
  safeURL(videoURL) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoURL);
  }

  // patch values to media control
  patch() {
    const control = this.productForm.get('media') as FormArray;
    this.product.media.forEach((x) => {
      control.push(
        this.patchValues(
          x.mDescription,
          x.id,
          x.isMain,
          x.status,
          x.type,
          x.url,
          x.urlForShow
        )
      );
    });
  }

  patchValues(mDescription, id, isMain, status, type, url, urlForShow) {
    return this.formBuilder.group({
      mDescription: [mDescription],
      id: [id],
      isMain: [isMain],
      status: [status],
      type: [type],
      url: [url],
      urlForShow: [urlForShow],
    });
  }

  // check students before add
  private beforeAddStudent(student: Student) {
    const studentToAdd = student.name
      ? student.name.trim()
      : student.toString().trim();
    if (studentToAdd) {
      if (this.generalData['students'].find((t) => t.name === studentToAdd)) {
        const newStudent = this.generalData['students'].find(
          (t) => t.name === studentToAdd
        );
        if (!this.productForm.controls.students.value.find((s) => s.id === newStudent.id)) {
          return of(newStudent);
        } else {
          this.studentAlertMessage = 'הסטודנט/ית כבר ברשימה';
          setTimeout(() => {
            this.studentAlertMessage = '';
          }, 3000);
        }
      } else {
        this.addStudentModal(studentToAdd);
      }
    }
  }

  // check tags before add
  private beforeAddTag(tag: Tag) {
    const tagToAdd = tag.title ? tag.title.trim() : tag.toString().trim();
    if (tagToAdd) {
      if (this.generalData['tags'].find((t) => t.title === tagToAdd)) {
        const newTag = this.generalData['tags'].find(
          (t) => t.title === tagToAdd
        );

        if (
          !this.productForm.controls.tags.value.find((s) => s.id === newTag.id)
        ) {
          return of(newTag);
        } else {
          this.tagAlertMessage = 'התגית כבר ברשימה';
          setTimeout(() => {
            this.tagAlertMessage = '';
          }, 3000);
        }
      } else {
        this.addTagModal(tagToAdd);
      }
    }
  }

  // check courses before add
  private beforeAddCourse(course: Course) {
    const courseToAdd = course.title
      ? course.title.trim()
      : course.toString().trim();
    if (courseToAdd) {
      if (this.generalData['courses'].find((c) => c.title === courseToAdd)) {
        const newCourse = this.generalData['courses'].find(
          (t) => t.title === courseToAdd
        );
        if (!this.productForm.controls.courses.value.find((s) => s.id === newCourse.id)) {
          return of(newCourse);
        } else {
          this.courseAlertMessage = 'הקורס כבר ברשימה';
          setTimeout(() => {
            this.courseAlertMessage = '';
          }, 3000);
        }
      } else {
        this.addCourseModal(courseToAdd);
      }
    }
  }

  // check lecturer before add
  private beforeAddLecturer(lecturer: Lecturer) {
    const lecturerToAdd = lecturer.name
      ? lecturer.name.trim()
      : lecturer.toString().trim();
    if (lecturerToAdd) {
      if (this.generalData['lecturers'].find((c) => c.name === lecturerToAdd)) {
        const newLecturer = this.generalData['lecturers'].find(
          (t) => t.name === lecturerToAdd
        );
        if (!this.productForm.controls.lecturers.value.find((s) => s.id === newLecturer.id)) {
          return of(newLecturer);
        } else {
          this.lecturerAlertMessage = 'המנחה כבר ברשימה';
          setTimeout(() => {
            this.lecturerAlertMessage = '';
          }, 3000);
        }
      } else {
        this.addLecturerModal(lecturerToAdd);
      }
    }
  }
  // add organization popup configurations
  addOrganizationModal() {
    const initialState = {
      input: true,
      label: 'שם הארגון:',
      placeHolder: 'שם הארגון',
      title: 'הוספת ארגון חדש',
      isOrganization: true,
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.generalData['organizations'].map((x) => x.title),
      orgTypes: this.generalData['organizationTypes'],
      alreadyExists: 'הארגון כבר במערכת ולכן אין צורך להוסיפו',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.addOrganization();
    });
  }

  // add new organization to db
  addOrganization() {
    const orgData: OrganizationForUpdate = {
      title: this.newEntity['name'],
      organizationTypes: this.newEntity['orgTypes'],
    };

    this.generalDataService
      .updateOrganization(this.authService.decodedToken.nameid, orgData)
      .subscribe(
        (data: any) => {
          this.generalData['organizations'].push(data);
          this.productForm.get('organization').setValue(data.id);
          // this.product.organizationTitle = data.title;
          // this.product.organizationId = data.id;
          this.newEntity = null;
          console.log(data);
          this.bsModalRef.content.successMessage =
            'הארגון: ' + data['title'] + ' נוסף בהצלחה';
          this.bsModalRef.content.generalData = this.generalData[
            'organizations'
          ].map((x) => x.name);
        },
        (error) => {
          console.log(error);
          this.bsModalRef.content.failMessage =
            'הייתה בעיה בשמירת הנתונים, יש לנסות שנית';
        }
      );
  }

  // add student popup configurations
  addStudentModal(studentName: string) {
    const initialState = {
      input: true,
      label: 'האם ברצונך להוסיף למערכת את הסטודנט/ית:',
      placeHolder: 'שם הסטודנט/ית',
      text: studentName,
      title: 'הוספת סטודנט/ית חדש/ה',
      closeBtnName: 'ביטול',
      saveBtnName: 'אישור',
      generalData: this.generalData['students'].map((x) => x.name),
      alreadyExists: 'הסטודנט/ית כבר במערכת ולכן אין צורך להוסיפו/ה',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.addStudent();
    });
  }

  // add new student to db
  addStudent() {
    this.data.name = this.newEntity['name'];
    this.generalDataService
      .updateStudent(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.generalData['students'].push(data);
          this.productForm.controls.students.value.push(data);
          this.productForm.controls.students.updateValueAndValidity();

          this.newEntity = null;
          console.log(data);
          this.bsModalRef.content.successMessage =
            'הסטודנט/ית: ' + data['name'] + ' נוסף/ה בהצלחה';
          this.bsModalRef.content.generalData = this.generalData[
            'students'
          ].map((x) => x.name);
        },
        (error) => {
          console.log(error);
          this.bsModalRef.content.failMessage =
            'הייתה בעיה בשמירת הנתונים, יש לנסות שנית';
        }
      );
  }

  // add lecturer popup configurations
  addLecturerModal(lecturerName: string) {
    const initialState = {
      input: true,
      label: 'האם ברצונך להוסיף למערכת את המנחה:',
      placeHolder: 'שם המנחה',
      text: lecturerName,
      title: 'הוספת מנחה חדש/ה',
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.generalData['lecturers'].map((x) => x.name),
      alreadyExists: 'המנחה כבר במערכת ולכן אין צורך להוסיפו/ה',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.addLecturer();
    });
  }

  // add new lecturer to db
  addLecturer() {
    this.data.name = this.newEntity['name'];
    this.generalDataService
      .updateLecturer(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.generalData['lecturers'].push(data);
          this.productForm.controls.lecturers.value.push(data);
          this.productForm.controls.lecturers.updateValueAndValidity();
          this.newEntity = null;
          console.log(data);
          this.bsModalRef.content.successMessage =
            'המנחה: ' + data['name'] + ' נוסף/ה בהצלחה';
          this.bsModalRef.content.generalData = this.generalData[
            'lecturers'
          ].map((x) => x.name);
        },
        (error) => {
          console.log(error);
          this.bsModalRef.content.failMessage =
            'הייתה בעיה בשמירת הנתונים, יש לנסות שנית';
        }
      );
  }

  // add tag popup configurations
  addTagModal(tagName: string) {
    const initialState = {
      input: true,
      label: 'האם ברצונך להוסיף תגית זו למערכת:',
      placeHolder: 'תגית',
      text: tagName,
      title: 'הוספת תגית חדשה',
      closeBtnName: 'ביטול',
      saveBtnName: 'אישור',
      generalData: this.generalData['tags'].map((x) => x.title),
      alreadyExists: 'תגית זו כבר במערכת ולכן אין צורך להוסיפה',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.addTag();
    });
  }

  // add new tag to db
  addTag() {
    this.data.title = this.newEntity['name'];
    this.generalDataService
      .updateTag(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.generalData['tags'].push(data);
          this.productForm.controls.tags.value.push(data);
          this.productForm.controls.tags.updateValueAndValidity();
          this.newEntity = null;
          console.log(data);
          this.bsModalRef.content.successMessage =
            'התגית: ' + data['title'] + ' נוספה בהצלחה';
          this.bsModalRef.content.generalData = this.generalData['tags'].map(
            (x) => x.title
          );
        },
        (error) => {
          console.log(error);
          this.bsModalRef.content.failMessage =
            'הייתה בעיה בשמירת הנתונים, יש לנסות שנית';
        }
      );
  }

  // add tag course configurations
  addCourseModal(courseName: string) {
    const initialState = {
      input: true,
      input_2: true,
      isNumberNeeded: true,
      label: 'האם ברצונך להוסיף את הקורס:',
      text: courseName,
      placeHolder: 'שם הקורס',
      label_2: 'מספר הקורס:',
      placeHolder_2: 'מספר הקורס',
      title: 'הוספת קורס חדש',
      closeBtnName: 'ביטול',
      saveBtnName: 'אישור',
      generalData: this.generalData['courses'].map((x) => x.title),
      alreadyExists: 'קורס זה כבר במערכת ולכן אין צורך להוסיפו',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      console.log(res.data);
      this.addCourse();
    });
  }

  // add new course to db
  addCourse() {
    this.data.title = this.newEntity['name'];
    this.data.number = this.newEntity['number'];
    this.generalDataService
      .updateCourse(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.generalData['courses'].push(data);
          this.productForm.controls.courses.value.push(data);
          this.productForm.controls.courses.updateValueAndValidity();
          this.newEntity = null;

          this.bsModalRef.content.successMessage =
            'הקורס: ' + data['title'] + ' נוסף בהצלחה';
          this.bsModalRef.content.generalData = this.generalData['courses'].map(
            (x) => x.title
          );
        },
        (error) => {
          console.log(error);
          this.bsModalRef.content.failMessage =
            'הייתה בעיה בשמירת הנתונים, יש לנסות שנית';
        }
      );
  }

  // update product in db
  updateProduct() {
    console.log(this.productForm.valid);
    if (this.productForm.valid) {
      this.product = Object.assign({}, this.productForm.value);

      // convert year from date to string
      console.log(
        this.productForm.controls.yearOfCreation.value.toString().length
      );
      if (
        this.productForm.controls.yearOfCreation.value.toString().length > 4
      ) {
        this.product.yearOfCreation = this.productForm.controls.yearOfCreation.value.getFullYear();
      }
      console.log(this.product);
      this.productService
        .updateProduct(
          this.authService.decodedToken.nameid,
          +this.route.snapshot.params['id'],
          this.product
        )
        .subscribe(
          (next) => {
            console.log('updated!!!');
            this.productForm.reset(this.product);
          },
          (error) => {
            console.log('not updated :(');
          }
        );
    }
  }

  // get files to upload
  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    this.fileUpload = true;
    this.uploadFiles();
  }

  // loop all files and check size, if more then 10 mb show alert
  uploadFiles() {
    this.message = '';
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];
      const extentions = ['JPG', 'JPE', 'JPEG', 'GIF', 'PNG', 'PDF'];
      if (extentions.find((e) => e === file.name.split('.')[1].toUpperCase())) {
        if (file.size < 1000000) {
          this.upload(i, file);
        } else {
          alert('file is too big');
        }
      } else {
        alert('file type not valid');
      }
    }
    this.resetInputFile();
  }

  // reset upload btn after upload
  resetInputFile() {
    this.mediaUpload.nativeElement.value = '';
  }

  // upload file to server via service
  upload(idx, file) {
    this.productService
      .uploadMedia(+this.route.snapshot.params['id'], file)
      .subscribe(
        (event: Media) => {
          (this.productForm.get('media') as FormArray).push(
            this.patchValues(
              event.mDescription,
              event.id,
              event.isMain,
              event.status,
              event.type,
              event.url,
              event.urlForShow
            )
          );
        },
        (err) => {
          this.message = 'Could not upload the file:' + file.name;
        }
      );
  }

  addVideoModal() {
    const initialState = {
      label: 'לינק לסרטון ב: YouTube',
      text_2: 'סרטון התוצר',
      placeHolder: 'לינק ל: YouTube',
      label_2: 'תיאור הסרטון:',
      placeHolder_2: 'תיאור הסרטון',
      title: 'הוספת סרטון חדש',
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      typeAlert: 'יש להזין כתובת Youtube תקנית',
      type: 'video',
    };
    this.bsModalRef = this.modalService.show(LinkVideoModalComponent, {
      initialState,
    });

    this.bsModalRef.content.item.subscribe((res) => {
      console.log(res);
      res.data.type = 'video';
      this.uploadLink(res.data);
    });
  }

  addLinkModal() {
    const initialState = {
      label: 'URL של האתר',
      placeHolder: 'URL',
      label_2: 'תיאור האתר:',
      placeHolder_2: 'תיאור האתר',
      title: 'הוספת URL חדש',
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      type: 'link',
      typeAlert: 'יש להזין כתובת URL תקנית',
    };
    this.bsModalRef = this.modalService.show(LinkVideoModalComponent, {
      initialState,
    });

    this.bsModalRef.content.item.subscribe((res) => {
      console.log(res);
      res.data.type = 'link';
      this.uploadLink(res.data);
    });
  }

  uploadLink(link: Media) {
    this.productService
      .uploadLink(+this.route.snapshot.params['id'], link)
      .subscribe(
        (event: Media) => {
          event.urlForShow = this.safeURL(event.url);
          (this.productForm.get('media') as FormArray).push(
            this.patchValues(
              event.mDescription,
              event.id,
              event.isMain,
              event.status,
              event.type,
              event.url,
              event.urlForShow
            )
          );
          console.log(this.productForm.get('media'));
          // this.product.media = this.productForm.get('media').value;
          // this.product.media.forEach(media => {
          //   media.urlForShow = this.safeURL(media.url);
          // });
        },
        (error) => {
          this.message = 'Could not upload link ' + link.url;
        }
      );
  }

  // trak media ng-for by item index
  trackByIndex(index: number, obj: any): any {
    return index;
  }

  // checks if media if main image set, if no - show alert
  checkMainImage() {
    let isMain = false;
    this.productForm.controls.media.value.forEach((m) => {
      if (m.isMain === true) {
        isMain = true;
      }
    });
    return isMain;
  }

  // checks if image exists, if no - show alert
  checkIfImage() {
    let ifImage = false;
    this.productForm.controls.media.value.forEach((m) => {
      if (m.type === 'image') {
        ifImage = true;
      }
    });
    return ifImage;
  }

  // set media to be main
  setMain(mediaId) {
    const mediaArray = this.productForm.get('media').value;
    mediaArray.find((m) => m.id === mediaId).isMain = true;
    mediaArray
      .filter((m) => m.id !== mediaId)
      .forEach((n) => (n.isMain = false));
  }

  // delete media
  DeleteFile(mediaId) {
    this.productForm.get('media').value.find((m) => m.id === mediaId).status =
      'Delete';
  }


}
