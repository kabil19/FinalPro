import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { ConfirmInvoiceService } from 'src/app/service/confirmInvoice-service/confirm-invoice.service';
import { ConfirmPurchaseAndCartServiceService } from 'src/app/service/confirmPurchase-service/confirm-purchase-and-cart-service.service';
import { CustomerService } from 'src/app/service/customer-service/customer.service';
import { VendorService } from 'src/app/service/vendor-service/vendor.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css','../../../../assets/CSS/ComponentCommDesign.css']
})
export class ReportComponent {
    selectedCard: any;
    reportName! :string 
    reportView: boolean = true
    constructor(private router:Router,
        private confirmedInvoiceService: ConfirmInvoiceService,
        private confirmedPurchaseInvoiceService: ConfirmPurchaseAndCartServiceService,
        private customerService: CustomerService,
        private vendorService:VendorService

     ){
        /* this.getAllConfirmInvoice()
        this.getAllConfirmPurchaseInvoice()
        this.getAllCustomers()
        this.getAllVendors() */
    }
    
    goBack(){
        this.reportView = true
    }
  
    Cards = [
        {
            name: "Stock Report",
            route: "/dash_board/report/stock_report",
        },
        {
            name: "Invoice Report",
            route: "/dash_board/report/invoice_report",

        },
        {
            name: "Purchase Report",
            route: "/dash_board/report/purchase_report",

       
        },
        {
            name: "Payments Report",
            route: "/dash_board/report/payments_report",

      
        },
        {
            name: "Vendor Report",
            route: "/dash_board/report/vendor_report",
       
        },
        {
            name: "Customer Report",
            route: "/dash_board/report/customer_report",
      
        }
    ];

    setValue(name:string){
        this.reportName = name
        this.reportView = false
    }

  /*   getAllConfirmInvoice() {
        this.confirmedInvoiceService.getAllConfirmedInvoices().subscribe((invoiceData) => {
          GLOBAL_LIST.CONFIRM_SALES_DATA = invoiceData?.result
        })
    }

    getAllConfirmPurchaseInvoice(){
            this.confirmedPurchaseInvoiceService.getAllConfirmPurchaseInvoices().subscribe((purchaseData)=>{
                GLOBAL_LIST.CONFIRM_PURCHASE_DATA = purchaseData?.result
            })
    }

    getAllCustomers(){
        this.customerService.getAll().subscribe((customerData)=>{
            GLOBAL_LIST.CUSTOMER_DATA = customerData
        })
    
    }
    getAllVendors(){
        this.vendorService.getAll().subscribe((vendorData)=>{
            GLOBAL_LIST.VENDOR_DATA = vendorData
        })
    
    } */


}
