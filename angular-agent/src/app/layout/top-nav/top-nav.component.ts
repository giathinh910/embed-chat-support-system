import { Component, OnInit } from '@angular/core';
import { StorageService } from "../../global/services/storage.service";
import { AuthService } from "../../auth/services/auth.service";

@Component({
    selector: 'agent-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

    constructor(private authService: AuthService,
                public storageService: StorageService) {
    }

    ngOnInit() {
    }

    logout() {
        this.authService.logout();
    }

}
