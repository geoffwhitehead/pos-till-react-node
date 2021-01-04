import uuid from 'uuid';
import { InjectedDependencies, pull, push } from '.';
import {
    BillViewTypeEnum,
    CategoryViewTypeEnum,
    CurrencyEnum,
    OrganizationProps,
    ORGANIZATION_COLLECTION_NAME,
    PrintItemGroupingEnum,
    TransactionGroupingEnum,
    TransactionOrderEnum,
} from '../models/Organization';
import { PAYMENT_TYPE_COLLECTION_NAME } from '../models/PaymentType';
import { toClientChanges } from '../utils/sync';
import { CommonServiceFns } from './product';

export type OrganizationService = CommonServiceFns<OrganizationProps> & { seed: () => Promise<void> };

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
    currency: CurrencyEnum;
    maxBills: number;
    shortNameLength: number;
    maxDiscounts: number;
    gracePeriodMinutes: number;
    categoryGridSize: number;
    categoryViewType: CategoryViewTypeEnum;
    transactionGrouping: TransactionGroupingEnum;
    transactionOrder: TransactionOrderEnum;
    billViewPlanGridSize: number;
    billViewType: BillViewTypeEnum;
    accessPin: string;
    accessPinEnabled: boolean;
    printItemGrouping: PrintItemGroupingEnum;
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
            shortNameLength: organization.shortNameLength,
            maxDiscounts: organization.maxDiscounts,
            gracePeriodMinutes: organization.gracePeriodMinutes,
            categoryGridSize: organization.categoryGridSize,
            categoryViewType: organization.categoryViewType,
            tranactionGrouping: organization.transactionGrouping,
            transactionOrder: organization.transactionOrder,
            billViewPlanGridSize: organization.billViewPlanGridSize,
            billViewType: organization.billViewType,
            accessPin: organization.accessPin,
            accessPinEnabled: organization.accessPinEnabled,
            printItemGrouping: organization.printItemGrouping,
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
    const { _id, name, email, phone, vat, address, settings = {} } = organization;

    return {
        id: _id,
        name,
        email,
        phone,
        vat,
        defaultPriceGroupId: settings.defaultPriceGroupId || undefined,
        receiptPrinterId: settings.receiptPrinterId,
        currency: settings.currency,
        maxBills: settings.maxBills,
        shortNameLength: settings.shortNameLength,
        maxDiscounts: settings.maxDiscounts,
        gracePeriodMinutes: settings.gracePeriodMinutes,
        categoryGridSize: settings.categoryGridSize,
        categoryViewType: settings.categoryViewType,
        billViewPlanGridSize: settings.billViewPlanGridSize,
        billViewType: settings.billViewType,
        transactionGrouping: settings.tranactionGrouping,
        transactionOrder: settings.transactionOrder,
        accessPin: settings.accessPin,
        accessPinEnabled: settings.accessPinEnabled,
        printItemGrouping: settings.printerItemGrouping,
        addressLine1: address.line1,
        addressLine2: address.line2,
        addressCity: address.city,
        addressCounty: address.county,
        addressPostcode: address.postcode,
    };
};

export const organizationService = ({
    repositories: { organizationRepository, paymentTypeRepository },
    logger,
}: InjectedDependencies): OrganizationService => {
    const pullChanges = async ({ lastPulledAt }) => {
        const [organizations, paymentTypes] = await Promise.all([
            pull(organizationRepository, lastPulledAt),
            pull(paymentTypeRepository, lastPulledAt),
        ]);

        const changes = {
            ...toClientChanges({
                [ORGANIZATION_COLLECTION_NAME]: {
                    created: organizations.created.map(organizationToClient), // n/a
                    updated: organizations.updated.map(organizationToClient),
                    deleted: [], // n/a
                },
            }),
            ...toClientChanges({ [PAYMENT_TYPE_COLLECTION_NAME]: paymentTypes }),
        };

        return changes;
    };

    const pushChanges = async ({ lastPulledAt, changes }) => {
        const _changes = {
            created: changes[ORGANIZATION_COLLECTION_NAME].created.map(organizationFromClient),
            updated: changes[ORGANIZATION_COLLECTION_NAME].updated.map(organizationFromClient),
            deleted: [],
        };

        await Promise.all([
            push(organizationRepository, _changes, lastPulledAt),
            push(paymentTypeRepository, changes[PAYMENT_TYPE_COLLECTION_NAME], lastPulledAt),
        ]);
    };

    const seed = async () => {
        const defaultPaymentTypes = [
            {
                _id: uuid(),
                name: 'cash',
            },
            {
                _id: uuid(),
                name: 'card',
            },
            {
                _id: uuid(),
                name: 'voucher',
            },
        ];
        await paymentTypeRepository.insert(defaultPaymentTypes);
    };
    return {
        seed,
        ...organizationRepository, //TODO
        pullChanges,
        pushChanges,
    };
};
