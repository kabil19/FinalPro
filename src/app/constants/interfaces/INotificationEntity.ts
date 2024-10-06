import { IPurchasePayChequeEntity } from "./IPurchasePayChequeEntity";
import { ISalesPayChequeEntity } from "./ISalesPayChequeEntity";
import { IStockEntity } from "./IStockEntity";

export interface INotificationEntity{
    salesChequeDues : ISalesPayChequeEntity[],
    purchaseChequeDues : IPurchasePayChequeEntity[],
    productsLowerThanReorderLevel: IStockEntity[],
}