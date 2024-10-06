import { IConfirmPurchaseEntity } from "./IConfirmPurchaseEntity";

export interface IPurchaseVoucherEntity{
    voucherId:number,
    confirmPurchaseOBJ:IConfirmPurchaseEntity,
    paidAmount:number,
    paidDate:string,
    paymentType:string
}