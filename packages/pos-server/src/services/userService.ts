// import { User } from '../models';
// import bcrypt from 'bcryptjs';
// import { Request, Response } from 'express';
// import { createToken } from '../helpers/createToken';
// import { UserProps } from '../models/User';

// const PUBLIC_FIELDS = 'firstName lastName email';

// const create = async (req: Request, res: Response): Promise<void> => {
//     const UserModel = User();

//     const { firstName, lastName, email, password } = req.body;

//     const user = new UserModel({ firstName, lastName, email, password });
//     const errors = user.validateSync();

//     if (errors) {
//         res.status(401).send(errors);
//         return;
//     }

//     const duplicate = await UserModel.find({ email });

//     if (duplicate) {
//         res.status(400).send('User exists');
//         return;
//     }

//     try {
//         const workFactor = 12;
//         user.password = await bcrypt.hash(req.body.password, workFactor);
//         user.token = createToken(user.id, user.email);
//         await user.save();
//         res.status(200).send(user.token);
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };

// /**
//  * Get a single user
//  * @param {String} name - the name of the User to retrieve
//  */
// const getById = async (req: Request, res: Response): Promise<void> => {
//     const { id } = req.params;
//     try {
//         const user = await User().findById(id, PUBLIC_FIELDS);
//         res.status(200).send(user);
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };

/**
 * List all the users. Query params ?skip=0&limit=1000 by default
 */

// interface Params {
//     query: {
//         skip: number;
//         limit: number;
//     };
// }
// const getAll = async (params: Params): Promise<UserProps[]> => {
//     const skip = params.query.skip;
//     const limit = params.query.limit;
//     try {
//         const users = await User.find({}, PUBLIC_FIELDS, { skip, limit });
//         return users;
//     } catch (err) {
//         throw new Error('Error fetching users');
//     }
// };

// /**
//  * Update a single user
//  * @param {String} name - the name of the User to update
//  */
// const update = async (req: Request, res: Response): Promise<void> => {
//     const { id, ...props } = req.body;
//     try {
//         const user = await User().updateOne(id, props, { runValidators: true });

//         if (user.err) {
//             throw new Error('Errors creating user');
//         }
//         res.send('user updated');
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };

// /**
//  * Remove a single user
//  * @param {String} name - the name of the User to remove
//  */
// const remove = async (req: Request, res: Response): Promise<void> => {
//     const { id } = req.params;
//     try {
//         const deleteMsg = await User().deleteOne(id);
//         res.send(deleteMsg);
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };

// export { create, update, remove, getById, getAll };
// export default { getAll };
// import Models from '../models';
// import MailerService from './mailer';
// import { Logger } from 'mongodb';
// import { LoggerService } from '../loaders/logger';
import { InjectedDependencies } from '.';
import { UserProps } from '../models/User';
// interface InjectorArgs {
//     userId: string;
//     organizationId: string;
// }

export interface UserService {
    findAll: () => Promise<UserProps[]>;
}

export const usersService = ({ repositories: { userRepository }, logger }: InjectedDependencies): UserService => {
    const findAll = async () => await userRepository.findAll();
    // const create = user => {
    //     await usersRepository.createUser(user);
    //     logger.info('User created');
    // };

    return {
        findAll,
        // create
    };
};

// const service = usersService({
//     usersRepository,
//     mailer,
//     logger,
// });
// interface ResolverArgs {
//     models:
//     services: {
//         userService: {

//         }
//     }
// }

// export const userService = (injectorArgs: InjectorArgs) => {
//     const models = Models.register(injectorArgs.organizationId);

//     const resolverArgs: ResolverArgs = {
//         ...injectorArgs,
//         models
//     };

//     return {
//         createReport: createReportFactory(resolverArgs),
//         deleteReport: deleteReportFactory(resolverArgs),
//         getAllReports: getAllReportsFactory(resolverArgs),
//         getReportById: getReportByIdFactory(resolverArgs),
//     };
// };
