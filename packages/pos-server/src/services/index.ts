import { EnvConfig } from '../config';
import { LoggerService } from '../loaders/logger';
import { RepositoryService } from '../repositories';
import { RepositoryFns } from '../repositories/utils';
import { authService } from './auth';
import { MailerService } from './mailer';
import { organizationService } from './organization';
import { printerService } from './printer';
import { productService } from './product';
import { tablePlanService } from './tablePlan';
import { userService } from './user';

export interface InjectedDependencies {
    mailer: MailerService;
    logger: LoggerService;
    repositories: RepositoryService;
    config: EnvConfig;
}

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code?: string;
        message?: string;
    };
}

export type ChangeDocument = Record<string, any> & { id: string }; // TODO: fix this
export type ChangesObject = {
    created: ChangeDocument[];
    updated: ChangeDocument[];
    deleted: string[];
};
export type Changes = Record<string, ChangesObject>;

export type ServiceFns = RepositoryService;

type PullChangesRequestParams = {
    lastPulledAt: Date;
    schemaVersion: number;
    migration: null;
};

type PushChangesRequestParams = {
    lastPulledAt: Date;
    changes: Changes;
};

export type SyncFns = {
    pullChanges: (params: PullChangesRequestParams) => Promise<Changes>;
    pushChanges: (params: PushChangesRequestParams) => Promise<void>;
};

export const pull = async <T extends RepositoryFns<any>>(repo: T, lastPulledAt: Date) => {
    const [created, updated, deleted] = await Promise.all([
        repo.createdSince(lastPulledAt),
        repo.updatedSince(lastPulledAt),
        repo.deletedSince(lastPulledAt),
    ]);

    return {
        created,
        updated,
        deleted: deleted.map(({ _id }) => _id),
    };
};

// client wins
export const push = async <T extends RepositoryFns<any>>(repo: T, changes: ChangesObject, lastPulledAt: Date) => {
    // TODO: use bulk writes
    await Promise.all(changes.created.map(({ id, ...props }) => repo.upsert(id, props)));
    await Promise.all(changes.updated.map(({ id, ...props }) => repo.upsert(id, props)));
    await Promise.all(changes.deleted.map(repo.deleteOneById));
};

export enum Services {
    userService = 'userService',
    authService = 'authService',
    productService = 'productService',
    printerService = 'printerService',
    organizationService = 'organizationService',
    tablePlan = 'tablePlanService',
}

type Service = { name: string; service: any }; // TODO: figure out how to tpye thiss
const services = [
    {
        name: 'userService',
        service: userService,
    },
    {
        name: 'authService',
        service: authService,
    },
    {
        name: 'productService',
        service: productService,
    },
    {
        name: 'printerService',
        service: printerService,
    },
    {
        name: 'organizationService',
        service: organizationService,
    },
    {
        name: 'tablePlanService',
        service: tablePlanService,
    },
];
export const registerServices = (dependencies: InjectedDependencies): Service[] => {
    return services.map(({ name, service }) => ({ name, service: service(dependencies) }));
};
