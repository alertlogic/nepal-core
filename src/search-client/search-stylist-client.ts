/**
 * A client for interacting with the Alert Logic Search Stylist API.
 */
import {
    ALClient,
    APIRequestParams,
} from "../client";

import { AlSearchResultsQueryParamsV2,
         AlSearchGetV2 } from './search-client.v2';

class AlSearchStylist {

    private serviceName = 'search_stylist';

    /**
     *  Get the results of a search with applied human readable transformations.
     *  search_stylist will request results from EM search service by calling Search Results
     *  endpoint for the same account_id/uuid with the same query string params (offset/limit/etc) as passed to this endpoint.
     */
    async searchStylist(accountId: string, uuid: string, additionalParams?: AlSearchResultsQueryParamsV2): Promise<AlSearchGetV2> {
        const fetchRequestArgs: APIRequestParams = {
            service_name: this.serviceName,
            account_id: accountId,
            path: `/searches/${uuid}`
        };
        if (additionalParams) {
            fetchRequestArgs.params = additionalParams;
        }
        const results = await ALClient.get(fetchRequestArgs);

        return results as AlSearchGetV2;
    }
}

export const alSearchStylist = new AlSearchStylist();
