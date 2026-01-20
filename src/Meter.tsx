import styled from 'styled-components';
import { storeMeter } from './rootStore.ts';
import type { MeterWithAreaDetails } from './types';

const Cell = styled.div`
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
`;
const DeleteBtn = styled.button`
  background-image: url('../src/assets/delete.svg');
  width: 40px;
  height: 40px;
  background-color: #fed7d7;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  border-radius: 6px;
  display: none;
  padding: 16px 8px;
  cursor: pointer;
`;
const Wrapper = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 0.5fr 1fr 1.5fr 1fr 2fr 3fr 2fr;
  min-height: 62px;
  &:hover {
    background-color: #e0e5eb;
    cursor: pointer;
  }
  &:hover ${DeleteBtn} {
    display: flex;
  }
`;

const DeleteBtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const Img = styled.img`
  margin-right: 3px;
`;

const Meter = ({
  meter,
  index,
}: {
  meter: MeterWithAreaDetails;
  index: number;
}) => {
  let meterType = '';
  let meterIcon = '';
  if (meter._type.includes('ColdWaterAreaMeter')) {
    meterType = 'ХВС';
    meterIcon = '../src/assets/hvs.svg';
  } else if (meter._type.includes('HotWaterAreaMeter')) {
    meterType = 'ГВС';
    meterIcon = '../src/assets/gvs.svg';
  }
  const date = new Date(meter.installation_date).toLocaleDateString('ru-RU');

  return (
    <Wrapper>
      <Cell>{index}</Cell>
      <Cell>
        <Img src={meterIcon} alt="Иконка типа счетчика" />
        {meterType}
      </Cell>
      <Cell>{date}</Cell>
      <Cell>{meter.is_automatic ? 'да' : 'нет'}</Cell>
      <Cell>
        {meter.initial_values.map((el) => (
          <div>{el}</div>
        ))}
      </Cell>
      <Cell>
        {meter.areaDetails.house.address} {meter.areaDetails.str_number_full}
      </Cell>
      <Cell>
        <DeleteBtnWrapper>
          <span>{meter.description}</span>
          <DeleteBtn onClick={() => storeMeter.deleteMeter(meter.id)} />
        </DeleteBtnWrapper>
      </Cell>
    </Wrapper>
  );
};

export default Meter;
