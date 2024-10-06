
import { IConfirmInvoiceEntity } from './IConfirmInvoiceEntity';

export interface ISalesPayChequeEntity{
    chequeRefNo:number,
    paidAmount:number,
    paidDate:string,
    chequeDueDate:string,
    paymentId:number,
    confirmInvoiceOBJ:IConfirmInvoiceEntity;
}