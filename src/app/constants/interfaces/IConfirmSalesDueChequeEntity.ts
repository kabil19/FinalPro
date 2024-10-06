import { IConfirmInvoiceEntity } from "./IConfirmInvoiceEntity";

export interface IConfirmSalesDueChequeEntity{
    chequeRefNo:number,
    paidAmount:number,
    paidDate:string,
    chequeDueDate:string,
    paymentId:number,
    confirmInvoiceOBJ:IConfirmInvoiceEntity
}