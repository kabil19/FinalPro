import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { IConfirmPurchaseEntity } from 'src/app/constants/interfaces/IConfirmPurchaseEntity';
import { IDataToSet } from 'src/app/constants/interfaces/IDataToSetForReports';
import { ReportsServiceService } from 'src/app/service/reports-service/reports-service.service';

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css']
})
export class PurchaseReportComponent {

    isReportGenerated!: boolean;
    isReportAvailable:boolean =false
    selectedValue: string = '';
    filterOptions!: Observable<IConfirmPurchaseEntity[]>
    purchaseInvoiceDataList!: IConfirmPurchaseEntity[]
    invoiceNo! :number
    dataToSet: any = { reportType: '', result: null ,error:null};
    reports: any[] = [
        // { value: 'voucherReprint', viewValue: 'Voucher Re-print'},
        { value: 'purchaseReport', viewValue: 'Purchase Report'},
    ];
    invoiceSelection: FormGroup;
    invoiceNoControl = new FormControl('');
    range: FormGroup;

    constructor(
        // private confirmedInvoiceService: ConfirmInvoiceService,
        private cdr: ChangeDetectorRef,
        private reportsService:ReportsServiceService,
        private toastr :ToastrService
    ) {
        // this.dataToSet 
        this.purchaseInvoiceDataList = GLOBAL_LIST.CONFIRM_PURCHASE_DATA

        this.invoiceSelection = new FormGroup({
            invoiceNo: new FormControl,
            selectedOpt: new FormControl,
        });

        this.range = new FormGroup({
            start: new FormControl(new Date(), [Validators.required,]),
            end: new FormControl(new Date(), [Validators.required,]),
        });

    }

    ngOnInit() {
        this.invoiceSelection.get('selectedOpt')?.setValue(this.reports[0].value)
        this.isReportGenerated = false
        this.filterOptions = this.invoiceNoControl.valueChanges.pipe(
            startWith(""),
            map((value) => this.listFilter(value || ""))
        );
    }


    private listFilter(value: string): IConfirmPurchaseEntity[] {

        const searchValue = value.toString().toLowerCase();
        return this.purchaseInvoiceDataList.filter(
            option =>
                option.confirmPurchaseId.toString().toLowerCase().includes(searchValue)
            ||
            option.vendorOBJ.vendorName.toString().toLowerCase().includes(searchValue)
        )

    }
    generateReport() {
        const invoiceNum = this.invoiceSelection.get('invoiceNo');
        const selectedOpt = this.invoiceSelection.get('selectedOpt');
        const startDate = this.range.get('start');
        const endDate = this.range.get('end');

       
        if(invoiceNum!=null && selectedOpt?.value=="voucherReprint"){   
            // this.getConfirmedInvoiceByInvoiceNo()
           
        }else if(selectedOpt?.value=="purchaseReport" &&(startDate!=null && endDate !=null)){
            this.getConfirmedInvoiceByRange(startDate.value,endDate.value)
        }
       
    }


    // getConfirmedInvoiceByInvoiceNo(){
    //     this.confirmedInvoiceService.getAllConfirmedProCartItemsByInvoiceId(this.invoiceNo).subscribe((res) => {
    //        this.dataToSet = {
    //             reportType :"voucherReprint",
    //             result: res?.result
    //        }
    //         this.isReportGenerated = true
    //         this.cdr.detectChanges();
    //     })
    // }

    getConfirmedInvoiceByRange(start: any, end: any){
        this.reportsService.selectPurchaseReportWithInRange(start, end).subscribe(
            (res) => {
                if(res?.result){
                    this.isReportAvailable = true
                    this.dataToSet = {
                        dateRange:start +"-"+ end,
                        reportType :"Purchase Report",
                        result: res.result,
                        error:null
                   }
                }else if(res?.errors){
                    this.isReportAvailable = false
                    this.dataToSet = {
                        reportType :"Purchase Report",
                        error: res.errors,
                        result:null
                   }
                }
               this.isReportGenerated = true
               this.cdr.detectChanges();
            },(error: HttpErrorResponse) => {
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
        );
    }

    // getAllConfirmInvoice() {
    //     this.isReportGenerated = true
    //     this.confirmedInvoiceService.getAllConfirmedInvoices().subscribe((invoiceData) => {
    //         this.dataToSet = invoiceData?.result
    //         // this.salesInvoiceDataList = invoiceData?.result 
    //         // console.log(invoiceData?.result)

    //     })
    //     // this.stockService.getAll().subscribe((res)=>{
    //     //     this.data = res
    //     //     this.isReportGenerated = true
    //     //     this.cdr.detectChanges();
    //     // })
    // }

    getTheSelectedInvoice(invoiceNumber: number) {
        this.invoiceNo = invoiceNumber
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
