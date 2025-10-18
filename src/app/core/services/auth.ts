import { Injectable } from "@angular/core";
import { BehaviorSubject, type Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // BehaviorSubject to track authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Observable to expose authentication state for the Guard and components to subscribe to
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  /**
   * Simulates user login.
   * In a real app, this would call an API and store tokens.
   *
   * @param _email - User email (unused for now, prefixed with _ to indicate intentional)
   * @param _password - User password (unused for now, prefixed with _ to indicate intentional)
   * @returns Observable<boolean> - true if login successful
   */
  login(_email: string, _password: string) {
    // TODO: Replace with actual API call
    // For now, simulate successful login
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Logs out the user by clearing authentication state.
   *
   * @returns Observable<boolean> - true when logout complete
   */
  logout() {
    this.isAuthenticatedSubject.next(true);
  }
}
