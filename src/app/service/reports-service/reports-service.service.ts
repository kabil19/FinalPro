import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsServiceService {
  private baseUrl = 'http://localhost:8080/api/reports'
  constructor(private http: HttpClient) { }

  getStockInPriceRange(startPrice: any, endPrice: any) {
    const url = `${this.baseUrl}/getStockInPriceRange`;
    let params = new HttpParams()
      .set('startPrice', startPrice)
      .set('endPrice', endPrice);
    console.log('startPrice', startPrice)
    console.log('end', endPrice)
    return this.http.get<any>(url, { params: params, responseType: 'json' });
  }

  selectSalesReportWithInRange(startDate: any, endDate: any) {
    const formattedStartDate = moment(startDate).format('YYYY-MM-DDTHH:mm:ss');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DDTHH:mm:ss');
    const url = `${this.baseUrl}/selectSalesReportWithInRange`;
    let params = new HttpParams()
      .set('startDate', formattedStartDate)
      .set('endDate', formattedEndDate);

    return this.http.get<any>(url, { params: params, responseType: 'json' });

  }

  selectPurchaseReportWithInRange(startDate: any, endDate: any) {
    const formattedStartDate = moment(startDate).format('YYYY-MM-DDTHH:mm:ss');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DDTHH:mm:ss');
    const url = `${this.baseUrl}/selectPurchaseReportWithInRange`;
    let params = new HttpParams()
      .set('startDate', formattedStartDate)
      .set('endDate', formattedEndDate);

    return this.http.get<any>(url, { params: params, responseType: 'json' });

  }
  selectAllPurchaseInvoicePaymentsWithInRange(startDate: any, endDate: any) {
    const formattedStartDate = moment(startDate).format('YYYY-MM-DDTHH:mm:ss');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DDTHH:mm:ss');

    const url = `${this.baseUrl}/selectAllPurchaseInvoicePaymentsWithInRange`;
    let params = new HttpParams()
      .set('startDate', formattedStartDate)
      .set('endDate', formattedEndDate);

    return this.http.get<any>(url, { params: params, responseType: 'json' });

  }
  selectAllSalesInvoicePaymentsWithInRange(startDate: any, endDate: any) {
    const formattedStartDate = moment(startDate).format('YYYY-MM-DDTHH:mm:ss');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DDTHH:mm:ss');


    const url = `${this.baseUrl}/selectAllSalesInvoicePaymentsWithInRange`;
    let params = new HttpParams()
      .set('startDate', formattedStartDate)
      .set('endDate', formattedEndDate);

    return this.http.get<any>(url, { params: params, responseType: 'json' });

  }
  selectAllPaymentsOfTheSalesInvoiceWithInTheRange(invoiceId: number, startDate: any, endDate: any) {
    const formattedStartDate = moment(startDate).format('YYYY-MM-DDTHH:mm:ss');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DDTHH:mm:ss');

    const url = `${this.baseUrl}/selectAllPaymentsOfTheSalesInvoiceWithInTheRange/${invoiceId}`;
    let params = new HttpParams()
      .set('startDate', formattedStartDate)
      .set('endDate', formattedEndDate);

    return this.http.get<any>(url, { params: params, responseType: 'json' });

  }
  selectAllPaymentsOfThePurchaseInvoiceWithInTheRange(purchaseInvoiceId: number, startDate: any, endDate: any) {
    const formattedStartDate = moment(startDate).format('YYYY-MM-DDTHH:mm:ss');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DDTHH:mm:ss');

    const url = `${this.baseUrl}/selectAllPaymentsOfThePurchaseInvoiceWithInTheRange/${purchaseInvoiceId}`;
    let params = new HttpParams()
      .set('startDate', formattedStartDate)
      .set('endDate', formattedEndDate);

    return this.http.get<any>(url, { params: params, responseType: 'json' });

  }
  selectAllPaymentsOfaCustomerWithInRange(customerId: number, startDate: any, endDate: any) {
    const formattedStartDate = moment(startDate).format('YYYY-MM-DDTHH:mm:ss');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DDTHH:mm:ss');

    const url = `${this.baseUrl}/selectAllPaymentsOfaCustomerWithInRange/${customerId}`;
    let params = new HttpParams()
      .set('startDate', formattedStartDate)
      .set('endDate', formattedEndDate);

    return this.http.get<any>(url, { params: params, responseType: 'json' });

  }
  selectAllPaymentsOfaVendorWithInRange(vendorId: number, startDate: any, endDate: any) {
    const formattedStartDate = moment(startDate).format('YYYY-MM-DDTHH:mm:ss');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DDTHH:mm:ss');

    const url = `${this.baseUrl}/selectAllPaymentsOfaVendorWithInRange/${vendorId}`;
    let params = new HttpParams()
      .set('startDate', formattedStartDate)
      .set('endDate', formattedEndDate);

    return this.http.get<any>(url, { params: params, responseType: 'json' });

  }


}
