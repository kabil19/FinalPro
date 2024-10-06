import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { AgGridAngular } from "ag-grid-angular";
import {
    CellClickedEvent,
    ColDef,
    GridApi,
    GridReadyEvent,
} from "ag-grid-community";
import { Observable } from "rxjs";
import { PurchaseCartActionComponent } from "src/app/custom-components/action-cell/purchase-cart-action/purchase-cart-action.component";
import { TempPurchaseCartService } from "src/app/service/tempPurchaseCart-service/temp-purchase-cart.service";
import { PurchasedProductFormComponent } from "../../createData-forms/purchased-product-form/purchased-product-form.component";
import { TempPurchaseService } from "src/app/service/tempPurchase-service/temp-purchase.service";
import { GLOBAL_LIST } from "src/app/constants/GlobalLists";
import { ITempPurchaseInvoice } from "src/app/constants/interfaces/ITempPurchaseInvoiceEntity";
import { ActionPopComponent } from "src/app/custom-components/action-cell/action-pop/action-pop.component";
import { state } from "@angular/animations";
import { ConfirmPurchaseAndCartServiceService } from "src/app/service/confirmPurchase-service/confirm-purchase-and-cart-service.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/service/notification-service/notification.service";
import { ITempPurchaseCartEntity } from "src/app/constants/interfaces/ITempPurchaseCartEntity";
import { StatusUpdateService } from "src/app/service/sharedServiceForStates/status-update.service";

@Component({
    selector: "app-purchase-cart",
    templateUrl: "./purchase-cart.component.html",
    styleUrls: ["./purchase-cart.component.css"],
})
export class PurchaseCartComponent implements OnInit {
    purchaseInvoiceNum!: number;
    totalNetAmount: number = 0
    vendorList!: any;
    rowData$!: Observable<any[]>;
    @ViewChild(AgGridAngular)
    agGrid!: AgGridAngular;
    gridApi: GridApi | any = {};
    public rowSelection: "single" | "multiple" = "single";
    searchCharac: string = "";
    purchaseId!: number;
    purchaseList: ITempPurchaseInvoice[] = [];
    purchaseCart: ITempPurchaseCartEntity[] = []
    public columnDef: ColDef[] = [

        {
            field: "productCartId",
            colId: "productCartId",
            headerName: "productCartId",
            width: 90,
            hide: true,
        },
        {
            field: "stockOBJ",
            colId: "stockOBJ",
            headerName: "Stock",
            valueFormatter: (params) => {
                const combinedvalue =
                    params.value.stockId + " | " + params.value.itemName;
                return combinedvalue;
            },
        },
        {
            field: "sellingPrice",
            colId: "sellingPrice",
            headerName: "Selling price",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }
        },
        {
            field: "purchasePrice",
            colId: "purchasePrice",
            headerName: "Purchase price",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }
        },
        {
            field: "quantity",
            colId: "quantity",
            headerName: "Quantity",
            valueFormatter: (params) => {
                const val = (params.value.toFixed(2))
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
            field: "grossAmount",
            colId: "grossAmount",
            headerName: "Gross amount",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }
        }, {
            field: "netAmount",
            colId: "netAmount",
            headerName: "Net amount",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }
        },
        {
            field: "tempPurchaseOBJ",
            colId: "tempPurchaseOBJ",
            headerName: "Temp Purchase",
            valueFormatter: (params) => {
                const combinedvalue =
                    params.value.purchaseId +
                    " | " +
                    params.value.vendorOBJ.vendorName;
                return combinedvalue;
            },
            hide: true
        },
        {
            field: "action",
            headerName: "Action",
            cellRenderer: PurchaseCartActionComponent,
        },

    ];

    onCellClicked(cellClickedEvent: CellClickedEvent) { }

    constructor(
        private dialog: MatDialog,
        private tempPurchaseCartService: TempPurchaseCartService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private tempPurchaseInvoiceService: TempPurchaseService,
        private matDialog: MatDialog,
        private confirmPurchaseAndCartService: ConfirmPurchaseAndCartServiceService,
        private toastr: ToastrService,
        private router: Router,
        private notificationService: NotificationService,
        private cdr: ChangeDetectorRef,
        private statusUpdateService: StatusUpdateService,

    ) {
        // this.loadAllTempPurchase();
        this.purchaseList = GLOBAL_LIST.TEMPPURCHASE_DATA;
        // this.purchaseCart = GLOBAL_LIST.TEMP_PURCHASE_CART_DATA;
        this.getTempPurchaseId();


    }

    ngOnInit(): void {
        this.purchaseInvoiceNum = this.purchaseList?.[0].purchaseInvoiceNO;
        this.vendorList = this.purchaseList?.[0].vendorOBJ;
        if (this.purchaseCart.length <= 0) {
            this.loadAllPurchaseCartAndUpdateNetAmount()
        }
    }

    onGridReady(param: GridReadyEvent) {

        this.rowData$ = this.getRowData();
        this.gridApi = param?.api;
        this.statusUpdateService.purchaseCart$.subscribe(res => {
            this.purchaseCart = res
            this.statusUpdateService.updatePurchaseNetAmount(this.purchaseCart)
            this.statusUpdateService.purchaseCartNetAmount$.subscribe(res => {
                this.totalNetAmount = res
            })
            console.log("cart", res)
            this.cdr.detectChanges()
        })
        this.gridApi.sizeColumnsToFit();
    }

    getTempPurchaseId() {
        this.purchaseId = this.purchaseList?.[0]?.purchaseId;
    }


    loadAllPurchaseCartAndUpdateNetAmount() {
        this.tempPurchaseCartService.getAllTempPurchaseCartItems(this.purchaseId).subscribe(res => {
            this.purchaseCart = res?.result
            GLOBAL_LIST.TEMP_PURCHASE_CART_DATA = res?.result
            this.statusUpdateService.updatePurchaseInvoiceCart(res?.result)
            //    update netamount in the shared service
            this.statusUpdateService.updatePurchaseNetAmount(res?.result)
            this.cdr.detectChanges()
        })
    }

    private getRowData(): any {
        return new Promise((resolve) => {
            this.tempPurchaseCartService
                .getAllTempPurchaseCartItems(this.purchaseId)
                .subscribe(
                    (purchaseCartData) => {
                        resolve(purchaseCartData?.result);

                    },
                    (err) => {
                        resolve([]);
                    }
                );
        });
    }

    public setDataIntoRow() {
        this.tempPurchaseCartService
            .getAllTempPurchaseCartItems(this.purchaseId)
            .subscribe(
                (purchaseCartData?) => {
                    this.gridApi.setRowData(purchaseCartData?.result);
                },
                (err) => {

                }
            );
    }

    insertTrigger() {
        const extraData = {
            title: "Insert",
        };
        const openForm = this.dialog.open(PurchasedProductFormComponent, {
            data: extraData,
            panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop"
        });
        openForm.afterClosed().subscribe((res) => {
            this.setDataIntoRow();
            this.loadAllTempPurchase()
            this.loadAllPurchaseCartAndUpdateNetAmount()
        });
    }

    searchDataInRows() {
        if (this.searchCharac !== "") {
            this.tempPurchaseCartService
                .selectTempPurchaseCartRecords(
                    this.purchaseId,
                    this.searchCharac
                )
                .subscribe((purchaseCartData) => {
                    this.gridApi.setRowData(purchaseCartData?.result);
                });
        } else if (this.searchCharac === "") {
            this.setDataIntoRow();
        }
    }

    loadAllTempPurchase() {
        this.tempPurchaseInvoiceService
            .getAllTempPurchase()
            .subscribe((response) => {
                GLOBAL_LIST.TEMPPURCHASE_DATA = response?.result;
                this.purchaseList = response?.result;
                this.purchaseId = response?.result?.[0].purchaseId;
            });
    }

    completeInvoice() {

        const extraData = {
            title: "Confirm Purchase?",
            subTitle: "Do you want to confirm the invoice?",
        };
        let openActionPop = this.matDialog.open(ActionPopComponent, {
            data: extraData,
            panelClass: ["custom-dialog-container"], backdropClass: "dialogbox-backdrop"
        });
        openActionPop.afterClosed().subscribe((state: boolean) => {
            if (!state) return;
            this.confirmPurchaseAndCartService
                .addToConfirmPurchase(this.purchaseId)
                .subscribe((res) => {
                    this.toastr.clear();
                    this.toastr.success(res.successMessage);

                    // this.loadAllTempPurchase()
                    this.router.navigate(["/dash_board"]);
                    this.triggerNotification()

                });

        });
    }

    cancelPurchase() {
        const extraData = {
            title: "Cancel Purchase?",
            subTitle: "Do you want to cancel the invoice?",
        };
        let openActionPop = this.matDialog.open(ActionPopComponent, {
            data: extraData,
            panelClass: ["custom-dialog-container"], backdropClass: "dialogbox-backdrop"
        });
        openActionPop.afterClosed().subscribe((state: boolean) => {
            if (!state) return;
            this.confirmPurchaseAndCartService
                .cancelPurchase(this.purchaseId)
                .subscribe((res) => {
                    if (res?.successMessage) {
                        this.toastr.clear();
                        this.toastr.success(res.successMessage);
                        this.triggerNotification()
                        this.router.navigate(["/dash_board"]);
                    } else if (res?.successMessage == "") {
                        this.toastr.clear()
                        this.toastr.error(res.errors)
                    }

                });

        });
    }

    triggerNotification() {
        this.notificationService.fetchnotificationData();
    }
}