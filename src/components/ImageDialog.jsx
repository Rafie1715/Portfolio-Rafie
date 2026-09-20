import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ImageDialog({ image, onClose }) {
  const ref = useRef(null);
  const { t } = useTranslation();
  useEffect(() => {
    if (!image || !ref.current) return undefined;
    const dialog = ref.current;
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = overflow; if (trigger?.isConnected) trigger.focus(); };
  }, [image]);
  if (!image) return null;
  return createPortal(
    <dialog ref={ref} aria-label={image.alt} onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={event => { if (event.key === 'Tab') { event.preventDefault(); ref.current?.querySelector('button')?.focus(); } }}
      className="fixed inset-0 m-auto max-h-[100dvh] w-full max-w-none bg-transparent p-4 text-white backdrop:bg-black/90 sm:p-8">
      <div className="relative mx-auto flex max-w-6xl flex-col items-center rounded-lg bg-slate-950 p-3 pt-16">
        <button autoFocus type="button" onClick={onClose} aria-label={t('common.close')} className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-lg bg-white/10 focus-visible:ring-2 focus-visible:ring-white"><X aria-hidden="true" /></button>
        <img src={image.src} alt={image.alt} className="max-h-[75dvh] max-w-full object-contain" />
        <p className="p-3 text-center text-sm text-slate-300">{image.alt}</p>
      </div>
    </dialog>, document.body);
}
