import React from 'react';
import { FileText, Shield, X } from 'lucide-react';

interface TermsModalProps {
  theme: 'light' | 'night';
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ theme, onClose }) => {
  const isNight = theme === 'night';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl border shadow-2xl p-6 sm:p-10 my-8 max-h-[92vh] overflow-y-auto space-y-6"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
          borderColor: isNight ? '#2C3128' : '#E4E0D4',
          color: isNight ? '#E8E6DE' : '#1C1C1A',
        }}
      >
        <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E8B5E] font-bold">
              Legal Agreement & Platform Policies
            </span>
            <h2 className="text-2xl font-serif font-bold">Terms of Service & Copyright Policy</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lawyer Review Flag from Section 11 */}
        <div
          className="p-4 rounded-2xl border text-xs leading-relaxed"
          style={{
            backgroundColor: isNight ? '#12140F' : '#F4F1E8',
            borderColor: isNight ? '#2C3128' : '#E4E0D4',
            color: isNight ? '#8C9087' : '#5C5F58',
          }}
        >
          <strong className="block text-[#6E8B5E] font-bold mb-0.5">Notice to Users & Administrators:</strong>
          These Terms of Service and Copyright Policies are written in plain English per platform specifications. A qualified legal professional should review them for your specific jurisdiction before commercial deployment.
        </div>

        {/* Required Clauses A through L */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed" style={{ color: isNight ? '#E8E6DE' : '#1C1C1A' }}>
          <section className="space-y-1.5">
            <h3 className="font-bold text-base font-serif text-[#6E8B5E]">A. Platform Purpose</h3>
            <p>
              Jeydahsan is a free platform that allows authors to display their written work online for free public reading. The platform is not a publisher, not an agency, not a broker, and not a marketplace.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-base font-serif text-[#6E8B5E]">B. Ownership of Intellectual Property</h3>
            <p>
              All works remain the sole intellectual property of their respective authors. The platform claims no ownership, no license to sell, and no right to sublicense any written work published on Jeydahsan.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-base font-serif text-[#6E8B5E]">C. No Selling by the Platform</h3>
            <p>
              The platform will not sell, license, distribute, or commercially exploit any author’s work, and will not authorize any third party to do so, without the author’s explicit prior written permission.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-base font-serif text-[#6E8B5E]">D. Contact Introduction Only</h3>
            <p>
              Where a literary buyer, producer, or scout wishes to contact an author, the platform’s sole role is to forward a contact request and record whether the author consents to being introduced. The platform acts only as a passive message relay. It is not a party to, and takes no part in, any agreement, negotiation, or transaction between an author and a buyer.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-base font-serif text-[#6E8B5E]">E. Free Service — Zero Fees</h3>
            <p>
              Jeydahsan is provided entirely free of charge. The platform charges no fee, subscription, commission, royalty, percentage, or other compensation for reading, writing, publishing, hosting, contact requests, introductions, or any resulting transaction. There is no premium tier and no paid feature. Authors and buyers deal directly with one another and the platform receives no part of any deal.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-base font-serif text-[#6E8B5E]">F. Author Consent is Mandatory</h3>
            <p>
              No contact details are shared and no introduction proceeds without the author’s explicit consent. If the author declines, the buyer must contact the author independently. The platform bears no responsibility for any communication, agreement, payment, delivery, or dispute that occurs outside the platform, and the platform is not liable for the conduct of any user.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-base font-serif text-[#6E8B5E]">G. No Involvement in Transactions</h3>
            <p>
              The platform does not participate in, mediate, witness, document, escrow, guarantee, or enforce any transaction. All dealings between authors and buyers, including pricing, contracts, payments, and rights transfer, are conducted entirely at the parties' own risk and outside this platform.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-base font-serif text-[#6E8B5E]">H. Rights Retention & Withdrawal</h3>
            <p>
              Authors may unpublish or delete their work at any time. The platform will remove it from public display within 30 days, excluding cached or archived copies outside the platform’s control.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-base font-serif text-[#6E8B5E]">I. Prohibited Content</h3>
            <p>
              No pornographic or sexually explicit content, no plagiarism, no content the user does not own, no hate speech, no harassment, no illegal content. Violations result in immediate removal and possible account termination.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-base font-serif text-[#6E8B5E]">J. Copyright Complaints (DMCA-Style Takedowns)</h3>
            <p>
              Jeydahsan honors legitimate intellectual property takedown notices. To submit a complaint, report the item using our on-page report tool or contact designated agent at copyright@jeydahsan.com. Repeat infringers will be permanently banned.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-base font-serif text-[#6E8B5E]">K. Content Protection Disclaimer</h3>
            <p>
              The platform applies copy and paste deterrents and per-user invisible watermarking. The platform cannot prevent screenshots on web browsers and does not warrant that content will be immune to copying. Authors retain all enforcement rights.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-base font-serif text-[#6E8B5E]">L. User Conduct & Limitation of Liability</h3>
            <p>
              Users must be 13 years of age or older. Accounts found violating conduct standards or operating automated scrapers are subject to immediate termination. Jeydahsan is provided "as is" without warranty of any kind.
            </p>
          </section>
        </div>

        <div className="pt-4 border-t flex justify-end" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer"
            style={{ backgroundColor: '#6E8B5E' }}
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
