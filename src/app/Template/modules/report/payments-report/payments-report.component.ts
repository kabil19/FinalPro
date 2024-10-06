import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular } from "ag-grid-angular";
import {
    CellClickedEvent,
    ColDef,
    GridApi,
    GridReadyEvent,
} from "ag-grid-community";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { IConfirmInvoiceEntity } from 'src/app/constants/interfaces/IConfirmInvoiceEntity';
import { IConfirmPurchaseEntity } from 'src/app/constants/interfaces/IConfirmPurchaseEntity';
import { PrintActionComponent } from 'src/app/custom-components/action-cell/print-action/print-action.component';
import { ConfirmInvoiceService } from 'src/app/service/confirmInvoice-service/confirm-invoice.service';
import { ConfirmSalesInvociePaymentService } from 'src/app/service/confirmPaymentServices/ConfirmSalesInvoiceService/confirm-sales-invocie-payment.service';
import { ConfirmPurchasePaymentService } from 'src/app/service/confirmPaymentServices/ConfirmedPurchaseInvoiceServices/confirm-purchase-payment.service';
import { ConfirmPurchaseAndCartServiceService } from 'src/app/service/confirmPurchase-service/confirm-purchase-and-cart-service.service';
import { ReportsServiceService } from 'src/app/service/reports-service/reports-service.service';

@Component({
    selector: 'app-payments-report',
    templateUrl: './payments-report.component.html',
    styleUrls: ['./payments-report.component.css']
})
export class PaymentsReportComponent {

    @ViewChild('voucherGrid') voucherGrid!: AgGridAngular;
    @ViewChild('receiptGrid') receiptGrid!: AgGridAngular;
    reportType: string = '';
    isReportGenerated!: boolean;
    isReportAvailable: boolean = false;
    showPrintButton: boolean = true;
    selectedValue: string = '';
    filterOptions!: Observable<any[]>
    filterOptionPurchase!: Observable<any[]>
    public rowSelection: "single" | "multiple" = "single";
    confirmPurchaseDataList: IConfirmPurchaseEntity[] = []
    confirmSalesInvoiceDataList: IConfirmInvoiceEntity[] = []
    invoiceId!: any
    dataToSet: any = { reportType: '', result: null, error: null, };
    reports: any[] = [
        { value: 'voucherReprint', viewValue: 'Voucher Re-print' },
        { value: 'receiptReprint', viewValue: 'Receipt Re-print' },
        { value: 'allPaymentsReports', viewValue: 'All Payments Report' },
        { value: 'customPaymentsReport', viewValue: 'Custom Payments Report' },
    ];

    reportCategory: any[] = [
        { value: 'purchaseInvoice', viewValue: 'Purchase Invoice' },
        { value: 'salesInvoice', viewValue: 'Sales Invoice' },
    ]


    invoiceSelection: FormGroup;
    purchaseInvoiceControl = new FormControl('');
    salesInvoiceNoControl = new FormControl('');
    range: FormGroup;

    purchaseInvoiceRowData$!: Observable<any[]>;
    voucherGridApi: GridApi | any = {};

    salesInvoiceRowData$!: Observable<any[]>;
    receiptGridApi: GridApi | any = {};

    constructor(
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
        private reportsService: ReportsServiceService,
        private confirmSalesPurchasePaymentsService: ConfirmSalesInvociePaymentService,
        private confirmPurchasePaymentService: ConfirmPurchasePaymentService,
        private confirmedInvoiceService: ConfirmInvoiceService,
        private confirmedPurchaseInvoiceService: ConfirmPurchaseAndCartServiceService,

    ) {
        // this.confirmPurchaseDataList = GLOBAL_LIST.CONFIRM_PURCHASE_DATA
        // this.confirmSalesInvoiceDataList = GLOBAL_LIST.CONFIRM_SALES_DATA
        this.invoiceSelection = new FormGroup({
            refNo: new FormControl(null, [Validators.required]),
            selectedOpt: new FormControl(this.reports[2].value),
            reportType: new FormControl(null, [Validators.required]),
        });

        this.range = new FormGroup({
            start: new FormControl(new Date(), [Validators.required,]),
            end: new FormControl(new Date(), [Validators.required,]),
        });

    }
    onReportTypeChange(newType: string) {
        this.reportType = newType;
        this.updateButtonVisibility();
    }
    updateButtonVisibility() {
        this.showPrintButton = this.reportType !== 'receiptReprint' && this.reportType !== 'voucherReprint';
        this.invoiceSelection.get('refNo')?.setValue('');
        this.clearInvoiceReferences()
        this.cdr.detectChanges();
    }
    clearInvoiceReferences() {
        this.invoiceSelection.get('refNo')?.setValue('');
        this.purchaseInvoiceControl.patchValue('');
        this.salesInvoiceNoControl.patchValue('');
        this.invoiceId = null;
    }
    displayCustomerName(id: any): any {
        const salesInvoice = this.confirmSalesInvoiceDataList.find((obj) => obj.invoiceNumberRef === id);
        return salesInvoice ? `${salesInvoice.invoiceNumberRef} | ${salesInvoice.customerOBJ.custName}` : undefined;
    }

    displayVendorName(id: any): any {
        const purchase = this.confirmPurchaseDataList.find((obj) => obj.purchaseInvoice === id);
        return purchase ? `${purchase.purchaseInvoice} | ${purchase.vendorOBJ.vendorName}` : undefined;
    }


    ngOnInit() {
        if (this.confirmPurchaseDataList.length == 0 && this.confirmSalesInvoiceDataList.length == 0) {
            this.getAllConfirmInvoice()
            this.getAllConfirmPurchaseInvoice()
        }
        this.isReportGenerated = false
        this.filterOptionPurchase = this.purchaseInvoiceControl.valueChanges.pipe(
            startWith(""),
            map((value) => this.listFilterPurchase(value || ""))
        );

        this.filterOptions = this.salesInvoiceNoControl.valueChanges.pipe(
            startWith(""),
            map((value) => this.listFilterSalesInvoice(value || ""))
        );
    }
    getAllConfirmInvoice() {
        this.confirmedInvoiceService.getAllConfirmedInvoices().subscribe((invoiceData) => {
            this.confirmSalesInvoiceDataList = invoiceData?.result
        })
    }

    getAllConfirmPurchaseInvoice() {
        this.confirmedPurchaseInvoiceService.getAllConfirmPurchaseInvoices().subscribe((purchaseData) => {
            this.confirmPurchaseDataList = purchaseData?.result
        })
    }


    onCellClicked(cellClickedEvent: CellClickedEvent) { }


    private listFilterSalesInvoice(value: string): any[] {
        const searchValue = value.toString().toLowerCase();
        return this.confirmSalesInvoiceDataList.filter(
            option =>
                option.invoiceNumberRef.toString().toLowerCase().includes(searchValue)
                ||
                option.customerOBJ.custName.toString().toLowerCase().includes(searchValue)
        )

    }
    private listFilterPurchase(value: string): any[] {
        const searchValue = value.toString().toLowerCase();
        return this.confirmPurchaseDataList.filter(
            option =>
                option.purchaseInvoice.toString().toLowerCase().includes(searchValue)
                ||
                option.vendorOBJ.vendorName.toString().toLowerCase().includes(searchValue)
        )

    }

    handleError(error: HttpErrorResponse) {
        // console.error('Error fetching report:', error);

        let errorMessage = 'An unexpected error occurred. Please try again later.';

        if (error.status === 403) {
            errorMessage = 'Error Generating report!';
        } else if (error.status === 404) {
            errorMessage = 'The requested resource was not found.';
        } else if (error.status === 500) {
            errorMessage = 'There was an error.';
        }

        this.toastr.error(errorMessage);
    }

    getPurchaseInvoicePayments(start: any, end: any) {

        this.reportsService.selectAllPurchaseInvoicePaymentsWithInRange(start, end).subscribe((res) => {
            if (res?.result) {
                this.isReportAvailable = true
                this.dataToSet = {
                    dateRange: start + "-" + end,
                    reportType: "Purchase Payments",
                    result: res.result,
                    error: null
                }
            } else if (res?.errors) {
                this.isReportAvailable = false
                this.dataToSet = {
                    reportType: "Purchase Payments",
                    error: res.errors,
                    result: null
                }
            }
            this.isReportGenerated = true
            this.cdr.detectChanges()
        }, error => this.handleError(error))
    }

    getSalesInvoicePayments(start: any, end: any) {


        this.reportsService.selectAllSalesInvoicePaymentsWithInRange(start, end).subscribe(
            (res) => {
                if (res?.result) {
                    this.isReportAvailable = true
                    this.dataToSet = {
                        dateRange: start + "-" + end,
                        reportType: "Sales Payments",
                        result: res.result,
                        error: null
                    }
                } else if (res?.errors) {
                    this.isReportAvailable = false
                    this.dataToSet = {
                        reportType: "Sales Payments",
                        error: res.errors,
                        result: null
                    }
                }


                this.isReportGenerated = true
                this.cdr.detectChanges();
            }, error => this.handleError(error))
    }

    getSelectedPurchaseInvoicePayments(purchaseInvoiceId: any, start: any, end: any) {
        this.reportsService.selectAllPaymentsOfThePurchaseInvoiceWithInTheRange(purchaseInvoiceId, start, end).subscribe((res) => {
            if (res?.result) {
                this.isReportAvailable = true
                this.dataToSet = {
                    dateRange: start + "-" + end,
                    reportType: "Custom Purchase Payments",
                    result: res.result,
                    error: null
                }
            } else if (res?.errors) {
                this.isReportAvailable = false
                this.dataToSet = {
                    reportType: "Custom Purchase Payments",
                    error: res.errors,
                    result: null
                }
            }
            this.isReportGenerated = true
            this.cdr.detectChanges()
        }, error => {
            if (purchaseInvoiceId == undefined) {
                this.toastr.error("Select an existing Invoice ref!")
            }
        });
    }

    getSelectedSalesInvoicePayments(invoiceId: number, start: any, end: any) {


        this.reportsService.selectAllPaymentsOfTheSalesInvoiceWithInTheRange(invoiceId, start, end).subscribe(
            (res) => {
                if (res?.result) {
                    this.isReportAvailable = true
                    this.dataToSet = {
                        dateRange: start + "-" + end,
                        reportType: "Custom Sales Payments",
                        result: res.result,
                        error: null
                    }
                } else if (res?.errors) {
                    this.isReportAvailable = false
                    this.dataToSet = {
                        reportType: "Custom Sales Payments",
                        error: res.errors,
                        result: null
                    }
                }
                this.isReportGenerated = true
                this.cdr.detectChanges();
            }, error => {
                if (invoiceId == undefined) {
                    this.toastr.error("Select an existing Sales Invoice ref!")
                }
            });
    }

    getTheSelectedInvoiceId(invoice: any) {
        this.invoiceId = invoice
    }

    public voucherDef: ColDef[] = [
        {
            headerName: "#",
            valueGetter: "node.rowIndex + 1",
            width: 30
        },
        {
            field: "voucherId",
            colId: "voucherId",
            headerName: "V- ID",
            width: 100,
            valueFormatter: (params) => {
                const val = "CLC-V-" + (params.value)
                return val
            }

        },
        {
            field: "paidDate",
            colId: "paidDate",
            headerName: "Voucher Date",
            valueFormatter: (params) => {
                const val = (params.value)
                let dateTime = moment(new Date(val)).format("DD/MM/YYYY HH:mm:ss");
                dateTime = dateTime.split(' ')[0] + " | " + dateTime.split(' ')[1]
                return dateTime
            }
        },

        {
            field: "paidAmount",
            colId: "paidAmount",
            headerName: "Paid Amount",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }
        },
        {
            field: "paymentType",
            colId: "paymentType",
            headerName: "Payment Type",
            valueFormatter: (params) => {
                const val = params.value.toUpperCase()
                return val
            },
            width: 149

        },
        {
            field: "action",
            headerName: "Action",
            cellRenderer: PrintActionComponent,
            cellRendererParams: {
                actionName: 'voucherData'
            }
        },
    ];
    public receiptDef: ColDef[] = [
        {
            headerName: "#",
            valueGetter: "node.rowIndex + 1",
            width: 30
        },
        {
            field: "receiptId",
            colId: "receiptId",
            headerName: "R- ID",
            width: 100,
            valueFormatter: (params) => {
                const val = "CLC-R-" + (params.value)
                return val
            }

        },
        {
            field: "paidDate",
            colId: "paidDate",
            headerName: "Receipt Date",
            valueFormatter: (params) => {
                const val = (params.value)
                let dateTime = moment(new Date(val)).format("DD/MM/YYYY HH:mm:ss");
                dateTime = dateTime.split(' ')[0] + " | " + dateTime.split(' ')[1]
                return dateTime
            }
        },

        {
            field: "paidAmount",
            colId: "paidAmount",
            headerName: "Paid Amount",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }
        },
        {
            field: "paymentType",
            colId: "paymentType",
            headerName: "Payment Type",
            valueFormatter: (params) => {
                const val = params.value.toUpperCase()
                return val
            },
            width: 149

        },
        {
            field: "action",
            headerName: "Action",
            cellRenderer: PrintActionComponent,
            cellRendererParams: {
                actionName: 'receiptData'
            }
        },
    ];



    onGridVoucherDataReady(param: GridReadyEvent) {
        this.purchaseInvoiceRowData$ = this.getVoucherRowData();
        this.voucherGridApi = param?.api;
        console.log("on grid ready function", this.voucherGridApi)
    }
    onGridReceiptDataReady(param: GridReadyEvent) {

        this.salesInvoiceRowData$ = this.getReceiptRowData();
        this.receiptGridApi = param?.api;

    }


    private getVoucherRowData(): any {
        console.log("voucherId", this.invoiceId)
        return new Promise((resolve) => {
        });
    }
    private getReceiptRowData(): any {
        console.log("invoiceId", this.invoiceId)

        return new Promise((resolve) => {
            resolve([]);

        });
    }


    printReport() {
        const printDoc = document.getElementById("printSection");
        if (printDoc) {
            html2canvas(printDoc, { scale: 3 }).then(canvas => {

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
    generateReport() {
        this.isReportGenerated = true;
        const selectedOpt = this.invoiceSelection.get('selectedOpt');
        const reportType = this.invoiceSelection.get('reportType');
        const ref = this.invoiceSelection.get('refNo');
        const startDate = this.range.get('start')?.value;
        const endDate = this.range.get('end')?.value;
        if (selectedOpt?.value) {
            switch (selectedOpt.value) {
                case 'voucherReprint':
                    console.log('Generating Voucher Re-print report for:', this.invoiceId);
                    this.confirmPurchasePaymentService.getAllVoucherOfTheSelectedRefNo(this.invoiceId).subscribe((res) => {
                        // this.isReportGenerated = true;
                        if (res?.result) {
                            this.voucherGridApi.setRowData(res.result)
                        } else {
                            this.voucherGridApi.setRowData([])
                        }
                        this.cdr.detectChanges();

                    }, (error) => {
                        if (this.invoiceId == undefined) {
                            this.toastr.error("Select an existing Purchase Invoice ref!")
                            return
                        } this.handleError(error)
                    })
                    break;
                case 'receiptReprint':
                    console.log('Generating Voucher Re-print report for:', this.invoiceId);
                    // this.isReportGenerated = true;
                    this.confirmSalesPurchasePaymentsService.getAllReceiptsOfTheSelectedRefNo(this.invoiceId).subscribe((res) => {
                        if (res?.result) {
                            this.receiptGridApi.setRowData(res.result);
                        } else {
                            this.receiptGridApi.setRowData([]);
                        }
                        this.cdr.detectChanges();

                    }, (error) => {
                        if (this.invoiceId == undefined) {
                            this.toastr.error("Select an existing Sales Invoice ref!")
                            return
                        } this.handleError(error)
                    })
                    break;
                case 'allPaymentsReports':
                    console.log('Generating all Payments report', this.invoiceId);
                    switch (reportType?.value) {
                        case 'purchaseInvoice':
                            this.getPurchaseInvoicePayments(startDate, endDate)
                            break;
                        case 'salesInvoice':
                            this.getSalesInvoicePayments(startDate, endDate)
                    }
                    break;
                case 'customPaymentsReport':
                    console.log('Generating custom Reports for')
                    switch (reportType?.value) {
                        case 'purchaseInvoice':
                            this.getSelectedPurchaseInvoicePayments(this.invoiceId, startDate, endDate)
                            break;
                        case 'salesInvoice':
                            this.getSelectedSalesInvoicePayments(this.invoiceId, startDate, endDate)
                    }
                    break;
                default:
                    console.error('Invalid report type selected');

            }
        } else {
            this.toastr.clear()
            this.toastr.warning("Select A Report Type To Generate any!")
        }

    }

}

