import { PageContainer, ProCard } from '@ant-design/pro-components';
import PasienForm from '@/components/PasienForm';

const DaftarPasienPage: React.FC = () => {
  return (
    <PageContainer ghost>
      <ProCard direction="column" ghost gutter={[0, 8]}>
        <ProCard layout="default" bordered>
          <PasienForm IsCreate={true} />
        </ProCard>
      </ProCard>
    </PageContainer >
  );
};

export default DaftarPasienPage;