import { Component, Inject, ViewChild } from '@angular/core';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { ConfirmInvoiceService } from 'src/app/service/confirmInvoice-service/confirm-invoice.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MakeReturnCartComponent } from 'src/app/custom-components/action-cell/make-return-cart/make-return-cart.component';
import { ReturnCartService } from 'src/app/service/return-service/return-cart.service';
@Component({
  selector: 'app-sales-return-cart',
  templateUrl: './sales-return-cart.component.html',
  styleUrls: ['./sales-return-cart.component.css']
})
export class SalesReturnCartComponent {
    rowData$!: Observable<any[]>;
    @ViewChild(AgGridAngular)
    agGrid!: AgGridAngular
    gridApi: GridApi | any = {}
    public rowSelection: 'single' | 'multiple' = 'single';
    searchCharac: string = ""

    constructor(
        private confirmedInvoiceCartService:ConfirmInvoiceService,
        private returnCartService:ReturnCartService,

        @Inject(MAT_DIALOG_DATA) public data: any,
        private totatr:ToastrService
    ){

    }

    public columnDef: ColDef[] = [


        {
            field: "proCartId",
            colId: "proCartId",
            headerName: "Cart Row ID",
            width: 90,
            hide: true
        },
       
        {
            field: "stockOBJ",
            colId: "stockOBJ",
            headerName: "Product",
            valueFormatter: (params) => {
                const combinedvalue = params.value.stockId + "-" + params.value.itemName
                return combinedvalue
            }
        },
        {
            field: "quantity",
            colId: "quantity",
            headerName: "Qty",
            valueFormatter: (params) => {
                const val = (params.value.toFixed(2))
                return val
            },
           
            width: 180
        },
        {
            field: "total",
            colId: "total",
            headerName: "Gross Total",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }

        },
        {
            field: "discount",
            colId: "discount",
            headerName: "Discount",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }

        },
        {
            field: "netAmount",
            colId: "netAmount",
            headerName: "Net amount",
            valueFormatter: (params) => {
                const val = "Rs. " + (params.value.toFixed(2))
                return val
            }
        },
        {
            field: "tempInvoiceOBJ",
            colId: "tempInvoiceOBJ",
            headerName: "Invoice ID",
            valueFormatter: (params) => {
                const combinedvalue = params.value.tempInvoiceNumber
                return combinedvalue
            },
            hide: true

        },
        {
            field: "action",
            headerName: "Action",
            cellRenderer: MakeReturnCartComponent,
            cellRendererParams: {
                // actionName: 'salesInvoice'
                onActionClick: (rowData:any) => {
                    
                }
            }

        }
    ];

    onGridReady(param: GridReadyEvent) {
        this.rowData$ = this.getRowData();
        this.gridApi = param?.api
        this.gridApi.sizeColumnsToFit();
    }


    onCellClicked(cellClickedEvent: CellClickedEvent) {

    }

    /* onCellDoubleClicked(cellClickedEvent: CellClickedEvent) {
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
    } */

    private getRowData(): any {
        console.log("line 148 ", this.data)
        return new Promise((resolve) => {
            
            this.returnCartService.retrieveRemainingCartItems(this.data).subscribe(res=>{
               console.log("line 148 ", res)
                resolve(res.result)
            },(err)=>{
                resolve([])
            })

         
        })
    }
    confirmReturn(){
        
    }
}
