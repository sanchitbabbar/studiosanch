import type { Metadata } from 'next';
import SiteHeader from '../../components/site/SiteHeader';
import ClientSpace from '../../components/site/ClientSpace';

export const metadata: Metadata = {
  title: 'CLIENT SPACE — STUDIO SANCH',
  description: 'Begin a conversation with Studio Sanch. Film, photography, exhibitions and art installations, conceived around your vision.',
};

export default function ClientPage() {
  return <><SiteHeader active="ACCESS" /><ClientSpace /></>;
}
