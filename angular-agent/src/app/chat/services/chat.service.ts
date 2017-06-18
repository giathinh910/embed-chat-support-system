import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { Subject } from "rxjs/Subject";
import { StorageService } from "../../global/services/storage.service";
import { AuthHttp } from 'angular2-jwt';

declare const io: any;

@Injectable()
export class ChatService {

    private apiUrl = environment.apiUrl;

    private chatSocketUrl = environment.chatSocketUrl;
    private socket;

    private socketStatus = new Subject<boolean>();
    socketStatus$ = this.socketStatus.asObservable();

    private initData = new Subject<any>();
    initData$ = this.initData.asObservable();

    private aCustomerComesOnline = new Subject<any>();
    aCustomerComesOnline$ = this.aCustomerComesOnline.asObservable();

    private aCustomerComesOffline = new Subject<any>();
    aCustomerComesOffline$ = this.aCustomerComesOffline.asObservable();

    private messages = new Subject<any>();
    messages$ = this.messages.asObservable();

    private someCustomerMessages = new Subject<any>();
    someCustomerMessages$ = this.someCustomerMessages.asObservable();

    constructor(private storageService: StorageService,
                private http: AuthHttp) {
        //
    }

    /* XHR
     ============================================================= */
    getRoomsBySite(siteId: string): Promise<any> {
        return this.http
            .get(`${this.apiUrl}/rooms/site/${siteId}`)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError)
    }

    getMessagesByRoom(roomId: string): Promise<any> {
        return this.http
            .get(`${this.apiUrl}/messages/room/${roomId}`)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError)
    }

    private handleError(error: any): Promise<any> {
        console.log('An error occurred:', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    /* SOCKET
     ============================================================= */
    // Service message commands
    sendMessage(message) {
        this.socket.emit('agent says', message);
    }

    listenIoEvents(siteId) {
        if (!siteId)
            return;

        this.socket = io(this.chatSocketUrl, {
            query: {
                token: this.storageService.getToken(),
                siteId: siteId
            }
        });

        const socket = this.socket;

        socket.on('connect', () => this.socketStatus.next(true));

        socket.on('disconnect', () => this.socketStatus.next(false));

        socket.on('respond init data for agent', (data) => this.initData.next(data));

        socket.on('a customer comes online', (data) => {
            socket.emit('a customer comes online', data);
            this.aCustomerComesOnline.next(data);
        });

        socket.on('a customer comes offline', (data) => {
            socket.emit('a customer comes offline', data);
            this.aCustomerComesOffline.next(data);
        });

        socket.on('customer says', (data) => this.messages.next(data));

        socket.on('some customer says', (data) => this.someCustomerMessages.next(data));
    }

    emitRequestInitData() {
        this.socket.emit('request init data for agent');
    }

}
