import { IConfirmPurchaseEntity } from "./IConfirmPurchaseEntity"
import { IVendorEntity } from "./IVendorEntity"

export interface IPurchasePaymentEntity{
    paymentId:number,
    paymentType: string,
    paidDate: string
    paidAmount:number,
    ConfirmPurchaseOBJ:IConfirmPurchaseEntity,
    vendorOBJ:IVendorEntity,
    chequeRefNo:number,
    chequeDueDate:string,
    cardRefNo:number
}