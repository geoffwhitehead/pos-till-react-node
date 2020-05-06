import mongoose, { model, Document, Schema, Model } from 'mongoose';

export type TenantModel<T> = (options?: { skipTenant?: boolean; tenantId: string }) => Model<T & Document, {}>;

export interface TenantedModel {
    readonly tenantId?: string;
}

export const tenantModel: <T>(name: string, schema: Schema<T>) => TenantModel<T> = (name, schema) => {
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

export const tenantlessModel: <T>(name: string, schema: Schema<T>) => TenantModel<T> = (name, schema) => () =>
    mongoose.model(name, schema); // TODO: fix types
