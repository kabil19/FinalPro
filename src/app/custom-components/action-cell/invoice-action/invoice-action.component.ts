import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, ICellRendererParams } from 'ag-grid';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from 'src/app/service/invoice-service/invoice.service';
import { ActionPopComponent } from '../action-pop/action-pop.component';
import { InvoiceFormComponent } from 'src/app/Template/createData-forms/invoice-form/invoice-form.component';
import { AgRendererComponent } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification-service/notification.service';

@Component({
  selector: 'app-invoice-action',
  templateUrl: './invoice-action.component.html',
  styleUrls: ['./invoice-action.component.css']
})
export class InvoiceActionComponent  {

    params: any;
    dataFromRow: any;
    gridApi: GridApi | any = {};
    

    constructor(
        private router : Router,
        private toastr : ToastrService,
        public matDialog: MatDialog,
        private invoiceService:InvoiceService,
        private notificationService:NotificationService
       
    ) {

    }

    agInit(params: any): void {
        this.params = params;
        this.dataFromRow = params && params.data ? params.data : {};
        this.gridApi = params.api;
        
     }
     refresh(params: any): boolean {
        return false;
      }

     public setDataIntoRow() {
        this.invoiceService.getAll().subscribe((retData)=>{
            this.gridApi.setRowData(retData)
        })
    }
    openSelectedInvoice() {
        const dataString = JSON.stringify(this.params.data);
        this.router.navigate(['/dash_board/invoice/selectedInvoice'], { queryParams: { data: dataString } });
        
    }
    
    openDelDialog(): void {
        
        const extraData = {
            title : "Delete Invoice",
            subTitle: "Do you want to delete this invoice?",
        }
        const deletePop= this.matDialog.open(ActionPopComponent, {data: extraData, panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop"});
        
        deletePop.afterClosed().subscribe((state:boolean) => {
            if(!state)return;
            this.invoiceService.deleteTempSalesInvoice(this.dataFromRow.tempInvoiceId).subscribe((res)=>{
                
                if(res?.successMessage!=null){
                    this.toastr.success(res?.successMessage)
                    this.setDataIntoRow();
                    this.triggerNotification()
                }else{
                    this.toastr.clear()
                    this.toastr.error(res?.errors)
                }
               
            })
        })
       
    }

    triggerNotification() {
        this.notificationService.fetchnotificationData();
    }
    
    updateFormTrigger() {
        
        const data={
            title: "Update",
            tempInvoiceData:this.dataFromRow,
            customerValue:this.dataFromRow.customerOBJ,
        }
            const dialogRef = this.matDialog.open(InvoiceFormComponent, {data, panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop"});
            dialogRef.afterClosed().subscribe(()=>{
                this.setDataIntoRow()
            })
        }
}
