import { AlHeraldAccountSubscriptionPayloadV2 } from "../../herald";
import { AlAuditObject } from './auditObject';
import { AlNotificationPolicy } from './notificationPolicy';
/**
 * Subscription definition
 */
export interface Subscription {
    readonly id?: string;
    readonly created?: AlAuditObject;
    subscription: AlHeraldAccountSubscriptionPayloadV2;
    notification_policy: AlNotificationPolicyId | AlNotificationPolicy | null;
}

export interface AlNotificationPolicyId {
    id: string;
}

export interface AssetFilter {
    type: string;
    name: string;
    key?: string;
    deployment_id?: string;
}
