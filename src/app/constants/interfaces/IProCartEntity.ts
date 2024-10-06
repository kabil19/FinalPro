import { IStockEntity } from "./IStockEntity";
import { IInvoiceEntity } from "./IInvoiceEntity";

export interface IProCartEntity{
    proCartId:number,
    stockOBJ:IStockEntity,
    quantity: number,
    discount:number,
    total:number,
    netAmount:number,
    tempInvoiceOBJ:IInvoiceEntity,
}