import { queryLaporanPendaftaran } from '@/services/baksos/LaporanController';
import { ParseResponseError } from '@/utils/requests';
import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button, notification } from 'antd';
import { useEffect, useState } from 'react';
import Text from 'antd/lib/typography'

const ScreeningPage: React.FC = () => {
  const access = useAccess();
  const [laporanPendaftaran, setLaporanPendaftaran] = useState<any>()

  const getLaporanPendaftaran = () => {
    queryLaporanPendaftaran()
      .then(data => {
        setLaporanPendaftaran(data)
      })
      .catch(err => {
        notification["warning"]({ message: 'Penarikan Laporan Screening Gagal', description: ParseResponseError(err) });
      })
  }

  useEffect(() => {
    getLaporanPendaftaran()
  }, [])

  if (!laporanPendaftaran) return <Text>Loading</Text>

  return (
    <PageContainer ghost>
      {/* <Access accessible={access.canSeeAdmin}>
        <Button>只有 Admin 可以看到这个按钮</Button>
      </Access> */}

    </PageContainer>
  );
};

export default ScreeningPage;
