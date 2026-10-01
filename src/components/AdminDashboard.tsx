import React, { useState } from 'react';
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  ExternalLink,
  EyeOff,
  FileText,
  Filter,
  History,
  Shield,
  ShieldAlert,
  UserX,
  XCircle,
} from 'lucide-react';
import { AuditLog, ModerationAction, Report, User } from '../types/truewriters';

interface AdminDashboardProps {
  currentUser: User;
  reports: Report[];
  auditLogs: AuditLog[];
  theme: 'light' | 'night';
  onResolveReport: (reportId: string, action: ModerationAction) => void;
  onSwitchAdmin?: (adminKey: 'jeydah' | 'chyrine') => void;
  onLockSession?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  reports,
  auditLogs,
  theme,
  onResolveReport,
  onSwitchAdmin,
  onLockSession,
}) => {
  const isNight = theme === 'night';
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(reports[0]?.id || null);
  const [resolutionReason, setResolutionReason] = useState<string>('');

  const activeReport = reports.find((r) => r.id === selectedReportId);

  const filteredReports = filterCategory === 'all'
    ? reports
    : reports.filter((r) => r.category === filterCategory);

  const handleTakeAction = (actionType: ModerationAction['action']) => {
    if (!activeReport) return;

    const action: ModerationAction = {
      id: `act-${Date.now()}`,
      moderatorId: currentUser.id,
      moderatorName: currentUser.penName,
      targetType: activeReport.targetType as any,
      targetId: activeReport.targetId,
      action: actionType,
      reason: resolutionReason.trim() || 'Reviewed in accordance with Jeydahsan Content Policy.',
      createdAt: new Date().toLocaleTimeString(),
    };

    onResolveReport(activeReport.id, action);
    setResolutionReason('');
  };

  return (
    <div
      className="max-w-[1360px] mx-auto px-4 sm:px-8 py-8 transition-colors"
      style={{ color: isNight ? '#E8E6DE' : '#1C1C1A' }}
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b"
        style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1 text-[#6E8B5E]">
            <Shield className="w-4 h-4" />
            <span>AD · Trust & Safety</span>
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">AD Management & Reports</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Active Admin Switcher: Jeydah / Chyrine */}
          <div
            className="flex items-center p-1 rounded-xl border text-xs"
            style={{
              backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
              borderColor: isNight ? '#2C3128' : '#E4E0D4',
            }}
          >
            <span className="px-2.5 py-1 text-[11px] font-mono opacity-60">Admin:</span>
            <button
              onClick={() => onSwitchAdmin?.('jeydah')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                currentUser.penName.toLowerCase().includes('jeydah')
                  ? 'bg-[#6E8B5E] text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Jeydah
            </button>
            <button
              onClick={() => onSwitchAdmin?.('chyrine')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                currentUser.penName.toLowerCase().includes('chyrine')
                  ? 'bg-[#6E8B5E] text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Chyrine
            </button>
          </div>

          <span className="px-3 py-2 rounded-xl border text-xs font-mono font-bold" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
            Open: {reports.filter((r) => r.status === 'pending').length}
          </span>

          {onLockSession && (
            <button
              onClick={onLockSession}
              className="px-3 py-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
              title="Lock AD session"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Lock AD</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Admin Workspace: Queue Left, Action Desk Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold">Incoming Queue</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1 rounded-lg border text-xs"
              style={{
                backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                borderColor: isNight ? '#2C3128' : '#E4E0D4',
              }}
            >
              <option value="all">All Categories</option>
              <option value="Plagiarism — this same story exists on another website">Plagiarism Escalations</option>
              <option value="Pornographic / sexually explicit content">Explicit Content</option>
              <option value="Spam or advertising">Spam</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredReports.map((rep) => {
              const isSelected = selectedReportId === rep.id;
              const isPlagiarism = rep.category.includes('Plagiarism');

              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                    isSelected ? 'ring-2 ring-[#6E8B5E]' : ''
                  }`}
                  style={{
                    backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                    borderColor: isPlagiarism ? '#E11D48' : isNight ? '#2C3128' : '#E4E0D4',
                  }}
                >
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isPlagiarism ? 'bg-red-500/15 text-red-500' : 'bg-[#6E8B5E]/15 text-[#6E8B5E]'
                      }`}
                    >
                      {isPlagiarism ? 'PRIORITY: PLAGIARISM' : rep.category.split(' ')[0]}
                    </span>
                    <span className="text-[11px] font-mono opacity-60">{rep.createdAt}</span>
                  </div>

                  <h3 className="text-sm font-bold truncate">{rep.targetTitle || rep.targetId}</h3>
                  <p className="text-xs line-clamp-2 mt-1" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                    {rep.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Detailed Resolution & Comparison View */}
        <div className="lg:col-span-7">
          {activeReport ? (
            <div
              className="p-6 sm:p-8 rounded-3xl border shadow-xs space-y-6"
              style={{
                backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
                borderColor: isNight ? '#2C3128' : '#E4E0D4',
              }}
            >
              <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E8B5E] font-bold">
                    Incident Report ID: {activeReport.id}
                  </span>
                  <h2 className="text-lg font-bold font-serif">{activeReport.targetTitle}</h2>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-500/15 text-amber-600">
                  Status: {activeReport.status.toUpperCase()}
                </span>
              </div>

              {/* Report Category & Description */}
              <div className="space-y-2 text-xs">
                <p>
                  <strong>Category:</strong> {activeReport.category}
                </p>
                <p>
                  <strong>Target Type:</strong> {activeReport.targetType} (ID: {activeReport.targetId})
                </p>
                <div
                  className="p-3.5 rounded-xl border leading-relaxed"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                >
                  <strong className="block mb-1 text-[#6E8B5E]">Reporter Claim:</strong>
                  {activeReport.description}
                </div>
              </div>

              {/* Plagiarism Side-by-Side Escalation Tool (Section 8) */}
              {activeReport.sourceUrl && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-red-600">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Plagiarism Comparison Tool</span>
                    </span>
                    <a
                      href={activeReport.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      <span>External Source Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: isNight ? '#8C9087' : '#5C5F58' }}>
                    Compare the reported text against: <span className="font-mono">{activeReport.sourceUrl}</span>. If substantiated, proceed with unpublishing or account action.
                  </p>
                </div>
              )}

              {/* Resolution Reason Field */}
              <div>
                <label className="block text-xs font-bold mb-1">Resolution & Audit Note</label>
                <textarea
                  rows={3}
                  value={resolutionReason}
                  onChange={(e) => setResolutionReason(e.target.value)}
                  placeholder="Record justification for audit log (e.g., 'Confirmed duplicate chapters from 2021 work')..."
                  className="w-full p-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#6E8B5E] resize-none"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                />
              </div>

              {/* Action Buttons from Section 8 */}
              <div className="pt-4 border-t space-y-3" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
                <span className="block text-xs font-bold">Moderator Actions</span>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <button
                    onClick={() => handleTakeAction('dismiss')}
                    className="px-3 py-2 rounded-xl border hover:bg-black/5 cursor-pointer"
                    style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={() => handleTakeAction('warn_user')}
                    className="px-3 py-2 rounded-xl bg-amber-600 text-white cursor-pointer hover:bg-amber-700"
                  >
                    Warn User
                  </button>
                  <button
                    onClick={() => handleTakeAction('hide_content')}
                    className="px-3 py-2 rounded-xl bg-stone-700 text-white cursor-pointer hover:bg-stone-800"
                  >
                    Hide Content
                  </button>
                  <button
                    onClick={() => handleTakeAction('unpublish_book')}
                    className="px-3 py-2 rounded-xl bg-red-600 text-white cursor-pointer hover:bg-red-700"
                  >
                    Unpublish Book
                  </button>
                  <button
                    onClick={() => handleTakeAction('suspend_7d')}
                    className="px-3 py-2 rounded-xl bg-red-700 text-white cursor-pointer hover:bg-red-800"
                  >
                    Suspend (7 Days)
                  </button>
                  <button
                    onClick={() => handleTakeAction('ban_user')}
                    className="px-3 py-2 rounded-xl bg-black text-white cursor-pointer"
                  >
                    Permanent Ban
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center border rounded-3xl opacity-60">
              Select a report from the queue to review details.
            </div>
          )}

          {/* Audit Logs (Section 8) */}
          <div
            className="mt-8 p-6 rounded-3xl border shadow-xs space-y-3"
            style={{
              backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
              borderColor: isNight ? '#2C3128' : '#E4E0D4',
            }}
          >
            <h3 className="text-sm font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-[#6E8B5E]" />
              <span>Full Moderation Audit Log</span>
            </h3>
            <div className="divide-y text-xs font-mono" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <strong className="text-[#6E8B5E]">{log.actorName}</strong>: {log.action}
                  </div>
                  <span className="opacity-60">{log.createdAt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
