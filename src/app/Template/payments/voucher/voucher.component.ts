import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
import { IPurchaseVoucherEntity } from 'src/app/constants/interfaces/IPurchaseVoucherEntity';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent {
    paidDateTime!: any
    paidTime!: any
    constructor(@Inject(MAT_DIALOG_DATA) public data: IPurchaseVoucherEntity) {
        this.paidDateTime = moment(new Date(this.data.paidDate)).format("DD/MM/YYYY HH:mm:ss");
        console.log("Voucher Dta  ",this.data)
    }
}
