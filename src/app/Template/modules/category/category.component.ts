import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { CategoryActionComponent } from 'src/app/custom-components/action-cell/category-action/category-action.component';
import { CetegoryService } from 'src/app/service/category-service/cetegory.service';
import { CategoryFormComponent } from '../../createData-forms/category-form/category-form.component';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent {
    rowData$!: Observable<any[]>;
    @ViewChild(AgGridAngular)
    agGrid!: AgGridAngular
    gridApi: GridApi | any = {}
    public rowSelection: 'single' | 'multiple' = 'single';
    searchCharac: string = ""
    public columnDef: ColDef[] = [
        // 
        { field: "categoryId", width: 90, hide: true },
        { field: "categoryName", },
        { field: "description", width: 250 },
        { field: "Action", width: 90, cellRenderer: CategoryActionComponent, }
    ];

    constructor(
        private dialog: MatDialog,
        private catService: CetegoryService,
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
            this.catService.getAll().subscribe((catData) => {
                resolve(catData);
            }, (err) => {
                resolve([])
            })
        })
    }


    public setDataIntoRow() {
        this.catService.getAll().subscribe((catData) => {
            this.gridApi.setRowData(catData);
        }, (err) => {
        })
    }


    insertTrigger() {
        const extraData = {
            title: "Insert"
        }
        const openForm = this.dialog.open(CategoryFormComponent, { data: extraData, panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop" })
        openForm.afterClosed().subscribe(res => {
            this.setDataIntoRow();
        })

    }

    searchDataInRows() {
        if (this.searchCharac !== "") {
            this.catService.findData(this.searchCharac).subscribe(res => {
                this.gridApi.setRowData(res)
            });
        } else if (this.searchCharac === "") {
            this.setDataIntoRow()
        }
    }




}
