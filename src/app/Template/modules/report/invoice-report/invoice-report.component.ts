import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { IConfirmInvoiceEntity } from 'src/app/constants/interfaces/IConfirmInvoiceEntity';
import { IDataToSet } from 'src/app/constants/interfaces/IDataToSetForReports';
import { ConfirmInvoiceService } from 'src/app/service/confirmInvoice-service/confirm-invoice.service';
import { EmailService } from 'src/app/service/email-service/email.service';
import { ReportsServiceService } from 'src/app/service/reports-service/reports-service.service';
import { EmailFormComponent } from 'src/app/Template/createData-forms/email-form/email-form.component';

@Component({
    selector: 'app-invoice-report',
    templateUrl: './invoice-report.component.html',
    styleUrls: ['./invoice-report.component.css']
})

export class InvoiceReportComponent {

    isReportGenerated: boolean = false;
    isReportAvailable: boolean = false;
    selectedValue: string = '';
    filterOptions!: Observable<IConfirmInvoiceEntity[]>
    salesInvoiceDataList: IConfirmInvoiceEntity[] = []
    invoiceNo!: number
    dataToSet: any = { reportType: '', result: null, error: null };
    reports: any[] = [
        { value: 'invoiceReprint', viewValue: 'Invoice Re-print' },
        { value: 'salesReport', viewValue: 'Sales Report' },
    ];
    invoiceSelection: FormGroup;
    invoiceNoControl = new FormControl('');
    range: FormGroup;
    custEmailId!: string;
    constructor(
        private confirmedInvoiceService: ConfirmInvoiceService,
        private cdr: ChangeDetectorRef,
        private reportsService: ReportsServiceService,
        private matDialog: MatDialog,
        private toastr: ToastrService

    ) {
        // this.salesInvoiceDataList = GLOBAL_LIST.CONFIRM_SALES_DATA


        this.invoiceSelection = new FormGroup({
            invoiceNo: new FormControl([Validators.required]),
            selectedOpt: new FormControl(this.reports[1].value),
        });

        this.range = new FormGroup({
            start: new FormControl(new Date(), [Validators.required,]),
            end: new FormControl(new Date(new Date().setDate(new Date().getDate() + 30)), [Validators.required,]),
        });

    }

    ngOnInit() {
        // if the page is refreshed, the list becomes empty, so this makes sure to stream the data again into the list,
        // which prevents us to go back to report to load the data again
        if (this.salesInvoiceDataList.length == 0) {
            this.getAllSalesInvoice()
        }
        this.isReportGenerated = false
        this.filterOptions = this.invoiceNoControl.valueChanges.pipe(
            startWith(""),
            map((value) => this.listFilter(value || ""))
        );
        const invoiceNum = this.invoiceSelection.get('invoiceNo');

        this.invoiceNoControl.valueChanges.subscribe(res => {
            const foundItem = this.salesInvoiceDataList.find(item => item.invoiceNumberRef === res);
            if (!foundItem) {
                this.salesInvoiceDataList = this.salesInvoiceDataList; // or some other action you want to take
            }
        })
    }

    getAllSalesInvoice() {
        this.confirmedInvoiceService.getAllConfirmedInvoices().subscribe((invoiceData) => {
            this.salesInvoiceDataList = invoiceData?.result
        })
    }

    private listFilter(value: string): IConfirmInvoiceEntity[] {

        const searchValue = value.toString().toLowerCase();
        return this.salesInvoiceDataList.filter(
            option =>
                option.confirmInvoiceId.toString().toLowerCase().includes(searchValue)
                ||
                option.customerOBJ.custName.toString().toLowerCase().includes(searchValue)
        )

    }
    generateReport() {
        const invoiceNum = this.invoiceSelection.get('invoiceNo');
        const selectedOpt = this.invoiceSelection.get('selectedOpt');
        const startDate = this.range.get('start');
        const endDate = this.range.get('end');


        if (invoiceNum != null && selectedOpt?.value == "invoiceReprint") {
            this.getConfirmedInvoiceByInvoiceNo()

        } else if (selectedOpt?.value == "salesReport" && (startDate != null && endDate != null)) {
            this.getConfirmedInvoiceByRange(startDate.value, endDate.value)
        }

    }


    getConfirmedInvoiceByInvoiceNo() {
        // this.isReportGenerated = false
        this.confirmedInvoiceService.getAllConfirmedProCartItemsByInvoiceId(this.invoiceNo).subscribe((res) => {

            if (res?.result) {
                this.isReportAvailable = true
                this.dataToSet = {
                    reportType: "Invoice Reprint",
                    result: res?.result,
                    error: null
                }

            } else if (res?.errors) {
                this.isReportAvailable = false
                this.dataToSet = {
                    reportType: "Invoice Reprint",
                    result: null,
                    error: res.errors
                }
            }
            this.isReportGenerated = true
            this.cdr.detectChanges();
        }, error => {
            if (this.invoiceNo == undefined) {
                this.toastr.error("Select an existing invoice!")
                return
            }

            this.handleError(error)
        })
    }

    getConfirmedInvoiceByRange(start: any, end: any) {
        this.reportsService.selectSalesReportWithInRange(start, end).subscribe(
            (res) => {
                if (res?.result) {
                    this.isReportAvailable = true
                    this.dataToSet = {
                        dateRange: start + "-" + end,
                        reportType: "Sales Report",
                        result: res?.result,
                        error: null
                    }

                } else if (res?.errors) {
                    this.isReportAvailable = false
                    this.dataToSet = {
                        reportType: "Sales Report",
                        result: null,
                        error: res.errors
                    }
                }
                this.isReportGenerated = true
                this.cdr.detectChanges()

            }, error => {
                this.handleError(error)
            })
    }

    handleError(error: HttpErrorResponse) {
        console.error('Error fetching report:', error);

        let errorMessage = 'An unexpected error occurred. Please try again later.';

        if (error.status === 403) {
            errorMessage = 'You do not have permission to access this resource.';
        } else if (error.status === 404) {
            errorMessage = 'The requested resource was not found.';
        } else if (error.status === 500) {
            errorMessage = 'There was a server-side error. Please try again later.';
        }

        this.toastr.error(errorMessage, 'Error ' + error.status);

    }

    getTheCustomerDetails(invoiceNumber: number, custEmailId: string) {
        this.invoiceNo = invoiceNumber
        this.custEmailId = custEmailId
    }

    displayCustomerName(id: any): any {
        const salesInvoice = this.salesInvoiceDataList.find((obj) => obj.invoiceNumberRef === id);
        return salesInvoice ? `${salesInvoice.invoiceNumberRef} | ${salesInvoice.customerOBJ.custName}` : undefined;
    }
    printReport() {
        const stockTempDoc = document.getElementById("stockTemp");
        if (stockTempDoc) {
            html2canvas(stockTempDoc, { scale: 3 }).then(canvas => {

                const imgData = canvas.toDataURL('image/jpeg');

                const pdf = new jsPDF('p', 'mm', 'a4');

                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

                const pdfWindow = window.open('', '_blank');
                if (pdfWindow) {
                    pdfWindow.document.open();
                    pdfWindow.document.write('<html><head><title>Report</title></head><body>');
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
        const stockTempDoc = document.getElementById("stockTemp");
        const data = {
            reportType: this.invoiceSelection.get('selectedOpt')?.value,
            custEmail: this.custEmailId
        }
        if (stockTempDoc) {
            const openForm = this.matDialog.open(EmailFormComponent, {
                data: { reportPic: stockTempDoc, extraDetails: data }, panelClass: ['custom-dialog-container'], backdropClass: "dialogbox-backdrop"
            });
        } else {
            this.toastr.error('Error occurred while generating the report');
        }
    }


}
