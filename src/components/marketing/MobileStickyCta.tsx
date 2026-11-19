import React from 'react';
import { MessageSquare, Calendar, ArrowRight } from 'lucide-react';

export interface MobileStickyCtaProps {
  onOpenBooking: () => void;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export const MobileStickyCta: React.FC<MobileStickyCtaProps> = ({
  onOpenBooking,
  whatsappNumber = '919876543210',
  whatsappMessage = 'Hi HeatLedger team, I want to book a free CBAM shipment audit for my steel export containers.',
}) => {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* WhatsApp Direct Chat Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with a CBAM specialist on WhatsApp"
          className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs shrink-0 transition-colors active:scale-95 min-h-[44px]"
        >
          <MessageSquare className="w-4 h-4 fill-emerald-400/20" />
          <span>WhatsApp</span>
        </a>

        {/* Primary Audit Booking CTA */}
        <button
          onClick={onOpenBooking}
          aria-label="Book a free shipment audit"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 min-h-[44px]"
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span>Book Free Shipment Audit</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
};
