import { ICPLanding } from './icp-landing';
import { getICPContent } from '@/components/solucoes/content/icp-content';

const content = getICPContent('empreendedores')!;

export default function EmpreendedoresPage() {
  return <ICPLanding content={content} />;
}
