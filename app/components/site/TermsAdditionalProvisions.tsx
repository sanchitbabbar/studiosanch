'use client';

import { useLanguage } from '../../context/LanguageContext';

export default function TermsAdditionalProvisions() {
  const { language } = useLanguage();

  if (language === 'fr') {
    return (
      <>
        <h2>26. Dispositions particulières</h2>
        <p>
          Les ventes et prestations de Studio Sanch sont soumises aux présentes Conditions Générales de
          Vente et de Service, disponibles sur <a href="https://studiosanch.com">studiosanch.com</a>. Tout
          achat, toute commande, toute acceptation de devis ou tout règlement de facture implique
          l&apos;adhésion entière et sans réserve du Client aux présentes Conditions, sous réserve des droits
          impératifs dont bénéficie le consommateur.
        </p>
        <p>
          <strong>Délais de paiement, pénalités et frais de recouvrement.</strong> Sauf conditions
          particulières écrites, les factures sont payables au comptant à la commande. Pour tout Client
          professionnel, tout retard de paiement entraîne, dès le jour suivant la date d&apos;échéance figurant
          sur la facture, l&apos;application de pénalités calculées au taux d&apos;intérêt appliqué par la Banque
          centrale européenne à son opération de refinancement la plus récente, majoré de dix points de
          pourcentage, conformément à l&apos;article L. 441-10 du Code de commerce. Ces pénalités sont exigibles
          sans qu&apos;un rappel soit nécessaire. Une indemnité forfaitaire de 40 € pour frais de recouvrement
          est également due par tout Client professionnel en retard de paiement, conformément aux articles
          L. 441-9, L. 441-10 et D. 441-5 du Code de commerce. Aucun escompte n&apos;est accordé en cas de paiement
          anticipé, sauf accord écrit contraire.
        </p>
        <p>
          <strong>Réserve de propriété.</strong> Les marchandises, œuvres d&apos;art, livres et articles de
          maroquinerie livrés demeurent la propriété de Studio Sanch SASU jusqu&apos;au paiement intégral de leur
          prix, en principal, frais et accessoires. Le transfert de propriété matérielle n&apos;emporte aucun
          transfert des droits de propriété intellectuelle.
        </p>
        <p>
          <strong>Rétractation, retours et remboursements.</strong> Conformément à l&apos;article L. 221-28 du
          Code de la consommation, le droit de rétractation ne peut notamment être exercé pour les biens
          confectionnés selon les spécifications du consommateur ou nettement personnalisés. Cette exclusion
          peut concerner les œuvres commandées ou personnalisées, les livres d&apos;art numérotés et personnalisés
          par dédicace nominative, les pièces de haute couture sur mesure, ainsi que les articles de
          maroquinerie et créations artisanales uniques confectionnés selon les spécifications de
          l&apos;acquéreur. Aucun échange ni remboursement discrétionnaire n&apos;est accepté après expédition ou
          livraison de ces biens. Les garanties et droits impératifs demeurent pleinement applicables.
        </p>
        <p>
          <strong>Frais de port et de livraison.</strong> Les frais de transport, d&apos;emballage, d&apos;assurance
          et d&apos;expédition sont facturés en sus lorsqu&apos;ils ne sont pas expressément inclus. Ils sont indiqués
          avant la validation définitive de la commande. Les droits de douane, taxes d&apos;importation et
          prélèvements locaux restent à la charge du destinataire, sauf accord écrit contraire.
        </p>
        <p>
          <strong>Exigibilité anticipée.</strong> Pour les Clients professionnels, le non-paiement d&apos;une seule
          facture à son échéance peut, après notification écrite et sous réserve du droit applicable, rendre
          immédiatement exigibles les autres sommes dues et autoriser Studio Sanch à suspendre les
          prestations ou livraisons en cours jusqu&apos;à régularisation.
        </p>
        <p>
          <strong>Vérification et réclamations.</strong> Le Client professionnel doit vérifier les articles dès
          leur réception et signaler par écrit toute anomalie apparente dans un délai maximal de huit jours
          calendaires. Ce délai ne prive aucun consommateur de ses garanties légales et ne fait pas obstacle
          à une réclamation pour vice caché, défaut de conformité ou dommage non décelable à la réception.
        </p>
        <p>
          <strong>Propriété intellectuelle.</strong> Les créations, œuvres, textes, dessins, designs, modèles,
          photographies, films et concepts demeurent la propriété intellectuelle exclusive de Sanchit Babbar,
          de Studio Sanch ou de leurs titulaires respectifs. Toute exploitation non autorisée est interdite.
          Seuls les droits expressément prévus dans un accord écrit sont concédés au Client.
        </p>
        <p>
          <strong>Attribution de juridiction.</strong> Pour tout litige de toute nature ou contestation relative
          à l&apos;interprétation, l&apos;exécution ou la validité de la présente facture et des ventes associées, le
          Tribunal de Commerce de Paris sera seul compétent, nonobstant toute pluralité de défendeurs, demande
          incidente ou appel en garantie. Cette clause s&apos;applique aux relations entre professionnels, sauf
          disposition impérative contraire, et ne s&apos;applique pas aux consommateurs.
        </p>
      </>
    );
  }

  return (
    <>
      <h2>26. Additional payment and sale provisions</h2>
      <p>
        Studio Sanch sales and services are governed by these General Terms of Sale and Service, available
        at <a href="https://studiosanch.com">studiosanch.com</a>. Any purchase, order, acceptance of a quotation
        or payment of an invoice constitutes the Customer&apos;s full and unconditional acceptance of these
        Terms, subject to all mandatory consumer rights.
      </p>
      <p>
        <strong>Payment terms, late-payment interest and recovery costs.</strong> Unless otherwise agreed in
        writing, invoices are payable in full when the order is placed. For professional Customers, any late
        payment automatically incurs interest from the day following the payment date stated on the invoice,
        at the rate applied by the European Central Bank to its most recent refinancing operation plus ten
        percentage points, pursuant to Article L. 441-10 of the French Commercial Code. No reminder is
        required. A professional Customer in arrears must also pay the statutory fixed recovery charge of
        €40 under Articles L. 441-9, L. 441-10 and D. 441-5 of the French Commercial Code. No discount is
        granted for early payment unless otherwise agreed in writing.
      </p>
      <p>
        <strong>Retention of title.</strong> Delivered goods, artworks, books and leather goods remain the
        property of Studio Sanch SASU until their price, costs and ancillary charges have been paid in full.
        Transfer of ownership of a physical item does not transfer any intellectual-property rights.
      </p>
      <p>
        <strong>Withdrawal, returns and refunds.</strong> Under Article L. 221-28 of the French Consumer Code,
        the statutory withdrawal right does not apply, in particular, to goods made to the consumer&apos;s
        specifications or clearly personalized. This may include commissioned or personalized artworks,
        numbered art books personalized with a named dedication, made-to-measure haute couture, and unique
        leather goods or artisanal creations made to the buyer&apos;s specifications. No discretionary exchange
        or refund is accepted after dispatch or delivery of those goods. All mandatory guarantees and
        consumer remedies remain fully applicable.
      </p>
      <p>
        <strong>Shipping and delivery charges.</strong> Transport, packaging, insurance and shipping charges
        are added to the item price unless expressly included. They are disclosed before final confirmation
        of the order. Customs duties, import taxes and local charges are borne by the recipient unless
        otherwise agreed in writing.
      </p>
      <p>
        <strong>Acceleration and suspension.</strong> For professional Customers, non-payment of a single
        invoice when due may, following written notice and subject to applicable law, make all other sums
        immediately payable and allow Studio Sanch to suspend current services or deliveries until payment.
      </p>
      <p>
        <strong>Inspection and claims.</strong> Professional Customers must inspect goods on receipt and report
        any apparent discrepancy in writing within eight calendar days. This period does not restrict any
        consumer&apos;s statutory guarantees or prevent a claim concerning a latent defect, lack of conformity or
        damage that could not reasonably be detected on receipt.
      </p>
      <p>
        <strong>Intellectual property.</strong> Creations, artworks, texts, drawings, designs, models,
        photographs, films and concepts remain the exclusive intellectual property of Sanchit Babbar, Studio
        Sanch or their respective owners. Any unauthorized use is prohibited. Only rights expressly granted
        in a written agreement are licensed to the Customer.
      </p>
      <p>
        <strong>Jurisdiction.</strong> The Paris Commercial Court shall have exclusive jurisdiction over any
        dispute of any nature or disagreement concerning the interpretation, performance or validity of this
        invoice and the associated sales, notwithstanding multiple defendants, incidental claims or third-party
        proceedings. This clause applies to relationships between professionals, unless mandatory law provides
        otherwise, and does not apply to consumers.
      </p>
    </>
  );
}
