import Container from 'typedi';
import jwt from 'jsonwebtoken';
// import MailerService from './mailer';
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { InjectedDependencies } from '.';
import { OrganizationProps } from '../models/Organization';
import { UserProps, UserPropsFull } from '../models/User';

export interface AuthService {
    signUp: (params: UserPropsFull & OrganizationProps) => Promise<UserProps & { token: string }>;
    signIn: (params: { email: string; password: string }) => Promise<UserProps & { token: string }>;
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
    mailer,
}: InjectedDependencies): AuthService => {
    const signUp = async params => {
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
            await mailer.sendWelcomeEmail(userRecord.email);

            // TODO: events
            // eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

            return { ...userRecord, token };
        } catch (e) {
            logger.error(e);

            // TODO: remove changes - org and user
            throw e;
        }
    };

    const signIn = async params => {
        /**
         * TODO: app currently only support 1 user with email address matching company email
         * In future will need to refactor this. Perhaps by creating tenantless auth model which contains
         * mapping from user to organization
         */

        const { email, password } = params;
        logger.info(`Called sign in with: ${params}`);

        const organization = await organizationRepository.findOne({ email });
        if (!organization) {
            logger.error('Organization not found');
            throw new Error('User not found');
        }

        Container.set('organizationId', organization._id);

        const user = await userRepository.findOneFull({ email });
        if (!user) {
            logger.error('User not found');
            throw new Error('User not found');
        }

        Container.set('organizationId', organization._id);

        logger.silly('Checking password');

        const validPassword = await argon2.verify(user.password, password);
        if (validPassword) {
            logger.silly('Password is valid!');
            logger.silly('Generating JWT');
            const token = generateToken({ organizationId: organization._id, userId: user._id });

            userRepository.updateById(user._id, { token });

            const { firstName, lastName, email } = user;
            return { firstName, lastName, email, token };
        } else {
            throw new Error('Invalid Password');
        }
    };

    return {
        signUp,
        signIn,
    };
};
