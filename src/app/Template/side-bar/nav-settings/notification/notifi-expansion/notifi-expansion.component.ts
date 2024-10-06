import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
import { INotificationEntity } from 'src/app/constants/interfaces/INotificationEntity';
import { IPurchasePayChequeEntity } from 'src/app/constants/interfaces/IPurchasePayChequeEntity';
import { ISalesPayChequeEntity } from 'src/app/constants/interfaces/ISalesPayChequeEntity';
import { IStockEntity } from 'src/app/constants/interfaces/IStockEntity';

@Component({
    selector: 'app-notifi-expansion',
    templateUrl: './notifi-expansion.component.html',
    styleUrls: ['./notifi-expansion.component.css']
})
export class NotifiExpansionComponent {
    salesChequeDuesTransformedData: any[] = [];
    purchaseChequeDuesTransformedData: IPurchasePayChequeEntity[] = [];
    productLowerThanReorderTransformedData:IStockEntity[]=[]
    constructor(@Inject(MAT_DIALOG_DATA) public data: INotificationEntity) {
        this.calculateDaysLeft(this.data);
       console.log(this.data.productsLowerThanReorderLevel)
  
    }
    calculateDaysLeft(data: INotificationEntity) {
        this.productLowerThanReorderTransformedData = data?.productsLowerThanReorderLevel?.map((item:IStockEntity)=>{
            return{
                ...item,
                // qtyFormatted: item.qty,
                // arrivalDate:moment(item.arrivalDate).format('YYYY MMMM DD (dddd)'),
            }
        });

        this.salesChequeDuesTransformedData = data?.salesChequeDues?.map((item: ISalesPayChequeEntity) => {
            return {
                ...item,
                chequeDueDateFormatted: moment(item.chequeDueDate).format('YYYY MMMM DD (dddd)'),
                // daysLeft: moment(item.chequeDueDate).diff(moment(), 'days')
            };
        });
        
        this.purchaseChequeDuesTransformedData = data?.purchaseChequeDues?.map((item: IPurchasePayChequeEntity) => {
            return {
                ...item,
                chequeDueDateFormatted: moment(item.chequeDueDate).format('YYYY MMMM DD (dddd)'),
                // daysLeft: moment(item.chequeDueDate).diff(moment().format("YYYY-MM-DDTHH:mm"), 'days')
            }
        })
    }
}



