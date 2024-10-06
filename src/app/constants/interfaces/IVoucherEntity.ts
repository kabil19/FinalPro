import { IConfirmPurchaseEntity } from "./IConfirmPurchaseEntity";

export interface IVoucherEntity{
    voucherId:number,
    confirmPurchaseOBJ:IConfirmPurchaseEntity,
    paidAmount:number,
    paidDate:string,
    paymentType:string
}