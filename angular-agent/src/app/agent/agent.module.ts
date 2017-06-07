import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from "app/auth/services/auth-guard.service";
import { AgentService } from './services/agent.service';
import { AgentComponent } from './agent.component';
import { AgentSearchComponent } from './agent-search/agent-search.component';

const routes: Routes = [
    {
        path: 'agents',
        component: AgentComponent,
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
        AgentComponent,
        AgentSearchComponent
    ],
    providers: [
        AgentService
    ],
    exports : [
        AgentSearchComponent
    ]
})
export class AgentModule {
}
