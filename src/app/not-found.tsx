import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-20 text-center">
      <h1 className="text-4xl text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Page Not Found</h1>
      <p className="text-[#192026]/60 mb-8 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Browse our seed catalog or check out our latest blog posts.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/product-category/shop-all-cannabis-seeds" className="btn-main">Shop Seeds</Link>
        <Link href="/blog" className="btn-second">Read Blog</Link>
      </div>
      <div className="mt-10 flex flex-wrap gap-2 justify-center">
        {[
          { name: 'Feminized Seeds', slug: 'feminized-seeds' },
          { name: 'Autoflower Seeds', slug: 'autoflowering-seeds' },
          { name: 'Indica Seeds', slug: 'indica-seeds' },
          { name: 'Sativa Seeds', slug: 'sativa-seeds' },
          { name: 'High THC', slug: 'high-tch-seeds' },
        ].map((cat) => (
          <Link key={cat.slug} href={`/product-category/${cat.slug}`}
            className="px-3 py-1.5 bg-white border border-[#275C53]/10 rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
