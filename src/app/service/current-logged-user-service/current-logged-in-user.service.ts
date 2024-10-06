import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CurrentLoggedInUserService {
    private payload: any;

    constructor() {

    }

    userNameSplit(token: string | null): void {
        try {
            if (token) {
                const parts = token.split('.');
                if (parts.length !== 3) {
                    throw new Error('Invalid token');
                }
                const payload = JSON.parse(atob(parts[1]));
                this.payload = payload;
            } else {

                console.log('No token found');
            }
        } catch (e) {
            console.error('Failed to parse token', e);
        }
    }

    getPayload() {
        return this.payload
    }

    getUsername(): any {
        if (this.payload?.sub) {
            return this.payload.sub;
        }
    }

    getRole() {
        if (this.payload?.sub) {

            return this.payload ? this.payload.roles.toLowerCase() : '';
        }
    }

}
