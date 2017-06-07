import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "../auth/services/auth-guard.service";
import { SiteComponent } from './site.component';
import { SiteListComponent } from './site-list/site-list.component';
import { SiteCreateComponent } from './site-create/site-create.component';
import { SiteDetailComponent } from './site-detail/site-detail.component';
import { SiteService } from './services/site.service';
import { AgentModule } from '../agent/agent.module';

const routes: Routes = [
    {
        path: 'sites',
        component: SiteComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: '',
                component: SiteListComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'create',
                component: SiteCreateComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: ':siteId',
                component: SiteDetailComponent,
                canActivate: [AuthGuardService]
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        AgentModule
    ],
    declarations: [
        SiteComponent,
        SiteListComponent,
        SiteCreateComponent,
        SiteDetailComponent
    ],
    providers: [
        AuthGuardService,
        SiteService
    ]
})
export class SiteModule {
}
