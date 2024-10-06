import { ICustomerEntity } from "./CustomerEntity"

export interface IConfirmInvoiceEntity{
    confirmInvoiceId:number,
    netAmount: number,
    date: string
    paidAmount:number,
    customerOBJ:ICustomerEntity,
    isComplete:boolean,
    advanceAmount:number,
    invoiceNumberRef:string
}