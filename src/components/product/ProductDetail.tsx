'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useRef } from 'react';
import type { Product } from '@/lib/products/types';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { ProductCard } from './ProductCard';
import { productTerpenes, getGrowJournal } from './productTabData';
import { generateTerpenes, generateLineage, generateStrainSpecs, generateFAQs, generateGrowJournal } from './dynamicProductData';

// Lineage data for our published products
const lineageData: Record<string, { parents: string[]; breeder: string; origin: string; generation: string; crossType: string; history: string }> = {
  'lemon-cherry-gelato-clone': { parents: ['Sunset Sherbet', 'Girl Scout Cookies'], breeder: 'Backpackboyz', origin: 'California, USA', generation: 'Clone Only', crossType: 'Hybrid Cross', history: 'Lemon Cherry Gelato emerged from the Cookie Fam lineage, combining the sweet sherbet genetics of Sunset Sherbet with the legendary Girl Scout Cookies. This clone-only phenotype was selected for its exceptional cherry-lemon terpene expression and dense trichome production. It quickly became one of the most sought-after genetics in modern cannabis culture.' },
  'strawberry-fizz-prerolls': { parents: ['Strawberry Cough', 'Fizzy OG'], breeder: 'Royal King Seeds', origin: 'California, the United States', generation: 'F2 Stabilized', crossType: 'Hybrid Cross', history: 'Strawberry Fizz was bred in California by crossing the classic Strawberry Cough with a Fizzy OG male selected for its carbonated citrus terpenes. The result is a balanced hybrid that delivers sparkling berry sweetness with a smooth, effervescent smoke quality.' },
  'a-10-auto': { parents: ['A-10 Photoperiod', 'Ruderalis'], breeder: 'Royal King Seeds', origin: 'North America', generation: 'Auto F4', crossType: 'Autoflower Hybrid', history: 'The A-10 Autoflower was developed by backcrossing a high-potency A-10 photoperiod mother with carefully selected Ruderalis genetics over four generations. This breeding process preserved the original A-10\'s dense bud structure and potent indica effects while introducing automatic flowering triggered by plant maturity rather than light cycles.' },
  'forbidden-fruit-feminized': { parents: ['Cherry Pie', 'Tangie'], breeder: 'Chameleon Extracts', origin: 'California, USA', generation: 'S1 Feminized', crossType: 'Indica-Dominant Cross', history: 'Forbidden Fruit was created by crossing Cherry Pie (a Durban Poison × Granddaddy Purple cross) with the citrus-forward Tangie. This pairing produced an indica-dominant cultivar with extraordinary visual appeal — deep purple flowers dusted with orange pistils — and a tropical fruit flavor profile that became an instant classic in dispensaries across North America.' },
  'fruity-pebbles-feminized': { parents: ['Green Ribbon', 'Granddaddy Purple', 'Tahoe Alien'], breeder: 'Alien Genetics', origin: 'California, USA', generation: 'S1 Feminized', crossType: 'Three-Way Hybrid', history: 'Fruity Pebbles OG (FPOG) is a rare three-way cross originally created by Alien Genetics. By combining Green Ribbon\'s uplifting energy with Granddaddy Purple\'s relaxing body effects and Tahoe Alien\'s resin production, breeders achieved a perfectly balanced hybrid with a sweet cereal-like aroma reminiscent of the breakfast cereal it\'s named after.' },
  'acapulco-gold-auto': { parents: ['Acapulco Gold Landrace', 'Ruderalis'], breeder: 'Royal King Seeds', origin: 'Acapulco, Mexico', generation: 'Auto F3', crossType: 'Autoflower Sativa', history: 'Acapulco Gold is one of the most legendary landrace sativa strains, originating from the Acapulco region of Mexico where it was cultivated for generations. This autoflower version preserves the golden bud coloration, uplifting cerebral effects, and earthy-citrus terpene profile of the original while adding autoflowering capability through careful Ruderalis integration over three filial generations.' },
  'high-resin-strains-mixpack': { parents: ['Gorilla Glue #4', 'White Widow', 'Death Star'], breeder: 'Various', origin: 'Multiple Origins', generation: 'Feminized', crossType: 'Curated Mix Pack', history: 'This pack combines three of the most resin-heavy cultivars in cannabis history. Gorilla Glue #4 (Chem Sis × Sour Dubb × Chocolate Diesel) from GG Strains. White Widow (Brazilian Sativa × South Indian Indica) from Green House Seeds, a 1995 Cannabis Cup winner. Death Star (Sensi Star × Sour Diesel) bred for its devastating potency and extraction potential.' },
  'couch-lock-pack': { parents: ['Various Indica Cultivars'], breeder: 'Royal King Seeds', origin: 'Various', generation: 'Feminized', crossType: 'Curated Mix Pack', history: 'The Couch Lock Pack is a curated selection of the most relaxing indica-dominant cultivars available. Each strain was selected for its heavy body effects, deep terpene profiles featuring grape, pine, and fuel notes, and dense bud structure ideal for evening use. These photoperiod feminized genetics represent the pinnacle of modern indica breeding.' },
  'goat-mixpack': { parents: ['Acapulco Gold', '9 Pound Hammer', 'Maui Pineapple Chunk'], breeder: 'Various', origin: 'Multiple Origins', generation: 'Feminized', crossType: 'Curated Mix Pack', history: 'The G.O.A.T Pack brings together three legendary genetics. Acapulco Gold — a Mexican landrace sativa known worldwide. 9 Pound Hammer (Gooberry × Hells OG × Jack the Ripper) — a devastating indica that hits like its namesake. Maui Pineapple Chunk — a tropical hybrid blending Hawaiian genetics with Pineapple Chunk\'s fruity sweetness. Together they represent the greatest of all time across sativa, indica, and hybrid categories.' },
  'american-strains-pack': { parents: ['Blue Dream Auto', 'Green Crack', 'Alaskan Thunder Fuck'], breeder: 'Various', origin: 'USA', generation: 'Mixed', crossType: 'Curated Mix Pack', history: 'Three iconic American cultivars in one pack. Blue Dream (Blueberry × Haze) — California\'s most popular strain for over a decade. Green Crack (Skunk #1 phenotype) — renamed by Snoop Dogg for its intense energizing effects. Alaskan Thunder Fuck — a legendary Matanuska Valley sativa with roots in 1970s Alaskan counterculture. This pack captures the diversity and innovation of American cannabis breeding.' },
  'deadly-sativas-mixpack': { parents: ['Alice In Wonderland', 'Amnesia Haze Auto', 'Panama Red'], breeder: 'Various', origin: 'Multiple Origins', generation: 'Mixed', crossType: 'Curated Sativa Mix', history: 'This sativa mix brings together some of the most cerebral genetics available. Alice In Wonderland — a potent sativa known for its psychedelic clarity. Amnesia Haze — a multiple Cannabis Cup winner from the Netherlands with complex citrus-incense terpenes. Panama Red — a pure landrace sativa from Panama\'s highlands that defined the counterculture era of the 1960s-70s.' },
  'hindu-kush-feminized': { parents: ['Hindu Kush Landrace'], breeder: 'Traditional Cultivars', origin: 'Hindu Kush Mountains, Afghanistan/Pakistan', generation: 'IBL (Inbred Line)', crossType: 'Pure Indica Landrace', history: 'Hindu Kush is a pure indica landrace originating from the rugged Hindu Kush mountain range along the Afghanistan-Pakistan border. For centuries, these plants adapted to harsh conditions — cold nights, dry air, and short growing seasons — developing thick resin coats as natural protection. This IBL (inbred line) preserves the original genetics that have been the foundation of countless modern indica hybrids including OG Kush, Purple Kush, and many more.' },
  'og-kush-feminized': { parents: ['Chemdawg', 'Hindu Kush'], breeder: 'Josh D / Matt "Bubba" Berger', origin: 'Florida → California, USA', generation: 'S1 Feminized', crossType: 'Hybrid Cross', history: 'OG Kush is the backbone of West Coast cannabis. Its exact origin is debated, but the most accepted lineage traces to a Chemdawg × Hindu Kush cross that was brought from Florida to Los Angeles in the mid-1990s. The "OG" likely stands for "Ocean Grown." This strain has parented dozens of modern classics including GSC, Headband, Bubba Kush, and SFV OG, making it one of the most important cultivars in cannabis history.' },
  'granddaddy-purple-feminized': { parents: ['Big Bud', 'Purple Urkle'], breeder: 'Ken Estes', origin: 'San Francisco Bay Area, California, USA', generation: 'S1 Feminized', crossType: 'Indica Cross', history: 'Granddaddy Purple was created in 2003 by Ken Estes in the San Francisco Bay Area. By crossing Big Bud\'s massive yields with Purple Urkle\'s stunning coloration and grape terpenes, Estes produced what became the definitive purple cannabis strain. GDP quickly became a staple in California medical dispensaries and remains one of the most recognized and beloved indica strains worldwide over two decades later.' },
  'g13-feminized': { parents: ['Afghani Indica (Government Research)'], breeder: 'Unknown / Government Research', origin: 'Mississippi, USA (disputed)', generation: 'S1 Feminized', crossType: 'Pure Indica', history: 'G13 is surrounded by one of cannabis\'s most fascinating legends. According to the story, the U.S. government collected cannabis strains from around the world during the 1960s-70s for research at the University of Mississippi. G13 (Government Indica Strain 13) was allegedly the most potent specimen, and a single clone was smuggled out by a researcher known only as "Neville." While the exact origin remains unverified, G13\'s legendary status is undeniable — its heavy indica effects, dense resin production, and mysterious backstory have made it one of the most iconic strains in cannabis history.' },
};

// Strain specifications for published products
const strainSpecs: Record<string, { thc: string; lineageShort: string; type: string; climate: string; harvest: string; height: string; yieldRating: string; yieldIndoor: string; yieldOutdoor: string; floweringTime: string }> = {
  'hindu-kush-feminized': { thc: '18% - 22% (High)', lineageShort: 'Hindu Kush Landrace (Pure Indica)', type: 'Feminized Photoperiod', climate: 'Continental, Temperate', harvest: 'Late September - Early October', height: '3 - 4 ft | 90 - 120 cm', yieldRating: 'High', yieldIndoor: '1.5 oz/ft² | 400 - 500 g/m²', yieldOutdoor: '15 - 21 oz/plant | 450 - 600 g/plant', floweringTime: '7 - 9 weeks' },
  'og-kush-feminized': { thc: '19% - 25% (Very High)', lineageShort: 'Chemdawg × Hindu Kush', type: 'Feminized Photoperiod', climate: 'Mediterranean, Warm', harvest: 'Early - Mid October', height: '3 - 4.5 ft | 90 - 140 cm', yieldRating: 'High', yieldIndoor: '1.5 oz/ft² | 400 - 500 g/m²', yieldOutdoor: '15 - 21 oz/plant | 450 - 600 g/plant', floweringTime: '8 - 9 weeks' },
  'granddaddy-purple-feminized': { thc: '17% - 23% (High)', lineageShort: 'Big Bud × Purple Urkle', type: 'Feminized Photoperiod', climate: 'Mediterranean, Temperate', harvest: 'Mid - Late October', height: '2 - 3 ft | 60 - 90 cm', yieldRating: 'Medium - High', yieldIndoor: '1.3 oz/ft² | 350 - 450 g/m²', yieldOutdoor: '14 - 18 oz/plant | 400 - 500 g/plant', floweringTime: '8 - 10 weeks' },
  'g13-feminized': { thc: '20% - 24% (Very High)', lineageShort: 'Afghani Indica (Government Research)', type: 'Feminized Photoperiod', climate: 'Continental, Temperate', harvest: 'Mid - Late October', height: '2 - 3 ft | 60 - 90 cm', yieldRating: 'Medium - High', yieldIndoor: '1.3 oz/ft² | 350 - 450 g/m²', yieldOutdoor: '14 - 18 oz/plant | 400 - 500 g/plant', floweringTime: '8 - 10 weeks' },
  'forbidden-fruit-feminized': { thc: '19% - 26% (Very High)', lineageShort: 'Cherry Pie × Tangie', type: 'Feminized Photoperiod', climate: 'Mediterranean, Warm', harvest: 'Early - Mid October', height: '3 - 4 ft | 90 - 120 cm', yieldRating: 'High', yieldIndoor: '1.5 oz/ft² | 400 - 500 g/m²', yieldOutdoor: '16 - 21 oz/plant | 450 - 600 g/plant', floweringTime: '8 - 10 weeks' },
  'fruity-pebbles-feminized': { thc: '18% - 22% (High)', lineageShort: 'Green Ribbon × GDP × Tahoe Alien', type: 'Feminized Photoperiod', climate: 'Temperate, Continental', harvest: 'Early October', height: '3 - 4.5 ft | 90 - 140 cm', yieldRating: 'Medium - High', yieldIndoor: '1.4 oz/ft² | 375 - 475 g/m²', yieldOutdoor: '14 - 19 oz/plant | 400 - 550 g/plant', floweringTime: '8 - 9 weeks' },
  'a-10-auto': { thc: '18% - 22% (High)', lineageShort: 'A-10 Photoperiod × Ruderalis', type: 'Autoflower', climate: 'All Climates (Adaptable)', harvest: '8 - 10 weeks from seed', height: '2 - 3.3 ft | 60 - 100 cm', yieldRating: 'Medium', yieldIndoor: '1.2 oz/ft² | 300 - 400 g/m²', yieldOutdoor: '3 - 7 oz/plant | 80 - 200 g/plant', floweringTime: '8 - 10 weeks (seed to harvest)' },
  'acapulco-gold-auto': { thc: '19% - 23% (High)', lineageShort: 'Acapulco Gold Landrace × Ruderalis', type: 'Autoflower Sativa', climate: 'All Climates (Adaptable)', harvest: '9 - 11 weeks from seed', height: '2.5 - 4 ft | 75 - 120 cm', yieldRating: 'Medium', yieldIndoor: '1.2 oz/ft² | 300 - 400 g/m²', yieldOutdoor: '4 - 8 oz/plant | 100 - 250 g/plant', floweringTime: '9 - 11 weeks (seed to harvest)' },
  'lemon-cherry-gelato-clone': { thc: '24% - 28% (Very High)', lineageShort: 'Sunset Sherbet × Girl Scout Cookies', type: 'Clone (Vegetative)', climate: 'Mediterranean, Controlled Indoor', harvest: 'Early - Mid October', height: '3 - 5 ft | 90 - 150 cm', yieldRating: 'High', yieldIndoor: '1.6 oz/ft² | 425 - 550 g/m²', yieldOutdoor: '17 - 24 oz/plant | 500 - 700 g/plant', floweringTime: '8 - 9 weeks' },
  'strawberry-fizz-prerolls': { thc: '18% - 22% (High)', lineageShort: 'Strawberry Cough × Fizzy OG', type: 'Preroll (0.75g)', climate: 'N/A (Ready to smoke)', harvest: 'N/A', height: 'N/A', yieldRating: 'N/A', yieldIndoor: 'N/A', yieldOutdoor: 'N/A', floweringTime: 'N/A' },
  'high-resin-strains-mixpack': { thc: '18% - 27% (Very High)', lineageShort: 'Gorilla Glue + White Widow + Death Star', type: 'Feminized Mix Pack (3 strains)', climate: 'Temperate, Continental', harvest: 'Early - Mid October', height: '3 - 5 ft | 90 - 150 cm', yieldRating: 'Very High', yieldIndoor: '1.5 - 1.8 oz/ft² | 400 - 600 g/m²', yieldOutdoor: '16 - 25 oz/plant | 450 - 700 g/plant', floweringTime: '8 - 10 weeks' },
  'couch-lock-pack': { thc: '20% - 26% (Very High)', lineageShort: 'Curated Indica-Dominant Mix', type: 'Feminized Mix Pack (3 strains)', climate: 'Temperate, Continental', harvest: 'Mid - Late October', height: '2.5 - 4 ft | 75 - 120 cm', yieldRating: 'High', yieldIndoor: '1.4 - 1.7 oz/ft² | 375 - 550 g/m²', yieldOutdoor: '14 - 21 oz/plant | 400 - 600 g/plant', floweringTime: '8 - 10 weeks' },
  'goat-mixpack': { thc: '18% - 25% (High - Very High)', lineageShort: 'Acapulco Gold + 9lb Hammer + Maui Pineapple Chunk', type: 'Feminized Mix Pack (3 strains)', climate: 'All Climates', harvest: 'Early - Late October', height: '3 - 6 ft | 90 - 180 cm', yieldRating: 'High', yieldIndoor: '1.4 - 1.7 oz/ft² | 375 - 550 g/m²', yieldOutdoor: '15 - 22 oz/plant | 425 - 650 g/plant', floweringTime: '8 - 11 weeks' },
  'american-strains-pack': { thc: '17% - 24% (High)', lineageShort: 'Blue Dream Auto + Green Crack + ATF', type: 'Mixed (Auto + Photoperiod)', climate: 'Temperate, Continental', harvest: 'Sept - October', height: '3 - 5 ft | 90 - 150 cm', yieldRating: 'High', yieldIndoor: '1.3 - 1.6 oz/ft² | 350 - 500 g/m²', yieldOutdoor: '14 - 21 oz/plant | 400 - 600 g/plant', floweringTime: '8 - 10 weeks' },
  'deadly-sativas-mixpack': { thc: '18% - 24% (High)', lineageShort: 'Alice In Wonderland + Amnesia Haze + Panama Red', type: 'Mixed Sativa (Auto + Photo)', climate: 'Warm, Mediterranean', harvest: 'October - November', height: '4 - 7 ft | 120 - 210 cm', yieldRating: 'Medium - High', yieldIndoor: '1.3 - 1.6 oz/ft² | 350 - 500 g/m²', yieldOutdoor: '14 - 22 oz/plant | 400 - 650 g/plant', floweringTime: '9 - 12 weeks' },
};

const tabs = ['Product Info', 'Terpenes', 'Grow Guide', 'Grow Journal', 'Lineage', 'Compare', 'Shipping', 'FAQ', 'Reviews'] as const;

// FAQ data for all published products
const productFaqs: Record<string, { q: string; a: string }[]> = {
  'hindu-kush-feminized': [
    { q: 'Is Hindu Kush Feminized good for beginner growers?', a: 'Yes. Hindu Kush Feminized is one of the most beginner-friendly strains available. Its compact structure, fast 7-9 week flowering time, and natural resistance to common growing mistakes make it an excellent first grow. The plant stays short and manageable indoors.' },
    { q: 'What does Hindu Kush Feminized taste and smell like?', a: 'Hindu Kush has a classic earthy, woody aroma with strong pine notes and subtle undertones of sandalwood and spice. The flavor is smooth — earthy on the inhale with a slightly sweet, spicy finish. It is the quintessential indica aroma.' },
    { q: 'How tall does Hindu Kush Feminized grow indoors?', a: 'Hindu Kush Feminized typically stays between 3-4 feet (90-120cm) indoors, making it ideal for grow tents and spaces with limited vertical clearance. Outdoor plants may reach slightly taller but remain compact compared to sativa varieties.' },
    { q: 'Can I grow Hindu Kush Feminized outdoors in the USA?', a: 'Yes. Hindu Kush originates from harsh mountain climates, so it handles cool Canadian nights better than most strains. It performs well outdoors in BC, New York, and Florida, with harvest typically ready by late September to early October.' },
    { q: 'What are the effects of Hindu Kush Feminized?', a: 'Hindu Kush delivers deep body relaxation, muscle tension relief, and a calm, peaceful state of mind. It is best suited for evening use — ideal for unwinding, reducing stress, and promoting restful sleep. THC levels range from 18-22%.' },
    { q: 'How much yield can I expect from Hindu Kush Feminized?', a: 'Indoor growers typically harvest 400-500 grams per square meter. Outdoor plants can produce 450-600 grams per plant when grown in suitable conditions with adequate sunlight and nutrients.' },
  ],
  'og-kush-feminized': [
    { q: 'Why is OG Kush so popular?', a: 'OG Kush is the parent strain behind dozens of modern classics including Girl Scout Cookies, Headband, and Bubba Kush. Its unique fuel-pine-citrus terpene profile, potent balanced effects, and reliable growing performance have made it the foundation of West Coast cannabis culture since the mid-1990s.' },
    { q: 'What THC levels does OG Kush Feminized produce?', a: 'OG Kush Feminized typically produces THC levels between 19-25% when grown under optimal conditions. Proper lighting, nutrient management, and environmental control during flowering maximize cannabinoid production.' },
    { q: 'Is OG Kush Feminized indica or sativa?', a: 'OG Kush Feminized is a hybrid, often described as slightly indica-leaning. It combines Chemdawg and Hindu Kush genetics, delivering both cerebral uplift from its sativa side and physical relaxation from its indica heritage.' },
    { q: 'How long does OG Kush Feminized take to flower?', a: 'OG Kush Feminized flowers in approximately 8-9 weeks indoors under a 12/12 light cycle. Outdoor growers in the USA can expect harvest readiness around early to mid-October, depending on regional climate conditions.' },
    { q: 'What does OG Kush smell like?', a: 'OG Kush has one of the most recognizable aromas in cannabis — a complex blend of sharp pine, fresh lemon zest, and diesel fuel over an earthy, spicy base. The smell is strong and distinctive, so carbon filtration is recommended for indoor grows.' },
    { q: 'Can I train OG Kush Feminized plants?', a: 'Absolutely. OG Kush responds very well to training techniques including topping, low-stress training (LST), and SCROG setups. Its strong lateral branching makes it ideal for creating an even canopy that maximizes light penetration and bud production.' },
  ],
  'granddaddy-purple-feminized': [
    { q: 'Why are Granddaddy Purple buds purple?', a: 'The purple coloration comes from anthocyanins — pigments in the plant that become visible when chlorophyll production slows during flowering. Cooler nighttime temperatures (around 15-20°C) during the final weeks of flowering enhance the purple hues. The genetics from Purple Urkle make GDP especially prone to dramatic color development.' },
    { q: 'Is Granddaddy Purple Feminized strong?', a: 'Yes. GDP typically produces THC levels between 17-23%, delivering potent full-body relaxation. While not the highest THC strain available, its effects are deeply physical and calming — perfect for evening use, stress relief, and promoting sleep.' },
    { q: 'What does Granddaddy Purple taste like?', a: 'GDP is famous for its sweet grape and fresh berry flavor with subtle earthy undertones. The taste closely mirrors the aroma — like a dessert-quality grape candy with a smooth, sweet finish. It is one of the most flavorful indica strains available.' },
    { q: 'How compact is Granddaddy Purple Feminized?', a: 'Very compact. GDP typically grows to just 2-3 feet (60-90cm) indoors, making it one of the shortest indica strains available. This compact size is perfect for small grow tents, closets, and spaces where height is limited.' },
    { q: 'Does Granddaddy Purple Feminized yield well?', a: 'GDP produces medium to high yields thanks to its Big Bud parentage. The dense, heavy colas can benefit from support staking during late flowering. Expect solid production relative to the plant size — GDP punches above its weight.' },
    { q: 'Is Granddaddy Purple good for medical use?', a: 'GDP is widely chosen for its relaxing and stress-relieving properties. Many users report it helps with muscle tension, sleep difficulties, and general discomfort. Its calming effects without extreme sedation make it a versatile evening strain.' },
  ],
  'g13-feminized': [
    { q: 'Is the G13 government origin story real?', a: 'The legend claims G13 was developed at the University of Mississippi as part of government cannabis research in the 1960s-70s, and a clone was smuggled out by a researcher. While this origin story has never been officially confirmed, G13 has earned its legendary status through decades of consistently powerful performance.' },
    { q: 'How potent is G13 Feminized?', a: 'G13 Feminized typically produces THC levels between 20-24%, placing it among the more potent indica strains available. The effects are deeply physical — heavy body relaxation and sedation that live up to the strain legendary reputation.' },
    { q: 'What is the best environment for growing G13?', a: 'G13 thrives in controlled indoor environments where temperature (20-26°C) and humidity can be carefully managed. The dense bud structure requires good airflow to prevent moisture issues. The compact 2-3 foot height makes it perfect for grow tents.' },
    { q: 'How does G13 Feminized smell?', a: 'G13 has a complex aroma profile combining earthy pine, sharp skunk, subtle spice, and occasional citrus notes. As buds cure, woody sweetness and hashish-like richness emerge. The scent is pungent — carbon filtration is strongly recommended.' },
    { q: 'Is G13 Feminized difficult to grow?', a: 'G13 is considered intermediate difficulty. The main challenge is managing humidity during late flowering due to the extremely dense bud structure. Keep relative humidity below 50% and maintain strong airflow in the final weeks to protect your harvest.' },
    { q: 'What are G13 Feminized best used for?', a: 'G13 is a dedicated evening strain. Its powerful body effects make it ideal for nighttime relaxation, stress relief, and sleep preparation. This is not a daytime strain — expect deep physical calm and potential couch-lock at higher doses.' },
  ],
  'forbidden-fruit-feminized': [
    { q: 'What makes Forbidden Fruit Feminized special?', a: 'Forbidden Fruit stands out for its extraordinary combination of visual appeal and flavor. The dense buds display deep purple hues with bright orange pistils, and the tropical fruit terpene profile — cherry, tangerine, and berry — is one of the most complex in cannabis.' },
    { q: 'Is Forbidden Fruit Feminized indica or sativa?', a: 'Forbidden Fruit is an indica-dominant hybrid, typically around 70% indica and 30% sativa. The Cherry Pie parent contributes indica structure and relaxing effects, while Tangie adds bright citrus terpenes and a subtle mood uplift.' },
    { q: 'How do I get the purple colors in Forbidden Fruit?', a: 'The purple coloration is genetic but enhanced by environmental conditions. Lowering nighttime temperatures to around 15-18°C during the final 2-3 weeks of flowering encourages dramatic purple development. The colors emerge naturally from the Cherry Pie and GDP lineage.' },
    { q: 'What does Forbidden Fruit taste like?', a: 'Forbidden Fruit tastes like tropical fruit dessert — ripe cherry, tangerine zest, sweet berry, and subtle cream on the exhale. It is widely regarded as one of the best-tasting indica strains available, making it a favorite among flavor-focused consumers.' },
    { q: 'Can I grow Forbidden Fruit Feminized in a small tent?', a: 'Yes. Forbidden Fruit grows with a compact indica structure that fits comfortably in standard grow tents. The plants respond well to topping and LST training. Expect a manageable height of 3-4 feet indoors with dense, colorful flower development.' },
    { q: 'How long does Forbidden Fruit take to flower?', a: 'Forbidden Fruit Feminized flowers in approximately 8-10 weeks indoors. The color development and trichome production intensify significantly during the final 2-3 weeks, so patience at the end of the cycle is rewarded with stunning buds.' },
  ],
  'fruity-pebbles-feminized': [
    { q: 'Does Fruity Pebbles really taste like the cereal?', a: 'The name is well-earned — Fruity Pebbles delivers a sweet, fruity aroma and flavor that many users compare to the breakfast cereal. Expect layers of mixed tropical fruit, sweet berry, cream, and candy notes that create a unique dessert-like experience.' },
    { q: 'Is Fruity Pebbles Feminized rare?', a: 'Yes. Fruity Pebbles OG was originally a limited release by Alien Genetics, making it one of the rarer strains in cannabis. Our feminized version preserves the sought-after genetics, giving growers reliable access to this exclusive three-way hybrid.' },
    { q: 'What are the effects of Fruity Pebbles?', a: 'Fruity Pebbles delivers balanced hybrid effects — an uplifting mood boost and gentle mental stimulation followed by smooth body relaxation without heavy sedation. It is versatile enough for both afternoon and evening use.' },
    { q: 'What is the genetic lineage of Fruity Pebbles?', a: 'Fruity Pebbles is a three-way cross of Green Ribbon, Granddaddy Purple, and Tahoe Alien — created by Alien Genetics in California. This complex lineage combines uplifting energy, relaxing body effects, and exceptional resin production.' },
    { q: 'How does Fruity Pebbles Feminized grow?', a: 'Fruity Pebbles grows with balanced hybrid structure — moderate stretch during early flowering followed by dense bud development. The 8-9 week flowering period is efficient. Carbon filtration is recommended as the sweet aroma becomes very strong.' },
    { q: 'Is Fruity Pebbles good for extracts?', a: 'Absolutely. The heavy trichome production and exceptional terpene profile make Fruity Pebbles an excellent choice for rosin, live resin, and other concentrates. The sweet, cereal-like flavors translate beautifully into concentrate form.' },
  ],
  'a-10-auto': [
    { q: 'How fast does A-10 Auto grow from seed to harvest?', a: 'A-10 Auto completes its entire lifecycle in approximately 8-10 weeks from germination to harvest. This rapid timeline allows American growers to achieve multiple harvests per year, even in regions with shorter growing seasons.' },
    { q: 'Do I need to change light cycles for A-10 Auto?', a: 'No. As an autoflowering strain, A-10 Auto flowers based on plant age, not light cycles. Most growers keep lights on 18-20 hours per day throughout the entire grow. This simplicity makes it perfect for beginners.' },
    { q: 'How tall does A-10 Auto get?', a: 'A-10 Auto stays compact at 60-100cm (2-3.3 feet), making it ideal for small grow tents, closets, balconies, and any space where discretion matters. Despite the small size, it produces dense, resin-covered buds.' },
    { q: 'Should I transplant A-10 Auto seedlings?', a: 'No — plant autoflower seeds directly in their final container. Transplanting can cause stress that slows growth, and with a short lifecycle, autoflowers do not have time to recover. Use 3-5 gallon pots for best results.' },
    { q: 'What are the effects of A-10 Auto?', a: 'A-10 Auto delivers a balanced experience — mild cerebral uplift and creative stimulation followed by comfortable body relaxation. With 18-22% THC, it is potent enough for experienced users while remaining approachable for newcomers.' },
    { q: 'Can I grow A-10 Auto outdoors in the USA?', a: 'Yes. A-10 Auto is excellent for Canadian outdoor growing because the short lifecycle completes before fall frost in every state. Plant after the last spring frost and harvest before temperatures drop. Multiple outdoor cycles are possible in warmer regions.' },
  ],
  'acapulco-gold-auto': [
    { q: 'What makes Acapulco Gold a legendary strain?', a: 'Acapulco Gold is one of the original famous cannabis strains, originating from the Acapulco region of Mexico. It defined cannabis culture in the 1960s-70s with its distinctive golden buds and euphoric sativa effects. This autoflower version preserves that heritage in a modern format.' },
    { q: 'Is Acapulco Gold Auto good for daytime use?', a: 'Yes — this is a premier daytime strain. The sativa-dominant effects promote mental clarity, creative thinking, focus, and positive mood without heavy body sedation. It pairs perfectly with creative work, social activities, and outdoor adventures.' },
    { q: 'How long does Acapulco Gold Auto take to harvest?', a: 'Acapulco Gold Auto completes its lifecycle in 9-11 weeks from seed. This is notably fast for a sativa strain — traditional photoperiod Acapulco Gold can take 14+ weeks to flower. The autoflower version gives you classic sativa genetics on a compressed timeline.' },
    { q: 'What does Acapulco Gold taste like?', a: 'Expect earthy flavors with bright citrus accents, mild spice, and subtle sweetness. The terpene profile reflects its Mexican landrace heritage — grounded and natural rather than artificially sweet. The smoke is smooth with herbal-citrus notes.' },
    { q: 'Can Acapulco Gold Auto handle Canadian winters?', a: 'As an outdoor strain, Acapulco Gold Auto is best planted after the last frost and harvested before fall temperatures drop. The 9-11 week lifecycle makes it viable across all Canadian states during summer months. Indoor growing works year-round.' },
    { q: 'Why choose the autoflower version over regular Acapulco Gold?', a: 'The autoflower version offers the same legendary genetics with major practical advantages: faster harvest (9-11 weeks vs 14+ weeks), no light cycle changes needed, compact size for small spaces, and compatibility with short Canadian growing seasons.' },
  ],
  'lemon-cherry-gelato-clone': [
    { q: 'Why buy a clone instead of seeds?', a: 'Clones are genetically identical to the mother plant, guaranteeing the exact phenotype. With seeds, you may get varying expressions of the strain. A Lemon Cherry Gelato clone ensures you get the specific terpene profile, bud structure, and potency that made this strain famous.' },
    { q: 'How do I care for a cannabis clone when it arrives?', a: 'Place the clone under gentle light immediately and keep humidity high (70-80%) for the first few days. Transplant into your growing medium once the clone shows new root growth. Gradually increase light intensity over the first week.' },
    { q: 'How potent is Lemon Cherry Gelato?', a: 'Lemon Cherry Gelato is a high-potency strain with THC levels often reaching the mid-20% range. The effects are powerful — euphoric cerebral lift followed by calming body relaxation. It is best suited for experienced consumers.' },
    { q: 'What makes Lemon Cherry Gelato smell so unique?', a: 'The terpene profile combines sweet lemon zest, tart cherry, and creamy vanilla-gelato notes — created by limonene, caryophyllene, and linalool. This combination is rare in cannabis and produces an aroma that is instantly recognizable.' },
    { q: 'Can I take cuttings from my Lemon Cherry Gelato clone?', a: 'Yes. Once your clone is established and in vegetative growth, you can take cuttings to create additional clones. This allows you to maintain the genetics indefinitely without purchasing new plants.' },
    { q: 'How long does Lemon Cherry Gelato take to flower?', a: 'Lemon Cherry Gelato clones typically flower in 8-9 weeks. Since clones start in vegetative stage, you can begin flowering sooner than with seeds — reducing overall grow time while maintaining the same premium genetics.' },
  ],
  'strawberry-fizz-prerolls': [
    { q: 'How much cannabis is in each Strawberry Fizz preroll?', a: 'Each Strawberry Fizz preroll contains 0.75 grams of premium THCa flower. This is a comfortable session size — enough for a full experience without being excessive.' },
    { q: 'What effects should I expect from Strawberry Fizz?', a: 'Strawberry Fizz delivers balanced hybrid effects — a gentle mood uplift and creative stimulation paired with light body relaxation. It is not heavily sedating, making it suitable for social settings, creative activities, or casual unwinding.' },
    { q: 'Why does Strawberry Fizz taste like strawberry soda?', a: 'The sweet strawberry-citrus flavor comes from a terpene profile rich in myrcene, limonene, and caryophyllene. These natural compounds create the signature berry sweetness and effervescent citrus notes without any artificial flavoring.' },
    { q: 'Are Strawberry Fizz prerolls ready to smoke?', a: 'Yes. Each preroll is professionally rolled and ready to light. No grinding, rolling, or preparation needed — simply light the end and enjoy. The even construction ensures consistent burn and smooth airflow throughout.' },
    { q: 'Is Strawberry Fizz good for beginners?', a: 'Yes. The approachable potency and balanced effects make Strawberry Fizz prerolls a good choice for newer cannabis users. The flavor is sweet and smooth rather than harsh, and the effects are gentle without being overwhelming.' },
    { q: 'How should I store Strawberry Fizz prerolls?', a: 'Store prerolls in a cool, dry place away from direct sunlight. The original packaging is designed to maintain freshness. For extended storage, an airtight container with a humidity pack will preserve flavor and potency.' },
  ],
  'high-resin-strains-mixpack': [
    { q: 'What strains are included in the High Resin Pack?', a: 'The pack includes Gorilla Glue #4 (up to 26% THC), White Widow (1995 Cannabis Cup winner), and Death Star (up to 27% THC). All three are feminized seeds selected for exceptional trichome production and extraction potential.' },
    { q: 'Is the High Resin Pack good for making concentrates?', a: 'Absolutely — this pack was specifically curated for extraction. The heavy trichome coverage makes all three strains ideal for rosin pressing, bubble hash, dry sift, live resin, and shatter production.' },
    { q: 'Are all seeds in the pack feminized?', a: 'Yes. Every seed in the High Resin Pack is feminized, meaning all plants will produce flower. This maximizes your grow space and ensures every plant contributes to your harvest.' },
    { q: 'How many seeds of each strain do I get?', a: 'The pack is available in 3 seeds (1 of each strain), 6 seeds (2 of each), or 15 seeds (5 of each). Each option gives you equal numbers of all three strains.' },
    { q: 'Can beginners grow the High Resin Pack?', a: 'White Widow and Gorilla Glue are suitable for beginners with basic growing knowledge. Death Star requires slightly more attention to humidity control due to its dense buds. Overall, the pack is accessible for growers with at least one grow under their belt.' },
    { q: 'What flowering times should I expect?', a: 'All three strains flower within 8-10 weeks indoors. White Widow tends to finish slightly earlier, while Death Star may take the full 10 weeks. Staggering your light cycle switch can help synchronize harvest timing.' },
  ],
  'couch-lock-pack': [
    { q: 'Will the Couch Lock Pack actually lock me to the couch?', a: 'The name is well-earned. These indica-dominant strains deliver heavy physical relaxation that most users describe as deeply sedating. They are best suited for evening use when you have no plans to be active.' },
    { q: 'What terpenes are in the Couch Lock Pack strains?', a: 'The pack features strains with grape, pine, and fuel-forward terpene profiles dominated by myrcene, pinene, and caryophyllene. These terpenes contribute to both the rich aromas and the deeply relaxing effects.' },
    { q: 'Are these photoperiod or autoflower seeds?', a: 'All seeds in the Couch Lock Pack are feminized photoperiod varieties. This means you control when flowering begins by switching to a 12/12 light cycle, giving you full control over plant size and vegetative growth time.' },
    { q: 'How much yield can I expect?', a: 'Individual yields vary by strain, but the pack generally produces high yields with dense, heavy colas. Indoor growers can expect 375-550 grams per square meter across the three strains with proper lighting and nutrients.' },
    { q: 'Are these strains good for sleep?', a: 'Yes. The heavy indica effects make all three strains in this pack excellent choices for promoting sleep and relaxation. Many users specifically choose these genetics for their evening wind-down routine.' },
    { q: 'Can I grow all three strains in the same tent?', a: 'Yes, but be aware that different strains may have slightly different growth rates and heights. Using LST and topping techniques will help create an even canopy. All three share similar environmental preferences.' },
  ],
  'goat-mixpack': [
    { q: 'Why is it called the G.O.A.T Pack?', a: 'G.O.A.T stands for Greatest Of All Time. The pack includes Acapulco Gold (legendary sativa), 9 Pound Hammer (devastating indica), and Maui Pineapple Chunk (tropical hybrid) — three strains that represent the absolute best of their respective categories.' },
    { q: 'Will all three strains grow to the same height?', a: 'No. Acapulco Gold grows taller with sativa structure, 9 Pound Hammer stays compact as an indica, and Maui Pineapple Chunk falls in between. This variety makes the pack an excellent learning experience but requires some canopy management.' },
    { q: 'Which strain in the pack is the most potent?', a: '9 Pound Hammer is typically the most potent, delivering heavy indica effects that live up to its name. Acapulco Gold offers potent sativa cerebral effects, while Maui Pineapple Chunk provides balanced potency.' },
    { q: 'Are all three strains feminized?', a: 'Yes. Every seed in the G.O.A.T Pack is feminized, ensuring all plants produce flowers. This eliminates the need to identify and remove male plants.' },
    { q: 'What is the best way to grow three different strains together?', a: 'Use training techniques (topping, LST) to manage height differences. Consider starting the sativa-leaning Acapulco Gold a week later to compensate for its taller growth. All three share similar light and nutrient requirements.' },
    { q: 'Is this pack good for beginners?', a: 'The G.O.A.T Pack is best suited for growers with some experience, as managing three different strain types requires basic understanding of plant structure and training. However, all three strains are fundamentally robust and forgiving.' },
  ],
  'american-strains-pack': [
    { q: 'What strains are in the American Strains Pack?', a: 'The pack includes Blue Dream Autoflower (California classic), Green Crack (renamed by Snoop Dogg), and Alaskan Thunder Fuck (1970s Matanuska Valley legend). Together they represent the diversity and innovation of American cannabis breeding.' },
    { q: 'Does this pack include both autoflower and photoperiod seeds?', a: 'Yes. Blue Dream is an autoflower variety for faster harvests, while Green Crack and Alaskan Thunder Fuck are photoperiod strains. This mix gives you flexibility in growing schedules and techniques.' },
    { q: 'Are these strains good for daytime use?', a: 'Yes. All three strains lean toward energizing, uplifting effects. Blue Dream offers gentle balanced stimulation, Green Crack delivers intense energy, and ATF provides clear-headed potency. This is a daytime-focused pack.' },
    { q: 'Can I grow the autoflower and photoperiod seeds together?', a: 'Yes, but keep in mind that Blue Dream Auto will flower regardless of light cycle, while Green Crack and ATF need 12/12 to flower. You can grow them in the same space if you are okay with the auto finishing first.' },
    { q: 'What makes Green Crack so energizing?', a: 'Green Crack is a Skunk #1 phenotype selected specifically for its intense cerebral stimulation. High concentrations of terpinolene and limonene contribute to its sharp, energizing effects. Snoop Dogg renamed it for a reason.' },
    { q: 'How do these strains perform in Canadian climates?', a: 'All three adapt well to Canadian growing conditions. Blue Dream Auto finishes quickly for shorter seasons. Green Crack and ATF perform best indoors or in warmer states like BC and New York with longer summer days.' },
  ],
  'deadly-sativas-mixpack': [
    { q: 'Why is it called the Deadly Sativas Mixpack?', a: 'Deadly refers to the potency and intensity of the cerebral effects. These three strains — Alice In Wonderland, Amnesia Haze Auto, and Panama Red — deliver some of the most powerful sativa experiences available.' },
    { q: 'Are these strains too strong for beginners?', a: 'The intense cerebral effects may be overwhelming for new cannabis users. We recommend starting with small amounts if you are not experienced with sativa strains. However, growing the plants themselves is manageable for growers with basic knowledge.' },
    { q: 'How tall do sativa plants grow?', a: 'Sativa plants naturally grow taller than indicas. Indoor growers should plan for 4-7 feet of height and use training techniques like topping and LST to manage vertical growth. The Amnesia Haze Auto will stay more compact.' },
    { q: 'Which strain in the pack flowers fastest?', a: 'Amnesia Haze Auto finishes fastest since it is an autoflowering variety. Alice In Wonderland and Panama Red are photoperiod sativas that typically require longer flowering periods of 10-12+ weeks.' },
    { q: 'What are the effects of sativa strains?', a: 'Sativa strains primarily deliver cerebral effects: mental clarity, creative stimulation, mood elevation, social energy, and focused awareness. They are the opposite of heavy indica body sedation.' },
    { q: 'Is the Deadly Sativas pack good for creative people?', a: 'Absolutely. All three strains are known for enhancing creativity and mental engagement. Artists, musicians, writers, and anyone seeking inspiration often prefer sativa varieties for their stimulating, mind-expanding effects.' },
  ],
};
type Tab = typeof tabs[number];

export function ProductDetail({
  product,
  relatedProducts,
  galleryImages = [],
}: {
  product: Product;
  relatedProducts: Product[];
  galleryImages?: string[];
}) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('Product Info');
  const hasMainImage = product.imageUrl && !product.imageUrl.startsWith('/images/seeds/');
  const allImages = [
    ...(hasMainImage ? [product.imageUrl] : []),
    ...galleryImages,
  ];
  const [activeImage, setActiveImage] = useState(0);

  // Parse seed options - can be objects {label, price} or strings
  const seedOpts: { label: string; price: number }[] = (product.seedOptions || []).map((opt: any) => {
    if (typeof opt === 'object' && opt.label) return { label: opt.label, price: parseFloat(opt.price) || 0 };
    return { label: String(opt), price: product.price };
  });
  const [selectedOption, setSelectedOption] = useState(0);
  const currentPrice = seedOpts.length > 0 ? seedOpts[selectedOption]?.price || product.price : product.price;

  const typeLabel = {
    indica: { text: 'Indica', color: 'bg-purple-100 text-purple-700' },
    sativa: { text: 'Sativa', color: 'bg-amber-100 text-amber-700' },
    hybrid: { text: 'Hybrid', color: 'bg-emerald-100 text-emerald-700' },
    cbd: { text: 'CBD', color: 'bg-blue-100 text-blue-700' },
  }[product.strainType];

  // Use hardcoded data for original products, dynamic generators for all others
  const lineage = lineageData[product.slug] || generateLineage(product);
  const specs = strainSpecs[product.slug] || generateStrainSpecs(product);
  const faqs = productFaqs[product.slug]?.length ? productFaqs[product.slug] : generateFAQs(product);
  const hardcodedTerpenes = productTerpenes[product.slug] || [];
  const terpenes = hardcodedTerpenes.length > 0 ? hardcodedTerpenes : generateTerpenes(product);
  const hardcodedJournal = getGrowJournal(product.slug, product.autoflower, product.name);
  const journal = hardcodedJournal.length > 0 ? hardcodedJournal : generateGrowJournal(product);

  const handleAddToCart = () => {
    const variant = seedOpts.length > 1 ? seedOpts[selectedOption] : undefined;
    addItem(product, qty, variant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs uppercase tracking-[1px] text-[#192026]/40 mb-8">
        <Link href="/" className="hover:text-[#275C53] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/product-category/shop-all-cannabis-seeds" className="hover:text-[#275C53] transition-colors">Seeds</Link>
        <span>/</span>
        <span className="text-[#275C53] truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-white rounded-2xl flex items-center justify-center border border-[#275C53]/10 overflow-hidden max-w-full mx-auto">
            {allImages.length > 0 ? (
              <img src={allImages[activeImage]} alt={product.name} loading="eager" decoding="async" className="w-full h-full object-contain p-2" />
            ) : (
              <span className="text-8xl opacity-30">🌱</span>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-3">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${
                    activeImage === i ? 'border-[#275C53] shadow-md' : 'border-[#275C53]/10 hover:border-[#275C53]/40'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain p-0.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full ${typeLabel.color}`}>
              {typeLabel.text}
            </span>
            {product.feminized && (
              <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-pink-100 text-pink-700">Feminized</span>
            )}
            {product.autoflower && (
              <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-cyan-100 text-cyan-700">Autoflower</span>
            )}
            {product.inStock ? (
              <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600">In Stock</span>
            ) : (
              <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-red-50 text-red-500">Out of Stock</span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-normal text-[#275C53]">{product.name}</h1>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-[14px] text-[#192026]/50 mt-3 leading-relaxed">{product.shortDescription}</p>
          )}

          {/* Seed options + Price */}
          {seedOpts.length > 1 ? (
            <div className="mt-6">
              <span className="text-[10px] uppercase tracking-[1px] text-[#192026]/40 block mb-3">Select Pack Size</span>
              <div className="grid grid-cols-5 gap-1.5">
                {seedOpts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedOption(i)}
                    className={`flex flex-col items-center px-1 sm:px-3 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedOption === i
                        ? 'border-[#275C53] bg-[#275C53] text-white shadow-lg'
                        : 'border-[#275C53]/15 bg-white text-[#192026] hover:border-[#275C53]/40'
                    }`}
                  >
                    <span className={`text-[8px] sm:text-[10px] font-bold ${selectedOption === i ? 'text-white' : 'text-[#192026]/70'}`}>{opt.label}</span>
                    <span className={`text-[11px] sm:text-[13px] font-bold mt-0.5 ${selectedOption === i ? 'text-[#D7B65D]' : 'text-[#275C53]'}`}>${opt.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <span className="text-3xl font-semibold text-[#275C53]">${currentPrice.toFixed(2)}</span>
                <span className="text-sm text-[#192026]/40 ml-2">USD</span>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <span className="text-3xl font-semibold text-[#275C53]">${currentPrice.toFixed(2)}</span>
              <span className="text-sm text-[#192026]/40 ml-2">USD</span>
            </div>
          )}

          {/* Add to cart */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center bg-white border border-[#275C53]/15 rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-[#192026]/50 hover:text-[#275C53] transition-colors cursor-pointer">-</button>
              <span className="px-2 py-3 text-[#192026] min-w-[2rem] text-center font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-4 py-3 text-[#192026]/50 hover:text-[#275C53] transition-colors cursor-pointer">+</button>
            </div>
            <button onClick={handleAddToCart} className="btn-main flex-1 !py-3.5">
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-2 shrink-0 ${
                isInWishlist
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'bg-white border-[#275C53]/15 text-[#192026]/30 hover:text-red-400 hover:border-red-300'
              }`}
              aria-label={isInWishlist ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {added && (
            <button onClick={toggleCart} className="btn-second w-full mt-3 !py-3">View Cart &rarr;</button>
          )}

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="bg-[#275C53]/5 rounded-xl p-3 text-center">
              <span className="text-lg block mb-1">🇺🇸</span>
              <span className="text-[10px] uppercase tracking-[1px] text-[#275C53] font-semibold">Free Shipping</span>
            </div>
            <div className="bg-[#275C53]/5 rounded-xl p-3 text-center">
              <span className="text-lg block mb-1">🌱</span>
              <span className="text-[10px] uppercase tracking-[1px] text-[#275C53] font-semibold">Germination Guarantee</span>
            </div>
            <div className="bg-[#275C53]/5 rounded-xl p-3 text-center">
              <span className="text-lg block mb-1">🔒</span>
              <span className="text-[10px] uppercase tracking-[1px] text-[#275C53] font-semibold">Discreet Packaging</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-8">
        <div className="bg-[#275C53]/5 rounded-t-2xl overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 sm:px-5 text-[10px] font-bold uppercase tracking-[0.5px] transition-all cursor-pointer text-center whitespace-nowrap ${activeTab === tab ? 'bg-white text-[#275C53] shadow-sm rounded-t-2xl' : 'text-[#192026]/30 hover:text-[#192026]/60 hover:bg-white/50'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-b-2xl border border-t-0 border-[#275C53]/10 p-6 sm:p-8">
          {/* Product Info Tab */}
          {activeTab === 'Product Info' && (
            <div className="space-y-8">
              <DescriptionRenderer description={product.description} productName={product.name} />

              {/* Effects Section */}
              {product.effects.length > 0 && (
                <EffectsGrid effects={product.effects} strainType={product.strainType} />
              )}

              {/* Best For & Strain Type */}
              <div className="grid sm:grid-cols-2 gap-6">
                {product.bestUse.length > 0 && (
                  <div className="bg-[#F5F0EA] rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-[#275C53] uppercase tracking-[1px] mb-3">Best For</h3>
                    <div className="space-y-2">
                      {product.bestUse.map((use) => (
                        <div key={use} className="flex items-center gap-2 text-[13px] text-[#192026]/60">
                          <span className="text-[#D7B65D]">✦</span> {use}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-[#F5F0EA] rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-[#275C53] uppercase tracking-[1px] mb-3">Strain Type</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex h-3 rounded-full overflow-hidden bg-white">
                        <div className="bg-purple-400 rounded-l-full" style={{ width: `${product.indicaPercent}%` }} />
                        <div className="bg-amber-400 rounded-r-full" style={{ width: `${product.sativaPercent}%` }} />
                      </div>
                      <div className="flex justify-between text-[11px] text-[#192026]/40 mt-1">
                        <span>Indica {product.indicaPercent}%</span>
                        <span>Sativa {product.sativaPercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Strain Specs Table */}
              {specs && (
                <div>
                  <h2 className="text-xl font-bold text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Strain Data Sheet</h2>
                  <div className="border border-[#275C53]/10 rounded-2xl overflow-hidden bg-[#F5F0EA]">
                    <SpecRow icon="🧬" label="THC" value={specs.thc} />
                    <SpecRow icon="🌿" label="Lineage" value={specs.lineageShort} />
                    <SpecRow icon="🔬" label="Type" value={specs.type} />
                    <SpecRow icon="🌡" label="Climate" value={specs.climate} />
                    <SpecRow icon="📅" label="Harvest" value={specs.harvest} />
                    <SpecRow icon="📏" label="Height" value={specs.height} />
                    <SpecRow icon="⚖️" label="Yield" value={specs.yieldRating} />
                    <SpecRow icon="🏠" label="Yield Indoor" value={specs.yieldIndoor} />
                    <SpecRow icon="🌳" label="Yield Outdoor" value={specs.yieldOutdoor} />
                    <SpecRow icon="⏱" label="Flowering Time" value={specs.floweringTime} last />
                  </div>
                </div>
              )}

              {/* Packaging Section */}
              <div>
                <h2 className="text-xl font-bold text-[#275C53] mb-6" style={{ fontFamily: 'var(--font-patua)' }}>Packaging</h2>
                <div className="bg-[#F5F0EA] rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
                    {/* Front of package */}
                    <div className="relative flex-shrink-0">
                      <div className="w-[180px] h-[240px] rounded-2xl bg-gradient-to-b from-[#6B3FA0] to-[#4A2D6E] shadow-lg flex flex-col items-center justify-between p-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-5 bg-[#8B5FC0]/40 flex items-center justify-end px-2">
                          <span className="text-[5px] text-white/60 uppercase tracking-wider">Resealable +</span>
                        </div>
                        <div className="mt-5 text-center">
                          <div className="text-white font-bold text-2xl tracking-wider" style={{ fontFamily: 'var(--font-patua)' }}>RK</div>
                          <div className="text-[#D7B65D] text-[7px] uppercase tracking-[2px] mt-0.5">Royal King Seeds</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[#D7B65D] text-[8px] font-bold uppercase tracking-wider leading-tight">
                            {product.autoflower ? 'Autoflowering' : 'Photoperiod'}
                            <br />
                            {product.feminized ? 'Feminized Premium' : 'Regular'}
                            <br />
                            Seeds
                          </div>
                        </div>
                        <div className="text-[5px] text-white/30 uppercase tracking-wider text-center">
                          Premium Canadian Genetics
                        </div>
                      </div>
                      {/* Callout lines - left side */}
                      <div className="hidden lg:block absolute top-[40px] -left-[160px] text-right">
                        <span className="text-[12px] text-[#192026]/70 font-medium">Sealed to ensure<br />authenticity</span>
                        <div className="absolute top-[12px] right-[-28px] w-[24px] h-[1px] bg-[#192026]/20" />
                        <div className="absolute top-[10px] right-[-32px] w-[8px] h-[8px] rounded-full bg-[#275C53]" />
                      </div>
                      <div className="hidden lg:block absolute top-[110px] -left-[160px] text-right">
                        <span className="text-[12px] text-[#192026]/70 font-medium">Waterproof Coating</span>
                        <div className="absolute top-[8px] right-[-28px] w-[24px] h-[1px] bg-[#192026]/20" />
                        <div className="absolute top-[6px] right-[-32px] w-[8px] h-[8px] rounded-full bg-[#275C53]" />
                      </div>
                      <div className="hidden lg:block absolute top-[175px] -left-[160px] text-right">
                        <span className="text-[12px] text-[#192026]/70 font-medium">Aluminium interior<br />lining</span>
                        <div className="absolute top-[12px] right-[-28px] w-[24px] h-[1px] bg-[#192026]/20" />
                        <div className="absolute top-[10px] right-[-32px] w-[8px] h-[8px] rounded-full bg-[#275C53]" />
                      </div>
                    </div>

                    {/* Seeds vial */}
                    <div className="flex-shrink-0">
                      <div className="flex flex-col items-center">
                        <div className="w-[40px] h-[16px] bg-white/80 rounded-t-full border border-[#192026]/10" />
                        <div className="w-[32px] h-[70px] bg-gradient-to-b from-white/90 to-white/60 border border-[#192026]/10 border-t-0 rounded-b-lg flex items-end justify-center pb-2">
                          <div className="flex flex-wrap gap-[2px] justify-center px-1">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="w-[7px] h-[9px] rounded-full bg-gradient-to-b from-[#C4A96A] to-[#8B7340]" />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-[#192026]/30 mt-2">Protective vial</span>
                      </div>
                    </div>

                    {/* Back of package */}
                    <div className="relative flex-shrink-0">
                      <div className="w-[180px] h-[240px] rounded-2xl bg-gradient-to-b from-[#6B3FA0] to-[#4A2D6E] shadow-lg flex flex-col items-center justify-between p-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-5 bg-[#8B5FC0]/40 flex items-center justify-end px-2">
                          <span className="text-[5px] text-white/60 uppercase tracking-wider">Resealable +</span>
                        </div>
                        <div className="text-[4px] text-white/40 mt-5 leading-relaxed text-center px-2">
                          Royal King Seeds sells seeds for souvenir and collectible purposes. Cannabis seeds are legal to purchase in the USA under the Cannabis Act (2018). Customers are responsible for understanding local laws.
                        </div>
                        <div className="bg-white rounded-lg p-2 w-[140px]">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-[14px] h-[14px] rounded-full bg-[#275C53] flex items-center justify-center">
                              <span className="text-white text-[6px] font-bold">1</span>
                            </div>
                            <span className="text-[6px] font-bold text-[#192026] uppercase tracking-wider truncate">{product.name}</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <div className="w-[36px] h-[36px] bg-[#F5F0EA] rounded border border-[#192026]/10 flex items-center justify-center">
                              <div className="grid grid-cols-4 gap-[1px]">
                                {[...Array(16)].map((_, i) => (
                                  <div key={i} className="w-[4px] h-[4px] bg-[#192026]/30" />
                                ))}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex gap-[1px]">
                                {[...Array(30)].map((_, i) => (
                                  <div key={i} className="w-[2px] h-[18px] bg-[#192026]" style={{ height: `${8 + Math.random() * 12}px` }} />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[6px] text-white/50">royalkingseeds.us</span>
                          <div className="flex gap-1">
                            {['IG', 'FB', 'X'].map(s => (
                              <div key={s} className="w-[10px] h-[10px] rounded-full bg-white/20 flex items-center justify-center">
                                <span className="text-[4px] text-white font-bold">{s}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Callout lines - right side */}
                      <div className="hidden lg:block absolute top-[55px] -right-[160px]">
                        <span className="text-[12px] text-[#192026]/70 font-medium">Protective sticker</span>
                        <div className="absolute top-[8px] left-[-28px] w-[24px] h-[1px] bg-[#192026]/20" />
                        <div className="absolute top-[6px] left-[-32px] w-[8px] h-[8px] rounded-full bg-[#275C53]" />
                      </div>
                      <div className="hidden lg:block absolute top-[130px] -right-[160px]">
                        <span className="text-[12px] text-[#192026]/70 font-medium">QR code</span>
                        <div className="absolute top-[8px] left-[-28px] w-[24px] h-[1px] bg-[#192026]/20" />
                        <div className="absolute top-[6px] left-[-32px] w-[8px] h-[8px] rounded-full bg-[#275C53]" />
                      </div>
                      <div className="hidden lg:block absolute top-[160px] -right-[160px]">
                        <span className="text-[12px] text-[#192026]/70 font-medium">Scratchable serial<br />number</span>
                        <div className="absolute top-[12px] left-[-28px] w-[24px] h-[1px] bg-[#192026]/20" />
                        <div className="absolute top-[10px] left-[-32px] w-[8px] h-[8px] rounded-full bg-[#275C53]" />
                      </div>
                    </div>
                  </div>

                  {/* Mobile callouts */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 lg:hidden">
                    {[
                      { icon: '🔒', label: 'Sealed for authenticity' },
                      { icon: '💧', label: 'Waterproof coating' },
                      { icon: '🛡️', label: 'Aluminium interior lining' },
                      { icon: '🏷️', label: 'Protective sticker' },
                      { icon: '📱', label: 'QR code verification' },
                      { icon: '🔢', label: 'Scratchable serial number' },
                    ].map(item => (
                      <div key={item.label} className="bg-white rounded-xl p-3 text-center">
                        <span className="text-lg block mb-1">{item.icon}</span>
                        <span className="text-[10px] text-[#192026]/60 font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terpenes Tab */}
          {activeTab === 'Terpenes' && (
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-[#275C53]/10 flex items-center justify-center text-xl">🧪</div>
                <div>
                  <h2 className="text-xl font-bold text-[#275C53]" style={{ fontFamily: 'var(--font-patua)' }}>Terpene Profile</h2>
                  <p className="text-[13px] text-[#192026]/40 mt-1">The aromatic compounds that define {product.name}&apos;s unique flavor, scent, and effects.</p>
                </div>
              </div>

              {terpenes.length > 0 ? (
                <div className="space-y-4">
                  {terpenes.map((t, i) => (
                    <div key={t.name} className="bg-[#F5F0EA] rounded-2xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                          <div>
                            <h3 className="text-[15px] font-bold text-[#192026]">{t.name}</h3>
                            <p className="text-[12px] text-[#192026]/40 mt-0.5">{t.aroma}</p>
                          </div>
                        </div>
                        <span className="text-[12px] font-bold text-[#192026]/30">#{i + 1}</span>
                      </div>
                      <div className="mb-3">
                        <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${t.percentage}%`, backgroundColor: t.color }} />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-[#192026]/30">Low</span>
                          <span className="text-[11px] font-semibold" style={{ color: t.color }}>{t.percentage}% relative presence</span>
                          <span className="text-[10px] text-[#192026]/30">High</span>
                        </div>
                      </div>
                      <p className="text-[13px] text-[#192026]/60">{t.effect}</p>
                    </div>
                  ))}

                  {/* Aroma Wheel Summary */}
                  <div className="bg-[#275C53] rounded-2xl p-6 text-white mt-6">
                    <h3 className="text-sm font-bold uppercase tracking-[1px] mb-3">Aroma Summary</h3>
                    <div className="flex flex-wrap gap-2">
                      {terpenes.map(t => (
                        <span key={t.name} className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/10 border border-white/10">
                          {t.aroma.split(',')[0]}
                        </span>
                      ))}
                    </div>
                    <p className="text-white/50 text-[12px] mt-3">Terpenes work together through the &quot;entourage effect&quot; — enhancing and modulating the overall cannabis experience beyond THC alone.</p>
                  </div>
                </div>
              ) : (
                <p className="text-[14px] text-[#192026]/40">Terpene profile data for this product is being analyzed.</p>
              )}
            </div>
          )}

          {/* Grow Guide Tab */}
          {activeTab === 'Grow Guide' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>Growing {product.name}</h2>
              <p className="text-[14px] text-[#192026]/50 mb-6">
                Everything you need to know about cultivating {product.name} in the USA.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <GrowStat icon="⏱" label="Flowering Time" value={product.autoflower ? '8-10 weeks (seed to harvest)' : '8-10 weeks'} />
                <GrowStat icon="📏" label="Plant Height" value={product.autoflower ? '60-100cm' : '90-150cm'} />
                <GrowStat icon="🏠" label="Indoor Yield" value="400-500g/m²" />
                <GrowStat icon="🌳" label="Outdoor Yield" value="450-600g/plant" />
                <GrowStat icon="🎯" label="Difficulty" value={product.autoflower ? 'Beginner Friendly' : 'Intermediate'} />
                <GrowStat icon="🌡" label="Ideal Temp" value="20-26°C" />
                <GrowStat icon="💧" label="Humidity" value="40-60% RH" />
                <GrowStat icon="💡" label="Light Cycle" value={product.autoflower ? '18-20hrs (any stage)' : '18/6 veg → 12/12 flower'} />
                <GrowStat icon="🌍" label="Climate" value="Temperate, Mediterranean" />
              </div>

              <div className="bg-[#F5F0EA] rounded-2xl p-6 mt-6">
                <h3 className="text-sm font-bold text-[#275C53] uppercase tracking-[1px] mb-3">Growing Tips for Canadian Growers</h3>
                <ul className="space-y-3 text-[14px] text-[#192026]/60">
                  <li className="flex gap-2"><span className="text-[#D7B65D] shrink-0">1.</span> Start seeds indoors using the paper towel method at 22-26°C for best germination rates.</li>
                  <li className="flex gap-2"><span className="text-[#D7B65D] shrink-0">2.</span> {product.autoflower ? 'Plant directly in final container to avoid transplant stress.' : 'Transplant seedlings after 2-3 weeks once root system is established.'}</li>
                  <li className="flex gap-2"><span className="text-[#D7B65D] shrink-0">3.</span> Maintain good airflow to prevent mold, especially in humid Canadian summers.</li>
                  <li className="flex gap-2"><span className="text-[#D7B65D] shrink-0">4.</span> {product.autoflower ? 'No need to change light cycles — autoflowers flower based on age, not light.' : 'Switch to 12/12 light cycle when plants reach desired height to trigger flowering.'}</li>
                  <li className="flex gap-2"><span className="text-[#D7B65D] shrink-0">5.</span> Harvest when trichomes are mostly cloudy with some amber for optimal potency and effect.</li>
                </ul>
              </div>

              <div className="bg-[#275C53] rounded-2xl p-6 text-white">
                <h3 className="text-sm font-bold uppercase tracking-[1px] mb-2">Suitable Canadian Provinces</h3>
                <p className="text-white/60 text-[13px] mb-3">
                  {product.name} grows well across the United States with proper environmental control.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL'].map(p => (
                    <span key={p} className="px-3 py-1 bg-white/10 rounded-full text-[12px] font-medium">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Grow Journal Tab */}
          {activeTab === 'Grow Journal' && (
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-[#275C53]/10 flex items-center justify-center text-xl">📓</div>
                <div>
                  <h2 className="text-xl font-bold text-[#275C53]" style={{ fontFamily: 'var(--font-patua)' }}>{product.name} Week-by-Week Grow Timeline</h2>
                  <p className="text-[13px] text-[#192026]/40 mt-1">Follow the complete growing journey from seed to harvest with strain-specific milestones and expert tips.</p>
                </div>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[23px] top-0 bottom-0 w-px bg-[#275C53]/10" />

                <div className="space-y-0">
                  {journal.map((w, i) => (
                    <div key={i} className="relative flex gap-5 group">
                      {/* Timeline dot */}
                      <div className="shrink-0 w-[47px] flex flex-col items-center pt-6">
                        <div className={`w-4 h-4 rounded-full border-2 z-10 transition-all group-hover:scale-125 ${
                          w.stage === 'Harvest' ? 'bg-[#D7B65D] border-[#D7B65D]' :
                          w.stage === 'Germination' ? 'bg-[#275C53] border-[#275C53]' :
                          'bg-white border-[#275C53]/30 group-hover:border-[#275C53]'
                        }`} />
                        <span className="text-[10px] text-[#192026]/30 font-bold mt-1">
                          {w.week > 0 ? `W${w.week}` : ''}
                        </span>
                      </div>

                      {/* Content card */}
                      <div className="flex-1 bg-[#F5F0EA] rounded-2xl p-5 mb-3 hover:bg-white hover:shadow-md transition-all group-hover:border-[#275C53]/10 border border-transparent">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] uppercase tracking-[1px] font-bold px-2 py-0.5 rounded-full ${
                            w.stage === 'Germination' ? 'bg-[#275C53] text-white' :
                            w.stage === 'Seedling' ? 'bg-emerald-100 text-emerald-700' :
                            w.stage === 'Vegetative' || w.stage === 'Early Veg' || w.stage === 'Late Veg' ? 'bg-green-100 text-green-700' :
                            w.stage === 'Pre-Flower' || w.stage === 'Flip' ? 'bg-amber-100 text-amber-700' :
                            w.stage === 'Harvest' ? 'bg-[#D7B65D] text-[#275C53]' :
                            'bg-purple-100 text-purple-700'
                          }`}>{w.stage}</span>
                          {w.week > 0 && <span className="text-[11px] text-[#192026]/30">Week {w.week}</span>}
                        </div>
                        <h3 className="text-[15px] font-bold text-[#192026] mb-1">{w.title}</h3>
                        <p className="text-[13px] text-[#192026]/55 leading-relaxed mb-3">{w.description}</p>
                        <div className="flex items-start gap-2 bg-white rounded-xl p-3">
                          <span className="text-sm shrink-0">💡</span>
                          <p className="text-[12px] text-[#275C53] leading-relaxed"><strong>Tip:</strong> {w.tips}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Lineage Tab */}
          {activeTab === 'Lineage' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>Genetic Lineage</h2>

              {lineage ? (
                <>
                  {/* Visual Lineage Tree */}
                  <div className="bg-[#F5F0EA] rounded-2xl p-6">
                    <div className="flex flex-col items-center">
                      {/* Parents */}
                      <div className="flex gap-4 flex-wrap justify-center mb-4">
                        {lineage.parents.map((parent) => (
                          <div key={parent} className="bg-white rounded-xl px-5 py-3 text-center border border-[#275C53]/10">
                            <span className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 block">Parent</span>
                            <span className="text-[15px] font-semibold text-[#275C53]">{parent}</span>
                          </div>
                        ))}
                      </div>
                      {/* Arrow down */}
                      <div className="w-px h-8 bg-[#275C53]/20" />
                      <div className="text-[#275C53]/30 text-lg">▼</div>
                      <div className="w-px h-4 bg-[#275C53]/20" />
                      {/* Child */}
                      <div className="bg-[#275C53] rounded-xl px-6 py-4 text-center text-white">
                        <span className="text-[10px] uppercase tracking-[1px] text-white/50 block">Result</span>
                        <span className="text-lg font-bold">{product.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InfoCard label="Breeder" value={lineage.breeder} />
                    <InfoCard label="Origin" value={lineage.origin} />
                    <InfoCard label="Generation" value={lineage.generation} />
                    <InfoCard label="Cross Type" value={lineage.crossType} />
                  </div>

                  {/* History */}
                  <div className="bg-white rounded-2xl border border-[#275C53]/5 p-6">
                    <h3 className="text-sm font-bold text-[#275C53] uppercase tracking-[1px] mb-3">Breeding History</h3>
                    <p className="text-[14px] text-[#192026]/60 leading-relaxed">{lineage.history}</p>
                  </div>
                </>
              ) : (
                <p className="text-[14px] text-[#192026]/40">Lineage information for this product is being researched and will be added soon.</p>
              )}
            </div>
          )}

          {/* Compare Tab */}
          {activeTab === 'Compare' && (
            <CompareTab product={product} relatedProducts={relatedProducts} />
          )}

          {/* Shipping & Guarantee Tab */}
          {activeTab === 'Shipping' && (
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-[#275C53]/10 flex items-center justify-center text-xl">📦</div>
                <div>
                  <h2 className="text-xl font-bold text-[#275C53]" style={{ fontFamily: 'var(--font-patua)' }}>Shipping & Guarantee</h2>
                  <p className="text-[13px] text-[#192026]/40 mt-1">Everything you need to know about ordering {product.name} with confidence.</p>
                </div>
              </div>

              {/* Trust Grid */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#F5F0EA] rounded-2xl p-5 text-center">
                  <span className="text-3xl block mb-2">🇺🇸</span>
                  <h3 className="text-[14px] font-bold text-[#275C53] mb-1">Free US Shipping</h3>
                  <p className="text-[12px] text-[#192026]/40">Free shipping on all orders over $99 USD. Standard shipping $9.99, Express $19.99.</p>
                </div>
                <div className="bg-[#F5F0EA] rounded-2xl p-5 text-center">
                  <span className="text-3xl block mb-2">🌱</span>
                  <h3 className="text-[14px] font-bold text-[#275C53] mb-1">Germination Guarantee</h3>
                  <p className="text-[12px] text-[#192026]/40">If your seeds don&apos;t germinate following our guide, we&apos;ll replace them. That&apos;s our promise to American growers.</p>
                </div>
                <div className="bg-[#F5F0EA] rounded-2xl p-5 text-center">
                  <span className="text-3xl block mb-2">🔒</span>
                  <h3 className="text-[14px] font-bold text-[#275C53] mb-1">Discreet Packaging</h3>
                  <p className="text-[12px] text-[#192026]/40">Plain, unmarked packaging with no cannabis branding. Crush-resistant containers protect your seeds in transit.</p>
                </div>
              </div>

              {/* Delivery by Province */}
              <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5 mb-6">
                <h3 className="text-sm font-bold text-[#275C53] uppercase tracking-[1px] mb-4">Estimated Delivery by Province</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { prov: 'California', days: '2-4 business days' },
                    { prov: 'Colorado', days: '2-4 business days' },
                    { prov: 'Texas', days: '3-5 business days' },
                    { prov: 'Michigan', days: '3-5 business days' },
                    { prov: 'New York', days: '3-5 business days' },
                    { prov: 'Florida', days: '4-6 business days' },
                    { prov: 'Oregon', days: '5-7 business days' },
                    { prov: 'Washington', days: '5-7 business days' },
                    { prov: 'Nevada', days: '5-7 business days' },
                    { prov: 'Alaska', days: '6-8 business days' },
                    { prov: 'Hawaii', days: '7-10 business days' },
                    { prov: 'Puerto Rico', days: '7-10 business days' },
                  ].map(({ prov, days }) => (
                    <div key={prov} className="flex justify-between items-center px-3 py-2 bg-[#F5F0EA] rounded-lg">
                      <span className="text-[12px] font-medium text-[#192026]">{prov}</span>
                      <span className="text-[11px] text-[#275C53] font-semibold">{days}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Policies */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5">
                  <h3 className="text-sm font-bold text-[#275C53] uppercase tracking-[1px] mb-3">Payment Methods</h3>
                  <div className="space-y-2">
                    {['Visa / Mastercard', 'Cryptocurrency (BTC, ETH)', 'Cryptocurrency (BTC, ETH)', 'Mail-in Payment'].map(m => (
                      <div key={m} className="flex items-center gap-2 text-[13px] text-[#192026]/60">
                        <span className="text-[#275C53]">✓</span> {m}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#192026]/30 mt-3">All transactions are processed through encrypted, PCI-compliant systems.</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5">
                  <h3 className="text-sm font-bold text-[#275C53] uppercase tracking-[1px] mb-3">Our Guarantees</h3>
                  <div className="space-y-2">
                    {[
                      'Germination guarantee on all seeds',
                      'Delivery guarantee — lost orders reshipped free',
                      '7-day return window (unopened products)',
                      'Tracking number on every order',
                      '24/7 customer support',
                    ].map(g => (
                      <div key={g} className="flex items-center gap-2 text-[13px] text-[#192026]/60">
                        <span className="text-[#D7B65D]">★</span> {g}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#275C53] rounded-2xl p-6 mt-6 text-center text-white">
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-patua)' }}>Order {product.name} with Confidence</h3>
                <p className="text-white/50 text-[13px] mb-3">Discreet packaging, tracked shipping, and germination guarantee on every order across the United States.</p>
                <p className="text-[13px] text-white/40">Questions? Contact us at <strong className="text-[#D7B65D]">support@royalkingseeds.us</strong> or call <strong className="text-[#D7B65D]">+support@royalkingseeds.us</strong></p>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'FAQ' && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 mb-2">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-[#275C53]/10 flex items-center justify-center text-xl">❓</div>
                <div>
                  <h2 className="text-xl font-bold text-[#275C53]" style={{ fontFamily: 'var(--font-patua)' }}>Frequently Asked Questions</h2>
                  <p className="text-[13px] text-[#192026]/40 mt-1">
                    Everything American growers ask about {product.name} — from growing tips to effects, yield expectations, and more.
                  </p>
                </div>
              </div>

              {faqs.length > 0 ? (
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <details key={i} className="group bg-[#F5F0EA] rounded-xl overflow-hidden">
                      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none">
                        <span className="text-[14px] font-semibold text-[#192026] pr-4 leading-snug">{faq.q}</span>
                        <span className="text-[#D7B65D] text-lg shrink-0 transition-transform duration-200 group-open:rotate-45">+</span>
                      </summary>
                      <div className="px-5 pb-4 -mt-1">
                        <p className="text-[13px] text-[#192026]/60 leading-relaxed">{faq.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-[#192026]/40">FAQ for this product is coming soon.</p>
              )}

              <div className="bg-[#275C53] rounded-2xl p-5 mt-4 flex items-center gap-4">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="text-white text-[14px] font-semibold">Still have questions?</p>
                  <p className="text-white/50 text-[12px]">Contact our team at support@royalkingseeds.us — we are happy to help American growers succeed.</p>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'Reviews' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>Customer Reviews</h2>
              <div className="bg-[#F5F0EA] rounded-2xl p-8 text-center">
                <p className="text-[#192026]/40 text-sm mb-4">Be the first to review {product.name}</p>
                <p className="text-[#192026]/30 text-[12px] mb-4">Reviews from verified American buyers will appear here.</p>
                <button className="btn-main !text-[12px] !px-6 !py-2.5 cursor-pointer">Write a Review</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-[#275C53]/10">
          <h2 className="text-2xl font-normal text-[#275C53] mb-8">Related Strains</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function GrowStat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-[#F5F0EA] rounded-xl p-4 flex items-start gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <span className="text-[10px] uppercase tracking-[1px] text-[#192026]/40 block">{label}</span>
        <span className="text-[14px] font-medium text-[#192026]">{value}</span>
      </div>
    </div>
  );
}

// Effect emoji/color/percentage mapping based on strain type
const effectsDatabase: Record<string, { emoji: string; color: string }> = {
  'relaxed': { emoji: '😌', color: '#4a7c59' },
  'happy': { emoji: '😊', color: '#5a9e3e' },
  'creative': { emoji: '🤩', color: '#6aaa3a' },
  'sleepy': { emoji: '😴', color: '#5a7a4a' },
  'hungry': { emoji: '🤤', color: '#8a9a2a' },
  'giggly': { emoji: '😆', color: '#7a8a2a' },
  'energetic': { emoji: '🤑', color: '#9a8a2a' },
  'uplifted': { emoji: '😎', color: '#c06040' },
  'talkative': { emoji: '🗣️', color: '#8a8a3a' },
  'euphoric': { emoji: '🤗', color: '#5aaa4a' },
  'focused': { emoji: '🧠', color: '#4a8a6a' },
  'aroused': { emoji: '😍', color: '#c06080' },
  'tingling': { emoji: '✨', color: '#6a6aaa' },
  'calm': { emoji: '🧘', color: '#4a7c7c' },
  'pain relief': { emoji: '💊', color: '#5a6a8a' },
  'stress relief': { emoji: '🌿', color: '#4a8a5a' },
  'body high': { emoji: '💆', color: '#5a7a5a' },
  'cerebral': { emoji: '💭', color: '#6a7aaa' },
  'sedated': { emoji: '😶‍🌫️', color: '#5a6a5a' },
  'motivated': { emoji: '💪', color: '#7a9a3a' },
};

function getEffectData(effect: string): { emoji: string; color: string } {
  const key = effect.toLowerCase().trim();
  return effectsDatabase[key] || { emoji: '🌟', color: '#275C53' };
}

function getEffectPercentage(effect: string, index: number, totalEffects: number, strainType: string): number {
  // Generate deterministic percentages that decrease with position
  // Primary effects get higher scores, trailing effects get lower
  const hash = effect.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const baseScore = Math.max(10, 75 - (index * (55 / Math.max(totalEffects - 1, 1))));
  const jitter = (hash % 15) - 7;
  return Math.min(95, Math.max(5, Math.round(baseScore + jitter)));
}

const SEGMENTS = 10;

function EffectsGrid({ effects, strainType }: { effects: string[]; strainType: string }) {
  // Expand effects to always show a decent grid — use defaults for common strains
  const defaultEffects: Record<string, string[]> = {
    indica: ['Relaxed', 'Sleepy', 'Happy', 'Hungry', 'Euphoric', 'Calm', 'Stress Relief', 'Body High', 'Sedated'],
    sativa: ['Happy', 'Energetic', 'Creative', 'Uplifted', 'Euphoric', 'Focused', 'Talkative', 'Motivated', 'Giggly'],
    hybrid: ['Relaxed', 'Happy', 'Creative', 'Euphoric', 'Uplifted', 'Hungry', 'Sleepy', 'Giggly', 'Focused'],
    cbd: ['Relaxed', 'Calm', 'Focused', 'Stress Relief', 'Pain Relief', 'Happy', 'Sleepy', 'Body High', 'Tingling'],
  };

  // Use product effects first, pad with defaults if less than 9
  const allEffects = [...effects];
  const defaults = defaultEffects[strainType] || defaultEffects.hybrid;
  for (const d of defaults) {
    if (allEffects.length >= 9) break;
    if (!allEffects.some(e => e.toLowerCase() === d.toLowerCase())) {
      allEffects.push(d);
    }
  }
  const displayEffects = allEffects.slice(0, 9);

  return (
    <div className="bg-[#F5F0EA] rounded-2xl p-6">
      <h3 className="text-xl font-bold text-[#275C53] mb-6" style={{ fontFamily: 'var(--font-patua)' }}>Effects</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
        {displayEffects.map((effect, i) => {
          const { emoji, color } = getEffectData(effect);
          const pct = getEffectPercentage(effect, i, displayEffects.length, strainType);
          const filledSegments = Math.round((pct / 100) * SEGMENTS);

          return (
            <div key={effect}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">{emoji}</span>
                <span className="text-[14px] font-semibold text-[#192026]">{effect}</span>
              </div>
              <div className="flex gap-[3px] mb-1">
                {Array.from({ length: SEGMENTS }).map((_, si) => (
                  <div
                    key={si}
                    className={`h-[10px] flex-1 ${si === 0 ? 'rounded-l-full' : ''} ${si === SEGMENTS - 1 ? 'rounded-r-full' : ''}`}
                    style={{
                      backgroundColor: si < filledSegments ? color : '#e0ddd7',
                    }}
                  />
                ))}
              </div>
              <span className="text-[11px] text-[#192026]/40">{pct}% of people reported feeling {effect}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DescriptionRenderer({ description, productName }: { description: string; productName: string }) {
  // Strip all ## headings from the raw text, then split into sections
  const sections = description
    .split(/^##\s+.*/m)
    .map(s => s.trim())
    .filter(Boolean);

  // Extract heading titles
  const headingMatches = [...description.matchAll(/^##\s+(.+)/gm)];
  const headings = headingMatches.map(m => m[1].trim());

  if (sections.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>About {productName}</h2>
        <div className="text-[#192026]/60 leading-relaxed text-[15px] whitespace-pre-line">{description.replace(/^##\s+.*/gm, '').trim()}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sections.map((body, i) => {
        const heading = i === 0 ? `About ${productName}` : (headings[i] || headings[i - 1] || '');
        return (
          <div key={i}>
            {heading && <h2 className="text-xl font-bold text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>{heading}</h2>}
            <div className="text-[#192026]/60 leading-relaxed text-[15px] whitespace-pre-line">{body}</div>
          </div>
        );
      })}
    </div>
  );
}

function SpecRow({ icon, label, value, last }: { icon: string; label: string; value: string; last?: boolean }) {
  if (value === 'N/A') return null;
  return (
    <div className={`flex items-center px-4 py-3 ${last ? '' : 'border-b border-[#275C53]/5'} hover:bg-[#F5F0EA]/50 transition-colors`}>
      <span className="text-base w-8 shrink-0">{icon}</span>
      <span className="text-[13px] font-bold text-[#192026] w-[130px] shrink-0">{label}</span>
      <span className="text-[13px] text-[#192026]/60">{value}</span>
    </div>
  );
}

function CompareTab({ product, relatedProducts }: {
  product: Product; relatedProducts: Product[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const compareProducts = [product, ...relatedProducts].slice(0, 4);

  const rows: { label: string; key: string }[] = [
    { label: 'THC', key: 'thc' },
    { label: 'Type', key: 'type' },
    { label: 'Flowering', key: 'floweringTime' },
    { label: 'Height', key: 'height' },
    { label: 'Indoor Yield', key: 'yieldIndoor' },
    { label: 'Outdoor Yield', key: 'yieldOutdoor' },
    { label: 'Climate', key: 'climate' },
    { label: 'Genetics', key: 'lineageShort' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-[#275C53] mb-1" style={{ fontFamily: 'var(--font-patua)' }}>Compare with Similar Strains</h2>
      <p className="text-[13px] text-[#192026]/40 mb-6">See how {product.name} stacks up against other popular strains.</p>

      {/* Full column-based layout — scrollable on mobile */}
      <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
      <div className="grid grid-cols-[70px_140px_140px_140px_140px] sm:grid-cols-[90px_1fr_1fr_1fr_1fr] gap-0 min-w-[630px] sm:min-w-0">
        {/* Header row: label + product cards */}
        <div />
        {compareProducts.map((p, i) => {
          const isActive = i === 0;
          const isHovered = hovered === i;
          return (
            <div
              key={p.id}
              className="px-2"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={`rounded-2xl p-3 text-center transition-all duration-300 ${
                isHovered && !isActive
                  ? 'bg-white shadow-xl ring-2 ring-[#D7B65D] -translate-y-2 scale-105 z-10 relative'
                  : isActive
                    ? 'bg-[#275C53]/5 ring-2 ring-[#275C53]'
                    : 'bg-[#F5F0EA]'
              }`}>
                <div className="w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center bg-white mb-2">
                  {p.imageUrl && !p.imageUrl.startsWith('/images/seeds/') ? (
                    <img src={p.imageUrl} alt={p.name} className={`w-full h-full object-contain p-2 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                  ) : (
                    <span className={`text-3xl transition-opacity duration-300 ${isHovered ? 'opacity-50' : 'opacity-20'}`}>🌱</span>
                  )}
                </div>
                <p className={`text-[12px] font-bold leading-tight ${isActive ? 'text-[#275C53]' : isHovered ? 'text-[#275C53]' : 'text-[#192026]'}`}>{p.name}</p>
                {isActive && <p className="text-[9px] uppercase tracking-[2px] text-[#D7B65D] font-bold mt-0.5">Current</p>}
                <p className="text-[13px] font-bold text-[#275C53] mt-0.5">${p.price.toFixed(2)}</p>
              </div>
            </div>
          );
        })}

        {/* Data rows */}
        {rows.map((row, ri) => (
          <React.Fragment key={row.key}>
            <div className={`px-2 py-2.5 text-[10px] font-bold text-[#192026]/40 uppercase tracking-[1px] flex items-center ${ri % 2 === 0 ? 'bg-[#F5F0EA]/50' : ''} ${ri === 0 ? 'mt-4 rounded-tl-xl' : ''} ${ri === rows.length - 1 ? 'rounded-bl-xl' : ''}`}>
              {row.label}
            </div>
            {compareProducts.map((p, pi) => {
              const s = strainSpecs[p.slug] || generateStrainSpecs(p);
              const val = s ? (s as any)[row.key] || '—' : '—';
              const isCol = hovered === pi;
              return (
                <div
                  key={`${row.key}-${p.id}`}
                  className={`px-2 py-2.5 text-center text-[11px] flex items-center justify-center transition-colors duration-200 ${
                    ri % 2 === 0 ? 'bg-[#F5F0EA]/50' : ''
                  } ${ri === 0 ? 'mt-4' : ''} ${
                    isCol ? '!bg-[#D7B65D]/10' : ''
                  } ${pi === 0 ? 'text-[#275C53] font-semibold' : 'text-[#192026]/45'} ${
                    ri === 0 && pi === compareProducts.length - 1 ? 'rounded-tr-xl' : ''
                  } ${ri === rows.length - 1 && pi === compareProducts.length - 1 ? 'rounded-br-xl' : ''}`}
                  onMouseEnter={() => setHovered(pi)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {val}
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {/* Button row */}
        <div className="mt-3" />
        {compareProducts.map((p, i) => (
          <div key={`btn-${p.id}`} className="px-2 mt-3" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <a
              href={`/${p.slug}`}
              className={`block w-full py-2.5 rounded-xl text-[10px] uppercase tracking-[1px] font-bold text-center transition-all duration-200 ${
                i === 0
                  ? 'bg-[#275C53]/10 text-[#275C53]'
                  : hovered === i
                    ? 'bg-[#D7B65D] text-[#275C53] shadow-lg scale-105'
                    : 'bg-[#275C53] text-white hover:bg-[#1e4a42]'
              }`}
            >
              {i === 0 ? 'Viewing' : 'View Strain'}
            </a>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#F5F0EA] rounded-xl p-4">
      <span className="text-[10px] uppercase tracking-[1px] text-[#192026]/40 block mb-1">{label}</span>
      <span className="text-[14px] font-medium text-[#192026]">{value}</span>
    </div>
  );
}
