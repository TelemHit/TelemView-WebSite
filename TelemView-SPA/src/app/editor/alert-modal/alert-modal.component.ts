import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css'],
})
export class AlertModalComponent implements OnInit {
  title: string;
  productId: number;
  productTitle: string;
  alert: string;
  closeBtnName: string;
  approveBtnName: string;
  @Output() confirm = new EventEmitter();


  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {}

  confirmModal(message: any) {
    this.confirm.emit({ data: message, res: 200 });
    
  }
}
