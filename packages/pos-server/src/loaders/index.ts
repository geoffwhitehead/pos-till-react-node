import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import jobsLoader from './jobs';
import logger from './logger';
import extendAuthorize from '../api/middlewares/extendAuthorize';
import { models } from 'mongoose';
import attachTenant from '../api/middlewares/attachTenant';
import express from 'express';

export default async ({ expressApp }: { expressApp: express.Application }) => {
    const mongoConnection = await mongooseLoader();
    logger.info(`✌️ DB loaded and connected!`);



    // inject all the models
    // const userModel = {
    //     name: 'userModel',
    //     // Notice the require syntax and the '.default'
    //     model: require('../models/User').default,
    // };

    // const organizationModel = {
    //     name: 'organizationModel',
    //     model: require('../models/Organization').default,
    // };

    // 3. attaches app dependencies / services to container.
    const { agenda } = await dependencyInjectorLoader({
        mongoConnection,
    });
    logger.info('✌️ Dependency Injector loaded');

    await jobsLoader({ agenda });
    logger.info('✌️ Jobs loaded');

    // use expressApp to parse the jwt and grab the org id
    await expressLoader({ app: expressApp });
    logger.info('✌️ Express loaded');
};
