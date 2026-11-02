import AuctionSearchEntry from '../../../../components/AuctionSearchEntry';
import { auctionMetadata, auctionSchema } from '../../../../lib/auction-seo';
export const metadata = auctionMetadata('fr');
export default function Page() {
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(auctionSchema('fr')).replace(/</g, '\\u003c') }} /><AuctionSearchEntry language="fr" /></>;
}
