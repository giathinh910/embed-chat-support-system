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

    constructor(storageService: StorageService) {
        this.socket = io(this.chatSocketUrl, {
            query: {
                token: storageService.getToken()
            }
        });
    }

    // Observable string sources
    private messages = new Subject<any>();

    // Observable string streams
    messages$ = this.messages.asObservable();

    // Service message commands
    sendMessage(message) {
        this.socket.emit('user says', message);
        this.messages.next(message);
    }

}
