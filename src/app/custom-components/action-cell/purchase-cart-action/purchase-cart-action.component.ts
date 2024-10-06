import { ChangeDetectorRef, Component } from '@angular/core';
import { ActionPopComponent } from '../action-pop/action-pop.component';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, ICellRendererParams } from 'ag-grid';
import { ToastrService } from 'ngx-toastr';
import { TempPurchaseCartService } from 'src/app/service/tempPurchaseCart-service/temp-purchase-cart.service';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { ITempPurchaseCartEntity } from 'src/app/constants/interfaces/ITempPurchaseCartEntity';
import { Observable, map } from 'rxjs';
import { PurchaseInvoiceFormComponent } from 'src/app/Template/createData-forms/purchase-invoice-form/purchase-invoice-form.component';
import { PurchaseCartComponent } from 'src/app/Template/modules/purchase-cart/purchase-cart.component';
import { PurchasedProductFormComponent } from 'src/app/Template/createData-forms/purchased-product-form/purchased-product-form.component';
import { TempPurchaseService } from 'src/app/service/tempPurchase-service/temp-purchase.service';
import { StatusUpdateService } from 'src/app/service/sharedServiceForStates/status-update.service';
@Component({
  selector: 'app-purchase-cart-action',
  templateUrl: './purchase-cart-action.component.html',
  styleUrls: ['./purchase-cart-action.component.css']
})
export class PurchaseCartActionComponent {
    dataFromRow: any;
    gridApi: GridApi | any = {};
    tempPurchaseCart:ITempPurchaseCartEntity[]=[]

    constructor(
        private toastr : ToastrService,
        public matDialog: MatDialog,
        private tempPurchaseCartService:TempPurchaseCartService,
        private tempPurchaseService:TempPurchaseService,
        private cdr: ChangeDetectorRef,
        private statusUpdateService: StatusUpdateService,
       
    ) {

    }

    agInit(params: ICellRendererParams): void {
        this.dataFromRow = params && params.data ? params.data : {};
        this.gridApi = params.api;
        
        // console.log(this.dataFromRow)
    }
     

     public setDataIntoRow() {
        let productCartId = this.dataFromRow.productCartId
        this.tempPurchaseCartService.getAllTempPurchaseCartItems(productCartId).subscribe((cartData)=>{
            this.gridApi.setRowData(cartData.result)
            this.statusUpdateService.updatePurchaseInvoiceCart(cartData.result); 
            this.cdr.detectChanges();
            //  GLOBAL_LIST.TEMP_PURCHASE_CART_DATA = cartData.result
        })
    }

    // loadAllPurchaseCart():Observable<ITempPurchaseCartEntity[]>{
    //     let productCartId = this.dataFromRow.productCartId
    //      return this.tempPurchaseCartService.getAllTempPurchaseCartItems(productCartId).pipe(map(cartData=>{
    //         GLOBAL_LIST.TEMP_PURCHASE_CART_DATA = cartData.result;
    //         return GLOBAL_LIST.TEMP_PURCHASE_CART_DATA
    //      }))
    // }

    getAllTempPurchaseCartData(){
        this.tempPurchaseCartService.getAllTempPurchaseCartItems(this.dataFromRow.productCartId).subscribe((res)=>{
            GLOBAL_LIST.TEMP_PURCHASE_CART_DATA = res.result
            this.statusUpdateService.updatePurchaseInvoiceCart(res.result); // Update the service
            this.cdr.detectChanges();
        })
    }
    loadAllPurchase() {
        this.tempPurchaseService.getAllTempPurchase().subscribe((response) => {
            GLOBAL_LIST.TEMPPURCHASE_DATA = response?.result;
        });
    }
    openDelDialog(): void {
     
        const extraData = {
            title : "Delete Product",
            subTitle: "Do you want to delete this Product from the invoice?",
        }
        const deletePop= this.matDialog.open(ActionPopComponent, {data: extraData,panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop"});
        
        deletePop.afterClosed().subscribe((state:boolean) => {
            if(!state)return;
          
            this.tempPurchaseCartService.deleteTempPurchaseCartRecord(this.dataFromRow.productCartId).subscribe((res)=>{
                if(res.successMessage!=null){
                    this.toastr.clear()
                    this.toastr.success(res.successMessage)
                    this.setDataIntoRow();  
                    this.getAllTempPurchaseCartData();
                    this.loadAllPurchase();
                }else{
                    this.toastr.clear()
                    this.toastr.error(res.errors)
                }
                
        },(err)=>{
            this.toastr.clear()
            this.toastr.error(err)
        })
       
    })
    }
    
        updateFormTrigger() {
            const data={
                title: "Update",
                selectedRowData:this.dataFromRow,
                isUpdate :true
                
            }
                const dialogRef = this.matDialog.open(PurchasedProductFormComponent, {data, panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop"});
                dialogRef.afterClosed().subscribe(()=>{
                    this.setDataIntoRow()
                    this.getAllTempPurchaseCartData();
                    this.loadAllPurchase();
                })
            }
}

