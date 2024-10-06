import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISalesReceiptEntity } from 'src/app/constants/interfaces/ISalesReceiptEntity';
import moment from 'moment';
@Component({
    selector: 'app-receipt',
    templateUrl: './receipt.component.html',
    styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent {
    paidDateTime!: any
    paidTime!: any
    constructor(@Inject(MAT_DIALOG_DATA) public data: ISalesReceiptEntity) {
        console.log("receipt ",data)
        this.paidDateTime = moment(new Date(this.data.paidDate)).format("DD/MM/YYYY HH:mm:ss");

    }
}