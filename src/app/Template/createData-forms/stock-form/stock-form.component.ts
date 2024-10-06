import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, RequiredValidator, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActionPopComponent } from 'src/app/custom-components/action-cell/action-pop/action-pop.component';
import { StockService } from 'src/app/service/stock-service/stock.service';
import { ICategoryEntity } from '../../../constants/interfaces/ICategoryEntity';
import { Observable, combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { NotificationService } from 'src/app/service/notification-service/notification.service';
import { itemNamePattern, namePattern, netAmountPattern, nonMinusDigitPattern } from 'src/app/constants/interfaces/VALIDATORS';

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
@Component({
    selector: 'app-stock-form',
    templateUrl: './stock-form.component.html',
    styleUrls: ['./stock-form.component.css', '../form-design.css']
})
export class StockFormComponent implements OnInit {
    stockForm: FormGroup;
    hide: boolean = true;
    allData: any;
    categoryControl = new FormControl('');
    categoryDataList: ICategoryEntity[];
    filterOptions!: Observable<ICategoryEntity[]>
    constructor(
        private toastr: ToastrService,
        private stockService: StockService,
        private matDialog: MatDialog,
        private matDialogRef: MatDialogRef<StockFormComponent>,
        private notificationService: NotificationService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.categoryDataList = GLOBAL_LIST.CATEGORY_DATA
        this.stockForm = new FormGroup({
            stockId: new FormControl,
            categoryOBJ: new FormControl([Validators.required,]),
            // item name -> have to include that alone numbers can't be inputed
            itemName: new FormControl("", [Validators.required, ]),
            materialColour: new FormControl('', [Validators.required, Validators.pattern(namePattern)]),
            quantity: new FormControl('', [Validators.required, Validators.pattern(nonMinusDigitPattern)]),
            arrivalDate: new FormControl(new Date(), Validators.required),
            remarks: new FormControl(''),
            purchasePrice: new FormControl(null, [Validators.required, Validators.pattern(netAmountPattern)]),
            sellingPrice: new FormControl(null, [Validators.required, Validators.pattern(netAmountPattern)]),
            reorderQty: new FormControl(20, Validators.required)
        })

    }


    private setupValidators() {
        const sellPriceControl = this.stockForm.get('sellingPrice');
        const purchasePriceControl = this.stockForm.get('purchasePrice');
        if (sellPriceControl && purchasePriceControl) {
            sellPriceControl.setValidators(sellPriceValidator(purchasePriceControl));
            sellPriceControl.updateValueAndValidity(); // Trigger validation
            this.markControlAsTouchedAndDirty(sellPriceControl)
        }
    }
    markControlAsTouchedAndDirty(control: AbstractControl): void {
        control.markAsTouched();
        control.markAsDirty();
    }

    setDataIntoFormFields() {

        this.stockForm.patchValue({
            stockId: this.data.stockData.stockId,
            // categoryOBJ: this.data.stockData.categoryOBJ,
            itemName: this.data.stockData.itemName,
            materialColour: this.data.stockData.materialColour,
            arrivalDate: this.data.stockData.arrivalDate,
            remarks: this.data.stockData.remarks,
            purchasePrice: this.data.stockData.purchasePrice,
            sellingPrice: this.data.stockData.sellingPrice,
            reorderQty: this.data.stockData.reorderQty,
            quantity: this.data.stockData.quantity
        })
        this.categoryControl.patchValue(this.data.categoryData.categoryId)
    }

    ngOnInit(): void {
        if (this.data.title === "Update") {
            this.setDataIntoFormFields()
        }
        this.filterOptions = this.categoryControl.valueChanges.pipe(
            startWith(''),
            map(value => this.listFilter(value || '')
            )
        )
        this.setupValidators()

        this.categoryControl.valueChanges.subscribe(value => {
            // this.onCategoryInputChange(value)
        })

        this.stockForm.get('purchasePrice')?.valueChanges
            .pipe(debounceTime(0), distinctUntilChanged()).subscribe(val => {
                this.checkWhenPurchasePriceInputted(val)
            })
        this.stockForm.get('sellingPrice')?.valueChanges
            .pipe(debounceTime(0), distinctUntilChanged()).subscribe(val => {
                this.checkWhenSellingPriceInputted(val)
            })

    }

    checkWhenSellingPriceInputted(val: number) {
        const purchaseControl = this.stockForm.get('purchasePrice');
        const sellControl = this.stockForm.get('sellingPrice');
        /*  console.log("TRUE", !purchaseControl?.value)
         console.log("TRUE", purchaseControl?.value == 0)
         console.log("sellControl && !purchaseControl?.value", sellControl && !purchaseControl?.value) */

        if (sellControl && !purchaseControl?.value) {
            purchaseControl?.setErrors({ required: true });
            purchaseControl?.markAsDirty()
            purchaseControl?.markAsTouched()
            purchaseControl?.updateValueAndValidity()
        }
        if (!purchaseControl?.value || purchaseControl.value == 0) return
        if (sellControl && purchaseControl.value > val) {
            sellControl?.updateValueAndValidity()

        }
    }
    checkWhenPurchasePriceInputted(val: number) {
        const purchaseControl = this.stockForm.get('purchasePrice');
        const sellControl = this.stockForm.get('sellingPrice');
        if (!sellControl) return;
        if (!sellControl.value) {
            sellControl.setErrors({ required: true });
            return
        } else {
            sellControl.setErrors(null);
        }
        if (sellControl.value < purchaseControl?.value) {
            sellControl.setErrors({ invalidSellPrice: true });
        }

        sellControl.updateValueAndValidity();
    }

    onCategoryInputChange(value: any) {
        const selected = this.categoryDataList.find(item => item.categoryId === value);


    }

    private listFilter(value: string): ICategoryEntity[] {
        const searchValue = value.toString().toLowerCase();
        return this.categoryDataList.filter(
            option =>
                option.categoryName.toLowerCase().includes(searchValue) ||
                option.categoryId.toString().toLowerCase().includes(searchValue)
        )
    }
    displayCategoryName(id: any): any {
        const category = this.categoryDataList.find((obj) => obj.categoryId === id);
        return category ? `${category.categoryId} | ${category.categoryName}` : undefined;
    }
    selectOperation() {

        if (this.data.title === "Insert" && this.stockForm.valid) {
            this.insertPopTrigger();

        } else if (this.data.title == "Update" && this.stockForm.valid) {
            this.updatePopTrigger();
        }
        else {
            this.toastr.warning("Invalid Data!")
        }

    }

    insertPopTrigger() {
        let stockFormValue = this.stockForm.value;
        console.log(stockFormValue)
        // if(stockFormValue.){
        stockFormValue.categoryOBJ = { categoryId: this.categoryControl.value };
        this.stockForm.value.arrivalDate = moment(new Date(stockFormValue.arrivalDate)).toISOString();
        console.log("stockFormVal", stockFormValue)
        const extraData = {
            title: "Insert",
            subTitle: "are you sure you want to add this data?",
        }
        const openActionPop = this.matDialog.open(ActionPopComponent, { data: extraData, panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop" })
        openActionPop.afterClosed().subscribe((state: boolean) => {
            if (!state) return;
            this.stockService.regiterReq(this.stockForm.value).subscribe(res => {

                this.matDialogRef.close()
                this.triggerNotification()
                this.toastr.success(res)
            }, (error) => {
                console.log
                this.toastr.error(error.error)
            })

        })

        // }


    }

    triggerNotification() {
        this.notificationService.fetchnotificationData();
    }
    updatePopTrigger() {

        let newlySelectedCategoryId = this.categoryControl.value
        let stockFormValue = this.stockForm.value;
        stockFormValue.categoryOBJ = { categoryId: newlySelectedCategoryId }
        const extraData = {
            title: this.data.title,
            subTitle: "are you sure you want to update the selected data?",
        }
        const openActionPop = this.matDialog.open(ActionPopComponent, { data: extraData, panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop" })
        openActionPop.afterClosed().subscribe((state: boolean) => {
            if (!state) return;
            this.stockService.update(this.stockForm.value).subscribe((res) => {

                this.matDialogRef.close()
                this.triggerNotification()
                this.toastr.success(res)

            }, (error) => {
                this.toastr.error(error.error)
            })
        })

    }

    //--------------- Form Validation------------------

    // doNotAddSpace(control: FormControl) {
    //     if(control.value!= "" && control.value.indexOf(' ') != -1) {
    //         console.log( control)
    //         return control
    //         // return { noSpace: true };
    //     }else{
    //         return null;
    //     }
    // }
}
