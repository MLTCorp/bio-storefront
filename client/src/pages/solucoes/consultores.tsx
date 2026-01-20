import { ICPLanding } from './icp-landing';
import { getICPContent } from '@/components/solucoes/content/icp-content';

const content = getICPContent('consultores')!;

export default function ConsultoresPage() {
  return <ICPLanding content={content} />;
}
