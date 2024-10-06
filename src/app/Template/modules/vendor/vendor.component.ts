import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { VendorService } from 'src/app/service/vendor-service/vendor.service';
import { VendorFormComponent } from '../../createData-forms/vendor-form/vendor-form.component';
import { VendorActionComponent } from 'src/app/custom-components/action-cell/vendor-action/vendor-action.component';

@Component({
    selector: 'app-vendor',
    templateUrl: './vendor.component.html',
    styleUrls: ['./vendor.component.css',]
})
export class VendorComponent {
    rowData$!: Observable<any[]>;
    @ViewChild(AgGridAngular)
    agGrid!: AgGridAngular
    gridApi: GridApi | any = {}
    public rowSelection: 'single' | 'multiple' = 'single';
    searchCharac: string = ""
    public columnDef: ColDef[] = [
        // 
        { field: "vendorId", width: 90, hide: true },
        { field: "vendorName", },
        { field: "address", },
        { field: "email", },
        { field: "contact", },
        { field: "action", cellRenderer: VendorActionComponent, }
    ];

    constructor(
        private dialog: MatDialog,
        private vendorService: VendorService,
    ) { }




    onGridReady(param: GridReadyEvent) {
        this.rowData$ = this.getRowData();
        this.gridApi = param?.api
        this.gridApi.sizeColumnsToFit();
    }

    onCellClicked(cellClickedEvent: CellClickedEvent) {
        //    console.log(cellClickedEvent)
    }

    private getRowData(): any {
        return new Promise((resolve) => {
            this.vendorService.getAll().subscribe((vendorDate) => {
                resolve(vendorDate);
            }, (err) => {
                resolve([])
            })
        })
    }


    public setDataIntoRow() {
        this.vendorService.getAll().subscribe((vendorData) => {
            this.gridApi.setRowData(vendorData);
        }, (err) => {
        })
    }


    insertTrigger() {
        const extraData = {
            title: "Insert"
        }
        const openForm = this.dialog.open(VendorFormComponent, { data: extraData, panelClass: ["custom-dialog-container"], backdropClass: "dialogbox-backdrop", width: '350px' })
        openForm.afterClosed().subscribe(res => {
            this.setDataIntoRow();
        })

    }

    searchDataInRows() {
        // this.gridApi.setQuickFilter(this.searchCharac)
        if (this.searchCharac !== "") {
            this.vendorService.findData(this.searchCharac).subscribe(res => {
                this.gridApi.setRowData(res)
            });
        } else if (this.searchCharac === "") {
            this.setDataIntoRow()
        }
    }






}