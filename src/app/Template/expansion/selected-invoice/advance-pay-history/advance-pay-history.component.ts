import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import moment from 'moment';
import { InvoicePaymentComponent } from 'src/app/Template/payments/invoice-payment/invoice-payment.component';
import { PaymentsService } from 'src/app/service/payments-service/payments.service';
import { AdvancePayServiceService } from 'src/app/service/advance-pay-service/advance-pay-service.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IInvoiceEntity } from 'src/app/constants/interfaces/IInvoiceEntity';
import { IPaymentEntity } from 'src/app/constants/interfaces/IPaymentEntity';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { StatusUpdateService } from 'src/app/service/sharedServiceForStates/status-update.service';
import { AdvancePayActionComponent } from 'src/app/custom-components/action-cell/advance-pay-action/advance-pay-action.component';
@Component({
  selector: 'app-advance-pay-history',
  templateUrl: './advance-pay-history.component.html',
  styleUrls: ['./advance-pay-history.component.css']
})
export class AdvancePayHistoryComponent {
  rowData$!: Observable<any[]>;
  @ViewChild(AgGridAngular)
  agGrid!: AgGridAngular
  gridApi: GridApi | any = {}
  public rowSelection: 'single' | 'multiple' = 'single';
  searchCharac: string = ""
  tempInvoiceData!: IInvoiceEntity
  paymentsDataList: IPaymentEntity[] = []
  paidAmount!: number;
  netAmount: any;

  constructor(
    private paymentService: PaymentsService,
    private advPaymentService: AdvancePayServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private statusUpdateService: StatusUpdateService,

  ) {

  }
  ngOnInit() {
    // console.log("Payable data ", this.data.payable)
    this.tempInvoiceData = this.data.tempInvoiceData
    this.getAllPayments()
    this.statusUpdateService.tempSalesCartNetAmount$.subscribe(res => {
      this.netAmount = res
    })

  }
  public columnDef: ColDef[] = [
    // 
    {
      field: "paymentId",
      colId: "paymentId",
      headerName: "Pay Id",

      hide: true
    },
    {
      field: "paymentType",
      colId: "paymentType",
      headerName: "Pay Type",

    },
    {
      field: "paidDate",
      colId: "paidDate",
      headerName: "Paid Date",
      valueFormatter: (params) => {
        const val = (params.value)
        let dateTime = moment(new Date(val)).format("DD/MM/YYYY HH:mm:ss");
        dateTime = dateTime.split(' ')[0] + " | " + dateTime.split(' ')[1]
        return dateTime
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
      field: "action",
      headerName: "Action",
      cellRenderer: AdvancePayActionComponent,
    }
  ];
  onGridReady(param: GridReadyEvent) {
    this.rowData$ = this.getRowData();
    this.gridApi = param?.api
    this.gridApi.sizeColumnsToFit();

  }




  private getRowData(): any {

    return new Promise((resolve) => {
      this.paymentService.getAllPayments(this.tempInvoiceData.tempInvoiceId).subscribe((invoiceData) => {
        resolve(invoiceData?.result);
      }, (err) => {
        resolve([])
      })
    })
  }
  onCellClicked(cellClickedEvent: CellClickedEvent) {

  }

  makePayment() {
    const extraData = {
      totalAmount: this.netAmount,
      tempInvoiceData: this.tempInvoiceData,
      payable: this.data.payable
    };
    const invoicePaymentOpen = this.matDialog.open(
      InvoicePaymentComponent,
      { data: extraData, panelClass: ["custom-dialog-container"], backdropClass: "dialogbox-backdrop" }
    );
    invoicePaymentOpen.afterClosed().subscribe((res) => {
      this.getAllPayments()
      this.setDataIntoRow()
    })
  }
  public setDataIntoRow() {

    this.paymentService.getAllPayments(this.tempInvoiceData.tempInvoiceId).subscribe((pay) => {
      this.gridApi.setRowData(pay.result);


    }, (err) => {
    })
  }

  getAllPayments() {

    this.paymentService.getAllPayments(this.tempInvoiceData.tempInvoiceId).subscribe((res) => {
      GLOBAL_LIST.PAYMENTS_DATA = res.result;
      this.paymentsDataList = res.result
      this.getTotalPaidAmount()
      this.cdr.detectChanges()
    });

  }



  getTotalPaidAmount() {

    let totalPaidAmount = 0;
    if (this.paymentsDataList.length > 0) {
      totalPaidAmount = this.paymentsDataList.reduce((accumulator, currentValue) => accumulator + currentValue.paidAmount, 0)

    }
    this.paidAmount = totalPaidAmount
  }
}
