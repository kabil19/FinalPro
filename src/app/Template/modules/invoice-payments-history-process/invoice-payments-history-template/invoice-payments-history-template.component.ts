import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IConfirmSalesConfirmPayments } from 'src/app/constants/interfaces/IConfirmSalesConfirmPayments';
import { ConfirmSalesInvociePaymentService } from 'src/app/service/confirmPaymentServices/ConfirmSalesInvoiceService/confirm-sales-invocie-payment.service';

@Component({
  selector: 'app-invoice-payments-history-template',
  templateUrl: './invoice-payments-history-template.component.html',
  styleUrls: ['./invoice-payments-history-template.component.css']
})
export class InvoicePaymentsHistoryTemplateComponent {
    confirmSalesInvoiceConfirmPaymentLists : IConfirmSalesConfirmPayments[] =[]
    hasChequePayments:boolean =false
    hasCardPayments:boolean =false

    constructor(
        private dialog: MatDialog,
        private confirmSalesInvociePaymentService:ConfirmSalesInvociePaymentService,
        @Inject(MAT_DIALOG_DATA) public data: any
       
    ) { 
        this.getAllConfirmPaymentsOdConfirmSalesInvoice()
       
    }

    ngOnInit(): void {
        
    }

    getAllConfirmPaymentsOdConfirmSalesInvoice(){
        this.confirmSalesInvociePaymentService.getAllConfirmPaymentsOfConfirmInvoice(this.data?.invoiceData?.confirmInvoiceId).subscribe((invoiceData) => {
            this.confirmSalesInvoiceConfirmPaymentLists = invoiceData?.result
            console.log(this.confirmSalesInvoiceConfirmPaymentLists)
            this.checkForChequeAndCardPayments()
            
            // this.confirmInvoiceDto = paymentsData.confirmInvoiceDto
            // this.customerOBJ = paymentsData.confirmInvoiceDto.customerOBJ
            // this.paidAmount = paymentsData.confirmInvoiceDto
            // this.confirmInvoiceDto = paymentsData.confirmInvoiceDto
            // this.confirmInvoiceDto = paymentsData.confirmInvoiceDto
          }, (err) => {
          })
    
       }
       checkForChequeAndCardPayments() {
        for (const i of this.confirmSalesInvoiceConfirmPaymentLists) {
            if(i.paymentType.toLowerCase()==='card'){
                this.hasCardPayments = true
            }else if(i.paymentType.toLowerCase() == "cheque"){
                this.hasChequePayments = true
            }
        }
        // this.hasChequePayments = this.confirmSalesInvoiceConfirmPaymentLists.some(payment => payment.paymentType.toLowerCase() === 'cheque');
        // this.hasChequePayments = true
        console.log("isCheque ",this.hasChequePayments)
        console.log("isCard ",this.hasCardPayments)
      }
      
}
