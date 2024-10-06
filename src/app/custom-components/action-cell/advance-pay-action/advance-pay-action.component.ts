import { Component } from '@angular/core';
import { ActionPopComponent } from '../action-pop/action-pop.component';
import { NotificationService } from 'src/app/service/notification-service/notification.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, ICellRendererParams } from 'ag-grid';
import { PaymentsService } from 'src/app/service/payments-service/payments.service';

@Component({
  selector: 'app-advance-pay-action',
  templateUrl: './advance-pay-action.component.html',
  styleUrls: ['./advance-pay-action.component.css']
})
export class AdvancePayActionComponent {

  dataFromRow: any;
  gridApi: GridApi | any = {};


  constructor(
    private toastr: ToastrService,
    public matDialog: MatDialog,
    private notificationService: NotificationService,
    private paymentService: PaymentsService,
  ) {

  }

  agInit(params: ICellRendererParams): void {
    this.dataFromRow = params && params.data ? params.data : {};
    this.gridApi = params.api;
  }

  public setDataIntoRow() {
    this.paymentService.getAllPayments(this.dataFromRow.salesInvoice.tempInvoiceId).subscribe((pay) => {
      console.log("pay", pay)
      this.gridApi.setRowData(pay.result);
    }, (err) => {
    })
  }

  openDelDialog(): void {
    console.log("rowData", this.dataFromRow)
    const extraData = {
      title: "Delete",
      subTitle: "Do you want to delete this Payment?",
    }
    const deletePop = this.matDialog.open(ActionPopComponent, { data: extraData, panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop" });

    deletePop.afterClosed().subscribe((state: boolean) => {
      if (!state) return;
      this.paymentService.deletePayment(this.dataFromRow.paymentId).subscribe((res) => {
        this.toastr.clear()
        this.toastr.success(res.successMessage)
        this.setDataIntoRow();
      }, error => {
        this.toastr.clear()
        this.toastr.error(error.error)
      })
    })

  }

  /* updateFormTrigger() {
      
      const extraData={
          title: "Update",
          stockData:this.dataFromRow,
          categoryData: this.dataFromRow.categoryOBJ
      }
          const dialogRef = this.matDialog.open(StockFormComponent, {data:extraData, panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop"});
          dialogRef.afterClosed().subscribe(()=>{
              this.setDataIntoRow()
              this.triggerNotification()
          },error=>{
              this.toastr.clear()
              this.toastr.error(error.error)
          })
      }
      */

  triggerNotification() {
    this.notificationService.fetchnotificationData();
  }
}
