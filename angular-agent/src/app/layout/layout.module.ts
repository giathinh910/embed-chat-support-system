import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopNavComponent } from './top-nav/top-nav.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        TopNavComponent
    ],
    exports: [
        TopNavComponent
    ]
})
export class LayoutModule {
}
