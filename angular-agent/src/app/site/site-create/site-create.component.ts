import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SiteService } from '../services/site.service';
import { Router } from '@angular/router';

@Component({
    selector: 'agent-site-create',
    templateUrl: './site-create.component.html',
    styleUrls: ['./site-create.component.scss']
})
export class SiteCreateComponent implements OnInit {
    siteCreateForm: FormGroup;

    siteCreateFormErrors = {
        'domain': '',
        'displayName': ''
    };
    siteCreateFormValidationMessages = {
        'domain': {
            'required': 'Please enter website domain'
        },
        'displayName': {
            'required': 'Please enter a display name'
        }
    };

    submitted: boolean = false;

    constructor(private formBuilder: FormBuilder,
                private siteService: SiteService,
                private router: Router) {
    }

    ngOnInit() {
        // Build form
        this.siteCreateForm = this.formBuilder.group({
            domain: ['', Validators.required],
            displayName: ['', Validators.required]
        });

        this.siteCreateForm.valueChanges.subscribe(data => this.onValueChanged(data));

        this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any) {
        if (!this.siteCreateForm) {
            return;
        }
        const form = this.siteCreateForm;
        for (const field in this.siteCreateFormErrors) {
            // clear previous error message (if any)
            this.siteCreateFormErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.siteCreateFormValidationMessages[field];
                for (const key in control.errors) {
                    this.siteCreateFormErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    onSubmit() {
        if (!this.siteCreateForm.valid || this.submitted) {
            return;
        }
        this.submitted = true;
        this.siteService.createOne(this.siteCreateForm.value).then(res => {
            this.submitted = false;
            if (!res.error) {
                this.router.navigate(['sites', res._id]);
            } else
                console.log(res.error);
        });
    }

}
