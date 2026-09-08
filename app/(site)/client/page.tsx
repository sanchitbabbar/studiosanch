import type { Metadata } from 'next';
import SiteHeader from '../../components/site/SiteHeader';
import ClientSpace from '../../components/site/ClientSpace';

export const metadata: Metadata = {
  title: 'CLIENT SPACE — STUDIO SANCH',
  description: 'Begin a conversation with Studio Sanch. Film, photography, exhibitions and art installations, conceived around your vision.',
  alternates: { canonical: '/client/' },
  openGraph: {
    type: 'website',
    title: 'CLIENT SPACE — STUDIO SANCH',
    description: 'A private space for developing film, photography, exhibitions and art installations.',
    url: 'https://studiosanch.com/client/',
    siteName: 'Studio Sanch',
    images: [{
      url: 'https://studiosanch.com/images/client-space-social-preview.jpg',
      width: 1200,
      height: 630,
      alt: 'Studio Sanch — Client Space',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CLIENT SPACE — STUDIO SANCH',
    description: 'A private space for developing film, photography, exhibitions and art installations.',
    images: ['https://studiosanch.com/images/client-space-social-preview.jpg'],
  },
};

export default function ClientPage() {
  return <><SiteHeader active="ACCESS" /><ClientSpace /></>;
}
