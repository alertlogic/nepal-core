/**
 * A client for interacting with the Alert Logic Search Stylist API.
 */
import { AlLocation } from 'src/common/navigation/al-locator.types';
import {
    AlDefaultClient,
    APIRequestParams,
} from "../client";

import { AlSearchResultsQueryParamsV2,
         AlSearchGetV2 } from './search-client.v2';

class AlSearchStylist {

    private serviceName = 'search_stylist';
    private version = 1;

    /**
     *  Get the results of a search with applied human readable transformations.
     *  search_stylist will request results from EM search service by calling Search Results
     *  endpoint for the same account_id/uuid with the same query string params (offset/limit/etc) as passed to this endpoint.
     */
    searchStylist(accountId: string, uuid: string, type: 'json'|'csv' = 'json', additionalParams?: AlSearchResultsQueryParamsV2, exportData?: boolean): Promise<AlSearchGetV2|any> {
        // Let's set the general fetch request arguments
        // that will be used in all the fetching types
        const fetchRequestArgs: APIRequestParams = {
            service_stack: AlLocation.InsightAPI,
            service_name: this.serviceName,
            version: this.version,
            account_id: accountId,
            path: `/searches/${uuid}/transform/${type}`
        };
        if (additionalParams) {
            fetchRequestArgs.params = additionalParams;
        }
        // In case we are trying to fetch csv we will return the blob file this
        // will help the consumer to handle the response and export easily
        if (type === 'csv') {
            if ( !fetchRequestArgs.headers ) {
                fetchRequestArgs.headers = {};
            }
            fetchRequestArgs.headers.Accept = 'text/csv';
            fetchRequestArgs.responseType = 'blob';

            if (exportData) {
                fetchRequestArgs.path = `/searches/${uuid}/export/${type}`;
            }

            return AlDefaultClient.get(fetchRequestArgs);
        }
        return AlDefaultClient.get<AlSearchGetV2>(fetchRequestArgs);
    }
}

export const alSearchStylist = new AlSearchStylist();
