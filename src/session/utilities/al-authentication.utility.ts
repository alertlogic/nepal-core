import { AlDefaultClient } from '../../client';
import { AlSession } from '../al-session';
import { AIMSSessionDescriptor } from '../../aims-client/types';
import { AlRuntimeConfiguration, ConfigOption } from '../../configuration';
import { AlConduitClient } from './al-conduit-client';
import { getJsonPath } from '../../common/utility';
import { AxiosResponse } from 'axios';

/**
 * Each of these is a possible outcome of an authentication attempt.
 */
export enum AlAuthenticationResult {
    Unauthenticated         = 'unauthenticated',
    Authenticated           = 'authenticated',
    AccountLocked           = 'account_locked',
    AccountUnavailable      = 'account_unavailable',
    PasswordResetRequired   = 'password_expired',
    MFAEnrollmentRequired   = 'mfa_enrollment_required',
    MFAVerificationRequired = 'mfa_verification_required',
    TOSAcceptanceRequired   = 'eula_acceptance_required',
    InvalidCredentials      = 'failed'
}

export interface AlAuthenticationState {
    /**
     * The result of an authentication attempt.  Please don't access this directly; use AlAuthenticationUtility's
     * `getResult()` method to be assured of the correct value.
     */
    result?:AlAuthenticationResult;

    /**
     * MFA and TOS authentication criteria will both provide the user with a temporary "session token" (passed to AIMS as an
     * X-AIMS-Session-Token header.
     */
    sessionToken?:string;

    /**
     * Password reset requires a username parameter
     */
    userName?:string;

    /**
     * TOS authentication criteria will provide a URL where the current terms of service can be retrieved.
     */
    termsOfServiceURL?:string;
}

export class AlAuthenticationUtility {

    public state:AlAuthenticationState = {
        result: AlAuthenticationResult.Unauthenticated
    };
    public conduit = new AlConduitClient();

    constructor( state?:AlAuthenticationState ) {
        if ( state ) {
            this.state = Object.assign( this.state, state );
        }
        this.conduit.start();
    }

    /**
     * Primary authentication method -- attempts to authenticate using a username and password.
     */
    public async authenticate( userName:string, passPhrase:string ):Promise<AlAuthenticationResult> {
        let useGestalt = AlRuntimeConfiguration.getOption( ConfigOption.GestaltAuthenticate, false );
        if ( useGestalt ) {
            try {
                let session = await AlDefaultClient.authenticateViaGestalt( userName, passPhrase, true );
                return await this.finalizeSession( session );
            } catch( e ) {
                if ( this.handleAuthenticationFailure( e ) ) {
                    return this.state.result;
                }
            }
        }

        try {
            let session = await AlDefaultClient.authenticate( userName, passPhrase, undefined, true );
            return await this.finalizeSession( session );
        } catch( e ) {
            if ( this.handleAuthenticationFailure( e ) ) {
                return this.state.result;
            }
        }

        this.state.result = AlAuthenticationResult.InvalidCredentials;
        return this.state.result;
    }

    /**
     * Performs authentication using a session token (which must be separately populated into `this.state.sessionToken`) and
     * an MFA verification code.
     */
    public async validateMfaCode( verificationCode:string ):Promise<AlAuthenticationResult> {
        let useGestalt = AlRuntimeConfiguration.getOption( ConfigOption.GestaltAuthenticate, false );
        if ( useGestalt ) {
            try {
                let session = await AlDefaultClient.authenticateWithMFAViaGestalt( this.getSessionToken(), verificationCode );
                return await this.finalizeSession( session );
            } catch ( e ) {
                if ( this.handleAuthenticationFailure( e ) ) {
                    return this.state.result;
                }
            }
        }

        try {
            let session = await AlDefaultClient.authenticateWithMFASessionToken( this.getSessionToken(), verificationCode, true );
            return await this.finalizeSession( session );
        } catch( e ) {
            if ( this.handleAuthenticationFailure( e ) ) {
                return this.state.result;
            }
        }
        this.state.result = AlAuthenticationResult.InvalidCredentials;
        return this.state.result;
    }

    /**
     * Performs authentication using a session token (which must be separately populated into `this.state.sessionToken`).
     */
    public async acceptTermsOfService():Promise<AlAuthenticationResult> {
        let useGestalt = AlRuntimeConfiguration.getOption( ConfigOption.GestaltAuthenticate, false );
        if ( useGestalt ) {
            try {
                let session = await AlDefaultClient.acceptTermsOfServiceViaGestalt( this.getSessionToken() );
                return await this.finalizeSession( session );
            } catch ( e ) {
                if ( this.handleAuthenticationFailure( e ) ) {
                    return this.state.result;
                }
            }
        }

        try {
            let session = await AlDefaultClient.acceptTermsOfService( this.getSessionToken(), true );
            return await this.finalizeSession( session );
        } catch( e ) {
            if ( this.handleAuthenticationFailure( e ) ) {
                return this.state.result;
            }
        }
        return this.state.result;
    }

    /**
     * Retrieves the last authentication result, if any; defaults to `AlAuthenticationResult.Unauthenticated`.
     */
    public getResult():AlAuthenticationResult {
        return this.state.result || AlAuthenticationResult.Unauthenticated;
    }

    /**
     * Retrieves the session token provided in response to the last authentication attempt, if any.
     */
    public getSessionToken():string {
        if ( ! this.state.sessionToken ) {
            throw new Error("Invalid usage: no session token is available." );
        }
        return this.state.sessionToken;
    }

    /**
     * Retrieves the TOS URL provided in response to the last authentication attempt, if any.
     */
    public getTermsOfServiceURL():string {
        if ( ! this.state.termsOfServiceURL ) {
            throw new Error("Invalid usage: no terms of service URL is available." );
        }
        return this.state.termsOfServiceURL;
    }

    /**
     * Given a session descriptor, persists that session to AlSession and conduit and then sets the authentication
     * result to `Authenticated`.
     */
    protected async finalizeSession( session:AIMSSessionDescriptor ) {
        await AlSession.setAuthentication( session );
        await this.conduit.setSession( session );
        this.state.result = AlAuthenticationResult.Authenticated;
        return this.getResult();
    }

    protected handleAuthenticationFailure( error:Error|any ):boolean {

        if ( AlDefaultClient.isResponse( error ) ) {
            if ( this.requiresMfaCode( error ) ) {
                this.state.result = AlAuthenticationResult.MFAVerificationRequired;
                this.state.sessionToken = error.headers['x-aims-session-token'];
                return true;
            } else if ( this.requiresMfaEnrollment( error ) ) {
                this.state.result = AlAuthenticationResult.MFAVerificationRequired;
                this.state.sessionToken = error.headers['x-aims-session-token'];
                return true;
            } else if ( this.requiresPasswordReset( error ) ) {
                this.state.result = AlAuthenticationResult.PasswordResetRequired;
                return true;
            } else if ( this.requiresTOSAcceptance( error ) ) {
                this.state.result = AlAuthenticationResult.TOSAcceptanceRequired;
                this.state.termsOfServiceURL = getJsonPath<string>( error, 'data.tos_url', null );
            } else if( error.status === 400) {
                this.state.result = AlAuthenticationResult.AccountLocked;
                return true;
            } else if ( error.status === 401 ) {
                this.state.result = AlAuthenticationResult.InvalidCredentials;
                return true;
            } else if ( error.status === 403 ) {
                this.state.result = AlAuthenticationResult.AccountUnavailable;
                return true;
            }
            /**
             * All non-400/401 errors, include 5xx, fall through and return false
             */
        }
        return false;
    }

    protected requiresMfaCode( response:AxiosResponse<any> ):boolean {
        return response.status === 401
            && typeof( response.data ) === 'object'
            && response.data !== null
            && 'error' in response.data
            && response.data.error === 'mfa_code_required';
    }

    protected requiresMfaEnrollment( response:AxiosResponse<any> ):boolean {
        return response.status === 401
            && typeof( response.data ) === 'object'
            && response.data !== null
            && 'error' in response.data
            && response.data.error === 'mfa_enrollment_required';
    }

    protected requiresPasswordReset( response:AxiosResponse<any> ):boolean {
        return response.status === 400
            && typeof( response.data ) === 'object'
            && response.data !== null
            && 'error' in response.data
            && response.data.error === 'password_expired';
    }

    protected requiresTOSAcceptance( response:AxiosResponse<any> ):boolean {
        return response.status === 401
            && typeof( response.data ) === 'object'
            && response.data !== null
            && 'error' in response.data
            && response.data.error === 'accept_tos_required';
    }
}
