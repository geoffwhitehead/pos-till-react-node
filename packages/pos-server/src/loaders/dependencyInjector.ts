import { Container } from 'typedi';
import logger from './logger';
import agendaFactory from './agenda';
import config from '../config';
import mail from '@sendgrid/mail';
import { registerServices } from '../services';
import { registerRepositories } from '../repositories';
import { mailerService } from '../services/mailer';

export default ({ mongoConnection }: { mongoConnection }) => {
    try {
        mail.setApiKey(config.emails.apiKey);

        const agenda = agendaFactory({ mongoConnection });
        const mailer = mailerService({ mailer: mail, logger });
        const repositories = registerRepositories();

        // inject loaders into services
        const services = registerServices({ logger, repositories, mailer, config });

        Container.set('agenda', agenda);
        Container.set('logger', logger);
        Container.set('mailer', mail);

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
