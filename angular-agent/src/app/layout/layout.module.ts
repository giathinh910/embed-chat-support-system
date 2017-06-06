import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavComponent } from './top-nav/top-nav.component';

@NgModule({
    imports: [
        CommonModule
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
