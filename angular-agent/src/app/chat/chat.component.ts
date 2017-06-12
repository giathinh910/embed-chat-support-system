import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ChatService } from "./services/chat.service";
import { StorageService } from "../global/services/storage.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { RoomService } from '../room/services/room.service';
import { SiteService } from '../site/services/site.service';
import * as _ from "lodash";

@Component({
    selector: 'agent-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    providers: [SiteService, RoomService]
})
export class ChatComponent implements OnInit {
    site: any;
    chatForm: FormGroup;
    chatFormErrors = {
        'content': ''
    };
    chatFormValidationMessages = {
        'content': {
            'required': 'Vui lòng nhập nội dung'
        }
    };
    submitted: boolean = false;
    @ViewChild('messagesDiv') private messagesDivER: ElementRef;
    socketStatus: boolean = false;
    rooms: any[];
    currentRoom: any;
    currentMessages: any = [
        // {
        //     user: {
        //         displayName: ''
        //     },
        //     content: ''
        // }
    ];

    constructor(private formBuilder: FormBuilder,
                private storageService: StorageService,
                private activatedRoute: ActivatedRoute,
                private roomService: RoomService,
                private chatService: ChatService,
                private siteService: SiteService) {
    }

    ngOnInit() {
        this.listenIoSubjects();

        this.activatedRoute.params.subscribe(params => {
            let siteId = params.siteId;
            this.chatService.listenIoEvents(siteId);
            this.siteService.getOne(siteId).then(site => {
                this.site = site;
            });
            this.roomService.getRoomsBySiteId(siteId).then(rooms => {
                for (let room of rooms) {
                    room.current = false;
                    room.online = false;
                    room.messages = []
                }
                this.rooms = rooms;
                // switch to first room by default
                if (this.rooms.length)
                    this.switchRoom(0);
                this.chatService.emitRequestInitData();
            })
        });

        // Build form
        this.chatForm = this.formBuilder.group({
            content: ['', Validators.required]
        });

        this.chatForm.valueChanges.subscribe(data => this.onValueChanged(data));

        this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any) {
        if (!this.chatForm) {
            return;
        }
        const form = this.chatForm;
        for (const field in this.chatFormErrors) {
            // clear previous error message (if any)
            this.chatFormErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.chatFormValidationMessages[field];
                for (const key in control.errors) {
                    this.chatFormErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    switchRoom(roomIndex: number) {
        for (let i in this.rooms) {
            this.rooms[i].current = false;
        }
        this.rooms[roomIndex].current = true;
        this.currentRoom = this.rooms[roomIndex];
        this.currentMessages = this.rooms[roomIndex].messages;
    }

    scrollMessagesToBottom(isLast: boolean) {
        if (isLast) {
            let messagesDiv: HTMLElement = this.messagesDivER.nativeElement;
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }

    onSubmit() {
        if (!this.chatForm.valid || this.submitted) {
            return;
        }
        let message = this.chatForm.value;
        message.user = {
            _id: this.storageService.getUserId(),
            email: this.storageService.getUserEmail(),
            displayName: this.storageService.getUserDisplayName(),
        };
        message.room = this.currentRoom._id;
        this.currentMessages.push(message);

        this.submitted = true;
        this.chatService.sendMessage(message);
        this.submitted = false;
        this.chatForm.reset();
    }

    listenIoSubjects() {
        let thisChatComponent = this;

        // when connect / disconnect
        this.chatService.socketStatus$.subscribe(socketStatus => {
            this.socketStatus = socketStatus
        });

        // when initial data comes
        this.chatService.initData$.subscribe(data => {
            let onlineCustomers = data.onlineCustomers;
            for (let onlineCustomerIndex in onlineCustomers) {
                let roomIndex = _.findIndex(this.rooms, function (room) {
                    return room._id === onlineCustomers[onlineCustomerIndex].user.room;
                });

                if (roomIndex > -1)
                    this.rooms[roomIndex].online = true;
            }
        });

        // when message comes
        this.chatService.messages$.subscribe(message => {
            console.log(message);
            let roomIndex = _.findIndex(thisChatComponent.rooms, function (room) {
                return room._id === message.user.room;
            });

            thisChatComponent.rooms[roomIndex].messages.push(message);
        });

        // when a customer come online
        this.chatService.aCustomerComesOnline$.subscribe(customerComesOnline => {
            let roomIndex = _.findIndex(this.rooms, function (room) {
                return room._id === customerComesOnline.room;
            });
            if (roomIndex > -1)
                this.rooms[roomIndex].online = true;
        });

        // when a customer come offline
        this.chatService.aCustomerComesOffline$.subscribe(customerComesOffline => {
            let roomIndex = _.findIndex(this.rooms, function (room) {
                return room._id === customerComesOffline.room;
            });
            if (roomIndex > -1)
                this.rooms[roomIndex].online = false;
        })
    }
}
