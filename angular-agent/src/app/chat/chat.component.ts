import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ChatService } from "./services/chat.service";
import { StorageService } from "../global/services/storage.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { SiteService } from '../site/services/site.service';
import { CustomerService } from '../customer/services/customer.service';
import * as _ from "lodash";

@Component({
    selector: 'agent-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    providers: [SiteService, CustomerService]
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
    messages: any[];
    @ViewChild('messagesDiv') private messagesDivER: ElementRef;
    socketStatus: boolean = false;
    customers: any[];

    constructor(private chatService: ChatService,
                private siteService: SiteService,
                private customerService: CustomerService,
                private formBuilder: FormBuilder,
                private storageService: StorageService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.listenIoSubjects();

        this.activatedRoute.params.subscribe(params => {
            let siteId = params.siteId;
            this.chatService.listenIoEvents(siteId);
            this.siteService.getOne(siteId).then(site => {
                this.site = site;
            });
            this.customerService.getCustomersBySiteId(siteId).then(customers => {
                for (let customer of customers) {
                    customer.online = false;
                }
                this.customers = customers;
                this.chatService.emitRequestInitData();
            })
        });

        this.messages = [
            {
                createdBy: {
                    displayName: 'Agent 1'
                },
                content: 'Hi customer, how can I help you?'
            },
            {
                createdBy: {
                    displayName: 'Thinh Bui'
                },
                content: 'Hi cloz'
            },
            {
                createdBy: {
                    displayName: 'Agent 1'
                },
                content: 'Ba, fuck off'
            }
        ];

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
        message.createdBy = {
            _id: this.storageService.getUserId(),
            email: this.storageService.getUserEmail(),
            displayName: this.storageService.getUserDisplayName()
        };
        this.messages.push(message);
        this.submitted = true;
        this.chatService.sendMessage(message);
        this.chatForm.reset();
    }

    listenIoSubjects() {
        this.chatService.socketStatus$.subscribe(socketStatus => {
            this.socketStatus = socketStatus
        });

        this.chatService.messages$.subscribe(message => {
            this.submitted = false;
        });

        // fetch online customers on init
        this.chatService.onlineCustomers$.subscribe(data => {
            let onlineCustomers = data.onlineCustomers;
            for (let onlineCustomerIndex in onlineCustomers) {
                let customerIndex = _.findIndex(this.customers, function (customer) {
                    return customer._id === onlineCustomers[onlineCustomerIndex].user._id;
                });
                if (customerIndex > -1)
                    this.customers[customerIndex].online = true;
            }
        });

        // fetch a customer comes online
        this.chatService.aCustomerComesOnline$.subscribe(customerComesOnline => {
            let customerIndex = _.findIndex(this.customers, function (customer) {
                return customer._id === customerComesOnline._id;
            });
            if (customerIndex > -1)
                this.customers[customerIndex].online = true;
        });

        // fetch a customer comes offline
        this.chatService.aCustomerComesOffline$.subscribe(customerComesOffline => {
            let customerIndex = _.findIndex(this.customers, function (customer) {
                return customer._id === customerComesOffline._id;
            });
            if (customerIndex > -1)
                this.customers[customerIndex].online = false;
        })
    }
}
