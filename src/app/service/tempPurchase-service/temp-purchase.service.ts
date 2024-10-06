import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class TempPurchaseService {
    private baseUrl = "http://localhost:8080/api/tempPurchase";

    constructor(private http: HttpClient) {}

    createPurchaseInvoice(purchaseData: any): Observable<any> {
        // this.audService.playSoundInsert()
        const url = `${this.baseUrl}/createTempPurchase`;
        return this.http.post<any>(url, purchaseData, { responseType: "json" });
    }

    getAllTempPurchase(): Observable<any> {
        const url = `${this.baseUrl}/getAllTempPurchase`;
        return this.http.get<any[]>(url, { responseType: "json" });
    }

    
}
