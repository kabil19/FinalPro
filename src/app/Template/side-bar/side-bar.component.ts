import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { INotificationEntity } from 'src/app/constants/interfaces/INotificationEntity';
import { AuthService } from 'src/app/service/auth/auth.service';
import { NotificationService } from 'src/app/service/notification-service/notification.service';
import { SysInfoComponent } from './nav-settings/sys-info/sys-info.component';


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  @Input() isSwitched!: boolean;
  notificationData: INotificationEntity | null = null;
  isLinkDisabled = true;
  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef) {

  }
  ngOnInit(): void {

    this.notificationService.dueDateDataSubject$.subscribe(data => {
      this.notificationData = data;
      this.cdr.detectChanges();
    })
    if (this.authService.isLoggedIn()) {
      this.notificationService.fetchnotificationData();
    }
    this.isLinkDisabled = true
  }
  logout() {
    console.log("logout")
    this.notificationService.clearData();
    this.authService.logout();
  }


  openUserManual() {
    this.dialog.open(SysInfoComponent, { panelClass: ["custom-dialog-container"], backdropClass: "dialogbox-backdrop", width: '100%' })
  }


}
