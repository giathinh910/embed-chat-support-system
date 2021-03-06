import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class SiteService {
    private apiUrl = environment.apiUrl + '/sites';

    constructor(private http: AuthHttp) {
    }

    getList(params: any): Promise<any> {
        let url = this.apiUrl,
            queryParamsArr = [];

        if (params.getAssignedSites) {
            url += '/assigned';
        }

        queryParamsArr.push(params.perPage ? `perPage=${params.perPage}` : 'perPage=10');
        queryParamsArr.push(params.page ? `page=${params.page}` : 'page=1');

        let queryParamsStr = queryParamsArr.join('&');
        url += queryParamsStr.length > 0 ? `?${queryParamsStr}` : '';

        return this.http
            .get(url)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError)
    }

    createOne(site: any): Promise<any> {
        return this.http
            .post(`${this.apiUrl}`, site)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError)
    }

    getOne(siteId: string): Promise<any> {
        return this.http
            .get(`${this.apiUrl}/${siteId}`)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError)
    }

    assignAgent(siteId, agent): Promise<any> {
        return this.http
            .put(`${this.apiUrl}/${siteId}/users/assign/`, agent)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError)
    }

    unassignAgent(siteId, agent): Promise<any> {
        return this.http
            .put(`${this.apiUrl}/${siteId}/users/unassign/`, agent)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError)
    }

    selfUnassignAgent(siteId): Promise<any> {
        return this.http
            .put(`${this.apiUrl}/${siteId}/users/self-unassign/`, null)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError)
    }

    private handleError(error: any): Promise<any> {
        console.log('An error occurred:', error); // for demo purposes only
        // return;
        return Promise.reject(error.message || error);
    }

}
