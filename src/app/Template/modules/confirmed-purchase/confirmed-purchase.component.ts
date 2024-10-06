import { Component, ViewChild } from '@angular/core';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPurchaseAndCartServiceService } from 'src/app/service/confirmPurchase-service/confirm-purchase-and-cart-service.service';
import { PaymentActionComponent } from 'src/app/custom-components/action-cell/payment-action/payment-action.component';
import { CustomerActionComponent } from 'src/app/custom-components/action-cell/customer-action/customer-action.component';
import moment from 'moment';

@Component({
    selector: 'app-confirmed-purchase',
    templateUrl: './confirmed-purchase.component.html',
    styleUrls: ['./confirmed-purchase.component.css']
})
export class ConfirmedPurchaseComponent {
    rowData$!: Observable<any[]>;
    @ViewChild(AgGridAngular)
    agGrid!: AgGridAngular
    gridApi: GridApi | any = {}
    public rowSelection: 'single' | 'multiple' = 'single';
    searchCharac: string = ""


    public columnDef: ColDef[] = [
        // 
        {
            field: "confirmPurchaseId",
            colId: "confirmPurchaseId",
            headerName: "Confirm Purchase id",
            width: 90,
            hide: true
        },
        {
            field: "purchaseDate",
            colId: "purchaseDate",
            headerName: "Time Stamp",
            valueFormatter: (params) => {
                const val = (params.value)
                let dateTime = moment(new Date(val)).format("DD/MM/YYYY HH:mm:ss");
                dateTime = dateTime.split(' ')[0] + " | " + dateTime.split(' ')[1]
                return dateTime
            }
        },
        {
            field: "purchaseInvoice",
            colId: "purchaseInvoice",
            headerName: "Purchase Invoice number"
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
            field: "vendorOBJ",
            colId: "vendorOBJ",
            headerName: "Vendor",
            valueFormatter: (params) => {
                const combinedvalue = params.value.vendorId + " | " + params.value.vendorName
                return combinedvalue
            },
            width: 190


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
            cellRenderer: PaymentActionComponent,
            cellRendererParams: {
                actionName: 'purchaseInvoice'
            }
        }
    ];


    constructor(
        private dialog: MatDialog,
        private confirmPurchaseInvoiceService: ConfirmPurchaseAndCartServiceService

    ) {
    }
    onGridReady(param: GridReadyEvent) {
        this.rowData$ = this.getRowData();
        this.gridApi = param?.api
        this.gridApi.sizeColumnsToFit();
    }


    onCellDoubleClicked(cellClickedEvent: CellClickedEvent) {
        if (cellClickedEvent.colDef.field === 'purchaseInvoice') {
            this.copyToClipboard(cellClickedEvent.value);
        }
    }
    onCellClicked(cellClickedEvent: CellClickedEvent) {

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
            this.confirmPurchaseInvoiceService.getAllConfirmPurchaseInvoices().subscribe((invoiceData) => {
                resolve(invoiceData?.result);
                // console.log(invoiceData)
            }, (err) => {
                resolve([])
            })
        })
    }


    public setDataIntoRow() {
        this.confirmPurchaseInvoiceService.getAllConfirmPurchaseInvoices().subscribe((invoiceData) => {
            // console.log(invoiceData?.result)
            this.gridApi.setRowData(invoiceData?.result);
        }, (err) => {
        })
    }




    searchDataInRows() {

        if (this.searchCharac !== "") {
            this.confirmPurchaseInvoiceService.searchConfirmInvoice(this.searchCharac).subscribe(res => {
                this.gridApi.setRowData(res?.result)
                console.log(res?.result)
            });
        } else if (this.searchCharac === "") {
            this.setDataIntoRow()
        }
    }


}
