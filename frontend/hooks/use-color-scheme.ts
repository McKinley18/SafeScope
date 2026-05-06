'use client';

import { useEffect, useState } from 'react';

export function useColorScheme(): 'light' | 'dark' {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const updateScheme = () => {
      setScheme(media.matches ? 'dark' : 'light');
    };

    updateScheme();

    media.addEventListener('change', updateScheme);
    return () => media.removeEventListener('change', updateScheme);
  }, []);

  return scheme;
}
