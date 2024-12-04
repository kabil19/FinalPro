import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, ICellRendererParams } from 'ag-grid';
import { ConfirmInvoiceService } from 'src/app/service/confirmInvoice-service/confirm-invoice.service';
import { ReturnFormComponent } from 'src/app/Template/createData-forms/return-form/return-form.component';

@Component({
  selector: 'app-make-return-cart',
  templateUrl: './make-return-cart.component.html',
  styleUrls: ['./make-return-cart.component.css']
})
export class MakeReturnCartComponent {

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

    openReturnForm() {
       
        const deletePop = this.matDialog.open(ReturnFormComponent, { data: this.dataFromRow, panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop" });
    
    }
}
