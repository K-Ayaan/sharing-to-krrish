// A Van Dhan collection opened from My Collections — the same Record Details view Records uses.
import type { VanDhanScreenProps } from '../../navigation/types';
import RecordDetailView from '../records/RecordDetailView';

export default function CollectionDetail({ navigation, route }: VanDhanScreenProps<'CollectionDetail'>) {
  return (
    <RecordDetailView
      recordId={`collection:${route.params.collectionId}`}
      onBack={navigation.goBack}
      onAskUs={() => navigation.navigate('AskUsTab', { screen: 'AskUs' })}
      onOpenCertificate={() => {}}
    />
  );
}
