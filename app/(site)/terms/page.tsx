import type { Metadata } from 'next';
import SiteHeader from '../../components/site/SiteHeader';
import SiteFooter from '../../components/site/SiteFooter';

export const metadata: Metadata = {
  title: 'Terms of Sale - Studio Sanch',
  description: 'Terms governing purchases from Studio Sanch.',
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="terms-section">
          <h1>GENERAL TERMS OF SALE AND SERVICE</h1>

          <p>
            These General Terms of Sale and Service (“Terms”) govern every quotation, commission, order,
            sale, licence and service supplied by Studio Sanch SASU, represented by its president
            Sanchit Babbar (“Studio Sanch”, “Studio”,
            “we”, “us”). They apply together with the product page, written quotation, order confirmation
            and any project-specific agreement accepted by the customer (“Customer”, “you”). Mandatory
            consumer law prevails wherever it grants greater protection.
          </p>

          <h2>1. Seller and contact details</h2>
          <p>
            Studio Sanch SASU, trading as SANCH, share capital €500.00, 13 Rue du Ruisseau, 75018 Paris, France.
            SIREN: 108606955. SIRET: 10860695500012. Registered with the RNE on August 27, 2026.
            President: Sanchit Babbar. Email:{' '}
            <a href="mailto:contact@studiosanch.com">contact@studiosanch.com</a>.
            Sanchit Babbar remains the original creator and artiste-auteur of his works and creations.
            Studio Sanch distributes and commercialises them within the rights granted to the company;
            incorporation does not itself transfer his copyright.
          </p>

          <h2>2. Scope, hierarchy and acceptance</h2>
          <p>
            Placing an order, paying a deposit, accepting a quotation or instructing work after receiving
            these Terms constitutes acceptance. A signed project agreement or quotation prevails over these
            Terms only for the points it expressly changes. The order confirmation prevails over general
            promotional material. No Customer purchasing conditions apply unless expressly accepted by the
            Studio in writing. Consumers retain every non-waivable right provided by applicable law.
          </p>

          <h2>3. Studio personnel and production partners</h2>
          <p>
            The Studio may perform work through Sanchit Babbar and selected employees, assistants,
            performers, models, craftspeople, ateliers, photographers, filmmakers, designers, consultants,
            subcontractors, carriers and other production partners (“Studio Personnel”). The Studio remains
            responsible where required by law and may allocate tasks according to creative, technical,
            scheduling and safety requirements. Provisions concerning intellectual property,
            confidentiality, safety, acceptable conduct, indemnities and permitted limitations of liability
            are intended to protect both the Studio and Studio Personnel to the fullest extent permitted by
            law. No Customer acquires an employment, agency, partnership or direct contractual relationship
            with Studio Personnel solely because they participate in a project.
          </p>

          <h2>4. Product and service information</h2>
          <p>
            Essential characteristics, materials, dimensions, edition details, deliverables, formats and
            principal constraints are stated on the relevant page, quotation or creative brief. Screen
            settings, lighting and photographic reproduction may affect perceived colour. Handmade,
            artistic, vintage, experimental and made-to-order work may contain minor irregularities or
            variations inherent to its materials and production method; these are not defects where they do
            not impair the agreed use or conformity of the work. Measurements are approximate unless
            expressly warranted.
          </p>

          <h2>5. Bespoke work, approvals and changes</h2>
          <p>
            Bespoke couture, commissioned artwork, production, direction, styling, photography, film and
            other creative services require timely Customer cooperation. The Customer must provide accurate
            measurements, specifications, references, access, feedback, permissions and approvals. Written
            approval of a concept, proof, fitting, edit or production stage authorizes the Studio to proceed.
            Later changes, additional revisions, reshoots, refittings, rush work, storage, travel or third-
            party costs may require a revised schedule and additional fee. The Studio is not responsible for
            delay or additional cost caused by incomplete, late or inaccurate Customer information.
          </p>

          <h2>6. Prices, taxes and quotations</h2>
          <p>
            Prices are those displayed or quoted when the order is accepted. The checkout or quotation will
            identify any applicable taxes, delivery, travel, insurance, customs or third-party charges known
            at that time. Customs duties, import taxes and local levies imposed outside France are borne by
            the recipient unless expressly stated otherwise. Quotations remain valid only for the period
            specified and may be revised before acceptance when material, labour, location or supplier costs
            change. A manifest pricing or calculation error does not bind the Studio; the Customer will be
            offered the corrected price or a full cancellation.
          </p>

          <h2>7. Payment, deposits and late payment</h2>
          <p>
            Payment is due according to checkout or the accepted quotation. Bespoke and production work may
            require a non-refundable reservation or commencement deposit to the extent permitted by law,
            reflecting time reserved, preparatory work and committed third-party costs. Ownership and usage
            rights do not transfer before full cleared payment. The Studio may suspend performance or
            delivery for overdue sums after notice. Professional Customers are additionally responsible for
            statutory late-payment interest and recovery compensation where applicable.
          </p>

          <h2>8. Enquiry, quotation and contract formation</h2>
          <p>
            The website operates as a presentation, catalogue and enquiry platform. Submitting a product,
            artwork, couture, production or service request does not itself place an order, reserve production
            capacity or create a contract. After receiving a request, the Studio may contact the prospective
            client to clarify the creative brief, specifications, measurements, intended use, schedule,
            delivery location, rights requirements and other relevant details.
          </p>
          <p>
            Studio Sanch will then issue a written quotation or devis describing the proposed scope,
            deliverables, price, applicable taxes, estimated schedule, payment stages, delivery terms, usage
            rights and any project-specific conditions. The client must review the devis and raise any errors
            or requested changes before acceptance. A contract is formed only when the client accepts the
            devis in the manner stated in it and, where required, the Studio receives the specified deposit or
            initial payment. No work is required to begin before those conditions are met.
          </p>
          <p>
            The Studio may decline a request before contract formation for unavailability, illegality,
            suspected fraud, abusive conduct, safety risk, rights-clearance concerns, technical impossibility
            or conflict with the Studio&apos;s artistic integrity. After formation, cancellation and termination
            are governed by the accepted devis, these Terms and mandatory law. Where cancellation is
            attributable to the Studio and no substitute is agreed, sums paid for unperformed work will be
            returned.
          </p>

          <h2>9. Production schedules, delivery and risk</h2>
          <p>
            Stated schedules are estimates unless a binding date is expressly agreed. Made-to-order pieces
            may require approximately six to eight weeks before dispatch. International shipments may incur
            additional charges based on current carrier rates. The Customer must provide a complete and
            accurate address and cooperate with customs and delivery procedures. For consumers, risk passes
            as provided by mandatory consumer law. For professional Customers, risk passes on delivery to
            the carrier unless otherwise agreed. The Customer must report visible transport damage promptly
            and retain packaging and evidence, without prejudice to statutory rights.
          </p>

          <h2>10. Consumer withdrawal right</h2>
          <p>
            A consumer purchasing a non-personalized good at distance ordinarily has fourteen days from
            receipt to withdraw without giving a reason. For eligible service contracts, the period
            ordinarily runs from contract conclusion. To withdraw, send an unambiguous statement to{' '}
            <a href="mailto:contact@studiosanch.com">contact@studiosanch.com</a> before the deadline. Eligible
            goods must be returned within fourteen days after notice, appropriately protected. Direct return
            costs are borne by the Customer unless otherwise stated or required by law. The Customer may be
            responsible for diminished value caused by handling beyond what is necessary to establish the
            nature, characteristics and functioning of the goods.
          </p>
          <p>
            Where a consumer expressly requests service performance during the withdrawal period, the
            consumer may owe the proportionate price for work performed before withdrawal, as permitted by
            law. The right may be lost for a fully performed service after the consumer&apos;s prior express
            request and acknowledgement where the statutory conditions are satisfied.
          </p>

          <h2>11. Statutory exceptions to withdrawal</h2>
          <p>
            The withdrawal right does not apply where a statutory exception applies, including goods made
            to the consumer&apos;s specifications or clearly personalized. This may include bespoke couture,
            commissioned artworks, personalized accessories and other custom-made pieces. Sealed goods that
            are unsuitable for return for health-protection or hygiene reasons may also be excluded once
            unsealed where the legal conditions are met. These exceptions never remove rights relating to
            damage, non-conformity, hidden defects or other mandatory guarantees.
          </p>

          <h2>12. Returns and refunds</h2>
          <p>
            No discretionary exchange or refund is offered for bespoke, personalized or commissioned work
            merely because the Customer changes their mind. Eligible statutory withdrawals and valid claims
            remain unaffected. Do not return an item without first requesting return instructions. Refunds
            legally due will be made using the original payment method unless otherwise expressly agreed,
            within the applicable statutory period. The Studio may withhold reimbursement until returned
            goods are received or dispatch is evidenced where the law permits.
          </p>

          <h2>13. Legal guarantees and remedies</h2>
          <p>
            Consumer goods benefit from the French legal guarantee of conformity, including responsibility
            for qualifying non-conformities appearing within the statutory two-year period, and from the
            Civil Code guarantee against hidden defects. Depending on the legal conditions, remedies may
            include repair, replacement, price reduction or cancellation. These protections apply
            independently of any commercial guarantee. Nothing in these Terms excludes or reduces them.
          </p>

          <h2>14. Customer materials, permissions and releases</h2>
          <p>
            The Customer warrants that materials, logos, music, footage, images, text, locations, garments,
            products, instructions and other content supplied by or on behalf of the Customer may lawfully be
            used for the project and do not infringe third-party rights. The Customer is responsible for
            obtaining necessary owner, performer, model, location, music, trademark and other releases unless
            the written scope expressly assigns that responsibility to the Studio. The Customer must not ask
            the Studio or Studio Personnel to create unlawful, defamatory, deceptive, discriminatory,
            dangerous or infringing material.
          </p>

          <h2>15. Intellectual property and licence limits</h2>
          <p>
            All pre-existing methods, concepts, sketches, drafts, unused material, raw files, source files,
            designs, treatments, know-how, trademarks and creative tools remain the property of Sanchit
            Babbar or their respective owners. Purchase of a physical object transfers ownership of that
            object only, not copyright. Commissioned deliverables are licensed solely for the media,
            territory, duration and purposes stated in the written agreement. No reproduction, adaptation,
            resale of files, merchandising, training of artificial-intelligence systems, dataset inclusion,
            sublicensing or commercial exploitation is permitted beyond that licence. Additional use
            requires prior written permission and may require an additional fee. Moral rights and all
            ungranted rights are reserved.
          </p>

          <h2>16. Credits, portfolio use and confidentiality</h2>
          <p>
            Required credits will be stated in the project agreement. The Studio will not publicly disclose
            Customer confidential information identified as confidential, except to Studio Personnel who
            need it to perform the work or where disclosure is required by law. Unless otherwise agreed in
            writing, public release and portfolio use of commissioned work will occur only after the work has
            been made public by or with the Customer&apos;s authorization. Embargoes, secrecy requirements and
            special security measures must be agreed in writing before work begins.
          </p>

          <h2>17. Conduct, safety and working environment</h2>
          <p>
            Customers and their representatives must maintain a safe, lawful and respectful working
            environment. Harassment, discrimination, violence, intimidation, unsafe instructions,
            unauthorized recording or conduct that endangers any person, animal, garment, artwork, equipment
            or location is prohibited. The Studio may pause or terminate work and remove Studio Personnel
            from an unsafe or abusive situation. Amounts for work performed and non-cancellable commitments
            remain payable, subject to mandatory law and the circumstances of termination.
          </p>

          <h2>18. Third-party services and dependencies</h2>
          <p>
            Carriers, venues, payment processors, hosting providers, laboratories, ateliers, rental houses,
            platforms and other independent third parties may be governed by their own terms. The Studio will
            exercise reasonable professional care in selection and coordination where they are engaged by
            the Studio, but is not responsible for a third party&apos;s independent acts beyond responsibility
            that cannot lawfully be excluded. Customer-directed suppliers remain the Customer&apos;s
            responsibility unless expressly agreed otherwise.
          </p>

          <h2>19. Force majeure and events beyond control</h2>
          <p>
            Neither party is liable for delay or failure caused by an event meeting the legal definition of
            force majeure, including an event beyond reasonable control whose effects could not reasonably be
            avoided and which prevents performance. Performance is suspended while the impediment continues.
            The affected party will notify the other as soon as reasonably possible and take reasonable steps
            to limit its effects. If performance becomes permanently impossible, the affected obligations may
            be terminated in accordance with French law, with an equitable accounting for completed work and
            recoverable sums.
          </p>

          <h2>20. Liability</h2>
          <p>
            Each party remains responsible for loss directly caused by its contractual breach under
            applicable law. Nothing excludes or limits liability that cannot legally be excluded, including
            mandatory consumer guarantees, fraud, wilful misconduct, gross negligence, death or personal
            injury caused by fault, or infringement of rights where limitation is prohibited. The Studio is
            not responsible for loss caused by inaccurate Customer instructions, unauthorized Customer
            modifications, misuse, abnormal storage or care, ordinary wear, or a Customer&apos;s failure to follow
            supplied guidance.
          </p>
          <p>
            For professional Customers only, and to the fullest extent permitted by law, the Studio and
            Studio Personnel are not liable for indirect or consequential loss, loss of profit, revenue,
            opportunity, goodwill or anticipated savings. Their aggregate contractual liability arising from
            the affected order is limited to the amount actually paid to the Studio for that order, except
            where such limitation is prohibited by law. This paragraph does not apply to consumers.
          </p>

          <h2>21. Professional-customer indemnity</h2>
          <p>
            A professional Customer will indemnify the Studio and Studio Personnel against third-party claims,
            liabilities and reasonable costs arising from materials, instructions or uses supplied or
            directed by that Customer in breach of Section 14 or outside the agreed licence, except to the
            extent caused by the protected party&apos;s own fault. This section does not apply to consumers.
          </p>

          <h2>22. Personal data</h2>
          <p>
            Personal data used for enquiries, orders, payments, delivery and customer administration is
            handled as described in the <a href="/privacy-policy.html">Privacy Policy</a>. Each party must
            protect personal data it controls and use it only on an appropriate legal basis.
          </p>

          <h2>23. Suspension and termination</h2>
          <p>
            A party may terminate for a material breach that is not remedied within a reasonable period after
            written notice, unless the breach is incapable of remedy or immediate termination is legally
            justified. The Studio may suspend work for non-payment, unsafe conditions, illegality or material
            non-cooperation. Termination does not affect accrued payment obligations, ownership, licences,
            confidentiality, liability or provisions intended to survive. Consumer cancellation and
            withdrawal rights remain unaffected.
          </p>

          <h2>24. General provisions</h2>
          <p>
            If a provision is invalid or unenforceable, it will be limited or removed only to the minimum
            extent necessary, and the remainder will continue. Failure to enforce a right is not a waiver.
            The Customer may not assign a bespoke project or licence without written consent, except where
            mandatory law provides otherwise. The Studio may assign administrative receivables or reorganize
            performance without reducing Customer rights. Electronic communications and records may be used
            as evidence subject to applicable law. Headings do not affect interpretation.
          </p>

          <h2>25. Complaints, consumer mediation and law</h2>
          <p>
            Complaints should first be sent to{' '}
            <a href="mailto:contact@studiosanch.com">contact@studiosanch.com</a>. These Terms are governed by
            French law. A consumer also retains mandatory protections and competent courts available under
            applicable consumer law in their country of residence. Professional disputes, after a good-faith
            attempt to resolve them, are subject to the competent courts of Paris unless mandatory law
            requires otherwise. Consumer-mediation information will apply once the Studio&apos;s designated
            mediator has been formally confirmed and published.
          </p>

          <h2>26. Model withdrawal form</h2>
          <p>
            Complete and send this form only if you wish to withdraw from an eligible contract: “To Studio Sanch SASU, 13 Rue du Ruisseau, 75018 Paris, France,
            contact@studiosanch.com: I hereby give notice that I withdraw from my contract for the sale of the
            following goods / provision of the following service: [describe]. Ordered on / received on:
            [date]. Consumer name: [name]. Consumer address: [address]. Signature (only if submitted on
            paper): [signature]. Date: [date].”
          </p>

          <div className="terms-update">
            <p>Version effective and last updated: August 28, 2026</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
