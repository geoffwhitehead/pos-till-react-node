// export const baseService =() => {
//     interface InjectorArgs {
//         userId: string;
//         organizationId: string;
//     }

//     interface ResolverArgs {
//         models:

//     }

//     export const userService = (injectorArgs: InjectorArgs) => {
//         const models = Models.register(injectorArgs.organizationId);

//         const resolverArgs: ResolverArgs = {
//             ...injectorArgs,
//             models
//         };

//         return {
//             userService: createReportFactory(resolverArgs),
//             deleteReport: deleteReportFactory(resolverArgs),
//             getAllReports: getAllReportsFactory(resolverArgs),
//             getReportById: getReportByIdFactory(resolverArgs),
//         };
//     };
// }
import { usersService } from './userService';
import MailerService from './mailer';
import { LoggerService } from '../loaders/logger';
import { RepositoryService } from '../repositories';
export interface InjectedDependencies {
    mailer: MailerService;
    logger: LoggerService;
    repositories: RepositoryService;
}

type Service = { name: string; service: any }; // TODO: figure out how to tpye thiss
const services = [
    {
        name: 'userService',
        service: usersService,
    },
];
export const registerServices = (dependencies: InjectedDependencies): Service[] => {
    return services.map(s => ({ name: s.name, service: s.service(dependencies) }));
};
