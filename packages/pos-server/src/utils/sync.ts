import { snakecase, camelcase } from 'lodash';
import { Changes } from '../services';

export const toClient = (changes: Record<string, any>[]) =>
    changes.map(change => Object.keys(change).reduce((out, key) => ({ ...out, [snakecase(key)]: change[key] }), {}));

export const fromClient = (changes: Record<string, any>[]) =>
    changes.map(change => Object.keys(change).reduce((out, key) => ({ ...out, [camelcase(key)]: change[key] }), {}));

export const toClientChanges = (changes: Changes) =>
    Object.keys(changes).reduce(
        (out, key) => ({
            ...out,
            key: {
                ...changes[key], // deleted
                created: toClient(changes[key].created),
                updated: toClient(changes[key].updated),
            },
        }),
        {} as Changes,
    );
