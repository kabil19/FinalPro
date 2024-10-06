import { AfterViewInit, Component, ElementRef, Inject, Renderer2, ViewChild } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, PatternValidator, ValidatorFn, Validators } from "@angular/forms";
import { Observable, Subscription, debounceTime, distinctUntilChanged, map, startWith } from "rxjs";
import { GLOBAL_LIST } from "src/app/constants/GlobalLists";
import { IStockEntity } from "src/app/constants/interfaces/IStockEntity";
import { TempPurchaseService } from "src/app/service/tempPurchase-service/temp-purchase.service";
import { TempPurchaseCartService } from "./../../../service/tempPurchaseCart-service/temp-purchase-cart.service";
import { ToastrService } from "ngx-toastr";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { ActionPopComponent } from "src/app/custom-components/action-cell/action-pop/action-pop.component";
import { ITempPurchaseInvoice } from "src/app/constants/interfaces/ITempPurchaseInvoiceEntity";
import { discountPattern, netAmountPattern, nonMinusDigitPattern, nonMinusnonZeroDigitPattern } from "src/app/constants/interfaces/VALIDATORS";
import { invalid } from "moment";

export function sellPriceValidator(purchasePriceControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const sellPriceVal = control.value;
        const purchasePriceVal = purchasePriceControl.value;

        if (sellPriceVal !== null && purchasePriceVal !== null && sellPriceVal < purchasePriceVal) {

            return { invalidSellPrice: true };
        }
        return null;
    };
}

export function qtyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const qtyVal = control.value
        if (qtyVal <= 0) {
            return { noZero: true };
        }
        return null;
    }
}
@Component({
    selector: "app-purchased-product-form",
    templateUrl: "./purchased-product-form.component.html",
    styleUrls: ["./purchased-product-form.component.css"],
})
export class PurchasedProductFormComponent {
    purchaseProductCartForm: FormGroup;
    stockOBJControl = new FormControl("");
    stockDataList!: IStockEntity[];
    filterOptions!: Observable<IStockEntity[]>;
    tempPurchaseOBJControl = new FormControl("");
    tempPurchaseList!: ITempPurchaseInvoice[];
    selectedItemsQty!: number;
    selectedPurchase!: any;
    selectedProduct: IStockEntity[] = [];
    private subscription: Subscription | undefined;
    // purchaseProductCartForm: FormGroup<any>;

    constructor(
        private tempPurchaseService: TempPurchaseService,
        private tempPurchaseCartService: TempPurchaseCartService,
        private toastr: ToastrService,
        private matDialogRef: MatDialogRef<PurchasedProductFormComponent>,
        private matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private renderer: Renderer2
    ) {
        this.stockDataList = GLOBAL_LIST.STOCK_DATA;
        this.purchaseProductCartForm = new FormGroup({
            productCartId: new FormControl(),
            stockOBJ: new FormControl(""),
            quantity: new FormControl("", [Validators.required, Validators.pattern(nonMinusDigitPattern)]),
            discount: new FormControl("", [Validators.required, Validators.pattern(discountPattern)]),
            sellingPrice: new FormControl("", [Validators.required, Validators.pattern(nonMinusDigitPattern)]),
            purchasePrice: new FormControl("", [Validators.required, Validators.pattern(nonMinusnonZeroDigitPattern)]),
            netAmount: new FormControl(null, [Validators.required,Validators.pattern(netAmountPattern)]),
            grossAmount: new FormControl(null,[Validators.required,]),
            tempPurchaseOBJ: new FormControl(),
        });
        // this.loadAllPurchase();
        this.getAllPurchaseInvoice();
    }
    markControlAsTouchedAndDirty(control: AbstractControl): void {
        control.markAsTouched();
        control.markAsDirty();
    }
    ngOnInit() {
        if (this.data.title === "Update") {
            this.selectedProduct = this.data.selectedRowData.stockOBJ;
            this.setDataToInputForUpdation();
        }
        this.filterOptions = this.stockOBJControl.valueChanges.pipe(
            startWith(""),
            map((value) => this.listFilter(value || ""))
        );
        //incase if the user tries to type the value, did this becz the getSelectedProduct_sList function kinda stores the value forever in the selectedList, that 
        //   lets even the wrong id of stock to be passed as the previously stored stock, so this kinda helps to not select improper ones 
        this.stockOBJControl.valueChanges.subscribe(value => {
            this.onProductInputChange(value);
        });

        this.setupValidators()
       /*  console.log("status ",this.purchaseProductCartForm.status)
        Object.keys(this.purchaseProductCartForm.controls).forEach(key => {
            const control = this.purchaseProductCartForm.get(key);
            console.log(`Control: ${key}, Status: ${control?.status}, Errors: `, control?.errors);
          }); */
        
    }


    private setDataToInputForUpdation() {
        this.purchaseProductCartForm.patchValue({
            productCartId: this.data.selectedRowData.productCartId,
            discount: this.data.selectedRowData.discount,
            netAmount: this.data.selectedRowData.netAmount,
            quantity: this.data.selectedRowData.quantity,
            grossAmount: this.data.selectedRowData.grossAmount,
            purchasePrice: this.data.selectedRowData.purchasePrice,
            sellingPrice: this.data.selectedRowData.sellingPrice,

        });
        this.stockOBJControl.patchValue(
            this.data.selectedRowData.stockOBJ.stockId
        );
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
    onProductInputChange(value: any) {
        const selected = this.stockDataList.find(item => item.stockId === value);

        if (!selected) {
            // Clear selected product
            this.selectedProduct = [];

            // Form fields disabled
            this.purchaseProductCartForm.get('quantity')?.disable();
            this.purchaseProductCartForm.get('discount')?.disable();
            this.purchaseProductCartForm.get('sellingPrice')?.disable();
            this.purchaseProductCartForm.get('purchasePrice')?.disable();

            // Set 'required' error on stockOBJ if invalid
            this.purchaseProductCartForm.get('stockOBJ')?.setErrors({ invalidStockId: true });
            this.purchaseProductCartForm.get('stockOBJ')?.updateValueAndValidity()

        } else {
            // Clear any previous errors if a valid selection is made
            this.purchaseProductCartForm.get('stockOBJ')?.setErrors(null);

            // Enable relevant form fields
            this.purchaseProductCartForm.get('quantity')?.enable();
            this.purchaseProductCartForm.get('discount')?.enable();
            this.purchaseProductCartForm.get('sellingPrice')?.enable();
            this.purchaseProductCartForm.get('purchasePrice')?.enable();

            // Update selected product
            this.getSelectedProduct_sList(selected.stockId);
        }
    }
    getAllPurchaseInvoice() {
        this.tempPurchaseService.getAllTempPurchase().subscribe((res) => {
            this.selectedPurchase = res?.result?.[0];
        });
    }

    selectOperation() {
        if (this.data.title === "Insert") {
            this.setOBJFieldsForInsertion();

            this.tempPurchaseCartService
                .createPurchaseInvoice(this.purchaseProductCartForm.value)
                .subscribe((response) => {
                    if (response.successMessage != null) {
                        this.toastr.clear()
                        this.toastr.success(response.successMessage);
                        this.matDialogRef.close();
                        this.loadAllPurchase();
                    } else {
                        this.toastr.clear()
                        this.toastr.error(response.errors)
                    }

                }, err => {
                    this.toastr.clear()
                    this.toastr.error("Error Inserting Data!")
                });
        } else if (this.data.title === "Update") {
            this.updatePopTrigger();
        }
    }

    updatePopTrigger() {
        // this.setvaluesToOBJFields()
        console.log("formValues ", this.purchaseProductCartForm.value);
        const extraData = {
            title: this.data.title,
            subTitle: "are you sure you want to update the selected data?",
        };
        const openActionPop = this.matDialog.open(ActionPopComponent, {
            data: extraData,
            panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop"
        });
        this.purchaseProductCartForm.value.stockOBJ = this.selectedProduct
        openActionPop.afterClosed().subscribe((state: boolean) => {
            if (!state) return;
            this.setvaluesToOBJFields();
            this.tempPurchaseCartService
                .updateTempPurchaseCartRecord(
                    this.purchaseProductCartForm.value
                )
                .subscribe((response) => {
                    if (response.successMessage != null) {
                        this.toastr.clear()
                        this.toastr.success(response.successMessage);
                        this.matDialogRef.close();
                        this.loadAllPurchase();
                    } else {
                        this.toastr.clear()
                        this.toastr.error(response.errors)
                    }
                    // this.matDialogRef.close();
                    // this.toastr.success(res.successMessage);
                    // this.loadAllPurchase();
                    // this.tempPurchaseList = GLOBAL_LIST.TEMPPURCHASE_DATA;
                }, (err) => {
                    this.toastr.clear()
                    this.toastr.error("Error Updating the cart!")
                });
        });
    }

    loadAllPurchase() {
        this.tempPurchaseService.getAllTempPurchase().subscribe((response) => {
            GLOBAL_LIST.TEMPPURCHASE_DATA = response?.result;
        });
    }

    setOBJFieldsForInsertion() {
        let cartValue = this.purchaseProductCartForm.value;
        cartValue.tempPurchaseOBJ = this.selectedPurchase;
        cartValue.stockOBJ = this.selectedProduct?.[0];
        console.log(this.purchaseProductCartForm.value);
    }

    getSelectedProduct_sList(stockId: number) {
        this.purchaseProductCartForm.get('quantity')?.enable();
        this.purchaseProductCartForm.get('discount')?.enable();
        this.purchaseProductCartForm.get('sellingPrice')?.enable();
        this.purchaseProductCartForm.get('purchasePrice')?.enable();
        this.selectedProduct = this.stockDataList.filter(
            (list) => list?.stockId === stockId
        );
    }
    displayStockName(id: any): any {
        const stock = this.stockDataList.find((obj) => obj.stockId === id);
        return stock ? `${stock.stockId} | ${stock.itemName}` : undefined;
    }

    clearSelectedProduct() {
        this.selectedProduct = []
        this.selectedItemsQty = 0
    }

    setTotalWhenQty() {
        if (this.selectedProduct.length == 0) {
            this.purchaseProductCartForm.get('quantity')?.disable();
            this.purchaseProductCartForm.get('discount')?.disable();
            this.purchaseProductCartForm.get('sellingPrice')?.disable();
            this.purchaseProductCartForm.get('purchasePrice')?.disable();
            this.toastr.clear()
            this.toastr.warning("Try selecting a product first!", "Product isn't selected!")
            return
        }
        const qtyControl = this.purchaseProductCartForm.get("quantity");
        const totalControl = this.purchaseProductCartForm.get("grossAmount");
        const netAmountControl = this.purchaseProductCartForm.get("netAmount");
        const discountControl = this.purchaseProductCartForm.get("discount");
        const purchasePriceControl = this.purchaseProductCartForm.get("purchasePrice");
        const sellingPriceControl = this.purchaseProductCartForm.get("sellingPrice");
        if (!purchasePriceControl) return
        if (!qtyControl) return;

        qtyControl?.valueChanges.pipe(debounceTime(300)).subscribe((qty) => {
            if (qty <= 0) {
                qtyControl.updateValueAndValidity()
                this.markControlAsTouchedAndDirty(qtyControl)
                purchasePriceControl?.disable()
                discountControl?.disable()
                sellingPriceControl?.disable()
                return
            }
            purchasePriceControl?.enable()
            discountControl?.enable()
            sellingPriceControl?.enable()
            totalControl?.patchValue(qty * purchasePriceControl?.value | 0);
            if (discountControl) {
                const discountVal = discountControl.value;
                let totalDiscount = discountVal * qty;
                let netAmount = totalControl?.value - totalDiscount;
                netAmountControl?.patchValue(netAmount);
            }
        });
    }

    setTotalWhenPurchasePrice() {
        const qtyControl = this.purchaseProductCartForm.get("quantity");
        const totalControl = this.purchaseProductCartForm.get("grossAmount");
        const netAmountControl = this.purchaseProductCartForm.get("netAmount");
        const discountControl = this.purchaseProductCartForm.get("discount");
        const purchasePriceControl = this.purchaseProductCartForm.get("purchasePrice");
        const sellingPriceControl = this.purchaseProductCartForm.get("sellingPrice");


        purchasePriceControl?.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((purchaseP) => {

            if (!purchasePriceControl || purchasePriceControl.value <= 0) {
                qtyControl?.disable()
                discountControl?.disable()
                sellingPriceControl?.disable()
                purchasePriceControl.setErrors({ invalidPurchase: true })
                purchasePriceControl.updateValueAndValidity()
                this.markControlAsTouchedAndDirty(purchasePriceControl)
                return
            } else {
                discountControl?.enable()
                qtyControl?.enable()
                purchasePriceControl.clearValidators()
                sellingPriceControl?.enable()
            }
            totalControl?.patchValue(purchaseP * qtyControl?.value | 0);
            if (discountControl) {
                const discountVal = discountControl?.value | 0;
                let totalDiscount = discountVal * qtyControl?.value | 0;
                let netAmount = totalControl?.value | 0 - totalDiscount;
                netAmountControl?.patchValue(netAmount);
            }
        });
    }

    setNetAmount() {

        const qtyControl = this.purchaseProductCartForm.get("quantity");
        const totalControl = this.purchaseProductCartForm.get("grossAmount");
        const netAmountControl = this.purchaseProductCartForm.get("netAmount");
        const discountControl = this.purchaseProductCartForm.get("discount");
        const purchasePriceControl = this.purchaseProductCartForm.get("purchasePrice");
        const sellingPriceControl = this.purchaseProductCartForm.get("sellingPrice");

        if (!discountControl) return
        if (this.selectedProduct.length == 0) {
            this.toastr.warning("Try selecting a product first!", "Product isn't selected!")
            purchasePriceControl?.disable()
            discountControl?.disable()
            sellingPriceControl?.disable()
            qtyControl?.disable()
            return
        }
        discountControl?.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged())

            .subscribe((discount) => {
                if (purchasePriceControl?.value == '') {
                    discountControl?.disable()
                    sellingPriceControl?.disable()
                    qtyControl?.disable()
                    purchasePriceControl.setErrors({ required: true });
                    this.markControlAsTouchedAndDirty(purchasePriceControl)
                    purchasePriceControl.updateValueAndValidity()
                    return
                }
                if (discountControl.value.toString().includes("%")) {

                    let discountPercentagePerUnit = parseFloat(
                        discount.replace("%", '')
                    );
                    if (!isNaN(discountPercentagePerUnit)) {
                        discount = (discountPercentagePerUnit / 100) * purchasePriceControl?.value | 0;
                    }
                }
                if (!isNaN(qtyControl?.value) && !isNaN(totalControl?.value)) {
                    let totalDiscount = discount * qtyControl?.value;
                    let netAmount = totalControl?.value - totalDiscount;


                    if (!isNaN(netAmount)) {
                        if (netAmount <= 0 && discountControl.value >= purchasePriceControl?.value) {
                            this.toastr.clear();
                            this.toastr.warning('The unit discount can neither exceed nor equal the Purchase price!', 'Warning!');

                            // Set the error first
                            discountControl.setErrors({ inValidDiscount: true });

                            // for immediate error display
                            this.markControlAsTouchedAndDirty(discountControl);

                            // Disable selling price control
                            sellingPriceControl?.disable();

                        } else {
                            // Clear any previous errors if the discount is valid
                            discountControl.setErrors(null);

                            // Update values after clearing errors
                            discountControl?.patchValue(discount);
                            netAmountControl?.patchValue(netAmount);

                            // Enable selling price control if valid
                            sellingPriceControl?.enable();
                        }
                    }
                }
            });
    }


    private setupValidators(): void {
        const sellPriceControl = this.purchaseProductCartForm.get('sellingPrice');
        const purchasePriceControl = this.purchaseProductCartForm.get('purchasePrice');
        const qtyControl = this.purchaseProductCartForm.get('quantity');

        if (sellPriceControl && purchasePriceControl) {
            sellPriceControl.setValidators(sellPriceValidator(purchasePriceControl));
            sellPriceControl.updateValueAndValidity(); // Trigger validation
        }
        if (qtyControl) {
            qtyControl.setValidators(qtyValidator())
            qtyControl.updateValueAndValidity();
        }
    }

    sellPriceCheck(): void {
        const sellPriceControl = this.purchaseProductCartForm.get('sellingPrice');
        if (!sellPriceControl) return;
        this.subscription = sellPriceControl?.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(() => {
                sellPriceControl?.updateValueAndValidity(); // Trigger validation after change
                this.markControlAsTouchedAndDirty(sellPriceControl)
                return

            });
    }



    private setvaluesToOBJFields() {
        const cartValue = this.purchaseProductCartForm.value;
        console.log(cartValue);
        // cartValue.stockOBJ = { stockId: this.stockOBJControl.value };
        cartValue.stockOBJ = this.data.selectedRowData?.stockOBJ;
        cartValue.tempPurchaseOBJ = this.data.selectedRowData?.tempPurchaseOBJ;
    }
}
