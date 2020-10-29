import { snakeCase, camelCase } from 'lodash';
import { ChangeDocument, Changes } from '../services';

const toClient = (changes: ChangeDocument[]) => {
    return changes.map(change =>
        Object.keys(change).reduce((out, key) => ({ ...out, [snakeCase(key)]: change[key] }), {} as ChangeDocument),
    );
};

const fromClient = (changes: ChangeDocument[]) => {
    return changes.map(change =>
        Object.keys(change).reduce((out, key) => ({ ...out, [camelCase(key)]: change[key] }), {} as ChangeDocument),
    );
};

const parseChanges = (changes: Changes, mapper: typeof toClient | typeof fromClient) => {
    // TODO: Dont think its necessary to remap most fields now except id. Front end required id ... not _id/.
    return Object.keys(changes).reduce((out, key) => {
        return {
            ...out,
            [key]: {
                deleted: changes[key].deleted, // deleted
                created: mapper(changes[key].created),
                updated: mapper(changes[key].updated),
            },
        };
    }, {} as Changes);
};

export const fromClientChanges = (changes: Changes): Changes => parseChanges(changes, fromClient);
export const toClientChanges = (changes: Changes): Changes => parseChanges(changes, toClient);
