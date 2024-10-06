import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductSelectionToCartComponent } from '../product-selection-to-cart/product-selection-to-cart.component';
import { StockService } from 'src/app/service/stock-service/stock.service';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { CetegoryService } from 'src/app/service/category-service/cetegory.service';
import { ProductSelectionToCartFormComponent } from '../product-selection-to-cart-form/product-selection-to-cart-form.component';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent, CellValueChangedEvent } from 'ag-grid-community';
import { ProductCartService } from 'src/app/service/productCart-service/product-cart.service';
import { InvoiceActionComponent } from 'src/app/custom-components/action-cell/invoice-action/invoice-action.component';
import { ProductCartActionComponent } from 'src/app/custom-components/action-cell/product-cart-action/product-cart-action.component';
import { ICellRendererParams } from 'ag-grid/dist/lib/rendering/cellRenderers/iCellRenderer';
import { InvoiceTemplateForCustomerComponent } from '../invoice-template-for-customer/invoice-template-for-customer.component';
import { IProCartEntity } from '../../../constants/interfaces/IProCartEntity';
import { InvoiceService } from 'src/app/service/invoice-service/invoice.service';
import { IInvoiceEntity } from 'src/app/constants/interfaces/IInvoiceEntity';
import { PrintComponent } from '../../side-bar/nav-settings/print/print.component';
import { InvoicePrintComponent } from '../invoice-print/invoice-print.component';
import { PaymentsService } from 'src/app/service/payments-service/payments.service';
import { InvoicePaymentComponent } from '../../payments/invoice-payment/invoice-payment.component';
import { StatusUpdateService } from 'src/app/service/sharedServiceForStates/status-update.service';
import { IPaymentEntity } from 'src/app/constants/interfaces/IPaymentEntity';
import { NotificationService } from 'src/app/service/notification-service/notification.service';
import { ActionPopComponent } from 'src/app/custom-components/action-cell/action-pop/action-pop.component';
import { ToastrService } from 'ngx-toastr';
import { AdvancePayHistoryComponent } from './advance-pay-history/advance-pay-history.component';


@Component({
    selector: 'app-selected-invoice',
    templateUrl: './selected-invoice.component.html',
    styleUrls: ['./selected-invoice.component.css']
})
export class SelectedInvoiceComponent implements OnInit {

    customerName!: string;
    custId!: number;
    custContact!: number;
    invoiceId!: number;
    invoiceNumber!: number
    jusData!: any
    // totalNetAmount!: number
    netAmount: number = 0
    paidAmount: number = 0
    productCartItems: IProCartEntity[] = []
    rowData$!: Observable<any[]>;
    invoiceData!: IInvoiceEntity[]
    @ViewChild(AgGridAngular)
    agGrid!: AgGridAngular
    gridApi: GridApi | any = {}
    public rowSelection: 'single' | 'multiple' = 'single';
    searchCharac: string = ""
    params: any;
    isProductsAvailableInCart: boolean = false
    paymentsDataList: IPaymentEntity[] = []

    constructor(
        private catService: CetegoryService,
        private stockService: StockService,
        private route: ActivatedRoute,
        private matDialog: MatDialog,
        private productCartService: ProductCartService,
        private cdr: ChangeDetectorRef,
        private invoiceService: InvoiceService,
        private paymentService: PaymentsService,
        private statusUpdateService: StatusUpdateService,
        private notificationService: NotificationService,
        private toastr: ToastrService,
        private router: Router,



    ) {


    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let dataString = params['data']

            dataString = JSON.parse(dataString) as IInvoiceEntity;
            this.invoiceData = dataString
            this.invoiceId = dataString.tempInvoiceId;
            this.customerName = dataString.customerOBJ.custName
            this.custId = dataString.customerOBJ.custId
            this.custContact = dataString.customerOBJ.contact
            this.invoiceNumber = dataString.tempInvoiceNumberRef
            this.paidAmount = dataString.paidAmount
        })

        this.getAllStockAndCategoryData()
        this.getAllInvoiceData();
        this.getAllPayments()
        this.statusUpdateService.tempSalesCartNetAmount$.subscribe(res => {
            this.netAmount = res
        })


        if (this.productCartItems.length <= 0) {
            this.getProductCartItemsOfTheInvoiceId()
        }
    }


    showInvoiceDetails() {

        const invoiceDta = {
            invoiceDataParam: this.invoiceData
        }

        const openInvoice = this.matDialog.open(InvoicePrintComponent, {
            data: invoiceDta,
            panelClass: ["invoice-dialog-container",], width: 'auto', height: 'auto', backdropClass: "dialogbox-backdrop"
        })
        console.log("invoiceData ", this.invoiceData)


    }
    public columnDef: ColDef[] = [


        {
            field: "proCartId",
            colId: "proCartId",
            headerName: "Cart Row ID",
            width: 90,
            hide: true
        },
        {
            field: "action",
            headerName: "Action",
            cellRenderer: ProductCartActionComponent,

        },
        {
            field: "stockOBJ",
            colId: "stockOBJ",
            headerName: "Product",
            valueFormatter: (params) => {
                const combinedvalue = params.value.stockId + "-" + params.value.itemName
                return combinedvalue
            }
        },
        {
            field: "quantity",
            colId: "quantity",
            headerName: "Qty",
            valueFormatter: (params) => {
                const val = (params.value.toFixed(2))
                return val
            },
            width: 180
        },
        {
            field: "total",
            colId: "total",
            headerName: "Gross Total",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }

        },
        {
            field: "discount",
            colId: "discount",
            headerName: "Discount",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }

        },
        {
            field: "netAmount",
            colId: "netAmount",
            headerName: "Net amount",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }
        },
        {
            field: "tempInvoiceOBJ",
            colId: "tempInvoiceOBJ",
            headerName: "Invoice ID",
            valueFormatter: (params) => {
                const combinedvalue = params.value.tempInvoiceNumber
                return combinedvalue
            },
            hide: true

        },
        // { 
        //     field: "confirmInvoiceOBJ",
        //     colId:"confirmInvoiceOBJ",
        //     headerName:"Confirm Invoice ID",
        //     valueFormatter:(params)=>{
        //         const combinedvalue = params.value.tempInvoiceNumber
        //         return combinedvalue
        //     },
        //     // hide:true

        // },

    ];


    onGridReady(param: GridReadyEvent) {
        this.rowData$ = this.getRowData();
        this.gridApi = param?.api
        this.statusUpdateService.tempSalesCart$.subscribe(res => {
            this.productCartItems = res
            this.statusUpdateService.updateTempSalesNetAmount(this.productCartItems)
            this.cdr.detectChanges()
        })
        this.gridApi.sizeColumnsToFit();

    }



    getProductCartItemsOfTheInvoiceId() {
        this.productCartService.getAll(this.invoiceId).subscribe((cartData) => {
            GLOBAL_LIST.PRODUCTCART_DATA = cartData?.result?.[0]
            this.productCartItems = cartData?.result?.[0]
            this.statusUpdateService.updateTempSalesInvoiceCart(cartData?.result?.[0])
            this.statusUpdateService.updateTempSalesNetAmount(cartData?.result?.[0])
            // this.isProductsAvailableInCart = true
        })
    }
    openDelDiolog(): void {

        const extraData = {
            title: "Delete Invoice",
            subTitle: "Do you want to delete this invoice?",
        }
        const deletePop = this.matDialog.open(ActionPopComponent, { data: extraData, panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop" });

        deletePop.afterClosed().subscribe((state: boolean) => {
            if (!state) return;
            this.invoiceService.deleteTempSalesInvoice(this.invoiceId).subscribe((res) => {

                if (res?.successMessage != null) {
                    this.toastr.success(res?.successMessage)
                    this.setDataIntoRow();
                    this.router.navigate(["/dash_board"]);
                    this.triggerNotification()
                } else {
                    this.toastr.clear()
                    this.toastr.error(res?.errors)
                }

            }, err => {
                this.toastr.clear()
                this.toastr.error(err, "Error Deleting the Invoice")
            })
        })

    }
    triggerNotification() {
        this.notificationService.fetchnotificationData();
    }

    /*  makePayment() {
         const extraData = {
             totalAmount: this.netAmount,
             tempInvoiceData: this.invoiceData,
         };
         const invoicePaymentOpen = this.matDialog.open(
             InvoicePaymentComponent,
             { data: extraData, panelClass: ["custom-dialog-container"],backdropClass: "dialogbox-backdrop"  }
         );
         invoicePaymentOpen.afterClosed().subscribe((res) => {
             this.getAllPayments();
         });
     } */

    openPay() {
        const extraData = {
            tempInvoiceData: this.invoiceData,
            payable: (this.netAmount - this.paidAmount)
        };
        const openPay = this.matDialog.open(
            AdvancePayHistoryComponent,
            { data: extraData, width: '55%', height: '80%', panelClass: ["custom-dialog-container"], backdropClass: "dialogbox-backdrop" }
        );
        openPay.afterClosed().subscribe(res => {
            this.getAllPayments();
        })
    }

    getAllPayments() {

        this.paymentService.getAllPayments(this.invoiceId).subscribe((res) => {
            GLOBAL_LIST.PAYMENTS_DATA = res.result;
            this.paymentsDataList = res.result
            // console.log("Pay",this.paymentsDataList)
            this.getTotalPaidAmount()
            this.cdr.detectChanges()
        });

    }

    getTotalPaidAmount() {

        let totalPaidAmount = 0;
        if (this.paymentsDataList.length > 0) {
            totalPaidAmount = this.paymentsDataList.reduce((accumulator, currentValue) => accumulator + currentValue.paidAmount, 0)

        }
        this.paidAmount = totalPaidAmount
    }


    onCellClicked(cellClickedEvent: CellClickedEvent) {


    }

    private getRowData(): any {
        return new Promise((resolve) => {
            this.productCartService.getAll(this.invoiceId).subscribe((cartData) => {
                resolve(cartData.result[0]);
            }, (err) => {
                resolve([])
            })
        })
    }


    public setDataIntoRow() {
        this.productCartService.getAll(this.invoiceId).subscribe((cartData) => {
            this.gridApi.setRowData(cartData.result[0]);
            GLOBAL_LIST.PRODUCTCART_DATA = cartData.result[0]
            this.statusUpdateService.updateTempSalesInvoiceCart(cartData.result[0])
            this.statusUpdateService.updateTempSalesNetAmount(cartData.result[0])
        }, (err) => {
        })
    }

    insertTrigger() {


        const extraData = {
            title: "Add",
            selectedInvoiceId: this.invoiceId,
            customerId: this.custId,
        }
        const addProductsForm = this.matDialog.open(ProductSelectionToCartFormComponent, {
            data: extraData,
            panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop"
        })
        addProductsForm.afterClosed().subscribe(res => {

            this.setDataIntoRow()
            this.getAllStockAndCategoryData()
            // this.getTempInvoiceById(this.invoiceId)
        })

    }

    /*  getTempInvoiceById(invocieId:number){
         this.invoiceService.getTempInvocieById(this.invoiceId).subscribe(res=>{
             console.log(res?.result)
         })
     } */


    searchDataInRows() {

        if (this.searchCharac !== "") {
            this.productCartService.findData(this.invoiceId, this.searchCharac).subscribe(response => {
                this.gridApi.setRowData(response?.result)
            });
        } else if (this.searchCharac === "") {
            this.setDataIntoRow()
        }
    }


    getAllInvoiceData() {
        this.invoiceService.getAll().subscribe(invoiceData => {
            GLOBAL_LIST.INVOICE_DATA = invoiceData
        })
    }
    getAllStockAndCategoryData() {
        this.stockService.getAllStock().subscribe(res => {
            GLOBAL_LIST.STOCK_DATA = res
        })

        this.catService.getAll().subscribe(res => {
            GLOBAL_LIST.CATEGORY_DATA = res

        })

    }


}
