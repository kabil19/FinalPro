import { Component, ViewChild } from '@angular/core';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmInvoiceService } from 'src/app/service/confirmInvoice-service/confirm-invoice.service';
import { PaymentActionComponent } from 'src/app/custom-components/action-cell/payment-action/payment-action.component';
import { InvoiceActionComponent } from 'src/app/custom-components/action-cell/invoice-action/invoice-action.component';
import moment from 'moment';


@Component({
    selector: 'app-confirmed-sales-invoice',
    templateUrl: './confirmed-sales-invoice.component.html',
    styleUrls: ['./confirmed-sales-invoice.component.css']
})
export class ConfirmedSalesInvoiceComponent {
    rowData$!: Observable<any[]>;
    @ViewChild(AgGridAngular)
    agGrid!: AgGridAngular
    gridApi: GridApi | any = {}
    public rowSelection: 'single' | 'multiple' = 'single';
    searchCharac: string = ""





    public columnDef: ColDef[] = [
        // 
        {
            field: "confirmInvoiceId",
            colId: "confirmInvoiceId",
            headerName: "Confirm Sales Invoice id",
            width: 90,
            hide: true
        },
        {
            field: "date",
            colId: "date",
            headerName: "Time Stamp",
            valueFormatter: (params) => {
                const val = (params.value)
                let dateTime = moment(new Date(val)).format("DD/MM/YYYY HH:mm:ss");
                dateTime = dateTime.split(' ')[0] + " | " + dateTime.split(' ')[1]
                return dateTime
            }
        },
        {
            field: "invoiceNumberRef",
            colId: "invoiceNumberRef",
            headerName: "Sales Invoice number"
        },
        {
            field: "netAmount",
            colId: "netAmount",
            headerName: "Total amount",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }
        },
        {
            field: "customerOBJ",
            colId: "customerOBJ",
            headerName: "Customer",
            valueFormatter: (params) => {
                const combinedvalue = params.value.custId + " | " + params.value.custName
                return combinedvalue
            }

        },
        {
            field: "paidAmount",
            colId: "paidAmount",
            headerName: "Paid amount",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }

        },
        {
            field: "isComplete",
            colId: "isComplete",
            headerName: "Is Complete",
            hide: true
        },
        {
            field: "action",
            headerName: "Action",
            // cellRenderer:,
            cellRenderer: PaymentActionComponent,
            cellRendererParams: {
                actionName: 'salesInvoice'
            }

        }
    ];



    constructor(
        private dialog: MatDialog,
        private confirmInvoiceService: ConfirmInvoiceService

    ) {

    }

    onGridReady(param: GridReadyEvent) {
        this.rowData$ = this.getRowData();
        this.gridApi = param?.api
        this.gridApi.sizeColumnsToFit();
    }


    onCellClicked(cellClickedEvent: CellClickedEvent) {

    }

    onCellDoubleClicked(cellClickedEvent: CellClickedEvent) {
        if (cellClickedEvent.colDef.field === 'invoiceNumberRef') {
            this.copyToClipboard(cellClickedEvent.value);
        }
    }


    copyToClipboard(value: string) {
        const el = document.createElement('textarea');
        el.value = value;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert(`Copied: ${value}`);
    }

    private getRowData(): any {
        return new Promise((resolve) => {
            this.confirmInvoiceService.getAllConfirmedInvoices().subscribe((invoiceData) => {
                // console.log(invoiceData)
                resolve(invoiceData?.result);
            }, (err) => {
                resolve([])
            })
        })
    }


    public setDataIntoRow() {
        this.confirmInvoiceService.getAllConfirmedInvoices().subscribe((invoiceData) => {
            this.gridApi.setRowData(invoiceData?.result);
        }, (err) => {
        })
    }




    searchDataInRows() {
        // this.gridApi.setQuickFilter(this.searchCharac)
        if (this.searchCharac !== "") {
            this.confirmInvoiceService.searchConfirmedSalesInvoice(this.searchCharac).subscribe(res => {
                console.log(res?.result)
                this.gridApi.setRowData(res?.result)
            });
        } else if (this.searchCharac === "") {
            this.setDataIntoRow()
        }
    }



}
