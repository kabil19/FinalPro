import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class TempPurchaseCartService {
    private baseUrl = "http://localhost:8080/api/tempPurchaseCart";
    constructor(private http: HttpClient) {}

    createPurchaseInvoice(purchaseCartData: any): Observable<any> {
        // this.audService.playSoundInsert()
        const url = `${this.baseUrl}/addToTempPurchaseCart`;
        return this.http.post<any>(url, purchaseCartData, {
            responseType: "json",
        });
    }

    getAllTempPurchaseCartItems(purchaseId: any): Observable<any> {
        const url = `${this.baseUrl}/getAllTempPurchaseCartItems/${purchaseId}`;
        return this.http.get<any[]>(url, { responseType: "json" });
    }

    deleteTempPurchaseCartRecord(proCartId: any) {
        // this.audService.playSoundDelete()
        const url = `${this.baseUrl}/deleteTempPurchaseCartRecord/${proCartId}`;
        return this.http.delete<any>(url, { responseType: "json" });
    }

    updateTempPurchaseCartRecord(updateRequestData: any): Observable<any> {
        // this.audService.playSoundUpdate()
        const url = `${this.baseUrl}/updateTempPurchaseCartRecord`;
        return this.http.put<any>(url, updateRequestData, {
            responseType: "json",
        });
    }

    selectTempPurchaseCartRecords(purchaseId: number, dataChar: any) {
        const url = `${this.baseUrl}/selectTempPurchaseCartRecords/${purchaseId}/${dataChar}`;
        return this.http.get<any>(url, { responseType: "json" });
    }
}
