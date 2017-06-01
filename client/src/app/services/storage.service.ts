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
        sessionStorage.setItem(this.storageKeys.token, token);
    }

    getToken() {
        return sessionStorage.getItem(this.storageKeys.token);
    }

    // User ID
    setUserId(id) {
        sessionStorage.setItem(this.storageKeys.userId, id);
    }

    getUserId() {
        return sessionStorage.getItem(this.storageKeys.userId);
    }

    // Username
    setUsername(username) {
        sessionStorage.setItem(this.storageKeys.userUsername, username);
    }

    getUsername() {
        return sessionStorage.getItem(this.storageKeys.userUsername);
    }

    // User Email
    setUserEmail(email) {
        sessionStorage.setItem(this.storageKeys.userEmail, email);
    }

    getUserEmail() {
        return sessionStorage.getItem(this.storageKeys.userEmail);
    }

    // User Display Name
    setUserDisplayName(displayName) {
        sessionStorage.setItem(this.storageKeys.userDisplayName, displayName);
    }

    getUserDisplayName() {
        return sessionStorage.getItem(this.storageKeys.userDisplayName);
    }

    // Mass update
    setUser(user: any) {
        if (user.token) {
            this.setToken(user.token);
        }
        this.setUserId(user.id);
        this.setUsername(user.username);
        this.setUserEmail(user.email);
        this.setUserDisplayName(user.display_name);
    }

    // Clear
    clear() {
        sessionStorage.clear();
    }

}
