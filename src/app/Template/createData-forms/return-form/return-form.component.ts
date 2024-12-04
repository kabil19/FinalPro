
import { ToastrService } from 'ngx-toastr';
import { discountPattern, netAmountPattern } from 'src/app/constants/interfaces/VALIDATORS';
import { NotificationService } from 'src/app/service/notification-service/notification.service';
import { Component, Inject } from "@angular/core";
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from "@angular/forms";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import { ReturnCartService } from 'src/app/service/return-service/return-cart.service';
import { debounceTime } from 'rxjs';
@Component({
  selector: 'app-return-form',
  templateUrl: './return-form.component.html',
  styleUrls: ['./return-form.component.css']
})
export class ReturnFormComponent {

    returnForm: FormGroup;
    constructor(
        private matDialogRef: MatDialogRef<ReturnFormComponent>,
        private toastr: ToastrService,
        // private productCartService: ProductCartService,
        private returnService: ReturnCartService,
        private matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private notificationService: NotificationService,

    ) {
       

        this.returnForm = new FormGroup({
            confirmProductCartId: new FormControl(),
            stockOBJ: new FormControl(this.data.stockOBJ.itemName),
            quantity: new FormControl(
                this.data.quantity,
                [Validators.required, // Ensure the field is not empty
                this.validateQuantity(this.data.quantity)] // Attach the custom validator
            ),
            discount: new FormControl(),
            netAmount: new FormControl(),
            total: new FormControl(),
            confirmInvoiceOBJ: new FormControl(),
            // confirmInvoiceOBJ:new FormControl()
        });

    }

    ngOnInit(): void {
        const quantityControl = this.returnForm.get('quantity');

        // Listen for changes in the 'quantity' field to display real-time validation errors
        quantityControl?.valueChanges.pipe(debounceTime(300)).subscribe(enteredQty => {
            if (quantityControl.errors?.['invalidQuantity']) {
                this.toastr.clear()
                this.toastr.warning(
                    quantityControl.errors['invalidQuantity'],
                    "Invalid Quantity"
                );
            }
        });
    }

    // Custom Validator Function
    validateQuantity(maxQuantity: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const enteredQty = control.value;
            if (enteredQty > maxQuantity) {
                return { invalidQuantity: `Quantity exceeds the available stock of ${maxQuantity}` };
            }
            if (enteredQty < 0) {
                return { invalidQuantity: `Quantity cannot be negative` };
            }
            return null;
        };
    }

    confirmReturn(){
        let returnFormData = this.returnForm.value
        returnFormData.confirmProductCartId = this.data.confirmProductCartId 
        returnFormData.stockOBJ = this.data.stockOBJ
        returnFormData.discount = this.data.discount
        returnFormData.netAmount = this.data.netAmount
        returnFormData.total = this.data.total
        returnFormData.confirmInvoiceOBJ =this.data.confirmInvoiceOBJ
        console.log("ReturnFormData: ", this.returnForm.value)
        // this.returnForm.proCartId = this.data.confirmProductCartId
        this.returnService.addToReturnCart(returnFormData).subscribe(res=>{
            if(res.successMessage!=null){
                this.toastr.clear()
                this.toastr.success(res.successMessage)
            }else{
                this.toastr.clear()
                this.toastr.error(res.errors)
            }
        })
    }
}


