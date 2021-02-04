//general modal for data updating (organizations, types etc)
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { OrganizationType } from 'src/app/_models/organizationType';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  title: string;
  closeBtnName: string;
  saveBtnName: string;
  list: any[] = [];
  label: string;
  label_2: string;
  input: boolean;
  input_2: string;
  text = '';
  isNumberNeeded: boolean;
  isOrganization: boolean;
  placeHolder: string;
  placeHolder_2: string;
  addItem: FormGroup;
  generalData: [];
  orgTypes: [];
  orgCurrentTypes: [];
  alreadyExists: string;
  successMessage: string;
  failMessage: string;
  isEdit: boolean = false;
  description = '';
  isTask: boolean = false;
  descriptin_label: string;
  orgTypes_label: string;
  courseNumber = '';
  @Output() item = new EventEmitter();

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    //create form
    this.createUpdateForm();
    //check if updating organization and push organization types to form control
    if (this.orgCurrentTypes != null && this.orgCurrentTypes.length > 0) {
      const formArray: FormArray = this.addItem.get('orgTypes') as FormArray;
      this.orgCurrentTypes.forEach((ot: OrganizationType) => {
        formArray.push(new FormControl({ id: ot.id }));
      });
    }
  }

  //check if organization has a type
  isChecked(type) {
    return this.addItem.get('orgTypes').value.find((ot) => ot.id === type.id);
  }

  //create form
  createUpdateForm() {
    this.addItem = this.formBuilder.group(
      {
        name: [this.text, Validators.required],
        number: [this.courseNumber, Validators.pattern('^[0-9]*$')],
        description: [this.description],
        orgTypes: new FormArray([]),
      },
      {
        validators: [
          this.checkIfExists.bind(this),
          this.checkIfNumberNeeded.bind(this),
          this.checkIforgTypesNeeded.bind(this),
          this.checkIfDescriptionNeeded.bind(this),
        ],
      }
    );
  }

//organization types check change
  onCheckChange(event) {
    const formArray: FormArray = this.addItem.get('orgTypes') as FormArray;
    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(
        new FormControl({ id: parseInt(event.target.id.split('_')[1], 10) })
      );
      this.addItem.updateValueAndValidity();
    } else {
      /* unselected */
      // find the unselected element
      let i = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value.id === parseInt(event.target.id.split('_')[1], 10)) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.addItem.markAsDirty();
  }

  //validate description if Task
  checkIfDescriptionNeeded(g: FormGroup) {
    return this.isTask ? Validators.required(g.controls.description) : null;
  }

  //validate checkboxes if organization 
  checkIforgTypesNeeded(g: FormGroup) {
    return this.isOrganization
      ? Validators.required(g.controls.orgTypes)
      : null;
  }

  // check if name already exists
  checkIfExists(g: FormGroup) {
    return this.generalData.find((x) => x === g.get('name').value.trim()) &&
      !this.isEdit
      ? { exists: true }
      : null;
  }

  //validate number input if Course
  checkIfNumberNeeded(g: FormGroup) {
    return this.isNumberNeeded ? Validators.required(g.controls.number) : null;
  }

  //save
  saveObject(form) {
    this.triggerEvent(form.value);
  }

  //send data to parent
  triggerEvent(item: any) {
    this.item.emit({ data: item, res: 200 });
  }
}
