//modal for youtube and url upload
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

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
  sanitizedUrl;
  @Output() item = new EventEmitter();

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.createLinkForm();
  }

  // make url safe for angular
  safeURL(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  //create form
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
  
  //check that url is valid and create safe link
  checkUrl(){
    if(this.addItem.get('url').value.length>0 && !this.addItem.getError('notUrl')){
      this.sanitizedUrl = this.type === 'video' ? this.createYoutubeLink(this.addItem.get('url').value) 
      : this.safeURL(this.addItem.get('url').value);
    }
    
  }

//make sure url is valid
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

  //create youtube link
  createYoutubeLink(url) {
    const videoId = this.matchYoutubeUrl(url);
    url = 'https://www.youtube.com/embed/' + videoId;
    return this.safeURL(url);
  }

  //return only youtube id
  matchYoutubeUrl(url) {
    const p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return url.match(p) ? RegExp.$1 : false;
  }

  //save
  saveObject(form) {
    this.triggerEvent(form.value);
    this.bsModalRef.hide();
  }

  //send data to parent
  triggerEvent(item: any) {
    this.item.emit({ data: item, res: 200 });
  }
}
