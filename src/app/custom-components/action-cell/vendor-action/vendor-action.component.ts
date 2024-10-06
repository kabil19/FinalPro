import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, ICellRendererParams } from 'ag-grid';
import { VendorService } from 'src/app/service/vendor-service/vendor.service';
import { ActionPopComponent } from '../action-pop/action-pop.component';
import { VendorFormComponent } from 'src/app/Template/createData-forms/vendor-form/vendor-form.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vendor-action',
  templateUrl: './vendor-action.component.html',
  styleUrls: ['./vendor-action.component.css']
})
export class VendorActionComponent {
    dataFromRow: any;
    gridApi: GridApi | any = {};
    

    constructor(
        private toastr : ToastrService,
        public matDialog: MatDialog,
        private vendorService:VendorService
       
    ) {

    }

    agInit(params: ICellRendererParams): void {
        this.dataFromRow = params && params.data ? params.data : {};
        this.gridApi = params.api;
     }

     public setDataIntoRow() {
        this.vendorService.getAll().subscribe((retData)=>{
            this.gridApi.setRowData(retData)
        })
    }

    openDelDialog(): void {
        
        const extraData = {
            title : "Delete Vendor",
            subTitle: "Do you want to delete this Vendor?",
        }
        const deletePop= this.matDialog.open(ActionPopComponent, {data: extraData, panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop"});
        
        deletePop.afterClosed().subscribe((state:boolean) => {
            if(!state)return;

            
            this.vendorService.delete(this.dataFromRow.vendorId).subscribe((res)=>{
                this.setDataIntoRow();
                this.toastr.success(res)
            },(error)=>{
                this.toastr.error(error.error)
            })
               
            })
       
    }
    
    updateFormTrigger() {
        const data={
            title: "Update",
            vendorData:this.dataFromRow
        }
            const dialogRef = this.matDialog.open(VendorFormComponent, {data, panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop"});
            dialogRef.afterClosed().subscribe(()=>{
                this.setDataIntoRow()
            })
        }
}
