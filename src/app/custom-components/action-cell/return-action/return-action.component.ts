import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, ICellRendererParams } from 'ag-grid';
import { ConfirmInvoiceService } from 'src/app/service/confirmInvoice-service/confirm-invoice.service';
import { SalesReturnCartComponent } from 'src/app/Template/modules/employee/sales-return-cart/sales-return-cart.component';

@Component({
  selector: 'app-return-action',
  templateUrl: './return-action.component.html',
  styleUrls: ['./return-action.component.css']
})
export class ReturnActionComponent {

    dataFromRow: any;
    gridApi: GridApi | any = {};
    params: any;
   

    constructor( 
        private matDialog: MatDialog,
        private confirmedInvoiceCartService:ConfirmInvoiceService
    ){
        
    }
    agInit(params: ICellRendererParams): void {
        this.params = params;
        this.dataFromRow = params && params.data ? params.data : {};
        this.gridApi = params.api;
     }

     showInvoiceProducts() {
        // 
    }
    handleClick(): void {
        if (this.params.onActionClick) {
            const confirmInvoiceId = this.params.data.confirmInvoiceId;
            this.openCart(confirmInvoiceId)
        }
    }

    openCart(confirmInvoiceId:any){
        console.log(confirmInvoiceId)
       
        const returnCartOpen = this.matDialog.open(
            SalesReturnCartComponent,
            { data: confirmInvoiceId, width: '75%', height: 'auto', panelClass: ["custom-dialog-container"], backdropClass: "dialogbox-backdrop" }
        );
        returnCartOpen.afterClosed().subscribe(res => {
           
        })
    }

    ngOnInit(): void {

    }
}
