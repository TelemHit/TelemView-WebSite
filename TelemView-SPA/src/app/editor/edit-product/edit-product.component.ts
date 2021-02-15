//edit product form component

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { Product } from 'src/app/_models/product';
import { ProductsService } from 'src/app/_services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgForm,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { DataForEdit } from 'src/app/_models/dataForEdit';
import { ProductForCreate } from 'src/app/_models/productForCreate';
import { Media } from 'src/app/_models/media';
import { repeatWhen } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeneralDataService } from 'src/app/_services/generalData.service';
import { GeneralData } from 'src/app/_models/generalData';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalComponent } from 'src/app/editor/modal/modal.component';
import { Tag } from 'src/app/_models/Tag';
import { Student } from 'src/app/_models/Student';
import { Course } from 'src/app/_models/Course';
import { Lecturer } from 'src/app/_models/lecturer';
import { OrganizationForUpdate } from 'src/app/_models/OrganizationForUpdate';
import { LinkVideoModalComponent } from '../link-video-modal/link-video-modal.component';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from 'src/app/_services/alertify.service';
declare let Hebcal: any;

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit, AfterViewInit {
  product: Product;
  generalData: DataForEdit[];
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
  studentAlertMessage: string;
  tagAlertMessage: string;
  courseAlertMessage: string;
  lecturerAlertMessage: string;
  productForm: FormGroup;
  quillCounter: number;
  imageUrl: string[] | ArrayBuffer[];
  routeName: string;
  sanitizedUrl;
  alerts = [];

  @ViewChild('MediaUpload', { static: true }) mediaUpload: ElementRef;
  @ViewChild('EditForm', { static: true }) editForm: NgForm;

  public onAddedStudentFunc = this.beforeAddStudent.bind(this);
  public onAddedTagFunc = this.beforeAddTag.bind(this);
  public onAddedCourseFunc = this.beforeAddCourse.bind(this);
  public onAddedLecturerFunc = this.beforeAddLecturer.bind(this);

  @HostListener('window: beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.productForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private generalDataService: GeneralDataService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService,
    private titleService: Title
  ) {}

  ngOnInit() {
    //get data of product
    this.route.url.subscribe((val) => (this.routeName = val[1].path));
    this.route.data.subscribe(
      (data) => {
        this.generalData = data.generalData;
        if (this.routeName !== 'create' && data.product) {
          let product = { ...data.product };
          product.media.forEach((media) => {
            if (media.type === 'video') {
              media.urlForShow = this.safeURL(media.url);
            }
          });
          this.product = product;
        }
      },
      (error) => {
        this.alertify.error('הייתה בעיה בטעינת התוצר');
        this.router.navigate(['editor/products']);
      }
    );

    if (!this.product && this.routeName !== 'create') {
      this.router.navigate(['editor/products']);
    }

    if (this.routeName !== 'create') {
      this.titleService.setTitle('Telem View - עריכת תוצר');
    } else {
      this.titleService.setTitle('Telem View - תוצר חדש');
    }

    // initialize form
    this.createProductForm();
    if (this.product) {
      this.initializeValues();
      this.patch(this.product.media);
    }
  }

  ngAfterViewInit() {
    this.scrollToTop();
  }

  // scroll top
  scrollToTop() {
        window.scrollTo(0, 0);
  }

  // initialize form values
  initializeValues() {
    if (this.product.title) {
      this.productForm.controls.title.setValue(this.product.title);
    }
    if (this.product.brief) {
      this.productForm.controls.brief.setValue(this.product.brief);
    }
    if (this.product.taskId) {
      this.productForm.controls.taskId.setValue(this.product.taskId);
    }
    if (this.product.tags) {
      this.productForm.controls.tags.setValue(this.product.tags);
    }
    if (this.product.description) {
      this.productForm.controls.description.setValue(this.product.description);
    }
    if (this.product.students) {
      this.productForm.controls.students.setValue(this.product.students);
    }
    if (this.product.organizationId) {
      this.productForm.controls.organizationId.setValue(
        this.product.organizationId
      );
    }
    if (this.product.yearOfCreation) {
      this.productForm.controls.yearOfCreation.setValue(
        this.product.yearOfCreation
      );
    }
    if (this.product.heYearOfCreation) {
      this.productForm.controls.heYearOfCreation.setValue(
        this.product.heYearOfCreation
      );
    }
    if (this.product.degree) {
      this.productForm.controls.degree.setValue(this.product.degree);
    }
    if (this.product.productTypeId) {
      this.productForm.controls.productTypeId.setValue(
        this.product.productTypeId
      );
    }
    if (this.product.productUrl) {
      this.productForm.controls.productUrl.setValue(this.product.productUrl);
    }
    if (this.product.courses) {
      this.productForm.controls.courses.setValue(this.product.courses);
    }
    if (this.product.lecturers) {
      this.productForm.controls.lecturers.setValue(this.product.lecturers);
    }
  }

  // Creating form
  createProductForm() {
    this.productForm = this.formBuilder.group(
      {
        title: [
          '',
          [
            Validators.minLength(2),
            Validators.maxLength(100),
            Validators.required,
          ],
        ],
        brief: [
          '',
          [
            Validators.minLength(2),
            Validators.maxLength(100),
            Validators.required,
          ],
        ],
        taskId: ['', Validators.required],
        tags: [[], Validators.required],
        description: ['', [Validators.minLength(2), Validators.required]],
        students: [[], Validators.required],
        organizationId: ['', Validators.required],
        yearOfCreation: ['', Validators.required],
        heYearOfCreation: ['', Validators.required],
        degree: ['', Validators.required],
        productTypeId: ['', Validators.required],
        productUrl: [''],
        courses: [[], Validators.required],
        lecturers: [[], Validators.required],
        media: this.formBuilder.array([]),
      },
      { validator: [this.isUrl, this.hasImages, this.hasMainImage] }
    );
  }

  hasMainImage(g: FormGroup) {
    return g.controls.media.value.find((m) => m.isMain === true)
      ? null
      : { noMainImage: true };
  }

  hasImages(g: FormGroup) {
    return g.controls.media.value.filter(
      (m) => m.type === 'image' && m.status !== 'Delete'
    ).length > 0
      ? null
      : { noImage: true };
  }

  // checks if media has description
  noDescription(i) {
    if (
      this.productForm.controls.media.value[i].mDescription.toString().trim()
        .length < 1
    ) {
      return true;
    }
    return false;
  }

  // Check if url
  isUrl(g: FormGroup) {
    if (g.controls.productUrl.value.length > 0) {
      return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
        g.controls.productUrl.value
      )
        ? null
        : { notUrl: true };
    } else {
      return null;
    }
  }

  // make url safe for angular
  safeURL(videoURL) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoURL);
  }

  // patch values to media control
  patch(array) {
    const control = this.productForm.get('media') as FormArray;
    control.clear();
    array.forEach((x) => {
      control.push(
        this.patchValues(
          x.mDescription,
          x.id,
          x.isMain,
          x.status,
          x.type,
          x.url,
          x.urlForShow,
          x.file
        )
      );
    });
  }

  patchValues(mDescription, id, isMain, status, type, url, urlForShow, file?) {
    return this.formBuilder.group({
      mDescription: [
        mDescription,
        [Validators.required, Validators.maxLength(50)],
      ],
      id: [id],
      isMain: [isMain],
      status: [status],
      type: [type],
      url: [url],
      urlForShow: [urlForShow],
      file: [file],
    });
  }

  // check students before add
  private beforeAddStudent(student: Student) {
    if (student.name != '') {
      const studentToAdd = student.name
        ? student.name.trim()
        : student.toString().trim();
      if (studentToAdd) {
        if (this.generalData['students'].find((t) => t.name === studentToAdd)) {
          const newStudent = this.generalData['students'].find(
            (t) => t.name === studentToAdd
          );
          if (
            !this.productForm.controls.students.value.find(
              (s) => s.id === newStudent.id
            )
          ) {
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
  }

  // check tags before add
  private beforeAddTag(tag: Tag) {
    if (tag.title != '') {
      const tagToAdd = tag.title ? tag.title.trim() : tag.toString().trim();
      if (tagToAdd && tagToAdd != '') {
        if (this.generalData['tags'].find((t) => t.title === tagToAdd)) {
          const newTag = this.generalData['tags'].find(
            (t) => t.title === tagToAdd
          );

          if (
            !this.productForm.controls.tags.value.find(
              (s) => s.id === newTag.id
            )
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
  }

  // check courses before add
  private beforeAddCourse(course: Course) {
    if (course.title != '') {
      const courseToAdd = course.title
        ? course.title.trim()
        : course.toString().trim();
      if (courseToAdd) {
        if (this.generalData['courses'].find((c) => c.title === courseToAdd)) {
          const newCourse = this.generalData['courses'].find(
            (t) => t.title === courseToAdd
          );
          if (
            !this.productForm.controls.courses.value.find(
              (s) => s.id === newCourse.id
            )
          ) {
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
  }

  // check lecturer before add
  private beforeAddLecturer(lecturer: Lecturer) {
    if (lecturer.name != '') {
      const lecturerToAdd = lecturer.name
        ? lecturer.name.trim()
        : lecturer.toString().trim();
      if (lecturerToAdd) {
        if (
          this.generalData['lecturers'].find((c) => c.name === lecturerToAdd)
        ) {
          const newLecturer = this.generalData['lecturers'].find(
            (t) => t.name === lecturerToAdd
          );
          if (
            !this.productForm.controls.lecturers.value.find(
              (s) => s.id === newLecturer.id
            )
          ) {
            return of(newLecturer);
          } else {
            this.lecturerAlertMessage = 'המרצה כבר ברשימה';
            setTimeout(() => {
              this.lecturerAlertMessage = '';
            }, 3000);
          }
        } else {
          this.addLecturerModal(lecturerToAdd);
        }
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
      orgTypes_label: 'סוגי ארגונים:',
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
    this.spinner.show();
    const orgData: OrganizationForUpdate = {
      title: this.newEntity['name'],
      organizationTypes: this.newEntity['orgTypes'],
    };

    this.generalDataService
      .addOrganization(this.authService.decodedToken.nameid, orgData)
      .subscribe(
        (data: any) => {
          this.generalData['organizations'].push(data);
          this.productForm.get('organizationId').setValue(data.id);
          // this.product.organizationTitle = data.title;
          // this.product.organizationId = data.id;
          this.newEntity = null;
          // this.bsModalRef.content.successMessage =
          //   'הארגון: ' + data['title'] + ' נוסף בהצלחה';
          this.bsModalRef.content.generalData = this.generalData[
            'organizations'
          ].map((x) => x.name);
          this.productForm.markAsDirty();
          this.spinner.hide();
          this.alertify.success('הארגון נוסף בהצלחה');
        },
        (error) => {
          this.alertify.error('הייתה בעיה בשמירת הנתונים, יש לנסות שנית');
          this.spinner.hide();
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
    this.spinner.show();
    this.data.name = this.newEntity['name'];
    this.generalDataService
      .addStudent(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.generalData['students'].push(data);
          this.productForm.controls.students.value.push(data);
          this.productForm.controls.students.updateValueAndValidity();

          this.newEntity = null;
          this.bsModalRef.content.generalData = this.generalData[
            'students'
          ].map((x) => x.name);
          this.productForm.markAsDirty();
          this.spinner.hide();
          this.alertify.success('הסטודנט/ית נוספ/ה בהצלחה');
        },
        (error) => {
          this.alertify.error('הייתה בעיה בשמירת הנתונים, יש לנסות שנית');
          this.spinner.hide();
        }
      );
  }

  // add lecturer popup configurations
  addLecturerModal(lecturerName: string) {
    const initialState = {
      input: true,
      label: 'האם ברצונך להוסיף למערכת את המרצה:',
      placeHolder: 'שם המרצה',
      text: lecturerName,
      title: 'הוספת מרצה חדש/ה',
      closeBtnName: 'ביטול',
      saveBtnName: 'שמירה',
      generalData: this.generalData['lecturers'].map((x) => x.name),
      alreadyExists: 'המרצה כבר במערכת ולכן אין צורך להוסיפו/ה',
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.item.subscribe((res) => {
      this.newEntity = res.data;
      this.addLecturer();
    });
  }

  // add new lecturer to db
  addLecturer() {
    this.spinner.show();
    this.data.name = this.newEntity['name'];
    this.generalDataService
      .addLecturer(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.generalData['lecturers'].push(data);
          this.productForm.controls.lecturers.value.push(data);
          this.productForm.controls.lecturers.updateValueAndValidity();
          this.newEntity = null;
          this.bsModalRef.content.generalData = this.generalData[
            'lecturers'
          ].map((x) => x.name);
          this.productForm.markAsDirty();
          this.spinner.hide();
          this.alertify.success('המרצה נוספ/ה בהצלחה');
        },
        (error) => {
          this.alertify.error('הייתה בעיה בשמירת הנתונים, יש לנסות שנית');
          this.spinner.hide();
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
    this.spinner.show();
    this.data.title = this.newEntity['name'];
    this.generalDataService
      .addTag(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.generalData['tags'].push(data);
          this.productForm.controls.tags.value.push(data);
          this.productForm.controls.tags.updateValueAndValidity();
          this.newEntity = null;
          this.bsModalRef.content.generalData = this.generalData['tags'].map(
            (x) => x.title
          );
          this.productForm.markAsDirty();
          this.spinner.hide();
          this.alertify.success('התגית נוספה בהצלחה');
        },
        (error) => {
          this.alertify.error('הייתה בעיה בשמירת הנתונים, יש לנסות שנית');
          this.spinner.hide();
        }
      );
  }

  // add course configurations
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
      this.addCourse();
    });
  }

  // add new course to db
  addCourse() {
    this.spinner.show();
    this.data.title = this.newEntity['name'];
    this.data.number = this.newEntity['number'];
    this.generalDataService
      .AddCourse(this.authService.decodedToken.nameid, this.data)
      .subscribe(
        (data: any) => {
          this.generalData['courses'].push(data);
          this.productForm.controls.courses.value.push(data);
          this.productForm.controls.courses.updateValueAndValidity();
          this.newEntity = null;
          this.bsModalRef.content.generalData = this.generalData['courses'].map(
            (x) => x.title
          );
          this.productForm.markAsDirty();
          this.spinner.hide();
          this.alertify.success('הקורס נוסף בהצלחה');
        },
        (error) => {
          this.alertify.error('הייתה בעיה בשמירת הנתונים, יש לנסות שנית');
          this.spinner.hide();
        }
      );
  }

  // update product in db or save new product if url ends with 'create'
  updateProduct() {
    this.spinner.show();
    if (this.productForm.valid) {
      this.product = Object.assign({}, this.productForm.value);

      //if new product - create with initial data and then save all
      if (this.routeName === 'create') {
        const productForCreate: ProductForCreate = {
          title: this.product.title,
          taskId: this.product.taskId,
          productTypeId: this.product.productTypeId,
          organizationId: this.product.organizationId,
        };

        this.productService
          .createProduct(this.authService.decodedToken.nameid, productForCreate)
          .subscribe((e: Product) => {
            this.product.id = e.id;
            //save the rest of the data
            this.saveProduct(this.product.id);
          });
      } else {
        this.saveProduct(+this.route.snapshot.params['id']);
      }
    }
  }

  //save product
  saveProduct(id) {
    // saving files and links
    const target = this.product.media.filter(
      (m) => m.id === 0 && m.status !== 'Delete'
    ).length;
    let counter = 0;
    if (target > 0) {
      this.product.media.forEach((media, index) => {
        if (media.id === 0 && media.status !== 'Delete') {
          if (media.type === 'file' || media.type === 'image') {
            this.productService.uploadMedia(id, media.file).subscribe(
              (e: Media) => {
                this.product.media[index].id = e.id;
                this.product.media[index].url = e.url;
                this.product.media[index].file = null;
                counter++;
                if (counter === target) {
                  this.finalUpdate(id);
                }
              },
              (error) => {
                this.alerts.push(
                  'הייתה בעיה בשמירת הקובץ: ' + media.mDescription
                );
                this.alertify.error(
                  'לא כל השינויים לא נשמרו, יש לבדוק את תקינות הקבצים'
                );
                this.spinner.hide();
              }
            );
          } else {
            this.productService.uploadLink(id, media).subscribe(
              (e: Media) => {
                this.product.media[index].id = e.id;
                this.product.media[index].url = e.url;
                this.product.media[index].file = null;
                this.product.media[index].urlForShow = this.safeURL(e.url);
                counter++;
                if (counter === target) {
                  this.finalUpdate(id);
                }
              },
              (error) => {
                this.alerts.push(
                  'הייתה בעיה בשמירת הקישור: ' + media.mDescription
                );
                this.alertify.error(
                  'לא כל השינויים לא נשמרו, יש לבדוק את תקינות הקישורים'
                );
                this.spinner.hide();
              }
            );
          }
        }
      });
    } else {
      this.finalUpdate(id);
    }
  }

  // update all data of product
  finalUpdate(id) {
    this.productService
      .updateProduct(this.authService.decodedToken.nameid, id, this.product)
      .subscribe(
        (next) => {
          this.productForm.reset(this.product);
          if (this.routeName === 'create') {
            this.router.navigate(['editor/products/' + id]);
          }
          this.spinner.hide();
          this.alertify.success('התוצר נשמר בהצלחה');
          this.router.navigate(['/editor/products']);
        },
        (error) => {
          this.alertify.error(
            'חלק מהשינויים לא נשמרו, יש לבדוק את תקינות הנתונים והחיבור לרשת ולנסות שנית'
          );
          this.spinner.hide();
        }
      );
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
      const reader = new FileReader();
      const extentions = ['JPG', 'JPE', 'JPEG', 'GIF', 'PNG', 'PDF'];
      const fileNameSplit = file.name.split('.');

      reader.onload = (event) => {
        if (
          extentions.find(
            (e) => e === fileNameSplit[fileNameSplit.length - 1].toUpperCase()
          )
        ) {
          if (file.size < 1000000) {
            const imageUrl = reader.result;
            const type =
              fileNameSplit[fileNameSplit.length - 1].toUpperCase() === 'PDF'
                ? 'file'
                : 'image';
            (this.productForm.get('media') as FormArray).push(
              this.patchValues(
                file.name,
                0,
                false,
                'Temp',
                type,
                imageUrl,
                '',
                file
              )
            );
            this.productForm.markAsDirty();
          } else {
            this.alerts.push('הקובץ ' + file.name + ' גדול מ1mb');
          }
        } else {
          this.alerts.push('הקובץ ' + file.name + ' אינו בפורמט מתאים');
        }
      };
      reader.readAsDataURL(file);
    }
    this.resetInputFile();
  }
  // reset alerts
  reset(): void {
    this.alerts = [];
  }
  onClosed(dismissedAlert: any): void {
    this.alerts = this.alerts.filter((alert) => alert !== dismissedAlert);
  }

  // reset upload btn after upload
  resetInputFile() {
    this.mediaUpload.nativeElement.value = '';
  }

  //add video
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
      res.data.type = 'video';
      const videoId = this.matchYoutubeUrl(res.data.url);
      res.data.url = 'https://www.youtube.com/embed/' + videoId;
      this.uploadLink(res.data);
    });
  }

  //if product link is valid show it in iframe
  checkUrl() {
    if (
      this.productForm.get('productUrl').value.length > 0 &&
      !this.productForm.getError('notUrl')
    ) {
      this.sanitizedUrl = this.safeURL(
        this.productForm.get('productUrl').value
      );
    }
  }

  //check if url is youtube
  matchYoutubeUrl(url) {
    const p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return url.match(p) ? RegExp.$1 : false;
  }

  //add link modal
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
      res.data.type = 'link';
      this.uploadLink(res.data);
    });
  }

  //upload new link
  uploadLink(link: Media) {
    (this.productForm.get('media') as FormArray).push(
      this.patchValues(
        link.mDescription,
        0,
        false,
        'Temp',
        link.type,
        link.url,
        this.safeURL(link.url)
      )
    );
    this.productForm.markAsDirty();
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
  setMain(event) {
    const btnId = event.target.id.split('_')[1];
    const mediaArray = this.productForm.get('media') as FormArray;
    mediaArray.controls.forEach((media, index) => {
      if (index.toString() !== btnId.toString()) {
        media.patchValue({ isMain: false });
      } else {
        media.patchValue({ isMain: true });
      }
    });

    this.productForm.controls.media.updateValueAndValidity();
    this.productForm.markAsDirty();
  }

  // delete media
  DeleteFile(event) {
    event.preventDefault();
    const btnId = event.target.id.split('_')[1];
    const mediaArray = this.productForm.get('media') as FormArray;

    mediaArray.controls[btnId].patchValue({ status: 'Delete' });
    this.productForm.controls.media.updateValueAndValidity();
    this.productForm.markAsDirty();
  }

  // years list creation
  yearsList() {
    const currentYear = new Date().getFullYear();
    let years = [];
    for (let i = 2010; i <= currentYear; i++) {
      years.push(i);
    }
    return years;
  }
  // hebrew years list creation
  //we use Hebcal library
  heYearsList() {
    let currentYear = new Hebcal.HDate(new Date()).getYearObject().year;
    let years = [];
    for (let i = 5771; i <= currentYear; i++) {
      years.push(Hebcal.gematriya(i, 3));
    }
    return years;
  }
}
