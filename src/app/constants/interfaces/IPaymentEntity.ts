import { IInvoiceEntity } from "./IInvoiceEntity"

export interface IPaymentEntity{
    paymentId:number,
    paymentType: string,
    paidDate: string
    paidAmount:number,
    salesInvoice:IInvoiceEntity,
    chequeRefNo:number,
    chequeDueDate:string,
    cardRefNo:number
   
}