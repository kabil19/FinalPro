import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchNotificationApiService {
    private baseUrl = 'http://localhost:8080/api/notifications'
    constructor(private http:HttpClient) { }

    fetchAllNotifications(headers: HttpHeaders): Observable<any> {
        const url = `${this.baseUrl}/fetchAllNotifications`;
        return this.http.get<any[]>(url, { headers, responseType: 'json' as 'json' });
    }


}
