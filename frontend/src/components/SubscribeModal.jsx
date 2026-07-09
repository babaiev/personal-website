import { useState, useEffect } from 'react';
import { subscribeEmail } from '../api';
import { X, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

const SubscribeModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('IDLE'); // IDLE, CAPTCHA, LOADING, SUCCESS, ERROR
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Captcha state
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  useEffect(() => {
    if (isOpen && step === 'IDLE') {
      setStep('IDLE');
      setEmail('');
      setErrorMsg('');
      setCaptchaAnswer('');
    }
  }, [isOpen]);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubscribeClick = () => {
    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setStep('CAPTCHA');
  };

  const handleCaptchaSubmit = async () => {
    if (parseInt(captchaAnswer) !== num1 + num2) {
      setErrorMsg('Incorrect answer. Please try again.');
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setCaptchaAnswer('');
      return;
    }

    setStep('LOADING');
    setErrorMsg('');
    try {
      await subscribeEmail(email);
      setStep('SUCCESS');
    } catch (err) {
      setStep('ERROR');
      setErrorMsg(err.message || 'Something went wrong.');
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-bg/90 backdrop-blur-md transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-md bg-brand-card rounded-3xl border border-brand-accent/20 p-8 space-y-6 shadow-[0_0_50px_rgba(46,229,107,0.15)] transform transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`} 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-6 top-6 text-brand-textMuted hover:text-white transition-colors p-1">
          <X className="w-5 h-5" />
        </button>
        
        {step === 'IDLE' && (
          <div className="space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent glow-green mx-auto">
              <Mail className="w-7 h-7" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Join the Newsletter</h3>
              <p className="text-brand-textMuted text-sm">Get the latest updates directly in your inbox.</p>
            </div>
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-bg border border-white/[0.08] focus:border-brand-accent/40 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none transition-colors"
              />
              {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
              <button onClick={handleSubscribeClick} className="w-full py-4 rounded-2xl bg-brand-accent text-black font-bold transition-all duration-300 hover:scale-[1.02]">
                Subscribe
              </button>
            </div>
          </div>
        )}

        {step === 'CAPTCHA' && (
          <div className="space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent glow-green mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Human Verification</h3>
              <p className="text-brand-textMuted text-sm">To prevent spam, please solve this simple math problem:</p>
              <p className="text-brand-accent font-bold text-xl pt-2">What is {num1} + {num2}?</p>
            </div>
            <div className="space-y-4">
              <input 
                type="number" 
                placeholder="Your answer" 
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                className="w-full bg-brand-bg border border-white/[0.08] focus:border-brand-accent/40 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none transition-colors text-center"
              />
              {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
              <button onClick={handleCaptchaSubmit} className="w-full py-4 rounded-2xl bg-brand-accent text-black font-bold transition-all duration-300 hover:scale-[1.02]">
                Verify
              </button>
            </div>
          </div>
        )}

        {step === 'LOADING' && (
          <div className="space-y-6 animate-fade-in py-8">
            <div className="w-14 h-14 rounded-2xl border-4 border-brand-accent/20 border-t-brand-accent animate-spin mx-auto"></div>
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-white">Subscribing...</h3>
            </div>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 glow-green mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Success! 🎉</h3>
              <p className="text-brand-textMuted text-sm">You have been successfully subscribed to the newsletter.</p>
            </div>
            <button onClick={onClose} className="w-full py-4 rounded-2xl bg-white/10 text-white font-bold transition-all duration-300 hover:bg-white/20">
              Close
            </button>
          </div>
        )}

        {step === 'ERROR' && (
          <div className="space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Subscription Failed</h3>
              <p className="text-red-400 text-sm">{errorMsg}</p>
            </div>
            <button onClick={() => setStep('IDLE')} className="w-full py-4 rounded-2xl bg-white/10 text-white font-bold transition-all duration-300 hover:bg-white/20">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribeModal;
