import React, { useState } from 'react';
import {
  AlertTriangle,
  Building,
  CheckCircle,
  Mail,
  Send,
  Shield,
  ShieldAlert,
  User,
  X,
} from 'lucide-react';
import { Book, ContactRequest } from '../types/truewriters';

interface ContactRequestModalProps {
  book: Book | null;
  theme: 'light' | 'night';
  onClose: () => void;
  onSubmitRequest: (req: ContactRequest) => void;
}

const RIGHTS_OPTIONS = [
  'Print & Physical Publishing Rights',
  'Film / Television Adaptation Option',
  'Audiobook Production Rights',
  'Foreign Language & Translation Rights',
  'Graphic Novel / Comic Adaptation',
  'Digital Serialization & Distribution',
];

export const ContactRequestModal: React.FC<ContactRequestModalProps> = ({
  book,
  theme,
  onClose,
  onSubmitRequest,
}) => {
  const isNight = theme === 'night';
  const [buyerName, setBuyerName] = useState<string>('Aria Sterling');
  const [buyerEmail, setBuyerEmail] = useState<string>('asterling@hearthstoneliterary.com');
  const [organization, setOrganization] = useState<string>('Hearthstone Literary & Media');
  const [selectedRights, setSelectedRights] = useState<string[]>([
    'Print & Physical Publishing Rights',
    'Audiobook Production Rights',
  ]);
  const [message, setMessage] = useState<string>(
    `Hello ${book?.authorName},\n\nI represent an independent literary scout and agency. We are deeply interested in the publication and adaptation rights for "${book?.title}". We would love to introduce ourselves and discuss your aspirations for this work.`
  );
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!book) return null;

  const toggleRight = (right: string) => {
    if (selectedRights.includes(right)) {
      setSelectedRights(selectedRights.filter((r) => r !== right));
    } else {
      setSelectedRights([...selectedRights, right]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerEmail.trim() || !message.trim()) return;

    const request: ContactRequest = {
      id: `req-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      buyerId: `buyer-${Date.now()}`,
      authorId: book.authorId,
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim(),
      organization: organization.trim(),
      rightsInterestedIn: selectedRights,
      message: message.trim(),
      status: 'pending',
      authorConsent: false,
      createdAt: 'Just now',
    };

    onSubmitRequest(request);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto space-y-5"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
          borderColor: isNight ? '#2C3128' : '#E4E0D4',
          color: isNight ? '#E8E6DE' : '#1C1C1A',
        }}
      >
        <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E8B5E] font-bold">
              Literary Rights & Acquisition Introduction
            </span>
            <h2 className="text-xl font-serif font-bold">Contact Author: {book.title}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Warning Banner from Section 10 */}
        <div
          className="p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3"
          style={{
            backgroundColor: isNight ? 'rgba(217, 119, 6, 0.1)' : '#FEF3C7',
            borderColor: '#F59E0B',
            color: isNight ? '#FDE68A' : '#92400E',
          }}
        >
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <strong className="block font-bold mb-0.5">Platform Safety & Zero-Fee Notice:</strong>
            Jeydahsan is free and never asks for payment. If anyone asks you to pay to publish, represent, or promote your work, report them immediately.
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle className="w-10 h-10 mx-auto text-emerald-600" />
            <h3 className="text-lg font-bold">Introduction Request Relayed</h3>
            <p className="text-xs" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
              Your inquiry has been delivered to {book.authorName}. If they choose to accept, their contact details will be shared for direct off-platform communication.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#6E8B5E]"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#6E8B5E]"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Organization / Agency / Studio</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g., Hearthstone Literary Agency or Independent Producer"
                className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#6E8B5E]"
                style={{
                  backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                  borderColor: isNight ? '#2C3128' : '#E4E0D4',
                }}
              />
            </div>

            {/* Rights interested in */}
            <div>
              <label className="block font-bold mb-2">Rights of Interest (Optional)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {RIGHTS_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer hover:bg-black/5"
                    style={{
                      borderColor: selectedRights.includes(opt) ? '#6E8B5E' : isNight ? '#2C3128' : '#E4E0D4',
                      backgroundColor: selectedRights.includes(opt)
                        ? isNight ? 'rgba(163, 184, 153, 0.15)' : 'rgba(110, 139, 94, 0.1)'
                        : 'transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRights.includes(opt)}
                      onChange={() => toggleRight(opt)}
                      className="accent-[#6E8B5E]"
                    />
                    <span className="text-[11px] font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block font-bold mb-1">Message to Author</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#6E8B5E] resize-none"
                style={{
                  backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                  borderColor: isNight ? '#2C3128' : '#E4E0D4',
                }}
              />
            </div>

            {/* Legal terms reminder & direct deal disclaimer */}
            <div
              className="p-3 rounded-xl border text-[11px] leading-relaxed space-y-1.5"
              style={{
                backgroundColor: isNight ? 'rgba(217, 119, 6, 0.1)' : '#FEF3C7',
                borderColor: isNight ? 'rgba(217, 119, 6, 0.3)' : '#FDE68A',
                color: isNight ? '#FCD34D' : '#92400E',
              }}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Notice & Direct Deal Safety Disclaimer:</span>
              </div>
              <p>
                Jeydahsan is not a literary agency, takes 0% commission, and does not negotiate contracts or hold payments. Authors and producers must be careful with any direct deals negotiated without our knowledge; all parties must take care of themselves and protect their legal and financial interests at all times.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl font-bold border"
                style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold text-white shadow-xs cursor-pointer"
                style={{ backgroundColor: '#6E8B5E' }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Introduction Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
