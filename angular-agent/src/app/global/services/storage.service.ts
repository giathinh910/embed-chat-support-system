import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
    private storageKeys: any = {
        token: 'token',
        userId: 'userId',
        userUsername: 'userUsername',
        userEmail: 'userEmail',
        userDisplayName: 'userDisplayName',
    };

    constructor() {
        //
    }

    getStorageKeys() {
        return this.storageKeys;
    }

    // Token
    setToken(token) {
        localStorage.setItem(this.storageKeys.token, token);
    }

    getToken() {
        return localStorage.getItem(this.storageKeys.token);
    }

    // User ID
    setUserId(id) {
        localStorage.setItem(this.storageKeys.userId, id);
    }

    getUserId() {
        return localStorage.getItem(this.storageKeys.userId);
    }

    // User Email
    setUserEmail(email) {
        localStorage.setItem(this.storageKeys.userEmail, email);
    }

    getUserEmail() {
        return localStorage.getItem(this.storageKeys.userEmail);
    }

    // User Display Name
    setUserDisplayName(displayName) {
        localStorage.setItem(this.storageKeys.userDisplayName, displayName);
    }

    getUserDisplayName() {
        return localStorage.getItem(this.storageKeys.userDisplayName);
    }

    // Mass update
    setUser(user: any) {
        if (user.token) {
            this.setToken(user.token);
        }
        this.setUserId(user._id);
        this.setUserEmail(user.email);
        this.setUserDisplayName(user.displayName);
    }

    // Clear
    clear() {
        localStorage.clear();
    }

}
