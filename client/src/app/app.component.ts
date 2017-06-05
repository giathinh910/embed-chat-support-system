import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    ActivatedRoute, ActivatedRouteSnapshot, NavigationStart, Params, Router, RouterState,
    RouterStateSnapshot
} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class AppComponent implements OnInit {
    title = 'app works!';

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute) {
        //
    }

    ngOnInit() {
        // this.activatedRoute.queryParams.subscribe(p => console.log(p));

        // const state: RouterState = this.router.routerState;
        // const snapshot: RouterStateSnapshot = state.snapshot;
        // console.log(this.router.routerState.snapshot.root);

        // this.activatedRouteSnapshot.queryParams.subscribe((params: Params) => {
        //     let domain = params['domain'];
        //     console.log(params);
        // });
    }
}
