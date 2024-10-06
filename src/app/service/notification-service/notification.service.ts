import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SalesInvocieChequeService } from '../salesInvoiceCheque-service/sales-invocie-cheque.service';
import { HttpHeaders } from '@angular/common/http';
import { PurchaseInvoiceChequeService } from '../purchaseInvoiceCheque-service/purchase-invoice-cheque.service';
import { FetchNotificationApiService } from '../allNotificationApiRequestService/fetch-notification-api.service';
import { INotificationEntity } from 'src/app/constants/interfaces/INotificationEntity';
import { AudioService } from '../audio-service/audio-service.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

    private dueDateDataSubject = new BehaviorSubject<INotificationEntity| null>(null);

    dueDateDataSubject$: Observable<INotificationEntity|null> = this.dueDateDataSubject.asObservable();
  
    constructor(private notifiApiCallService:FetchNotificationApiService) {
                     }
  
    fetchnotificationData() {
        const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    
        this.notifiApiCallService.fetchAllNotifications(headers).subscribe(res=>{
            if (res?.result) {
                this.dueDateDataSubject.next(res.result as INotificationEntity);         
              }
            }, error => {
              console.error('Error fetching notification data', error);
        })

    }
    
      clearData() {
        this.dueDateDataSubject.next(null);
      }
}
