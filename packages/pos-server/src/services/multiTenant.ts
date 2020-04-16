import mongoose, { model, Document, Schema, Model } from 'mongoose';
import { getTenantId } from '../contexts';

// export const tenantModel: TenantModel<T> => <T extends Document>(name, schema, options) => {
export const tenantModel: <T>(
    name: string,
    schema: Schema<T>,
) => (args: { skipTenant?: boolean }) => Model<T & Document> = (name, schema) => {
    return ({ skipTenant }): any => {
        // TODO: fix types here
        schema.add({ tenantId: String });
        const Model = model(name, schema);

        if (skipTenant) return Model;

        Model.schema.set('discriminatorKey', 'tenantId');

        const tenantId = getTenantId();
        const discriminatorName = `${Model.modelName}-${tenantId}`;
        const existingDiscriminator = (Model.discriminators || {})[discriminatorName];

        return existingDiscriminator || Model.discriminator(discriminatorName, new Schema({}));
    };
};

export const tenantlessModel: <T extends mongoose.Document>(
    name: string,
    schema: Schema<T>,
) => () => Model<T & Document> = (name, schema) => (): any => mongoose.model(name, schema); // TODO: fix types
