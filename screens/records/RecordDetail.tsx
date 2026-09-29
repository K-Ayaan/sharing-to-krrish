import type { RecordsScreenProps } from '../../navigation/types';
import RecordDetailView from './RecordDetailView';

export default function RecordDetail({ navigation, route }: RecordsScreenProps<'RecordDetail'>) {
  return (
    <RecordDetailView
      recordId={route.params.recordId}
      onBack={navigation.goBack}
      onAskUs={() => navigation.navigate('AskUsTab', { screen: 'AskUs' })}
      onOpenCertificate={(batchId) =>
        navigation.navigate('ServicesTab', {
          screen: 'Livestock',
          initial: false,
          params: { screen: 'Certificate', params: { batchId } },
        })
      }
    />
  );
}
