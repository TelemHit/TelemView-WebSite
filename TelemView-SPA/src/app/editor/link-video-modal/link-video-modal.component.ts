import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-link-video-modal',
  templateUrl: './link-video-modal.component.html',
  styleUrls: ['./link-video-modal.component.css'],
})
export class LinkVideoModalComponent implements OnInit {
  label: string;
  text_2: string;
  placeHolder: string;
  label_2: string;
  placeHolder_2: string;
  title: string;
  closeBtnName: string;
  saveBtnName: string;
  successMessage: string;
  failMessage: string;
  addItem: FormGroup;
  typeAlert: string;
  type: string;
  @Output() item = new EventEmitter();

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.createLinkForm();
  }

  createLinkForm() {
    this.addItem = this.formBuilder.group(
      {
        url: ['', Validators.required],
        mDescription: [this.text_2, Validators.required],
      },
      {
        validators: [this.checkIfUrl.bind(this)],
      }
    );
  }

  checkIfYoutube(g: FormGroup) {}

  checkIfUrl(g: FormGroup) {
    if (this.type === 'video') {
      const urlForCheck = g.controls.url.value.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi
      );

      return urlForCheck !== null ? null : { notUrl: true };
    }
    if (this.type === 'link') {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
          g.controls.url.value
        )
          ? null
          : { notUrl: true };
      }
    }


  saveObject(form) {
    this.triggerEvent(form.value);
    this.addItem.get('url').setValue('');
    this.addItem.get('mDescription').setValue('');
    this.closeBtnName = 'סגירה';
    this.bsModalRef.hide();
  }

  triggerEvent(item: any) {
    this.item.emit({ data: item, res: 200 });
  }
}
