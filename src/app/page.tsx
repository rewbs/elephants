'use client';

import React from 'react';
import { ToastProvider } from '@/components/Toast';
import Home from './components/HomePage';

export default function Page() {
  return (
    <ToastProvider>
      <Home />
    </ToastProvider>
  );
}