import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmedSalesInvoiceComponent } from '../confirmed-sales-invoice/confirmed-sales-invoice.component';
import { ConfirmedPurchaseComponent } from '../confirmed-purchase/confirmed-purchase.component';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-common-payments',
  templateUrl: './common-payments.component.html',
  styleUrls: ['./common-payments.component.css']
})
export class CommonPaymentsComponent {

    invoiceType: string="salesinvoice"
    // fontStyleControl = new FormControl('');


    constructor(
        private dialog: MatDialog,
       
       
    ) { 
      
        
    }

   

  
}
