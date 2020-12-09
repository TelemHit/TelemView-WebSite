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
  alreadyExists: string;
  successMessage: string;
  failMessage: string;
  @Output() item = new EventEmitter();

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.createUpdateForm();
  }

  createUpdateForm() {
    this.addItem = this.formBuilder.group(
      {
        name: [this.text, Validators.required],
        number: ['', Validators.pattern('^[0-9]*$')],
        orgTypes: new FormArray([]),
      },
      {
        validators: [
          this.checkIfExists.bind(this),
          this.checkIfNumberNeeded.bind(this),
          this.checkIforgTypesNeeded.bind(this),
        ],
      }
    );
  }

  onCheckChange(event) {
    console.log(this.addItem.get('orgTypes'));
    const formArray: FormArray = this.addItem.get('orgTypes') as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl({id: parseInt(event.target.id.split('_')[1], 10)}));
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
  }

  checkIforgTypesNeeded(g: FormGroup) {
    return this.isOrganization
      ? Validators.required(g.controls.orgTypes)
      : null;
  }

  checkIfExists(g: FormGroup) {
    return this.generalData.find((x) => x === g.get('name').value.trim())
      ? { exists: true }
      : null;
  }

  checkIfNumberNeeded(g: FormGroup) {
    return this.isNumberNeeded ? Validators.required(g.controls.number) : null;
  }

  saveObject(form) {
    this.triggerEvent(form.value);
    this.addItem.get('name').setValue('');
    this.closeBtnName = 'סגירה';
    setTimeout(() => {
      this.bsModalRef.hide();
    }, 3000);
  }

  triggerEvent(item: any) {
    this.item.emit({ data: item, res: 200 });
  }
}
