import { Component } from '@angular/core';

import { ActionPopComponent } from '../action-pop/action-pop.component';
import { GridApi, ICellRendererParams } from 'ag-grid';
import { MatDialog } from '@angular/material/dialog';
import { CetegoryService } from 'src/app/service/category-service/cetegory.service';
import { CategoryFormComponent } from 'src/app/Template/createData-forms/category-form/category-form.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-category-action',
  templateUrl: './category-action.component.html',
  styleUrls: ['./category-action.component.css']
})
export class CategoryActionComponent {
    dataFromRow: any;
    gridApi: GridApi | any = {};
    

    constructor(
        public matDialog: MatDialog,
        private catService:CetegoryService,
        private toastr:ToastrService,

       
    ) {

    }

    agInit(params: ICellRendererParams): void {
        this.dataFromRow = params && params.data ? params.data : {};
        this.gridApi = params.api;
     }

     public setDataIntoRow() {
        this.catService.getAll().subscribe((retData)=>{
            this.gridApi.setRowData(retData)
        })
    }

    openDelDialog(): void {
        
        const extraData = {
            title : "Delete Category",
            subTitle: "Do you want to delete this Category?",
        }
        const deletePop= this.matDialog.open(ActionPopComponent, {data: extraData, panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop"});
        
        deletePop.afterClosed().subscribe((state:boolean) => {
            if(!state)return;
            this.catService.delete(this.dataFromRow.categoryId).subscribe((res)=>{
                console.log(res)
                this.toastr.clear()
                this.toastr.success(res)
                this.setDataIntoRow();
            },(error)=>{
                this.toastr.clear()
                this.toastr.error(error.error)
            })
               
            })
       
    }
    
    updateFormTrigger() {
        const data={
            title: "Update",
            catData:this.dataFromRow
        }
            const dialogRef = this.matDialog.open(CategoryFormComponent, {data, panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop"});
            dialogRef.afterClosed().subscribe(()=>{
                this.setDataIntoRow()
            })
        }
}
