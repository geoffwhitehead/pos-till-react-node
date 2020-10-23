import { StringSchema } from 'yup';
import { api } from '.';

type PullChangesRequest = {
  lastPulledAt: number;
  schemaVersion: string;
  migration?: any; // TODO
};

type PushChangesRequest = {
  changes: any;
  lastPulledAt: number;
};

export type PullChangesResponse = {
  changes: any;
  timestamp: number;
};

export const pushChanges = (body: PushChangesRequest) => api.get('/sync', body);
export const pullChanges = (body: PullChangesRequest) => api.post<PullChangesResponse>('/sync', body);
