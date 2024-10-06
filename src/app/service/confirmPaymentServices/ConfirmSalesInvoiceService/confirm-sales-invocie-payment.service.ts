import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AudioService } from '../../audio-service/audio-service.service';
import { IConfirmInvoiceEntity } from 'src/app/constants/interfaces/IConfirmInvoiceEntity';
import { Observable } from 'rxjs';
import { IConfirmInvoicePaymentEntity } from 'src/app/constants/interfaces/IConfirmInvoicePaymentEntity';
import { IConfirmSalesConfirmPayments } from 'src/app/constants/interfaces/IConfirmSalesConfirmPayments';

@Injectable({
  providedIn: 'root'
})
export class ConfirmSalesInvociePaymentService {
    private baseUrl = 'http://localhost:8080/api/ConfirmSalesInvoicePayments';
    
    constructor(private http:HttpClient, public audService :AudioService,) { }



      makePaymentToConfirmInvoice(salesInvoicePaymentsData: any): Observable<any> {
        // this.audService.playSoundInsert()
        const url = `${this.baseUrl}/makePaymentToConfirmInvoice`;
        return this.http.post<any>(url, salesInvoicePaymentsData, { responseType: "json" });
    }

      getAllConfirmPaymentsOfConfirmInvoice(confirmSalesInvoiceId: number): Observable<any> {
        console.log("confirmSalesInvoiceId", confirmSalesInvoiceId)
        const url = `${this.baseUrl}/getAllConfirmPaymentsOfConfirmInvoice/${confirmSalesInvoiceId}`;
        return this.http.get<any[]>(url, { responseType: "json" });
    }

    getAllReceiptsOfTheSelectedRefNo(invoiceId:number){
        const url = `http://localhost:8080/api/receipt/getAllReceipts/${invoiceId}`;
        return this.http.get<any>(url, { responseType: "json" });
    }

}
