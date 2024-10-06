import { IStockEntity } from "./IStockEntity";
import { ITempPurchaseInvoice } from "./ITempPurchaseInvoiceEntity";

export interface ITempPurchaseCartEntity{
    productCartId:number,
    quantity:number,
    discount:number,
    grossAmount:number,
    netAmount:number,
    stockOBJ:IStockEntity,
    tempPurchaseOBJ:ITempPurchaseInvoice,
    sellingPrice:number,
    purchasePrice:number
} 