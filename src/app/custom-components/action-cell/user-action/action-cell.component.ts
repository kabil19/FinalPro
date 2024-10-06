import { Component } from '@angular/core';
import { GridApi, ICellRendererParams } from 'ag-grid';
import {
    MatDialog,
  } from '@angular/material/dialog';
import { __param } from 'tslib';
import { UserRegistrationForm } from 'src/app/Template/createData-forms/registration-form/userRegistration-form.component'; 
import { ActionPopComponent } from '../action-pop/action-pop.component';
import { UserService } from 'src/app/service/userService/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-action-cell',
    templateUrl: './action-cell.component.html',
    styleUrls: ['./action-cell.component.css'],
    template: '',
})
export class ActionCellComponent {

    dataFromRow: any;
    gridApi: GridApi | any = {};
    

    constructor( 
        private toastr: ToastrService,
        public matDialog: MatDialog,
        private userService:UserService
       
    ) {

    }

    agInit(params: ICellRendererParams): void {
        this.dataFromRow = params && params.data ? params.data : {};
        this.gridApi = params.api;
     }

     public setDataIntoRow() {
        this.userService.getAllUser().subscribe((retData)=>{
            this.gridApi.setRowData(retData)
        })
    }

    openDelDialog(): void {
        
        const extraData = {
            title : "Delete",
            subTitle: "Do you want to delete this customer?",
        }
        const deletePop= this.matDialog.open(ActionPopComponent, {data: extraData, panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop"});
        
        deletePop.afterClosed().subscribe((state:boolean) => {
            if(!state)return;
            this.userService.deleteUser(this.dataFromRow.userId).subscribe((res)=>{
                if(res?.successMessage!=null){
                    this.toastr.success(res?.successMessage)
                    this.setDataIntoRow();
                }else{
                    this.toastr.clear()
                    this.toastr.error(res?.errors)
                }
                
            })
        })
       
    }
    
    updateFormTrigger() {
        console.log(this.dataFromRow    )
        const extraData={
            title: "Update",
            userdata:this.dataFromRow
        }
            const dialogRef = this.matDialog.open(UserRegistrationForm, {data:extraData, panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop"});
            dialogRef.afterClosed().subscribe(()=>{
                this.setDataIntoRow()
            })
        }
}


