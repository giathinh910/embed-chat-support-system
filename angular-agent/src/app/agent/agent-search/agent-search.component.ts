import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import "rxjs/Rx";
import { AgentService } from '../services/agent.service';

@Component({
    selector: 'agent-agent-search',
    templateUrl: './agent-search.component.html',
    styleUrls: ['./agent-search.component.scss']
})
export class AgentSearchComponent implements OnInit {
    currentSearchTerm: string;
    private searchTerms = new Subject<string>();
    agents: any[];
    @Output() onAgentSelected = new EventEmitter<any>();

    constructor(private agentService: AgentService) {
    }

    ngOnInit() {
        this.listenTerm();
    }

    search(): void {
        this.searchTerms.next(this.currentSearchTerm);
    }

    listenTerm(): void {
        this.searchTerms
            .debounceTime(200)
            .distinctUntilChanged()
            .switchMap(term => this.agentService.search(term))
            .subscribe(result => {
                console.log(result);
                this.agents = result;
            })
    }

    selectAgent(agent) {
        this.onAgentSelected.emit(agent);
        this.agents = [];
        this.currentSearchTerm = '';
    }
}
