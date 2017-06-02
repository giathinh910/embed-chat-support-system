import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ChatService } from "../../services/chat.service";
import { StorageService } from "../../services/storage.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
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

    constructor(private chatService: ChatService,
                private formBuilder: FormBuilder,
                private storageService: StorageService,
                private router: Router) {
    }

    ngOnInit() {
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

        this.chatSocketListener();
    }

    scrollMessagesToBottom(isLast: boolean) {
        if (isLast) {
            let messagesDiv: HTMLElement = this.messagesDivER.nativeElement;
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
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

    chatSocketListener() {
        this.chatService.messages$.subscribe(message => {
            console.log(message);
            this.submitted = false;
        });
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

}
