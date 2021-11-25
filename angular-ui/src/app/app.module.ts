import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MatStepperModule} from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Approach1Component } from './components/approach1/approach1.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatCardModule} from "@angular/material/card";
import {HttpClientModule} from "@angular/common/http";
import { TransactionChartComponent } from './components/transaction-chart/transaction-chart.component';
import {ChartsModule} from "ng2-charts";

@NgModule({
    declarations: [
        AppComponent,
        Approach1Component,
        TransactionChartComponent
    ],
    imports: [
        BrowserModule, MatStepperModule, BrowserAnimationsModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule,
        MatSnackBarModule, MatCardModule, HttpClientModule, ReactiveFormsModule, ChartsModule
    ],
    providers: [
        {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 5000}}
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
