import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { IVendorEntity } from 'src/app/constants/interfaces/IVendorEntity';
import { ReportsServiceService } from 'src/app/service/reports-service/reports-service.service';
import { VendorService } from 'src/app/service/vendor-service/vendor.service';
@Component({
    selector: 'app-vendor-report',
    templateUrl: './vendor-report.component.html',
    styleUrls: ['./vendor-report.component.css']
})
export class VendorReportComponent {
    vendorReportForm: FormGroup;
    filterOptions!: Observable<IVendorEntity[]>;
    isReportGenerated!: boolean;
    isReportAvailable: boolean = false;
    vendorId!: number
    dataToSet: any = { reportType: '', result: null, error: null };
    range: FormGroup;
    vendorDataList: IVendorEntity[] = []
    reports: any[] = [
        { value: 'vendorReport', viewValue: 'Vendor Report With in Range' },

    ];
    vendorControl = new FormControl('');
    constructor(
        // private confirmedInvoiceService: ConfirmInvoiceService,
        private cdr: ChangeDetectorRef,
        private reportsService: ReportsServiceService,
        private vendorService: VendorService,
        private toastr: ToastrService,
    ) {
        // this.vendorDataList = GLOBAL_LIST.VENDOR_DATA

        this.vendorReportForm = new FormGroup({
            selectedOpt: new FormControl(this.reports[0].value),
            vendor: new FormControl('', [Validators.required,]),
        });

        this.range = new FormGroup({
            start: new FormControl(new Date(), [Validators.required,]),
            end: new FormControl(new Date(), [Validators.required,]),
        });

    }
    ngOnInit() {
        if (this.vendorDataList.length == 0) {
            this.getAllVendors()
        }
        this.isReportGenerated = false
        // this.customerReportForm.get('selectedOpt')?.setValue(this.reports[0].value);
        this.filterOptions = this.vendorControl.valueChanges.pipe(
            startWith(""),
            map((value) => this.listFilter(value || ""))
        );
    }

    displayVendorName(id: any): any {
        const vendor = this.vendorDataList.find((obj) => obj.vendorId === id);
        return vendor ? `${vendor.vendorId} | ${vendor.vendorName}` : undefined;
    }
    getAllVendors() {
        this.vendorService.getAll().subscribe((vendorData) => {
            this.vendorDataList = vendorData
        })

    }

    private listFilter(value: string): IVendorEntity[] {

        const searchValue = value.toString().toLowerCase();
        return this.vendorDataList.filter(
            option =>
                option.vendorId.toString().toLowerCase().includes(searchValue)
                ||
                option.vendorName.toString().toLowerCase().includes(searchValue)
        )

    }


    generateReport() {
        const selectedCustomer = this.vendorReportForm.get('customer');
        const startDate = this.range.get('start');
        const endDate = this.range.get('end');

        if (startDate && endDate) {
            this.selectAllPaymentsOfaVendorWithInRange(this.vendorId, startDate.value, endDate.value)
        } else {
            this.toastr.warning("Date Range Can't be Empty!")
        }

    }
    getVendorId(vendorId: number) {
        this.vendorId = vendorId
    }

    onVendorFocus() {
        if (!this.vendorControl?.value) {
            this.vendorControl.setValue('')
        }
    }
    selectAllPaymentsOfaVendorWithInRange(id: number, startDate: any, endDate: any) {
        this.reportsService.selectAllPaymentsOfaVendorWithInRange(id, startDate, endDate).subscribe(res => {
            if (res?.result) {
                this.isReportAvailable = true
                this.dataToSet = {
                    dateRange: startDate + "-" + endDate,
                    reportType: "Vendor Report",
                    result: res?.result,
                    error: null
                }

            } else if (res?.errors) {
                this.isReportAvailable = false
                this.dataToSet = {
                    reportType: "Vendor Report",
                    result: null,
                    error: res.errors
                }
            }
            this.isReportGenerated = true
            this.cdr.detectChanges();
        }, (error) => {
            if (this.vendorId == undefined) {
                this.toastr.error("Select an existing vendor!")
                return
            }

        }
        )
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
