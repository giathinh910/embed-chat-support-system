import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from "./layout/layout.module";
import { AuthModule } from "./auth/auth.module";
import { StorageService } from "./global/services/storage.service";
import { SiteModule } from "./site/site.module";
import { AuthService } from "./auth/services/auth.service";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        LayoutModule,
        AuthModule,
        SiteModule
    ],
    providers: [
        AuthService,
        StorageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
