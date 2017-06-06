import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "../auth/services/auth-guard.service";
import { ChatService } from './services/chat.service';
import { ChatComponent } from './chat.component';

const routes: Routes = [
    {
        path: 'chat/:siteId',
        component: ChatComponent,
        canActivate: [AuthGuardService]
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ChatComponent
    ],
    providers: [
        AuthGuardService,
        ChatService
    ]
})
export class ChatModule {
}
