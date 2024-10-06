import { Component, Inject } from '@angular/core';
import { InvoicePaymentComponent } from '../../payments/invoice-payment/invoice-payment.component';
import { ActionPopComponent } from 'src/app/custom-components/action-cell/action-pop/action-pop.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { IProCartEntity } from 'src/app/constants/interfaces/IProCartEntity';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaymentsService } from 'src/app/service/payments-service/payments.service';
import { ConfirmInvoiceService } from 'src/app/service/confirmInvoice-service/confirm-invoice.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IInvoiceEntity } from 'src/app/constants/interfaces/IInvoiceEntity';
import { IPaymentEntity } from 'src/app/constants/interfaces/IPaymentEntity';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { EmailFormComponent } from '../../createData-forms/email-form/email-form.component';
import { NotificationService } from 'src/app/service/notification-service/notification.service';

@Component({
    selector: 'app-invoice-print',
    templateUrl: './invoice-print.component.html',
    styleUrls: ['./invoice-print.component.css']
})
export class InvoicePrintComponent {
    paymentsList: IPaymentEntity[] = [];


    selectedCustomer!: any;
    productCartItems: IProCartEntity[] = [];

    total: any;
    paidAmount!: number;
    balance!: number;

    isComplete!: boolean;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private matDialogRef: MatDialogRef<InvoicePrintComponent>,
        private matDialog: MatDialog,
        private paymentService: PaymentsService,
        private confirmInvoice: ConfirmInvoiceService,
        private router: Router,
        private toastr: ToastrService,
        private notificationService: NotificationService
    ) {

        this.productCartItems = GLOBAL_LIST.PRODUCTCART_DATA;
        this.calcValues(this.productCartItems);
        this.paidAmount = this.data?.invoiceDataParam?.paidAmount;
        this.balance = this.total - this.paidAmount;

    }
    ngOnInit(): void {
        console.log("this.data", this.data)
    }

    calcValues(list: IProCartEntity[]) {
        this.total = list.reduce(
            (subTotal, item) => subTotal + item.netAmount, 0);
    }

    triggerNotification() {
        this.notificationService.fetchnotificationData();
    }

    openPDF() {
        const invoiceDOC = document.getElementById("invoice");
        if (invoiceDOC) {
            html2canvas(invoiceDOC, { scale: 3 }).then(canvas => {

                const imgData = canvas.toDataURL('image/jpeg');

                const pdf = new jsPDF('p', 'mm', 'a4');

                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

                const pdfWindow = window.open('', '_blank');
                if (pdfWindow) {
                    pdfWindow.document.open();
                    pdfWindow.document.write('<html><head><title>Invoice</title></head><body>');
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

    completeInvoice() {
        const extraData = {
            title: "Confirm Invoice",
            subTitle: "Do you want confirm this invoice?",
        };
        const popUpOpen = this.matDialog.open(ActionPopComponent, {
            data: extraData,
            panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop"
        });

        popUpOpen.afterClosed().subscribe((state: boolean) => {
            if (!state) return;
            this.isComplete = true;
            this.confirmInvoice
                .addToConfirmInovie(this.data?.invoiceDataParam?.tempInvoiceId)
                .subscribe((res) => {
                    this.matDialogRef.close();
                    if (this.isComplete) {
                        this.router.navigate(["/dash_board/"]);
                        this.toastr.success(res.successMessage);
                        this.triggerNotification()
                    } else if (res.successMessage) {
                        this.toastr.error(res.errors)
                    }
                }, err => {
                    this.toastr.error(err, "Error Confirming the Sales Invoice!")
                });
        });
    }


    getAllPayments() {

        this.paymentService.getAllPayments(this.data?.invoiceDataParam?.tempInvoiceId).subscribe((res) => {
            // GLOBAL_LIST.PAYMENTS_DATA = res.result;
            this.paymentsList = res.result;
            GLOBAL_LIST.PAYMENTS_DATA = res.result

            //#cmt calculatePaidAmount has been called once the paymentList is initialized, tried calling it after the
            // 'getAllPayemnt()' in the makePayment(), the call timing is missing
            // this.calculatePaidAmount();
        });
    }

    openMailForm() {

        const generateReport = document.getElementById("invoice");
        const data = {
            reportType: "Invoice",
            custEmail: this.data?.invoiceDataParam?.customerOBJ.email
        }

        if (generateReport) {
            const openForm = this.matDialog.open(EmailFormComponent, {
                data: { reportPic: generateReport, extraDetails: data }, panelClass: ['custom-dialog-container'], backdropClass: "dialogbox-backdrop"
            });
        } else {
            this.toastr.error('Error occurred while generating the report');
        }
    }

}
