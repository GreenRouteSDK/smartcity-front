import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { environment } from '../../../../environments/environment';
import { constants } from '../../common/constants';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { role } from '../../../core/models/role';

import { IdentityUser, TokenInfo } from '../../models/identity-user';

const base_rest_path = environment.backend_sdk + '/security';
const login_url = base_rest_path + '/login';
const logout_url = base_rest_path + '/logout';
const valid_token_url = base_rest_path + '/valid-token';
const refresh_token_url = base_rest_path + '/refresh-token';

@Injectable()
export class LoginService {
  roles: role;
  inRefresh: boolean;
  redirectUrl: string;

  constructor(private http: Http) {}

  //Request to login endpoint
  login(email: string, password: string): Observable<IdentityUser> {
    const headers = new Headers();
    headers.append('Content-Type', constants.contentTypeJson);

    const query = {
      'username': email,
      'password': password
    };

    return this.http.post(login_url, JSON.stringify(query), { headers })
    .map((res: Response) => {
      const identityUser: IdentityUser = res.json();

      if (identityUser) {
        this.saveToken(identityUser);
        return identityUser;
      } else { // This case never happend
        this.deleteToken();
        return null;
      }
    });
    // .catch((error: Response | any) => {
    //   this.deleteToken();
    //   return null;
    // });
  }

  private refreshToken(tokenInfo: TokenInfo) {
    if (!this.inRefresh) {
      this.inRefresh = true;

      const requestOptions: RequestOptions = this.buildRequestOptions(tokenInfo.token);

      this.http.post(refresh_token_url, null, requestOptions).subscribe(
        (res: Response) => {
          const identityUser: IdentityUser = this.getLoggedUser();
          identityUser.tokenInfo = res.json();
          this.saveToken(identityUser);
          this.inRefresh = false;
        },
        (error: any) => {
          console.error('Error at refresh token');
          console.error(error);
          this.inRefresh = false;
        }
      );
    }
  }

  logout(): Observable<boolean> {
    const token: string = this.getToken();

    if (token) {
      const requestOptions: RequestOptions = this.buildRequestOptions(token);
      this.deleteToken(); // We delete token from local storage

      return this.http.delete(logout_url, requestOptions)
        .map((res) => {
          console.log('logout');
          return true;
        });
        // .catch((error) => {
        //   console.error('Error at logout');
        //   console.log(error);
        //   return null;
        // });
    } else {
      return null;
    }
  }

  private saveToken(identityUser: IdentityUser) {
    identityUser.date = new Date();
    localStorage.setItem(constants.tokenInfoName, JSON.stringify(identityUser));
  }

  private deleteToken() {
    localStorage.removeItem(constants.tokenInfoName);
  }

  isLoggedIn(): boolean {
    return this.checkToken();
  }

  private checkToken() {
    const identityUser: IdentityUser = this.getLoggedUser();

    if (identityUser && identityUser.date && identityUser.tokenInfo && identityUser.tokenInfo.time) {
      const renewTime = identityUser.tokenInfo.time / 2;
      const currentDate = new Date();
      const tokenTime = (currentDate.getTime() - new Date(identityUser.date).getTime()) / 1000; // Logged time in seconds

      if (tokenTime > identityUser.tokenInfo.time) {
        return false;
      } else {
        if (tokenTime > renewTime || true) {
          this.refreshToken(identityUser.tokenInfo);
        }
        return true;
      }
    } else {
      return false;
    }
  }

  isUser(): boolean {
       return this.checkRole(role.USER);
  }

  isAdmin(): boolean {
    return this.checkRole(role.ADMIN);
  }

  isSA(): boolean {
    return this.checkRole(role.SA);
  }

  isTransportAdmin(): boolean {
    return this.checkRole(role.TRANSPORT_ADMIN);
  }

  checkRole(roleToCompare: role): boolean {
    if (this.checkToken()) {
      const identityUser: IdentityUser = this.getLoggedUser();
      if (identityUser.roles && identityUser.roles.indexOf(role[roleToCompare])  > -1) {
            return true;
      };
    }
    return false;
  }

  getObservableUser(): Observable<IdentityUser> {
    const tmp: string = localStorage.getItem(constants.tokenInfoName);
    if (tmp) {
      return JSON.parse(tmp);
    } else {
      return null;
    }
  }

  getLoggedUser(): IdentityUser {
    const tmp: string = localStorage.getItem(constants.tokenInfoName);
    if (tmp) {
      return JSON.parse(tmp);
    } else {
      return null;
    }
  }

  getToken(): string {
    const identityUser: IdentityUser = this.getLoggedUser();

    if (identityUser) {
      return identityUser.tokenInfo.token;
    } else {
      return null;
    }
  }

  updateName(name: string) {
    const identityUser: IdentityUser = this.getLoggedUser();
    identityUser.name = name;
    localStorage.setItem(constants.tokenInfoName, JSON.stringify(identityUser));
  }

  private buildRequestOptions(token: string): RequestOptions {
    const headers: Headers = new Headers();
    headers.append(constants.authTokenKey, token);

    const requestOptions: RequestOptions = new RequestOptions();
    requestOptions.headers = headers;

    return requestOptions;
  }

}
