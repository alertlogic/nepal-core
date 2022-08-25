/**
 * Module to deal with available AIMS Public API endpoints
 */

import { AlValidationSchemaProvider } from '../../common/utility';
import {
    AlLocation,
    AlLocatorService,
} from "../../common/navigation";
import { ServiceClient } from '../types';
import {
    AIMSAccessKey,
    AIMSAccount,
    AIMSAuthenticationTokenInfo,
    AIMSOrganization,
    AIMSRole,
    AIMSSessionDescriptor,
    AIMSTopology,
    AIMSUser,
    AIMSUserDetails,
    AIMSEnrollURI,
} from './types';
import { aimsTypeSchematics } from './aims.schematics';
import { AlXHRAdapter, AlBaseServiceClient } from '../al-xhr-adapter';

@ServiceClient( {
    service_stack: AlLocation.InsightAPI,
    service_name: "aims",
    version: "v1"
} )
export class AlsAIMS
             extends    AlBaseServiceClient
             implements AlValidationSchemaProvider {

    constructor() {
        super();
    }

    /**
      * Create a user
      * POST
      * /aims/v1/:account_id/users?one_time_password=:one_time_password
      * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/users"
      * -d '{ "name": "Bob Dobalina", "email": "admin@company.com", "mobile_phone": "123-555-0123" }'
      */
    async createUser(accountId: string, name: string, email: string, mobilePhone: string) {
        return this.post<AIMSUser>( {
            account_id: accountId,
            path: '/users',
            data: { name, email, mobile_phone: mobilePhone }
        } );
    }

    /**
     * Create a user with details
     * POST
     * /aims/v1/:account_id/users
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/users"
     * -d '{ "name": "Bob Dobalina", "email": "admin@company.com", "phone": "12321312", "mobile_phone": "123-555-0123" }'
     */
    async createUserWithDetails(accountId: string, userDetails:AIMSUserDetails) {
        return this.post<AIMSUserDetails>( {
            account_id: accountId,
            path: '/users',
            data: userDetails
        } );
    }

    /**
     * Update user details
     * POST
     * /aims/v1/:account_id/users/:user_id
     * -d '{"name": "Bob Odenkirk", "email": "bodenkirk@company.com", "mobile_phone": "123-555-0124"}' "https://api.product.dev.alertlogic.com/aims/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23"
     */
    async updateUserDetails(accountId: string, userId: string, data:AIMSUserDetails):Promise<AIMSUser> {
        return this.post( {
            account_id: accountId,
            path: `/users/${userId}`,
            data: data
        } );
    }

    /**
     * Delete a user
     * DELETE
     * /aims/v1/:account_id/users/:user_id
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23"
     */
    async deleteUser(accountId: string, userId: string) {
        return this.delete( {
            account_id: accountId,
            path: `/users/${userId}`,
        } );
    }

    /**
     * Get user details
     * GET
     * /aims/v1/:account_id/users/:user_id
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23"
     */
    async getUserDetailsById(accountId: string, userId: string) {
        return this.get<AIMSUser>( {
            account_id: accountId,
            path: `/users/${userId}`,
            ttl: 2 * 60 * 1000
        } );
    }

    async getUserDetailsByUserId(userId: string) {
        return this.get( {
            path: `/user/${userId}`
        } );
    }

    /**
     * Get user permissions
     * GET
     * /aims/v1/:account_id/users/:user_id/permissions
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/permissions"
     */
    async getUserPermissions(accountId: string, userId: string) {
        return this.get( {
            account_id: accountId,
            path: `/users/${userId}/permissions`,
            ttl: 2 * 60 * 1000
        });
    }

    /**
     * Get Account Details
     * GET
     * /aims/v1/:account_id/account
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/account"
     */
    async getAccountDetails(accountId: string) {
        return this.get({
            account_id: accountId,
            path: '/account',
            ttl: 2 * 60 * 1000
        });
    }

    /**
     * @deprecated use getAccountsByRelationship
     * List managed accounts
     * GET
     * /aims/v1/:account_id/accounts/:relationship
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/accounts/managed"
     */
    async getManagedAccounts(accountId: string, queryParams?):Promise<AIMSAccount[]> {
        return this.getAccountsByRelationship(accountId, 'managed', queryParams );
    }

    /**
     * @deprecated use getAccountIdsByRelationship
     * List managed account IDs
     * GET
     * /aims/v1/:account_id/account_ids/:relationship
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/account_ids/managed"
     */
    async getManagedAccountIds(accountId: string, queryParams?):Promise<string[]> {
        return this.getAccountIdsByRelationship(accountId, 'managed', queryParams );
    }

    /**
     * List account IDs, by relationship can be managing, managed and bills_to
     * GET
     * /aims/v1/:account_id/account_ids/:relationship
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/account_ids/managing"
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/account_ids/managed"
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/account_ids/bills_to"
     */
    async getAccountIdsByRelationship(accountId: string, relationship: string, queryParams?):Promise<string[]> {
        return ( await this.get({
            account_id: accountId,
            path: `/account_ids/${relationship}`,
            params: queryParams,
            ttl: 2 * 60 * 1000
        }) ).account_ids as string[];
    }

    /**
     * List accounts, by relationship can be managing, managed and bills_to
     * GET
     * /aims/v1/:account_id/accounts/:relationship
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/accounts/managing"
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/accounts/managed"
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/accounts/bills_to"
     */
    async getAccountsByRelationship(accountId: string, relationship: string, queryParams?):Promise<AIMSAccount[]> {
        return ( await this.get({
            account_id: accountId,
            path: `/accounts/${relationship}`,
            params: queryParams,
            ttl: 2 * 60 * 1000
        }) ).accounts as AIMSAccount[];
    }

    /**
     *  Retrieve a union of user records corresponding to a managed relationship hierarchy between two accounts.
     *  This is a placeholder for a better implementation based on a relationship topology endpoint from AIMS.0
     *  @deprecated use getAccountsIdsByRelationship in conjunction with getUsersFromAccounts
     */
    async getUsersFromManagedRelationship( leafAccountId:string, terminalAccountId?:string, failOnError:boolean = true ):Promise<AIMSUser[]> {
        let users = await this.getUsers( leafAccountId, { include_role_ids: false, include_user_credential: false } );
        try {
            let managing = await this.getAccountsByRelationship( leafAccountId, "managing" );
            if ( managing.length > 0 ) {
                managing.sort( ( a, b ) => parseInt( b.id, 10 ) - parseInt( a.id, 10 ) );               //  this is gross hackery.  Kevin did not implement this.  Tell no-one of what you've seen!
                let parentUsers = await this.getUsersFromManagedRelationship( managing[0].id, terminalAccountId );
                if ( Array.isArray( parentUsers ) ) {
                    users = users.concat( parentUsers );
                }
            }
        } catch( e ) {
            if ( failOnError ) {
                throw e;
            }
        }
        return users;
    }

    /**
   * Update account MFA requirements
   * POST
   * /aims/v1/:account_id/account
   * -d '{"mfa_required": true}' "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/account"
   */
    async requireMFA(accountId: string, mfaRequired: boolean):Promise<AIMSAccount> {
        return this.post<AIMSAccount>({
            account_id: accountId,
            path: '/account',
            data: { mfa_required: mfaRequired }
        });
    }

    /**
     * Update account session idle expiration
     * POST
     * This updates a single property of an AIMS account record, affecting how long users of that account
     * can be idle before their sessions will be terminated due to inactivity.
     */
    async setAccountIdleThreshold( accountId:string, seconds:number|null ) {
         return this.post( {
            account_id: accountId,
            path: '/account',
            data: {
                idle_session_timeout: seconds
            }
        } );
    }

    /**
     * Authenticate a user's identity
     * POST
     * /aims/v1/authenticate
     * -u username:password "https://api.cloudinsight.alertlogic.com/aims/v1/authenticate"
     */
    async authenticate( user:string, pass:string, mfa?:string ): Promise<AIMSSessionDescriptor> {
        return this.adapter.authenticate( user, pass, mfa, true );
    }

    /**
    * Authenticate a user's identity with an mfa code and session token
     */
    async authenticateWithMFASessionToken(token: string, mfa: string): Promise<AIMSSessionDescriptor> {
        return this.adapter.authenticateWithMFASessionToken(token, mfa, true );
    }

    /**
     * Change a user's password
     * POST
     * /aims/v1/change_password
     * -d '{"email": "admin@company.com", "current_password": "hunter2", "new_password": "Fraudulent$Foes"}' "https://api.cloudinsight.alertlogic.com/aims/v1/change_password"
     */
    async changePassword(email: string, password: string, newPassword: string) {
        return this.post({
            path: '/change_password',
            data: { email, current_password: password, new_password: newPassword }
        });
    }

    /**
     * Obtain Authentication Token Information for a specific access token
     */
    public async getTokenInfo( accessToken:string ):Promise<AIMSAuthenticationTokenInfo> {
        return this.get( {
            service_stack: AlLocation.GlobalAPI,
            path: '/token_info',
            headers: {
                'X-AIMS-Auth-Token': accessToken
            },
            ttl: 10 * 60 * 1000,
            cacheKey: AlLocatorService.resolveURL( AlLocation.GlobalAPI, `/aims/v1/token_info/${accessToken}` )       //  custom cacheKey to avoid cache pollution
        } );
    }

    /**
     * Initiate the password reset process for a user
     * POST
     * /aims/v1/reset_password
     * -d '{"email": "admin@company.com", "return_to": "https://console.alertlogic.net"}' "https://api.cloudinsight.alertlogic.com/aims/v1/reset_password"
     */
    async initiateReset(email: string, returnTo: string) {
        return this.post({
            path: '/reset_password',
            data: { email, return_to: returnTo },
        });
    }

    /**
     * Reset a user's password using a token
     * PUT
     * /aims/v1/reset_password/:token
     * -d '{"password": "hunter2"}' "https://api.cloudinsight.alertlogic.com/aims/v1/reset_password/69EtspCz3c4"
     */
    async resetWithToken(token: string, password: string) {
        return this.put({
            path: `/reset_password/${token}`,
            data: { password },
        });
    }

    /**
     * Create a role
     * POST
     * /aims/v1/:account_id/roles
     * -d '{"name": "Super Mega Power User", "permissions": {"*:own:*:*": "allowed", "aims:own:grant:*":"allowed"}}' "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/roles"
     */
    async createRole(accountId: string, name: string, permissions) {
        return this.post({
            account_id: accountId,
            path: '/roles',
            data: { name, permissions }
        });
    }

    /**
     * Delete a role
     * DELETE
     * /aims/v1/:account_id/roles/:role_id
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/roles/C7C5BE57-F199-4F14-BCB5-43E31CA02842"
     */
    async deleteRole(accountId: string, roleId: string) {
        return this.delete({
            account_id: accountId,
            path: `/roles/${roleId}`
        } );
    }

    /**
     * Grant a role
     * PUT
     * /aims/v1/:account_id/users/:user_id/roles/:role_id
     * "https://api.product.dev.alertlogic.com/aims/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/roles/2A33175D-86EF-44B5-AA39-C9549F6306DF"
     */
    async grantRole(accountId:string, userId:string, roleId:string) {
        return this.put({
            account_id: accountId,
            path: `/users/${userId}/roles/${roleId}`
        });
    }

    /**
     * Revoke a role
     * DELETE
     * /aims/v1/:account_id/users/:user_id/roles/:role_id
     * "https://api.product.dev.alertlogic.com/aims/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/roles/2A33175D-86EF-44B5-AA39-C9549F6306DF"
     */
    async revokeRole(accountId:string, userId:string, roleId:string) {
        return this.delete({
            account_id: accountId,
            path: `/users/${userId}/roles/${roleId}`
        });
    }

    /**
     * Get global role, a role that is shared among accounts.
     * GET
     * /aims/v1/roles/:role_id
     * "https://api.cloudinsight.alertlogic.com/aims/v1/roles/2A33175D-86EF-44B5-AA39-C9549F6306DF"
     */
    async getGlobalRole(roleId: string) {
        return this.get<AIMSRole>({
            path: `/roles/${roleId}`
        });
    }

    /**
     * Get role
     * GET
     * /aims/v1/:account_id/roles/:role_id
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/roles/2A33175D-86EF-44B5-AA39-C9549F6306DF"
     */
    async getAccountRole(accountId: string, roleId: string) {
        return this.get<AIMSRole>({
            account_id: accountId,
            path: `/roles/${roleId}`
        });
    }

    /**
     * Get assigned roles
     * GET
     * /aims/v1/:account_id/users/:user_id/roles
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/roles"
     */
    async getAssignedRoles( accountId:string, userId:string ):Promise<AIMSRole[]> {
        return ( await this.get({
            account_id: accountId,
            path: `/users/${userId}/roles`
        }) ).roles as AIMSRole[];
    }

    /**
     * List global roles, roles that are shared among all accounts.
     * GET
     * /aims/v1/roles
     * "https://api.cloudinsight.alertlogic.com/aims/v1/roles"
     */
    async getGlobalRoles():Promise<AIMSRole[]> {
        return ( await this.get({
            path: '/roles'
        }) ).roles as AIMSRole[];
    }

    /**
     * List roles for an account. Global roles are included in the list.
     * GET
     * /aims/v1/:account_id/roles
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/roles"
     */
    async getAccountRoles(accountId: string):Promise<AIMSRole[]> {
        return ( await this.get({
            account_id: accountId,
            path: '/roles'
        }) ).roles as AIMSRole[];
    }

    /**
     * Update Role Name and Permissions
     * POST
     * /aims/v1/:account_id/roles/:role_id
     * -d '{"name": "Mega Power User", "permissions": {"*:own:*:*": "allowed", "aims:own:grant:*":"allowed"}}' "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/roles/2A33175D-86EF-44B5-AA39-C9549F6306DF"
     */
    async updateRole(accountId: string, name: string, permissions) {
        return this.post({
            account_id: accountId,
            path: '/roles',
            data: { name, permissions }
        });
    }

    /**
     * Update Role Name
     * POST
     * /aims/v1/:account_id/roles/:role_id
     * -d '{"name": "Mega Power User"}' "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/roles/2A33175D-86EF-44B5-AA39-C9549F6306DF"
     */
    async updateRoleName(accountId: string, name: string) {
        return this.post({
            account_id: accountId,
            path: '/roles',
            data: { name }
        });
    }

    /**
     * Update Role Permissions
     * POST
     * /aims/v1/:account_id/roles/:role_id
     * -d '{"permissions": {"*:own:*:*": "allowed", "aims:own:grant:*":"allowed"}}' "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/roles/2A33175D-86EF-44B5-AA39-C9549F6306DF"
     */
    async updateRolePermissions(accountId: string, permissions:any ) {
        return this.post<AIMSRole>({
            account_id: accountId,
            path: '/roles',
            data: { permissions }
        });
    }

    /**
     * Enroll an MFA device for a user
     * POST
     * /aims/v1/user/mfa/enroll
     *  "https://api.cloudinsight.alertlogic.com/aims/v1/user/mfa/enroll" \
     * -H "Content-Type: application/json" \
     * -H "X-Aims-Session-Token: a3e12fwafge1g9" \
     * -d @- << EOF
     * {
     *    "mfa_uri": "otpauth://totp/Alert%20Logic:admin@company.com?secret=GFZSA5CINFJSA4ZTNNZDG5BAKM2EMMZ7&issuer=Alert%20Logic&algorithm=SHA1"
     *    "mfa_codes": ["123456", "456789"]
     * }
     * EOF
     */
    async enrollMFA( uri: string, sessionToken:string, codes:string[] ) {
        return this.post({
            path: '/user/mfa/enroll',
            data: { mfa_uri: uri, mfa_codes: codes },
            headers: {
                'X-AIMS-Session-Token': sessionToken
            }
        });
    }

    /**
     * Enroll an MFA device for a user (when no AIMS token available).
     * POST
     * /aims/v1/user/mfa/enroll
     *  "https://api.cloudinsight.alertlogic.com/aims/v1/user/mfa/enroll" \
     * -H "Content-Type: application/json" \
     * -d @- << EOF
     * {
     *    "mfa_uri": "otpauth://totp/Alert%20Logic:admin@company.com?secret=GFZSA5CINFJSA4ZTNNZDG5BAKM2EMMZ7&issuer=Alert%20Logic&algorithm=SHA1"
     *    "mfa_codes": ["123456", "456789"],
     *    "password" : "password",
     *    "email" : "user@email.com"
     * }
     * EOF
     */
    async enrollMFAWithoutAIMSToken(uri:AIMSEnrollURI, codes:string[], email:string, password:string ) {
        return this.post({
            path: '/user/mfa/enroll',
            data: {
                mfa_uri: uri.toString(),
                email: email,
                password: password,
                mfa_codes: codes
            }
        });
    }

    /**
     * Remove a user's MFA device
     * DELETE
     * /aims/v1/user/mfa/:email
     * "https://api.cloudinsight.alertlogic.com/aims/v1/user/mfa/admin@company.com"
     */
    async deleteMFA(email: string) {
        return this.delete({ path: `/user/mfa/${email}`});
    }

    async getUserDetails(accountId: string, userId: string, queryParams?: {include_role_ids?: boolean, include_user_credential?: boolean}) {
        return this.get<AIMSUser>({
            account_id: accountId,
            path: `/users/${userId}`,
            params: queryParams,
        });
    }

    /**
     * List Users
     * GET
     * /aims/v1/:account_id/users
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/users"
     */
    async getUsers( accountId: string, queryParams?: {include_role_ids?: boolean, include_user_credential?: boolean} ):Promise<AIMSUser[]> {
        return ( await this.get({
            account_id: accountId,
            path: '/users',
            params: queryParams,
        }) ).users as AIMSUser[];
    }

    /**
     * Create Access Key
     * POST
     * /aims/v1/:account_id/users/:user_id/access_keys
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/access_keys"
     * -d '{"label": "api access"}'
     */
    async createAccessKey(accountId: string, userId: string, label: string) {
        return this.post<AIMSAccessKey>({
            account_id: accountId,
            path: `/users/${userId}/access_keys`,
            data: { label }
        });
    }

    /**
     * Update Access Key
     * POST
     * /aims/v1/access_keys/:access_key_id
     * "https://api.cloudinsight.alertlogic.com/aims/v1/access_keys/61fb235617960503"
     * -d '{"label": "api access"}'
     */
    async updateAccessKey(accessKeyId: string, label: string) {
        return this.post<AIMSAccessKey>({
            path: `/access_keys/${accessKeyId}`,
            data: { label }
        });
    }

    /**
     * Get Access Key
     * GET
     * /aims/v1/access_keys/:access_key_id
     * "https://api.cloudinsight.alertlogic.com/aims/v1/access_keys/61fb235617960503"
     */
    async getAccessKey(accessKeyId: string) {
        return this.get<AIMSAccessKey>( {
            path: `/access_keys/${accessKeyId}`
        } );
    }

    /**
     * List Access Keys
     * GET
     * /aims/v1/:account_id/users/:user_id/access_keys?out=:out
     * https://api.cloudinsight.alertlogic.com/aims/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/access_keys?out=full"
     */
    async getAccessKeys(accountId: string, userId: string, ttl: number = 60000) {
        return ( await this.get({
            account_id: accountId,
            ttl: ttl,
            path: `/users/${userId}/access_keys?out=full`
        } ) ).access_keys as AIMSAccessKey[];
    }

    /**
     * Delete Access Key
     * DELETE
     * /aims/v1/:account_id/users/:user_id/access_keys/:access_key_id
     * "https://api.cloudinsight.alertlogic.com/aims/v1/12345678/users/715A4EC0-9833-4D6E-9C03-A537E3F98D23/access_keys/61FB235617960503"
     */
    async deleteAccessKey(accountId: string, userId: string, accessKeyId: string) {
        return this.delete({
            account_id: accountId,
            path: `/users/${userId}/access_keys/${accessKeyId}`
        });
    }

    /**
     * Retrieve linked organization
     */
    async getAccountOrganization( accountId:string ):Promise<AIMSOrganization> {
        return this.get<AIMSOrganization>( {
            account_id: accountId,
            path: '/organization'
        } );
    }

    /**
     * This endpoint render's an accounts related accounts topologically by adding a :relationship field to the account object,
     * which contains an array of accounts that are directly related to it.
     * GET
     * /aims/v1/:account_id/accounts/:relationship/topology
     * https://console.product.dev.alertlogic.com/api/aims/index.html#api-AIMS_Account_Resources-AccountRelationshipExists
     * @param accountId {string}
     * @param relationship {'managed' | 'managing'}
     * @param queryParms {Object}
     */
    async getAccountRelationshipTopology(accountId: string, relationship: 'managed' | 'managing', queryParams?): Promise<AIMSTopology> {
        return ( await this.get({
            account_id: accountId,
            path: `/accounts/${relationship}/topology`,
            params: queryParams
        } ) ).topology as AIMSTopology;
    }

    /**
     * Returns the ids of the accounts to which an account is related.
     * The related accounts that are returned depend oonf the :relationship param.
     * If using a "managed" relationship, this returns all accounts that the current account manages.
     * If using a "managing" relationship, this returns all accounts that managing the current account.
     * @param accountId {string}
     * @param relationship {'managed' | 'managing'}
     * @param addCurrentId {boolean} [addCurrentId=true] true if wants add the current id to the return
     */
    async getAccountsIdsByRelationship(accountId: string, relationship: 'managed' | 'managing', addCurrentId: boolean = true): Promise<string[]> {
        const topology = await this.getAccountRelationshipTopology(accountId, relationship);

        function getIds(accounts: AIMSTopology[]): string[] {
            return accounts.flatMap(a => [a.id, ...getIds(Array.isArray(a[relationship]) ? a[relationship] : [])]);
        }
        const first = addCurrentId ? [accountId] : [];
        return [...first, ...getIds(topology[relationship])];
    }

    /**
     * Returns all users associated with a list of accounts
     * @param accountList {string[]}
     */
    async getUsersFromAccounts(accountList: string[]): Promise<AIMSUser[]> {
        return (await Promise.all(
            accountList.map(account => this.getUsers(account, { include_role_ids: false, include_user_credential: false }))
        )).flat();
    }

    public hasSchema( schemaId:string ) {
        return schemaId in aimsTypeSchematics;
    }

    public async getSchema( schemaId:string ) {
        return aimsTypeSchematics[schemaId];
    }

    public getProviders() {
        return [ this.adapter ];
    }
}