import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { StorageService } from "../../global/services/storage.service";
import { Router } from "@angular/router";
import { JwtHelper } from "angular2-jwt";

@Component({
    selector: 'agent-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loginFormErrors = {
        'email': '',
        'password': '',
        'invalid': ''
    };
    loginFormValidationMessages = {
        'email': {
            'required': 'Vui lòng nhập email',
            'pattern': 'Email phải có định dạng email@example.com'
        },
        'password': {
            'required': 'Vui lòng nhập mật khẩu'
        }
    };
    submitted: boolean = false;
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private authService: AuthService,
                private formBuilder: FormBuilder,
                private csService: StorageService,
                private router: Router) {
    }

    ngOnInit() {
        if (this.authService.loggedIn()) {
            this.router.navigateByUrl('/');
        }

        // Build form
        this.loginForm = this.formBuilder.group({
            email: ['giathinh910@gmail.com', [
                Validators.required,
                Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            ]],
            password: ['121212', [Validators.required]]
        });

        this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));

        this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any) {
        if (!this.loginForm) {
            return;
        }
        const form = this.loginForm;
        for (const field in this.loginFormErrors) {
            // clear previous error message (if any)
            this.loginFormErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.loginFormValidationMessages[field];
                for (const key in control.errors) {
                    this.loginFormErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    onSubmit() {
        if (!this.loginForm.valid || this.submitted) {
            return;
        }
        this.submitted = true;
        this.authService.login(this.loginForm.value).then(res => {
            this.submitted = false;
            if (!res.error) {
                this.csService.setUser(res);
                this.router.navigateByUrl('/');
            } else {
                console.log(res.error);
                this.loginFormErrors.invalid = res.error;
            }
        });
    }

}
