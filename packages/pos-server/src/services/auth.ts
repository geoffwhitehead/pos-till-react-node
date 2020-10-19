import Container from 'typedi';
import jwt from 'jsonwebtoken';
// import MailerService from './mailer';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { InjectedDependencies, ServiceResponse } from '.';
import { OrganizationProps } from '../models/Organization';
import { UserProps, UserPropsFull } from '../models/User';
import { createLoggerContext } from '../loaders/logger';
import { omit } from 'lodash';
import uuid from 'uuid';

export interface AuthService {
    signUp: (
        params: UserPropsFull & OrganizationProps,
    ) => Promise<ServiceResponse<UserProps & { organizationId: string }> & AuthTokens>;
    signIn: (params: {
        email: string;
        password: string;
    }) => Promise<ServiceResponse<UserProps & { organizationId: string }> & AuthTokens>;
    refreshTokens: (params: {
        accessToken: string;
        refreshToken: string;
    }) => Promise<ServiceResponse<UserProps & { organizationId: string }> & AuthTokens>;
}

export const serviceName = 'authService';

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

const createTokens = (params: {
    organizationId: string;
    userId: string;
    accessTokenSecret: string;
    refreshTokenSecret: string;
}): Promise<[string, string]> => {
    const { userId, organizationId, accessTokenSecret, refreshTokenSecret } = params;

    const createAccessToken = jwt.sign(
        {
            userId,
            organizationId,
        },
        accessTokenSecret,
        {
            expiresIn: '1m',
        },
    );

    const createRefreshToken = jwt.sign(
        {
            userId,
            organizationId,
        },
        refreshTokenSecret,
        {
            expiresIn: '7d',
        },
    );

    return Promise.all([createAccessToken, createRefreshToken]);
};

export const authService = ({
    repositories: { userRepository, organizationRepository },
    logger,
    mailer,
    config,
}: InjectedDependencies): AuthService => {
    const signUp: AuthService['signUp'] = async params => {
        const loggerContext = createLoggerContext({ service: serviceName, fn: 'signUp' });

        const { firstName, lastName, password, email, name, phone, address } = params;

        logger.info('Hashing password', loggerContext);
        const hashedPassword = await argon2.hash(password, { salt: randomBytes(32) });

        const organizationRecord = await organizationRepository.create({ name, email, phone, address, syncId: uuid() });
        logger.info(`Created organization: ${organizationRecord._id}`, loggerContext);

        console.log('organizationRecord', organizationRecord);
        if (!organizationRecord) {
            logger.error('Organization not found', loggerContext);
            return {
                success: false,
            };
        }

        Container.set('organizationId', organizationRecord._id);

        logger.info('Creating user db record', { ...loggerContext, organizationId: organizationRecord._id });
        const userRecord = await userRepository.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        if (!userRecord) {
            logger.error('Failed to create user', { ...loggerContext, organizationId: organizationRecord._id });
            // TODO: reverse org creation
            return {
                success: false,
            };
        }

        logger.info('Generating JWT', {
            ...loggerContext,
            organizationId: organizationRecord._id,
            userId: userRecord._id,
        });

        const [accessToken, refreshToken] = await createTokens({
            userId: userRecord._id,
            organizationId: organizationRecord._id,
            accessTokenSecret: config.accessTokenSecret,
            refreshTokenSecret: constructRefreshSecret(config.refreshTokenSecret, hashedPassword),
        });

        // save the generated token to the user object
        await userRepository.findByIdAndUpdate(userRecord._id, { refreshToken });

        logger.info('Sending welcome email', {
            ...loggerContext,
            organizationId: organizationRecord._id,
            userId: userRecord._id,
        });

        await mailer.sendWelcomeEmail(userRecord.email);

        // TODO: events
        // eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

        return {
            success: true,
            data: { ...omit(userRecord, 'refreshToken'), organizationId: organizationRecord._id },
            accessToken,
            refreshToken,
        };
    };

    const constructRefreshSecret = (token: string, hashedPassword: string) => token + hashedPassword;

    const signIn: AuthService['signIn'] = async (params: { email: string; password: string }) => {
        /**
         * TODO: app currently only support 1 user with email address matching company email
         * In future will need to refactor this. Perhaps by creating tenantless auth model which contains
         * mapping from user to organization
         */
        const { email, password } = params;

        const loggerContext = createLoggerContext({ service: serviceName, fn: 'signUp' }, { email });

        logger.info(`Attempting to sign in`, loggerContext);

        const organization = await organizationRepository.findOne({ email });

        if (!organization) {
            logger.error('Organization not found', loggerContext);
            return { success: false };
        }

        Container.set('organizationId', organization._id);

        logger.info('Finding user', { loggerContext, organization: organization._id });

        const user = await userRepository.findOneFull({ email });
        if (!user) {
            logger.error('User not found', { loggerContext, organization: organization._id });
            return { success: false };
        }

        const updatedContext = { ...loggerContext, userId: user._id, organizationId: organization._id };

        Container.set('organizationId', organization._id);

        logger.info('Checking password', updatedContext);

        const validPassword = await argon2.verify(user.password, password);

        if (!validPassword) {
            logger.error('Password invalid', updatedContext);
            return { success: false };
        }

        logger.info('Generating JWT', updatedContext);
        const [accessToken, refreshToken] = await createTokens({
            organizationId: organization._id,
            userId: user._id,
            accessTokenSecret: config.accessTokenSecret,
            refreshTokenSecret: constructRefreshSecret(config.refreshTokenSecret, user.password),
        });

        logger.info('Updating user with new refesh token', updatedContext);
        await userRepository.findByIdAndUpdate(user._id, { refreshToken });

        const response = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            _id: user._id,
            organizationId: organization._id,
        };

        return { success: true, data: response, accessToken, refreshToken };
    };

    const refreshTokens: AuthService['refreshTokens'] = async (params: {
        accessToken: string; // not used
        refreshToken: string;
    }) => {
        console.log('accessToken', params.accessToken);
        console.log('refreshToken', params.refreshToken);
        const loggerContext = createLoggerContext({
            service: serviceName,
            fn: 'refreshTokens',
        });

        const { refreshToken } = params;

        let refreshUserId = null;
        let refreshOrganizationId = null;

        logger.info('Decoding JWT', loggerContext);

        try {
            const decodedToken = jwt.decode(refreshToken);
            refreshUserId = decodedToken.userId;
            refreshOrganizationId = decodedToken.organizationId;
        } catch (err) {
            logger.error('Error decoding token', { ...loggerContext, err });
            return { success: false };
        }

        if (!refreshUserId) {
            logger.error('User _id not found in refresh token', loggerContext);
            return { success: false };
        }

        if (!refreshOrganizationId) {
            logger.error('Org _id not found in refresh token', loggerContext);
            return { success: false };
        }

        Container.set('organizationId', refreshOrganizationId);
        Container.set('userId', refreshUserId);

        const updatedCtx = { ...loggerContext, organizationId: refreshOrganizationId, userId: refreshUserId };
        logger.info('Fetching user', updatedCtx);

        const user = await userRepository.findOneFull({ _id: refreshUserId });

        const { firstName, lastName, email, _id, password } = user;

        if (!user) {
            logger.error('User not found in db', updatedCtx);
            return { success: false };
        }

        try {
            jwt.verify(refreshToken, constructRefreshSecret(config.refreshTokenSecret, password));
        } catch (err) {
            logger.error('Failed to verify refresh token', { ...updatedCtx, err });
            logger.debug(err);
            return { success: false };
        }

        logger.info('Creating new tokens', updatedCtx);
        const [newAccessToken, newRefreshToken] = await createTokens({
            organizationId: refreshOrganizationId,
            userId: refreshUserId,
            accessTokenSecret: config.accessTokenSecret,
            refreshTokenSecret: constructRefreshSecret(config.refreshTokenSecret, password),
        });

        logger.info('Updating user with new refesh token', updatedCtx);
        await userRepository.findByIdAndUpdate(_id, { refreshToken });

        // TODO: check update occured

        return {
            success: true,
            data: {
                firstName,
                lastName,
                email,
                organizationId: refreshOrganizationId,
                _id,
            },
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    };

    return {
        signUp,
        signIn,
        refreshTokens,
    };
};
