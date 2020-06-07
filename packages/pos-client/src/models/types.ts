// TODO: These types have been created temporatily - Look more closely at the current watermelon types.

interface ObservableRelation<T> {
  fetch: () => Promise<T[]>;
}

interface ObservableQuery<T> {
  fetch: () => Promise<T[]>;
}
export interface TimeStampedModel {
    createdAt: Date,
    updatedAt: Date
  }