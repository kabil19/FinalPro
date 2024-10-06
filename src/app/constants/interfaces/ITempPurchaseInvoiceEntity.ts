import { IVendorEntity } from "./IVendorEntity";

export interface ITempPurchaseInvoice {
    purchaseId: number,
    purchaseInvoiceNO: any,
    purchasedDate: string,
    netAmount: number,
    vendorOBJ: IVendorEntity,
    isComplete: boolean
}