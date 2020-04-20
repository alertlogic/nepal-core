import { AlChangeStamp } from '../../types/index';

export interface AIMSAuthentication {
  user: AIMSUser;
  account: AIMSAccount;
  token: string;
  token_expiration: number;
}

export interface AIMSUser {
  account_id?: string;
  id?: string;
  name: string;
  email: string;
  active?: boolean;
  locked?: boolean;
  version?: number;
  created: AlChangeStamp;
  modified: AlChangeStamp;
  linked_users: any[];
}

export interface AIMSAccount {
  id?: string;
  name: string;
  active: boolean;
  version?: number;
  accessible_locations: string[];
  default_location: string;
  mfa_required?: boolean;
  created: AlChangeStamp;
  modified: AlChangeStamp;
}

export interface AIMSSessionDescriptor {
  authentication: AIMSAuthentication;
  acting?: AIMSAccount;
  boundLocationId?: string;
}


export interface AIMSAuthenticationTokenInfo extends AIMSAuthentication {
    entity_id?: string;
    entity_type?: string;
    requester_id?: string;
    roles?: AIMSRole[];
}

export interface AIMSRole {
    id: string;
    account_id: string;
    name: string;
    permissions: {
        [key: string]: string;
    };
    legacy_permissions: any[];
    version: number;
    global?: boolean;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
}

export interface AIMSAccessKey {
    access_key_id: string;
    user_id: string;
    account_id: string;
    label: string;
    created?: AlChangeStamp;
    modified?: AlChangeStamp;
    secret_key?: string;
}

export interface AIMSOrganization {
    account_id: string;
    location_id: string;
    id: string;
    version: number;
    created: AlChangeStamp;
    modified: AlChangeStamp;
    url: string;
}

export interface AIMSTopology extends AIMSAccount {
    id: string;
    managing?: AIMSTopology[];
    managed?: AIMSTopology[];
}
