import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { JwtConfigModule } from './global/jwt-config.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from "./layout/layout.module";
import { AuthModule } from "./auth/auth.module";
import { StorageService } from "./global/services/storage.service";
import { SiteModule } from "./site/site.module";
import { AuthService } from "./auth/services/auth.service";
import { ChatModule } from './chat/chat.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JwtConfigModule,
        AppRoutingModule,
        LayoutModule,
        AuthModule,
        SiteModule,
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
