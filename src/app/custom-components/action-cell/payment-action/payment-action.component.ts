import { Component, Input } from '@angular/core';
import { ActionPopComponent } from '../action-pop/action-pop.component';
import { GridApi, ICellRendererParams } from 'ag-grid';
import { InvoicePaymentComponent } from 'src/app/Template/payments/invoice-payment/invoice-payment.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmSalesInvociePaymentService } from 'src/app/service/confirmPaymentServices/ConfirmSalesInvoiceService/confirm-sales-invocie-payment.service';
import { ConfirmPurchasePaymentService } from 'src/app/service/confirmPaymentServices/ConfirmedPurchaseInvoiceServices/confirm-purchase-payment.service';
import { CommonPaymentsComponent } from 'src/app/Template/modules/common-payments/common-payments.component';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { IProCartEntity } from 'src/app/constants/interfaces/IProCartEntity';
import { InvoicePaymentsHistoryProcessComponent } from 'src/app/Template/modules/invoice-payments-history-process/invoice-payments-history-process.component';
import { ConfirmInvoiceService } from 'src/app/service/confirmInvoice-service/confirm-invoice.service';
import { ReceiptComponent } from 'src/app/Template/payments/receipt/receipt.component';
import { VoucherComponent } from 'src/app/Template/payments/voucher/voucher.component';
import { ConfirmPurchaseAndCartServiceService } from 'src/app/service/confirmPurchase-service/confirm-purchase-and-cart-service.service';
import { ReceiptVoucherPrintComponent } from 'src/app/Template/modules/receipt-voucher-print/receipt-voucher-print.component';
@Component({
  selector: 'app-payment-action',
  templateUrl: './payment-action.component.html',
  styleUrls: ['./payment-action.component.css']
})
export class PaymentActionComponent {

    dataFromRow: any;
    gridApi: GridApi | any = {};
    params: any;
   

    constructor( private matDialog: MatDialog,
        private confirmSalesInvociePaymentService :ConfirmSalesInvociePaymentService,
        private confirmPurchaseInvociePayService:ConfirmPurchasePaymentService,
        private confirmedInvoiceService : ConfirmInvoiceService,
        private confirmedPurchaseService :ConfirmPurchaseAndCartServiceService ,
    ){
        
    }

    public setConfirmedInvoicesDataIntoRow() {
        this.confirmedInvoiceService.getAllConfirmedInvoices().subscribe((retData)=>{
            this.gridApi.setRowData(retData?.result)
        })
    }
    public setConfirmedPurchaseDataIntoRow() {
        this.confirmedPurchaseService.getAllConfirmPurchaseInvoices().subscribe((retData)=>{
            this.gridApi.setRowData(retData?.result)
        })
    }



    agInit(params: ICellRendererParams): void {
        this.params = params;
        this.dataFromRow = params && params.data ? params.data : {};
        this.gridApi = params.api;
     }

  
    makePayment() {
      
        if(this.params.actionName === "purchaseInvoice"){
            const openPaymentDialog =  this.matDialog.open(InvoicePaymentComponent,{data:this.dataFromRow,panelClass:['custom-dialog-container'],backdropClass: "dialogbox-backdrop"})  
            openPaymentDialog.afterClosed().subscribe((response)=>{
                this.setConfirmedPurchaseDataIntoRow()
                if(response){
                    const openReceiptForThePay = this.matDialog.open(ReceiptVoucherPrintComponent,{data:response.result,panelClass:['custom-dialog-container'],backdropClass: "dialogbox-backdrop"})
                    return
                }  
            })
        }else if(this.params.actionName ==="salesInvoice"){
          const openPaymentDialog = this.matDialog.open(InvoicePaymentComponent,{data:this.dataFromRow,panelClass:['custom-dialog-container'],backdropClass: "dialogbox-backdrop"})
                openPaymentDialog.afterClosed().subscribe((response)=>{
                    this.setConfirmedInvoicesDataIntoRow()
                    if(response){
                        const openReceiptForThePay = this.matDialog.open(ReceiptVoucherPrintComponent,{data:response.result,panelClass:['custom-dialog-container'],backdropClass: "dialogbox-backdrop"})
                    }
                   
                })
        }
        // const extraData = {
        //     // totalAmount: this.totalNetAmount,
        //     // invoiceData: this.invoiceData,
        // };
        // const invoicePaymentOpen = this.matDialog.open(
        //     InvoicePaymentComponent,
        //     { data: extraData, panelClass: ["custom-dialog-container"] }
        // );
        // invoicePaymentOpen.afterClosed().subscribe((res) => {
        //     this.getAllPayments();
          
        // });
    }

    payHistory() {
        
        const extraData = {

            invoiceData: this.dataFromRow,
        };

        if(this.params.actionName === "salesInvoice"){
        const openInvoicePaymentHistory = this.matDialog.open(
            InvoicePaymentComponent,
            { data: extraData, panelClass: ["custom-dialog-container"] }
        );
        }else if(this.params.actionName ==="purchaseInvoice"){

        }
    }

    // getAllPayments() {
    
    //     this.paymentService.getAllPayments(this.invoiceId).subscribe((res) => {
    //         GLOBAL_LIST.PAYMENTS_DATA = res.result;
           
    //     });
    // }




//      public setDataIntoRow() {
//         this.custService.getAll().subscribe((retData)=>{
//             this.gridApi.setRowData(retData)
//         })
//     }

//     openDelDialog(): void {
        
//         const extraData = {
//             title : "Delete Customer",
//             subTitle: "Do you want to delete this customer?",
//         }
//         const deletePop= this.matDialog.open(ActionPopComponent, {data: extraData, panelClass:"custom-dialog-container"});
        
//         deletePop.afterClosed().subscribe((state:boolean) => {
//             if(!state)return;

            
//             this.custService.delete(this.dataFromRow.custId).subscribe((res)=>{
//                 this.toastr.success(res)
//                 this.setDataIntoRow();
//             })
//         })
       
//     }
    
//     updateFormTrigger() {
//         const data={
//             title: "Update",
//             custData:this.dataFromRow
//         }
//             const dialogRef = this.matDialog.open(CustomerFormComponent, {data, panelClass:"custom-dialog-container"});
//             dialogRef.afterClosed().subscribe(()=>{
//                 this.setDataIntoRow()
//             })
//         }
}
