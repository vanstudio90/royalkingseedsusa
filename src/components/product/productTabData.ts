// Terpene data for all published products
export interface TerpeneInfo {
  name: string;
  percentage: number; // 0-100 visual bar
  aroma: string;
  effect: string;
  color: string;
}

export const productTerpenes: Record<string, TerpeneInfo[]> = {
  'hindu-kush-feminized': [
    { name: 'Myrcene', percentage: 85, aroma: 'Earthy, musky, herbal', effect: 'Promotes deep relaxation and physical calm', color: '#7C3AED' },
    { name: 'Pinene', percentage: 65, aroma: 'Fresh pine, forest', effect: 'Supports mental alertness and respiratory clarity', color: '#059669' },
    { name: 'Caryophyllene', percentage: 50, aroma: 'Spicy, peppery, warm', effect: 'May help reduce stress and physical tension', color: '#D97706' },
    { name: 'Limonene', percentage: 25, aroma: 'Subtle citrus, lemon', effect: 'Supports mood elevation and stress relief', color: '#F59E0B' },
    { name: 'Linalool', percentage: 20, aroma: 'Floral, lavender, sweet', effect: 'Promotes calming and sedative effects', color: '#EC4899' },
  ],
  'og-kush-feminized': [
    { name: 'Limonene', percentage: 80, aroma: 'Bright lemon, citrus zest', effect: 'Elevates mood and provides stress relief', color: '#F59E0B' },
    { name: 'Myrcene', percentage: 70, aroma: 'Earthy, herbal, musky', effect: 'Promotes physical relaxation and calm', color: '#7C3AED' },
    { name: 'Caryophyllene', percentage: 65, aroma: 'Black pepper, spicy, warm', effect: 'May reduce inflammation and ease tension', color: '#D97706' },
    { name: 'Pinene', percentage: 45, aroma: 'Sharp pine needles', effect: 'Enhances focus and counteracts sedation', color: '#059669' },
    { name: 'Humulene', percentage: 25, aroma: 'Woody, earthy, hoppy', effect: 'May suppress appetite and reduce inflammation', color: '#92400E' },
  ],
  'granddaddy-purple-feminized': [
    { name: 'Myrcene', percentage: 90, aroma: 'Sweet grape, fruity, earthy', effect: 'Deep body relaxation and sedation support', color: '#7C3AED' },
    { name: 'Pinene', percentage: 45, aroma: 'Pine, fresh, clean', effect: 'Balances sedation with mental clarity', color: '#059669' },
    { name: 'Linalool', percentage: 55, aroma: 'Lavender, floral, sweet', effect: 'Calming effects that promote sleep', color: '#EC4899' },
    { name: 'Caryophyllene', percentage: 35, aroma: 'Peppery, spicy undertones', effect: 'Stress relief and anti-inflammatory support', color: '#D97706' },
    { name: 'Ocimene', percentage: 20, aroma: 'Sweet, herbaceous, woody', effect: 'May provide uplifting and decongestant effects', color: '#10B981' },
  ],
  'g13-feminized': [
    { name: 'Myrcene', percentage: 80, aroma: 'Earthy, musky, clove', effect: 'Heavy sedation and muscle relaxation', color: '#7C3AED' },
    { name: 'Pinene', percentage: 55, aroma: 'Pine forest, sharp', effect: 'Respiratory clarity and focus support', color: '#059669' },
    { name: 'Caryophyllene', percentage: 60, aroma: 'Black pepper, warm spice', effect: 'Stress relief and pain management support', color: '#D97706' },
    { name: 'Limonene', percentage: 30, aroma: 'Subtle citrus, orange peel', effect: 'Mild mood elevation alongside body effects', color: '#F59E0B' },
    { name: 'Humulene', percentage: 35, aroma: 'Earthy, woody, hoppy', effect: 'Appetite modulation and anti-inflammatory', color: '#92400E' },
  ],
  'forbidden-fruit-feminized': [
    { name: 'Myrcene', percentage: 75, aroma: 'Tropical fruit, mango', effect: 'Full-body relaxation and calm', color: '#7C3AED' },
    { name: 'Limonene', percentage: 70, aroma: 'Tangerine, citrus brightness', effect: 'Mood elevation and creative energy', color: '#F59E0B' },
    { name: 'Linalool', percentage: 50, aroma: 'Cherry blossom, sweet floral', effect: 'Anxiety reduction and calming effects', color: '#EC4899' },
    { name: 'Caryophyllene', percentage: 40, aroma: 'Light pepper, warm', effect: 'Subtle stress relief', color: '#D97706' },
    { name: 'Terpinolene', percentage: 25, aroma: 'Fresh, piney, herbal', effect: 'Mildly uplifting and sedative balance', color: '#6366F1' },
  ],
  'fruity-pebbles-feminized': [
    { name: 'Limonene', percentage: 80, aroma: 'Sweet citrus, candy-like', effect: 'Uplifting mood and stress relief', color: '#F59E0B' },
    { name: 'Myrcene', percentage: 60, aroma: 'Fruity, berry, earthy', effect: 'Gentle relaxation without heavy sedation', color: '#7C3AED' },
    { name: 'Caryophyllene', percentage: 50, aroma: 'Light spice, peppery', effect: 'Anti-inflammatory and calming', color: '#D97706' },
    { name: 'Linalool', percentage: 40, aroma: 'Sweet cream, floral', effect: 'Smooth calming effects', color: '#EC4899' },
    { name: 'Terpinolene', percentage: 30, aroma: 'Fresh, piney, citrus', effect: 'Stimulating and creative energy', color: '#6366F1' },
  ],
  'a-10-auto': [
    { name: 'Myrcene', percentage: 75, aroma: 'Earthy, herbal, clove', effect: 'Relaxation and body calm', color: '#7C3AED' },
    { name: 'Pinene', percentage: 55, aroma: 'Pine needles, fresh forest', effect: 'Mental clarity and alertness', color: '#059669' },
    { name: 'Caryophyllene', percentage: 50, aroma: 'Warm pepper, spice', effect: 'Stress relief and anti-inflammatory', color: '#D97706' },
    { name: 'Limonene', percentage: 35, aroma: 'Subtle citrus, lemon', effect: 'Mild mood enhancement', color: '#F59E0B' },
    { name: 'Humulene', percentage: 20, aroma: 'Earthy, woody', effect: 'Appetite modulation', color: '#92400E' },
  ],
  'acapulco-gold-auto': [
    { name: 'Terpinolene', percentage: 75, aroma: 'Fresh, piney, herbal, floral', effect: 'Uplifting energy and creative stimulation', color: '#6366F1' },
    { name: 'Limonene', percentage: 65, aroma: 'Bright citrus, orange zest', effect: 'Mood elevation and mental clarity', color: '#F59E0B' },
    { name: 'Myrcene', percentage: 40, aroma: 'Earthy, tropical undertones', effect: 'Mild body comfort without sedation', color: '#7C3AED' },
    { name: 'Caryophyllene', percentage: 35, aroma: 'Mild spice, warm pepper', effect: 'Gentle stress relief', color: '#D97706' },
    { name: 'Pinene', percentage: 30, aroma: 'Pine, forest air', effect: 'Supports focus and respiratory comfort', color: '#059669' },
  ],
  'lemon-cherry-gelato-clone': [
    { name: 'Limonene', percentage: 85, aroma: 'Bright lemon, citrus burst', effect: 'Strong mood elevation and euphoria', color: '#F59E0B' },
    { name: 'Caryophyllene', percentage: 65, aroma: 'Cherry, peppery warmth', effect: 'Physical comfort and stress relief', color: '#D97706' },
    { name: 'Linalool', percentage: 55, aroma: 'Cream, vanilla, sweet floral', effect: 'Calming body relaxation', color: '#EC4899' },
    { name: 'Myrcene', percentage: 45, aroma: 'Earthy, fruity depth', effect: 'Enhances overall relaxation', color: '#7C3AED' },
    { name: 'Humulene', percentage: 20, aroma: 'Woody, earthy base', effect: 'Subtle grounding effect', color: '#92400E' },
  ],
  'strawberry-fizz-prerolls': [
    { name: 'Myrcene', percentage: 70, aroma: 'Sweet berry, herbal', effect: 'Gentle body relaxation', color: '#7C3AED' },
    { name: 'Limonene', percentage: 65, aroma: 'Citrus sparkle, effervescent', effect: 'Uplifting mood and brightness', color: '#F59E0B' },
    { name: 'Caryophyllene', percentage: 45, aroma: 'Subtle spice, warmth', effect: 'Stress relief and comfort', color: '#D97706' },
    { name: 'Linalool', percentage: 35, aroma: 'Strawberry sweetness, floral', effect: 'Smooth calming sensation', color: '#EC4899' },
    { name: 'Ocimene', percentage: 20, aroma: 'Sweet, candy-like', effect: 'Light, refreshing quality', color: '#10B981' },
  ],
  'high-resin-strains-mixpack': [
    { name: 'Caryophyllene', percentage: 80, aroma: 'Diesel, pepper, fuel', effect: 'Strong stress relief and pain management', color: '#D97706' },
    { name: 'Myrcene', percentage: 75, aroma: 'Earthy, musky, deep', effect: 'Heavy body relaxation across all 3 strains', color: '#7C3AED' },
    { name: 'Limonene', percentage: 55, aroma: 'Citrus, sour, tangy', effect: 'Mood balance and euphoria', color: '#F59E0B' },
    { name: 'Pinene', percentage: 50, aroma: 'Pine, fresh, clean', effect: 'Mental clarity and alertness', color: '#059669' },
    { name: 'Humulene', percentage: 40, aroma: 'Hoppy, woody, earthy', effect: 'Anti-inflammatory support', color: '#92400E' },
  ],
  'couch-lock-pack': [
    { name: 'Myrcene', percentage: 90, aroma: 'Grape, earthy, musky', effect: 'Maximum sedation and body lock', color: '#7C3AED' },
    { name: 'Linalool', percentage: 60, aroma: 'Lavender, sweet berry', effect: 'Deep calming and sleep promotion', color: '#EC4899' },
    { name: 'Caryophyllene', percentage: 55, aroma: 'Peppery, fuel undertones', effect: 'Physical tension relief', color: '#D97706' },
    { name: 'Pinene', percentage: 35, aroma: 'Pine, forest', effect: 'Mild clarity balance', color: '#059669' },
    { name: 'Humulene', percentage: 30, aroma: 'Woody, earthy', effect: 'Grounding, appetite suppression', color: '#92400E' },
  ],
  'goat-mixpack': [
    { name: 'Terpinolene', percentage: 65, aroma: 'Fresh, piney, citrus', effect: 'Energizing from Acapulco Gold', color: '#6366F1' },
    { name: 'Myrcene', percentage: 80, aroma: 'Earthy, tropical fruit', effect: 'Heavy relaxation from 9lb Hammer', color: '#7C3AED' },
    { name: 'Limonene', percentage: 60, aroma: 'Pineapple, citrus bright', effect: 'Mood lift from Maui Pineapple Chunk', color: '#F59E0B' },
    { name: 'Caryophyllene', percentage: 50, aroma: 'Spicy, peppery warmth', effect: 'Stress relief across all strains', color: '#D97706' },
    { name: 'Pinene', percentage: 35, aroma: 'Fresh pine, herbal', effect: 'Focus and respiratory support', color: '#059669' },
  ],
  'american-strains-pack': [
    { name: 'Myrcene', percentage: 65, aroma: 'Blueberry, earthy, sweet', effect: 'Relaxation from Blue Dream', color: '#7C3AED' },
    { name: 'Terpinolene', percentage: 70, aroma: 'Fresh, piney, citrus', effect: 'Energy from Green Crack', color: '#6366F1' },
    { name: 'Limonene', percentage: 60, aroma: 'Sharp citrus, tropical', effect: 'Mood elevation and clarity', color: '#F59E0B' },
    { name: 'Pinene', percentage: 55, aroma: 'Pine forest, sharp', effect: 'Focus from Alaskan Thunder Fuck', color: '#059669' },
    { name: 'Caryophyllene', percentage: 40, aroma: 'Subtle pepper, warm', effect: 'Balanced stress relief', color: '#D97706' },
  ],
  'deadly-sativas-mixpack': [
    { name: 'Terpinolene', percentage: 85, aroma: 'Piney, floral, herbal', effect: 'Intense cerebral stimulation', color: '#6366F1' },
    { name: 'Limonene', percentage: 70, aroma: 'Citrus, incense, sweet', effect: 'Euphoria and creative energy', color: '#F59E0B' },
    { name: 'Pinene', percentage: 55, aroma: 'Pine, sharp, clean', effect: 'Mental clarity and focus', color: '#059669' },
    { name: 'Myrcene', percentage: 30, aroma: 'Earthy, tropical base', effect: 'Light body comfort without sedation', color: '#7C3AED' },
    { name: 'Ocimene', percentage: 35, aroma: 'Sweet, herbaceous', effect: 'Uplifting and energizing', color: '#10B981' },
  ],
};

// Growing journal data
export interface GrowWeek {
  week: number;
  stage: string;
  title: string;
  description: string;
  tips: string;
}

export const productGrowJournals: Record<string, GrowWeek[]> = {
  'hindu-kush-feminized': [
    { week: 1, stage: 'Germination', title: 'Seed Activation', description: 'Place seeds between moist paper towels at 22-26°C. Hindu Kush seeds typically crack within 24-48 hours, showing a strong white taproot. Transfer to your growing medium once the taproot reaches 1cm.', tips: 'Hindu Kush seeds are hardy — germination rates are among the highest of any strain.' },
    { week: 2, stage: 'Seedling', title: 'First Leaves Emerge', description: 'The seedling breaks through the soil and unfurls its first set of cotyledon leaves. Within a few days, the first true leaves with serrated edges appear. Keep light gentle at 18/6 cycle.', tips: 'Hindu Kush seedlings are compact from day one — broad leaves indicate strong indica genetics.' },
    { week: 3, stage: 'Early Veg', title: 'Root System Developing', description: 'The plant establishes its root system and begins producing its second and third sets of true leaves. Nodes are tightly spaced, creating a bushy structure. Begin light feeding if using inert medium.', tips: 'Water in a circle around the stem to encourage roots to spread outward.' },
    { week: 5, stage: 'Vegetative', title: 'Bushy Growth Pattern', description: 'Hindu Kush develops its characteristic compact, bushy shape with broad fan leaves and tight internodal spacing. Consider topping at the 5th node to encourage lateral branching.', tips: 'This strain responds well to topping — expect vigorous side branch development within days.' },
    { week: 7, stage: 'Pre-Flower', title: 'Switch to 12/12', description: 'After 4-6 weeks of vegetative growth, switch light cycle to 12/12 to trigger flowering. Within 7-10 days, pistils (white hairs) appear at branch junctions, confirming female sex.', tips: 'Hindu Kush shows sex quickly — typically within the first week of 12/12.' },
    { week: 9, stage: 'Early Flower', title: 'Bud Sites Forming', description: 'Multiple bud sites develop across the canopy. Dense clusters of white pistils emerge at every node. Begin reducing nitrogen and increasing phosphorus/potassium in your feeding schedule.', tips: 'Lower humidity to 50% to protect the developing dense buds from moisture issues.' },
    { week: 11, stage: 'Mid Flower', title: 'Buds Swelling', description: 'Buds pack on weight rapidly. Trichome production increases significantly — a frosted appearance develops. The earthy, pine aroma becomes pronounced. Support heavy branches with stakes or trellis.', tips: 'The pine-sandalwood aroma intensifies now — carbon filtration is essential for indoor grows.' },
    { week: 13, stage: 'Late Flower', title: 'Trichome Ripening', description: 'Pistils begin turning amber. Trichomes transition from clear to cloudy. Stop feeding nutrients and begin flushing with plain water for the final 7-10 days.', tips: 'Check trichomes daily with a loupe. Harvest when mostly cloudy with 10-20% amber for peak relaxation effects.' },
    { week: 14, stage: 'Harvest', title: 'Harvest Day', description: 'Cut the plant and hang whole branches upside down in a dark room at 18-21°C with 55-60% humidity. Dry for 7-10 days until small stems snap rather than bend. Trim and cure in jars for 2-4 weeks.', tips: 'Hindu Kush develops exceptional flavor with extended curing — 4+ weeks brings out the full sandalwood-spice profile.' },
  ],
  'og-kush-feminized': [
    { week: 1, stage: 'Germination', title: 'Seed Activation', description: 'OG Kush seeds germinate within 24-72 hours using the paper towel method. Look for a vigorous white taproot. Plant taproot-down in your medium at 1-1.5cm depth.', tips: 'OG Kush germinates reliably — maintain consistent 24°C warmth for best results.' },
    { week: 2, stage: 'Seedling', title: 'First True Leaves', description: 'Cotyledons open followed by the first serrated true leaves. OG Kush seedlings show medium-width leaves reflecting its hybrid genetics. Keep humidity high at 65-70%.', tips: 'A humidity dome over seedlings helps establish strong early growth.' },
    { week: 4, stage: 'Vegetative', title: 'Strong Branching Begins', description: 'OG Kush develops strong lateral branches ideal for training. The stem thickens noticeably. Begin low-stress training by gently bending the main stem to expose lower branches to light.', tips: 'OG Kush is one of the most responsive strains to LST and topping techniques.' },
    { week: 6, stage: 'Late Veg', title: 'Canopy Development', description: 'With training, OG Kush creates an excellent even canopy. Multiple tops develop strong bud sites. The fuel-pine aroma may already be noticeable when stems are rubbed.', tips: 'SCROG nets work exceptionally well with OG Kush — weave branches through the net during this stage.' },
    { week: 7, stage: 'Flip', title: 'Switch to 12/12', description: 'Initiate flowering by changing to 12/12 light cycle. OG Kush will stretch 50-75% during the first 2-3 weeks of flowering. Pre-flowers appear within 7-10 days.', tips: 'Account for the stretch — flip when plants are about 60% of your desired final height.' },
    { week: 9, stage: 'Early Flower', title: 'Bud Formation', description: 'Dense bud clusters begin forming at each node. The iconic OG Kush aroma — pine, lemon, and diesel — fills the grow space. Increase airflow to handle the dense canopy.', tips: 'Defoliate strategically to improve light penetration to lower bud sites.' },
    { week: 11, stage: 'Mid Flower', title: 'Resin Production Peaks', description: 'Buds become heavily frosted with trichomes. The fuel-citrus aroma is intense. Calyxes swell and stack, creating the dense, golf-ball shaped nugs OG Kush is known for.', tips: 'Reduce humidity to 45% and ensure strong airflow — OG Kush buds are dense and susceptible to mold.' },
    { week: 13, stage: 'Late Flower', title: 'Final Ripening', description: 'Pistils recede into swollen calyxes. Trichomes shift from clear to milky-cloudy. Begin flushing 10-14 days before planned harvest.', tips: 'For more cerebral effects, harvest when trichomes are mostly cloudy. For heavier body effects, wait for 20-30% amber.' },
    { week: 15, stage: 'Harvest', title: 'Harvest & Cure', description: 'Cut and dry in controlled conditions for 7-10 days. Trim and place in mason jars, burping daily for the first 2 weeks. OG Kush rewards patience with incredible flavor development.', tips: 'The pine-fuel-citrus terpenes mature beautifully during a 3-4 week cure — do not rush this step.' },
  ],
  'granddaddy-purple-feminized': [
    { week: 1, stage: 'Germination', title: 'Seed Start', description: 'GDP seeds germinate in 24-72 hours. The seedling emerges with slightly wider cotyledons than average, hinting at the indica dominance ahead.', tips: 'Maintain steady moisture and warmth — GDP seeds are reliable germinators.' },
    { week: 3, stage: 'Seedling', title: 'Early Growth', description: 'Broad, dark green fan leaves develop quickly. GDP stays compact from the start with tight internodal spacing. The plant is already noticeably bushy.', tips: 'GDP grows short — consider transplanting to final pot early to maximize root development time.' },
    { week: 5, stage: 'Vegetative', title: 'Compact Structure', description: 'The plant develops a squat, bushy profile rarely exceeding 2 feet at this stage. Strong side branches emerge. Topping at node 4-5 creates excellent multi-cola structure.', tips: 'GDP does not need much vertical space — focus on spreading the canopy wide.' },
    { week: 7, stage: 'Flip', title: 'Flowering Triggered', description: 'Switch to 12/12. GDP shows minimal stretch compared to other strains — expect only 25-50% height increase. Pistils appear quickly within the first week.', tips: 'GDP is one of the easiest strains to manage during the stretch — height rarely becomes an issue.' },
    { week: 9, stage: 'Early Flower', title: 'Grape Aromas Emerge', description: 'Dense bud sites develop rapidly. The sweet grape aroma begins to fill the room. Trichome production starts early, giving buds a frosted appearance.', tips: 'Begin lowering nighttime temperatures to 15-18°C to encourage purple color development.' },
    { week: 11, stage: 'Mid Flower', title: 'Purple Colors Appear', description: 'The magic happens — deep purple hues emerge throughout the buds and fan leaves. Buds become incredibly dense and heavy. The grape-berry scent intensifies.', tips: 'Support branches with stakes — GDP colas get extremely heavy and can snap branches.' },
    { week: 13, stage: 'Late Flower', title: 'Maximum Bag Appeal', description: 'Full purple coloration with orange pistils and thick trichome coverage. The visual contrast is stunning. Begin flushing for the final 7-10 days.', tips: 'GDP is one of the most photogenic strains at harvest — the purple buds photograph beautifully.' },
    { week: 14, stage: 'Harvest', title: 'Harvest & Cure', description: 'Dry slowly at 18-20°C for best color preservation. Cure in jars for minimum 3 weeks — the grape-berry flavor deepens significantly with proper curing.', tips: 'Cool drying temperatures help preserve the purple coloration that makes GDP so visually appealing.' },
  ],
  'g13-feminized': [
    { week: 1, stage: 'Germination', title: 'Seed Activation', description: 'G13 seeds crack within 24-48 hours showing a vigorous taproot. Plant at 1cm depth in your medium. The legendary genetics begin their journey.', tips: 'G13 seeds have strong genetics — expect high germination success rates.' },
    { week: 3, stage: 'Seedling', title: 'Indica Structure Emerges', description: 'Wide, dark green leaves indicate powerful indica genetics. The seedling is compact and sturdy from the start, with thick stems relative to its size.', tips: 'G13 develops thick stems naturally — a sign of the dense bud production to come.' },
    { week: 5, stage: 'Vegetative', title: 'Dense Foliage Development', description: 'G13 grows into a compact bush with dense foliage and strong lateral branches. The tight node spacing creates many potential bud sites.', tips: 'Strategic defoliation of large fan leaves improves light penetration through the dense canopy.' },
    { week: 7, stage: 'Flip', title: 'Flowering Begins', description: 'Switch to 12/12. G13 shows minimal stretch — adding only 25-40% in height. Pre-flowers appear within 5-7 days, confirming feminized genetics.', tips: 'G13 is a compact grower — perfect for tents where height is limited.' },
    { week: 9, stage: 'Early Flower', title: 'Resin Factory Activates', description: 'Bud sites develop rapidly with impressive trichome coverage from early in flowering. The earthy, pine, and skunk aroma begins building.', tips: 'G13 produces more resin than most strains — monitor humidity carefully.' },
    { week: 11, stage: 'Mid Flower', title: 'Dense Buds Pack On Weight', description: 'Extremely dense buds develop across the canopy. Trichome production is exceptional — buds appear completely frosted. The legendary potency is building.', tips: 'Maintain airflow around buds — G13 density makes it prone to moisture retention.' },
    { week: 13, stage: 'Late Flower', title: 'Final Ripening', description: 'Buds reach maximum density. The hashish-like aroma intensifies. Trichomes shift to cloudy-amber. Begin flush for final 7-10 days.', tips: 'G13 develops its full potency in the final 2 weeks — do not harvest early.' },
    { week: 14, stage: 'Harvest', title: 'Harvest Day', description: 'Cut and dry at 18-21°C. G13 buds are extremely dense — allow extra drying time to ensure the center of buds is fully dry. Cure for 3-4 weeks minimum.', tips: 'The legendary potency of G13 continues to develop during the curing process.' },
  ],
};

// For products without detailed journals, generate a generic one
export function getGrowJournal(slug: string, isAuto: boolean, name: string): GrowWeek[] {
  if (productGrowJournals[slug]) return productGrowJournals[slug];

  if (slug.includes('preroll')) return [
    { week: 0, stage: 'Ready', title: 'Ready to Enjoy', description: `${name} come pre-rolled and ready to smoke. No growing required — simply light and enjoy premium cannabis flower.`, tips: 'Store in a cool, dry place to maintain freshness and flavor.' },
  ];

  if (isAuto) return [
    { week: 1, stage: 'Germination', title: 'Seed Start', description: `Plant ${name} seeds directly in their final container. Autoflowers do not respond well to transplanting. Seedling emerges within 3-7 days.`, tips: 'Use 3-5 gallon pots as final containers for autoflowers.' },
    { week: 2, stage: 'Seedling', title: 'First True Leaves', description: 'Cotyledons open and first serrated true leaves appear. Keep light on 18-20 hours per day. The autoflower clock has started.', tips: 'Gentle watering around the stem — do not overwater at this stage.' },
    { week: 4, stage: 'Vegetative', title: 'Rapid Growth Phase', description: 'The plant enters rapid vegetative growth. Multiple nodes develop quickly. Light LST can be applied to open the canopy.', tips: 'Autoflowers have limited veg time — avoid high-stress techniques like topping.' },
    { week: 5, stage: 'Pre-Flower', title: 'Auto-Flowering Begins', description: 'The plant automatically transitions to flowering without any light cycle change. White pistils appear at branch junctions.', tips: 'Increase phosphorus and potassium in feeding as flowering begins.' },
    { week: 7, stage: 'Flower', title: 'Bud Development', description: 'Buds form and swell rapidly. Trichome production increases. The strain-specific aromas become noticeable.', tips: 'Maintain good airflow and monitor humidity below 50%.' },
    { week: 9, stage: 'Late Flower', title: 'Final Ripening', description: 'Buds reach peak size. Trichomes shift from clear to cloudy. Begin flushing with plain water for the final week.', tips: 'Check trichomes with a loupe — harvest when mostly cloudy for balanced effects.' },
    { week: 10, stage: 'Harvest', title: 'Harvest Day', description: `Harvest ${name} when trichomes are mostly cloudy. Dry for 7-10 days, then cure in jars for 2+ weeks.`, tips: 'Autoflower buds often cure quickly — but longer curing still improves flavor.' },
  ];

  // Generic photoperiod
  return [
    { week: 1, stage: 'Germination', title: 'Seed Activation', description: `Germinate ${name} seeds using the paper towel method at 22-26°C. Transfer to growing medium once taproot reaches 1cm.`, tips: 'Maintain consistent moisture and warmth for fastest germination.' },
    { week: 3, stage: 'Seedling', title: 'Early Growth', description: 'First true leaves develop. The plant establishes its root system. Keep humidity at 65-70% and provide gentle light.', tips: 'Avoid overwatering — let the top layer of soil dry slightly between waterings.' },
    { week: 5, stage: 'Vegetative', title: 'Structural Growth', description: 'The plant develops its branch structure. Apply training techniques like topping and LST to create an even canopy.', tips: 'This is the best time to shape your plant — it recovers quickly from training during veg.' },
    { week: 7, stage: 'Flip', title: 'Switch to 12/12', description: 'Change light cycle to 12/12 to trigger flowering. Pre-flowers appear within 7-10 days confirming sex.', tips: 'Flip when plants reach 50-60% of your target height to account for stretch.' },
    { week: 9, stage: 'Early Flower', title: 'Bud Formation', description: 'Bud sites develop across the canopy. Transition nutrients to bloom formula. The strain-specific aromas emerge.', tips: 'Reduce nitrogen and increase P-K ratios for optimal flower development.' },
    { week: 11, stage: 'Mid Flower', title: 'Bud Swelling', description: 'Buds pack on weight and trichome production peaks. Dense flower clusters form. Support heavy branches if needed.', tips: 'Lower humidity to 45-50% to protect dense buds from mold.' },
    { week: 13, stage: 'Late Flower', title: 'Trichome Ripening', description: 'Trichomes transition from clear to cloudy. Begin flushing with plain water 7-10 days before harvest.', tips: 'Use a jewelers loupe to monitor trichome color daily for optimal harvest timing.' },
    { week: 14, stage: 'Harvest', title: 'Harvest & Cure', description: `Cut and dry ${name} at 18-21°C with 55-60% humidity for 7-10 days. Cure in sealed jars for 2-4 weeks, burping daily.`, tips: 'Patience during curing is rewarded with significantly improved flavor and smoothness.' },
  ];
}
