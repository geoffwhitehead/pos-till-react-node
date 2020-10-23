import { max } from 'date-fns';
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
    address_line1: string;
    address_line2: string;
    address_city: string;
    address_county: string;
    address_postcode: string;
    default_price_group_id: string;
    receipt_printer_id: string;
    currency: string;
    max_bills: number;
};

export const organizationFromClient = (organization: OrganizationClientProps): OrganizationProps => {
    const { id, name, email, phone, vat } = organization;

    return {
        _id: id,
        name,
        email,
        phone,
        vat,
        settings: {
            defaultPriceGroupId: organization.default_price_group_id,
            receiptPrinterId: organization.receipt_printer_id,
            currency: organization.currency,
            maxBills: organization.max_bills,
        },
        address: {
            line1: organization.address_line1,
            line2: organization.address_line2,
            city: organization.address_city,
            county: organization.address_county,
            postcode: organization.address_postcode,
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
        default_price_group_id: settings.defaultPriceGroupId,
        receipt_printer_id: settings.receiptPrinterId,
        currency: settings.currency,
        max_bills: settings.maxBills,
        address_line1: address.line1,
        address_line2: address.line2,
        address_city: address.city,
        address_county: address.county,
        address_postcode: address.postcode,
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
                created: [], // n/a
                updated: organizations.updated.map(organizationToClient),
                deleted: [], // n/a
            },
        };
    };

    const pushChanges = async ({ lastPulledAt, changes }) => {
        const _changes = {
            created: [],
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
