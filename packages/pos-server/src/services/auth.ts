import Container, { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
// import { IUser, IUserInputDTO } from '../interfaces/IUser';
// import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
// import events from '../subscribers/events';
import { InjectedDependencies } from '.';
import { OrganizationProps } from '../models/Organization';
import { UserProps, UserPropsFull } from '../models/User';
// import { userService } from './user';

export interface AuthService {
    signUp: (params: UserPropsFull & OrganizationProps) => Promise<UserProps & { token: string }>;
}

const generateToken = (params: { organizationId: string; userId: string }): string => {
    const { userId, organizationId } = params;
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
        {
            userId,
            organizationId,
            exp: exp.getTime() / 1000,
        },
        config.jwtSecret,
    );
};

export const authService = ({
    repositories: { userRepository, organizationRepository },
    logger,
}: InjectedDependencies): AuthService => {
    const signUp: AuthService['signUp'] = async params => {
        try {
            const { firstName, lastName, password, email, name, phone, address } = params;

            logger.silly('Hashing password');
            const hashedPassword = await argon2.hash(password, { salt: randomBytes(32) });

            const organizationRecord = await organizationRepository.create({ name, email, phone, address });
            logger.info(`Created organization: ${organizationRecord._id}`);

            if (!organizationRecord) {
                throw new Error('Organization cannot be created');
            }

            Container.set('organizationId', organizationRecord._id);

            logger.silly('Creating user db record');
            const userRecord = await userRepository.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            });

            if (!userRecord) {
                throw new Error('User cannot be created');
            }

            logger.silly('Generating JWT');
            const token = generateToken({ userId: userRecord._id, organizationId: organizationRecord._id });
            logger.silly(`Sign JWT for userId: ${userRecord._id}, org: ${organizationRecord._id}`);

            // save the generated token to the user object
            await userRepository.updateById(userRecord._id, { token });

            logger.silly('Sending welcome email');
            // await mailer.SendWelcomeEmail(userRecord); // TODO:

            // TODO: events
            // eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

            return { ...userRecord, token };
        } catch (e) {
            logger.error(e);

            // TODO: remove changes - org and user
            throw e;
        }
    };
    return {
        signUp,
    };
};

// @Service()
// export default class AuthService {
//     constructor(
//         @Inject('userModel') private userModel: Models.UserModel,
//         private mailer: MailerService,
//         @Inject('logger') private logger,
//         @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
//     ) {}

//     public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
//         try {
//             const salt = randomBytes(32);

//             this.logger.silly('Hashing password');
//             const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
//             this.logger.silly('Creating user db record');
//             const userRecord = await this.userModel.create({
//                 ...userInputDTO,
//                 salt: salt.toString('hex'),
//                 password: hashedPassword,
//             });
//             this.logger.silly('Generating JWT');
//             const token = this.generateToken(userRecord);

//             if (!userRecord) {
//                 throw new Error('User cannot be created');
//             }
//             this.logger.silly('Sending welcome email');
//             await this.mailer.SendWelcomeEmail(userRecord);

//             this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

//             /**
//              * @TODO This is not the best way to deal with this
//              * There should exist a 'Mapper' layer
//              * that transforms data from layer to layer
//              * but that's too over-engineering for now
//              */
//             const user = userRecord.toObject();
//             Reflect.deleteProperty(user, 'password');
//             Reflect.deleteProperty(user, 'salt');
//             return { user, token };
//         } catch (e) {
//             this.logger.error(e);
//             throw e;
//         }
//     }

//     public async SignIn(email: string, password: string): Promise<{ user: IUser; token: string }> {
//         const userRecord = await this.userModel.findOne({ email });
//         if (!userRecord) {
//             throw new Error('User not registered');
//         }
//         /**
//          * We use verify from argon2 to prevent 'timing based' attacks
//          */
//         this.logger.silly('Checking password');
//         const validPassword = await argon2.verify(userRecord.password, password);
//         if (validPassword) {
//             this.logger.silly('Password is valid!');
//             this.logger.silly('Generating JWT');
//             const token = this.generateToken(userRecord);

//             const user = userRecord.toObject();
//             Reflect.deleteProperty(user, 'password');
//             Reflect.deleteProperty(user, 'salt');
//             /**
//              * Easy as pie, you don't need passport.js anymore :)
//              */
//             return { user, token };
//         } else {
//             throw new Error('Invalid Password');
//         }
//     }

//     private generateToken(user) {
//         const today = new Date();
//         const exp = new Date(today);
//         exp.setDate(today.getDate() + 60);

//         /**
//          * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
//          * The cool thing is that you can add custom properties a.k.a metadata
//          * Here we are adding the userId, role and name
//          * Beware that the metadata is public and can be decoded without _the secret_
//          * but the client cannot craft a JWT to fake a userId
//          * because it doesn't have _the secret_ to sign it
//          * more information here: https://softwareontheroad.com/you-dont-need-passport
//          */
//         this.logger.silly(`Sign JWT for userId: ${user._id}`);
//         return jwt.sign(
//             {
//                 _id: user._id, // We are gonna use this in the middleware 'isAuth'
//                 role: user.role,
//                 name: user.name,
//                 exp: exp.getTime() / 1000,
//             },
//             config.jwtSecret,
//         );
//     }
// }
