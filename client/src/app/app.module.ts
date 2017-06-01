import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from "./app-routing.module";
import { JwtAuthModule } from "./modules/jwt-auth.module";
import { AppComponent } from './app.component';
import { AuthModule } from "./modules/auth.module";
import { ChatModule } from "./modules/chat.module";
import { AuthService } from "./services/auth.service";
import { StorageService } from "./services/storage.service";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        JwtAuthModule,
        AppRoutingModule,
        AuthModule,
        ChatModule
    ],
    providers: [
        AuthService,
        StorageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
