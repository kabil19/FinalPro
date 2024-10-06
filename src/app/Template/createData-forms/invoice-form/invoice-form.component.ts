import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActionPopComponent } from 'src/app/custom-components/action-cell/action-pop/action-pop.component';
import { InvoiceService } from 'src/app/service/invoice-service/invoice.service';
import { Observable, map, startWith } from 'rxjs';
import { ICustomerEntity } from '../../../constants/interfaces/CustomerEntity';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';


@Component({
    selector: 'app-invoice-form',
    templateUrl: './invoice-form.component.html',
    styleUrls: ['./invoice-form.component.css', '../form-design.css']
})
export class InvoiceFormComponent implements OnInit {
    @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;
    hide: boolean = true;
    allData: any;
    customerControl = new FormControl('');
    customerDataList: ICustomerEntity[];
    filterOptions!: Observable<ICustomerEntity[]>
    invoiceForm: FormGroup;
    checkGrp!: FormGroup<any>;

    constructor(
        private toastr: ToastrService,
        private invoiceService: InvoiceService,
        private matDialog: MatDialog,
        private matDialogRef: MatDialogRef<InvoiceFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {

        this.customerDataList = GLOBAL_LIST.CUSTOMER_DATA;
        this.invoiceForm = new FormGroup({
            tempInvoiceId: new FormControl,
            tempInvoiceNumberRef: new FormControl(),
            date: new FormControl(null),
            netAmount: new FormControl(0.00),
            customerOBJ: new FormControl({}, Validators.required),
            paidAmount: new FormControl(0.00)
        })


    }

    setDataIntoFormFields() {

        this.invoiceForm.patchValue({
            tempInvoiceId: this.data.tempInvoiceData.tempInvoiceId,
            date: this.data.tempInvoiceData.date,
            netAmount: this.data.tempInvoiceData.netAmount,
            tempInvoiceNumber: this.data.tempInvoiceData.tempInvoiceNumber,
        })
        this.customerControl.patchValue(this.data.customerValue.custId)

    }

    ngOnInit(): void {

        if (this.data.title === "Update") {
            this.setDataIntoFormFields()
        }
        this.filterOptions = this.customerControl.valueChanges.pipe(
            startWith(''),
            map(value => this.listFilter(value || '')
            )
        )
    }

    private listFilter(value: string): ICustomerEntity[] {
        const searchValue = value.toString().toLowerCase();
        return this.customerDataList.filter(
            option =>
                option.custName.toLowerCase().includes(searchValue) ||
                option.custId.toString().toLowerCase().includes(searchValue)
        )
    }



    selectOperation() {

        if (!this.invoiceForm.valid) {
            this.toastr.warning("Enter a valid data to " + this.data.title)
            return;
        }
        if (this.data.title == "Insert" && this.invoiceForm.valid) {
            this.insertPopTrigger();

        } else if (this.data.title == "Update" && this.invoiceForm.valid) {

            this.updatePopTrigger();
        }

    }
    insertPopTrigger() {
        let tempInvoiceFormValue = this.invoiceForm.value;
        tempInvoiceFormValue.customerOBJ = { custId: this.customerControl.value };
        const extraData = {
            title: "Insert",
            subTitle: "are you sure you want to add this data?",
        }
        const openActionPop = this.matDialog.open(ActionPopComponent, { data: extraData, panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop" })
        openActionPop.afterClosed().subscribe((state: boolean) => {
            if (!state) return;
            this.invoiceService.createTempSalesInvoice(tempInvoiceFormValue).subscribe(res => {

                if (res?.successMessage != null) {
                    this.toastr.success(res?.successMessage)
                    this.matDialogRef.close();
                } else {
                    this.toastr.clear()
                    this.toastr.error(res?.errors)
                }
            })

        })


    }

    updatePopTrigger() {
        let newlySelectedCustomerID = this.customerControl.value
        let tempInvoiceFormValue = this.invoiceForm.value;
        tempInvoiceFormValue.customerOBJ = { custId: newlySelectedCustomerID }
        const extraData = {
            title: this.data.title,
            subTitle: "are you sure you want to update the selected data?",

        }
        const openActionPop = this.matDialog.open(ActionPopComponent, { data: extraData, panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop" })
        openActionPop.afterClosed().subscribe((state: boolean) => {
            if (!state) return;
            this.invoiceService.update(this.invoiceForm.value).subscribe((res) => {
                this.matDialogRef.close()
                this.toastr.success(res)
            })
        })

    }

    displayCustomerName(id: any): any {
        const customer = this.customerDataList.find((obj) => obj.custId === id);
        return customer ? `${customer.custId} | ${customer.custName}` : undefined;
    }
}
