import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { NgxPrintModule } from "ngx-print";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SideBarComponent } from "./Template/side-bar/side-bar.component";

// import {MatIconModule} from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { DashboardCardsComponent } from "./Template/dashboard-cards/dashboard-cards.component";
// Imports for Modules
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { ToastrModule } from "ngx-toastr";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

import { LoginCompoComponent } from "./Template/createData-forms/login-compo/login-compo.component";

// Routing Module
import { Routes, RouterModule } from "@angular/router";

import { UserDataComponent } from "./Template/modules/userData/userData.component";
import { UserDeatilsComponent } from "./Template/side-bar/user-deatils/user-deatils.component";
import { CustomerComponent } from "./Template/modules/customer/customer.component";
import { VendorComponent } from "./Template/modules/vendor/vendor.component";
import { EmployeeComponent } from "./Template/modules/employee/employee.component";
import { SalesComponent } from "./Template/modules/sales/sales.component";
import { StockComponent } from "./Template/modules/stock/stock.component";
import { PurchaseComponent } from "./Template/modules/purchase/purchase.component";
import { ReportComponent } from "./Template/modules/report/report.component";
import { SysInfoComponent } from "./Template/side-bar/nav-settings/sys-info/sys-info.component";
import { CompanyDetailsComponent } from "./Template/side-bar/nav-settings/company-details/company-details.component";
import { BackupComponent } from "./Template/side-bar/nav-settings/backup/backup.component";
import { PrintComponent } from "./Template/side-bar/nav-settings/print/print.component";

// Form Modules
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from "@angular/material/radio";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatButtonToggleModule, MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
// Table
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { FormsModule } from "@angular/forms";
import { UserRegistrationForm } from "./Template/createData-forms/registration-form/userRegistration-form.component";
import { AgGridModule } from "ag-grid-angular";
import { ActionCellComponent } from "./custom-components/action-cell/user-action/action-cell.component";
import { ActionPopComponent } from "./custom-components/action-cell/action-pop/action-pop.component";
import { CustomerFormComponent } from "./Template/createData-forms/customer-form/customer-form.component";
import { CustomerActionComponent } from "./custom-components/action-cell/customer-action/customer-action.component";
import { VendorActionComponent } from "./custom-components/action-cell/vendor-action/vendor-action.component";
import { VendorFormComponent } from "./Template/createData-forms/vendor-form/vendor-form.component";
import { StockFormComponent } from "./Template/createData-forms/stock-form/stock-form.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { StockActionComponent } from "./custom-components/action-cell/stock-action/stock-action.component";
import { CategoryComponent } from "./Template/modules/category/category.component";
import { InvoiceComponent } from "./Template/modules/invoice/invoice.component";
import { CategoryActionComponent } from "./custom-components/action-cell/category-action/category-action.component";
import { CategoryFormComponent } from "./Template/createData-forms/category-form/category-form.component";
import { InvoiceActionComponent } from "./custom-components/action-cell/invoice-action/invoice-action.component";
import { InvoiceFormComponent } from "./Template/createData-forms/invoice-form/invoice-form.component";
import { SelectedInvoiceComponent } from "./Template/expansion/selected-invoice/selected-invoice.component";
import { CommonModule, DatePipe } from "@angular/common";
import { InvoiceFinalizationComponent } from "./custom-components/invoice-finalization/invoice-finalization.component";
import { ProductSelectionToCartComponent } from "./Template/expansion/product-selection-to-cart/product-selection-to-cart.component";
import { ProductSelectionToCartFormComponent } from "./Template/expansion/product-selection-to-cart-form/product-selection-to-cart-form.component";
import { ProductCartActionComponent } from "./custom-components/action-cell/product-cart-action/product-cart-action.component";
import { InvoiceTemplateForCustomerComponent } from "./Template/expansion/invoice-template-for-customer/invoice-template-for-customer.component";
import { InvoicePaymentComponent } from "./Template/payments/invoice-payment/invoice-payment.component";
import { PurchasedProductFormComponent } from "./Template/createData-forms/purchased-product-form/purchased-product-form.component";
import { PurchaseInvoiceFormComponent } from "./Template/createData-forms/purchase-invoice-form/purchase-invoice-form.component";
import { PurchaseCartComponent } from "./Template/modules/purchase-cart/purchase-cart.component";
import { PurchaseCartActionComponent } from "./custom-components/action-cell/purchase-cart-action/purchase-cart-action.component";
import { CommonPaymentsComponent } from './Template/modules/common-payments/common-payments.component';
import { InvoicePrintComponent } from './Template/expansion/invoice-print/invoice-print.component';
import { ConfirmedPurchaseComponent } from './Template/modules/confirmed-purchase/confirmed-purchase.component';
import { ConfirmedSalesInvoiceComponent } from './Template/modules/confirmed-sales-invoice/confirmed-sales-invoice.component';
import { PaymentActionComponent } from './custom-components/action-cell/payment-action/payment-action.component';
import { InvoicePaymentsHistoryProcessComponent } from './Template/modules/invoice-payments-history-process/invoice-payments-history-process.component';
import { InvoicePaymentsHistoryTemplateComponent } from './Template/modules/invoice-payments-history-process/invoice-payments-history-template/invoice-payments-history-template.component';
import { ReceiptComponent } from './Template/payments/receipt/receipt.component';
import { ReceiptVoucherPrintComponent } from './Template/modules/receipt-voucher-print/receipt-voucher-print.component';
import { VoucherComponent } from './Template/payments/voucher/voucher.component';
import { AuthInterceptor } from "./service/intercepter/AuthInterceptor";
import { StockReportComponent } from './Template/modules/report/stock-report/stock-report.component';
import { EmptyReportComponent } from './Template/modules/report/empty-report/empty-report.component';
import { ReportTemplateComponent } from './Template/modules/report/report-template/report-template.component';
import { InvoiceReportComponent } from './Template/modules/report/invoice-report/invoice-report.component';
import { PurchaseReportComponent } from './Template/modules/report/purchase-report/purchase-report.component';
import { PaymentsReportComponent } from './Template/modules/report/payments-report/payments-report.component';
import { PrintActionComponent } from './custom-components/action-cell/print-action/print-action.component';
import { CustomerReportComponent } from './Template/modules/report/customer-report/customer-report.component';
import { VendorReportComponent } from './Template/modules/report/vendor-report/vendor-report.component';
import { NotificationComponent } from './Template/side-bar/nav-settings/notification/notification.component';
import { MatBadgeModule } from '@angular/material/badge';
import { NotifiExpansionComponent } from './Template/side-bar/nav-settings/notification/notifi-expansion/notifi-expansion.component';
import { EmailFormComponent } from './Template/createData-forms/email-form/email-form.component';
import { RoleGuard } from "./service/role-service/role.guard";
import { AdvancePayHistoryComponent } from './Template/expansion/selected-invoice/advance-pay-history/advance-pay-history.component';
import { AdvancePayActionComponent } from './custom-components/action-cell/advance-pay-action/advance-pay-action.component';

@NgModule({
    declarations: [
        AppComponent,
        SideBarComponent,
        DashboardCardsComponent,
        UserDeatilsComponent, //(side bar property)
        LoginCompoComponent,
        CustomerComponent,
        VendorComponent,
        EmployeeComponent,
        SalesComponent,
        StockComponent,
        PurchaseComponent,
        ReportComponent,
        SysInfoComponent,
        CompanyDetailsComponent,
        BackupComponent,
        PrintComponent,
        UserDataComponent,
        UserRegistrationForm,
        ActionCellComponent,
        ActionPopComponent,
        CustomerFormComponent,
        CustomerActionComponent,
        VendorActionComponent,
        VendorFormComponent,
        StockFormComponent,
        StockActionComponent,
        CategoryComponent,
        InvoiceComponent,
        CategoryActionComponent,
        CategoryFormComponent,
        InvoiceActionComponent,
        InvoiceFormComponent,
        SelectedInvoiceComponent,
        InvoiceFinalizationComponent,
        ProductSelectionToCartComponent,
        ProductSelectionToCartFormComponent,
        ProductCartActionComponent,
        InvoiceTemplateForCustomerComponent,
        InvoicePaymentComponent,
        PurchasedProductFormComponent,
        PurchaseInvoiceFormComponent,
        PurchaseCartComponent,
        PurchaseCartActionComponent,
        CommonPaymentsComponent,
        InvoicePrintComponent,
        ConfirmedPurchaseComponent,
        ConfirmedSalesInvoiceComponent,
        PaymentActionComponent,
        InvoicePaymentsHistoryProcessComponent,
        InvoicePaymentsHistoryTemplateComponent,
        ReceiptComponent,
        ReceiptVoucherPrintComponent,
        VoucherComponent,
        StockReportComponent,
        EmptyReportComponent,
        ReportTemplateComponent,
        InvoiceReportComponent,
        PurchaseReportComponent,
        PaymentsReportComponent,
        PrintActionComponent,
        CustomerReportComponent,
        VendorReportComponent,
        NotificationComponent,
        NotifiExpansionComponent,
        EmailFormComponent,
        AdvancePayHistoryComponent,
        AdvancePayActionComponent,



    ],
    imports: [
        BrowserModule,
        // CommonModule,
        AppRoutingModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatBadgeModule,
        // Dash_Board-Purpose
        MatButtonModule,
        MatCardModule,
        MatIconModule,

        // Form
        MatFormFieldModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSelectModule,
        MatRadioModule,
        MatDialogModule,
        MatButtonToggleModule,
        MatSelectModule,


        //  Table
        MatTableModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        AgGridModule,
        ToastrModule.forRoot(),
        RouterModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        MatSlideToggleModule,
        NgxPrintModule,

    ],
    //providers: [],
    providers: [DatePipe, { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
