import { ICPLanding } from './icp-landing';
import { getICPContent } from '@/components/solucoes/content/icp-content';

const content = getICPContent('influenciadores')!;

export default function InfluenciadoresPage() {
  return <ICPLanding content={content} />;
}
