import winston from 'winston';
import config from '../config';
// import { MailService } from '@sendgrid/mail';

export interface InjectedMailerDependencies {
    mailer: any; // TODO: fix
    logger: winston.Logger;
}

export interface MailerService {
    sendWelcomeEmail: (to: string) => void;
}

export const mailerService = ({ mailer, logger }: InjectedMailerDependencies): MailerService => {
    const sendWelcomeEmail = async to => {
        logger.info(`Sending email to: ${to}`);
        const data = {
            from: config.emails.domain,
            to,
            subject: 'Hello',
            text: 'Welcome to !',
        };
        await mailer.send(data);
    };

    return {
        sendWelcomeEmail,
    };
};
