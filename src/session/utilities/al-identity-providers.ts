/**
 *  @author Kevin Nielsen <knielsen@alertlogic.com>
 *  @author Robert Parker <robert.parker@alertlogic.com>
 *
 *  @copyright Alert Logic, Inc 2019
 */

import { WebAuth } from 'auth0-js';
import Keycloak, { KeycloakLoginOptions, KeycloakOnLoad } from 'keycloak-js';
import {
    AlBehaviorPromise,
    AlCabinet,
    AlLocation,
    AlLocatorService,
    AlStopwatch,
} from '../../common';
import { AlErrorHandler } from '../../error-handler';
import { AlRuntimeConfiguration, ConfigOption } from '../../configuration';
import { AlDefaultClient } from '../../client';
import { AlConduitClient } from './al-conduit-client';

export class AlIdentityProviders
{
    /**
     *  Keycloak and Auth0 client instances
     */
    protected static keycloak:Keycloak = undefined;
    protected static auth0:WebAuth = undefined;
    protected static cachedA0UserInfo:{[accessKey:string]:any};
    protected storage = AlCabinet.persistent("alnav");
    protected allIsLost = false;

    constructor() {
    }

    public static inAuth0Workflow( url:string ):boolean {
        if ( ! url ) {
            return false;
        }
        if ( ! /state=([a-zA-Z0-9\-_]+)/.test( url ) ) {    //  this parameter must always be present
            return false;
        }
        if ( /iss=([^&]+)/.test( url ) ) {                  //  this parameter suggests we're in a keycloak redirection flow
            return false;
        }
        return true;
    }

    /**
     * This method initializes IdP clients using a heuristic mechanism differentiating auth0 from keycloak.
     * This allows those clients to initiate and/or respond to redirection based OIDC authentication before the application
     * itself is bootstrapped and the angular router assumes control of the URL.
     */

    public async warmup() {
        if ( AlIdentityProviders.inAuth0Workflow(window?.location?.href) ) {
            try {
                AlErrorHandler.log( "IdP Warmup: initializing auth0" );
                let authenticator = await this.getAuth0Authenticator();
                let config = this.getAuth0Config( { usePostMessage: true, prompt: 'none' } );
                let accessToken = await this.getAuth0SessionToken( authenticator, config, 5000 );
                if ( accessToken ) {
                    AlErrorHandler.log("IdP Warmup: procured auth0 access token" );
                    return false;
                } else {
                    AlErrorHandler.log("IdP Warmup: auth0 did not yield an access token" );
                }
            } catch( e ) {
                console.error( e );
            }
            return false;       //  HALT
        } else {
            await this.getKeycloak();
        }
        return true;            //  Please, continue
    }

    /**
     * Retrieve a keycloak authentication interface.
     */
    public async getKeycloak():Promise<Keycloak> {
        if ( ! AlIdentityProviders.keycloak ) {
            const fortraPlatformUri = AlLocatorService.resolveURL( AlLocation.FortraPlatform, '/idp' );
            AlIdentityProviders.keycloak = new Keycloak( {
                url: fortraPlatformUri,
                realm: 'products',
                clientId: 'alertlogic-aims-public',
            } );
            if ( AlRuntimeConfiguration.getOption( ConfigOption.FortraChildApplication, false ) ) {
                await AlIdentityProviders.keycloak.init( { enableLogging: true } );     //  prevent redirections when running as an embedded application
            } else {
                await this.innerGetKeyCloak( AlIdentityProviders.keycloak );            //  allows redirection to check for session existence
            }
        }
        return AlIdentityProviders.keycloak;
    }

    /**
     * Retrieve a reference to the Auth0 web auth instance.  This code is excluded from unit testing.
     */
    /* istanbul ignore next */
    public getAuth0Authenticator():WebAuth {
        if ( AlIdentityProviders.auth0 === undefined ) {
            /* Because Auth0 persists itself as a global, we will need to cast it from <any>window.auth.  Fun stuff :/ */
            let w = <any>window;
            if ( ! w.auth0 ) {
                console.warn( "Could not find the auth0 global object; is Auth0 installed?" );
                AlIdentityProviders.auth0 = null;
                return null;
            }
            let authenticator = <WebAuth>new w.auth0.WebAuth( this.getAuth0Config() );
            if ( ! authenticator.hasOwnProperty("client" ) ) {
                //  Stop for this error, bad build?
                throw new Error("auth0.WebAuth instance does not have a client property; wrong version perhaps?" );
            }
            AlIdentityProviders.auth0 = authenticator;
        }
        return AlIdentityProviders.auth0;
    }

    /**
     * Uses a race to make sure that auth0 session detection doesn't time out -- since a misconfigured client can cause the
     * promise to hang indefinitely.
     */
    public async getAuth0SessionToken( authenticator:WebAuth, config:any, timeout:number = 5000 ):Promise<string> {
      return Promise.race( [ AlStopwatch.promise( timeout ),
                             new Promise<string>( ( resolve, reject ) => {
                               authenticator.checkSession( config, ( error, authResult ) => {
                                   if ( error || ! authResult || ! authResult.accessToken ) {
                                       console.log( "Raw Auth0 response: ", error, authResult );
                                       reject("auth0's checkSession method failed with an error" );
                                   } else {
                                       resolve( authResult.accessToken );
                                   }
                               } );
                           } ) ] )
                      .then( ( accessToken:string|any ) => {
                          if ( accessToken && typeof( accessToken ) === 'string' ) {
                              return accessToken;
                          }
                          return Promise.reject("checkSession returned false or could not complete execution before timeout." );
                      } );
    }

    /**
     * Calculates the correct auth0 configuration to use.
     */
    public getAuth0Config( merge:any = {} ):any {
        let w = <any>window;
        let auth0Node = AlLocatorService.getNode( AlLocation.Auth0 );
        if ( ! auth0Node || ! auth0Node.data || ! auth0Node.data.hasOwnProperty( 'clientID' ) ) {
            throw new Error("Service matrix does not reflect an auth0 node; check your app configuration." );
        }
        return Object.assign(   {
                                    domain:         auth0Node.uri,
                                    clientID:       auth0Node.data.clientID,
                                    responseType:   'token id_token',
                                    audience:       'https://alertlogic.com/',
                                    scope:          'openid user_metadata',
                                    prompt:         true,
                                    redirectUri:    w.location.origin
                                },
                                merge );
    }

    /**
     * Uses a race to make sure that keycloak initialization doesn't time out -- since a misconfigured client can cause the
     * promise to hang indefinitely.
     */
    protected async innerGetKeyCloak( cloak:Keycloak, timeout:number = 5000 ):Promise<void> {
        console.error( new Error("Getting keycloak!" ), window.location.href );
        return Promise.race( [ AlStopwatch.promise( timeout ),
                               new Promise<void>( async ( resolve, reject ) => {
                                    let cloakPhase = this.storage.get("cloakInitPhase", 0 );
                                    let onLoad:KeycloakOnLoad|undefined = cloakPhase === 0 ? "check-sso" : undefined;
                                    const baseLocation = window.location.origin + ( window.location.pathname === '/' ? '' : window.location.pathname );     //  fix double slash but support apps in subdirectories
                                    let silentCheckSsoRedirectUri = cloakPhase === 0 ? `${baseLocation}/sso-check.html` : undefined;
                                    this.storage.set("cloakInitPhase", cloakPhase + 1, 10 ).synchronize();
                                    if ( cloakPhase > 5 ) {
                                        this.allIsLost = true;
                                        AlErrorHandler.log("Refusing to initialize keycloak after too many redirect cycles" );
                                        resolve();
                                    } else {
                                        AlErrorHandler.log(`Initializing cloak in phase [${cloakPhase}]: ${onLoad}`);
                                        let initResult = await cloak.init( {
                                                                        onLoad,
                                                                        silentCheckSsoRedirectUri,
                                                                        enableLogging: true,
                                                                        checkLoginIframe: true,
                                                                        checkLoginIframeInterval: 30,
                                                                        pkceMethod: 'S256',
                                                                        responseMode: "query",
                                                                        messageReceiveTimeout: 5000
                                                                    } );
                                        if ( ! initResult && cloakPhase < 2 ) {
                                            cloak.login( { prompt: 'none', redirectUri: window.location.href } );
                                        } else {
                                            resolve();
                                        }
                                    }
                               } ) ] );
    }


    protected getAuth0UserInfo = ( authenticator:WebAuth, userAccessToken:string, callback:(error:any, userInfo:any)=>void ) => {
        if ( AlIdentityProviders.cachedA0UserInfo.hasOwnProperty( userAccessToken ) ) {
            callback( null, AlIdentityProviders.cachedA0UserInfo[userAccessToken] );
            return;
        }

        authenticator.client.userInfo( userAccessToken, ( userInfoError, userIdentityInfo ) => {
            if ( ! userInfoError && userIdentityInfo ) {
                AlIdentityProviders.cachedA0UserInfo[userAccessToken] = userIdentityInfo;        //  cache
            }
            callback( userInfoError, userIdentityInfo );
        } );
    }

    /**
     *  Extracts necessary data from the response to auth0's getUserInfo endpoint
     */
    protected extractUserInfo = ( identityData:any ) => {
        let config = this.getAuth0Config();
        let auth0Node = AlLocatorService.getNode( AlLocation.Auth0 );
        if ( ! auth0Node || ! auth0Node.data || ! auth0Node.data.hasOwnProperty( "clientID" ) ) {
            throw new Error("Configuration's service list does not include an entry for auth0 with a 'clientID' property!; check your configuration." );
        }
        let domainIdInfo    =   "";

        if ( identityData.hasOwnProperty( config.audience ) ) {
            domainIdInfo = identityData[config.audience].sub;
        } else {
            throw new Error(`Unexpected identity data received from auth0; no audience '${config.audience}' found.` );
        }

        let userInfo = domainIdInfo.split(":");
        if ( userInfo.length !== 2 ) {
            throw new Error(`Unexpected identity data received from auth0; audience '${config.audience}' contains unexpected content '${domainIdInfo}'.` );
        }

        let accountId       =   userInfo[0];
        let userId          =   userInfo[1];
        if ( ! accountId || ! userId ) {
            throw new Error(`Unexpected identity data received from auth0; audience '${config.audience}' contains empty account or user in '${domainIdInfo}'.` );
        }
        return {
            "accountId": accountId,
            "userId": userId
        };
    }

}
