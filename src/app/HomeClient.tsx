"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useRef } from "react";

const fullNumber = new Intl.NumberFormat("en-US");

const defaultProfile = {
  displayName: "Nikita Bier",
  handle: "@nikitabier",
  bio: "head of product @x, advisor @solana, venture partner @lightspeedvp, ex-founder @gasappteam (acq by discord), ex-founder @thetbhapp (acq by facebook)",
  followers: 599300,
  message: "Come work for X",
  time: "11:25",
};

const fallbackMessage = "(Your DM preview will update as you type.)";

const formatTime = (value: string) => {
  if (!/^\d{2}:\d{2}$/.test(value)) {
    return value || "--:--";
  }

  const [hours, minutes] = value.split(":").map(Number);
  const normalizedHours = ((hours + 11) % 12) + 1;
  const suffix = hours >= 12 ? "PM" : "AM";

  return `${normalizedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
};

const sanitizeFollowers = (value: string) => {
  const parsed = Number(value.replace(/[^\d]/g, ""));
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
};

export default function HomeClient({ initialMessage }: { initialMessage?: string }) {
  const [incomingMessage, setIncomingMessage] = useState(initialMessage ?? defaultProfile.message);
  const [bio, setBio] = useState(defaultProfile.bio);
  const [time, setTime] = useState(defaultProfile.time);
  const [followersInput, setFollowersInput] = useState(`${defaultProfile.followers}`);
  const [composerText, setComposerText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [tempMessage, setTempMessage] = useState("");
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Prefill incoming message from `t` query param (client-side safety net)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("t");
      if (t && t.trim().length > 0) {
        setIncomingMessage(t);
      }
    } catch {
      // ignore
    }
  }, []);

  const copyLinkToMessage = async () => {
    try {
      const url = new URL(window.location.href);
      if (incomingMessage.trim().length > 0) {
        url.searchParams.set("t", incomingMessage);
      } else {
        url.searchParams.delete("t");
      }
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const numericFollowers = useMemo(
    () => sanitizeFollowers(followersInput),
    [followersInput],
  );

  const displayFollowers = useMemo(() => {
    if (numericFollowers >= 100_000) {
      return `${Math.round(numericFollowers / 1000)}K`;
    }
    return fullNumber.format(numericFollowers);
  }, [numericFollowers]);

  const formattedTime = useMemo(() => formatTime(time), [time]);

  const renderBio = (value: string) =>
    value.split(/(\s+)/).map((segment, index) => {
      if (/^\s+$/.test(segment)) {
        return <span key={`space-${index}`}>{segment}</span>;
      }

      const match = segment.match(/^(@[A-Za-z0-9_.-]+)(.*)$/);
      if (match) {
        const [, handle, remainder] = match;

        return (
          <span key={`handle-${index}`}>
            <span className="text-[#1D9BF0]">{handle}</span>
            {remainder}
          </span>
        );
      }

      return <span key={`text-${index}`}>{segment}</span>;
    });

  return (
    <main className={`min-h-screen px-4 py-10 sm:px-6 transition-colors duration-200 ${
      isDarkMode
        ? 'bg-[#050708] text-[#E7E9EA]'
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10">
        <div className="w-full max-w-[375px]">
          <div className={`relative mx-auto h-[812px] w-full max-w-[375px] overflow-hidden rounded-[36px] border ${
            isDarkMode
              ? 'border-[#2F3336] bg-black'
              : 'border-gray-300 bg-white'
          }`}>
            <div className="flex h-full flex-col">
              <header className={`flex h-[53px] items-center justify-between border-b px-3 ${
                isDarkMode ? 'border-[#2F3336]' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Go back"
                    className={`rounded-full p-2 transition ${
                      isDarkMode
                        ? 'text-[#EFF3F4] hover:bg-white/10'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M7.414 13 12.457 18.04l-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2z" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-2">
                    <div className={`relative h-8 w-8 overflow-hidden rounded-full ${
                      isDarkMode ? 'bg-black' : 'bg-white'
                    }`}>
                      <Image
                        src="/Nikita_DM.jpg"
                        alt={`${defaultProfile.displayName} avatar`}
                        fill
                        sizes="32px"
                        priority
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex items-center gap-1">
                      <p className={`truncate text-[15px] font-semibold ${
                        isDarkMode ? 'text-[#E7E9EA]' : 'text-gray-900'
                      }`}>{defaultProfile.displayName}</p>
                      <svg
                        aria-label="Verified"
                        className="h-[18px] w-[18px] text-[#1D9BF0]"
                        viewBox="0 0 22 22"
                        fill="currentColor"
                      >
                        <path d="M20.396 11a3.7 3.7 0 0 0-.57-1.816 3.7 3.7 0 0 0-1.438-1.246c.223-.607.27-1.264.14-1.897a3.74 3.74 0 0 0-.882-1.687 3.74 3.74 0 0 0-1.687-.882 3.78 3.78 0 0 0-1.897.14 3.76 3.76 0 0 0-1.245-1.44A3.74 3.74 0 0 0 11 1.604a3.74 3.74 0 0 0-1.813.568 3.76 3.76 0 0 0-1.24 1.44 3.78 3.78 0 0 0-1.902-.14 3.74 3.74 0 0 0-1.69.882 3.74 3.74 0 0 0-.878 1.688c-.13.633-.08 1.29.144 1.896a3.7 3.7 0 0 0-1.443 1.245A3.7 3.7 0 0 0 1.75 11c.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569a3.76 3.76 0 0 0 1.817-.567c.573-.355.972-.854 1.245-1.44.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Conversation info"
                  className={`rounded-full p-2 transition ${
                    isDarkMode
                      ? 'text-[#EFF3F4] hover:bg-white/10'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z"></path>
                  </svg>
                </button>
              </header>

              <div className={`flex-1 space-y-5 overflow-y-auto px-4 py-3 ${
                isDarkMode ? '' : 'bg-white'
              }`}>
                <div className={`border-b pb-5 ${
                  isDarkMode ? 'border-[#2F3336]' : 'border-gray-200'
                }`}>
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#1D9BF0] via-[#1D9BF0]/70 to-[#1D9BF0]/30 p-[2px]">
                        <div className={`relative h-full w-full overflow-hidden rounded-full ${
                          isDarkMode ? 'bg-black' : 'bg-white'
                        }`}>
                          <Image
                            src="/Nikita_DM.jpg"
                            alt={`${defaultProfile.displayName} avatar`}
                            fill
                            sizes="64px"
                            priority
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`truncate text-[15px] font-semibold ${
                        isDarkMode ? 'text-[#E7E9EA]' : 'text-gray-900'
                      }`}>
                        {defaultProfile.displayName}
                      </span>
                      <svg
                        aria-label="Verified"
                        className="h-[18px] w-[18px] text-[#1D9BF0]"
                        viewBox="0 0 22 22"
                        fill="currentColor"
                      >
                        <path d="M20.396 11a3.7 3.7 0 0 0-.57-1.816 3.7 3.7 0 0 0-1.438-1.246c.223-.607.27-1.264.14-1.897a3.74 3.74 0 0 0-.882-1.687 3.74 3.74 0 0 0-1.687-.882 3.78 3.78 0 0 0-1.897.14 3.76 3.76 0 0 0-1.245-1.44A3.74 3.74 0 0 0 11 1.604a3.74 3.74 0 0 0-1.813.568 3.76 3.76 0 0 0-1.24 1.44 3.78 3.78 0 0 0-1.902-.14 3.74 3.74 0 0 0-1.69.882 3.74 3.74 0 0 0-.878 1.688c-.13.633-.08 1.29.144 1.896a3.7 3.7 0 0 0-1.443 1.245A3.7 3.7 0 0 0 1.75 11c.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569a3.76 3.76 0 0 0 1.817-.567c.573-.355.972-.854 1.245-1.44.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                      </svg>
                    </div>
                    <span className={`text-sm ${
                      isDarkMode ? 'text-[#71767B]' : 'text-gray-500'
                    }`}>{defaultProfile.handle}</span>
                    <p className={`text-[15px] leading-5 ${
                      isDarkMode ? 'text-[#E7E9EA]' : 'text-gray-900'
                    }`}>
                      {bio.trim()
                        ? renderBio(bio)
                        : "Add a bio below to include it in the preview."}
                    </p>
                    <div className={`text-[14px] ${
                      isDarkMode ? 'text-[#71767B]' : 'text-gray-500'
                    }`}>
                      <span>{displayFollowers} Followers</span>
                    </div>
                  </div>
                </div>

                <p className={`text-center text-xs ${
                  isDarkMode ? 'text-[#71767B]' : 'text-gray-500'
                }`}>Today</p>

                <div className="flex">
                  <div className="max-w-[80%] space-y-1">
                    {isEditingMessage ? (
                      <textarea
                        ref={messageInputRef}
                        value={tempMessage}
                        onChange={(e) => setTempMessage(e.target.value)}
                        onBlur={() => {
                          setIncomingMessage(tempMessage.trim() || defaultProfile.message);
                          setIsEditingMessage(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            setIncomingMessage(tempMessage.trim() || defaultProfile.message);
                            setIsEditingMessage(false);
                          }
                          if (e.key === 'Escape') {
                            setTempMessage(incomingMessage);
                            setIsEditingMessage(false);
                          }
                        }}
                        className={`rounded-2xl rounded-tl-sm px-3 py-2 text-[15px] leading-5 w-full min-h-[40px] resize-none outline-none border-2 ${
                          isDarkMode
                            ? 'bg-[#16181C] text-[#E7E9EA] border-[#1D9BF0]'
                            : 'bg-gray-200 text-gray-900 border-blue-500'
                        }`}
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => {
                          setTempMessage(incomingMessage);
                          setIsEditingMessage(true);
                          setTimeout(() => messageInputRef.current?.focus(), 0);
                        }}
                        className={`rounded-2xl rounded-tl-sm px-3 py-2 text-[15px] leading-5 cursor-pointer hover:opacity-80 transition-opacity ${
                          isDarkMode
                            ? 'bg-[#16181C] text-[#E7E9EA]'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {incomingMessage.trim() ? incomingMessage : fallbackMessage}
                      </div>
                    )}
                    <div className={`text-xs ${
                      isDarkMode ? 'text-[#71767B]' : 'text-gray-500'
                    }`}>{formattedTime}</div>
                  </div>
                </div>
              </div>

              <div className={`border-t ${
                isDarkMode
                  ? 'border-[#2F3336] bg-black'
                  : 'border-gray-200 bg-white'
              }`}>
                <div
                  id="uploadProgress"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={0}
                  className="h-1 w-0 bg-[#1D9BF0]"
                />
                <div className="px-3 py-2">
                  <div className={`flex items-center gap-2 rounded-3xl border px-3 py-2 ${
                    isDarkMode
                      ? 'border-[#2F3336] bg-[#16181C]'
                      : 'border-gray-300 bg-gray-100'
                  }`}>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        aria-label="Add photos or video"
                        className="rounded-full p-1 text-[#1D9BF0] transition hover:bg-[#1D9BF0]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]/40"
                      >
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        aria-label="Add a GIF"
                        className="rounded-full p-1 text-[#1D9BF0] transition hover:bg-[#1D9BF0]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]/40"
                      >
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.12 21 5.5v13c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        aria-label="Add emoji"
                        className="rounded-full p-1 text-[#1D9BF0] transition hover:bg-[#1D9BF0]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]/40"
                      >
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M8 9.5C8 8.119 8.672 7 9.5 7S11 8.119 11 9.5 10.328 12 9.5 12 8 10.881 8 9.5zm6.5 2.5c.828 0 1.5-1.119 1.5-2.5S15.328 7 14.5 7 13 8.119 13 9.5s.672 2.5 1.5 2.5zM12 16c-2.224 0-3.021-2.227-3.051-2.316l-1.897.633c.05.15 1.271 3.684 4.949 3.684s4.898-3.533 4.949-3.684l-1.896-.638c-.033.095-.83 2.322-3.053 2.322zM22.25 12c0 5.652-4.598 10.25-10.25 10.25S1.75 17.652 1.75 12 6.348 1.75 12 1.75 22.25 6.348 22.25 12zm-2 0c0-4.549-3.701-8.25-8.25-8.25S3.75 7.451 3.75 12s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25z" />
                        </svg>
                      </button>
                  </div>

                  <div className="min-w-0 flex-1 flex items-center">
                    <label htmlFor="dm-composer" className="sr-only">
                      Start a new message
                    </label>
                    <textarea
                      id="dm-composer"
                      rows={1}
                      value={composerText}
                      onChange={(event) => setComposerText(event.target.value)}
                      placeholder="Start a new message"
                      className={`max-h-36 w-full resize-none bg-transparent text-[15px] leading-5 outline-none self-center ${
                        isDarkMode
                          ? 'text-[#E7E9EA] placeholder-[#71767B]'
                          : 'text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <button
                    type="button"
                    aria-label="Send"
                    disabled={!composerText.trim()}
                    className="rounded-full p-2 text-[#1D9BF0] transition hover:bg-[#1D9BF0]/10 disabled:hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D9BF0]/40"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M2.504 21.866 3.03 19.758C3.04 19.719 4 15.823 4 12S3.04 4.281 3.03 4.242L2.504 2.133 22.236 12zM5.981 13c-.072 1.962-.34 3.833-.583 5.183L17.764 12 5.398 5.818c.242 1.349.51 3.221.583 5.183H10v2z" />
                    </svg>
                  </button>
                </div>
              </div>

                <div className="h-[env(safe-area-inset-bottom)]" aria-hidden />
              </div>
            </div>
          </div>
        </div>

        {/* Copy link CTA below the mobile area */}
        <div className="w-full max-w-[375px] -mt-6 text-center">
          <button
            type="button"
            onClick={copyLinkToMessage}
            className={`text-sm font-medium hover:underline ${
              isDarkMode ? 'text-[#1D9BF0]' : 'text-blue-600'
            }`}
          >
            {copied ? "Copied!" : "Copy link to message"}
          </button>
          <p className={`mt-2 text-xs ${
            isDarkMode ? 'text-[#71767B]' : 'text-gray-500'
          }`}>
            Warning, this is a parody. Use responsibly and only for jokes.
          </p>
        </div>

        <section className={`w-full max-w-[600px] space-y-6 rounded-3xl border p-6 backdrop-blur ${
          isDarkMode
            ? 'border-white/10 bg-white/5'
            : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Customize the DM</h2>
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isDarkMode
                  ? 'bg-[#1D9BF0] focus:ring-[#1D9BF0]'
                  : 'bg-gray-300 focus:ring-gray-400'
              }`}
              aria-label="Toggle dark mode"
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              >
                {isDarkMode ? (
                  <svg className="h-6 w-6 p-1 text-[#1D9BF0]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 p-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </button>
          </div>
          <form className="grid gap-6 text-sm">
            <label className="flex flex-col gap-2">
              <span className={`font-medium ${
                isDarkMode ? 'text-[#E7E9EA]' : 'text-gray-700'
              }`}>Incoming message</span>
              <textarea
                value={incomingMessage}
                onChange={(event) => setIncomingMessage(event.target.value)}
                rows={4}
                placeholder="Type the incoming DM..."
                className={`rounded-xl border px-3 py-3 text-sm shadow-inner outline-none transition focus:ring-2 ${
                  isDarkMode
                    ? 'border-white/10 bg-black/70 text-[#E7E9EA] focus:border-[#1D9BF0] focus:ring-[#1D9BF0]/40'
                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/40'
                }`}
              />
            </label>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className={`font-medium ${
                  isDarkMode ? 'text-[#E7E9EA]' : 'text-gray-700'
                }`}>Time of day</span>
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className={`h-11 rounded-xl border px-3 text-sm shadow-inner outline-none transition focus:ring-2 ${
                    isDarkMode
                      ? 'border-white/10 bg-black/70 text-[#E7E9EA] focus:border-[#1D9BF0] focus:ring-[#1D9BF0]/40'
                      : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/40'
                  }`}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className={`font-medium ${
                  isDarkMode ? 'text-[#E7E9EA]' : 'text-gray-700'
                }`}>Followers</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={followersInput}
                  onChange={(event) => setFollowersInput(event.target.value)}
                  className={`h-11 rounded-xl border px-3 text-sm shadow-inner outline-none transition focus:ring-2 ${
                    isDarkMode
                      ? 'border-white/10 bg-black/70 text-[#E7E9EA] focus:border-[#1D9BF0] focus:ring-[#1D9BF0]/40'
                      : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/40'
                  }`}
                />
                <span className={`text-xs ${
                  isDarkMode ? 'text-[#71767B]' : 'text-gray-500'
                }`}>Displayed as {displayFollowers}</span>
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className={`font-medium ${
                isDarkMode ? 'text-[#E7E9EA]' : 'text-gray-700'
              }`}>Bio</span>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={3}
                placeholder="Describe this person..."
                className={`rounded-xl border px-3 py-3 text-sm shadow-inner outline-none transition focus:ring-2 ${
                  isDarkMode
                    ? 'border-white/10 bg-black/70 text-[#E7E9EA] focus:border-[#1D9BF0] focus:ring-[#1D9BF0]/40'
                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/40'
                }`}
              />
            </label>
          </form>
        </section>
      </div>
    </main>
  );
}

