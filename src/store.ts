import { cast, types, flow } from 'mobx-state-tree';
import type { AreaType } from './types';

export const MeterModel = types.model('Meter', {
  id: types.string,
  _type: types.array(types.string),
  installation_date: types.string,
  area: types.model({
    id: types.string,
  }),
  is_automatic: types.maybeNull(types.boolean),
  initial_values: types.array(types.number),
  address: types.array(types.string),
  description: types.maybeNull(types.string),
});

export const MeterStore = types
  .model('MeterStore', {
    meters: types.array(MeterModel),
    loading: types.boolean,
    error: types.maybeNull(types.string),
    count: types.number,
    currentPage: types.number,
    pageSize: types.number,
    loadingAreaIds: types.array(types.string),
    areasMap: types.map(types.frozen()),
  })
  .actions((self) => ({
    deleteMeter: (meterId: string) => {
      try {
        self.loading = true;
        self.meters.replace(self.meters.filter((m) => m.id !== meterId));
      } catch (e: any) {
        self.error = e.message;
      } finally {
        self.loading = false;
      }
    },
    updatePage: (page: number) => {
      self.currentPage = page;
    },
    fetchMeters: flow(function* (offset: number) {
      self.loading = cast(true);
      try {
        const response: Response = yield fetch(
          `https://showroom.eis24.me/c300/api/v4/test/meters/?limit=${self.pageSize}&offset=${offset}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = yield response.json();
        self.meters = data.results;
        self.count = data.count;

        const areasIds = self.meters.map((el) => el.area?.id).filter(Boolean);
        const uniqueAreasIds = [...new Set(areasIds)];
        const idsToFetch = uniqueAreasIds.filter(
          (id) =>
            !self.areasMap.has(String(id)) && !self.loadingAreaIds.includes(id)
        );

        if (idsToFetch.length === 0) {
          self.loading = cast(false);
          return;
        }

        self.loadingAreaIds.push(...idsToFetch);

        const fetchArea = flow(function* (id: string) {
          const response: Response = yield fetch(
            `https://showroom.eis24.me/c300/api/v4/test/areas/${id}/`
          );
          return yield response.json();
        });

        const areas: AreaType[] = yield Promise.all(
          idsToFetch.map((id) => fetchArea(id))
        );

        areas.forEach((area) => {
          self.areasMap.set(String(area.id), area);
        });

        self.loadingAreaIds.replace(
          self.loadingAreaIds.filter((id) => !idsToFetch.includes(id))
        );

        self.loading = cast(false);
      } catch (e: any) {
        console.log('error', e);
      } finally {
        console.log('finally');
      }
    }),
  }))
  .views((self) => ({
    get metersWithAreas() {
      return self.meters.map((meter) => {
        return {
          ...meter,
          areaDetails: meter.area?.id
            ? self.areasMap.get(String(meter.area.id))
            : null,
        };
      });
    },
    get pagesCount() {
      return Math.round(self.count / self.pageSize);
    },
    get offset() {
      return (self.currentPage - 1) * self.pageSize;
    },
  }));
