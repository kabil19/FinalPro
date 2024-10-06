import { ICustomerEntity } from "./interfaces/CustomerEntity";
import { ICategoryEntity } from "./interfaces/ICategoryEntity";
import { IPaymentEntity } from "./interfaces/IPaymentEntity";
import { IStockEntity } from "./interfaces/IStockEntity";
import { ITempPurchaseInvoice } from "./interfaces/ITempPurchaseInvoiceEntity";
import { IVendorEntity } from "./interfaces/IVendorEntity";
import { IInvoiceEntity } from "./interfaces/IInvoiceEntity";
import { ITempPurchaseCartEntity } from "./interfaces/ITempPurchaseCartEntity";
import { IPurchasePaymentEntity } from "./interfaces/IPurchasePaymentEntity";
import { IConfirmPurchaseEntity } from "./interfaces/IConfirmPurchaseEntity";
import { IProCartEntity } from "./interfaces/IProCartEntity";
import { IConfirmInvoiceEntity } from "./interfaces/IConfirmInvoiceEntity";
import { IConfirmSalesDueChequeEntity } from "./interfaces/IConfirmSalesDueChequeEntity";
import { ITempSalesDueChequeEntity } from "./interfaces/ITempSalesDueChequeEntity";
export const GLOBAL_LIST={
    CUSTOMER_DATA:[] as ICustomerEntity[],
    INVOICE_DATA:[] as IInvoiceEntity[],
    CATEGORY_DATA:[] as ICategoryEntity[],
    STOCK_DATA:[] as IStockEntity[],
    PRODUCTCART_DATA:[] as IProCartEntity[] ,
    PAYMENTS_DATA:[] as IPaymentEntity[],
    VENDOR_DATA:[] as IVendorEntity[],
    TEMPPURCHASE_DATA:[] as ITempPurchaseInvoice[],
    TEMP_PURCHASE_CART_DATA:[] as ITempPurchaseCartEntity[],
    PURCHASE_PAYMENTS_DATA:[] as IPurchasePaymentEntity[],
    CONFIRM_PURCHASE_DATA:[] as IConfirmPurchaseEntity[],
    CONFIRM_SALES_DATA:[] as IConfirmInvoiceEntity[],
    TEMP_SALES_INVOICE_CHEQUE_DUE:[] as unknown  as ITempSalesDueChequeEntity,
    CONFIRM_SALES_INVOICE_CHEQUE_DUE:[] as unknown  as IConfirmSalesDueChequeEntity,

}