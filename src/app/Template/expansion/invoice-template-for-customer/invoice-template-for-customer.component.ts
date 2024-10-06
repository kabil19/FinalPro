import { Component, Inject,  OnInit } from "@angular/core";
import {
    MAT_DIALOG_DATA,

} from "@angular/material/dialog";

import { GLOBAL_LIST } from "src/app/constants/GlobalLists";

import { IProCartEntity } from "../../../constants/interfaces/IProCartEntity";

import { IInvoiceEntity } from "../../../constants/interfaces/IInvoiceEntity";
import { PaymentsService } from "src/app/service/payments-service/payments.service";
import { IPaymentEntity } from "../../../constants/interfaces/IPaymentEntity";

import { ToastrService } from "ngx-toastr";
import moment from "moment";

@Component({
    selector: "app-invoice-template-for-customer",
    templateUrl: "./invoice-template-for-customer.component.html",
    styleUrls: ["./invoice-template-for-customer.component.css"],
})
export class InvoiceTemplateForCustomerComponent implements OnInit {
    selectedCustomer!: any;
    productCartItems: IProCartEntity[] = [];
    paymentsList: IPaymentEntity[] = [];
    total: any;
    paidAmount!: number;
 
    today: any;
    invoiceData!: IInvoiceEntity[];
    invoiceId!: number;
    invoiceNumber!: number;
    isComplete!: boolean;
    totalDiscount: number = 0;
    constructor(
      
        @Inject(MAT_DIALOG_DATA) public data: any,
        private paymentService: PaymentsService,
    
        private toastr: ToastrService,
       
    ) {
        this.paymentsList = GLOBAL_LIST.PAYMENTS_DATA 
    
        this.getinvoiceDetails();
        this.today = this.getInvoiceDate();
        this.productCartItems = GLOBAL_LIST.PRODUCTCART_DATA;
        this.calcValues(this.productCartItems);
        this.getACustomerData();
    
       
        
    }
    ngOnInit(): void {
        this.calculatePaidAmount();
        
    }

    
    

    getAllPayments() {
     
        this.paymentService.getAllPayments(this.data.invoiceDataParam.tempInvoiceId).subscribe((res) => {
            // GLOBAL_LIST.PAYMENTS_DATA = res.result;
            this.paymentsList = res.result;
            //#cmt calculatePaidAmount has been called once the paymentList is initialized, tried calling it after the
            // 'getAllPayemnt()' in the makePayment(), the call timing is missing
            // this.calculatePaidAmount();
        });
    }

    calculatePaidAmount() {
      
        if (this.paymentsList?.length > 0) {
            this.paidAmount = this.paymentsList.reduce(
                (accumulator, currValue) => accumulator + currValue.paidAmount,
                0
            );
        }
    }
    

    getACustomerData() {
        this.selectedCustomer = this.data.invoiceDataParam.customerOBJ;
    }

    getinvoiceDetails() {

        this.invoiceData = this.data.invoiceDataParam;
        this.invoiceNumber = this.data.invoiceDataParam.tempInvoiceNumberRef;
        this.invoiceId = this.data.invoiceDataParam.tempInvoiceId;
    }

    calcValues(list: IProCartEntity[]) {
        this.total = list.reduce(
            (subTotal, item) => subTotal + item.netAmount,0);
            this.totalDiscount = list.reduce((discountTotal, item) => discountTotal + item.discount, 0); // Calculate total discount
    }

    getInvoiceDate() {
        return (moment(new Date()).format("DD/MM/YYYY HH:mm:ss")).split(" ")[0];
    }

    getInvoiceTime(){
        return (moment(new Date()).format("DD/MM/YYYY HH:mm:ss")).split(" ")[1];
         
    }

  
  
}
