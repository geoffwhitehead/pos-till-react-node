import { userService } from './user';
import { authService } from './auth';
import { LoggerService } from '../loaders/logger';
import { RepositoryService } from '../repositories';
import { MailerService } from './mailer';
import { productService } from './product';
import { maintenanceService } from './maintenance';
import { printerService } from './printer';
import { organizationService } from './organization';
import { EnvConfig } from '../config';

export interface InjectedDependencies {
    mailer: MailerService;
    logger: LoggerService;
    repositories: RepositoryService;
    config: EnvConfig;
}

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
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
        name: 'maintenanceService',
        service: maintenanceService,
    },
    {
        name: 'printerService',
        service: printerService,
    },
    {
        name: 'organizationService',
        service: organizationService,
    },
];
export const registerServices = (dependencies: InjectedDependencies): Service[] => {
    return services.map(({ name, service }) => ({ name, service: service(dependencies) }));
};
