import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { Subject } from "rxjs/Subject";
import { StorageService } from "../../global/services/storage.service";

declare let io: any;

@Injectable()
export class ChatService {

    private chatSocketUrl = environment.chatSocketUrl;
    private socket;

    constructor(private storageService: StorageService) {
        //
    }

    private messages = new Subject<any>();
    messages$ = this.messages.asObservable();

    private socketStatus = new Subject<boolean>();
    socketStatus$ = this.socketStatus.asObservable();

    private onlineCustomers = new Subject<any>();
    onlineCustomers$ = this.onlineCustomers.asObservable();

    // Service message commands
    sendMessage(message) {
        this.socket.emit('agent says', message);
        this.messages.next(message);
    }

    ioHandler(siteId) {
        if (!siteId)
            return;
        this.socket = io(this.chatSocketUrl, {
            query: {
                token: this.storageService.getToken(),
                siteId: siteId
            }
        });

        this.socket.on('connect', () => this.socketStatus.next(true));

        this.socket.on('disconnect', () => this.socketStatus.next(false));

        this.socket.on('respond init data for agent', (data) => this.onlineCustomers.next(data));
    }

    emit(event, data?) {
        if (data)
            this.socket.emit(event, data);
        else
            this.socket.emit(event);
    }

}
