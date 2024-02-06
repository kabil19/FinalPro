import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActionPopComponent } from 'src/app/custom-components/action-cell/action-pop/action-pop.component';
import { InvoiceService } from 'src/app/service/invoice-service/invoice.service';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css','../form-design.css']
})
export class InvoiceFormComponent {
    invoiceForm: FormGroup;
    hide: boolean = true;
    allData: any;
   
   
    constructor(
        private toastr : ToastrService,
        private invoiceService:InvoiceService,
        private matDialog: MatDialog,
        private matDialogRef: MatDialogRef<InvoiceFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.invoiceForm=new FormGroup({
            tempInvoiceId:new FormControl,
            date:new FormControl(null,Validators.required),
            netAmount:new FormControl(null,Validators.required),
            customerOBJ:new FormControl(null,Validators.required),
           
        })
    }

   

    setDataIntoFormFields() {
        return this.invoiceForm.setValue({
            tempInvoiceId:this.data.tempInvoiceData.tempInvoiceId,
            date: this.data.tempInvoiceData.date,
            netAmount:this.data.tempInvoiceData.netAmount,
            customerOBJ: this.data.tempInvoiceData.customerOBJ.custName,
        })
    }

    ngOnInit(): void {
       
        if (this.data.title === "Update") {
            this.setDataIntoFormFields()
        }
    }
    
    

    selectOperation() {
        console.log(this.invoiceForm.getRawValue)
        if(!this.invoiceForm.valid){
            this.toastr.warning("Enter a valid data to " + this.data.title)
            return;
        }
        if (this.data.title == "Insert" && this.invoiceForm.valid) {
            this.insertPopTrigger();
           
        } else if (this.data.title == "Update" && this.invoiceForm.valid){
            this.updatePopTrigger();
        }
        
    }
    insertPopTrigger() {
       
        const extraData = {
            title: "Insert",
            subTitle: "are you sure you want to add this data?",
        }
        const openActionPop = this.matDialog.open(ActionPopComponent, { data: extraData })
        openActionPop.afterClosed().subscribe((state:boolean) => {
            if(!state)return;
            this.invoiceService.regiterReq(this.invoiceForm.value).subscribe(res=>{
                this.matDialogRef.close()
                this.toastr.success(res)
        })
           
        })
        

    }

    updatePopTrigger() {
        const extraData = {
            title: this.data.title,
            subTitle: "are you sure you want to update the selected data?",
          
        }
        const openActionPop = this.matDialog.open(ActionPopComponent, { data: extraData })
        openActionPop.afterClosed().subscribe((state:boolean) => {
            if(!state)return;
            this.invoiceService.update(this.invoiceForm.value).subscribe((res)=>{
                this.matDialogRef.close()
                this.toastr.success(res)
            })
        })

    }
}