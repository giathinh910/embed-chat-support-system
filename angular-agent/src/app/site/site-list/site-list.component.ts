import { Component, OnInit } from '@angular/core';
import { SiteService } from '../services/site.service';
import { Router } from '@angular/router';

@Component({
    selector: 'agent-site-list',
    templateUrl: './site-list.component.html',
    styleUrls: ['./site-list.component.scss']
})
export class SiteListComponent implements OnInit {
    queryParams = {
        page: 1
    };
    sites: any[];

    constructor(private siteService: SiteService,
                private router: Router) {
    }

    ngOnInit() {
        this.siteService.getList(this.queryParams).then(res => {
            this.sites = res
        })
    }

    goToChat(siteId) {
        this.router.navigate(['chat', siteId])
    }

}
