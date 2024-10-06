import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { ICustomerEntity } from 'src/app/constants/interfaces/CustomerEntity';
import { CustomerService } from 'src/app/service/customer-service/customer.service';
import { ReportsServiceService } from 'src/app/service/reports-service/reports-service.service';

@Component({
    selector: 'app-customer-report',
    templateUrl: './customer-report.component.html',
    styleUrls: ['./customer-report.component.css']
})
export class CustomerReportComponent implements OnInit {
    customerReportForm: FormGroup;
    filterOptions!: Observable<ICustomerEntity[]>;
    isReportGenerated!: boolean;
    isReportAvailable: boolean = false;
    custId!: number
    dataToSet: any = { reportType: '', result: null, error: null };
    range: FormGroup;
    customerDataList: ICustomerEntity[] = []
    reports: any[] = [
        { value: 'customerReport', viewValue: 'Customer Report With in Range' },

    ];
    customerControl = new FormControl('');
    constructor(
        // private confirmedInvoiceService: ConfirmInvoiceService,
        private cdr: ChangeDetectorRef,
        private reportsService: ReportsServiceService,
        private customerService: CustomerService,
        private toastr: ToastrService,

    ) {
        // this.customerDataList = GLOBAL_LIST.CUSTOMER_DATA

        this.customerReportForm = new FormGroup({
            selectedOpt: new FormControl(this.reports[0].value),
            customer: new FormControl('', [Validators.required,]),
        });

        this.range = new FormGroup({
            start: new FormControl(new Date(), [Validators.required,]),
            end: new FormControl(new Date(), [Validators.required,]),
        });

    }

    displayCustomerName(id: any): any {
        const customer = this.customerDataList.find((obj) => obj.custId === id);
        return customer ? `${customer.custId} | ${customer.custName}` : undefined;
    }
    ngOnInit() {
        if (this.customerDataList.length == 0) {
            this.getAllCustomers();
        }
        this.isReportGenerated = false
        this.filterOptions = this.customerControl.valueChanges.pipe(
            startWith(""),
            map((value) => this.listFilter(value || ""))
        );


    }
    getAllCustomers() {
        this.customerService.getAll().subscribe((customerData) => {
            this.customerDataList = customerData
        })

    }
    private listFilter(value: string): ICustomerEntity[] {

        const searchValue = value.toString().toLowerCase();
        return this.customerDataList.filter(
            option =>
                option.custId.toString().toLowerCase().includes(searchValue)
                ||
                option.custName.toString().toLowerCase().includes(searchValue)
        )

    }

    generateReport() {
        const selectedCustomer = this.customerReportForm.get('customer');
        const startDate = this.range.get('start');
        const endDate = this.range.get('end');

        if (startDate && endDate) {
            this.selectAllPaymentsOfaCustomerWithInRange(this.custId, startDate.value, endDate.value)
        } else {
            this.toastr.warning("Date Range Can't be Empty!")
        }

    }
    getCustId(custId: number) {
        this.custId = custId
    }

    onCustomerFocus() {
        // Check if the customerControl value is empty or not
        if (!this.customerControl.value) {
            // If the value is empty, set it to an empty string to trigger autocomplete options
            this.customerControl.setValue('');
        }
    }

    selectAllPaymentsOfaCustomerWithInRange(id: number, startDate: any, endDate: any) {
        this.reportsService.selectAllPaymentsOfaCustomerWithInRange(this.custId, startDate, endDate).subscribe(res => {
            if (res?.result) {
                this.isReportAvailable = true
                this.dataToSet = {
                    dateRange: startDate + "-" + endDate,
                    reportType: "Customer Report",
                    result: res?.result,
                    error: null
                }

            } else if (res?.errors) {
                this.isReportAvailable = false
                this.dataToSet = {
                    reportType: "Customer Report",
                    result: null,
                    error: res.errors
                }
            }
            this.isReportGenerated = true
            this.cdr.detectChanges();
        }, error => {
            if (this.custId == undefined) {
                this.toastr.error("Select an existing customer!")
                return
            }
        }
        );
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

}
