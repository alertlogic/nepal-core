/**
 * A client for interacting with the Alert Logic OTIS Public API.
 */
import { AlDefaultClient, AlLocation } from '@al/core';

export interface TuningOptionScope {
  deployment_id?: string;
  region_key?: string;
  vpc_key?: string;
  vpc_id?: string;
  provider_type?: string;
  provider_id?: string;
}

export type TuningOptionValue = string | number | boolean | {[key:string]: unknown};

export interface TuningOption {
  id?: string;
  name?: string;
  scope?: TuningOptionScope;
  value?: TuningOptionValue;
}


class OTISClient {

  private serviceName = 'otis';
  private version = 'v3';
  /**
   * Create Option
   */
  async createOption(accountId: string, data: TuningOption): Promise<TuningOption> {
    return AlDefaultClient.post<TuningOption>({
      data,
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: '/options',
      version: this.version
    });
  }
  /**
   * Get Option
   */
  async getOption(accountId: string, optionId: string): Promise<TuningOption> {
    return AlDefaultClient.get<TuningOption>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: `/options/${optionId}`,
      version: this.version,
    });

  }
  /**
   * List Options
   */
  async listOptions(accountId: string, params?: {[key:string]: string|string[]}): Promise<TuningOption[]> {
    return AlDefaultClient.get<TuningOption[]>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: `/options/`,
      version: this.version,
      params: params
    });

  }
  /**
   * Delete Option
   */
  async deleteOption(accountId: string, optionId: string): Promise<void> {
    return AlDefaultClient.delete({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: `/options/${optionId}`,
      version: this.version,
    });
  }
  /**
   * Update Option Value
   *
   * value: set as any because of the API flexibility, from docs: value - arbitrary JSON data
   */
  async updateOptionValue(accountId: string, optionId: string, value: TuningOptionValue): Promise<TuningOption> {
    return AlDefaultClient.put<TuningOption>({
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: `/options/${optionId}`,
      version: this.version,
      data: {
        value,
      },
    });
  }

  /**
   * Resolve Option Values
   */
  async resolveOptionValues(accountId: string,
                            data: {  scope: TuningOptionScope, names: string[] }): Promise<unknown> {
    return AlDefaultClient.post({
      data,
      service_stack: AlLocation.InsightAPI,
      service_name: this.serviceName,
      account_id: accountId,
      path: '/options/resolve',
      version: this.version
    });
  }
}

export const otisClient =  new OTISClient();
