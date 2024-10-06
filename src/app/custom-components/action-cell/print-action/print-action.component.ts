import { Component } from '@angular/core';
import { GridApi, ICellRendererParams } from 'ag-grid';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VoucherComponent } from 'src/app/Template/payments/voucher/voucher.component';
import { ReceiptComponent } from 'src/app/Template/payments/receipt/receipt.component';
import { ReceiptVoucherPrintComponent } from 'src/app/Template/modules/receipt-voucher-print/receipt-voucher-print.component';

@Component({
    selector: 'app-print-action',
    templateUrl: './print-action.component.html',
    styleUrls: ['./print-action.component.css']
})
export class PrintActionComponent {
    params: any;
    dataFromRow: any;
    gridApi: GridApi | any = {};


constructor(private matDialog:MatDialog){

}

    agInit(params: ICellRendererParams): void {
        this.params = params;
        this.dataFromRow = params && params.data ? params.data : {};
        this.gridApi = params.api;
    }

    printAction() {
        console.log("dataFrom Row ", this.dataFromRow)
        console.log("params ", this.params)
        const receivedData = this.params.actionName
        if (receivedData) {
            switch (receivedData) {
                case 'voucherData':
                    console.log("Print Voucher")
                    const openVoucher =  this.matDialog.open(ReceiptVoucherPrintComponent,{data:this.dataFromRow,panelClass:['custom-dialog-container'],backdropClass: "dialogbox-backdrop"})  
                     openVoucher.afterClosed().subscribe((response)=>{})
                    break;
                case 'receiptData':
                    console.log("Print Receipt")
                    const openReceipt =  this.matDialog.open(ReceiptVoucherPrintComponent,{data:this.dataFromRow,panelClass:['custom-dialog-container'],backdropClass: "dialogbox-backdrop"})  
                    openReceipt.afterClosed().subscribe((response)=>{})
                    break;
            }
        }
    }
}
