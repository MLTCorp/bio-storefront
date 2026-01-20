import { ICPLanding } from './icp-landing';
import { getICPContent } from '@/components/solucoes/content/icp-content';

const content = getICPContent('criativos')!;

export default function CriativosPage() {
  return <ICPLanding content={content} />;
}
