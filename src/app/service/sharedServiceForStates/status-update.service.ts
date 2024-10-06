import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IConfirmInvoiceEntity } from 'src/app/constants/interfaces/IConfirmInvoiceEntity';
import { IProCartEntity } from 'src/app/constants/interfaces/IProCartEntity';
import { ITempPurchaseCartEntity } from 'src/app/constants/interfaces/ITempPurchaseCartEntity';
import { AudioService } from '../audio-service/audio-service.service';

@Injectable({
  providedIn: 'root'
})
export class StatusUpdateService {
    
    /* 
    Purchase Invoice Cart Related Services and functions
    */
    private purchaseCartSubject = new BehaviorSubject<ITempPurchaseCartEntity[]>([]);
    purchaseCart$ = this.purchaseCartSubject.asObservable();

    private purchaseCartNetAmountSubject = new BehaviorSubject<number>(0);
    purchaseCartNetAmount$ = this.purchaseCartNetAmountSubject.asObservable();
  
    updatePurchaseInvoiceCart(purchaseCart: ITempPurchaseCartEntity[]) {
      this.purchaseCartSubject.next(purchaseCart);
    }

    updatePurchaseNetAmount(purchaseCart: ITempPurchaseCartEntity[]) {
        const totalNetAmount = purchaseCart.reduce((sum, item) => sum + item.netAmount, 0);
        this.purchaseCartNetAmountSubject.next(totalNetAmount);
      }

      /* 
    Sales Invoice Cart Related Services and functions
    */
    private tempSalesCartSubject = new BehaviorSubject<IProCartEntity[]>([]);
    tempSalesCart$ = this.tempSalesCartSubject.asObservable();

    private tempSalesCartNetAmountSubject = new BehaviorSubject<number>(0);
    tempSalesCartNetAmount$ = this.tempSalesCartNetAmountSubject.asObservable();

  
    updateTempSalesInvoiceCart(tempSalesCart: IProCartEntity[]) {
      this.tempSalesCartSubject.next(tempSalesCart);
    }

    updateTempSalesNetAmount(tempSalesCart: IProCartEntity[]) {
        const totalNetAmount = tempSalesCart.reduce((sum, item) => sum + item.netAmount, 0);
        this.tempSalesCartNetAmountSubject.next(totalNetAmount);
      }
   
}
