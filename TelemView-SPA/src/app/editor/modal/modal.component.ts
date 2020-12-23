import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { DataForHome } from 'src/app/_models/dataForHome';
import { NgxSpinnerService } from 'ngx-spinner';
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
    this.createUpdateForm();
    
    if (this.orgCurrentTypes != null && this.orgCurrentTypes.length > 0) {
      console.log(this.orgCurrentTypes)
      const formArray: FormArray = this.addItem.get('orgTypes') as FormArray;
      this.orgCurrentTypes.forEach((ot: OrganizationType) => {
        formArray.push(new FormControl({ id: ot.id }));
      });
    }
  }

isChecked(type){
  return this.addItem.get('orgTypes').value.find(ot => ot.id === type.id);
}

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
        console.log(ctrl.value.id);
        if (ctrl.value.id === parseInt(event.target.id.split('_')[1], 10)) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
    console.log(this.addItem.get('orgTypes'));
    this.addItem.markAsDirty();
  }

  checkIfDescriptionNeeded(g: FormGroup) {
    return this.isTask ? Validators.required(g.controls.description) : null;
  }

  checkIforgTypesNeeded(g: FormGroup) {
    return this.isOrganization
      ? Validators.required(g.controls.orgTypes)
      : null;
  }

  checkIfExists(g: FormGroup) {
    return this.generalData.find((x) => x === g.get('name').value.trim()) &&
      !this.isEdit
      ? { exists: true }
      : null;
  }

  checkIfNumberNeeded(g: FormGroup) {
    return this.isNumberNeeded ? Validators.required(g.controls.number) : null;
  }

  saveObject(form) {
    this.triggerEvent(form.value);
    // this.addItem.get('name').setValue('');
    // this.closeBtnName = 'סגירה';
    // this.bsModalRef.hide();
  }

  triggerEvent(item: any) {
    this.item.emit({ data: item, res: 200 });
  }
}
