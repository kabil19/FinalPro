import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, ICellRendererParams } from 'ag-grid';
import { ToastrService } from 'ngx-toastr';
import { ProductCartService } from 'src/app/service/productCart-service/product-cart.service';
import { ActionPopComponent } from '../action-pop/action-pop.component';
import { ProductSelectionToCartFormComponent } from 'src/app/Template/expansion/product-selection-to-cart-form/product-selection-to-cart-form.component';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { Observable, map } from 'rxjs';
import { IProCartEntity } from 'src/app/constants/interfaces/IProCartEntity';
import { NotificationService } from 'src/app/service/notification-service/notification.service';
import { StatusUpdateService } from 'src/app/service/sharedServiceForStates/status-update.service';
import { IPaymentEntity } from 'src/app/constants/interfaces/IPaymentEntity';

@Component({
    selector: 'app-product-cart-action',
    templateUrl: './product-cart-action.component.html',
    styleUrls: ['./product-cart-action.component.css']
})
export class ProductCartActionComponent {
    dataFromRow: any;
    gridApi: GridApi | any = {};

    paymentsDataList: IPaymentEntity[] = []
    cartDataList: IProCartEntity[] = []
    constructor(
        private toastr: ToastrService,
        public matDialog: MatDialog,
        private productCartService: ProductCartService,
        private notificationService: NotificationService,
        private statusUpdateService: StatusUpdateService,


    ) {

    }


    ngOnInit() {
        this.paymentsDataList = GLOBAL_LIST.PAYMENTS_DATA
        this.cartDataList = GLOBAL_LIST.PRODUCTCART_DATA
    }

    agInit(params: ICellRendererParams): void {
        this.dataFromRow = params && params.data ? params.data : {};
        this.gridApi = params.api;
    }


    public setDataIntoRow() {
        let invoiceId = this.dataFromRow?.tempInvoiceOBJ?.tempInvoiceId
        this.productCartService.getAll(invoiceId).subscribe((cartData) => {
            this.gridApi.setRowData(cartData.result[0])
            this.statusUpdateService.updateTempSalesInvoiceCart(cartData.result[0])
            this.statusUpdateService.updateTempSalesNetAmount(cartData.result[0])
            // GLOBAL_LIST.PRODUCTCART_DATA = cartData.result[0]
        })
    }

    // loadAllProductCart():Observable<IProCartEntity[]>{
    //     let invoiceId = this.dataFromRow.tempInvoiceOBJ.tempInvoiceId
    //      return this.productCartService.getAll(invoiceId).pipe(map(cartData=>{
    //         GLOBAL_LIST.PRODUCTCART_DATA = cartData.result[0];
    //         return GLOBAL_LIST.PRODUCTCART_DATA
    //      }))
    // }


    triggerNotification() {
        this.notificationService.fetchnotificationData();
    }

    getAllCartData() {
        this.productCartService.getAll(this.dataFromRow.tempInvoiceOBJ.tempInvoiceId).subscribe((res) => {
            GLOBAL_LIST.PRODUCTCART_DATA = res?.result[0]
            this.cartDataList = res?.result[0]
            this.statusUpdateService.updateTempSalesInvoiceCart(res?.result[0])
        })
    }

    openDelDialog(): void {
       

        const extraData = {
            title: "Delete Product",
            subTitle: "Do you want to delete this Product from the invoice?",
        }
        const deletePop = this.matDialog.open(ActionPopComponent, { data: extraData, panelClass: "custom-dialog-container" ,backdropClass: "dialogbox-backdrop"});

        deletePop.afterClosed().subscribe((state: boolean) => {
            if (!state) return;

            this.productCartService.deleteProductFromTheCart(this.dataFromRow.proCartId).subscribe((res) => {
                if (res?.successMessage != null) {
                    this.toastr.success(res?.successMessage)
                    this.setDataIntoRow();
                    this.getAllCartData();
                    this.triggerNotification()
                } else {
                    this.toastr.clear()
                    this.toastr.error(res?.errors)
                }

            },err=>{
                this.toastr.error("Error deleting the selected data!")
            })
        })
    }

    updateFormTrigger() {
        const data = {
            title: "Update",
            selectedRowData: this.dataFromRow,
            isUpdate: true

        }
        const dialogRef = this.matDialog.open(ProductSelectionToCartFormComponent, { data, panelClass: "custom-dialog-container" ,backdropClass: "dialogbox-backdrop"});
        dialogRef.afterClosed().subscribe(() => {
            this.setDataIntoRow()
            this.getAllCartData();
        })
    }
}
