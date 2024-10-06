import { ICustomerEntity } from "./CustomerEntity";

export interface IInvoiceEntity{
    tempInvoiceId: number,
    date:string,
    netAmount:number,
    customerData:ICustomerEntity,
    paidAmount:number,
    isComplete:boolean,
    tempInvoiceNumberRef:string

}