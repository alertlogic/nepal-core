import {
    AlLocation,
    AlLocationDescriptor,
} from './al-locator.types';

/**
 * @public
 *
 * A dictionary of public Alert Logic resource locations, subkeyed by residency and environment.
 */
/* tslint:disable:variable-name */
export const AlLocationDictionary: AlLocationDescriptor[] =
[
    /**
    *  Global APIs
    */
    {
        locTypeId: AlLocation.GlobalAPI,
        insightLocationId: 'insight-global',
        productType: 'insight',
        aspect: 'api',
        uri: 'https://api.global.alertlogic.com',
        environment: 'production|beta-nav-prod|production-staging'
    },
    {
        locTypeId: AlLocation.GlobalAPI,
        insightLocationId: 'insight-global',
        productType: 'insight',
        aspect: 'api',
        uri: 'https://api.global-integration.product.dev.alertlogic.com',
        environment: 'integration|beta-navigation|development'
    },

    /**
    *  Cloud Insight API locations
    */
    {
        locTypeId: AlLocation.InsightAPI,
        productType: 'insight',
        aspect: 'api',
        uri: 'https://api.cloudinsight.alertlogic.com',
        environment: 'production|beta-nav-prod|production-staging',
        residency: 'US'
    },
    {
        locTypeId: AlLocation.InsightAPI,
        productType: 'insight',
        aspect: 'api',
        uri: 'https://api.cloudinsight.alertlogic.co.uk',
        environment: 'production|beta-nav-prod|production-staging',
        residency: 'EMEA'
    },
    {
        locTypeId: AlLocation.InsightAPI,
        productType: 'insight',
        aspect: 'api',
        uri: 'https://api.product.dev.alertlogic.com',
        environment: 'integration|beta-navigation|development',
        residency: 'US'
    },

    /**
     * Gestapi API locations
     */
    {
        locTypeId: AlLocation.GestaltAPI,
        uri: 'https://gestalt-api.product.dev.alertlogic.com',
        environment: 'integration|beta-navigation|development'
    },
    {
        locTypeId: AlLocation.GestaltAPI,
        uri: 'https://gestalt.cloudinsight.alertlogic.co.uk',
        environment: 'production|beta-nav-prod|production-staging',
        residency: 'EMEA'
    },
    {
        locTypeId: AlLocation.GestaltAPI,
        uri: 'https://gestalt.cloudinsight.alertlogic.com',
        environment: 'production|beta-nav-prod|production-staging',
        residency: 'US'
    },

    /**
    *  CD14 UI locations.
    */
    {
        locTypeId: AlLocation.LegacyUI,
        insightLocationId: 'defender-us-denver',
        productType: 'defender',
        aspect: 'ui',
        uri: 'https://console.clouddefender.alertlogic.com',
        environment: 'production|beta-nav-prod|production-staging',
        residency: 'US',
        uiCaption: 'us-west-1',
        uiEntryPoint: {
          locTypeId: AlLocation.OverviewUI,
          path: '/#/'
        }
    },

    {
        locTypeId: AlLocation.LegacyUI,
        insightLocationId: 'defender-uk-newport',
        productType: 'defender',
        aspect: 'ui',
        uri: 'https://console.alertlogic.co.uk',
        environment: 'production|beta-nav-prod|production-staging',
        residency: 'EMEA',
        uiCaption: 'uk-west-1',
        uiEntryPoint: {
          locTypeId: AlLocation.OverviewUI,
          path: '/#/'
        }
    },

    {
        locTypeId: AlLocation.LegacyUI,
        insightLocationId: 'defender-us-ashburn',
        productType: 'defender',
        aspect: 'ui',
        uri: 'https://console.alertlogic.net',
        environment: 'production|beta-nav-prod|production-staging',
        residency: 'US',
        uiCaption: 'us-east-1',
        uiEntryPoint: {
          locTypeId: AlLocation.OverviewUI,
          path: '/#/'
        }
    },

    {
        locTypeId: AlLocation.LegacyUI,
        insightLocationId: 'defender-us-ashburn',
        productType: 'defender',
        aspect: 'ui',
        uri: 'https://cd-integration-console.alertlogic.net',
        environment: 'integration|beta-navigation|development',
        residency: 'US',
        uiCaption: 'us-east-1',
        uiEntryPoint: {
          locTypeId: AlLocation.OverviewUI,
          path: '/#/'
        }
    },

    ...AlLocation.uiNode(AlLocation.AccountsUI, 'account', 8002),
    ...AlLocation.uiNode(AlLocation.OverviewUI, 'overview', 4213),
    ...AlLocation.uiNode(AlLocation.IncidentsUI, 'incidents', 8001),
    ...AlLocation.uiNode(AlLocation.IntelligenceUI, 'intelligence', 4211),
    ...AlLocation.uiNode(AlLocation.ConfigurationUI, 'configuration', 4210),
    ...AlLocation.uiNode(AlLocation.RemediationsUI, 'remediations', 4212),
    ...AlLocation.uiNode(AlLocation.SearchUI, 'search', 4220),
    ...AlLocation.uiNode(AlLocation.EndpointsUI, 'endpoints', 8004),
    ...AlLocation.uiNode(AlLocation.DashboardsUI, 'dashboards', 7001),
    ...AlLocation.uiNode(AlLocation.HealthUI, 'health', 8003),
    ...AlLocation.uiNode(AlLocation.ExposuresUI, 'exposures', 8006),
    ...AlLocation.uiNode(AlLocation.LandscapeUI, 'landscape', 4230),

    {
        locTypeId: AlLocation.DashboardsUI,
        uri: 'https://dashboards.ui-dev.product.dev.alertlogic.com',
        environment: 'integration'
    },

    /**
    *  Insight BI
    */
    {
        locTypeId: AlLocation.InsightBI,
        uri: 'https://bi.cloudinsight.alertlogic.com',
        environment: 'production|beta-nav-prod|production-staging',
        residency: 'US'
    },
    {
        locTypeId: AlLocation.InsightBI,
        uri: 'https://bi.cloudinsight.alertlogic.co.uk',
        environment: 'production|beta-nav-prod|production-staging',
        residency: 'EMEA'
    },
    {
        locTypeId: AlLocation.InsightBI,
        uri: 'https://bi.product.dev.alertlogic.com',
        environment: 'integration|beta-navigation|development'
    },

    /**
    *  Hud UI
    */
    {
        locTypeId: AlLocation.HudUI,
        uri: 'https://hud.iris.alertlogic.com',
        environment: 'production',
        residency: 'US',
        keyword: 'hud',
    },
    {
        locTypeId: AlLocation.HudUI,
        uri: 'https://hud-ui-production-staging-uk.ui-dev.product.dev.alertlogic.com',
        environment: 'production-staging',
        residency: 'EMEA',
        keyword: 'hud',
    },
    {
        locTypeId: AlLocation.HudUI,
        uri: 'https://hud-ui-production-staging-us.ui-dev.product.dev.alertlogic.com',
        environment: 'production-staging',
        residency: 'US',
        keyword: 'hud',
    },
    {
        locTypeId: AlLocation.HudUI,
        uri: 'https://hud.iris.alertlogic.co.uk',
        environment: 'production',
        residency: 'EMEA',
        keyword: 'hud',
    },
    {
        locTypeId: AlLocation.HudUI,
        uri: 'https://console.hudui.product.dev.alertlogic.com',
        environment: 'integration',
        aliases: [
            `https://hud-ui.ui-dev.product.dev.alertlogic.com`,
            `https://hud-ui-*.ui-dev.product.dev.alertlogic.com`,
            `https://hud-ui-pr-*.ui-dev.product.dev.alertlogic.com`,
        ],
        keyword: 'hud',
    },
    {
        locTypeId: AlLocation.HudUI,
        uri: 'http://localhost:4200',
        environment: 'development',
        keyword: 'localhost'
    },

    /**
    *  Iris UI
    */
    {
        locTypeId: AlLocation.IrisUI,
        uri: 'https://console.iris.alertlogic.com',
        environment: 'production',
        residency: 'US',
        keyword: 'iris',
    },
    {
        locTypeId: AlLocation.IrisUI,
        uri: 'https://console.iris.alertlogic.co.uk',
        environment: 'production',
        residency: 'EMEA',
        keyword: 'iris',
    },
    {
        locTypeId: AlLocation.IrisUI,
        uri: 'https://iris-ui-production-staging-us.ui-dev.product.dev.alertlogic.com',
        environment: 'production-staging',
        residency: 'US',
        keyword: 'iris',
    },
    {
        locTypeId: AlLocation.IrisUI,
        uri: 'https://iris-ui-production-staging-uk.ui-dev.product.dev.alertlogic.com',
        environment: 'production-staging',
        residency: 'EMEA',
        keyword: 'iris',
    },
    {
        locTypeId: AlLocation.IrisUI,
        uri: 'https://iris.product.dev.alertlogic.com',
        environment: 'integration',
        aliases: [
            `https://iris-ui.ui-dev.product.dev.alertlogic.com`,
            `https://iris-ui-*.ui-dev.product.dev.alertlogic.com`,
            `https://iris-ui-pr-*.ui-dev.product.dev.alertlogic.com`,
        ],
        keyword: 'iris',
    },
    {
        locTypeId: AlLocation.IrisUI,
        uri: 'http://localhost:4202',
        environment: 'development',
        keyword: 'localhost'
    },

    /**
     * Barkly Endpoints API
     */
    {
        locTypeId: AlLocation.EndpointsAPI,
        uri: 'https://api.endpoints.alertlogic.com',
        environment: 'production|beta-nav-prod|production-staging',
        residency: 'US'
    },
    {
        locTypeId: AlLocation.EndpointsAPI,
        uri: 'https://api.endpoints.alertlogic.co.uk',
        environment: 'production|beta-nav-prod|production-staging',
        residency: 'EMEA'
    },
    {
        locTypeId: AlLocation.EndpointsAPI,
        uri: 'https://api.endpoints.product.dev.alertlogic.com',
        environment: 'integration|beta-navigation|development'
    },

    /**
    *  Integrations/API Documentation.
    */
    {
        locTypeId: AlLocation.IntegrationsUI,
        uri: 'http://localhost:8040',
        environment: 'development'
    },
    /**
    *  Fino!
    */
    {
        locTypeId: AlLocation.Fino,
        uri: 'https://den-fino.clouddefender.alertlogic.com'
    },

    /**
    *  Security Content Center!
    */
    {
        locTypeId: AlLocation.SecurityContent,
        uri: 'https://scc.alertlogic.net/'
    },

    {
        locTypeId: AlLocation.SupportPortal,
        uri: 'https://support.alertlogic.com'
    },

    /**
    *  Segment Configuration
    */
    {
        locTypeId: AlLocation.Segment,
        uri: 'https://segment.io',
        data: {
            analyticsKey: 'Ud9VX1aFxXgjg8CnlOBv9k5b6qga9yII'
        },
        environment: 'production|beta-nav-prod|production-staging',
        residency: 'US'
    },
    {
        locTypeId: AlLocation.Segment,
        uri: 'https://segment.io',
        data: {
            analyticsKey: 'IwB7SmcEFckM6FrHlbQYcg0I75lc93dO'
        },
        environment: 'production',
        residency: 'EMEA'
    },
    {
        locTypeId: AlLocation.Segment,
        uri: 'https://segment.io',
        data: {
            analyticsKey: 'OXe8LjJ0C48IJASuW9Ho37f4o6XCXHIV'
        },
        environment: 'integration'
    },
    {
        locTypeId: AlLocation.Segment,
        uri: 'https://dev.segment.io',
        data: {
            analyticsKey: 'b1ptaDZMJSUaFmm38ho7p4NH5uHwqheY'
        },
        environment: 'development'
    },

    /**
    *  Google Tag Manager Config
    */
    {
        locTypeId: AlLocation.GoogleTagManager,
        uri: 'https://www.googletagmanager.com/gtag/js',
        data: {
            analyticsKey: 'UA-17359898-12'
        },
        environment: 'production|production-staging'
    },
    {
        locTypeId: AlLocation.GoogleTagManager,
        uri: 'https://www.googletagmanager.com/gtag/js',
        data: {
            analyticsKey: 'UA-17359898-11'
        },
        environment: 'integration'
    },
    {
        locTypeId: AlLocation.GoogleTagManager,
        uri: 'https://www.googletagmanager.com/gtag/js',
        data: {
            analyticsKey: ''
        },
        environment: 'development'
    },

    /**
    *  Auth0 Configuration
    */
    {
        locTypeId: AlLocation.Auth0,
        uri: 'alertlogic.auth0.com',
        data: {
          clientID: 'k06YQlnk518d27rHf4FLM1SIu3Q4blgB'
        },
        environment: 'production|beta-nav-prod|production-staging',
        residency: 'US'
    },
    {
        locTypeId: AlLocation.Auth0,
        uri: 'alertlogic.auth0.com',
        data: {
          clientID: 'kcp0TxJdiQjneMO8A5a3E1TN2veR4snZ'
        },
        environment: 'production',
        residency: 'EMEA'
    },
    {
        locTypeId: AlLocation.Auth0,
        uri: 'alertlogic-integration.auth0.com',
        data: {
          clientID: '6T6zEBgX0WMqksT8mC20c1OvvGqH7Jbj'
        },
        environment: 'integration|beta-navigation'
    },
    {
        locTypeId: AlLocation.Auth0,
        uri: 'alertlogic-integration.auth0.com',
        data: {
          clientID: '8eMblSx2Ead6nT7SeXffXbHT1I4JyAI4'
        },
        environment: 'development'
    }
];

