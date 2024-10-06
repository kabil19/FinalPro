import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { CustomerService } from 'src/app/service/customer-service/customer.service';
import { CustomerFormComponent } from '../../createData-forms/customer-form/customer-form.component';
import { ActionCellComponent } from 'src/app/custom-components/action-cell/user-action/action-cell.component';
import { CustomerActionComponent } from 'src/app/custom-components/action-cell/customer-action/customer-action.component';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.css', '../../../../assets/CSS/ComponentCommDesign.css']
})

export class CustomerComponent {
    rowData$!: Observable<any[]>;
    @ViewChild(AgGridAngular)
    agGrid!: AgGridAngular
    gridApi: GridApi | any = {}
    public rowSelection: 'single' | 'multiple' = 'single';
    searchCharac: string = ""
    public columnDef: ColDef[] = [
        // 
        { field: "custId", width: 90, hide: true },
        { field: "custName", },
        { field: "email", width: 250 },
        { field: "contact", },
        { field: "address" },
        { field: "Action", width: 90, cellRenderer: CustomerActionComponent, }
    ];

    constructor(
        private dialog: MatDialog,
        private custService: CustomerService,
    ) { }




    onGridReady(param: GridReadyEvent) {
        this.rowData$ = this.getRowData();
        this.gridApi = param?.api
        this.gridApi.sizeColumnsToFit();
    }

    onCellClicked(cellClickedEvent: CellClickedEvent) {
    }

    private getRowData(): any {
        return new Promise((resolve) => {
            this.custService.getAll().subscribe((custData) => {
                resolve(custData);
            }, (err) => {
                resolve([])
            })
        })
    }


    public setDataIntoRow() {
        this.custService.getAll().subscribe((custData) => {
            this.gridApi.setRowData(custData);
        }, (err) => {
        })
    }


    insertTrigger() {
        const extraData = {
            title: "Insert"
        }
        const openForm = this.dialog.open(CustomerFormComponent, { data: extraData, width: '500px', panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop" })
        openForm.afterClosed().subscribe(res => {
            this.setDataIntoRow();
        })

    }

    searchDataInRows() {
        if (this.searchCharac !== "") {
            this.custService.findData(this.searchCharac).subscribe(res => {
                this.gridApi.setRowData(res)
            });
        } else if (this.searchCharac === "") {
            this.setDataIntoRow()
        }
    }




}