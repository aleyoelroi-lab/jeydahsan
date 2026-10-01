import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
  LogOut,
  Mail,
  RefreshCw,
  Send,
  Shield,
  ShieldAlert,
  User as UserIcon,
  X,
} from 'lucide-react';
import { User } from '../types/truewriters';
import {
  findUserByEmail,
  generateToken,
  generateVerificationLink,
  saveRegisteredUser,
  setStoredSession,
} from '../utils/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  theme: 'light' | 'night';
  onLoginSuccess: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onLogOut: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  theme,
  onLoginSuccess,
  onUpdateUser,
  onLogOut,
}) => {
  const isNight = theme === 'night';
  const isGuest = !!currentUser.isGuest;

  // Active view: 'register' | 'signin' | 'settings'
  const [mode, setMode] = useState<'register' | 'signin' | 'settings'>(
    isGuest ? 'register' : 'settings'
  );

  // Registration form fields
  const [fullName, setFullName] = useState<string>(currentUser.fullName || '');
  const [nickname, setNickname] = useState<string>(currentUser.nickname || '');
  const [displayNamePreference, setDisplayNamePreference] = useState<'fullName' | 'nickname'>(
    currentUser.displayNamePreference || 'nickname'
  );
  const [email, setEmail] = useState<string>(currentUser.email || '');
  const [showEmailPublicly, setShowEmailPublicly] = useState<boolean>(
    !!currentUser.showEmailPublicly
  );
  const [ageConfirmed, setAgeConfirmed] = useState<boolean>(true);

  // Sign in email
  const [signInEmail, setSignInEmail] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Simulated Magic Link dispatch state
  const [dispatchedLink, setDispatchedLink] = useState<{
    url: string;
    email: string;
    user: User;
    token: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!isOpen) return null;

  // Compute active penName according to preference
  const computedDisplayName =
    displayNamePreference === 'fullName'
      ? fullName.trim() || nickname.trim() || 'Anonymous Writer'
      : nickname.trim() || fullName.trim() || 'Anonymous Writer';

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!fullName.trim() && !nickname.trim()) {
      setAuthError('Please provide your Full Name or a Nickname.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (!ageConfirmed) {
      setAuthError('You must confirm you are 13 years of age or older.');
      return;
    }

    const chosenPenName =
      displayNamePreference === 'fullName'
        ? fullName.trim() || nickname.trim()
        : nickname.trim() || fullName.trim();

    // Check if user already exists
    const existing = findUserByEmail(email);
    const userId = existing?.id || `usr-${Date.now()}`;

    const newUser: User = {
      id: userId,
      fullName: fullName.trim(),
      nickname: nickname.trim(),
      displayNamePreference,
      penName: chosenPenName,
      email: email.trim().toLowerCase(),
      showEmailPublicly,
      emailVerified: false, // will be verified via the link
      role: existing?.role || 'writer',
      bio: existing?.bio || 'Passionate reader and writer on Jeydahsan.',
      joinedDate: existing?.joinedDate || 'October 2026',
      followersCount: existing?.followersCount || 0,
      followingCount: existing?.followingCount || 0,
      ageVerified13Plus: true,
      isGuest: false,
    };

    saveRegisteredUser(newUser);

    const token = generateToken();
    const link = generateVerificationLink(newUser.email, token);

    setDispatchedLink({
      url: link,
      email: newUser.email,
      user: newUser,
      token,
    });
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!signInEmail.trim() || !signInEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    const existing = findUserByEmail(signInEmail);
    if (!existing) {
      setAuthError('No account found for this email. Please register below.');
      setEmail(signInEmail.trim());
      return;
    }

    const token = generateToken();
    const link = generateVerificationLink(existing.email, token);

    setDispatchedLink({
      url: link,
      email: existing.email,
      user: existing,
      token,
    });
  };

  const handleSimulateClickLink = () => {
    if (!dispatchedLink) return;

    // Verify and log in
    const verifiedUser: User = {
      ...dispatchedLink.user,
      emailVerified: true,
      isGuest: false,
    };

    saveRegisteredUser(verifiedUser);
    setStoredSession(verifiedUser);
    onLoginSuccess(verifiedUser);
    setDispatchedLink(null);
  };

  const handleCopyLink = () => {
    if (!dispatchedLink) return;
    navigator.clipboard.writeText(dispatchedLink.url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenPenName =
      displayNamePreference === 'fullName'
        ? fullName.trim() || nickname.trim()
        : nickname.trim() || fullName.trim();

    const updated: User = {
      ...currentUser,
      fullName: fullName.trim(),
      nickname: nickname.trim(),
      displayNamePreference,
      penName: chosenPenName,
      showEmailPublicly,
    };

    saveRegisteredUser(updated);
    setStoredSession(updated);
    onUpdateUser(updated);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-5 my-6 overflow-y-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: isNight ? '#1B1E17' : '#FFFFFF',
          borderColor: isNight ? '#2C3128' : '#E4E0D4',
          color: isNight ? '#E8E6DE' : '#1C1C1A',
        }}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: isNight ? '#2C3128' : '#E4E0D4' }}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6E8B5E] font-bold">
              Jeydahsan Member Access
            </span>
            <h3 className="text-xl font-serif font-bold">
              {mode === 'settings'
                ? 'Account Settings & Identity'
                : mode === 'register'
                ? 'Create Reader & Writer Account'
                : 'Sign In with Magic Link'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Magic Link Email Dispatched Confirmation Card */}
        {dispatchedLink ? (
          <div
            className="p-5 rounded-2xl border space-y-4 shadow-sm"
            style={{
              backgroundColor: isNight ? '#12140F' : '#F0FDF4',
              borderColor: isNight ? '#2C3128' : '#BBF7D0',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6E8B5E]/20 text-[#6E8B5E] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold">Magic Link Dispatched!</h4>
                <p className="text-xs opacity-75">
                  Verification email sent to <strong className="font-mono text-[#6E8B5E]">{dispatchedLink.email}</strong>
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed opacity-85">
              Clicking the link below verifies your account and logs you in immediately. Once logged in, you remain logged in on this browser until you choose to log out.
            </p>

            {/* Direct 1-Click Verification simulation */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleSimulateClickLink}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#6E8B5E] hover:bg-[#5C754E] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Click to Verify & Log In Now</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                style={{
                  borderColor: isNight ? '#2C3128' : '#CBD5E1',
                }}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 opacity-70" />
                    <span>Copy Direct Verification Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 text-[11px] font-mono opacity-60 flex items-center justify-between border-t border-[#6E8B5E]/20">
              <span>Token: {dispatchedLink.token.slice(0, 8)}...</span>
              <button
                type="button"
                onClick={() => setDispatchedLink(null)}
                className="text-xs text-[#6E8B5E] hover:underline cursor-pointer"
              >
                Back to form
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Tabs when not viewing logged-in settings */}
            {mode !== 'settings' && (
              <div
                className="grid grid-cols-2 p-1 rounded-xl border text-xs font-semibold"
                style={{
                  backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                  borderColor: isNight ? '#2C3128' : '#E4E0D4',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setAuthError(null);
                  }}
                  className={`py-2 rounded-lg transition-colors cursor-pointer text-center ${
                    mode === 'register' ? 'bg-[#6E8B5E] text-white font-bold' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  Create Account (Register)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setAuthError(null);
                  }}
                  className={`py-2 rounded-lg transition-colors cursor-pointer text-center ${
                    mode === 'signin' ? 'bg-[#6E8B5E] text-white font-bold' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  Sign In (Existing)
                </button>
              </div>
            )}

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* View 1: Register Form */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full name in 1 box */}
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-90">
                    Full Name <span className="font-normal opacity-60">(1 box)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rowan Eleanor Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#6E8B5E]"
                    style={{
                      backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                      borderColor: isNight ? '#2C3128' : '#E4E0D4',
                    }}
                  />
                </div>

                {/* Nickname */}
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-90">
                    Nickname / Pen Name
                  </label>
                  <input
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="e.g. Rowan Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#6E8B5E]"
                    style={{
                      backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                      borderColor: isNight ? '#2C3128' : '#E4E0D4',
                    }}
                  />
                </div>

                {/* Option to choose which to display */}
                <div
                  className="p-3.5 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                >
                  <label className="block text-xs font-bold text-[#6E8B5E]">
                    Choose Which Name to Display Publicly
                  </label>
                  <p className="text-[11px] opacity-70">
                    Select which identity appears on your published works, comments, and profile:
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <label
                      className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                        displayNamePreference === 'fullName'
                          ? 'border-[#6E8B5E] bg-[#6E8B5E]/15 text-[#6E8B5E] font-bold'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        borderColor: displayNamePreference === 'fullName' ? '#6E8B5E' : isNight ? '#2C3128' : '#E4E0D4',
                      }}
                    >
                      <input
                        type="radio"
                        name="displayPreference"
                        checked={displayNamePreference === 'fullName'}
                        onChange={() => setDisplayNamePreference('fullName')}
                        className="accent-[#6E8B5E]"
                      />
                      <div className="truncate">
                        <span className="block font-semibold">Full Name</span>
                        <span className="text-[10px] opacity-75 truncate block">
                          {fullName.trim() || 'Jane Doe'}
                        </span>
                      </div>
                    </label>

                    <label
                      className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                        displayNamePreference === 'nickname'
                          ? 'border-[#6E8B5E] bg-[#6E8B5E]/15 text-[#6E8B5E] font-bold'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        borderColor: displayNamePreference === 'nickname' ? '#6E8B5E' : isNight ? '#2C3128' : '#E4E0D4',
                      }}
                    >
                      <input
                        type="radio"
                        name="displayPreference"
                        checked={displayNamePreference === 'nickname'}
                        onChange={() => setDisplayNamePreference('nickname')}
                        className="accent-[#6E8B5E]"
                      />
                      <div className="truncate">
                        <span className="block font-semibold">Nickname</span>
                        <span className="text-[10px] opacity-75 truncate block">
                          {nickname.trim() || 'Starlight'}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-90">
                    Email Address <span className="font-normal opacity-60">(receives your magic login link)</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="author@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#6E8B5E]"
                    style={{
                      backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                      borderColor: isNight ? '#2C3128' : '#E4E0D4',
                    }}
                  />
                </div>

                {/* Option to show email to readers for potential producer for direct contact in ticked box */}
                <div
                  className="p-3.5 rounded-xl border space-y-2.5"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                >
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showEmailPublicly}
                      onChange={(e) => setShowEmailPublicly(e.target.checked)}
                      className="mt-0.5 accent-[#6E8B5E] w-4 h-4 rounded"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[#6E8B5E] block">
                        Show my email to readers for potential producer for direct contact
                      </span>
                      <span className="text-[11px] opacity-75 block mt-0.5">
                        Enables verified scouts, adaptation producers, and publishers to see your direct email on your book pages.
                      </span>
                    </div>
                  </label>

                  {/* Mandatory Disclaimer */}
                  <div
                    className="p-2.5 rounded-lg border text-[11px] leading-relaxed flex items-start gap-2"
                    style={{
                      backgroundColor: isNight ? 'rgba(217, 119, 6, 0.1)' : '#FEF3C7',
                      borderColor: isNight ? 'rgba(217, 119, 6, 0.3)' : '#FDE68A',
                      color: isNight ? '#FCD34D' : '#92400E',
                    }}
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Important Producer Deal Disclaimer:</strong>
                      You must be careful with any direct deals negotiated without our knowledge. Authors and creators must take care of themselves, verify all contracts, and protect their legal and financial interests at all times.
                    </div>
                  </div>
                </div>

                {/* 13+ Age Confirmation */}
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={ageConfirmed}
                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                    className="accent-[#6E8B5E]"
                  />
                  <span>I confirm I am 13+ years of age for community guidelines</span>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#6E8B5E] hover:bg-[#5C754E] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Magic Link to Register & Verify</span>
                </button>

                <p className="text-[11px] text-center opacity-65">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setAuthError(null);
                    }}
                    className="text-[#6E8B5E] font-bold hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              </form>
            )}

            {/* View 2: Sign In Form */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <p className="text-xs opacity-75">
                  Enter your registered email. We will send a secure magic link. When clicked, you are immediately verified and logged in.
                </p>

                <div>
                  <label className="block text-xs font-bold mb-1 opacity-90">
                    Account Email
                  </label>
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#6E8B5E]"
                    style={{
                      backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                      borderColor: isNight ? '#2C3128' : '#E4E0D4',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#6E8B5E] hover:bg-[#5C754E] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Magic Login Link</span>
                </button>

                <p className="text-[11px] text-center opacity-65">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setAuthError(null);
                    }}
                    className="text-[#6E8B5E] font-bold hover:underline cursor-pointer"
                  >
                    Register for free
                  </button>
                </p>
              </form>
            )}

            {/* View 3: Logged-in Account Settings */}
            {mode === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-4">
                {/* User Identity Preview */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-serif font-bold text-xl shrink-0 shadow-xs"
                    style={{ backgroundColor: '#6E8B5E' }}
                  >
                    {currentUser.penName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-base truncate">{currentUser.penName}</h4>
                      {currentUser.emailVerified && (
                        <span title="Email Verified" className="inline-flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-70 truncate">{currentUser.email}</p>
                    <span className="text-[11px] font-mono text-[#6E8B5E] font-semibold">
                      Role: {currentUser.role.toUpperCase()} · Status: Logged In
                    </span>
                  </div>
                </div>

                {/* Editable Full Name and Nickname */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 rounded-xl border text-xs"
                      style={{
                        backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                        borderColor: isNight ? '#2C3128' : '#E4E0D4',
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-80">Nickname</label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Nickname"
                      className="w-full px-3 py-2 rounded-xl border text-xs"
                      style={{
                        backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                        borderColor: isNight ? '#2C3128' : '#E4E0D4',
                      }}
                    />
                  </div>
                </div>

                {/* Display Choice */}
                <div
                  className="p-3 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                >
                  <label className="block text-xs font-bold text-[#6E8B5E]">
                    Display Name Preference
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDisplayNamePreference('fullName')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        displayNamePreference === 'fullName'
                          ? 'border-[#6E8B5E] bg-[#6E8B5E]/15 text-[#6E8B5E] font-bold'
                          : 'opacity-70'
                      }`}
                      style={{
                        borderColor: displayNamePreference === 'fullName' ? '#6E8B5E' : isNight ? '#2C3128' : '#E4E0D4',
                      }}
                    >
                      <span className="block font-semibold">Display Full Name</span>
                      <span className="text-[10px] opacity-75 truncate block">
                        {fullName || 'Not set'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDisplayNamePreference('nickname')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        displayNamePreference === 'nickname'
                          ? 'border-[#6E8B5E] bg-[#6E8B5E]/15 text-[#6E8B5E] font-bold'
                          : 'opacity-70'
                      }`}
                      style={{
                        borderColor: displayNamePreference === 'nickname' ? '#6E8B5E' : isNight ? '#2C3128' : '#E4E0D4',
                      }}
                    >
                      <span className="block font-semibold">Display Nickname</span>
                      <span className="text-[10px] opacity-75 truncate block">
                        {nickname || 'Not set'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Option to show email to readers for potential producer for direct contact */}
                <div
                  className="p-3.5 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: isNight ? '#12140F' : '#FDFBF4',
                    borderColor: isNight ? '#2C3128' : '#E4E0D4',
                  }}
                >
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showEmailPublicly}
                      onChange={(e) => setShowEmailPublicly(e.target.checked)}
                      className="mt-0.5 accent-[#6E8B5E] w-4 h-4 rounded"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[#6E8B5E] block">
                        Show email to readers for potential producer for direct contact
                      </span>
                      <span className="text-[11px] opacity-75 block mt-0.5">
                        Verified producers and scouts can see your direct contact email ({currentUser.email}).
                      </span>
                    </div>
                  </label>

                  {/* Disclaimer */}
                  <div
                    className="p-2.5 rounded-lg border text-[11px] leading-relaxed flex items-start gap-2"
                    style={{
                      backgroundColor: isNight ? 'rgba(217, 119, 6, 0.1)' : '#FEF3C7',
                      borderColor: isNight ? 'rgba(217, 119, 6, 0.3)' : '#FDE68A',
                      color: isNight ? '#FCD34D' : '#92400E',
                    }}
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Direct Deal Disclaimer:</strong>
                      You have to be careful with direct deals negotiated without our knowledge; authors and producers must take care of themselves and protect their rights at all times.
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onLogOut();
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl border text-xs font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center gap-1.5 cursor-pointer"
                    style={{
                      borderColor: isNight ? '#2C3128' : '#E4E0D4',
                    }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out of Session</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="px-3 py-2 rounded-xl border text-xs font-semibold opacity-75 hover:opacity-100 cursor-pointer"
                      style={{
                        borderColor: isNight ? '#2C3128' : '#E4E0D4',
                      }}
                    >
                      Switch Account
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6E8B5E] hover:bg-[#5C754E] cursor-pointer shadow-xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
