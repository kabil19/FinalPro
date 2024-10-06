import { IConfirmInvoiceEntity } from "./IConfirmInvoiceEntity";

export interface IReceiptEntity{
    receiptId:number,
    confirmInvoiceOBJ:IConfirmInvoiceEntity,
    paidAmount:number,
    paidDate:string,
    paymentType:string
}