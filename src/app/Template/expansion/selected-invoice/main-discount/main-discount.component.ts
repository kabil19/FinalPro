import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductCartService } from 'src/app/service/productCart-service/product-cart.service';
import { StatusUpdateService } from 'src/app/service/sharedServiceForStates/status-update.service';

@Component({
  selector: 'app-main-discount',
  templateUrl: './main-discount.component.html',
  styleUrls: ['./main-discount.component.css']
})
export class MainDiscountComponent {
    discountForm!: FormGroup<any>;
    discountControl = new FormControl("");
    isValidAmount = false;
    constructor( 
        private dialogRef: MatDialogRef<MainDiscountComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private productCartService: ProductCartService,
        private statusUpdateService: StatusUpdateService,
        private cdr: ChangeDetectorRef,
    ){
        this.discountForm = new FormGroup({
            discountAmount: new FormControl(null, Validators.required)})
        
    }

    ngOnInit() {
        this.discountControl.valueChanges.subscribe(value => {
            // Convert the value to a number (parse it)
           
            const numericValue = Number(value);
           
            // Check if the value is a valid number, and ensure it is between 0 and the netAmount
            if (!isNaN(numericValue) && numericValue >= 0 && numericValue < this.data.netAmount) {
                this.isValidAmount = true;
                return
            } 
            
                this.isValidAmount = false;
    
        });
    }


    addMainDiscount() {
        const mainDiscount = this.discountControl.value
       console.log("New Data ",this.data.invoiceId)
      
            // Call the service to save discount and update the status service
            this.productCartService.addMainDiscount(this.data.invoiceId, mainDiscount).subscribe((res) => {
                // Update the discount in the shared state
                this.statusUpdateService.updateTempSalesDiscount(mainDiscount);
                // Close the dialog and return the discount
                this.cdr.detectChanges()
                this.dialogRef.close(mainDiscount);
            });
       
    }

    
    onNoClick() {
        console.log(this.data)
        this.dialogRef.close()
    }

}
