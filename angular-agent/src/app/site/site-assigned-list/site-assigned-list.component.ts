import { Component, OnInit } from '@angular/core';
import { SiteService } from '../services/site.service';
import { Router } from '@angular/router';
import { StorageService } from '../../global/services/storage.service';

@Component({
    selector: 'agent-site-assigned-list',
    templateUrl: './site-assigned-list.component.html',
    styleUrls: ['./site-assigned-list.component.scss']
})
export class SiteAssignedListComponent implements OnInit {
    queryParams = {
        getAssignedSites: true,
        page: 1
    };
    sites: any[];

    constructor(private siteService: SiteService,
                private router: Router,
                private storageService: StorageService) {
    }

    ngOnInit() {
        this.getList();
    }

    getList() {
        this.siteService.getList(this.queryParams).then(res => {
            this.sites = res
        })
    }

    leaveSite(siteId, siteIndex) {
        this.sites.splice(siteIndex, 1); // quick remove
        this.siteService.selfUnassignAgent(siteId).then(res => {
            this.getList();
        })
    }

    isOwner(site) {
        return site.owner._id == this.storageService.getUserId();
    }

}

