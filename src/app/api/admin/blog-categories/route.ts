import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getAllBlogPosts } from '@/lib/blog-content';

const BLOG_CATEGORIES = [
  { id: 'beginner', label: 'Beginner Guides', description: 'First-time grower essentials', cats: ['pillar-germ', 'support-seedling', 'support-grow'] },
  { id: 'germination', label: 'Germination & Seedlings', description: 'Seed starting and seedling care', cats: ['pillar-germ', 'support-seedling'] },
  { id: 'indoor', label: 'Indoor Growing', description: 'Lights, tents, airflow and feeding', cats: ['pillar-light', 'support-light', 'pillar-vpd', 'support-vpd'] },
  { id: 'outdoor', label: 'Outdoor Growing', description: 'Climate, pests and photoperiods', cats: ['environment', 'state-guide'] },
  { id: 'autoflower', label: 'Autoflower Guides', description: 'Auto-specific growing advice', cats: ['pillar-auto', 'support-auto'] },
  { id: 'strains', label: 'Strain Reviews', description: 'In-depth strain reviews and comparisons', cats: ['strain'] },
  { id: 'nutrients', label: 'Nutrients, Soil & Hydro', description: 'Feeding, pH and deficiencies', cats: ['pillar-nutrient', 'support-nutrient', 'support-medium', 'support-watering'] },
  { id: 'troubleshooting', label: 'Troubleshooting', description: 'Pests, diseases and fixes', cats: ['pillar-pest', 'support-pest', 'support-flower'] },
  { id: 'harvest', label: 'Harvest, Drying & Curing', description: 'Trichomes, drying and storage', cats: ['pillar-harvest', 'support-harvest', 'pillar-store'] },
  { id: 'training', label: 'Training & Pruning', description: 'LST, topping and canopy work', cats: ['pillar-train', 'support-train'] },
  { id: 'flowering', label: 'Flowering & Bloom', description: 'Flowering stage guidance', cats: ['pillar-flower', 'support-flower'] },
  { id: 'science', label: 'Terpenes & Cannabinoids', description: 'Cannabis science and effects', cats: ['terpene', 'cannabinoid', 'effects', 'cbd-focus'] },
  { id: 'breeding', label: 'Genetics & Breeding', description: 'Phenotypes, cloning and seed storage', cats: ['support-clone', 'support-sex'] },
  { id: 'yield', label: 'Yield Optimization', description: 'Maximizing harvest weight', cats: ['support-yield'] },
  { id: 'health', label: 'Health & Wellness', description: 'Cannabis for sleep, pain, anxiety', cats: ['sleep', 'pain', 'anxiety-article', 'health', 'therapeutic'] },
  { id: 'edibles', label: 'Edibles & Recipes', description: 'Cannabis cooking and preparation', cats: ['edible'] },
  { id: 'accessories', label: 'Accessories & Gear', description: 'Smoking devices and equipment', cats: ['accessory'] },
  { id: 'legal', label: 'Legal & News', description: 'Cannabis laws, news, dispensaries', cats: ['legal', 'news', 'dispensary'] },
  { id: 'states', label: 'State Growing Guides', description: 'State-specific cannabis guides', cats: ['state-guide'] },
  { id: 'general', label: 'General Cannabis Knowledge', description: 'Miscellaneous cannabis topics', cats: ['general', 'promo'] },
];

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const allPosts = getAllBlogPosts();

  const categories = BLOG_CATEGORIES.map(bc => {
    const postCount = allPosts.filter(p => bc.cats.includes(p.category)).length;
    return { ...bc, postCount };
  }).sort((a, b) => b.postCount - a.postCount);

  return NextResponse.json({ categories });
}
