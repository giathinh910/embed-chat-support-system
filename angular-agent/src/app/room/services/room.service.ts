import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class RoomService {
    private apiUrl = environment.apiUrl + '/rooms';

    constructor(private http: AuthHttp) {
    }

    getRoomsBySiteId(siteId: string): Promise<any> {
        return this.http
            .get(`${this.apiUrl}/site/${siteId}`)
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

