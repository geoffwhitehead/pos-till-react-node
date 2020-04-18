import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import jobsLoader from './jobs';
import Logger from './logger';

export default async ({ expressApp }) => {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    const mongoConnection = await mongooseLoader();
    Logger.info(`✌️ DB loaded and connected!`);
    console.log('!!!!! logger loaded');
    // use expressApp to parse the jwt and grab the org id
    Logger.info('testtstetstettstet');
    Logger.info('testtstetstettstet');
    Logger.info('testtstetstettstet');
    Logger.info('testtstetstettstet');
    Logger.info('testtstetstettstet');
    Logger.info('testtstetstettstet');
    Logger.info('testtstetstettstet');
    Logger.info('testtstetstettstet');
    Logger.info('testtstetstettstet');
    // inject all the models
    const userModel = {
        name: 'userModel',
        // Notice the require syntax and the '.default'
        model: require('../models/user').default,
    };

    // It returns the agenda instance because it's needed in the subsequent loaders
    const { agenda } = await dependencyInjectorLoader({
        mongoConnection,
        models: [
            userModel,
            // salaryModel,
            // whateverModel
        ],
    });
    Logger.info('✌️ Dependency Injector loaded');

    await jobsLoader({ agenda });
    Logger.info('✌️ Jobs loaded');

    await expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded');
};
