import { snakecase, camelcase } from 'lodash';
import { Changes } from '../services';

export const toClient = (changes: Record<string, any>[]) =>
    changes.map(change => Object.keys(change).reduce((out, key) => ({ ...out, [snakecase(key)]: change[key] }), {}));

export const fromClient = (changes: Record<string, any>[]) =>
    changes.map(change => Object.keys(change).reduce((out, key) => ({ ...out, [camelcase(key)]: change[key] }), {}));

export const parseChanges = (changes: Changes, mapper: typeof toClient | typeof fromClient) =>
    Object.keys(changes).reduce(
        (out, key) => ({
            ...out,
            [key]: {
                ...changes[key], // deleted
                created: mapper(changes[key].created),
                updated: mapper(changes[key].updated),
            },
        }),
        {} as Changes,
    );

export const fromClientChanges = (changes: Changes) => parseChanges(changes, fromClient);
export const toClientChanges = (changes: Changes) => parseChanges(changes, toClient);
