import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { CustomerService } from "./service/customer-service/customer.service";
import { GLOBAL_LIST } from "./constants/GlobalLists";
import { VendorService } from "./service/vendor-service/vendor.service";
import { TempPurchaseService } from "./service/tempPurchase-service/temp-purchase.service";
import { Location } from '@angular/common';
import { NotificationService } from "./service/notification-service/notification.service";
import { SalesInvocieChequeService } from "./service/salesInvoiceCheque-service/sales-invocie-cheque.service";
import { IDataToSet } from "./constants/interfaces/IDataToSetForReports";
@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    title = "FinalPro";
    isLoginPageAvail: boolean = true;
    showClose: boolean = false;
    isSwitched;
    currentYear: number = new Date().getFullYear()
    dueChequeData: any = { result: null }
    constructor(
        private router: Router,
        private notificationService: NotificationService,
        private location: Location
    ) {
        this.isSwitched = true;


    }
    ngOnInit() {
        // this.notificationService.fetchnotificationData();
    }
    ShowSidebarAndNotifiBar(): any {
        const currentRoute = this.router.url; //login
        // if (['/login'].includes(currentRoute)) {
        if (currentRoute.includes("/login")) {
            this.isLoginPageAvail = true;
            return false;
        } else {
            this.isLoginPageAvail = false;
            return true;
        }
    }


    showCloseIcon() {
        const currentRoute = this.router.url;
        if (["/login", "/dash_board", "/dash_board/report/"].includes(currentRoute)) {
            this.showClose = false;
            return false;
        } else {
            this.showClose = true;
            return true;
        }
    }

    toogleTheme() {
        document.documentElement.classList.toggle("dark");
    }

    goBack() {
        this.location.back()
    }


}
