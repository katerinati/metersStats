import { MeterStore } from './store.ts';

export const storeMeter = MeterStore.create({
  meters: [],
  loading: false,
  error: null,
  currentPage: 1,
  count: 0,
  pageSize: 20,
});
