import { TenantModel } from '../../models/utils/multiTenant';
import mongoose from 'mongoose';
import { Container } from 'typedi';
import { omit } from 'lodash';
import { InsertWriteOpResult } from 'mongodb';

export interface RepositoryFns<T> {
    findAll: () => Promise<T[]>;
    create: (props: T) => Promise<T>;
    findOne: (props: Partial<T>) => Promise<T>;
    findByIdAndUpdate: (id: string, props: Partial<T>) => Promise<T>;
    findById: (id: string) => Promise<T>;
    insert: (docs: T[]) => Promise<InsertWriteOpResult<any>>; // TODO: fix type
}

const getTenant = () => ({
    tenantId: Container.get('organizationId') as string, // TODO: type no cast
});

const clean = (doc: mongoose.Document) => {
    return omit(doc.toObject(), 'tenantId');
};

export const repository = <T, U>({
    model,
    tenanted = true,
    fns,
}: {
    model: TenantModel<T>;
    tenanted?: boolean;
    // fns: <U extends Partial<RepositoryFns<T>>>(fns: RepositoryFns<T>) => U;
    // fns: <U>(fns: RepositoryFns<T>) => U;
    fns: (fns: RepositoryFns<T>) => U;
}) => {
    const findAll = async () => {
        const docs = await model(tenanted && getTenant()).find({});
        return docs.map(doc => clean(doc));
    };

    const create = async props => {
        const filteredProps = omit(props, 'tenantId');
        const doc = await model(tenanted && getTenant()).create(filteredProps);
        return clean(doc);
    };

    const insert = async docs => {
        const filteredDocs = docs.map(doc => omit(doc, 'tenantId'));
        const result = await model(tenanted && getTenant()).collection.insert(filteredDocs);
        return result;
    };

    const findOne = async props => {
        const doc = await model(tenanted && getTenant()).findOne(props);
        return clean(doc);
    };

    const findByIdAndUpdate = async (id, props) => {
        const filteredProps = omit(props, 'tenantId');
        const updatedDoc = await model(tenanted && getTenant()).findByIdAndUpdate(id, filteredProps, { new: true });
        return clean(updatedDoc);
    };

    const findById = async id => await model(tenanted && getTenant()).findById(id);

    return fns({ findAll, create, findOne, findByIdAndUpdate, findById, insert });
};
