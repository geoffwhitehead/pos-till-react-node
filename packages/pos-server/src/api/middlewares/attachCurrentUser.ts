import { Container } from 'typedi';
import mongoose from 'mongoose';
import { UserProps } from '../../models/User';
import { Logger } from 'winston';
import { OrganizationProps } from '../../models/Organization';
/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (req, res, next) => {
    const Logger = Container.get('logger') as Logger;
    try {
        const UserModel = Container.get('userModel') as mongoose.Model<UserProps & mongoose.Document>;
        const OrganizationModel = Container.get('organizationModel') as mongoose.Model<
            OrganizationProps & mongoose.Document
        >;
        const userRecord = await UserModel.findById(req.token.userId);
        if (!userRecord) {
            return res.sendStatus(401);
        }
        const organizationRecord = await OrganizationModel.findById(req.token.organizationId);

        const user = userRecord.toObject();
        const organization = organizationRecord.toObject();
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');

        req.user = user;
        req.organization = organization;

        return next();
    } catch (e) {
        Logger.error('🔥 Error attaching user to req: %o', e);
        return next(e);
    }
};

export default attachCurrentUser;
