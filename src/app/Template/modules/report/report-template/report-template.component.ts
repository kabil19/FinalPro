import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import moment from 'moment';
import { IConfirmInvoiceEntity } from 'src/app/constants/interfaces/IConfirmInvoiceEntity';
import { IConfirmPurchaseEntity } from 'src/app/constants/interfaces/IConfirmPurchaseEntity';
import { IConfirmSalesConfirmPayments } from 'src/app/constants/interfaces/IConfirmSalesConfirmPayments';
import { IPurchasePaymentEntity } from 'src/app/constants/interfaces/IPurchasePaymentEntity';
import { ConfirmInvoiceService } from 'src/app/service/confirmInvoice-service/confirm-invoice.service';
interface IListOfData {
    title: string,
    tableHeader: string[],
    tableData: string[][],
    error: any
}

interface VendorData {
    purchaseInvoiceData: IConfirmPurchaseEntity[];
    paymentsOfThePurchase: IPurchasePaymentEntity[];
}
interface CustomerData {
    salesInvoiceData: IConfirmInvoiceEntity[];
    paymentsOfTheSales: IConfirmSalesConfirmPayments[];
}

const formatVendorData = (data: VendorData): string[][] => {
    // console.log(data)
    const combineDataEntries: string[][] = []
    let totalNetAmount = 0
    let totalPaidAmount = 0
    // Calculate total paid amount
    data.paymentsOfThePurchase?.filter(aPay => {
        totalPaidAmount = totalPaidAmount + aPay.paidAmount
    })
    // Calculate total net amount
    data.purchaseInvoiceData?.filter(aPurchaseInvoice => {
        totalNetAmount = totalNetAmount + aPurchaseInvoice.netAmount
    })
    // Combine data entries
    data.purchaseInvoiceData?.forEach(anInvoice => {
        combineDataEntries.push([
            moment(new Date(anInvoice.purchaseDate)).format('DD/MM/YYYY HH:mm '),
            `Invoice Ref No.  ${anInvoice.purchaseInvoice}`,
            `Rs. ${anInvoice?.netAmount?.toFixed(2)}`,
            ''
        ])
        const payments = data.paymentsOfThePurchase?.filter(aPayment => {
            return aPayment.ConfirmPurchaseOBJ.confirmPurchaseId == anInvoice.confirmPurchaseId
        })
        payments?.forEach((aPay: IPurchasePaymentEntity) => {
            combineDataEntries.push([
                moment(new Date(aPay?.paidDate)).format('DD/MM/YYYY HH:mm '),
                `${aPay.paymentType} Payment- Invoice Ref No. ${aPay?.ConfirmPurchaseOBJ?.purchaseInvoice}`,
                '',
                `Rs. ${aPay.paidAmount.toFixed(2)}`
            ])
        })
    })

    combineDataEntries.push([
        '',
        '',
        `Rs. ${totalNetAmount.toFixed(2)}`,
        `Rs. ${totalPaidAmount.toFixed(2)}`,
    ])
    return combineDataEntries;
}

const formatCustomerData = (data: CustomerData): string[][] => {
    console.log(data)
    const combineDataEntries: string[][] = []
    let totalNetAmount = 0
    let totalPaidAmount = 0
    data?.paymentsOfTheSales?.filter(aPay => {
        totalPaidAmount = totalPaidAmount + aPay.paidAmount
    })

    data?.salesInvoiceData?.filter(anInvoice => {
        totalNetAmount = totalNetAmount + anInvoice.netAmount
    })

    data?.salesInvoiceData?.forEach(anInvoice => {
        combineDataEntries.push([
            moment(new Date(anInvoice.date)).format('DD/MM/YYYY HH:mm'),
            `Invoice Ref No. ${anInvoice.invoiceNumberRef}`,
            `Rs. ${anInvoice?.netAmount?.toFixed(2)}`,
            ''
        ])
        const payments = data?.paymentsOfTheSales?.filter(aPayment => {
            return aPayment?.confirmInvoiceOBJ?.confirmInvoiceId == anInvoice?.confirmInvoiceId
        })

        payments?.forEach((aPay: IConfirmSalesConfirmPayments) => {
            console.log(aPay)
            combineDataEntries.push([
                moment(new Date(aPay?.paidDate)).format('DD/MM/YYYY HH:mm '),
                `${aPay.paymentType} Payment- Invoice Ref No. ${aPay?.confirmInvoiceOBJ?.invoiceNumberRef}`,
                '',
                `Rs. ${aPay.paidAmount.toFixed(2)}`
            ])
        })
    })

    combineDataEntries.push([
        '',
        '',
        `Rs. ${totalNetAmount.toFixed(2)}`,
        `Rs. ${totalPaidAmount.toFixed(2)}`,
    ])
    return combineDataEntries;
}
@Component({
    selector: 'app-report-template',
    templateUrl: './report-template.component.html',
    styleUrls: ['./report-template.component.css']
})
export class ReportTemplateComponent implements OnChanges {
    @Input('inputData') inputData!: any
    tableData!: IListOfData
    currentDate: any = new Date()

    constructor() {

    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['inputData']) {
            console.log("after detect change :", this.inputData)
            if (this.inputData?.result) {
                this.setDataIntoTable(this.inputData)
            } else if (this.inputData.error != null) {
                this.tableData = {
                    title: "",
                    tableHeader: [],
                    tableData: [],
                    error: this.inputData?.error.map((errMessage: any) => {
                        return errMessage
                    })
                }
            }
        }

    }

    setDataIntoTable(inputData?: any) {
        if (inputData.result && inputData?.reportType == "Stock Report") {
            this.tableData = {
                title: "stock",
                tableHeader: [
                    // 'stockId',
                    'ItemName',
                    'MaterialColour',
                    'ArrivalDate',
                    'PurhcasePrice',
                    'SellingPrice',
                    // 'reorder Qty',
                    'Quantity',
                    'Remarks',
                ],
                tableData: this.inputData?.result.map((res: any) => {
                    const arrivalDate = moment(new Date(res.arrivalDate)).toISOString();
                    const purchasePrice = "Rs " + (res.purchasePrice).toFixed(2)
                    const sellingPrice = "Rs " + (res.sellingPrice).toFixed(2)
                    return [
                        // res.stockId,
                        res.itemName,
                        res.materialColour,
                        arrivalDate.split("T")[0],
                        purchasePrice,
                        sellingPrice,
                        // res.reorderQty,
                        res.quantity,
                        "'" + res.remarks + "'",
                    ]
                }),
                error: null

            }
        }
        else if (inputData.result && inputData?.reportType == "Stock Price Range") {
            this.tableData = {
                title: "stock",
                tableHeader: [
                    // 'stockId',
                    'ItemName',
                    'MaterialColour',
                    'ArrivalDate',
                    'PurhcasePrice',
                    'SellingPrice',
                    // 'reorder Qty',
                    'Quantity',
                    'Remarks',
                ],
                tableData: this.inputData?.result.map((res: any) => {
                    const arrivalDate = moment(new Date(res.arrivalDate)).toISOString();
                    const purchasePrice = "Rs " + (res.purchasePrice).toFixed(2)
                    const sellingPrice = "Rs " + (res.sellingPrice).toFixed(2)
                    return [
                        // res.stockId,
                        res.itemName,
                        res.materialColour,
                        arrivalDate.split("T")[0],
                        purchasePrice,
                        sellingPrice,
                        // res.reorderQty,
                        res.quantity,
                        "'" + res.remarks + "'",
                    ]
                }),
                error: null

            }

        } else if (inputData.result && inputData?.reportType == "Invoice Reprint") {
            this.tableData = {
                title: "invoice",
                tableHeader: [

                ],
                tableData: this.inputData?.result.map((res: any) => {

                    const confirmInvoiceOBJ = res.confirmInvoiceOBJ
                    const stockOBJ = res.stockOBJ
                    const sellingPrice = "Rs " + (res.stockOBJ.sellingPrice).toFixed(2)
                    const totalAmount = "Rs " + (res.netAmount).toFixed(2)
                    return [
                        stockOBJ.itemName,
                        res.quantity,
                        sellingPrice,
                        (((res.discount) / stockOBJ.sellingPrice) * 100).toFixed(2) + "%",
                        totalAmount,
                    ]
                }),
                error: null
            }
        } else if (inputData.result && inputData?.reportType == "Sales Report") {
            this.tableData = {
                title: "sales",
                tableHeader: [
                    // "Id",
                    "Customer",
                    "Invoice Number",
                    "Confirmed Date",
                    "Total Amount",
                    "Total Paid Amount",
                    "Advance Payment",


                ],
                tableData: this.inputData?.result.map((res: any) => {

                    const customerOBJ = res.customerOBJ
                    const confirmedDate = moment(new Date(res.date)).toISOString();
                    const netAmount = "Rs " + (res.netAmount).toFixed(2)
                    const paidAmount = "Rs " + (res.paidAmount).toFixed(2)
                    const advancePay = "Rs " + (res.advanceAmount).toFixed(2)
                    return [
                        // res.confirmInvoiceId,
                        customerOBJ.custName,
                        res.invoiceNumberRef,
                        confirmedDate.split("T")[0],
                        netAmount,
                        paidAmount,
                        advancePay,

                    ]
                }), error: null

            }
        } else if (inputData.result && inputData?.reportType == "Purchase Report") {
            this.tableData = {
                title: "purchase",
                tableHeader: [
                    // "Id",
                    "Vendor",
                    "Purchase Invoice Number",
                    "Purchase Date",
                    "Total Amount",
                    "Total Paid Amount",


                ],
                tableData: this.inputData?.result.map((res: any) => {

                    const vendorOBJ = res.vendorOBJ
                    const purchaseDate = moment(new Date(res.purchaseDate)).toISOString();
                    const netAmount = "Rs " + (res.netAmount).toFixed(2)
                    const paidAmount = "Rs " + (res.paidAmount).toFixed(2)
                    //    const advancePay = "Rs " + (res.advanceAmount).toFixed(2)
                    return [
                        // res.confirmInvoiceId,
                        vendorOBJ.vendorName,
                        res.purchaseInvoice,
                        purchaseDate.split("T")[0],
                        netAmount,
                        paidAmount,


                    ]
                }), error: null

            }
        } else if (inputData.result && inputData?.reportType == "Purchase Payments") {
            this.tableData = {
                title: "purchase",
                tableHeader: [
                    // "paymentId",
                    "Purchase Invoice Number",
                    "Vendor",
                    "Time Stamp",
                    "Total Paid Amount",
                    "Payment Type",


                ],
                tableData: this.inputData?.result.map((res: any) => {

                    const vendorOBJ = res.vendorOBJ
                    const purchaseDate = moment(new Date(res.paidDate)).toISOString();
                    const datePart = moment.utc(res.paidDate).format("YYYY-MM-DD");
                    const timePart = moment.utc(res.paidDate).format("HH:mm:ss");
                    const paidAmount = "Rs " + (res.paidAmount).toFixed(2)
                    //    const advancePay = "Rs " + (res.advanceAmount).toFixed(2)
                    return [
                        // res.paymentId,
                        res.ConfirmPurchaseOBJ.purchaseInvoice,
                        vendorOBJ.vendorName,
                        `${datePart}|${timePart}`,
                        paidAmount,
                        res.paymentType


                    ]
                }), error: null

            }
        } else if (inputData.result && inputData?.reportType == "Sales Payments") {
            this.tableData = {
                title: "sales",
                tableHeader: [
                    // "paymentId",
                    "Sales Invoice Number",
                    "Customer",
                    "Time Stamp",
                    "Total Paid Amount",
                    "Payment Type",


                ],
                tableData: this.inputData?.result.map((res: any) => {

                    const customerOBJ = res.confirmInvoiceOBJ.customerOBJ
                    const paidDate = moment.utc(res.paidDate).format();
                    const datePart = moment.utc(res.paidDate).format("YYYY-MM-DD");
                    const timePart = moment.utc(res.paidDate).format("HH:mm:ss");
                    const paidAmount = "Rs " + (res.paidAmount).toFixed(2)
                    //    const advancePay = "Rs " + (res.advanceAmount).toFixed(2)
                    return [
                        // res.paymentId,
                        res.confirmInvoiceOBJ.invoiceNumberRef,
                        customerOBJ.custName,
                        `${datePart}|${timePart}`,
                        paidAmount,
                        res.paymentType


                    ]
                }), error: null

            }
        } else if (inputData.result && inputData?.reportType == "Custom Sales Payments") {
            this.tableData = {
                title: "sales payemnts",
                tableHeader: [
                    // "paymentId",
                    // "Sales Invoice Number",
                    // "Customer",
                    "Paid Date & Time",
                    "Paid Amount",
                    "Payment Type",


                ],
                tableData: this.inputData?.result.map((res: any) => {

                    const customerOBJ = res.confirmInvoiceOBJ.customerOBJ
                    const paidDate = moment.utc(res.paidDate).format();
                    const datePart = moment.utc(res.paidDate).format("YYYY-MM-DD");
                    const timePart = moment.utc(res.paidDate).format("HH:mm:ss");
                    const paidAmount = "Rs " + (res.paidAmount).toFixed(2)
                    return [

                        `${datePart}|${timePart}`,
                        paidAmount,
                        res.paymentType

                    ]
                }), error: null

            }
        } else if (inputData.result && inputData?.reportType == "Custom Purchase Payments") {
            this.tableData = {
                title: "purchase payemnts",
                tableHeader: [
                    // "paymentId",
                    // "Sales Invoice Number",
                    // "Customer",
                    "Paid Date & Time",
                    "Paid Amount",
                    "Payment Type",


                ],
                tableData: this.inputData?.result.map((res: any) => {

                    const vendorOBJ = res.ConfirmPurchaseOBJ.vendorOBJ
                    const paidDate = moment(new Date(res.paidDate)).toISOString();
                    const datePart = moment.utc(res.paidDate).format("YYYY-MM-DD");
                    const timePart = moment.utc(res.paidDate).format("HH:mm:ss");
                    const paidAmount = "Rs " + (res.paidAmount).toFixed(2)
                    return [

                        `${datePart}|${timePart}`,
                        paidAmount,
                        res.paymentType

                    ]
                }), error: null

            }
        } else if (inputData.result && inputData?.reportType == "Customer Report") {
            console.log("Report Type", inputData?.reportType)
            console.log("Report Results", inputData?.result)
            const formattedCustomerData = formatCustomerData(inputData.result);
            this.tableData = {
                title: "Customer Report",
                tableHeader: [
                    // "paymentId",
                    // "Purchase Invoice Number",
                    // "Customer",
                    "Paid Date & Time",
                    "Description",
                    "Purchase Amount",
                    "Paid Amount",


                ],
                tableData: formattedCustomerData
                , error: null

            }

        } else if (inputData.result && inputData?.reportType == "Vendor Report") {

            const formattedData = formatVendorData(inputData.result);
            this.tableData = {
                title: "Vendor Report",
                tableHeader: [
                    // "paymentId",
                    // "Purchase Invoice Number",
                    // "Customer",
                    "Paid Date & Time",
                    "Description",
                    "Purchase Amount",
                    "Paid Amount",
                ],
                tableData: formattedData
                , error: null

            }
            console.log("tabledata ", this.tableData)
        }

    }
    getTotalNetAmount(): number {
        if (!this.inputData?.result) return 0;
        return this.inputData.result.reduce((total: number, item: any) => total + item.netAmount, 0);
    }
    isItemName(rowData: string[], aRowData: string): boolean {
        return rowData.indexOf(aRowData) === 0;
    }
    getDateForInvoiceRePrint() {
        return (moment(new Date(this.inputData?.result?.[0].confirmInvoiceOBJ?.date)).format("DD/MM/YYYY HH:mm:ss ")).split(" ")[0];
    }
    getTime() {
        const date = moment(new Date(this.inputData?.result?.[0].confirmInvoiceOBJ?.date)).format("DD/MM/YYYY HH:mm:ss");
        return date.split(" ")[1]
    }
}
