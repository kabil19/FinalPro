import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, PatternValidator, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GridApi, ICellRendererParams } from 'ag-grid';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, debounceTime } from 'rxjs';
import { emailPattern, namePattern, passwordPattern, userNamePattern } from 'src/app/constants/interfaces/VALIDATORS';
import { ActionPopComponent } from 'src/app/custom-components/action-cell/action-pop/action-pop.component';
import { UserService } from 'src/app/service/userService/user.service';

@Component({
    selector: 'app-user-registration',
    templateUrl: './userRegistration-form.html',
    styleUrls: ['./userRegistration-form.css', '../form-design.css']
})
export class UserRegistrationForm implements OnInit {
    userForm: FormGroup;
    hide: boolean = true;
    allData: any;

    constructor(
        private toastr: ToastrService,
        private userService: UserService,
        private matDialog: MatDialog,
        private matDialogRef: MatDialogRef<UserRegistrationForm>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        
     this.userForm = new FormGroup({
            userId: new FormControl,
            firstname: new FormControl(null,[Validators.required,Validators.pattern(namePattern)]),
            lastname: new FormControl(null,[Validators.required,Validators.pattern(namePattern)]),
            username: new FormControl(null, [Validators.required,Validators.pattern(userNamePattern)]),
            gender: new FormControl("male", Validators.required),
            role: new FormControl(null, Validators.required),
            email: new FormControl(null, [Validators.required, Validators.email,Validators.pattern(emailPattern)]),
            // password:this.data.title == 'Update' ? new FormControl(null,[Validators.minLength(8),Validators.pattern(passwordPattern)]): new FormControl(null,[Validators.required,Validators.minLength(8),Validators.pattern(passwordPattern)]),
            // confirmPw:this.data.title == 'Update' ? new FormControl(null,[Validators.minLength(8),Validators.pattern(passwordPattern)]): new FormControl(null,[Validators.required,Validators.minLength(8),Validators.pattern(passwordPattern)]),
            password: new FormControl(null),
            confirmPw: new FormControl(null)
        });
        if (this.data.title !== 'Update') {
            this.addPasswordValidators();
        }
        this.setupPasswordValidation();
    }

    private setupPasswordValidation(): void {
        const passwordControl = this.userForm.get('password');
        const confirmPwControl = this.userForm.get('confirmPw');
    
        if (passwordControl && confirmPwControl) {
            combineLatest([
                passwordControl.valueChanges.pipe(debounceTime(300)),
                confirmPwControl.valueChanges.pipe(debounceTime(300))
            ]).subscribe(([passwordValue, confirmPwValue]) => {
                if (this.data.title === 'Update') {
                    if (passwordValue || confirmPwValue) {
                        this.addPasswordValidators();
                    } else {
                        this.clearPasswordValidators();
                    }
                    passwordControl.updateValueAndValidity();
                    confirmPwControl.updateValueAndValidity();
                }
            });
        } else {
            console.warn('Password or Confirm Password controls are not defined');
        }
    }
    
    private addPasswordValidators(): void {
        const passwordControl = this.userForm.get('password');
        const confirmPwControl = this.userForm.get('confirmPw');
    
        if (passwordControl && confirmPwControl) {
            passwordControl.setValidators([
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(passwordPattern)
            ]);
            confirmPwControl.setValidators([
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(passwordPattern)
            ]);
        }
    }
    
    private clearPasswordValidators(): void {
        const passwordControl = this.userForm.get('password');
        const confirmPwControl = this.userForm.get('confirmPw');
    
        if (passwordControl && confirmPwControl) {
            passwordControl.clearValidators();
            confirmPwControl.clearValidators();
        }
    }
    
 


    setDataIntoFormFields() {
        return this.userForm.setValue({
            userId: this.data.userdata.userId,
            firstname: this.data.userdata.firstname,
            lastname: this.data.userdata.lastname,
            username: this.data.userdata.username,
            gender: this.data.userdata.gender,
            role: this.data.userdata.role,
            email: this.data.userdata.email,
            password: null,
            confirmPw: null
        })
    }

    ngOnInit(): void {
        if (this.data.title === "Update") {
            this.setDataIntoFormFields()
        }
    }



    selectOperation() {
        if(!this.userForm.valid){
            this.toastr.warning("Enter a valid data to " + this.data.title)
            return;
           }
        if (this.data.title === "Insert" &&
            this.userForm.valid && this.userForm.value.password === this.userForm.value.confirmPw) {
            this.insertPopTrigger();

        } else if (this.data.title == "Update" &&
            this.userForm.value.password === this.userForm.value.confirmPw ||
            this.userForm.value.password && this.userForm.value.confirmPw == null) {
            this.updatePopTrigger();

        } else {
            if (this.userForm.value.password != this.userForm.value.confirmPw) {
                this.toastr.error("The password isn't matching!")
            } else if (!this.userForm.valid) {
                this.toastr.warning("Enter a valid data to " + this.data.title)
            }

        }

    }


    insertPopTrigger() {
            
        const extraData = {
            title: "Insert",
            subTitle: "are you sure you want to add this data?",
        }
        const openActionPop = this.matDialog.open(ActionPopComponent, { data: extraData,panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop" })
        openActionPop.afterClosed().subscribe((state: boolean) => {
            if (!state) return;
            this.userService.insertNewUser(this.userForm.value).subscribe(res => {
                if(res?.successMessage!=null){
                    this.toastr.success(res?.successMessage)
                    this.matDialogRef.close();
                }else{
                    console.log(res)
                    this.toastr.clear()
                    this.toastr.error(res?.errors)
                }
            })

        })


    }

    updatePopTrigger() {
      
        const extraData = {
            title: this.data.title,
            subTitle: "are you sure you want to update the selected data?",

        }
        const openActionPop = this.matDialog.open(ActionPopComponent, { data: extraData,panelClass:"custom-dialog-container",backdropClass: "dialogbox-backdrop" })
        openActionPop.afterClosed().subscribe((state: boolean) => {
            if (!state) return;
            this.userService.updateUserDetails(this.userForm.value).subscribe((res) => {
                if(res?.successMessage!=null){
                    this.toastr.success(res?.successMessage)
                    this.matDialogRef.close();
                }else{
                    console.log(res)
                    this.toastr.clear()
                    this.toastr.error(res?.errors)
                }
            })
        })

    }

   

}
