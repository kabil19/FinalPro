import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { EmailFormComponent } from '../../createData-forms/email-form/email-form.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-receipt-voucher-print',
  templateUrl: './receipt-voucher-print.component.html',
  styleUrls: ['./receipt-voucher-print.component.css']
})
export class ReceiptVoucherPrintComponent {


    constructor(@Inject(MAT_DIALOG_DATA) public data:any, private matDialog:MatDialog,private toastr:ToastrService){
        console.log("ReceiptVoucherPrintComponent ",this.data)
        if(this.data.confirmPurchaseOBJ){
            console.log("Voucher")
        }else if(this.data.confirmInvoiceOBJ){
            console.log("Receipt")
        }
    }

    openPrintOperation() {
        const doc = this.data.confirmPurchaseOBJ ? 'voucher':this.data.confirmInvoiceOBJ ? 'receipt':'';
        const invoiceDOC = document.getElementById(doc);
        if (invoiceDOC) {
            html2canvas(invoiceDOC, { scale: 3 }).then(canvas => {
        
                const imgData = canvas.toDataURL('image/jpeg');
        
                const pdf = new jsPDF('l', 'mm', 'a5');
        
                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
                
                const pdfWindow = window.open('', '_blank');
              if (pdfWindow) {
                pdfWindow.document.open();
                pdfWindow.document.write('<html><head><title>'+doc+'</title></head><body>');
                pdfWindow.document.write('<img src="' + imgData + '" style="width:100%; height:auto;">');
                pdfWindow.document.write('</body></html>');
                pdfWindow.document.close();
        
                pdfWindow.onload = () => {
                  pdfWindow.print();
                };
        
                pdfWindow.onafterprint = () => pdfWindow.close();
              }
              });
            }
    }

    openMailForm() {
        
        const invoiceDOC = document.getElementById('receipt');
        const data={
            // custEmail : this.custEmailId
        }
        if (invoiceDOC) {
          const openForm = this.matDialog.open(EmailFormComponent, {
            data: { reportPic: invoiceDOC, extraDetails:{reportType:"Receipt",custEmail:this.data.confirmInvoiceOBJ.customerOBJ.email} },panelClass:['custom-dialog-container'],backdropClass: "dialogbox-backdrop"
          });
        } else {
          this.toastr.error('Error occurred while generating the report');
        }
      }


}
