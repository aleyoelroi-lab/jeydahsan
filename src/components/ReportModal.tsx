import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Flag, X } from 'lucide-react';
import { Report, ReportCategory } from '../types/truewriters';

interface ReportModalProps {
  targetType: 'book' | 'chapter' | 'comment' | 'forum_post';
  targetId: string;
  targetTitle?: string;
  theme: 'light' | 'night';
  onClose: () => void;
  onSubmitReport: (rep: Report) => void;
}

const REPORT_CATEGORIES: ReportCategory[] = [
  'Pornographic / sexually explicit content',
  'Plagiarism — this same story exists on another website',
  'Hate speech or harassment',
  'Spam or advertising',
  'Other',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  targetType,
  targetId,
  targetTitle,
  theme,
  onClose,
  onSubmitReport,
}) => {
  const isNight = theme === 'night';
  const [category, setCategory] = useState<ReportCategory>(REPORT_CATEGORIES[0]);
  const [description, setDescription] = useState<string>('');
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a short description of the issue.');
      return;
    }

    if (category === 'Plagiarism — this same story exists on another website' && !sourceUrl.trim()) {
      setError('A URL pointing to the original published source is required for plagiarism reports.');
      return;
    }

    const report: Report = {
      id: `rep-${Date.now()}`,
      reporterId: 'usr-current',
      targetType,
      targetId,
      targetTitle,
      category,
      description: description.trim(),
      sourceUrl: sourceUrl.trim() || undefined,
      status: 'pending',
      createdAt: 'Just now',
    };

    onSubmitReport(report);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 my-8 space-y-4"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
          borderColor: isNight ? '#2C3128' : '#E4E0D4',
          color: isNight ? '#E8E6DE' : '#1C1C1A',
        }}
      >
        <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-bold font-serif">Report Content to Moderation</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {targetTitle && (
          <p className="text-xs" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
            Reporting: <strong>{targetTitle}</strong>
          </p>
        )}

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold">Report Received</h4>
            <p className="text-xs" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
              Our moderation team reviews all reports against the Content Guidelines. Reports are completely anonymous to the reported author.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block font-bold mb-1">Violation Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReportCategory)}
                className="w-full px-3 py-2 rounded-xl border focus:outline-none"
                style={{
                  backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                  borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  color: isNight ? '#E8E6DE' : '#1C1C1A',
                }}
              >
                {REPORT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* If Plagiarism, URL is strictly required */}
            {category === 'Plagiarism — this same story exists on another website' && (
              <div>
                <label className="block font-bold mb-1 text-red-600">
                  Original Source URL * (Required for Plagiarism review)
                </label>
                <input
                  type="url"
                  required
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://original-publisher.com/work/..."
                  className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                />
              </div>
            )}

            <div>
              <label className="block font-bold mb-1">Description / Timestamps</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe why this content violates Jeydahsan rules..."
                className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#6E8B5E] resize-none"
                style={{
                  backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                  borderColor: isNight ? '#2C3128' : '#E4E0D4',
                }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] opacity-75">
              <span>Rate limit: max 10 reports/day</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-xl border font-bold"
                  style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-bold cursor-pointer hover:bg-red-700"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
