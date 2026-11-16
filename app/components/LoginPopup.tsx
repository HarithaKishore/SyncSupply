"use client";

import { useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginPopup() {
  const { data: session } = useSession();
  const [showPopup, setShowPopup] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (showPopup && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [showPopup]);

  const handleLogin = async (provider: string) => {
    await signIn(provider, { redirect: false });
    setShowPopup(false);
  };

  return (
    <>
      {!session ? (
        <button onClick={() => setShowPopup(true)} className="min-h-11 px-2 text-sm font-medium text-slate-700 hover:text-blue-700">
          Sign in
        </button>
      ) : (
        <div className="flex items-center gap-3">
          {session.user?.image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={session.user.image} alt="" className="h-8 w-8 rounded-full" />
          )}
          <span className="hidden max-w-32 truncate text-sm text-slate-700 md:block">{session.user?.name}</span>
          <button onClick={() => signOut()} className="min-h-11 text-sm font-medium text-slate-600 hover:text-blue-700">Sign out</button>
        </div>
      )}

      {showPopup && !session && (
        <dialog ref={dialogRef} className="signin-dialog" aria-labelledby="signin-title" aria-describedby="signin-description" onCancel={() => setShowPopup(false)} onClose={() => setShowPopup(false)}>
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Your account</span>
            <button onClick={() => dialogRef.current?.close()} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close sign-in dialog">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
            </button>
          </div>
          <h2 id="signin-title" className="text-2xl font-semibold tracking-tight text-slate-900">Welcome to SyncSupply</h2>
          <p id="signin-description" className="mt-3 text-sm leading-6 text-slate-500">Sign in with your Google account to get started.</p>
          <button onClick={() => handleLogin("google")} className="secondary-button mt-7 w-full py-3">
            <span className="flex h-5 w-5 items-center justify-center font-semibold text-blue-700" aria-hidden="true">G</span>
            Continue with Google
          </button>
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-center text-xs text-slate-500">Email sign-in is coming soon.</p>
            <p className="mt-4 text-center text-xs leading-5 text-slate-400">By signing in, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </dialog>
      )}
    </>
  );
}
