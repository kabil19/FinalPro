import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GridApi, ICellRendererParams } from 'ag-grid';
import { ActionPopComponent } from '../action-cell/action-pop/action-pop.component';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceService } from 'src/app/service/invoice-service/invoice.service';

@Component({
    selector: 'app-invoice-finalization',
    templateUrl: './invoice-finalization.component.html',
    styleUrls: ['./invoice-finalization.component.css']
})
export class InvoiceFinalizationComponent {
   
    dataFromRow: any;
    gridApi: GridApi | any = {};

    checkGrp = this._formBuilder.group({
        checked: [{value: false, disabled: false}]
    })
   

    constructor(
        private _formBuilder: FormBuilder,
        public matDialog: MatDialog,
        private invoiceService:InvoiceService
    ) {

    }
  
    agInit(params: ICellRendererParams): void {
        this.dataFromRow = params && params.data ? params.data : {};
        this.gridApi = params.api;
        this.checkGrp.get('checked')?.setValue(this.dataFromRow.finalized);
        if (this.dataFromRow.finalized) {
            this.checkGrp.get('checked')?.disable();
        }
    }
    public setDataIntoRow() {
        this.invoiceService.getAll().subscribe((retData)=>{
            this.gridApi.setRowData(retData)
        })
    }

    onCheckboxChange(checkGrp:string): void {
        
        const extraData = {
            title : "Invoice Finalization",
            subTitle: "Once finalized, the invoice cannot be deleted or updated.",
        }   
        const deletePop= this.matDialog.open(ActionPopComponent, {data: extraData, panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop"});
        
        deletePop.afterClosed().subscribe((state:boolean) => {
            if(!state){
                this.checkGrp.get(checkGrp)?.setValue(state);
                return;
            }
            this.dataFromRow.finalized = this.checkGrp.get('checked')?.value;
            this.updateFinalizeBox()  
        })
       
    }
   
    updateFinalizeBox(){
       this.invoiceService.update(this.dataFromRow).subscribe(res=>{
        this.setDataIntoRow()
        console.log(res) 
       },(err)=>{
        console.log(err)
       })
    }

    

}