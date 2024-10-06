import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { StockActionComponent } from 'src/app/custom-components/action-cell/stock-action/stock-action.component';
import { StockService } from 'src/app/service/stock-service/stock.service';
import { StockFormComponent } from '../../createData-forms/stock-form/stock-form.component';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { CetegoryService } from 'src/app/service/category-service/cetegory.service';
import moment from 'moment';

@Component({
    selector: 'app-stock',
    templateUrl: './stock.component.html',
    styleUrls: ['./stock.component.css', '../../../../assets/CSS/ComponentCommDesign.css']
})
export class StockComponent {
    rowData$!: Observable<any[]>;
    @ViewChild(AgGridAngular)
    agGrid!: AgGridAngular
    gridApi: GridApi | any = {}
    public rowSelection: 'single' | 'multiple' = 'single';
    searchCharac: string = ""
    private areExtraColumnsVisible = false;
    public columnDef: ColDef[] = [
        // 
        { field: "stockId", hide: true, suppressColumnsToolPanel: true },
        {
            field: "categoryOBJ",
            headerName: "Category",
            hide: true, // Initially hidden
            valueFormatter: (params) => {
                const combinedvalue = params.value.categoryId + " | " + params.value.categoryName
                return combinedvalue
            }
        },
        { field: "itemName", },
        { field: "materialColour", },
        {
            field: "arrivalDate",
            valueFormatter: (params) => {
                const val = (params.value)
                let dateTime = moment(new Date(val)).format("DD/MM/YYYY HH:mm:ss");
                dateTime = dateTime.split(' ')[0] + " | " + dateTime.split(' ')[1]
                return dateTime
            }
        },
        {
            field: "purchasePrice",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }
        },
        {
            field: "sellingPrice",
            valueFormatter: (params) => {
                const val = (params.value.toFixed(2))
                return val
            }
        },
        {
            field: "reorderQty", valueFormatter: (params) => {
                const val = (params.value.toFixed(2))
                return val
            }, hide: true, // Initially hidden

        },
        {
            field: "quantity", valueFormatter: (params) => {
                const val = (params.value.toFixed(2))
                return val
            },

        },
        {
            field: "remarks",
        },
        { field: "Action", cellRenderer: StockActionComponent, }
    ];

    constructor(
        private dialog: MatDialog,
        private stockService: StockService,
        private catService: CetegoryService
    ) { this.getAllCategoryData() }


    onActionTriggered(): void {
        this.toggleExtraColumns();
    }

    toggleExtraColumns(): void {
        // Toggle the state
        this.areExtraColumnsVisible = !this.areExtraColumnsVisible;

        this.columnDef = this.columnDef.map(col => {
            if (col.field === 'arrivalDate' || col.field === 'categoryOBJ' || col.field === 'reorderQty') {
                col.hide = !this.areExtraColumnsVisible; // Show or hide columns based on state
            }
            return col;
        });

        // If grid API is available
        if (this.gridApi) {
            setTimeout(() => {
                this.gridApi.setColumnDefs(this.columnDef); // Apply updated column definitions

                // Only resize columns to fit the grid if the extra columns are hidden
                if (!this.areExtraColumnsVisible) {
                    this.gridApi.sizeColumnsToFit();
                }
            }, 0);
        }
    }

    onGridReady(param: GridReadyEvent) {
        this.rowData$ = this.getRowData();
        this.gridApi = param?.api
        this.gridApi.sizeColumnsToFit();
    }



    private getRowData(): any {
        return new Promise((resolve) => {
            this.stockService.getAllStock().subscribe((stockData) => {
                resolve(stockData);
            }, (err) => {
                resolve([])
            })
        })
    }

    // every Time delete,add,update have been used this specific function should be used by classes(popups or etc) so kept public 
    // or else this should be created for every class 
    public setDataIntoRow() {
        this.stockService.getAllStock().subscribe((stockData) => {
            this.gridApi.setRowData(stockData);
        }, (err) => {
        })
    }


    insertTrigger() {
        const extraData = {
            title: "Insert"
        }
        const openForm = this.dialog.open(StockFormComponent, { data: extraData, panelClass: ["custom-dialog-container"], backdropClass: "dialogbox-backdrop" })
        openForm.afterClosed().subscribe(res => {
            this.setDataIntoRow();
        })

    }

    searchDataInRows() {
        // this.gridApi.setQuickFilter(this.searchCharac)
        if (this.searchCharac !== "") {
            this.stockService.findData(this.searchCharac).subscribe(res => {
                this.gridApi.setRowData(res)
            });
        } else if (this.searchCharac === "") {
            this.setDataIntoRow()
        }
    }

    getAllCategoryData() {
        this.catService.getAll().subscribe(res => {
            GLOBAL_LIST.CATEGORY_DATA = res
        })

    }

}
