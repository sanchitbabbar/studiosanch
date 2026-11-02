import AuctionSearchEntry from '../../../components/AuctionSearchEntry';
import { auctionMetadata, auctionSchema } from '../../../lib/auction-seo';
export const metadata = auctionMetadata('en');
export default function Page() {
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(auctionSchema('en')).replace(/</g, '\\u003c') }} /><AuctionSearchEntry language="en" /></>;
}
