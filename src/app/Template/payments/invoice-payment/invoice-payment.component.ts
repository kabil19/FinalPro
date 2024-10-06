import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { GLOBAL_LIST } from 'src/app/constants/GlobalLists';
import { IPaymentEntity } from 'src/app/constants/interfaces/IPaymentEntity';
import { ActionPopComponent } from 'src/app/custom-components/action-cell/action-pop/action-pop.component';
import { ConfirmSalesInvociePaymentService } from 'src/app/service/confirmPaymentServices/ConfirmSalesInvoiceService/confirm-sales-invocie-payment.service';
import { ConfirmPurchasePaymentService } from 'src/app/service/confirmPaymentServices/ConfirmedPurchaseInvoiceServices/confirm-purchase-payment.service';
import { InvoiceService } from 'src/app/service/invoice-service/invoice.service';
import { NotificationService } from 'src/app/service/notification-service/notification.service';
import { PaymentsService } from 'src/app/service/payments-service/payments.service';

@Component({
    selector: 'app-invoice-payment',
    templateUrl: './invoice-payment.component.html',
    styleUrls: ['./invoice-payment.component.css']
})
export class InvoicePaymentComponent implements OnInit {

    paymentOptions: any[] = [
        { value: 'cash', viewValue: 'Cash' },
        { value: 'cheque', viewValue: 'Cheque' },
        { value: 'card', viewValue: 'Debit/Credit Card' }
    ];
    selectedOption!: String;
    invoicePaymentForm!: FormGroup<any>;
    isValid!: Boolean
    paymentsList: IPaymentEntity[] = []
    tempInvoiceNetAmount!: number;
    totalPaidAmount: any
    isTempSalesInvoicePayment: boolean = false
    isConfirmSalesInvoicePayment: boolean = false
    isConfirmPurchaseInvoicePayment: boolean = false
    constructor(
        private dialogRef: MatDialogRef<InvoicePaymentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private toastr: ToastrService,
        private paymentService: PaymentsService,
        private matDialog: MatDialog,
        private invoiceService: InvoiceService,
        private confirmSalesInvociePaymentService: ConfirmSalesInvociePaymentService,
        private confirmPurchasePaymentService: ConfirmPurchasePaymentService,
        private notificationService: NotificationService,
    ) {
        // this.paymentsList = GLOBAL_LIST.PAYMENTS_DATA
        console.log(data)
        this.isValid = false
        this.invoicePaymentForm = new FormGroup({
            paymentType: new FormControl(null, Validators.required),
            cardRefNo: new FormControl('', Validators.required),
            paidAmount: new FormControl('', Validators.required),
            chequeRefNo: new FormControl('', Validators.required),
            chequeDueDate: new FormControl('', Validators.required),
            paidDate: new FormControl(moment()),
        })
    }




    ngOnInit(): void {

        if (this.data.tempInvoiceData) {
            console.log("I have come")
            const amountInput = this.invoicePaymentForm.get('paidAmount')

            if (this.data?.payable) {
                console.log("I have come2")
                amountInput?.setValue(this.data?.payable)
                amountInput?.markAsDirty()
                amountInput?.markAllAsTouched()
                this.isValid = true
            }
            console.log("Payable from TempInvoice ", this.data?.payable)
            this.isTempSalesInvoicePayment = true
            this.getTempInvoiceById(this.data.tempInvoiceData.tempInvoiceId)
            this.loadAllPayment();
        } if (this.data.confirmPurchaseId) {
            this.isConfirmPurchaseInvoicePayment = true
            console.log("Purchase ", this.data)
        } if (this.data.confirmInvoiceId) {
            this.isConfirmSalesInvoicePayment = true
            console.log("Sales ", this.data)
        }
    }
    triggerNotification() {
        this.notificationService.fetchnotificationData();
    }
    getTempInvoiceById(invocieId: number) {
        this.invoiceService.getTempInvocieById(invocieId).subscribe(res => {
            this.tempInvoiceNetAmount = res.result.netAmount;
        })
    }

    validateAmount() {
        if (this.isTempSalesInvoicePayment) {
            this.tempSalesInvoicePayValidate()
        } else if (this.isConfirmSalesInvoicePayment || this.isConfirmPurchaseInvoicePayment) {
            this.confirmPurchaseOrSalesInvoicePayValidate()
        }
    }


    confirmPurchaseOrSalesInvoicePayValidate() {
        const amountInput = this.invoicePaymentForm.get('paidAmount')
        amountInput?.valueChanges.pipe(debounceTime(300)).subscribe((enteredAmount) => {
            this.totalPaidAmount = this.data.paidAmount
            let balance = this.data.netAmount - this.totalPaidAmount
            console.log("balance ", balance)
            if (enteredAmount && (enteredAmount) > balance) {
                this.toastr.clear()
                this.toastr.warning("The amount exceeds the Balance Amount " + balance)
                this.isValid = false
                return
            } else if (enteredAmount && enteredAmount <= 0) {
                this.toastr.clear()
                this.toastr.warning("Amount can't be less or equal to 0")
                this.isValid = false
                amountInput?.setValue(null)
            } else if (enteredAmount == null) {
                this.isValid = false
            } else if (enteredAmount && enteredAmount > 0 && enteredAmount <= balance) {
                this.isValid = true
            }

        })
    }


    tempSalesInvoicePayValidate() {

        const amountInput = this.invoicePaymentForm.get('paidAmount')

        amountInput?.valueChanges.pipe(debounceTime(300)).subscribe((enteredAmount) => {
            console.log("netAmount ", this.tempInvoiceNetAmount)
            this.totalPaidAmount = this.getTotalPaidAmount()
            let balance = this.tempInvoiceNetAmount - this.totalPaidAmount
            //    console.log("balance ", balance)

            if (enteredAmount && (enteredAmount) > balance) {

                if (this.paymentsList.length > 0) {
                    this.toastr.clear()
                    this.toastr.warning("The amount exceeds the Balance Amount " + balance)
                    this.isValid = false
                    return
                } else {
                    this.toastr.clear()
                    this.toastr.warning("The amount exceeds the Total " + balance)
                    this.isValid = false
                    return
                }
            } else if (enteredAmount && enteredAmount <= 0) {
                this.toastr.clear()
                this.toastr.warning("Amount can't be less or equal to 0")
                this.isValid = false
                amountInput?.setValue(null)
            } else if (enteredAmount == null) {
                this.isValid = false
            } else if (enteredAmount && enteredAmount > 0 && enteredAmount <= balance) {
                this.isValid = true
            }
        })


    }


    getTotalPaidAmount() {
        let totalPaidAmount = 0;
        if (this.paymentsList?.length > 0) {
            totalPaidAmount = this.paymentsList?.reduce((accumulator, currentValue) => accumulator + currentValue.paidAmount, 0)
        }
        return totalPaidAmount
    }




    payAmount() {
        switch (this.selectedOption) {
            case 'cheque':
                if (!this.invoicePaymentForm.get('chequeDueDate')?.value && !this.invoicePaymentForm.get('chequeRefNo')?.value) {
                    this.toastr.clear();
                    this.toastr.error("Enter the cheque Due Date & cheque ref.No to pay with cheque!", "Can't be Empty!");
                    return;
                }
                if (!this.invoicePaymentForm.get('chequeDueDate')?.value) {
                    this.toastr.clear();
                    this.toastr.error("Enter the cheque Due Date!", "Can't be Empty!");
                    return;
                }
                if (!this.invoicePaymentForm.get('chequeRefNo')?.value) {
                    this.toastr.clear();
                    this.toastr.error("Enter the cheque ref.No to pay with cheque!", "Can't be Empty!");
                    return;
                }
                break;
            case 'card':
                if (!this.invoicePaymentForm.get('cardRefNo')?.value) {
                    this.toastr.clear();
                    this.toastr.error("Enter the card ref.No to pay with card!", "Can't be Empty!");
                    return;
                }
        }
        const extraData = {
            title: "Make a Payment",
            subTitle: "are you sure you want to make a payment?",
        }
        let paymentFormData = this.invoicePaymentForm.value;

        if (this.data.tempInvoiceData) {
            if (this.selectedOption === 'cheque') {
                const chequeDueDateValue = this.invoicePaymentForm.get('chequeDueDate')?.value;
                paymentFormData.chequeDueDate = moment(chequeDueDateValue).format("YYYY-MM-DDTHH:mm");
            }
            paymentFormData.salesInvoice = this.data.tempInvoiceData;
            const openAction = this.matDialog.open(ActionPopComponent, { data: extraData, panelClass: ['custom-dialog-container'], backdropClass: "dialogbox-backdrop" })
            openAction.afterClosed().subscribe((state) => {
                if (!state) return
                console.log("paymentFormData", paymentFormData)
                this.paymentService.addPayment(paymentFormData).subscribe((advancePayRes) => {
                    console.log(advancePayRes.successMessage)
                    if (advancePayRes?.successMessage != null) {
                        this.toastr.success(advancePayRes?.successMessage)
                        this.dialogRef.close();
                    } else {
                        this.toastr.clear()
                        this.toastr.error(advancePayRes?.errors)
                    }

                }, (err) => {

                })
            })
        } else if (this.data.confirmInvoiceId) {

            paymentFormData.confirmInvoiceOBJ = this.data
            if (this.selectedOption === 'cheque') {
                const chequeDueDateValue = this.invoicePaymentForm.get('chequeDueDate')?.value;
                paymentFormData.chequeDueDate = moment(chequeDueDateValue).format("YYYY-MM-DDTHH:mm");
            }
            const openAction = this.matDialog.open(ActionPopComponent, { data: extraData, panelClass: ['custom-dialog-container'], backdropClass: "dialogbox-backdrop" })
            openAction.afterClosed().subscribe((state) => {
                if (!state) return
                console.log("paymentFormData", paymentFormData)
                this.confirmSalesInvociePaymentService.makePaymentToConfirmInvoice(paymentFormData).subscribe((salesInvoicePaymentRes) => {
                    if (salesInvoicePaymentRes?.successMessage != null) {
                        this.toastr.success(salesInvoicePaymentRes?.successMessage)
                        this.dialogRef.close(salesInvoicePaymentRes);
                        this.triggerNotification()
                    } else {
                        // console.log(salesInvoicePaymentRes)
                        this.toastr.clear()
                        this.toastr.error(salesInvoicePaymentRes?.errors)
                    }
                })
            }, (err) => {

            })

        } else if (this.data.confirmPurchaseId) {

            paymentFormData.vendorOBJ = this.data.vendorOBJ
            paymentFormData.ConfirmPurchaseOBJ = this.data
            if (this.selectedOption === 'cheque') {
                const chequeDueDateValue = this.invoicePaymentForm.get('chequeDueDate')?.value;
                paymentFormData.chequeDueDate = moment(chequeDueDateValue).format("YYYY-MM-DDTHH:mm");
            }
            const openAction = this.matDialog.open(ActionPopComponent, { data: extraData, panelClass: ['custom-dialog-container'], backdropClass: "dialogbox-backdrop" })
            openAction.afterClosed().subscribe((state) => {
                if (!state) return
                console.log("paymentFormData", paymentFormData)
                this.confirmPurchasePaymentService.addToPurchaseInvoicePayment(paymentFormData).subscribe((purchaseInvoiceRes) => {
                    if (purchaseInvoiceRes?.successMessage != null) {
                        this.toastr.success(purchaseInvoiceRes?.successMessage)
                        this.dialogRef.close(purchaseInvoiceRes);
                        this.triggerNotification()
                    } else {
                        console.log(purchaseInvoiceRes)
                        this.toastr.clear()
                        this.toastr.error(purchaseInvoiceRes?.errors)
                    }
                })
            }, (err) => {

            })
        }
    }

    /*  payAmount() {
         const extraData = {
             title: "Make a Payment",
             subTitle: "Are you sure you want to make a payment?",
         };
     
         let paymentFormData = this.invoicePaymentForm.value;
     
         if (this.data.tempInvoiceData) {
             paymentFormData.salesInvoice = this.data.tempInvoiceData;
             this.openActionDialog(extraData, () => {
                 this.paymentService.addPayment(paymentFormData).subscribe(
                     (res) => this.handleResponse(res),
                     (err) => this.handleError(err)
                 );
             });
         } else if (this.data.confirmInvoiceId) {
             paymentFormData.confirmInvoiceOBJ = this.data;
             this.openActionDialog(extraData, () => {
                 this.confirmSalesInvociePaymentService.makePaymentToConfirmInvoice(paymentFormData).subscribe(
                     (res) => this.handleResponse(res),
                     (err) => this.handleError(err)
                 );
             });
         } else if (this.data.confirmPurchaseId) {
             paymentFormData.vendorOBJ = this.data.vendorOBJ;
             paymentFormData.ConfirmPurchaseOBJ = this.data;
             this.openActionDialog(extraData, () => {
                 this.confirmPurchasePaymentService.addToPurchaseInvoicePayment(paymentFormData).subscribe(
                     (res) => this.handleResponse(res),
                     (err) => this.handleError(err)
                 );
             });
         }
     } */

    /*   openActionDialog(extraData: any, onConfirm: () => void) {
          const openAction = this.matDialog.open(ActionPopComponent, {
              data: extraData,
              panelClass: ['custom-dialog-container']
          });
      
          openAction.afterClosed().subscribe((state) => {
              if (state) {
                  onConfirm();
              }
          });
      }
      
      handleResponse(response: any) {
          if (response?.successMessage) {
              this.toastr.success(response.successMessage);
              this.dialogRef.close(response);
          } else {
              this.toastr.clear();
              this.toastr.error(response?.errors);
          }
      }
      
      handleError(error: any) {
          this.toastr.error("An error occurred");
          console.error(error);
      } */


    loadAllPayment() {
        this.paymentService.getAllPayments(this.data?.tempInvoiceData?.tempInvoiceId).subscribe(retivedData => {
            GLOBAL_LIST.PAYMENTS_DATA = retivedData?.result
            this.paymentsList = retivedData?.result
        })
    }

    onNoClick() {
        this.dialogRef.close()
    }

}
