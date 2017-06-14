import { Component, OnInit } from '@angular/core';
import { SiteService } from '../services/site.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from "../../global/services/storage.service";

@Component({
    selector: 'agent-site-detail',
    templateUrl: './site-detail.component.html',
    styleUrls: ['./site-detail.component.scss']
})
export class SiteDetailComponent implements OnInit {
    site: any;
    embedSnippet: string;
    embedSnippetConfig = {
        position: 'right',
        offset: 15
    };

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
                this.buildEmbedCode();
            })
        });
    }

    buildEmbedCode() {
        let snippet = '<script type="text/javascript">';
        snippet += `var iframe=document.createElement("iframe");iframe.src="http://localhost:3002/?site=${this.site._id}",iframe.id="${this.site._id}",iframe.style="height:0",document.querySelector("body").appendChild(iframe);var tbChatFrame=document.getElementById("${this.site._id}");tbChatFrame.style.cssText="border:none;position:fixed;z-index:10000;bottom:0;${this.embedSnippetConfig.position}:${this.embedSnippetConfig.offset}px;width:300px;height:0;box-shadow:rgba(0,0,0,0.1) 0 0 5px 0",window.addEventListener("message",function(e){var t=e.data[0],a=e.data[1];switch(t){case"documentHeight":tbChatFrame.style.height=a+"px"}},!1);`;
        snippet += '</script>';
        this.embedSnippet = snippet;
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
