import { redirect } from 'next/navigation';

// Preserve the French static homepage while ensuring the directory URL works.
export default function FrenchHomePage() {
  redirect('/fr/index.html');
}
