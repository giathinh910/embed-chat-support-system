import { Component, OnInit } from '@angular/core';
import { SiteService } from '../services/site.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from "../../global/services/storage.service";
import { environment } from '../../../environments/environment';

@Component({
    selector: 'agent-site-detail',
    templateUrl: './site-detail.component.html',
    styleUrls: ['./site-detail.component.scss']
})
export class SiteDetailComponent implements OnInit {
    site: any;
    chatClientUrl = environment.chatClientUrl;

    constructor(private siteService: SiteService,
                private activatedRoute: ActivatedRoute,
                private storageService: StorageService) {
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

    isOwner(site) {
        if (site.owner)
            return site.owner._id == this.storageService.getUserId();
        return false;
    }

}
