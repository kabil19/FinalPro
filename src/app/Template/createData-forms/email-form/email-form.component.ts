import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { ICustomerEntity } from 'src/app/constants/interfaces/CustomerEntity';
import { CustomerService } from 'src/app/service/customer-service/customer.service';
import { EmailService } from 'src/app/service/email-service/email.service';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css']
})
export class EmailFormComponent implements OnInit {


  emailForm: FormGroup;
  isLoading: boolean = false;
  // customerControl = new FormControl('');
  filterOptions!: Observable<ICustomerEntity[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { reportPic: HTMLElement, extraDetails: { reportType: string, custEmail: string } },
    private matDialogRef: MatDialogRef<EmailFormComponent>,
    private emailService: EmailService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {
    this.emailForm = new FormGroup({
      emailId: new FormControl(this.data.extraDetails.custEmail),
      title: new FormControl((this.data.extraDetails.reportType).toUpperCase()),
      subject: new FormControl(),
    })



  }
  ngOnInit(): void {

  }

  async sendEmail() {
    const generatedReport = this.data.reportPic;
    if (generatedReport) {
      this.isLoading = true;
      this.cdr.detectChanges();
      try {
        const { emailId, title, subject } = this.emailForm.value;
        console.log(this.emailForm.value)
        await this.emailService.onClickSendMail(generatedReport, emailId, title, subject)
        this.matDialogRef.close()
        return
      } catch (error) {
        this.toastr.error('Error occurred while sending email');
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
      this.toastr.warning('Please generate report to send mail.', 'No PDF found');
    }
  }



}
