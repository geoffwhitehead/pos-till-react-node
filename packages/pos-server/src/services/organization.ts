import { max } from 'date-fns';
import { id } from 'date-fns/locale';
import { InjectedDependencies, pull, push, SyncFns } from '.';
import organization from '../api/routes/organization';
import { OrganizationProps, ORGANIZATION_COLLECTION_NAME } from '../models/Organization';
import { toClientChanges } from '../utils/sync';
import { CommonServiceFns } from './product';

export type OrganizationService = CommonServiceFns<OrganizationProps> & SyncFns;

export type OrganizationClientProps = {
    id: string;
    name: string;
    email: string;
    phone: string;
    vat: string;
    addressLine1: string;
    addressLine2: string;
    addressCity: string;
    addressCounty: string;
    addressPostcode: string;
    defaultPriceGroupId: string;
    receiptPrinterId: string;
    currency: string;
    maxBills: number;
};

export const organizationFromClient = (organization: OrganizationClientProps): OrganizationProps => {
    const { id, name, email, phone, vat } = organization;

    return {
        id,
        name,
        email,
        phone,
        vat,
        settings: {
            defaultPriceGroupId: organization.defaultPriceGroupId,
            receiptPrinterId: organization.receiptPrinterId,
            currency: organization.currency,
            maxBills: organization.maxBills,
        },
        address: {
            line1: organization.addressLine1,
            line2: organization.addressLine2,
            city: organization.addressCity,
            county: organization.addressCounty,
            postcode: organization.addressPostcode,
        },
    };
};

export const organizationToClient = (organization: OrganizationProps): OrganizationClientProps => {
    const { _id, name, email, phone, vat, address, settings } = organization;
    return {
        id: _id,
        name,
        email,
        phone,
        vat,
        defaultPriceGroupId: settings.defaultPriceGroupId,
        receiptPrinterId: settings.receiptPrinterId,
        currency: settings.currency,
        maxBills: settings.maxBills,
        addressLine1: address.line1,
        addressLine2: address.line2,
        addressCity: address.city,
        addressCounty: address.county,
        addressPostcode: address.postcode,
    };
};

export const organizationService = ({
    repositories: { organizationRepository },
    logger,
}: InjectedDependencies): OrganizationService => {
    const pullChanges = async ({ lastPulledAt }) => {
        const organizations = await pull(organizationRepository, lastPulledAt);

        return {
            [ORGANIZATION_COLLECTION_NAME]: {
                created: organizations.created.map(organizationToClient), // n/a
                updated: organizations.updated.map(organizationToClient),
                deleted: [], // n/a
            },
        };
    };

    const pushChanges = async ({ lastPulledAt, changes }) => {
        const _changes = {
            created: changes[ORGANIZATION_COLLECTION_NAME].created.map(organizationFromClient),
            updated: changes[ORGANIZATION_COLLECTION_NAME].updated.map(organizationFromClient),
            deleted: [],
        };
        await push(organizationRepository, _changes, lastPulledAt);
    };

    return {
        ...organizationRepository, //TODO
        pullChanges,
        pushChanges,
    };
};
