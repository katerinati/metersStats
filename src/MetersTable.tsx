import Meter from './Meter.tsx';
import { storeMeter } from './rootStore.ts';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Pagination from './Pagination.tsx';
import { useEffect } from 'react';

const Wrapper = styled.div`
  height: 700px; /* общая высота */
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 1408px;
  border: 1px solid #e0e5eb;
  border-radius: 16px;
`;

const Table = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr 1.5fr 1fr 2fr 3fr 2fr;
  border-bottom: 1px solid #ddd;
`;

const HeaderCell = styled.div`
  padding: 8px 12px;
  background: #f0f3f7;
  font-weight: 600;
  color: #697180;
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Footer = styled.div`
  display: flex;
  padding: 8px 16px;
  border-top: 1px solid #eef0f4;
  justify-content: right;
`;

const MetersTable = observer(() => {
  useEffect(() => {
    storeMeter.fetchMeters(storeMeter.offset);
  }, [storeMeter.offset]);

  if (storeMeter.error) {
    return <div>Ошибка</div>;
  }

  return (
    <Wrapper>
      <Table>
        <HeaderRow>
          <HeaderCell>№</HeaderCell>
          <HeaderCell>Тип</HeaderCell>
          <HeaderCell>Дата установки</HeaderCell>
          <HeaderCell>Автоматический </HeaderCell>
          <HeaderCell>Текущие показания </HeaderCell>
          <HeaderCell>Адрес </HeaderCell>
          <HeaderCell>Примечание </HeaderCell>
        </HeaderRow>
      </Table>
      <Body>
        {storeMeter.loading ? (
          <div>Загрузка</div>
        ) : (
          <>
            {storeMeter.metersWithAreas.map((meter, index) => (
              <>
                <Meter
                  key={meter.id}
                  index={storeMeter.offset + index + 1}
                  meter={meter}
                />
              </>
            ))}
          </>
        )}
      </Body>
      <Footer>
        <Pagination
          currentPage={storeMeter.currentPage}
          onChange={storeMeter.updatePage}
          totalPages={storeMeter.pagesCount}
        />
      </Footer>
    </Wrapper>
  );
});

export default MetersTable;
