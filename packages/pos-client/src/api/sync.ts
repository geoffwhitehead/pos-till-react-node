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

export const pushChanges = (body: PushChangesRequest) => api.post('/sync', body);
export const pullChanges = (params: PullChangesRequest) => api.get<PullChangesResponse>('/sync', params);
