import type { SVGProps } from 'react';

type CompanyLogoProps = {
  maker: string;
  className?: string;
};

export function CompanyLogo({ maker, className }: CompanyLogoProps) {
  switch (maker) {
    case 'OpenAI':
      return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
          <rect width="256" height="256" rx="28" fill="#fff" />
          <path
            fill="#000"
            d="M128.4 31.2c16.8 0 32.1 8.8 40.7 22.7l4 6.5 7.5-.3c19.9-.8 38.2 10.5 46.6 28.4 8.2 17.4 5.4 38.2-7 52.7l-4.8 5.7 4.8 5.7c12.4 14.5 15.2 35.3 7 52.7-8.4 17.9-26.7 29.2-46.6 28.4l-7.5-.3-4 6.5c-8.6 13.9-23.9 22.7-40.7 22.7s-32.1-8.8-40.7-22.7l-4-6.5-7.5.3c-19.9.8-38.2-10.5-46.6-28.4-8.2-17.4-5.4-38.2 7-52.7l4.8-5.7-4.8-5.7c-12.4-14.5-15.2-35.3-7-52.7 8.4-17.9 26.7-29.2 46.6-28.4l7.5.3 4-6.5c8.6-13.9 23.9-22.7 40.7-22.7Zm0 20.5c-9.6 0-18.4 5-23.4 13.1l-11 17.7-20.8-.8c-11.7-.4-22.4 6.1-27.3 16.6-4.8 10.1-3.2 22 4 30.6l13.3 15.6-13.3 15.6c-7.2 8.5-8.8 20.4-4 30.6 4.9 10.5 15.6 17 27.3 16.6l20.8-.8 11 17.7c5 8.1 13.8 13.1 23.4 13.1s18.4-5 23.4-13.1l11-17.7 20.8.8c11.7.4 22.4-6.1 27.3-16.6 4.8-10.1 3.2-22-4-30.6l-13.3-15.6 13.3-15.6c7.2-8.5 8.8-20.4 4-30.6-4.9-10.5-15.6-17-27.3-16.6l-20.8.8-11-17.7c-5-8.1-13.8-13.1-23.4-13.1Zm-33.3 34.9 66.9 38.6v77.2l-17.8 10.3-66.9-38.6V97l17.8-10.3Zm15.8 18.5-15.7 9.1v50.8l44 25.4 15.7-9.1v-50.8l-44-25.4Z"
          />
        </svg>
      );
    case 'Mistral AI':
      return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
          <rect width="256" height="256" fill="#000" />
          <rect x="36" y="0" width="37" height="219" fill="#000" />
          <rect x="183" y="0" width="37" height="219" fill="#000" />
          <rect x="73" y="0" width="37" height="51" fill="#ffd21f" />
          <rect x="146" y="0" width="37" height="51" fill="#ffd21f" />
          <rect x="73" y="51" width="73" height="43" fill="#ffb51d" />
          <rect x="146" y="51" width="73" height="43" fill="#ffb51d" />
          <rect x="73" y="94" width="146" height="43" fill="#ff8f12" />
          <rect x="73" y="137" width="37" height="43" fill="#ff5a10" />
          <rect x="110" y="137" width="73" height="43" fill="#ff5a10" />
          <rect x="183" y="137" width="37" height="43" fill="#ff5a10" />
          <rect y="180" width="110" height="43" fill="#ef0600" />
          <rect x="146" y="180" width="110" height="43" fill="#ef0600" />
          <rect x="110" y="180" width="36" height="76" fill="#000" />
          <rect x="0" y="223" width="256" height="33" fill="#000" />
        </svg>
      );
    case 'Microsoft':
      return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="copilot-a" x1="25%" y1="10%" x2="70%" y2="90%">
              <stop offset="0%" stopColor="#3db8ff" />
              <stop offset="55%" stopColor="#59c567" />
              <stop offset="100%" stopColor="#ffd61b" />
            </linearGradient>
            <linearGradient id="copilot-b" x1="15%" y1="20%" x2="90%" y2="80%">
              <stop offset="0%" stopColor="#3159e5" />
              <stop offset="55%" stopColor="#c35ade" />
              <stop offset="100%" stopColor="#ffb85a" />
            </linearGradient>
            <linearGradient id="copilot-c" x1="0%" y1="20%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#ff8f4a" />
              <stop offset="100%" stopColor="#d8394a" />
            </linearGradient>
          </defs>
          <rect width="256" height="256" rx="54" fill="transparent" />
          <path d="M54 34h102c27 0 45 10 54 30l11 23c5 11 14 19 25 24-14 1-26 10-32 25l-24 63c-10 26-27 39-52 39H86c-28 0-46-12-53-35L18 145c-6-23 1-42 20-58 10-8 17-19 20-33l4-18c4-1 8-2 12-2Z" fill="url(#copilot-a)" />
          <path d="M194 34c26 0 43 11 50 32l8 25c5 15 15 25 29 30-14 3-25 13-29 28l-14 54c-8 30-27 45-56 45h-55c-14 0-25-4-32-13 30-2 48-18 56-47l17-62c8-30 26-46 54-48h-28Z" fill="url(#copilot-b)" />
          <path d="M70 162c14 0 24 7 31 20l16 32c7 14 18 23 31 27-16 2-31-5-42-18l-24-31c-8-10-18-16-31-17 7-8 13-13 19-13Z" fill="url(#copilot-c)" />
        </svg>
      );
    case 'Anthropic':
      return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
          <path
            fill="#d97a57"
            d="M125 14h21l20 11 8 21-8 112 43-104 18-19h28l16 16-6 26-57 69 73-17 21 7 7 19-5 18-91 22 54 21 18 20v17l-17 9-22-9-63-50 8 73-10 18-18 8-20-15-3-90-38 71-22 13-16-6-9-20 60-77-84 48-24 2-11-11v-18l65-47-88-2-12-19 7-13 22-4 94 7-71-53-7-20 13-17h18l72 57-43-84-3-20 16-15Z"
          />
        </svg>
      );
    case 'Perplexity':
      return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
          <path
            fill="none"
            stroke="#2fb8cf"
            strokeWidth="12"
            strokeLinecap="square"
            strokeLinejoin="miter"
            d="M45 44v168M128 44v168M211 44v168M18 86h220M18 170h220M45 44l83 84 83-84M45 212l83-84 83 84"
          />
        </svg>
      );
    case 'DeepSeek':
      return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
          <rect width="256" height="256" rx="48" fill="#f5f5f5" />
          <path
            fill="#4e67f3"
            d="M168 53c21 2 35 16 37 38 1 15-4 28-13 40 9 10 15 23 15 37 0 34-26 59-63 59-29 0-51-14-68-37-7-10-13-22-13-36 0-19 12-33 32-33 22 0 42 11 60 31-2-10-9-20-18-29-18-18-39-26-62-22-8-20 17-47 46-49 15-1 29 3 40 11 4-7 10-11 17-10 7 1 13 7 13 15 0 8-5 14-12 17-10 3-16-3-18-12-5-1-9-2-13-2-25 0-45 19-41 38 19-5 41 2 60 21 24 23 30 54 18 80 19-4 31-18 31-36 0-11-4-21-12-29l-7-7 6-8c8-10 12-19 11-30-1-9-5-14-14-16-8-2-18 2-30 12l-10-10c16-16 33-23 50-21Z"
          />
        </svg>
      );
    case 'Meta':
      return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
          <rect width="256" height="256" rx="20" fill="#f0f0f0" />
          <path
            fill="none"
            stroke="#1877f2"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M42 150c0-43 24-73 53-73 24 0 42 22 56 51 14 29 32 51 56 51 17 0 29-10 29-28 0-38-25-74-54-74-24 0-42 23-56 52-14 29-31 50-54 50-18 0-30-11-30-29Z"
          />
        </svg>
      );
    case 'Moonshot AI':
      return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
          <rect width="256" height="256" rx="36" fill="#000" />
          <path fill="#fff" d="M74 54h28v60l37-60h31l-41 64 44 84h-31l-31-60-9 12v48H74V54Z" />
          <circle cx="176" cy="72" r="15" fill="#1877f2" />
        </svg>
      );
    case 'Google':
      return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="gemini" x1="15%" y1="80%" x2="80%" y2="20%">
              <stop offset="0%" stopColor="#f7c221" />
              <stop offset="28%" stopColor="#18c06e" />
              <stop offset="55%" stopColor="#4182f2" />
              <stop offset="82%" stopColor="#5867f1" />
              <stop offset="100%" stopColor="#ff4b4b" />
            </linearGradient>
          </defs>
          <path
            fill="url(#gemini)"
            d="M128 24c12 53 25 66 104 80-79 14-92 27-104 104-12-77-25-90-104-104 79-14 92-27 104-80Z"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="currentColor" />
        </svg>
      );
  }
}
