// import { Request, Response, NextFunction } from 'express';
// import * as jwt from 'jsonwebtoken';
// import config from '../../config/config';
// import { setTenantId } from '../contexts';
// import unless from 'express-unless';

// export const extendAuthorize = (options: any) => {
//     const middleware = (req: Request, res: Response, next: NextFunction): Promise<void> => {
//         //Get the jwt token from the head
//         const authHeader = req.headers['authorization'] as string;
//         //Try to validate the token and get data
//         try {
//             if (!authHeader.startsWith('Bearer ')) {
//                 throw new Error();
//             }
//             const token = authHeader.slice(7, authHeader.length).trimLeft();
//             const jwtPayload = jwt.verify(token, config.jwtSecret);

//             // send jwt back to user. TODO: needs updating. sessions. new token etc
//             res.locals.jwtPayload = jwtPayload;

//             setTenantId('test');
//         } catch (error) {
//             console.error('error', error);
//             res.status(401).send('invalid jwt');
//             return;
//         }

//         // //The token is valid for 1 hour
//         // //We want to send a new token on every request
//         // const { userId, email } = jwtPayload;
//         // const newToken = jwt.sign({ userId, email }, config.jwtSecret, {
//         //     expiresIn: '1h',
//         // });
//         // res.setHeader('token', newToken);

//         //Call the next middleware or controller
//         next();
//     };

//     middleware.unless = unless;

//     return middleware as unless.RestrictableRequestHandler;
// };
