import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Observable, map, startWith } from "rxjs";
import { GLOBAL_LIST } from "src/app/constants/GlobalLists";
import { ITempPurchaseInvoice } from "src/app/constants/interfaces/ITempPurchaseInvoiceEntity";
import { IVendorEntity } from "src/app/constants/interfaces/IVendorEntity";
import { itemNamePattern } from "src/app/constants/interfaces/VALIDATORS";
import { TempPurchaseService } from "src/app/service/tempPurchase-service/temp-purchase.service";

@Component({
    selector: "app-purchase-invoice-form",
    templateUrl: "./purchase-invoice-form.component.html",
    styleUrls: ["./purchase-invoice-form.component.css"],
})
export class PurchaseInvoiceFormComponent {
    purchaseInvocieForm: FormGroup;
    vendorControl = new FormControl("");
    vendorDataList: IVendorEntity[];
    filterOptions!: Observable<IVendorEntity[]>;
    isValid: boolean;
    purchaseList: ITempPurchaseInvoice[] = [];
    // purchaseList: any
    invoiceId!: number;

    constructor(
        private toastr: ToastrService,
        private tempPurchaseInvoiceService: TempPurchaseService,
        private matDialogRef: MatDialogRef<PurchaseInvoiceFormComponent>
    ) {
        this.loadAllPurchase();
        this.vendorDataList = GLOBAL_LIST.VENDOR_DATA;
        this.purchaseList = GLOBAL_LIST.TEMPPURCHASE_DATA;
        // console.log(this.purchaseList)
        this.isValid = false;
        this.purchaseInvocieForm = new FormGroup({
            purchaseInvoiceNO: new FormControl(null, [Validators.required, Validators.pattern(itemNamePattern)]),
            vendorOBJ: new FormControl({}, Validators.required),
            purchasedDate: new FormControl({}, Validators.required),
        });
    }

    ngOnInit(): void {
        this.filterOptions = this.vendorControl.valueChanges.pipe(
            startWith(""),
            map((value) => this.listFilter(value || ""))
        );
    }

    listFilter(value: string): IVendorEntity[] {
        const searchValue = value.toString().toLowerCase();
        return this.vendorDataList.filter(
            (option) =>
                option.vendorName.toLowerCase().includes(searchValue) ||
                option.vendorId.toString().toLowerCase().includes(searchValue)
        );
    }
    loadAllPurchase() {
        this.tempPurchaseInvoiceService
            .getAllTempPurchase()
            .subscribe((response) => {
                GLOBAL_LIST.TEMPPURCHASE_DATA = response?.result;
            });
    }

    createTempPurchase() {
        this.purchaseInvocieForm.value.vendorOBJ = {
            vendorId: this.vendorControl.value,
        };
        this.tempPurchaseInvoiceService
            .createPurchaseInvoice(this.purchaseInvocieForm.value)
            .subscribe((response) => {
                if (response.result != null) {
                    this.toastr.success(response.successMessage);
                    this.loadAllPurchase();
                    this.matDialogRef.close();
                } else {
                    console.log(this.purchaseInvocieForm.value);
                    this.toastr.error(response.errors);
                }
            });
    }
}
