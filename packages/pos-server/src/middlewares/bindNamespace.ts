import { Response, NextFunction } from 'express';
import { AuthRequest } from './extendAuthorize';
import { ns } from '../contexts';

export const bindNamespace = (req: AuthRequest, res: Response, next: NextFunction): void => {
    ns.bindEmitter(req);
    ns.bindEmitter(res);

    ns.run(() => {
        next();
    });
};
