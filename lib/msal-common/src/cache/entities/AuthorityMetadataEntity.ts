/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { CloudDiscoveryMetadata } from "../../authority/CloudDiscoveryMetadata";
import { OpenIdConfigResponse } from "../../authority/OpenIdConfigResponse";
import { AUTHORITY_METADATA_CONSTANTS } from "../../utils/Constants";
import { TimeUtils } from "../../utils/TimeUtils";

export class AuthorityMetadataEntity {
    aliases: Array<string>;
    preferred_cache: string;
    preferred_network: string;
    authorization_endpoint: string;
    token_endpoint: string;
    end_session_endpoint: string;
    issuer: string;
    aliasesFromNetwork: boolean;
    endpointsFromNetwork: boolean;
    expiresAt: number;

    constructor() {
        this.expiresAt = TimeUtils.nowSeconds() + AUTHORITY_METADATA_CONSTANTS.REFRESH_TIME_SECONDS;
    }

    /**
     * Update the entity with new aliases, preferred_cache and preferred_network values
     * @param metadata 
     * @param fromNetwork 
     */
    updateCloudDiscoveryMetadata(metadata: CloudDiscoveryMetadata, fromNetwork: boolean) {
        this.aliases = metadata.aliases;
        this.preferred_cache = metadata.preferred_cache;
        this.preferred_network = metadata.preferred_network;
        this.aliasesFromNetwork = fromNetwork;
    }

    /**
     * Update the entity with new endpoints
     * @param metadata 
     * @param fromNetwork 
     */
    updateEndpointMetadata(metadata: OpenIdConfigResponse, fromNetwork: boolean) {
        this.authorization_endpoint = metadata.authorization_endpoint;
        this.token_endpoint = metadata.token_endpoint;
        this.end_session_endpoint = metadata.end_session_endpoint;
        this.issuer = metadata.issuer;
        this.endpointsFromNetwork = fromNetwork;
    }

    /**
     * Reset the exiresAt value
     */
    resetExpiresAt() {
        this.expiresAt = TimeUtils.nowSeconds() + AUTHORITY_METADATA_CONSTANTS.REFRESH_TIME_SECONDS;
    }

    /**
     * Returns whether or not the data needs to be refreshed
     */
    isExpired(): boolean {
        return this.expiresAt <= TimeUtils.nowSeconds();
    }

    /**
     * Validates an entity: checks for all expected params
     * @param entity
     */
    static isAuthorityMetadataEntity(key: string, entity: object): boolean {

        if (!entity) {
            return false;
        }

        return (
            key.indexOf(AUTHORITY_METADATA_CONSTANTS.CACHE_KEY) === 0 &&
            entity.hasOwnProperty("aliases") &&
            entity.hasOwnProperty("preferred_cache") &&
            entity.hasOwnProperty("preferred_network") &&
            entity.hasOwnProperty("authorization_endpoint") &&
            entity.hasOwnProperty("token_endpoint") &&
            entity.hasOwnProperty("end_session_endpoint") &&
            entity.hasOwnProperty("issuer") &&
            entity.hasOwnProperty("aliasesFromNetwork") &&
            entity.hasOwnProperty("endpointsFromNetwork") &&
            entity.hasOwnProperty("expiresAt")
        );
    }
}
