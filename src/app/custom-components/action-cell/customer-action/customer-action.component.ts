import { Component } from '@angular/core';
import { ActionPopComponent } from '../action-pop/action-pop.component';
import { GridApi, ICellRendererParams } from 'ag-grid';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from 'src/app/service/customer-service/customer.service';
import { CustomerFormComponent } from 'src/app/Template/createData-forms/customer-form/customer-form.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-customer-action',
    templateUrl: './customer-action.component.html',
    styleUrls: ['./customer-action.component.css']
})
export class CustomerActionComponent {
    dataFromRow: any;
    gridApi: GridApi | any = {};


    constructor(
        private toastr: ToastrService,
        public matDialog: MatDialog,
        private custService: CustomerService

    ) {

    }

    agInit(params: ICellRendererParams): void {
        this.dataFromRow = params && params.data ? params.data : {};
        this.gridApi = params.api;
    }

    public setDataIntoRow() {
        this.custService.getAll().subscribe((retData) => {
            this.gridApi.setRowData(retData)
        })
    }

    openDelDialog(): void {

        const extraData = {
            title: "Delete Customer",
            subTitle: "Do you want to delete this customer?",
        }
        const deletePop = this.matDialog.open(ActionPopComponent, { data: extraData, panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop" });

        deletePop.afterClosed().subscribe((state: boolean) => {
            if (!state) return;


            this.custService.delete(this.dataFromRow.custId).subscribe((res) => {
                this.toastr.success(res)
                this.setDataIntoRow();
            }, (error) => {
                this.toastr.error(error.error)
            })

        })

    }

    updateFormTrigger() {
        const data = {
            title: "Update",
            custData: this.dataFromRow
        }
        const dialogRef = this.matDialog.open(CustomerFormComponent, { data, width: '500px', panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop" });
        dialogRef.afterClosed().subscribe(() => {
            this.setDataIntoRow()
        })
    }
}
