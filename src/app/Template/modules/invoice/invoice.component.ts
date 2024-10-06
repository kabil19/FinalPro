import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { InvoiceActionComponent } from 'src/app/custom-components/action-cell/invoice-action/invoice-action.component';
import { InvoiceService } from 'src/app/service/invoice-service/invoice.service';
import { InvoiceFormComponent } from '../../createData-forms/invoice-form/invoice-form.component';
import { CustomerService } from 'src/app/service/customer-service/customer.service';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { InvoiceFinalizationComponent } from 'src/app/custom-components/invoice-finalization/invoice-finalization.component';
import { ValueGetterParams } from 'ag-grid/dist/lib/entities/colDef';
import { ActionCellComponent } from 'src/app/custom-components/action-cell/user-action/action-cell.component';
import { IInvoiceEntity } from '../../../constants/interfaces/IInvoiceEntity';
import { ProductCartService } from 'src/app/service/productCart-service/product-cart.service';
import moment from 'moment';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {

    rowData$!: Observable<any[]>;
    @ViewChild(AgGridAngular)
    agGrid!: AgGridAngular
    gridApi: GridApi | any = {}
    public rowSelection: 'single' | 'multiple' = 'single';
    searchCharac: string = ""
    public columnDef: ColDef[] = [
        // 
        {
            field: "tempInvoiceId",
            colId: "tempInvoiceId",
            headerName: "Temp id",
            width: 90,
            hide: true
        },
        {
            field: "date",
            colId: "date",
            headerName: "Date",
            valueFormatter: (params) => {
                const val = (params.value)
                let dateTime = moment(new Date(val)).format("DD/MM/YYYY HH:mm:ss");
                dateTime = dateTime.split(' ')[0] + " | " + dateTime.split(' ')[1]
                return dateTime
            },
            width: 250

        },
        {
            field: "tempInvoiceNumberRef",
            colId: "tempInvoiceNumberRef",
            headerName: "Invoice number",
            valueFormatter: (params) => {
                const val = (params.value)
                return val
            }, width: 220,
        },
        {
            field: "netAmount",
            colId: "netAmount",
            headerName: "Net amount",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }, width: 245,

        },
        {
            field: "customerOBJ",
            colId: "customerOBJ",
            headerName: "Customer",
            valueFormatter: (params) => {
                const combinedvalue = params.value.custId + "-" + params.value.custName
                return combinedvalue
            },
            width: 220

        },
        {
            field: "paidAmount",
            colId: "paidAmount",
            headerName: "Paid amount",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }, width: 200,


        },
        {
            field: "finalized",
            colId: "finalized",
            headerName: "Is Finalized",
            cellRenderer: InvoiceFinalizationComponent,
            hide: true
        },
        {
            field: "action",
            headerName: "Action",
            cellRenderer: InvoiceActionComponent,
            //  width:220
            width: 90
        },

    ];




    constructor(
        private dialog: MatDialog,
        private invoiceService: InvoiceService,
        private customerService: CustomerService,

    ) {
        this.getAllCustomerData()

    }




    onGridReady(param: GridReadyEvent) {
        this.rowData$ = this.getRowData();
        this.gridApi = param?.api
        this.gridApi.sizeColumnsToFit();
    }


    onCellClicked(cellClickedEvent: CellClickedEvent) {

    }

    private getRowData(): any {
        return new Promise((resolve) => {
            this.invoiceService.getAll().subscribe((invoiceData) => {
                resolve(invoiceData);
            }, (err) => {
                resolve([])
            })
        })
    }

    // loadAllProductCart(){
    //     this.productCartService.loadAll().subscribe((cartData)=>{
    //        GLOBAL_LIST.PRODUCTCART_DATA =  cartData?.result?.[0]
    //     })
    // }
    public setDataIntoRow() {
        this.invoiceService.getAll().subscribe((invoiceData) => {
            this.gridApi.setRowData(invoiceData);
        }, (err) => {
        })
    }


    insertTrigger() {

        const extraData = {
            title: "Insert"
        }
        const openForm = this.dialog.open(InvoiceFormComponent, { data: extraData, panelClass: "custom-dialog-container", backdropClass: "dialogbox-backdrop" })
        openForm.afterClosed().subscribe(res => {
            this.setDataIntoRow();
        })

    }

    searchDataInRows() {
        // this.gridApi.setQuickFilter(this.searchCharac)
        if (this.searchCharac !== "") {
            this.invoiceService.findData(this.searchCharac).subscribe(res => {
                this.gridApi.setRowData(res)
            });
        } else if (this.searchCharac === "") {
            this.setDataIntoRow()
        }
    }

    getAllCustomerData() {
        this.customerService.getAll().subscribe(res => {
            GLOBAL_LIST.CUSTOMER_DATA = res
        })
    }

}
