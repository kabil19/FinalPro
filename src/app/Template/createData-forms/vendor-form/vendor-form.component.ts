import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { addressPattern, emailPattern, namePattern, phoneNumberPattern } from 'src/app/constants/interfaces/VALIDATORS';
import { ActionPopComponent } from 'src/app/custom-components/action-cell/action-pop/action-pop.component';
import { VendorService } from 'src/app/service/vendor-service/vendor.service';

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.css','../form-design.css']
})
export class VendorFormComponent {
    vendorForm: FormGroup;
    hide: boolean = true;
    allData: any;
   
   
    constructor(
        private toastr : ToastrService,
        private vendorService:VendorService,
        private matDialog: MatDialog,
        private matDialogRef: MatDialogRef<VendorFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.vendorForm=new FormGroup({
            vendorId:new FormControl,
            vendorName:new FormControl(null,[Validators.required,Validators.pattern(namePattern)]),
            contact:new FormControl(null,[
                Validators.required,
                Validators.pattern(phoneNumberPattern),
                Validators.minLength(10),
                Validators.maxLength(15)
              ]),
              address:new FormControl(null,[Validators.required,Validators.pattern(addressPattern),Validators.maxLength(35)]),
              email:new FormControl(null,[Validators.required,Validators.email,Validators.pattern(emailPattern)]),
        })
    }

   

    setDataIntoFormFields() {
        return this.vendorForm.setValue({
            vendorId:this.data.vendorData.vendorId,
            vendorName: this.data.vendorData.vendorName,
            contact:this.data.vendorData.contact,
            address:this.data.vendorData.address,
            email: this.data.vendorData.email,
        })
    }

    ngOnInit(): void {
       
        if (this.data.title === "Update") {
            this.setDataIntoFormFields()
        }
    }
    
    

    selectOperation() {
        console.log(this.vendorForm.getRawValue)
        if(!this.vendorForm.valid){
            this.toastr.warning("Enter a valid data to " + this.data.title)
            return;
        }
        if (this.data.title == "Insert" && this.vendorForm.valid) {
            this.insertPopTrigger();
           
        } else if (this.data.title == "Update" && this.vendorForm.valid){
            this.updatePopTrigger();
        }
        
    }
    insertPopTrigger() {
       
        const extraData = {
            title: "Insert",
            subTitle: "are you sure you want to add this data?",
        }
        const openActionPop = this.matDialog.open(ActionPopComponent, { data: extraData ,panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop"})
        openActionPop.afterClosed().subscribe((state:boolean) => {
            if(!state)return;
            this.vendorService.regiterReq(this.vendorForm.value).subscribe(res=>{
                this.matDialogRef.close()
                this.toastr.success(res)
        },(error)=>{
            this.toastr.error(error.error)
        })
           
        })
        

    }

    updatePopTrigger() {
        const extraData = {
            title: this.data.title,
            subTitle: "are you sure you want to update the selected data?",
          
        }
        const openActionPop = this.matDialog.open(ActionPopComponent, { data: extraData ,panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop"})
        openActionPop.afterClosed().subscribe((state:boolean) => {
            if(!state)return;
            this.vendorService.update(this.vendorForm.value).subscribe((res)=>{
                this.matDialogRef.close()
                this.toastr.success(res)
            },(error)=>{
                this.toastr.error(error.error)
            })
               
            })

    }
}
