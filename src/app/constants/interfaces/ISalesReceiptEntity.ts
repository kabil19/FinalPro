import { IConfirmInvoiceEntity } from "./IConfirmInvoiceEntity";

export interface ISalesReceiptEntity{
    receiptId:number,
    confirmInvoiceOBJ:IConfirmInvoiceEntity,
    paidAmount:number,
    paidDate:string,
    paymentType:string
}