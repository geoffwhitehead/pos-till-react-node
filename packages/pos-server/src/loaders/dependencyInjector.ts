import { Container } from 'typedi';
import logger from './logger';
import agendaFactory from './agenda';
import config from '../config';
import mailgun from 'mailgun-js';
import { registerServices } from '../services';
import { registerRepositories } from '../repositories';

export default ({ mongoConnection }: { mongoConnection }) => {
    try {
        const mailer = mailgun({ apiKey: config.emails.apiKey, domain: config.emails.domain });
        const agenda = agendaFactory({ mongoConnection });
        const repositories = registerRepositories();
        // const services = registerServices({ logger, repositories, mailer });
        const services = registerServices({ logger, repositories, mailer });

        Container.set('agenda', agenda);
        Container.set('logger', logger);
        Container.set('mailer', mailer);

        services.map(s => {
            Container.set(s.name, s.service);
        });
        logger.info('✌️ Agenda injected into container');

        return { agenda };
    } catch (e) {
        logger.error('🔥 Error on dependency injector loader: %o', e);
        throw e;
    }
};
