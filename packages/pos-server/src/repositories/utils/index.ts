import { TenantModel } from '../../models/utils/multiTenant';
import mongoose from 'mongoose';
import { Container } from 'typedi';
import { omit } from 'lodash';
import { ChangeDocument, ServiceFns } from '../../services';
import { GenericResponseNoData } from '../../utils/types';

export interface RepositoryFns<T> {
    findAll: () => Promise<T[]>;
    create: (props: T) => Promise<T>;
    findOne: (props: Partial<T>) => Promise<T>;
    findByIdAndUpdate: (id: string, props: Partial<T>) => Promise<T>;
    findById: (id: string) => Promise<T>;
    insert: (docs: T[]) => Promise<T[]>; // TODO: fix type
    upsert: <T>(id: string, doc: Omit<T & ChangeDocument, '_id' | 'id'>) => Promise<T>; // TODO: fix type
    deleteOneById: (id: string) => Promise<GenericResponseNoData>;
    createdSince: (timestamp: Date | null) => Promise<T[]>;
    updatedSince: (timestamp: Date | null) => Promise<T[]>;
    deletedSince: (timestamp: Date | null) => Promise<T[]>;
}

export const getTenant = () => ({
    tenantId: Container.get('organizationId') as string,
});

export const clean = (doc: mongoose.Document) => {
    return omit(doc.toObject(), 'tenantId', '__v');
};

export const cleanDocs = (arr: mongoose.Document[]) => arr.map(doc => clean(doc));

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
        const doc = await model(tenanted && getTenant()).create(props);
        return clean(doc);
    };

    const upsert = async (id, props) => {
        console.log('id', id);
        console.log('props', props);
        const doc = await model(tenanted && getTenant()).findByIdAndUpdate(id, props, { upsert: true, new: true });
        return clean(doc as mongoose.Document);
    };

    const insert = async docs => {
        const filteredDocs = docs.map(doc => omit(doc, 'tenantId'));
        const insertedDocs = await model(tenanted && getTenant()).insertMany(filteredDocs); // the mongoose type seems incorrect for this. Should return Array<T & Document>
        //@ts-ignore
        return insertedDocs.map(docs => clean(docs));
    };

    const findOne = async props => {
        const doc = await model(tenanted && getTenant()).findOne(props);
        return doc ? clean(doc) : doc;
    };

    // TODO: implement soft delete function
    const deleteOneById = async id => {
        return {
            success: true,
        };
    };

    const findByIdAndUpdate = async (id, props) => {
        const filteredProps = omit(props, 'tenantId');
        const updatedDoc = await model(tenanted && getTenant()).findByIdAndUpdate(id, filteredProps, { new: true });
        return updatedDoc ? clean(updatedDoc) : updatedDoc;
    };

    const findById = async id => {
        const doc = await model(tenanted && getTenant()).findById(id);
        return doc ? clean(doc) : doc;
    };

    const createdSince = async (timestamp: Date) => {
        const created = await model(tenanted && getTenant()).find(
            timestamp
                ? {
                      createdAt: {
                          $gte: timestamp,
                      },
                  }
                : {},
        );

        return cleanDocs(created);
    };
    const updatedSince = async (timestamp: Date) => {
        const updated = await model(tenanted && getTenant()).find(
            timestamp
                ? {
                      createdAt: {
                          $lt: timestamp,
                      },
                      updatedAt: {
                          $gte: timestamp,
                      },
                  }
                : {
                      createdAt: {
                          $lt: timestamp,
                      },
                  },
        );

        return cleanDocs(updated);
    };

    // implement soft delete and query soft deleted records
    const deletedSince = async (timestamp: Date) => [];

    return fns({
        findAll,
        create,
        findOne,
        findByIdAndUpdate,
        findById,
        insert,
        upsert,
        deleteOneById,
        createdSince,
        updatedSince,
        deletedSince,
    });
};
