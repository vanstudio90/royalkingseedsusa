import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Affiliate Program | Royal King Seeds USA',
  description: 'Join the Royal King Seeds affiliate program. Earn commissions promoting premium cannabis seeds to American growers.',
  alternates: { canonical: 'https://royalkingseeds.us/affiliate' },
};

export default function AffiliatePage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Affiliate Program</h1>
        <p className="text-[#192026]/70 mb-8">Earn commissions by promoting Royal King Seeds to your audience. Our affiliate program is designed for cannabis bloggers, growers, influencers, and content creators.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5 text-center">
            <div className="text-2xl font-semibold text-[#275C53]">10%</div>
            <p className="text-sm text-[#192026]/70 mt-1">Commission Rate</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5 text-center">
            <div className="text-2xl font-semibold text-[#275C53]">30 Days</div>
            <p className="text-sm text-[#192026]/70 mt-1">Cookie Duration</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5 text-center">
            <div className="text-2xl font-semibold text-[#275C53]">Monthly</div>
            <p className="text-sm text-[#192026]/70 mt-1">Payouts</p>
          </div>
        </div>
        <div className="bg-[#275C53] rounded-2xl p-8 text-center">
          <h3 className="text-xl text-white mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Interested in Partnering?</h3>
          <p className="text-white/70 text-sm mb-6">Email us at support@royalkingseeds.us with &ldquo;Affiliate&rdquo; in the subject line and we&apos;ll get you set up.</p>
          <a href="mailto:support@royalkingseeds.us?subject=Affiliate Program" className="btn-main !bg-[#D7B65D] !text-[#1a3d36]">Apply Now</a>
        </div>
      </div>
    </div>
  );
}
