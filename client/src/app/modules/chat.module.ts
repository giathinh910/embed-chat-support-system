import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ChatComponent } from '../components/chat/chat.component';
import { AuthGuardService } from '../services/auth-guard.service';
import { ChatService } from "../services/chat.service";

const routes: Routes = [
    {
        path: 'chat',
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
