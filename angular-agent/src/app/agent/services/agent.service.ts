import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { Headers, Http, RequestOptions } from '@angular/http';
import { StorageService } from '../../global/services/storage.service';

@Injectable()
export class AgentService {
    private apiUrl = environment.apiUrl + '/users';

    constructor(private authHttp: AuthHttp,
                private http: Http,
                private storageService: StorageService) {
    }

    search(term: string) {
        let url = this.apiUrl + `/search?term=${term}`;
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.storageService.getToken()
        });
        let options = new RequestOptions({headers: headers});

        return this.http
            .get(url, options)
            .map(res => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    private handleError(error: any): Promise<any> {
        console.log('An error occurred:', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
