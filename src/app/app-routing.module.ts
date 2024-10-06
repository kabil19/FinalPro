import { Component, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';


// Components of the modules in the dashBoard
import { DashboardCardsComponent } from './Template/dashboard-cards/dashboard-cards.component';
import { LoginCompoComponent } from './Template/createData-forms/login-compo/login-compo.component'; 
import { CustomerComponent } from './Template/modules/customer/customer.component';
import { EmployeeComponent } from './Template/modules/employee/employee.component';
import { PurchaseComponent } from './Template/modules/purchase/purchase.component';
import { ReportComponent } from './Template/modules/report/report.component';
import { SalesComponent } from './Template/modules/sales/sales.component';
import { StockComponent } from './Template/modules/stock/stock.component';
import { UserDataComponent } from './Template/modules/userData/userData.component';
import { VendorComponent } from './Template/modules/vendor/vendor.component';
import { BackupComponent } from './Template/side-bar/nav-settings/backup/backup.component';
import { CompanyDetailsComponent } from './Template/side-bar/nav-settings/company-details/company-details.component';
import { PrintComponent } from './Template/side-bar/nav-settings/print/print.component';
import { SysInfoComponent } from './Template/side-bar/nav-settings/sys-info/sys-info.component';
import { CategoryComponent } from './Template/modules/category/category.component';
import { InvoiceComponent } from './Template/modules/invoice/invoice.component';
import { SelectedInvoiceComponent } from './Template/expansion/selected-invoice/selected-invoice.component';
import { PurchaseCartComponent } from './Template/modules/purchase-cart/purchase-cart.component';
import { CommonPaymentsComponent } from './Template/modules/common-payments/common-payments.component';
import { AuthGuard } from './service/auth/auth.guard';
import { StockReportComponent } from './Template/modules/report/stock-report/stock-report.component';
import { InvoiceReportComponent } from './Template/modules/report/invoice-report/invoice-report.component';
import { PurchaseReportComponent } from './Template/modules/report/purchase-report/purchase-report.component';
import { PaymentsReportComponent } from './Template/modules/report/payments-report/payments-report.component';
import { VendorReportComponent } from './Template/modules/report/vendor-report/vendor-report.component';
import { CustomerReportComponent } from './Template/modules/report/customer-report/customer-report.component';
import { AuthService } from './service/auth/auth.service';
import { CurrentLoggedInUserService } from './service/current-logged-user-service/current-logged-in-user.service';
import { RoleGuard } from './service/role-service/role.guard';





const routes: Routes = [
  {
    path: '',
    redirectTo:'login',
    pathMatch:'full'
  },
  {
    path: 'login',
    component: LoginCompoComponent,
    canActivate:[AuthGuard]
  },
 

  //----Modules Start-----
  {
    path: 'dash_board',
    component: DashboardCardsComponent,
    canActivate:[AuthGuard],
  },
  {
    path: 'dash_board/invoice',
    component: InvoiceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'user'] }
  },
  {
    path: 'dash_board/category',
    component: CategoryComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }

  },
  {
    path: 'dash_board/customer',
    component: CustomerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'user'] }

  },
  {
    path: 'dash_board/return',
    component: EmployeeComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'user'] }
  },
  {
    path: 'dash_board/purchase',
    component: PurchaseComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'dash_board/report',
    component: ReportComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'dash_board/commonPayments',
    component: CommonPaymentsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'user'] }
  },
  {
    path: 'dash_board/stock',
    component: StockComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'dash_board/user',
    component: UserDataComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'dash_board/vendor',
    component: VendorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'user'] }
  },
  {
    path:'dash_board/purchase_cart',
    component:PurchaseCartComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path:'dash_board/report/stock_report',
    component:StockReportComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path:'dash_board/report/invoice_report',
    component:InvoiceReportComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path:'dash_board/report/purchase_report',
    component:PurchaseReportComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path:'dash_board/report/payments_report',
    component:PaymentsReportComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path:'dash_board/report/vendor_report',
    component:VendorReportComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path:'dash_board/report/customer_report',
    component:CustomerReportComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },

   
  //_---Modules End-----




  //----Nav settings-----
  {
    path: 'settings',
    component: BackupComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'company-details',
    component: CompanyDetailsComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'print',
    component: PrintComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'sys-info',
    component: SysInfoComponent,
    canActivate:[AuthGuard]
  },

    //----others-----
  {
    path:'dash_board/invoice/selectedInvoice',
    component:SelectedInvoiceComponent,
    canActivate:[AuthGuard]
  },

];

  
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule {

   /*  constructor(private router:Router,private currentLoggedInUserService:CurrentLoggedInUserService){

    }

    navigationAccordingToTheRole(){
       let role = this.currentLoggedInUserService.getRole()
       if(role=='user'){
            
       }
    } */
 }
