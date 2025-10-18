import React from 'react';
import { Podcast } from 'lucide-react';

export const SpotifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

export const ApplePodcastsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Podcast {...props} size={24} />
);
export const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9-3.3 1.4-6.7 1.4-6.7 1.4s-1.4 0-2.7-.7c-1.3-.7-2.7-1.4-2.7-1.4s-2.7 2.1-5.3 2.1c-2.7 0-5.3-2.1-5.3-2.1s0-1.4 1.3-2.7c1.3-1.3 2.7-2.7 2.7-2.7s-1.3-1.4-1.3-2.7c0-1.3 1.3-2.7 1.3-2.7s2.7-1.4 5.3 0c2.7 1.4 5.3 4.1 5.3 4.1" />
  </svg>
);
export const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
export const ScribbleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2a10 10 0 1 0 10 10" />
    <path d="M12 2a10 10 0 0 1 10 10" />
    <path d="M2 12a10 10 0 0 1 10-10" />
    <path d="M22 12a10 10 0 0 1-10 10" />
    <path d="M12 22a10 10 0 0 1-10-10" />
    <path d="M12 22a10 10 0 0 0 10-10" />
    <path d="M2 12a10 10 0 0 0 10 10" />
    <path d="M22 12a10 10 0 0 0-10-10" />
  </svg>
);
export const PodcastIllustrationIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g transform="translate(100 100)">
      <path d="M-60,0 a60,60 0 0,1 120,0" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M-40,0 a40,40 0 0,1 80,0" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M-20,0 a20,20 0 0,1 40,0" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path
        d="M -70 -50 C -80 -30, -50 -40, -60 -20 C -70 0, -40 -10, -50 10 C -60 30, -30 20, -40 40 C -50 60, -20 50, -30 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="10 10"
        opacity="0.7"
      />
      <path
        d="M 70 -50 C 80 -30, 50 -40, 60 -20 C 70 0, 40 -10, 50 10 C 60 30, 30 20, 40 40 C 50 60, 20 50, 30 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="10 10"
        opacity="0.7"
      />
      <circle cx="0" cy="0" r="10" fill="currentColor" />
    </g>
  </svg>
);
export const AIIllustrationIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
      <circle cx="100" cy="100" r="12" strokeWidth="6" />
      <circle cx="100" cy="30" r="8" />
      <circle cx="100" cy="170" r="8" />
      <circle cx="30" cy="100" r="8" />
      <circle cx="170" cy="100" r="8" />
      <circle cx="55" cy="55" r="8" />
      <circle cx="145" cy="55" r="8" />
      <circle cx="55" cy="145" r="8" />
      <circle cx="145" cy="145" r="8" />
      <path d="M100 88 L100 38" opacity="0.6" />
      <path d="M100 112 L100 162" opacity="0.6" />
      <path d="M88 100 L38 100" opacity="0.6" />
      <path d="M112 100 L162 100" opacity="0.6" />
      <path d="M108.5 108.5 L139.5 139.5" opacity="0.6" />
      <path d="M91.5 91.5 L60.5 60.5" opacity="0.6" />
      <path d="M91.5 108.5 L60.5 139.5" opacity="0.6" />
      <path d="M108.5 91.5 L139.5 60.5" opacity="0.6" />
      <path d="M100 88 C 80 80, 65 65, 55 55" strokeDasharray="4 4" opacity="0.4" />
      <path d="M112 100 C 120 80, 135 65, 145 55" strokeDasharray="4 4" opacity="0.4" />
    </g>
  </svg>
);