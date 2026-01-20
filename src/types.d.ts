import { Instance } from "mobx-state-tree"
import { MeterModel} from './store.ts';

export type MeterType = Instance<typeof MeterModel>

export type AreaType = {
  id: string,
  number: number,
  str_number: string,
  str_number_full: string,
  house: {
    address: string,
    id: string,
    fias_addrobjs: string[]
  }
}

export type MeterWithAreaDetails = MeterType & {
  areaDetails: AreaType
}
