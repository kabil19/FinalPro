import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestoreService {
    private baseUrlRestore = 'http://localhost:8080/api/restore';

    constructor(private http: HttpClient) { }
  
    restoreDatabase(file: any): Observable<any> {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
  
     
      return this.http.post<any>(this.baseUrlRestore, formData,
       {responseType: 'text' as 'json' }
      );
    }


    private baseUrlBackUp = 'http://localhost:8080/api/backup';

    triggerBackup(): Observable<string> {
        return this.http.post<string>(this.baseUrlBackUp, {}, { responseType: 'text' as 'json' });
      }

}
