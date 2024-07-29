/**
 *  AlLocatorService is responsible for abstracting the locations of a network of interrelated sites
 *  in different environments, regions/data residency zones, and data centers.  It is not meant to be
 *  used directly, but by a core library that exposes cross-application URL resolution in a more
 *  application-friendly way.
 *
 *  Author: Kevin Nielsen <knielsen@alertlogic.com>
 *  Copyright 2019 Alert Logic, Inc.
 */

/**
 * @public
 *
 * AlLocationContext defines the context in which a specific location or set of locations may exist.
 *     - environment - development, integration, production?
 *     - residency - US or EMEA (or default)?
 *     - insightLocationId - insight-us-virginia, insight-eu-ireland, defender-us-ashburn, defender-us-denver, defender-uk-newport
 *     - accessible - a list of accessible insight location IDs
 */
export interface AlLocationContext {
    environment?:string;
    residency?:string;
    insightLocationId?:string;
    path?:string;
    accessible?:string[];
}

/**
 * @public
 *
 * AlLocationType is an enumeration of different location types, each corresponding to a specific application.
 * Each type is presumed to have a single unique instance inside a given environment and residency.
 */
/* tslint:disable:variable-name */
export class AlLocation
{
    /**
     * API Stacks.  A note for "MDR" APIs: please do not create new locations
     * for each individual API.  Instead, please use AlLocation.MDRAPI: this will use
     * a generic MDR base URL and inject the service name into the target domain instead of its
     * path, as with the IWS services.
     */
    public static GlobalAPI         = "global:api";
    public static InsightAPI        = "insight:api";
    public static EndpointsAPI      = "endpoints:api";
    public static GestaltAPI        = "gestalt:api";
    public static AETunerAPI        = "aetuner:api";
    public static IntegrationsAPI   = "integrations:api";
    public static ResponderAPI      = "responder:api";
    public static ResponderWS       = "responder:ws";
    public static DistributorAPI    = "distributor:api";
    public static MDRAPI            = "mdr:api";
    public static YARDAPI           = "yard:api";
    /* Read above: no new locations for *.mdr.alertlogic.com targets. */

    /**
     * UI Nodes
     */
    public static LegacyUI          = "cd14:ui";
    public static EmbeddedLegacyUI  = "cd14:embedded";
    public static OverviewUI        = "cd17:overview";          //  deprecated by 1console
    public static IntelligenceUI    = "cd17:intelligence";      //  deprecated by 1console
    public static ConfigurationUI   = "cd17:config";
    public static RemediationsUI    = "cd17:remediations";      //  deprecated by 1console
    public static IncidentsUI       = "cd17:incidents";         //  deprecated by 1console
    public static AccountsUI        = "cd17:accounts";          //  deprecated by 1console
    public static LandscapeUI       = "cd17:landscape";         //  ever so deprecated
    public static IntegrationsUI    = "cd17:integrations";      //  deprecated
    public static EndpointsUI       = "cd19:endpoints";
    public static InsightBI         = "insight:bi";
    public static HudUI             = "insight:hud";
    public static IrisUI            = "insight:iris";
    public static SearchUI          = "cd17:search";            //  almost deprecated
    public static HealthUI          = "cd17:health";            //  deprecated
    public static DisputesUI        = "cd17:disputes";          //  deprecated
    public static DashboardsUI      = "cd19:dashboards";        //  deprecated
    public static ExposuresUI       = "cd17:exposures";         //  deprecated

    /**
     * 1Console UI Nodes
     */
    public static StandaloneMagmaUI = "cd24:1console";
    public static SingleSpaMagmaUI  = "cd24:foundation";
    public static MagmaUI           = "cd21:magma";
    public static FortraPlatform    = "fortra:platform";
    public static FrontlineVM       = "frontline:vm";
    public static StaticContentUI   = "ui-static-content";

    /**
     * Miscellaneous/External Resources
     */
    public static Fino              = "cd14:fino";
    public static SecurityContent   = "cd14:scc";
    public static SupportPortal     = "cd14:support";
    public static Segment           = "segment";
    public static Auth0             = "auth0";
    public static GoogleTagManager  = "gtm";
    public static DatadogRum        = "datadogrum";


    /**
     * Generates location type definitions for residency-specific prod, integration, and dev versions of a UI
     */
    public static uiNode( locTypeId:string, appCode:string, devPort:number, magmaRedirectPath?: string ):AlLocationDescriptor[] {
        let nodes:AlLocationDescriptor[] = [];

        if ( [ AlLocation.MagmaUI, AlLocation.StandaloneMagmaUI, AlLocation.SingleSpaMagmaUI ].includes( locTypeId ) ) {
            nodes.push( {
                locTypeId: locTypeId,
                environment: 'production',
                residency: 'US',
                uri: `https://console.alertlogic.com`,
                keyword: `${locTypeId===AlLocation.MagmaUI ? 'console.alertlogic.com': appCode}`
            } );
        } else {
            nodes.push( {
                locTypeId: locTypeId,
                environment: 'production',
                residency: 'US',
                uri: `https://console.${appCode}.alertlogic.com`,
                aliases: [ `https://console.${appCode}.alertlogic.co.uk` ],
                keyword: `${locTypeId===AlLocation.MagmaUI ? 'console.alertlogic.com': appCode}`
            } );
        }

        nodes.push( {
            locTypeId: locTypeId,
            environment: 'production-staging',
            residency: 'US',
            uri: `https://${appCode}-production-staging-us.ui-dev.product.dev.alertlogic.com`,
            aliases: [ `https://${appCode}-production-staging-uk.ui-dev.product.dev.alertlogic.com` ],
            keyword: appCode
        } );

        nodes.push( {
                locTypeId: locTypeId,
                environment: 'integration',
                uri: `https://console.${appCode}.product.dev.alertlogic.com`,
                aliases: [
                    `https://${appCode}.ui-dev.product.dev.alertlogic.com`,
                    `https://${appCode}-*.ui-dev.product.dev.alertlogic.com`,
                    `https://${appCode}-pr-*.ui-dev.product.dev.alertlogic.com`,
                    `https://*.o3-${appCode}.product.dev.alertlogic.com`
                ],
                keyword: appCode
            },
            {
                locTypeId: locTypeId,
                environment: 'development',
                uri: `http://localhost:${devPort}`,
                keyword: 'localhost'
            }
        );

        if ( magmaRedirectPath ) {
            nodes.forEach( node => node.magmaRedirectPath = magmaRedirectPath );
        }
        return nodes;
    }
}

/**
 * @public
 *
 * Describes a single instance of a location type (AlLocation).
 */

export interface AlLocationDescriptor
{
    locTypeId:string;               //  This should correspond to one of the ALLocation string constants, e.g., AlLocation.AccountsUI or AlLocation.GlobalAPI.
    insightLocationId?:string;      //  The location ID as defined by the global locations service -- e.g., 'defender-us-ashburn' or 'insight-eu-ireland'.
    uri:string;                     //  URI of the entity
    originalUri?:string;            //  for after remapping, needed for linking
    residency?:string;              //  A data residency domain
    environment?:string;            //  'production, 'integration', 'development'...
    aliases?:string[];              //  A list of
    inert?:boolean;                 //  Not evaluated by `AlLocatorMatrix.setActingUri`

    uiCaption?:string;
    uiEntryPoint?:{locTypeId:string, path?:string};
    data?:any;                      //  Miscellaneous associated data
    weight?:number;                 //  Relative weight for resolution by URI.  In general, the more significant a node is the lower its weight should be.
    magmaRedirectPath?: string;
    keyword?:string;
}

/**
 * @public
 *
 * A dictionary of insight locations (as reported by AIMS and the locations service).
 */
export const AlInsightLocations: {[locationId:string]: ({residency: string; residencyCaption: string, alternatives?: string[]; logicalRegion: string});} =
{
    "defender-us-denver": {
        residency: "US",
        residencyCaption: "UNITED STATES",
        logicalRegion: "us-west-1"
    },
    "defender-us-ashburn": {
        residency: "US",
        residencyCaption: "UNITED STATES",
        logicalRegion: "us-east-1"
    },
    "defender-uk-newport": {
        residency: "EMEA",
        residencyCaption: "UNITED KINGDOM",
        logicalRegion: "uk-west-1"
    },
    "insight-us-virginia": {
        residency: "US",
        residencyCaption: "UNITED STATES",
        alternatives: [ "defender-us-denver", "defender-us-ashburn" ],
        logicalRegion: "us-east-1"
    },
    "insight-eu-ireland": {
        residency: "EMEA",
        residencyCaption: "UNITED KINGDOM",
        alternatives: [ "defender-uk-newport" ],
        logicalRegion: "uk-west-1"
    }
};

