import { useEffect } from 'react';

export default function ExportStorage() {
  useEffect(() => {
    const dump = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      dump[k] = localStorage.getItem(k);
    }
    const data64 = btoa(JSON.stringify(dump));
    window.location.href = `tabulas://storage?data=${encodeURIComponent(data64)}`;
  }, []);

  return <p style={{ padding: 40, textAlign: 'center' }}>Exporting…</p>;
}
