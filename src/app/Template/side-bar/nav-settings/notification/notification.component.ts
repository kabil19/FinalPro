import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/service/notification-service/notification.service';
import { NotifiExpansionComponent } from './notifi-expansion/notifi-expansion.component';
import { count } from 'rxjs';
import { INotificationEntity } from 'src/app/constants/interfaces/INotificationEntity';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnChanges {



  @Input('notificationData') notificationData: INotificationEntity | null | undefined

  salesChequeDuesCount: number = 0;
  purchaseChequeDuesCount: number = 0;
  productsLowerThanReorderLevelCount: number = 0;
  constructor(public matDialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notificationData']) {
      this.updateCounts();
    }
  }

  private updateCounts(): void {
    if (this.notificationData) {
      this.salesChequeDuesCount = this.notificationData.salesChequeDues?.length || 0;
      this.purchaseChequeDuesCount = this.notificationData.purchaseChequeDues?.length || 0;
      this.productsLowerThanReorderLevelCount = this.notificationData.productsLowerThanReorderLevel?.length || 0;
    } else {
      this.salesChequeDuesCount = 0;
      this.purchaseChequeDuesCount = 0;
      this.productsLowerThanReorderLevelCount = 0;
    }
  }


  openNotification() {
    console.log(this.notificationData)
    this.matDialog.open(NotifiExpansionComponent, { data: this.notificationData, panelClass: "custom-notification-dialog-container", height: "30%", width: "auto", backdropClass: "dialogbox-backdrop" });
  }

}
