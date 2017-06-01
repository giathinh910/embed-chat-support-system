import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from "./services/auth-guard.service";

const routes: Routes = [
    {
        path: '',
        redirectTo: '/chat',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    providers: [AuthGuardService],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
