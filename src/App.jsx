import { useEffect, useRef, useState } from 'react';

// Zoho endpoints
const ZOHO_CHECKIN_URL = 'https://people.zoho.com/xebiacom/AttendanceAction.zp?mode=punchIn';
const ZOHO_CHECKOUT_URL = 'https://people.zoho.com/xebiacom/AttendanceAction.zp?mode=punchOut';

// Zoho form fields (configurable via environment variables)
const ZOHO_FORM_DATA = {
  conreqcsr: import.meta.env.VITE_ZOHO_CONREQCSR || '',
  urlMode: import.meta.env.VITE_ZOHO_URL_MODE || 'myspace',
  latitude: import.meta.env.VITE_ZOHO_LATITUDE || '',
  longitude: import.meta.env.VITE_ZOHO_LONGITUDE || '',
  accuracy: import.meta.env.VITE_ZOHO_ACCURACY || '',
};

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [hours, minutes, seconds].map((n) => String(n).padStart(2, '0'));
  return parts.join(':');
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function App() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [statusText, setStatusText] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  async function handleCheckIn() {
    if (isRunning) return;
    setElapsedSeconds(0);
    setIsRunning(true);
    setStatusText('');

    try {
      // Build multipart/form-data for Zoho Check-In
      const form = new FormData();
      form.append('conreqcsr', ZOHO_FORM_DATA.conreqcsr);
      form.append('urlMode', ZOHO_FORM_DATA.urlMode);
      form.append('latitude', ZOHO_FORM_DATA.latitude);
      form.append('longitude', ZOHO_FORM_DATA.longitude);
      form.append('accuracy', ZOHO_FORM_DATA.accuracy);

      const response = await fetch(ZOHO_CHECKIN_URL, {
        method: 'POST',
        body: form,
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Accept: '*/*',
        },
        referrer: 'https://people.zoho.com/xebiacom/zp',
        mode: 'cors',
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatusText('Checked in successfully.');
    } catch (error) {
      setStatusText('Check-in failed.');
    }
  }

  async function handleCheckOut() {
    if (!isRunning) return;
    setIsRunning(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    try {
      // Build multipart/form-data for Zoho Check-Out
      const form = new FormData();
      form.append('conreqcsr', ZOHO_FORM_DATA.conreqcsr);
      form.append('urlMode', ZOHO_FORM_DATA.urlMode);
      form.append('latitude', ZOHO_FORM_DATA.latitude);
      form.append('longitude', ZOHO_FORM_DATA.longitude);
      form.append('accuracy', ZOHO_FORM_DATA.accuracy);

      const response = await fetch(ZOHO_CHECKOUT_URL, {
        method: 'POST',
        body: form,
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Accept: '*/*',
        },
        referrer: 'https://people.zoho.com/xebiacom/zp',
        mode: 'cors',
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatusText('Checked out successfully.');
    } catch (error) {
      setStatusText('Check-out failed.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-center">
            <h1 className="text-lg font-semibold text-gray-900">Check-In/Check-Out System</h1>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl py-10">
          <div className="mx-auto max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">{formatDate(new Date())}</p>
                <div
                  className="text-gray-900 font-mono text-6xl tabular-nums tracking-wider"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {formatTime(elapsedSeconds)}
                </div>

                {statusText ? (
                  <p className="mt-2 text-sm text-gray-500">{statusText}</p>
                ) : null}

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handleCheckIn}
                    disabled={isRunning}
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-white font-medium shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-disabled={isRunning}
                  >
                    Check-In
                  </button>

                  <button
                    type="button"
                    onClick={handleCheckOut}
                    disabled={!isRunning}
                    className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-6 py-3 text-white font-medium shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-disabled={!isRunning}
                  >
                    Check-Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


