import { Component, OnInit } from '@angular/core';
import { SiteService } from '../services/site.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'agent-site-detail',
    templateUrl: './site-detail.component.html',
    styleUrls: ['./site-detail.component.scss']
})
export class SiteDetailComponent implements OnInit {
    site: any;

    constructor(private siteService: SiteService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.getList();
    }

    getList() {
        this.activatedRoute.params.subscribe(params => {
            this.siteService.getOne(params.siteId).then(res => {
                this.site = res;
            })
        });
    }

    assignAgent(agent) {
        this.siteService.assignAgent(this.site._id, agent).then(res => {
            this.getList();
        });
    }

    unassignAgent(agent) {
        this.siteService.unassignAgent(this.site._id, agent).then(res => {
            this.getList();
        });
    }

}
