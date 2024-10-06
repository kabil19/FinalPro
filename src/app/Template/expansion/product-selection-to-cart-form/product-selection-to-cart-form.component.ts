import { Component, Inject } from "@angular/core";
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ValidatorFn,
    Validators,
} from "@angular/forms";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { IStockEntity } from "../../../constants/interfaces/IStockEntity";
import { Observable, debounceTime, distinctUntilChanged, map, startWith } from "rxjs";
import { GLOBAL_LIST } from "src/app/constants/GlobalLists";
import { ProductCartService } from "src/app/service/productCart-service/product-cart.service";
import { StockService } from "src/app/service/stock-service/stock.service";
import { ActionPopComponent } from "src/app/custom-components/action-cell/action-pop/action-pop.component";
import { NotificationService } from "src/app/service/notification-service/notification.service";
import { discountPattern, netAmountPattern, nonMinusDigitPattern } from "src/app/constants/interfaces/VALIDATORS";

@Component({
    selector: "app-product-selection-to-cart-form",
    templateUrl: "./product-selection-to-cart-form.component.html",
    styleUrls: ["./product-selection-to-cart-form.component.css"],
})
export class ProductSelectionToCartFormComponent {
    selectedProduct: any = [];
    productSelectionForm: FormGroup;
    stockOBJControl = new FormControl("");
    stockDataList: IStockEntity[];
    filterOptions!: Observable<IStockEntity[]>;
    selectedItemsQty!: number;
    tempInvoiceOBJControl = new FormControl("");

    // isUpdate: boolean =this.data.isUpdate

    constructor(
        private matDialogRef: MatDialogRef<ProductSelectionToCartFormComponent>,
        private stockService: StockService,
        private toastr: ToastrService,
        private productCartService: ProductCartService,
        private matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private notificationService: NotificationService,

    ) {
        this.stockDataList = GLOBAL_LIST.STOCK_DATA;

        this.productSelectionForm = new FormGroup({
            proCartId: new FormControl(),
            stockOBJ: new FormControl([Validators.required]),
            quantity: new FormControl("",[Validators.required, Validators.pattern(nonMinusDigitPattern)]),
            //#cmt  qty validation has been done below, since the qty for selection will only be filtered from the list once the stock has been selected
            discount: new FormControl("", [Validators.required, Validators.pattern(discountPattern)]),
            netAmount: new FormControl(null, Validators.pattern(netAmountPattern)),
            total: new FormControl(null),
            tempInvoiceOBJ: new FormControl(),
            // confirmInvoiceOBJ:new FormControl()
        });

    }

    ngOnInit(): void {
        if (this.data.title === "Update") {
            this.setDataToInputForUpdation();
        }
        this.filterOptions = this.stockOBJControl.valueChanges.pipe(
            startWith(""),
            map((value) => this.listFilter(value || ""))
        );
        const discountCont = this.productSelectionForm.get('discount')
        const quantityCont = this.productSelectionForm.get('quantity')
        quantityCont?.valueChanges.pipe(distinctUntilChanged()).subscribe(res => {
            if (!quantityCont?.value) {
                quantityCont?.setErrors({ required: true }); // Manually set the 'required' error
                quantityCont.updateValueAndValidity()
                quantityCont?.markAsTouched(); // Mark the control as touched to display the error
                quantityCont?.markAsDirty()
                return
            }
        })
        discountCont?.valueChanges.pipe(distinctUntilChanged()).subscribe(res => {
            if (!discountCont?.value) {
                discountCont?.setErrors({ required: true }); // Manually set the 'required' error
                discountCont.updateValueAndValidity()
                discountCont?.markAsTouched(); // Mark the control as touched to display the error
                discountCont?.markAsDirty()
                return
            }
        })
    }

    displayProduct(id: any): any {
        const stock = this.stockDataList.find((obj) => obj.stockId === id);
        return stock ? `${stock.stockId} | ${stock.itemName}` : undefined;
    }

    private setDataToInputForUpdation() {
        let stockIdOfTheSelectedRow =
            this.data.selectedRowData.stockOBJ.stockId;
        this.productSelectionForm.patchValue({
            proCartId: this.data.selectedRowData.proCartId,
            discount: this.data.selectedRowData.discount,
            netAmount: this.data.selectedRowData.netAmount,
            quantity: this.data.selectedRowData.quantity,
            total: this.data.selectedRowData.total,
        });
        this.stockOBJControl.patchValue(
            this.data.selectedRowData.stockOBJ.stockId
        );
        this.tempInvoiceOBJControl.patchValue(
            this.data.selectedRowData.tempInvoiceOBJ.tempInvoiceId
        );
        this.getSelectedProduct_sList(stockIdOfTheSelectedRow);
    }
    private updateStockOBJValidators() {
        if (this.selectedProduct == undefined || this.selectedProduct.length == 0) {
            this.productSelectionForm.get('stockOBJ')?.touched
            this.productSelectionForm.get('stockOBJ')?.setValidators([Validators.required]);
        } else {
            this.productSelectionForm.get('stockOBJ')?.clearValidators();
        }
        this.productSelectionForm.get('stockOBJ')?.updateValueAndValidity();
    }

    quantityValidator(selectedItemsQty: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const currentQty = control.value;
            if (currentQty <= 0) {
                this.toastr.clear()
                // this.toastr.warning("Add a valid input");
                this.productSelectionForm.get('discount')?.disable()
                return { inValid: true };
            }
            if (this.data.title === "Add") {
                if (currentQty && currentQty > selectedItemsQty) {

                    this.toastr.clear()
                    this.toastr.warning(
                        "Quantity should be either below or equals to " +
                        selectedItemsQty

                    );
                    this.productSelectionForm.get('discount')?.disable()
                    return { exceedsQty: true };
                }
            } else if (this.data.title === "Update") {
                const existingInThecart = this.data.selectedRowData.quantity;
                let qtyDiff = currentQty - existingInThecart;
                if (qtyDiff > selectedItemsQty) {
                    this.toastr.clear()
                    this.toastr.warning(
                        "Quantity should be either below or equals to " +
                        (selectedItemsQty + existingInThecart)
                    );
                    this.productSelectionForm.get('discount')?.disable()
                    return { exceedsQty: true };
                }
            }
            this.toastr.clear()
            this.productSelectionForm.get('discount')?.enable()
            return null;
        };
    }

    selectOperation() {
        this.setvaluesToOBJFields();
        if (this.data.title === "Add") {
            this.productCartService
                .addProductsToCart(this.productSelectionForm.value)
                .subscribe((res) => {
                    if (res?.successMessage != null) {
                        this.toastr.clear()
                        this.toastr.success(res?.successMessage)
                        this.getAllStockData();
                        this.matDialogRef.close()
                        this.triggerNotification()
                    } else {
                        this.toastr.clear()
                        this.toastr.error(res?.errors)
                    }
                }, err => {
                    this.toastr.error("Error inserting stock into the sales cart!")
                });
        } else if (this.data.title === "Update") {
            this.updatePopTrigger();
        }
    }

    getAllStockData() {
        this.stockService.getAllStock().subscribe((res) => {
            GLOBAL_LIST.STOCK_DATA = res;
        });
    }



    updatePopTrigger() {


        this.setInvoiceDetailsForUpdation();
        const extraData = {
            title: this.data.title,
            subTitle: "are you sure you want to update the selected data?",
        };
        const openActionPop = this.matDialog.open(ActionPopComponent, {
            data: extraData,
            panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop"
        });
        openActionPop.afterClosed().subscribe((state: boolean) => {
            if (!state) return;
            this.setInvoiceDetailsForUpdation()
            this.productCartService
                .update(this.productSelectionForm.value)
                .subscribe((res) => {
                    // this.getAllCartData()
                    if (res?.successMessage != null) {
                        this.matDialogRef.close();
                        // the product reorder level has to be checked so nofification trigger has been placed
                        this.triggerNotification()
                        this.toastr.clear()
                        this.toastr.success(res.successMessage);
                    } else {
                        this.toastr.clear()
                        this.toastr.error(res?.errors);
                    }
                }, err => {
                    this.toastr.error("Error updating stock in the sales cart!")
                });
        });
    }


    triggerNotification() {
        this.notificationService.fetchnotificationData();
    }

    private listFilter(value: string): IStockEntity[] {
        if (value) {
            const searchValue = value.toString().toLowerCase();
            return this.stockDataList.filter(
                (option) =>
                    option.itemName.toLowerCase().includes(searchValue) ||
                    option.stockId
                        .toString()
                        .toLowerCase()
                        .includes(searchValue)
            );
        } else {
            return (this.stockDataList = GLOBAL_LIST.STOCK_DATA);
        }
    }
    markControlAsTouchedAndDirty(control: AbstractControl): void {
        control.markAsTouched();
        control.markAsDirty();
    }
    initializeQtyValidation(qty: number) {
        //only add this qty validation, once the qty has been acquired for the selected stock by the component
        this.productSelectionForm
            .get("quantity")
            ?.setValidators([Validators.required, this.quantityValidator(qty)]);

        this.productSelectionForm.get("quantity")?.updateValueAndValidity();
        // end
    }

    getSelectedProduct_sList(stockId: number) {
        this.productSelectionForm.get('quantity')?.enable();
        this.productSelectionForm.get('discount')?.enable();
        this.selectedProduct = this.stockDataList.filter(
            (list) => list?.stockId === stockId
        );
        // once the product has been selected the number of qty available of the product will get selected, stockId selected from the Blur property
        this.selectedItemsQty = this.selectedProduct?.[0]?.quantity;
        this.initializeQtyValidation(this.selectedItemsQty);
        this.updateStockOBJValidators();
    }
    clearProductList() {
        this.selectedProduct = []
        this.updateStockOBJValidators();
    }
    setTotal() {
        if (this.selectedProduct.length == 0) {
            this.productSelectionForm.get('quantity')?.disable();
            this.productSelectionForm.get('discount')?.disable();
            this.toastr.clear()
            this.toastr.warning("Try selecting a product first!", "Product isn't selected!")
            return
        }
        const sellPrice = this.selectedProduct?.[0]?.sellingPrice || 0;
        const qtyControl = this.productSelectionForm.get("quantity");
        const totalControl = this.productSelectionForm.get("total");
        const netAmountControl = this.productSelectionForm.get("netAmount");
        const discountControl = this.productSelectionForm.get("discount");
        qtyControl?.valueChanges.pipe(debounceTime(300)).subscribe((qty) => {
            totalControl?.patchValue(qty * sellPrice);
            if (discountControl) {
                const discountVal = discountControl.value;
                let totalDiscount = discountVal * qty;
                let netAmount = totalControl?.value - totalDiscount;
                netAmountControl?.patchValue(netAmount);
            }
        });
    }
    setNetAmount() {
        if (this.selectedProduct.length == 0) {
            this.toastr.warning("Try selecting a product first!", "Product isn't selected!")
            return
        }
        const sellPrice = this.selectedProduct?.[0]?.sellingPrice || 0;
        const qtyControl = this.productSelectionForm.get("quantity");
        const totalControl = this.productSelectionForm.get("total");
        const netAmountControl = this.productSelectionForm.get("netAmount");
        const discountControl = this.productSelectionForm.get("discount");
        discountControl?.valueChanges
            .pipe(debounceTime(300))
            .subscribe((discount) => {
                if (discountControl.value.toString().includes("%")) {
                    let discountPercentagePerUnit = parseFloat(
                        discount.replace("%", '')
                    );
                    if (!isNaN(discountPercentagePerUnit)) {
                        discount = (discountPercentagePerUnit / 100) * sellPrice;
                    }
                }
                //!isNaN -> !isNotANumber = it's indeed a number  
                if (!isNaN(discount) && !isNaN(qtyControl?.value)) {
                    const totalDiscount = discount * (qtyControl?.value || 0);
                    const netAmount = (totalControl?.value || 0) - totalDiscount;

                    if (!isNaN(netAmount)) {
                        if (netAmount <= 0) {
                            this.toastr.clear();
                            this.toastr.warning('The unit discount can neither exceed nor equal the Selling price!', 'Warning!');
                            discountControl.setErrors({ inValidDiscount: true });
                            this.markControlAsTouchedAndDirty(discountControl)
                        } else {
                            discountControl?.patchValue(discount);
                            netAmountControl?.patchValue(netAmount);
                            discountControl.setErrors(null);  // Clear any previous errors if the discount is valid
                        }
                        // 
                    }
                }
            });
    }

    /*   discountValidator(): ValidatorFn {
          return (control: AbstractControl): { [key: string]: any } | null => {
              const discountVal = control.value;
              const sellPrice = this.selectedProduct?.[0]?.sellingPrice || 0;
  
              let parsedDiscount = discountVal;
  
              // Check if the discount is a percentage
              if (parsedDiscount?.toString().includes("%")) {
                  let discountPercentagePerUnit = parseFloat(parsedDiscount.replace("%", ''));
                  if (!isNaN(discountPercentagePerUnit)) {
                      parsedDiscount = (discountPercentagePerUnit / 100) * sellPrice;
                  }
              }
  
              if (parsedDiscount >= sellPrice) {
                  return { inValidDiscount: true };
              }
  
              return null;
          };
      } */
    private setvaluesToOBJFields() {
        let cartValue = this.productSelectionForm.value;
        cartValue.stockOBJ = { stockId: this.stockOBJControl.value };
        cartValue.stockOBJ.categoryOBJ = {
            categoryId: (this.selectedItemsQty =
                this.selectedProduct?.[0]?.categoryOBJ.categoryId),
        };
        cartValue.tempInvoiceOBJ = {
            tempInvoiceId: this.data.selectedInvoiceId,
        };
        //    cartValue.confirmInvoiceOBJ = {confirmInvoiceId:this.data.selectedInvoiceId}
        cartValue.tempInvoiceOBJ.customerOBJ = { custId: this.data.customerId };
        //    cartValue.confirmInvoiceOBJ.customerOBJ={custId:this.data.customerId}     
    }

    private setInvoiceDetailsForUpdation() {
        let cartValue = this.productSelectionForm.value;
        cartValue.tempInvoiceOBJ = this.data.selectedRowData.tempInvoiceOBJ;
        cartValue.stockOBJ = this.data.selectedRowData.stockOBJ;
        // cartValue.confirmInvoiceOBJ = this.data.selectedRowData.confirmInvoiceOBJ
    }
}
