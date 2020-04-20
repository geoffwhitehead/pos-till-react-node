import mongoose, { model, Document, Schema, Model } from 'mongoose';
// import { getTenantId } from '../contexts';

// export const tenantModel: TenantModel<T> => <T extends Document>(name, schema, options) => {
export const tenantModel: <T>(
    name: string,
    schema: Schema<T>,
) => (options?: { skipTenant?: boolean; tenantId: string }) => Model<T & Document, {}> = (name, schema) => {
    return ({ tenantId, skipTenant }): any => {
        // TODO: fix types here
        schema.add({ tenantId: String });
        const Model = model(name, schema);

        if (skipTenant) return Model;

        Model.schema.set('discriminatorKey', 'tenantId');

        // const tenantId = getTenantId();
        if (!tenantId) {
            throw new Error('No tenant id found');
        }
        const discriminatorName = `${Model.modelName}-${tenantId}`;
        const existingDiscriminator = (Model.discriminators || {})[discriminatorName];

        return existingDiscriminator || Model.discriminator(discriminatorName, new Schema({}));
    };
};

export const tenantlessModel: <T>(name: string, schema: Schema<T>) => () => Model<T & Document, {}> = (
    name,
    schema,
) => (): any => mongoose.model(name, schema); // TODO: fix types
