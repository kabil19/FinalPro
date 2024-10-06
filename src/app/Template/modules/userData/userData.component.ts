import { Component, ViewChild, } from '@angular/core';
import { MatDialog, MatDialogRef, } from '@angular/material/dialog';
import { UserRegistrationForm } from '../../createData-forms/registration-form/userRegistration-form.component';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActionCellComponent } from 'src/app/custom-components/action-cell/user-action/action-cell.component';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';

import { UserService } from 'src/app/service/userService/user.service';



@Component({
    selector: 'app-user',
    templateUrl: './userData.component.html',
    styleUrls: ['./userData.component.css'],
})
export class UserDataComponent {
    public themeClass: string =
        "ag-theme-alpine";
    rowData$!: Observable<any[]>;
    @ViewChild(AgGridAngular)
    agGrid!: AgGridAngular
    gridApi: GridApi | any = {}
    public rowSelection: 'single' | 'multiple' = 'single';
    searchCharac: string = ""
    public columnDef: ColDef[] = [
        // 
        { field: "userId", width: 90, hide: true, suppressColumnsToolPanel: true },
        { field: "firstname", },
        { field: "lastname", },
        { field: "username", },
        { field: "role", },
        { field: "email", width: 250 },
        { field: "gender", },
        { field: "password", hide: true, suppressColumnsToolPanel: true },
        { field: "confirmPw", hide: true, suppressColumnsToolPanel: true },
        { field: "Action", width: 90, cellRenderer: ActionCellComponent, }
    ];

    constructor(
        private dialog: MatDialog,
        private userService: UserService,
    ) { }




    onGridReady(param: GridReadyEvent) {
        this.rowData$ = this.getRowData();
        this.gridApi = param?.api
        this.gridApi.sizeColumnsToFit();
    }

    onCellClicked(cellClickedEvent: CellClickedEvent) {
        //    console.log(cellClickedEvent)
    }

    private getRowData(): any {
        return new Promise((resolve) => {
            this.userService.getAllUser().subscribe((userData) => {
                resolve(userData);
            }, (err) => {
                resolve([])
            })
        })
    }

    // every Time delete,add,update have been used this specific function should be used by classes(popups or etc) so kept public 
    // or else this should be created for every class 
    public setDataIntoRow() {
        this.userService.getAllUser().subscribe((userData) => {
            this.gridApi.setRowData(userData);
        }, (err) => {
        })
    }


    insertTrigger() {
        const extraData = {
            title: "Insert"
        }
        const openForm = this.dialog.open(UserRegistrationForm, { data: extraData, panelClass: ["custom-dialog-container"], height: 'auto', backdropClass: "dialogbox-backdrop" })
        openForm.afterClosed().subscribe(res => {
            this.setDataIntoRow();
        })

    }

    searchDataInRows() {
        // this.gridApi.setQuickFilter(this.searchCharac)
        if (this.searchCharac !== "") {
            this.userService.findData(this.searchCharac).subscribe(res => {
                this.gridApi.setRowData(res)
            });
        } else if (this.searchCharac === "") {
            this.setDataIntoRow()
        }
    }




}

