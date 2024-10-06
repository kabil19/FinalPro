import { IInvoiceEntity } from "./IInvoiceEntity"

export interface ITempSalesDueChequeEntity{
    chequeRefNo:number,
    paidAmount:number,
    paidDate:string,
    chequeDueDate:string,
    paymentId:number,
    tempInvoiceOBJ:IInvoiceEntity
}