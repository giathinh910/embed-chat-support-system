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
        this.ioHandler();
    }

    private messages = new Subject<any>();
    messages$ = this.messages.asObservable();

    private socketStatus = new Subject<boolean>();
    socketStatus$ = this.socketStatus.asObservable();

    // Service message commands
    sendMessage(message) {
        this.socket.emit('agent says', message);
        this.messages.next(message);
    }

    ioHandler() {
        this.socket = io(this.chatSocketUrl, {
            query: {
                token: this.storageService.getToken()
            }
        });

        this.socket.on('connect', () => this.socketStatus.next(true));

        this.socket.on('disconnect', () => this.socketStatus.next(false));
    }

}
