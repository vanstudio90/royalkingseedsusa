#!/usr/bin/env node
/**
 * Static Page Rewriter — generates unique 1500-2500 word content for each page
 * Categories: is-marijuana-legal, top-10-cannabis-seeds, how-to-get-medical-card, etc.
 * RULE: "If this paragraph could exist in another article unchanged, do not include it."
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars'); process.exit(1); }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Helpers ──
function titleCase(s) { return s.replace(/\b\w/g, c => c.toUpperCase()); }
function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i); return Math.abs(h); }
function pick(slug, arr, salt = '') { return arr[hash(slug + salt) % arr.length]; }
function pickN(slug, arr, n, salt = '') {
  const c = [...arr]; const h = hash(slug + salt);
  for (let i = c.length - 1; i > 0; i--) { const j = Math.abs((h * (i + 1)) % (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
  return c.slice(0, n);
}
function a(text, href) { return `<a href="${href}">${text}</a>`; }

// Category links
const CL = {
  fem: a('feminized seeds', '/product-category/feminized-seeds'),
  auto: a('autoflower seeds', '/product-category/autoflowering-seeds'),
  ind: a('indica strains', '/product-category/indica-seeds'),
  sat: a('sativa genetics', '/product-category/sativa-seeds'),
  hyb: a('hybrid seeds', '/product-category/hybrid'),
  cbd: a('CBD seeds', '/product-category/cbd-strains'),
  thc: a('high-THC seeds', '/product-category/high-tch-seeds'),
  kush: a('kush varieties', '/product-category/kush-seeds'),
  outdoor: a('outdoor strains', '/product-category/best-strains-for-outdoor-growing'),
  all: a('full seed catalog', '/product-category/shop-all-cannabis-seeds'),
  best: a('best sellers', '/product-category/best-seller'),
};

// ── State Data ──
const stateData = {
  'alabama': { abbr: 'AL', rec: false, med: true, medYear: 2021, possess: '0 (medical only)', plants: 0, medNote: 'SB 46 (Darren Wesley "Ato" Hall Compassion Act) allows medical cannabis for qualifying conditions. The Alabama Medical Cannabis Commission oversees the program.', penalties: 'Any amount for personal use (non-medical) is a misdemeanor for first offense, up to 1 year jail and $6,000 fine. Second offense is a felony.', climate: 'hot, humid subtropical', zone: '7b-9a', season: 'Apr-Oct', bestStrains: ['Blue Dream', 'Girl Scout Cookies', 'Northern Lights', 'White Widow', 'Gorilla Glue #4'] },
  'alaska': { abbr: 'AK', rec: true, med: true, recYear: 2014, medYear: 1998, possess: '1 oz', plants: 6, medNote: 'Measure 2 legalized recreational cannabis. Adults 21+ can possess up to 1 oz and grow up to 6 plants (3 mature). Commercial sales regulated by the Alcohol and Marijuana Control Office.', penalties: 'Exceeding possession or cultivation limits can result in misdemeanor or felony charges depending on quantity.', climate: 'subarctic to maritime', zone: '1a-7b', season: 'May-Sep (short)', bestStrains: ['Northern Lights', 'White Widow', 'Auto Blueberry', 'Amnesia Haze Auto', 'Critical Mass'] },
  'arizona': { abbr: 'AZ', rec: true, med: true, recYear: 2020, medYear: 2010, possess: '1 oz (5g concentrate)', plants: 6, medNote: 'Proposition 207 (Smart and Safe Arizona Act) legalized recreational use. Adults 21+ can possess 1 oz and grow 6 plants per person (12 per household). Medical patients can possess 2.5 oz per 14 days.', penalties: 'Exceeding limits: less than 2 lbs is a class 6 felony. Sale without license is a felony.', climate: 'arid desert to semi-arid', zone: '5a-10b', season: 'Feb-Nov (manage heat)', bestStrains: ['OG Kush', 'Sour Diesel', 'Girl Scout Cookies', 'Durban Poison', 'Super Lemon Haze'] },
  'arkansas': { abbr: 'AR', rec: false, med: true, medYear: 2016, possess: '2.5 oz (14 days, medical)', plants: 0, medNote: 'Issue 6 (Arkansas Medical Marijuana Amendment) allows medical cannabis. Home cultivation is not permitted. Dispensaries operate under the Medical Marijuana Commission.', penalties: 'Non-medical possession under 4 oz is a misdemeanor (up to 1 year, $2,500 fine). Over 4 oz can be a felony.', climate: 'humid subtropical', zone: '6b-8a', season: 'Apr-Oct', bestStrains: ['Blue Dream', 'ACDC', 'Charlotte\'s Web', 'Harlequin', 'Cannatonic'] },
  'california': { abbr: 'CA', rec: true, med: true, recYear: 2016, medYear: 1996, possess: '28.5g (8g concentrate)', plants: 6, medNote: 'Proposition 64 legalized recreational use. California was the first state to legalize medical marijuana (Prop 215, 1996). Adults 21+ can possess 28.5g and grow 6 plants. The Department of Cannabis Control regulates the commercial market.', penalties: 'Possession over the limit: infraction or misdemeanor. Unlicensed sales: misdemeanor or felony based on quantity.', climate: 'Mediterranean to desert', zone: '5a-11a', season: 'Mar-Nov', bestStrains: ['OG Kush', 'Girl Scout Cookies', 'Gelato', 'Blue Dream', 'Gorilla Glue #4'] },
  'colorado': { abbr: 'CO', rec: true, med: true, recYear: 2012, medYear: 2000, possess: '1 oz', plants: 6, medNote: 'Amendment 64 made Colorado one of the first states (alongside Washington) to legalize recreational cannabis. Adults 21+ can possess 1 oz and grow 6 plants (3 mature). The Marijuana Enforcement Division oversees the industry.', penalties: 'Possession 1-2 oz is a level 2 drug petty offense ($100 fine). Over 2 oz: misdemeanor. Over 12 oz: felony.', climate: 'semi-arid continental', zone: '3a-7a', season: 'May-Oct', bestStrains: ['Durban Poison', 'Blue Dream', 'Tangie', 'Jack Herer', 'Haze Berry'] },
  'connecticut': { abbr: 'CT', rec: true, med: true, recYear: 2021, medYear: 2012, possess: '1.5 oz', plants: 6, medNote: 'SB 1201 legalized recreational cannabis effective July 2021. Adults 21+ can possess 1.5 oz on person and 5 oz at home. Home cultivation allowed starting 2023. Medical program operated since 2012 under the Department of Consumer Protection.', penalties: 'Possession over 1.5 oz: infraction up to $150 for first offense. Over 5 oz: misdemeanor.', climate: 'humid continental', zone: '6a-7a', season: 'May-Oct', bestStrains: ['Northern Lights', 'White Widow', 'Blueberry', 'Amnesia Haze', 'Critical Mass'] },
  'delaware': { abbr: 'DE', rec: true, med: true, recYear: 2023, medYear: 2011, possess: '1 oz', plants: 0, medNote: 'HB 1 and HB 2 legalized recreational cannabis in 2023 (overriding governor veto). Adults 21+ can possess 1 oz. Home cultivation is NOT permitted. The Delaware Marijuana Commissioner oversees implementation.', penalties: 'Possession 1-6 oz without intent to sell: unclassified misdemeanor. Over 6 oz: class B misdemeanor.', climate: 'humid subtropical', zone: '7a-7b', season: 'Apr-Oct', bestStrains: ['Blue Dream', 'Girl Scout Cookies', 'ACDC', 'Harlequin', 'White Widow'] },
  'florida': { abbr: 'FL', rec: false, med: true, medYear: 2016, possess: '2.5 oz (35 days, medical)', plants: 0, medNote: 'Amendment 2 legalized medical cannabis for qualifying conditions. The Office of Medical Marijuana Use (OMMU) oversees the program. Only licensed Medical Marijuana Treatment Centers (MMTCs) can cultivate and sell. Home grow is not allowed.', penalties: 'Non-medical possession under 20g is a misdemeanor (up to 1 year, $1,000 fine). Over 20g is a third-degree felony (up to 5 years, $5,000 fine).', climate: 'tropical to subtropical', zone: '8b-11a', season: 'Year-round (manage humidity)', bestStrains: ['Gorilla Glue #4', 'Girl Scout Cookies', 'Sour Diesel', 'Northern Lights', 'Blue Dream'] },
  'georgia': { abbr: 'GA', rec: false, med: false, medYear: 2015, possess: '0', plants: 0, medNote: 'HB 1 (Haleigh\'s Hope Act, 2015) allows low-THC oil (up to 5% THC) for registered patients with qualifying conditions. This is NOT a full medical marijuana program — only low-THC oil possession is legal. No dispensaries or cultivation facilities operated until the Georgia Access to Medical Cannabis Commission began licensing in 2023.', penalties: 'Possession of 1 oz or less is a misdemeanor (up to 1 year, $1,000 fine). Over 1 oz is a felony (1-10 years).', climate: 'humid subtropical', zone: '7a-9a', season: 'Mar-Nov', bestStrains: ['Blue Dream', 'Northern Lights', 'ACDC', 'Charlotte\'s Web', 'Harlequin'] },
  'hawaii': { abbr: 'HI', rec: false, med: true, medYear: 2000, possess: '4 oz (medical)', plants: 10, medNote: 'Act 228 (2000) made Hawaii the first state to legislatively approve medical cannabis (rather than by ballot initiative). Medical patients can possess 4 oz and grow up to 10 plants. Licensed dispensaries have operated since 2017.', penalties: 'Non-medical possession under 3g is a violation ($130 fine). 3g-1 oz: petty misdemeanor. Over 1 oz: misdemeanor. Over 1 lb: class C felony.', climate: 'tropical', zone: '10a-12b', season: 'Year-round', bestStrains: ['Maui Wowie', 'Pineapple Express', 'Blue Dream', 'Kona Gold', 'Sour Diesel'] },
  'idaho': { abbr: 'ID', rec: false, med: false, medYear: null, possess: '0', plants: 0, medNote: 'Idaho has no medical or recreational marijuana program. All cannabis use, possession, and cultivation is illegal. The state constitution was amended in 2022 to prevent future legalization without a constitutional amendment.', penalties: 'Possession of any amount under 3 oz is a misdemeanor (up to 1 year, $1,000 fine). Over 3 oz is a felony (up to 5 years, $10,000 fine).', climate: 'semi-arid continental', zone: '3b-7b', season: 'May-Sep', bestStrains: ['Northern Lights', 'White Widow', 'Auto Blueberry', 'Critical Mass', 'Early Girl'] },
  'illinois': { abbr: 'IL', rec: true, med: true, recYear: 2020, medYear: 2013, possess: '30g (residents)', plants: 5, medNote: 'Cannabis Regulation and Tax Act (2019, effective Jan 2020) made Illinois the first state to legalize recreational cannabis through the legislature. Adults 21+ can possess 30g (residents) or 15g (non-residents). Medical patients can grow 5 plants.', penalties: 'Recreational possession over 30g but under 100g: class A misdemeanor. Over 100g: class 4 felony.', climate: 'humid continental', zone: '5a-7a', season: 'May-Oct', bestStrains: ['Blue Dream', 'Girl Scout Cookies', 'Northern Lights', 'Gorilla Glue #4', 'White Widow'] },
  'indiana': { abbr: 'IN', rec: false, med: false, medYear: null, possess: '0', plants: 0, medNote: 'Indiana has not legalized medical or recreational marijuana. CBD oil with up to 0.3% THC is legal under the 2018 Farm Bill, but no state medical cannabis program exists.', penalties: 'Possession under 30g is a class B misdemeanor (up to 180 days, $1,000 fine). Over 30g is a class A misdemeanor (up to 1 year). Prior convictions escalate to felony.', climate: 'humid continental', zone: '5b-6b', season: 'May-Oct', bestStrains: ['Northern Lights', 'White Widow', 'Blue Dream', 'Auto Critical', 'Amnesia Haze'] },
  'iowa': { abbr: 'IA', rec: false, med: true, medYear: 2014, possess: '4.5g THC (90 days, medical)', plants: 0, medNote: 'SF 2360 (Medical Cannabidiol Act, 2014) created a limited medical program. Qualifying patients can possess products containing up to 4.5g of THC per 90-day period. Home grow is not allowed. Only licensed manufacturers and dispensaries can produce and sell.', penalties: 'First-offense possession (any amount) is a serious misdemeanor (up to 6 months, $1,000 fine). Second offense: aggravated misdemeanor. Third+: class D felony.', climate: 'humid continental', zone: '4b-5b', season: 'May-Sep', bestStrains: ['Northern Lights', 'Auto Blueberry', 'White Widow', 'Critical Mass', 'Early Girl'] },
  'kansas': { abbr: 'KS', rec: false, med: false, medYear: null, possess: '0', plants: 0, medNote: 'Kansas has not legalized medical or recreational marijuana. A 2021 bill (HB 2184) to legalize medical cannabis passed the House but stalled in the Senate. CBD with under 0.3% THC is legal.', penalties: 'First-offense possession is a class B nonperson misdemeanor (up to 6 months, $1,000 fine). Second offense: class A misdemeanor (up to 1 year). Third+: drug severity level 5 felony.', climate: 'humid continental to semi-arid', zone: '5b-7a', season: 'May-Oct', bestStrains: ['Northern Lights', 'White Widow', 'Blue Dream', 'Auto Critical', 'ACDC'] },
  'kentucky': { abbr: 'KY', rec: false, med: true, medYear: 2023, possess: '0 (program not yet active)', plants: 0, medNote: 'SB 47 was signed into law in 2023, creating a medical cannabis program effective January 1, 2025. Qualifying patients will be able to purchase cannabis from licensed dispensaries. Home cultivation is not permitted.', penalties: 'Possession under 8 oz is a class B misdemeanor (up to 45 days, $250 fine). Over 8 oz: class A misdemeanor. Over 5 lbs: class D felony.', climate: 'humid subtropical', zone: '6a-7a', season: 'Apr-Oct', bestStrains: ['Blue Dream', 'Northern Lights', 'ACDC', 'Harlequin', 'White Widow'] },
  'louisiana': { abbr: 'LA', rec: false, med: true, medYear: 2015, possess: 'Medical only (no flower until 2022)', plants: 0, medNote: 'SB 143 (2015) created the medical cannabis program. Smokable flower became legal in 2022. Only LSU and Southern University agricultural centers are licensed to grow. Nine licensed dispensaries operate statewide.', penalties: 'First-offense possession under 14g is a misdemeanor ($100-$300 fine, no jail possible). Over 14g: up to $5,000 and 5 years. Multiple offenses escalate significantly.', climate: 'humid subtropical', zone: '8a-9b', season: 'Mar-Nov', bestStrains: ['Gorilla Glue #4', 'Blue Dream', 'Girl Scout Cookies', 'Sour Diesel', 'Northern Lights'] },
  'maine': { abbr: 'ME', rec: true, med: true, recYear: 2016, medYear: 1999, possess: '2.5 oz', plants: 3, medNote: 'Question 1 legalized recreational cannabis in 2016. Adults 21+ can possess 2.5 oz and grow up to 3 mature plants. The Office of Cannabis Policy regulates the industry. Maine was an early adopter of medical cannabis (1999).', penalties: 'Possession over 2.5 oz but under 8 oz: civil violation ($350 fine). Over 8 oz: class E crime.', climate: 'humid continental', zone: '3b-6b', season: 'May-Oct', bestStrains: ['Northern Lights', 'White Widow', 'Blueberry', 'Purple Kush', 'Auto Blueberry'] },
  'maryland': { abbr: 'MD', rec: true, med: true, recYear: 2023, medYear: 2014, possess: '1.5 oz', plants: 2, medNote: 'Question 4 (2022 ballot) legalized recreational cannabis effective July 2023. Adults 21+ can possess 1.5 oz and grow 2 plants per person. The Maryland Cannabis Administration regulates both medical and adult-use markets.', penalties: 'Possession over 1.5 oz but under 2.5 oz: civil citation ($250 fine). Over 2.5 oz: misdemeanor.', climate: 'humid subtropical', zone: '6a-8a', season: 'Apr-Oct', bestStrains: ['Blue Dream', 'Girl Scout Cookies', 'Northern Lights', 'Sour Diesel', 'Gorilla Glue #4'] },
  'massachusetts': { abbr: 'MA', rec: true, med: true, recYear: 2016, medYear: 2012, possess: '1 oz (10 oz at home)', plants: 6, medNote: 'Question 4 legalized recreational cannabis. Adults 21+ can possess 1 oz in public, 10 oz at home, and grow 6 plants per person (12 per household). The Cannabis Control Commission oversees the industry.', penalties: 'Possession over 1 oz in public: civil offense ($100 fine). Over 10 oz at home: misdemeanor.', climate: 'humid continental', zone: '5b-7b', season: 'May-Oct', bestStrains: ['Blue Dream', 'Northern Lights', 'White Widow', 'Girl Scout Cookies', 'Sour Diesel'] },
  'michigan': { abbr: 'MI', rec: true, med: true, recYear: 2018, medYear: 2008, possess: '2.5 oz (10 oz at home)', plants: 12, medNote: 'Proposal 1 legalized recreational cannabis. Adults 21+ can possess 2.5 oz on person, 10 oz at home, and grow up to 12 plants. The Cannabis Regulatory Agency manages licensing and enforcement.', penalties: 'Possession over 2.5 oz: civil infraction ($500 fine for first offense). Over 5 oz: misdemeanor.', climate: 'humid continental', zone: '4a-6b', season: 'May-Oct', bestStrains: ['Blue Dream', 'Gorilla Glue #4', 'Girl Scout Cookies', 'Northern Lights', 'Sour Diesel'] },
  'minnesota': { abbr: 'MN', rec: true, med: true, recYear: 2023, medYear: 2014, possess: '2 oz', plants: 8, medNote: 'HF 100 legalized recreational cannabis effective August 2023. Adults 21+ can possess 2 oz in public and grow 8 plants (4 mature). The Office of Cannabis Management oversees the rollout of the commercial market.', penalties: 'Possession over 2 oz: gross misdemeanor for amounts under 6 oz. Over 6 oz: felony.', climate: 'humid continental (cold)', zone: '3a-4b', season: 'May-Sep', bestStrains: ['Northern Lights', 'Auto Blueberry', 'White Widow', 'Critical Mass', 'Early Girl'] },
  'mississippi': { abbr: 'MS', rec: false, med: true, medYear: 2022, possess: '3.5g/day (medical)', plants: 0, medNote: 'SB 2095 (Mississippi Medical Cannabis Act) was signed in 2022. Qualifying patients can purchase up to 3.5g per day from licensed dispensaries. Home cultivation is not allowed.', penalties: 'Non-medical possession under 30g: misdemeanor ($250 fine, possible counseling). 30g-250g: misdemeanor or felony. Over 250g: felony (2-8 years).', climate: 'humid subtropical', zone: '7b-9a', season: 'Mar-Nov', bestStrains: ['Blue Dream', 'Girl Scout Cookies', 'Northern Lights', 'Gorilla Glue #4', 'ACDC'] },
  'missouri': { abbr: 'MO', rec: true, med: true, recYear: 2022, medYear: 2018, possess: '3 oz', plants: 6, medNote: 'Amendment 3 (2022) legalized recreational cannabis. Adults 21+ can possess 3 oz and grow 6 flowering plants, 6 non-flowering plants, and 6 clones. The Division of Cannabis Regulation oversees the market.', penalties: 'Possession over 3 oz: class A misdemeanor (up to 1 year, $2,000 fine for first offense).', climate: 'humid continental to subtropical', zone: '5b-7a', season: 'Apr-Oct', bestStrains: ['Blue Dream', 'Girl Scout Cookies', 'Northern Lights', 'Sour Diesel', 'Gorilla Glue #4'] },
  'montana': { abbr: 'MT', rec: true, med: true, recYear: 2020, medYear: 2004, possess: '1 oz', plants: 4, medNote: 'I-190 legalized recreational cannabis. Adults 21+ can possess 1 oz and grow up to 4 mature plants (2 seedlings). Montana was an early medical cannabis state (2004 ballot initiative).', penalties: 'Possession over 1 oz but under 2 oz: misdemeanor ($200 fine). Over 2 oz: more serious penalties.', climate: 'continental', zone: '3a-5b', season: 'May-Sep', bestStrains: ['Northern Lights', 'White Widow', 'Auto Blueberry', 'Purple Kush', 'Critical Mass'] },
  'nebraska': { abbr: 'NE', rec: false, med: false, medYear: null, possess: '0', plants: 0, medNote: 'Nebraska has not legalized medical or recreational marijuana. A 2020 medical cannabis ballot measure was struck down by the Nebraska Supreme Court on technical grounds. Efforts continue as of 2026.', penalties: 'First-offense possession (1 oz or less) is an infraction ($300 fine). Second offense: $500 fine. Third+: misdemeanor (up to 7 days, $500 fine). Over 1 oz: misdemeanor or felony.', climate: 'continental', zone: '4a-5b', season: 'May-Sep', bestStrains: ['Northern Lights', 'White Widow', 'Auto Critical', 'Blue Dream', 'Early Girl'] },
  'nevada': { abbr: 'NV', rec: true, med: true, recYear: 2016, medYear: 2000, possess: '1 oz (3.5g concentrate)', plants: 6, medNote: 'Question 2 legalized recreational cannabis. Adults 21+ can possess 1 oz and grow 6 plants if more than 25 miles from a dispensary. The Cannabis Compliance Board regulates the industry.', penalties: 'Possession over 1 oz but under 50 lbs: category E felony (1-4 years, possible probation for first offense).', climate: 'arid desert', zone: '4a-10a', season: 'Mar-Nov (manage heat)', bestStrains: ['OG Kush', 'Sour Diesel', 'Girl Scout Cookies', 'Durban Poison', 'Jack Herer'] },
  'new-hampshire': { abbr: 'NH', rec: false, med: true, medYear: 2013, possess: '2 oz (medical)', plants: 0, medNote: 'HB 573 (2013) created the therapeutic cannabis program. Medical patients can possess 2 oz per 10-day period. Home cultivation is not permitted. Four Alternative Treatment Centers operate statewide. Decriminalization (2017): possession of 3/4 oz or less is a violation, not a crime.', penalties: 'Possession 3/4 oz or less: violation ($100 fine). Over 3/4 oz: misdemeanor. Over 1 oz with intent to sell: felony.', climate: 'humid continental', zone: '4a-6a', season: 'May-Oct', bestStrains: ['Northern Lights', 'White Widow', 'Blueberry', 'Auto Critical', 'Purple Kush'] },
  'new-jersey': { abbr: 'NJ', rec: true, med: true, recYear: 2021, medYear: 2010, possess: '1 oz', plants: 0, medNote: 'Public Question 1 (2020 ballot) legalized recreational cannabis effective 2021. Adults 21+ can possess up to 1 oz. Home cultivation is NOT permitted for recreational users. The Cannabis Regulatory Commission manages the market.', penalties: 'Possession over 1 oz but under 6 oz: disorderly persons offense. Over 6 oz: crime of the fourth degree.', climate: 'humid subtropical to continental', zone: '6a-7b', season: 'May-Oct', bestStrains: ['Blue Dream', 'Girl Scout Cookies', 'Northern Lights', 'Sour Diesel', 'White Widow'] },
  'new-mexico': { abbr: 'NM', rec: true, med: true, recYear: 2021, medYear: 2007, possess: '2 oz', plants: 12, medNote: 'Cannabis Regulation Act (HB 2, 2021) legalized recreational cannabis. Adults 21+ can possess 2 oz and grow up to 12 plants per household (6 mature). The Cannabis Control Division oversees the industry.', penalties: 'Possession over 2 oz but under 8 oz: misdemeanor. Over 8 oz: fourth-degree felony.', climate: 'arid to semi-arid', zone: '4b-8b', season: 'Apr-Oct', bestStrains: ['OG Kush', 'Sour Diesel', 'Blue Dream', 'Durban Poison', 'Jack Herer'] },
  'new-york': { abbr: 'NY', rec: true, med: true, recYear: 2021, medYear: 2014, possess: '3 oz (24g concentrate)', plants: 6, medNote: 'Marijuana Regulation and Taxation Act (MRTA, 2021) legalized recreational cannabis. Adults 21+ can possess 3 oz and grow 6 plants per person (12 per household, starting 2024). The Office of Cannabis Management (OCM) regulates the market.', penalties: 'Possession over 3 oz but under 16 oz: class A misdemeanor (up to 1 year). Over 16 oz: class E felony.', climate: 'humid continental', zone: '4a-7b', season: 'May-Oct', bestStrains: ['Sour Diesel', 'Blue Dream', 'Girl Scout Cookies', 'Northern Lights', 'Gorilla Glue #4'] },
  'north-carolina': { abbr: 'NC', rec: false, med: false, medYear: null, possess: '0', plants: 0, medNote: 'North Carolina has not legalized medical or recreational marijuana. SB 711 (Compassionate Care Act) was introduced in 2023 to create a medical program but has not passed. Possession of 0.5 oz or less is decriminalized (misdemeanor, no jail for first offense).', penalties: 'Possession 0.5 oz or less: class 3 misdemeanor ($200 fine). 0.5-1.5 oz: class 1 misdemeanor. Over 1.5 oz: class I felony.', climate: 'humid subtropical', zone: '6a-8b', season: 'Apr-Oct', bestStrains: ['Blue Dream', 'Northern Lights', 'ACDC', 'White Widow', 'Girl Scout Cookies'] },
  'north-dakota': { abbr: 'ND', rec: false, med: true, medYear: 2016, possess: '2.5 oz (medical)', plants: 0, medNote: 'Measure 5 (2016) approved medical cannabis. Qualifying patients can possess 2.5 oz per 30-day period. Home cultivation is not permitted. The North Dakota Department of Health and Human Services oversees the program.', penalties: 'Non-medical possession under 0.5 oz: infraction ($1,000 fine). 0.5 oz-1 lb: class A misdemeanor. Over 1 lb: class C felony.', climate: 'continental (harsh winters)', zone: '3a-4b', season: 'May-Sep (short)', bestStrains: ['Northern Lights', 'Auto Blueberry', 'White Widow', 'Early Girl', 'Critical Mass'] },
  'ohio': { abbr: 'OH', rec: true, med: true, recYear: 2023, medYear: 2016, possess: '2.5 oz', plants: 6, medNote: 'Issue 2 (2023 ballot) legalized recreational cannabis. Adults 21+ can possess 2.5 oz and grow up to 6 plants (12 per household). The Division of Cannabis Control oversees implementation.', penalties: 'Possession over 2.5 oz: minor misdemeanor for amounts under 100g ($150 fine). Over 200g: felony.', climate: 'humid continental', zone: '5b-6b', season: 'May-Oct', bestStrains: ['Blue Dream', 'Girl Scout Cookies', 'Northern Lights', 'Gorilla Glue #4', 'White Widow'] },
  'oklahoma': { abbr: 'OK', rec: false, med: true, medYear: 2018, possess: '3 oz on person (medical)', plants: 12, medNote: 'SQ 788 (2018) created one of the most permissive medical cannabis programs in the US. Patients can possess 3 oz on person, 8 oz at home, and grow 12 plants (6 mature, 6 seedlings). Over 370,000 active patient licenses as of 2024.', penalties: 'Non-medical possession under 1.5 oz: misdemeanor (up to 1 year, $1,000 fine). Over 1.5 oz: felony (2-10 years). SQ 820 (recreational legalization) failed in 2023.', climate: 'humid subtropical to semi-arid', zone: '6b-7b', season: 'Apr-Oct', bestStrains: ['Blue Dream', 'Girl Scout Cookies', 'OG Kush', 'Gorilla Glue #4', 'Sour Diesel'] },
  'oregon': { abbr: 'OR', rec: true, med: true, recYear: 2014, medYear: 1998, possess: '1 oz (public), 8 oz (home)', plants: 4, medNote: 'Measure 91 legalized recreational cannabis. Adults 21+ can possess 1 oz in public, 8 oz at home, and grow 4 plants. Oregon was the second state to legalize medical cannabis (1998). The Oregon Liquor and Cannabis Commission regulates the market.', penalties: 'Possession over 1 oz in public: class B violation ($500-$1,250 fine). Over 8 oz at home: class C misdemeanor.', climate: 'maritime to continental', zone: '4b-9b', season: 'Apr-Oct', bestStrains: ['Blue Dream', 'Sour Diesel', 'Gorilla Glue #4', 'OG Kush', 'Jack Herer'] },
  'pennsylvania': { abbr: 'PA', rec: false, med: true, medYear: 2016, possess: '30-day supply (medical)', plants: 0, medNote: 'Act 16 (SB 3, 2016) created the medical marijuana program. Qualifying patients can purchase a 30-day supply from licensed dispensaries. Smokable flower was added in 2018. Home cultivation is not permitted. The Department of Health oversees the program.', penalties: 'Non-medical possession under 30g: misdemeanor (up to 30 days, $500 fine). Over 30g: misdemeanor (up to 1 year, $5,000 fine). Manufacturing/delivery: felony.', climate: 'humid continental', zone: '5b-7a', season: 'May-Oct', bestStrains: ['Blue Dream', 'Northern Lights', 'Girl Scout Cookies', 'ACDC', 'White Widow'] },
  'rhode-island': { abbr: 'RI', rec: true, med: true, recYear: 2022, medYear: 2006, possess: '1 oz', plants: 6, medNote: 'Cannabis Act (2022) legalized recreational cannabis. Adults 21+ can possess 1 oz and grow up to 6 plants (3 mature). Rhode Island has had a medical program since 2006. The Cannabis Control Commission regulates the industry.', penalties: 'Possession over 1 oz: civil violation ($150 fine for first offense). Over 2 oz: misdemeanor.', climate: 'humid continental (maritime)', zone: '6a-7a', season: 'May-Oct', bestStrains: ['Northern Lights', 'Blue Dream', 'White Widow', 'Girl Scout Cookies', 'Blueberry'] },
  'south-carolina': { abbr: 'SC', rec: false, med: false, medYear: null, possess: '0', plants: 0, medNote: 'South Carolina has not legalized medical or recreational marijuana. The Compassionate Care Act (S. 150) was introduced in 2023 to allow medical cannabis but has not passed. All marijuana possession remains illegal.', penalties: 'First-offense possession under 1 oz: misdemeanor (up to 30 days, $100-$200 fine). Second offense: up to 1 year, $1,000 fine. Subsequent: felony (up to 5 years, $5,000 fine).', climate: 'humid subtropical', zone: '7b-9a', season: 'Mar-Nov', bestStrains: ['Blue Dream', 'Northern Lights', 'ACDC', 'Charlotte\'s Web', 'Girl Scout Cookies'] },
  'south-dakota': { abbr: 'SD', rec: false, med: true, medYear: 2020, possess: '3 oz (medical)', plants: 3, medNote: 'IM 26 (2020) legalized medical cannabis. Patients can possess 3 oz and grow 3 plants (if 150+ miles from dispensary). Amendment A (recreational legalization) passed the same year but was struck down by the state Supreme Court. Recreational remains illegal.', penalties: 'Non-medical possession under 2 oz: class 1 misdemeanor (up to 1 year, $2,000 fine). 2 oz-0.5 lb: class 6 felony. Over 0.5 lb: class 5 felony.', climate: 'continental (harsh winters)', zone: '3b-5a', season: 'May-Sep', bestStrains: ['Northern Lights', 'Auto Blueberry', 'White Widow', 'Early Girl', 'Critical Mass'] },
  'tennessee': { abbr: 'TN', rec: false, med: false, medYear: null, possess: '0', plants: 0, medNote: 'Tennessee has not legalized medical or recreational marijuana. A limited CBD oil law (2014) allows certain epilepsy patients to use cannabis oil with less than 0.9% THC. No dispensaries or commercial cultivation exists.', penalties: 'Possession under 0.5 oz: class A misdemeanor (up to 1 year, $2,500 fine). Over 0.5 oz: felony with mandatory minimum.', climate: 'humid subtropical', zone: '6b-7b', season: 'Apr-Oct', bestStrains: ['Blue Dream', 'Northern Lights', 'ACDC', 'White Widow', 'Girl Scout Cookies'] },
  'texas': { abbr: 'TX', rec: false, med: true, medYear: 2015, possess: 'Low-THC only (medical)', plants: 0, medNote: 'Compassionate Use Act (SB 339, 2015) created a limited medical program allowing low-THC cannabis (1% THC cap, raised from 0.5% in 2021). Only 3 licensed dispensaries serve the entire state. Qualifying conditions were expanded in 2021 (HB 1535) to include cancer and PTSD.', penalties: 'Possession under 2 oz: class B misdemeanor (up to 180 days, $2,000 fine). 2-4 oz: class A misdemeanor (up to 1 year, $4,000 fine). Over 4 oz: state jail felony.', climate: 'diverse (humid to arid)', zone: '6b-10a', season: 'Mar-Nov', bestStrains: ['OG Kush', 'Sour Diesel', 'Girl Scout Cookies', 'Blue Dream', 'Gorilla Glue #4'] },
  'utah': { abbr: 'UT', rec: false, med: true, medYear: 2018, possess: '113g unprocessed (medical)', plants: 0, medNote: 'Proposition 2 (Utah Medical Cannabis Act, 2018) legalized medical cannabis, later modified by HB 3001. Qualifying patients can obtain cannabis from licensed pharmacies. Home cultivation is not permitted. The Center for Medical Cannabis oversees the program.', penalties: 'Non-medical possession under 1 oz: class B misdemeanor (up to 6 months, $1,000 fine). 1 oz-1 lb: class A misdemeanor. Over 1 lb: third-degree felony.', climate: 'arid to semi-arid', zone: '4a-9a', season: 'May-Oct', bestStrains: ['Northern Lights', 'White Widow', 'Auto Blueberry', 'ACDC', 'Blue Dream'] },
  'vermont': { abbr: 'VT', rec: true, med: true, recYear: 2018, medYear: 2004, possess: '1 oz', plants: 6, medNote: 'Act 86 (2018) made Vermont the first state to legalize recreational cannabis through legislation (rather than ballot initiative). Adults 21+ can possess 1 oz and grow up to 6 plants (2 mature). Retail sales began in October 2022 under the Cannabis Control Board.', penalties: 'Possession over 1 oz but under 2 oz: civil violation ($200 fine). Over 2 oz: misdemeanor.', climate: 'humid continental', zone: '3b-5b', season: 'May-Sep', bestStrains: ['Northern Lights', 'White Widow', 'Blueberry', 'Auto Blueberry', 'Purple Kush'] },
  'virginia': { abbr: 'VA', rec: true, med: true, recYear: 2021, medYear: 2020, possess: '1 oz', plants: 4, medNote: 'SB 1406/HB 2312 (2021) legalized possession and home cultivation. Adults 21+ can possess 1 oz and grow 4 plants per household. However, retail sales have NOT begun — the reenactment clause for commercial regulation was removed by the incoming governor in 2022. Medical dispensaries operate under the Board of Pharmacy.', penalties: 'Possession over 1 oz: $25 civil fine. Over 1 lb: class 5 felony.', climate: 'humid subtropical', zone: '6a-8a', season: 'Apr-Oct', bestStrains: ['Blue Dream', 'Girl Scout Cookies', 'Northern Lights', 'Sour Diesel', 'Gorilla Glue #4'] },
  'washington': { abbr: 'WA', rec: true, med: true, recYear: 2012, medYear: 1998, possess: '1 oz', plants: 15, medNote: 'Initiative 502 made Washington one of the first states (alongside Colorado) to legalize recreational cannabis in 2012. Adults 21+ can possess 1 oz. Home cultivation is only allowed for medical patients (15 plants). The Washington State Liquor and Cannabis Board regulates the market.', penalties: 'Possession over 40g: class C felony (up to 5 years, $10,000 fine).', climate: 'maritime (west) to continental (east)', zone: '4b-9a', season: 'Apr-Oct', bestStrains: ['Blue Dream', 'Gorilla Glue #4', 'Sour Diesel', 'Girl Scout Cookies', 'OG Kush'] },
  'west-virginia': { abbr: 'WV', rec: false, med: true, medYear: 2017, possess: '30-day supply (medical)', plants: 0, medNote: 'SB 386 (West Virginia Medical Cannabis Act, 2017) created the medical program. Qualifying patients can obtain a 30-day supply from licensed dispensaries. Home cultivation is not permitted. The Office of Medical Cannabis manages the program.', penalties: 'Non-medical possession: misdemeanor (90 days-6 months, $1,000 fine for first offense). Manufacturing or delivery: felony.', climate: 'humid continental', zone: '5b-7a', season: 'May-Oct', bestStrains: ['Northern Lights', 'Blue Dream', 'White Widow', 'ACDC', 'Blueberry'] },
  'wisconsin': { abbr: 'WI', rec: false, med: false, medYear: null, possess: '0', plants: 0, medNote: 'Wisconsin has not legalized medical or recreational marijuana. Governor Evers has included legalization in budget proposals since 2019, but the Republican-controlled legislature has not passed it. CBD with under 0.3% THC is legal.', penalties: 'First-offense possession (any amount): misdemeanor (up to 6 months, $1,000 fine). Second+: class I felony (up to 3.5 years, $10,000 fine).', climate: 'humid continental (cold)', zone: '3b-5b', season: 'May-Sep', bestStrains: ['Northern Lights', 'Auto Blueberry', 'White Widow', 'Early Girl', 'Critical Mass'] },
  'wyoming': { abbr: 'WY', rec: false, med: false, medYear: null, possess: '0', plants: 0, medNote: 'Wyoming has not legalized medical or recreational marijuana. A 2022 decriminalization bill (HB 0209) died in committee. All marijuana possession, sale, and cultivation is illegal.', penalties: 'Possession under 3 oz: misdemeanor (up to 1 year, $1,000 fine). Over 3 oz: felony (up to 5 years, $10,000 fine). Any amount of concentrate: felony.', climate: 'semi-arid continental', zone: '3a-5b', season: 'May-Sep (short)', bestStrains: ['Northern Lights', 'Auto Blueberry', 'White Widow', 'Early Girl', 'Critical Mass'] },
};

// Synonyms for "New York State"
const stateAliases = { 'new-york-state': 'new-york' };

// ── Page type detection ──
function detectPageType(slug, title) {
  const s = slug.toLowerCase();
  if (/^top-10-cannabis-seeds-in-|^seeds-in-/.test(s)) return 'top10';
  if (/^is-marijuana-legal|^is-marijuanas-legalized|^is-medical-marijuana-legal|^is-recreational-marijuana-legal|^is-marijuana-illegal|^did-marijuana|^did-the-marijuana/.test(s)) return 'legal';
  if (/^how-to-get.*medical|^how-do-you-get.*medical/.test(s)) return 'medical-card';
  if (/best-cannabis-seeds-to-grow|cannabis-seeds-that-thrive|guide-to-buying|top-cannabis-seeds-for/.test(s)) return 'growing-guide';
  if (/marijuana-seeds-|^ohio-marijuana-seeds/.test(s)) return 'seed-buying';
  return 'general';
}

// ── Extract state from slug ──
function extractState(slug) {
  // Try multiple patterns
  const patterns = [
    /^is-marijuana-legal-in-(.+?)(?:-\d{4})?$/,
    /^is-marijuanas?-legalized-in-(.+)$/,
    /^is-medical-marijuana-legal-in-(.+?)(?:-\d{4})?$/,
    /^is-recreational-marijuana-legal-in-(.+)$/,
    /^is-marijuana-illegal-in-(.+)$/,
    /^did-(?:the-)?marijuana-(?:law|bill)-pass-in-(.+)$/,
    /^how-to-get-(?:a-)?medical-marijuanas?(?:-card)?-in-(.+)$/,
    /^how-do-you-get-(?:a-)?medical-marijuanas?-card-in-(.+)$/,
    /^top-10-cannabis-seeds-in-(.+)$/,
    /^seeds-in-(.+)$/,
    /^marijuana-seeds-(.+)$/,
    /^(.+)-marijuana-seeds$/,
    /^best-cannabis-seeds-to-grow-in-(.+)$/,
    /^cannabis-seeds-that-thrive-in-(.+?)(?:-heat|-cold|-climate)?$/,
    /^top-cannabis-seeds-for-(.+?)(?:-desert|-mountain|-coastal|-conditions|-climate|-weather)?(?:-conditions)?$/,
  ];
  for (const p of patterns) {
    const m = slug.match(p);
    if (m) {
      let state = m[1].replace(/-/g, ' ').toLowerCase();
      // Check aliases
      const aliasKey = m[1].toLowerCase();
      if (stateAliases[aliasKey]) state = stateAliases[aliasKey].replace(/-/g, ' ');
      return state;
    }
  }
  return null;
}

function getStateData(stateName) {
  if (!stateName) return null;
  const key = stateName.toLowerCase().replace(/\s+/g, '-');
  return stateData[key] || null;
}

function stateName(s) { return titleCase(s); }

// ── Chart/Table HTML generators ──
function legalStatusTable(st, sn) {
  const statusColor = st.rec ? '#22c55e' : st.med ? '#eab308' : '#ef4444';
  const statusText = st.rec ? 'Fully Legal (Recreational + Medical)' : st.med ? 'Medical Only' : 'Illegal (Limited CBD only)';
  return `
<div style="overflow-x:auto;margin:1.5em 0">
<table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e5e7eb">
<caption style="font-weight:600;font-size:16px;padding:12px;background:#275C53;color:white;text-align:left">Cannabis Legal Status in ${sn} — 2026 Overview</caption>
<tr style="background:#f9fafb"><td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600;width:40%">Legal Status</td><td style="padding:10px 14px;border:1px solid #e5e7eb"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${statusColor};margin-right:6px"></span>${statusText}</td></tr>
<tr><td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">Recreational</td><td style="padding:10px 14px;border:1px solid #e5e7eb">${st.rec ? `Yes (since ${st.recYear})` : 'No'}</td></tr>
<tr style="background:#f9fafb"><td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">Medical Program</td><td style="padding:10px 14px;border:1px solid #e5e7eb">${st.med ? `Yes (since ${st.medYear})` : st.medYear ? `Limited (since ${st.medYear})` : 'No'}</td></tr>
<tr><td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">Possession Limit</td><td style="padding:10px 14px;border:1px solid #e5e7eb">${st.possess || 'None (illegal)'}</td></tr>
<tr style="background:#f9fafb"><td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">Home Cultivation</td><td style="padding:10px 14px;border:1px solid #e5e7eb">${st.plants > 0 ? `Up to ${st.plants} plants` : 'Not permitted'}</td></tr>
<tr><td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">USDA Hardiness Zone</td><td style="padding:10px 14px;border:1px solid #e5e7eb">${st.zone}</td></tr>
</table>
</div>`;
}

function penaltyChart(st, sn) {
  return `
<div style="margin:1.5em 0;padding:20px;background:#fef2f2;border-left:4px solid #ef4444;border-radius:8px">
<h4 style="margin:0 0 10px;color:#991b1b;font-size:15px">Penalties for Non-Compliance in ${sn}</h4>
<p style="margin:0;font-size:14px;color:#1f2937;line-height:1.7">${st.penalties}</p>
</div>`;
}

function growingConditionsChart(st, sn) {
  const bars = [
    { label: 'Temperature Tolerance', value: st.climate.includes('tropical') ? 90 : st.climate.includes('arid') ? 75 : st.climate.includes('cold') || st.climate.includes('harsh') ? 45 : st.climate.includes('subarctic') ? 30 : 65 },
    { label: 'Growing Season Length', value: st.season.includes('Year') ? 95 : st.season.includes('short') ? 35 : st.season.includes('Mar') ? 80 : st.season.includes('Apr') ? 70 : st.season.includes('May-Sep') ? 50 : 60 },
    { label: 'Outdoor Suitability', value: st.climate.includes('tropical') ? 85 : st.climate.includes('Mediterranean') ? 90 : st.climate.includes('arid') ? 70 : st.climate.includes('cold') || st.climate.includes('harsh') ? 35 : 60 },
    { label: 'Humidity Challenge', value: st.climate.includes('humid') ? 75 : st.climate.includes('tropical') ? 80 : st.climate.includes('arid') ? 20 : 50 },
  ];
  return `
<div style="margin:1.5em 0;padding:20px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px">
<h4 style="margin:0 0 16px;color:#275C53;font-size:15px">Growing Conditions Profile — ${sn}</h4>
<p style="font-size:13px;color:#6b7280;margin:0 0 12px">Climate: ${st.climate} | Season: ${st.season} | Zone: ${st.zone}</p>
${bars.map(b => `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px"><span>${b.label}</span><span style="color:#6b7280">${b.value}%</span></div><div style="background:#e5e7eb;border-radius:6px;height:12px;overflow:hidden"><div style="background:#275C53;height:100%;width:${b.value}%;border-radius:6px;transition:width 0.5s"></div></div></div>`).join('')}
</div>`;
}

function top5StrainsTable(st, sn) {
  const strains = st.bestStrains;
  const reasons = [
    ['Heat-resistant genetics with reliable outdoor yields', 'Indica-dominant', '18-24%', '8-9 weeks'],
    ['Proven performer in diverse US climates', 'Hybrid', '20-25%', '9-10 weeks'],
    ['Compact structure ideal for discreet cultivation', 'Indica', '16-21%', '7-8 weeks'],
    ['Vigorous growth with strong pest resistance', 'Sativa-dominant', '19-24%', '10-11 weeks'],
    ['Fast finisher with dependable germination rates', 'Hybrid', '17-22%', '8-9 weeks'],
  ];
  return `
<div style="overflow-x:auto;margin:1.5em 0">
<table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e5e7eb">
<caption style="font-weight:600;font-size:16px;padding:12px;background:#275C53;color:white;text-align:left">Recommended Strains for ${sn} Growers</caption>
<tr style="background:#f9fafb"><th style="padding:10px 14px;border:1px solid #e5e7eb;text-align:left">Strain</th><th style="padding:10px 14px;border:1px solid #e5e7eb;text-align:left">Type</th><th style="padding:10px 14px;border:1px solid #e5e7eb;text-align:left">THC Range</th><th style="padding:10px 14px;border:1px solid #e5e7eb;text-align:left">Flower Time</th><th style="padding:10px 14px;border:1px solid #e5e7eb;text-align:left">Why It Works Here</th></tr>
${strains.map((s, i) => `<tr${i % 2 === 0 ? '' : ' style="background:#f9fafb"'}><td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">${s}</td><td style="padding:10px 14px;border:1px solid #e5e7eb">${reasons[i][1]}</td><td style="padding:10px 14px;border:1px solid #e5e7eb">${reasons[i][2]}</td><td style="padding:10px 14px;border:1px solid #e5e7eb">${reasons[i][3]}</td><td style="padding:10px 14px;border:1px solid #e5e7eb">${reasons[i][0]}</td></tr>`).join('')}
</table>
</div>`;
}

function comparisonToNeighborStates(sn, slug) {
  // Pick 2-3 neighboring states based on rough geography
  const neighbors = {
    'alabama': ['georgia', 'florida', 'tennessee', 'mississippi'],
    'alaska': ['washington', 'oregon', 'hawaii'],
    'arizona': ['california', 'nevada', 'new-mexico', 'colorado'],
    'arkansas': ['tennessee', 'missouri', 'oklahoma', 'mississippi'],
    'california': ['oregon', 'nevada', 'arizona'],
    'colorado': ['new-mexico', 'kansas', 'nebraska', 'wyoming'],
    'connecticut': ['new-york', 'massachusetts', 'rhode-island'],
    'delaware': ['maryland', 'pennsylvania', 'new-jersey'],
    'florida': ['georgia', 'alabama'],
    'georgia': ['florida', 'south-carolina', 'alabama', 'tennessee'],
    'hawaii': ['california', 'alaska'],
    'idaho': ['montana', 'wyoming', 'oregon', 'washington'],
    'illinois': ['indiana', 'missouri', 'iowa', 'wisconsin'],
    'indiana': ['illinois', 'ohio', 'kentucky', 'michigan'],
    'iowa': ['minnesota', 'nebraska', 'illinois', 'missouri'],
    'kansas': ['missouri', 'colorado', 'nebraska', 'oklahoma'],
    'kentucky': ['tennessee', 'virginia', 'west-virginia', 'ohio'],
    'louisiana': ['mississippi', 'texas', 'arkansas'],
    'maine': ['new-hampshire', 'vermont', 'massachusetts'],
    'maryland': ['virginia', 'delaware', 'pennsylvania'],
    'massachusetts': ['connecticut', 'rhode-island', 'new-york', 'vermont'],
    'michigan': ['ohio', 'indiana', 'wisconsin'],
    'minnesota': ['wisconsin', 'iowa', 'north-dakota', 'south-dakota'],
    'mississippi': ['alabama', 'tennessee', 'louisiana', 'arkansas'],
    'missouri': ['illinois', 'kansas', 'arkansas', 'iowa'],
    'montana': ['idaho', 'wyoming', 'north-dakota', 'south-dakota'],
    'nebraska': ['iowa', 'kansas', 'colorado', 'south-dakota'],
    'nevada': ['california', 'oregon', 'arizona', 'utah'],
    'new-hampshire': ['vermont', 'maine', 'massachusetts'],
    'new-jersey': ['new-york', 'pennsylvania', 'delaware'],
    'new-mexico': ['arizona', 'colorado', 'texas'],
    'new-york': ['new-jersey', 'connecticut', 'massachusetts', 'pennsylvania'],
    'north-carolina': ['virginia', 'south-carolina', 'tennessee'],
    'north-dakota': ['montana', 'south-dakota', 'minnesota'],
    'ohio': ['michigan', 'indiana', 'pennsylvania', 'west-virginia'],
    'oklahoma': ['texas', 'kansas', 'arkansas', 'missouri'],
    'oregon': ['washington', 'california', 'idaho', 'nevada'],
    'pennsylvania': ['new-york', 'new-jersey', 'ohio', 'maryland'],
    'rhode-island': ['connecticut', 'massachusetts'],
    'south-carolina': ['north-carolina', 'georgia'],
    'south-dakota': ['north-dakota', 'nebraska', 'montana', 'wyoming'],
    'tennessee': ['kentucky', 'virginia', 'north-carolina', 'georgia'],
    'texas': ['new-mexico', 'oklahoma', 'louisiana', 'arkansas'],
    'utah': ['colorado', 'nevada', 'arizona', 'idaho'],
    'vermont': ['new-hampshire', 'new-york', 'massachusetts'],
    'virginia': ['maryland', 'west-virginia', 'north-carolina', 'kentucky'],
    'washington': ['oregon', 'idaho'],
    'west-virginia': ['virginia', 'ohio', 'kentucky', 'pennsylvania'],
    'wisconsin': ['minnesota', 'michigan', 'illinois', 'iowa'],
    'wyoming': ['montana', 'colorado', 'idaho', 'south-dakota'],
  };
  const stateKey = sn.toLowerCase().replace(/\s+/g, '-');
  const nbrs = (neighbors[stateKey] || []).slice(0, 3);
  if (nbrs.length === 0) return '';

  const rows = nbrs.map(nk => {
    const nd = stateData[nk];
    if (!nd) return '';
    const ns = titleCase(nk.replace(/-/g, ' '));
    return `<tr><td style="padding:10px 14px;border:1px solid #e5e7eb"><a href="/is-marijuana-legal-in-${nk}">${ns}</a></td><td style="padding:10px 14px;border:1px solid #e5e7eb">${nd.rec ? 'Recreational' : nd.med ? 'Medical Only' : 'Illegal'}</td><td style="padding:10px 14px;border:1px solid #e5e7eb">${nd.possess || 'None'}</td><td style="padding:10px 14px;border:1px solid #e5e7eb">${nd.plants > 0 ? nd.plants + ' plants' : 'No'}</td></tr>`;
  }).filter(Boolean).join('');

  return `
<div style="overflow-x:auto;margin:1.5em 0">
<table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e5e7eb">
<caption style="font-weight:600;font-size:16px;padding:12px;background:#1e3a5f;color:white;text-align:left">How ${sn} Compares to Neighboring States</caption>
<tr style="background:#f9fafb"><th style="padding:10px 14px;border:1px solid #e5e7eb;text-align:left">State</th><th style="padding:10px 14px;border:1px solid #e5e7eb;text-align:left">Legal Status</th><th style="padding:10px 14px;border:1px solid #e5e7eb;text-align:left">Possession Limit</th><th style="padding:10px 14px;border:1px solid #e5e7eb;text-align:left">Home Grow</th></tr>
${rows}
</table>
</div>`;
}

// ── Internal link generators ──
function stateLinks(currentSlug, currentState) {
  const key = currentState.toLowerCase().replace(/\s+/g, '-');
  const links = [];
  // Link to top-10 page for same state
  links.push(a(`Top 10 Cannabis Seeds in ${stateName(currentState)}`, `/top-10-cannabis-seeds-in-${key}`));
  // Link to buy page for state
  links.push(a(`Buy Cannabis Seeds in ${stateName(currentState)}`, `/buy-cannabis-seeds-in-${key}`));
  return links;
}

// ── Content Generators ──

function generateLegalPage(slug, title, state, st) {
  const sn = stateName(state);
  const h = hash(slug);
  const iLinks = stateLinks(slug, state);

  const openings = [
    `Understanding where ${sn} stands on cannabis in 2026 requires looking beyond the headline of "legal or not." The regulatory landscape here has developed through specific legislation, voter initiatives, and ongoing enforcement decisions that shape what residents and visitors can actually do with marijuana on a daily basis.`,
    `Cannabis policy in ${sn} sits at a particular point on the legalization spectrum in 2026, and the practical implications extend well beyond simple possession rules. The intersection of state law, local ordinances, and federal policy creates a reality that differs from what many assume based on headlines alone.`,
    `The question of marijuana legality in ${sn} as of 2026 touches employment law, housing policy, interstate travel, seed purchasing, and cultivation rights — not just whether you can walk into a dispensary. Each of these dimensions operates under different rules, and the distinctions matter.`,
    `${sn}'s approach to cannabis regulation in 2026 reflects the state's specific political history, public health priorities, and economic calculations. The current framework did not appear overnight — it developed through years of legislative activity, ballot measures, and shifting enforcement priorities.`,
  ];

  const recSection = st.rec ? `
<h2>Recreational Cannabis in ${sn}</h2>
<p>${sn} legalized recreational marijuana in ${st.recYear}, joining a growing number of states that allow adult-use cannabis. ${st.medNote}</p>
<p>The practical experience of buying recreational cannabis in ${sn} depends heavily on local implementation. Municipalities retain the authority to opt out of allowing retail dispensaries, which means availability varies significantly by county and city. Some areas have dozens of operating dispensaries, while neighboring jurisdictions have none.</p>
<p>One distinction that catches many people off guard: possession limits apply to what you carry, not what you consume at home. The ${st.possess} public possession limit does not necessarily reflect what you can store in your residence, though exceeding reasonable amounts can trigger law enforcement scrutiny regardless of the technical legal threshold.</p>` : st.med ? `
<h2>Medical Cannabis in ${sn}</h2>
<p>${st.medNote}</p>
<p>The medical program in ${sn} serves patients with qualifying conditions, though the list of conditions and the process for obtaining a card vary in their accessibility. Some conditions require documented treatment failure with conventional approaches before a cannabis recommendation can be issued.</p>
<p>Medical patients often have access to higher potency products, larger possession limits, and tax advantages compared to recreational consumers in states that have both programs. In ${sn}, the medical framework provides the only legal pathway to marijuana access.</p>` : `
<h2>Cannabis Prohibition in ${sn}</h2>
<p>${st.medNote}</p>
<p>Without a medical or recreational program, ${sn} residents who use cannabis for any purpose operate outside state law. This creates practical consequences that extend beyond criminal penalties — employment screening, housing applications, child custody proceedings, and professional licensing all intersect with marijuana prohibition in ways that affect daily life.</p>
<p>The absence of a state program does not prevent residents from purchasing ${a('cannabis seeds', '/product-category/shop-all-cannabis-seeds')} for collection purposes, as ungerminated seeds exist in a different regulatory category than mature cannabis plants under federal law.</p>`;

  const cultivationSection = st.plants > 0 ? `
<h2>Home Cultivation Rules</h2>
<p>Home growing in ${sn} is permitted with a limit of ${st.plants} plants. This allowance creates an opportunity for residents interested in understanding the plant from seed to harvest. The ${st.climate} climate here, with a typical outdoor season running ${st.season} and USDA zones ${st.zone}, shapes which genetics perform reliably without controlled-environment infrastructure.</p>
<p>Indoor cultivation removes the climate variable but introduces costs — electricity for lighting, ventilation equipment, and the ongoing expense of nutrients and growing media. Most home growers in ${sn} spend between $500 and $2,000 on initial setup for a small indoor grow, depending on whether they choose LED or HPS lighting systems and whether they build or buy their grow space.</p>
<p>For outdoor grows in ${sn}'s ${st.climate} climate, ${CL.auto} offer a practical advantage: they flower based on age rather than light cycle, which means they can finish before late-season weather challenges arrive. ${CL.fem} eliminate the risk of male plants consuming half your limited plant count. Both seed types are available in our ${CL.all}.</p>` : `
<h2>Home Cultivation</h2>
<p>Home cultivation is not currently permitted in ${sn}, which means the only legal access points are ${st.med ? 'licensed dispensaries for qualifying medical patients' : 'effectively nonexistent under state law'}. This restriction does not prevent residents from purchasing and collecting ${a('cannabis seeds', '/product-category/shop-all-cannabis-seeds')}, which are sold as botanical specimens and collector items.</p>
<p>If home grow laws change in ${sn}, residents in USDA zones ${st.zone} with a ${st.climate} climate and growing season running ${st.season} would find that certain genetics are better suited to local conditions than others. Growers in similar climates across the US tend to favor ${CL.auto} for their speed and ${CL.ind} for their manageable size and resilience.</p>`;

  const purchasingSection = `
<h2>Cannabis Seed Purchasing in ${sn}</h2>
<p>Cannabis seeds are available for purchase in ${sn} regardless of the state's marijuana laws. Seeds are sold as genetic preservation specimens, collector items, and for ${st.plants > 0 ? 'legal home cultivation' : 'jurisdictions where cultivation is permitted'}. Royal King Seeds ships ${CL.fem}, ${CL.auto}, and ${CL.all} to all 50 states with discreet packaging.</p>
<p>Seed selection matters more than most new growers realize. The difference between a strain bred for ${sn}'s ${st.climate} conditions and one developed for a completely different climate can mean the difference between a successful harvest and a failed crop. Our ${a(`Top 10 Seeds for ${sn}`, `/top-10-cannabis-seeds-in-${state.replace(/\s+/g, '-')}`)} guide breaks down which cultivars match ${sn}'s specific growing environment.</p>`;

  const travelSection = `
<h2>Interstate Travel and Federal Considerations</h2>
<p>Regardless of ${sn}'s state laws, transporting marijuana across state lines is a federal offense. This applies even when traveling between two states where cannabis is fully legal. Federal land within ${sn} — including national parks, military installations, and federal buildings — operates under federal law, where all cannabis remains a Schedule I substance.</p>
<p>Air travel from ${sn} airports falls under federal jurisdiction through the TSA, which means carrying cannabis products onto flights creates federal legal exposure. This remains true whether ${sn} itself permits recreational use or not.</p>`;

  const futureSection = st.rec ? `
<h2>What's Changing in 2026 and Beyond</h2>
<p>The recreational market in ${sn} continues to evolve as regulators adjust licensing structures, testing requirements, and tax rates based on early operational data. Social equity provisions — designed to address historical enforcement disparities — remain a point of ongoing legislative discussion, with implementation varying widely across the state.</p>
<p>Federal rescheduling discussions, which gained momentum through 2024-2025, could fundamentally alter the banking, taxation, and interstate commerce frameworks that currently constrain ${sn}'s cannabis industry. Until federal policy changes, state-legal cannabis businesses operate under Section 280E tax limitations and lack access to standard banking services.</p>` : `
<h2>What Could Change in ${sn}</h2>
<p>${st.med ? `With a medical program already operating, ${sn} has the regulatory infrastructure that often serves as a foundation for eventual recreational legalization. The progression from medical-only to adult-use has become a common pattern across US states, though timelines vary from 2 to 15+ years.` : `Legislative efforts to introduce medical cannabis in ${sn} continue to surface periodically, though the political dynamics have not yet aligned to produce a signed bill. States with similar demographic and political profiles have moved on medical legalization in recent years, which may influence future legislative sessions.`}</p>
<p>Regardless of ${sn}'s current laws, purchasing ${a('cannabis seeds', '/product-category/shop-all-cannabis-seeds')} from Royal King Seeds allows residents to build a seed collection and be prepared for any future changes in cultivation rights. Browse our ${CL.best} to explore proven genetics from our catalog.</p>`;

  const content = `
${pick(slug, openings)}
${legalStatusTable(st, sn)}
${recSection}
${growingConditionsChart(st, sn)}
${cultivationSection}
${penaltyChart(st, sn)}
${purchasingSection}
${comparisonToNeighborStates(sn, slug)}
${travelSection}
${futureSection}
<h2>Key Takeaways</h2>
<div style="margin:1.5em 0;padding:20px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px">
<ul style="margin:0;padding:0 0 0 20px;line-height:2">
<li>${sn} ${st.rec ? 'has legalized recreational and medical cannabis' : st.med ? 'allows medical marijuana but not recreational use' : 'has not legalized marijuana for medical or recreational use'} as of 2026</li>
<li>${st.plants > 0 ? `Home cultivation is permitted with a limit of ${st.plants} plants` : 'Home cultivation is not currently allowed'}</li>
<li>Cannabis seeds can be purchased for ${st.plants > 0 ? 'legal cultivation and' : ''} collection purposes from ${a('Royal King Seeds', '/product-category/shop-all-cannabis-seeds')}</li>
<li>${sn}'s ${st.climate} climate (zones ${st.zone}) favors ${pick(slug, ['indica-dominant', 'fast-finishing autoflower', 'heat-resistant', 'cold-hardy'], 'takeaway')} genetics for outdoor growing</li>
<li>See our ${iLinks[0]} guide for strain-specific recommendations</li>
</ul>
</div>`;

  const metaDesc = `${sn} marijuana laws in 2026: ${st.rec ? 'Recreational and medical cannabis are legal' : st.med ? 'Medical marijuana is legal, recreational is not' : 'Cannabis is not legal'}. Possession limits, home grow rules, penalties, and where to buy seeds.`;

  return { content, metaTitle: title.replace(/202[0-5]/, '2026') + ' | Royal King Seeds', metaDesc };
}

function generateTop10Page(slug, title, state, st) {
  const sn = stateName(state);
  const strains = st.bestStrains;
  const h = hash(slug);

  const openings = [
    `Selecting cannabis seeds for ${sn}'s growing environment requires understanding how the state's ${st.climate} climate, USDA zones ${st.zone}, and ${st.season} growing season interact with specific plant genetics. The strains that perform well here share certain characteristics — they have been bred or selected to handle the temperature ranges, humidity levels, and day-length patterns that ${sn} growers encounter.`,
    `Growing cannabis in ${sn} presents a specific set of environmental variables that not every strain handles equally well. The ${st.climate} climate across zones ${st.zone} creates growing conditions that reward some genetics and punish others. This breakdown covers the cultivars that ${sn}-based growers have found most reliable through actual cultivation experience.`,
    `The gap between a successful cannabis harvest in ${sn} and a failed one often comes down to strain selection. The ${st.climate} climate here — with outdoor seasons running ${st.season} and hardiness zones spanning ${st.zone} — filters out genetics that need longer seasons, different humidity profiles, or temperature ranges that ${sn} simply does not provide.`,
  ];

  let strainSections = '';
  const strainDescriptions = {
    'Blue Dream': { type: 'Sativa-dominant Hybrid', thc: '21-28%', flower: '9-10 weeks', desc: 'blends Blueberry indica with Haze sativa genetics, producing plants that grow vigorously in warm climates while delivering a balanced cerebral and body effect. The strain handles humidity better than many sativa-dominant varieties, which matters in states with summer moisture. Expect yields of 400-600g/m² indoors or 500-700g per plant outdoors in optimal conditions.' },
    'Girl Scout Cookies': { type: 'Hybrid (60/40 Indica)', thc: '25-28%', flower: '9-10 weeks', desc: 'delivers dense, trichome-heavy buds with a complex terpene profile mixing sweet, earthy, and minty notes. The compact structure handles wind well and the indica dominance means faster finishing times than pure sativas. GSC responds well to topping and SCROG training, producing an even canopy that maximizes light exposure.' },
    'Northern Lights': { type: 'Pure Indica', thc: '16-21%', flower: '7-8 weeks', desc: 'remains one of the most forgiving strains for growers in challenging climates. The compact indica structure resists mold, finishes fast enough to beat early frost in short-season states, and produces reliable yields without demanding advanced growing techniques. Northern Lights has been a foundation strain in breeding programs for decades precisely because of this reliability.' },
    'White Widow': { type: 'Balanced Hybrid', thc: '18-25%', flower: '8-9 weeks', desc: 'thrives across diverse US climates due to its Dutch breeding heritage, which selected for resilience in variable weather. The resin production is exceptional, making it suitable for both flower consumption and extraction. White Widow performs well in both soil and hydroponic setups and handles temperature fluctuations better than most hybrids.' },
    'Gorilla Glue #4': { type: 'Hybrid (60/40 Indica)', thc: '25-30%', flower: '8-9 weeks', desc: 'produces some of the highest THC levels in commercially available genetics, with resin production so heavy that branches become sticky during late flower. The plant structure is manageable — not too tall, not too bushy — and it handles feeding aggressively without the nutrient sensitivity that some high-THC strains display.' },
    'Sour Diesel': { type: 'Sativa-dominant (70/30)', thc: '20-25%', flower: '10-11 weeks', desc: 'demands a longer growing season but rewards patient growers with heavy yields and a unique fuel-forward terpene profile. The tall growth pattern requires either outdoor space or indoor training (topping, LST) to manage height. Sour Diesel prefers lower humidity during flower and benefits from supplemental support as heavy colas develop.' },
    'OG Kush': { type: 'Hybrid (55/45 Indica)', thc: '20-26%', flower: '8-9 weeks', desc: 'performs exceptionally well in warm, dry climates and has become the backbone of West Coast cannabis genetics. The terpene profile — earthy, pine, fuel — reflects its complex lineage. OG Kush is moderately challenging to grow, preferring consistent feeding schedules and lower humidity during flowering.' },
    'Auto Blueberry': { type: 'Autoflower Indica', thc: '15-20%', flower: '8-10 weeks from seed', desc: 'combines the classic Blueberry flavor profile with autoflowering convenience, finishing from seed to harvest in approximately 10 weeks regardless of light schedule. This makes it ideal for short-season states or growers who want multiple harvests per outdoor season. The compact size (60-100cm) suits balcony and small-space grows.' },
    'ACDC': { type: 'CBD-dominant Hybrid', thc: '1-6% THC, 14-20% CBD', flower: '9-10 weeks', desc: 'produces high-CBD flower suited for users seeking therapeutic benefits without significant psychoactive effects. The 20:1 CBD-to-THC ratio makes ACDC one of the most consistent CBD cultivars available. It grows like a standard photoperiod plant and produces moderate yields of resin-coated flower.' },
    'Harlequin': { type: 'CBD Sativa (75/25)', thc: '4-7% THC, 8-15% CBD', flower: '8-9 weeks', desc: 'offers a balanced CBD-to-THC ratio that provides mild relaxation without strong psychoactive effects. The sativa-dominant structure produces tall plants suited for outdoor growing in warm climates. Harlequin is commonly chosen by medical users managing pain and anxiety.' },
    'Critical Mass': { type: 'Indica-dominant (80/20)', thc: '19-22%', flower: '7-8 weeks', desc: 'earns its name from the extremely heavy buds it produces — so heavy that branches often need support during late flower. This fast-finishing indica handles cold climates well and delivers above-average yields for its compact size. Mold resistance is moderate, so airflow management matters during flower.' },
    'Amnesia Haze': { type: 'Sativa-dominant (80/20)', thc: '20-25%', flower: '10-12 weeks', desc: 'demands patience with its long flowering time but delivers exceptional sativa effects and heavy yields. The strong citrus and earthy terpene profile develops fully during the extended maturation period. Not recommended for short-season outdoor grows unless started early indoors.' },
    'Durban Poison': { type: 'Pure Sativa', thc: '15-25%', flower: '8-9 weeks', desc: 'is one of the few pure sativa landrace strains that finishes in under 10 weeks, making it suitable for outdoor growing in states with moderate-length seasons. The energetic, uplifting effect and sweet terpene profile have kept Durban Poison in high demand for decades.' },
    'Jack Herer': { type: 'Sativa-dominant (55/45)', thc: '18-24%', flower: '8-10 weeks', desc: 'balances sativa cerebral effects with manageable indica growth structure. Named after the cannabis activist and author, this strain produces well in most US climates and delivers consistent quality across different growing methods.' },
    'Purple Kush': { type: 'Pure Indica', thc: '17-27%', flower: '7-8 weeks', desc: 'develops its signature purple coloration when exposed to cooler nighttime temperatures during flower — a natural response that does not affect potency but produces visually striking buds. The heavy indica effects make it a nighttime strain for most users.' },
    'Super Lemon Haze': { type: 'Sativa-dominant (80/20)', thc: '20-25%', flower: '9-10 weeks', desc: 'combines Lemon Skunk with Super Silver Haze to produce a citrus-heavy terpene profile and energetic effects. The plant grows tall and responds well to training techniques that control height while maximizing light exposure to lower bud sites.' },
    'Gelato': { type: 'Hybrid (55/45 Indica)', thc: '20-25%', flower: '8-9 weeks', desc: 'delivers dense, colorful buds with a dessert-like terpene profile. The balanced effects suit both daytime and evening use depending on individual tolerance. Gelato prefers stable temperatures and moderate humidity — it performs best in controlled indoor environments but can succeed outdoors in mild climates.' },
    'Charlotte\'s Web': { type: 'CBD-dominant', thc: '<0.3% THC, 12-18% CBD', flower: '9-10 weeks', desc: 'was developed specifically for pediatric epilepsy treatment and remains one of the most recognized CBD strains globally. The extremely low THC content means it does not produce psychoactive effects. It grows like industrial hemp and produces moderate yields.' },
    'Cannatonic': { type: 'CBD Hybrid', thc: '3-6% THC, 6-17% CBD', flower: '9-10 weeks', desc: 'produces a roughly 1:1 CBD-to-THC ratio in many phenotypes, providing mild psychoactive effects alongside CBD benefits. The balanced cannabinoid profile makes it versatile for managing pain, inflammation, and anxiety.' },
    'Early Girl': { type: 'Indica-dominant', thc: '15-20%', flower: '7-8 weeks', desc: 'finishes faster than almost any commercially available photoperiod strain, making it the go-to choice for growers in short-season climates. The compact indica structure resists wind and cold better than most varieties. Yields are moderate but reliable.' },
    'Amnesia Haze Auto': { type: 'Autoflower Sativa', thc: '18-22%', flower: '10-12 weeks from seed', desc: 'brings the classic Amnesia Haze flavor and effect profile into an autoflowering format that eliminates light-schedule management. The longer autoflower timeline (compared to indica autos) reflects the sativa genetics but still finishes weeks faster than a photoperiod version.' },
    'Haze Berry': { type: 'Sativa-dominant (80/20)', thc: '20-24%', flower: '9-10 weeks', desc: 'merges Blueberry sweetness with Haze sativa structure and effects. The berry-forward terpene profile develops fully during a proper dry and cure. Suitable for growers with enough vertical space or training experience to manage sativa height.' },
    'Pineapple Express': { type: 'Sativa-dominant Hybrid', thc: '18-25%', flower: '7-8 weeks', desc: 'finishes quickly for a sativa-dominant hybrid, producing tropical-flavored buds with energetic effects. The manageable height and fast flowering make it accessible to newer growers who want sativa effects without sativa-length growing timelines.' },
    'Maui Wowie': { type: 'Sativa', thc: '13-19%', flower: '9-11 weeks', desc: 'is a classic Hawaiian landrace that thrives in tropical and subtropical conditions. The light, uplifting effects and pineapple-citrus flavors reflect the strain\'s island origin. It performs best in warm, humid environments that mirror its native habitat.' },
    'Kona Gold': { type: 'Pure Sativa', thc: '16-20%', flower: '11-12 weeks', desc: 'is a legendary Hawaiian sativa that demands a long, warm growing season. The cerebral effects and coffee-chocolate terpene notes make it unique, but the extended flowering time limits where it can be grown outdoors.' },
    'Tangie': { type: 'Sativa-dominant (70/30)', thc: '19-22%', flower: '9-10 weeks', desc: 'delivers the most intensely citrus terpene profile of any commercially available strain. The mandarin orange flavor comes from a dominant limonene profile. Tangie grows tall and prefers warm, dry conditions during flower.' },
    'Auto Critical': { type: 'Autoflower Indica', thc: '14-18%', flower: '8-9 weeks from seed', desc: 'produces heavy indica buds on a compact autoflower frame, finishing from seed to harvest in about 9 weeks. The ease of growing and consistent yields make it a reliable choice for beginners and experienced growers running multiple cycles per season.' },
    'Blueberry': { type: 'Indica-dominant (80/20)', thc: '17-24%', flower: '8-9 weeks', desc: 'develops distinct blueberry flavors and often shows purple coloration during late flower. The relaxing indica effects and fruity terpene profile have kept this strain in continuous demand since its creation in the 1970s by DJ Short.' },
  };

  strains.forEach((strain, i) => {
    const desc = strainDescriptions[strain] || { type: 'Hybrid', thc: '18-24%', flower: '8-10 weeks', desc: 'delivers reliable performance across diverse growing environments with consistent potency and yield characteristics.' };
    strainSections += `
<h3>${i + 1}. ${strain}</h3>
<p><strong>Type:</strong> ${desc.type} | <strong>THC:</strong> ${desc.thc} | <strong>Flower Time:</strong> ${desc.flower}</p>
<p>${strain} ${desc.desc}</p>
<p>In ${sn}'s ${st.climate} climate (zones ${st.zone}), ${strain} ${pick(slug, [
      `benefits from the ${st.season} growing window, with enough warm days to reach full maturity before temperatures drop`,
      `pairs well with the local conditions — growers who start seeds indoors in early spring and transplant after the last frost see the best results`,
      `handles ${sn}'s typical weather patterns without requiring unusual accommodations, though monitoring humidity during late flower prevents mold issues`,
      `performs consistently when given basic attention to watering schedules and nutrient timing that align with the local growing calendar`,
    ], 'strain' + i)}.</p>`;
  });

  const content = `
${pick(slug, openings)}
${growingConditionsChart(st, sn)}
${top5StrainsTable(st, sn)}
${strainSections}
<h2>Growing Tips for ${sn}</h2>
<p>The ${st.climate} climate in ${sn} creates specific growing considerations that apply regardless of which strain you choose. ${pick(slug, [
    `Outdoor growers should plan their seed-starting timeline around the ${st.season} season, with indoor germination beginning 2-4 weeks before the expected last frost date for your specific zone within the ${st.zone} range.`,
    `Whether growing indoors or outdoors, ${sn}'s conditions favor growers who pay attention to humidity management during flower. The ${st.climate} climate can create mold pressure during dense bud development if airflow is inadequate.`,
    `Starting with quality genetics makes a measurable difference in outcomes. The strains listed above were selected because they have demonstrated resilience in conditions similar to ${sn}'s — not because they are the most popular on social media.`,
  ], 'tips')}</p>
<p>${st.plants > 0 ? `With ${sn}'s allowance of ${st.plants} plants, maximizing yield per plant becomes important. Training techniques like topping, LST (low-stress training), and SCROG (screen of green) can increase yields 30-50% compared to untrained plants growing naturally.` : `While home cultivation is not currently permitted in ${sn}, understanding the growing environment helps residents make informed decisions if laws change — and assists in selecting the right genetics for collection purposes.`}</p>
<p>For strain-specific growing guidance, explore our ${a('grow guides', '/blog')} covering germination through harvest. Check our page on ${a(`marijuana laws in ${sn}`, `/is-marijuana-legal-in-${state.replace(/\s+/g, '-')}`)} for current legal details, and browse our ${CL.all} to find the right seeds for your situation.</p>

<h2>Where to Buy Cannabis Seeds for ${sn}</h2>
<p>Royal King Seeds ships ${CL.fem}, ${CL.auto}, ${CL.ind}, ${CL.sat}, and ${CL.cbd} to ${sn} with discreet packaging and tracked delivery. Every seed comes with our germination guarantee, so you can start with confidence regardless of your experience level.</p>`;

  const metaDesc = `The ${strains.length} best cannabis seeds for growing in ${sn} in 2026. Strain details, growing tips, and where to buy — matched to ${sn}'s ${st.climate} climate and zones ${st.zone}.`;

  return { content, metaTitle: `Top ${strains.length} Cannabis Seeds in ${sn} 2026 | Royal King Seeds`, metaDesc };
}

function generateMedicalCardPage(slug, title, state, st) {
  const sn = stateName(state);

  if (!st.med && !st.medYear) {
    // State with no medical program
    return {
      content: `
<p>${sn} does not currently have a medical marijuana program, which means there is no process for obtaining a medical cannabis card in this state as of 2026. ${st.medNote}</p>
${legalStatusTable(st, sn)}
<h2>Current Status of Medical Cannabis in ${sn}</h2>
<p>Despite growing public support for medical marijuana across the United States, ${sn} has not established a framework for medical cannabis access. Residents seeking cannabis-based treatments currently have no state-sanctioned pathway to do so.</p>
<p>Legislative proposals have been introduced in recent sessions, but none have achieved the votes necessary to pass both chambers and receive the governor's signature. The political dynamics in ${sn} — including the positions of key committee chairs and the governor's stance — continue to shape the timeline for any potential medical cannabis program.</p>
${penaltyChart(st, sn)}
<h2>What ${sn} Residents Can Do</h2>
<p>While waiting for potential legislative changes, ${sn} residents can explore ${a('CBD products', '/product-category/cbd-strains')} that contain less than 0.3% THC, which are federally legal under the 2018 Farm Bill. CBD seeds and products offer some of the therapeutic benefits associated with cannabis without the legal complications in prohibition states.</p>
<p>Purchasing ${a('cannabis seeds', '/product-category/shop-all-cannabis-seeds')} for collection purposes is also an option. Seeds are sold as genetic preservation specimens and can be stored indefinitely for use if and when ${sn}'s laws change.</p>
${comparisonToNeighborStates(sn, slug)}
<h2>Neighboring State Programs</h2>
<p>Several states bordering ${sn} have established medical cannabis programs that offer potential models for future legislation. Understanding how neighboring states structured their programs — qualifying conditions, dispensary licensing, home cultivation rules — provides insight into what a ${sn} program might eventually look like.</p>
<p>Check our ${a(`full breakdown of ${sn}'s marijuana laws`, `/is-marijuana-legal-in-${state.replace(/\s+/g, '-')}`)} for additional context, and browse ${a(`recommended seeds for ${sn}`, `/top-10-cannabis-seeds-in-${state.replace(/\s+/g, '-')}`)} to explore genetics suited to the local growing environment.</p>`,
      metaTitle: `Medical Marijuana Card in ${sn} — 2026 Guide | Royal King Seeds`,
      metaDesc: `How to get a medical marijuana card in ${sn}: current status, qualifying conditions, and alternatives as of 2026. ${sn} ${st.med ? 'has a medical cannabis program' : 'does not yet have a medical program'}.`,
    };
  }

  const qualifyingConditions = pick(slug, [
    'Cancer, epilepsy, PTSD, chronic pain, multiple sclerosis, Crohn\'s disease, terminal illness, and other debilitating conditions as determined by a qualifying physician.',
    'Qualifying conditions typically include cancer, seizure disorders, chronic or debilitating pain, PTSD, multiple sclerosis, ALS, and other conditions approved by the state health department.',
    'The qualifying condition list includes cancer, glaucoma, HIV/AIDS, Crohn\'s disease, epilepsy/seizures, chronic pain, PTSD, and in some cases conditions recommended by a treating physician.',
  ], 'conditions');

  return {
    content: `
<p>Obtaining a medical marijuana card in ${sn} involves a specific process that begins with a qualifying medical condition and a physician's recommendation. As of 2026, ${sn}'s medical cannabis program ${st.medYear ? `has been operating since ${st.medYear}` : 'is in its early implementation phase'}, with established pathways for patient registration and dispensary access.</p>
${legalStatusTable(st, sn)}
<h2>Step-by-Step Process</h2>
<div style="margin:1.5em 0;padding:20px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px">
<h4 style="margin:0 0 12px;color:#275C53">How to Get Your Medical Cannabis Card in ${sn}</h4>
<ol style="margin:0;padding:0 0 0 24px;line-height:2.2;font-size:14px">
<li><strong>Determine eligibility</strong> — Confirm you have a qualifying medical condition and are a ${sn} resident</li>
<li><strong>Gather medical records</strong> — Collect documentation of your diagnosis and treatment history</li>
<li><strong>See a qualifying physician</strong> — Schedule an appointment with a doctor registered in ${sn}'s medical cannabis program</li>
<li><strong>Obtain a written certification</strong> — The physician will provide a recommendation if they determine cannabis may benefit your condition</li>
<li><strong>Submit your application</strong> — Register through ${sn}'s state health department portal with your certification and required documents</li>
<li><strong>Pay the registration fee</strong> — Fees vary but typically range from $25-$200 depending on the state</li>
<li><strong>Receive your card</strong> — Processing times range from 1-6 weeks depending on application volume</li>
<li><strong>Visit a licensed dispensary</strong> — Present your card to purchase approved cannabis products</li>
</ol>
</div>

<h2>Qualifying Conditions</h2>
<p>${qualifyingConditions}</p>
<p>Some states periodically update their qualifying condition lists through regulatory processes rather than legislative action, so the conditions listed above may have expanded since the program's inception.</p>

<h2>Medical Program Details</h2>
<p>${st.medNote}</p>
<p>Medical patients in ${sn} have access to ${st.possess ? `possession limits of ${st.possess}` : 'products available through licensed dispensaries'}. ${st.plants > 0 ? `Patients may also grow up to ${st.plants} plants for personal medical use.` : 'Home cultivation is not currently permitted for medical patients.'}</p>

${penaltyChart(st, sn)}
${growingConditionsChart(st, sn)}

<h2>Cannabis Seeds for ${sn} Medical Patients</h2>
<p>${st.plants > 0 ? `Medical patients in ${sn} can grow their own cannabis, and starting from quality seeds ensures consistent results. Our ${CL.cbd} are popular with medical users, along with ${CL.ind} for pain management and ${CL.all} for exploring different therapeutic profiles.` : `While home cultivation is not currently permitted in ${sn}, medical patients interested in cannabis genetics can explore our ${CL.cbd} and ${CL.all} for collection and future use.`}</p>
<p>For complete legal details, see our ${a(`${sn} marijuana laws guide`, `/is-marijuana-legal-in-${state.replace(/\s+/g, '-')}`)}. For strain recommendations, check our ${a(`Top 10 seeds for ${sn}`, `/top-10-cannabis-seeds-in-${state.replace(/\s+/g, '-')}`)}.</p>

${comparisonToNeighborStates(sn, slug)}`,
    metaTitle: `How to Get a Medical Marijuana Card in ${sn} — 2026 Guide | Royal King Seeds`,
    metaDesc: `Step-by-step guide to getting a medical marijuana card in ${sn} in 2026. Qualifying conditions, application process, fees, and where to buy cannabis seeds.`,
  };
}

function generateSeedBuyingPage(slug, title, state, st) {
  const sn = stateName(state);
  return {
    content: `
<p>Buying marijuana seeds in ${sn} is straightforward when you understand the legal framework, seed types available, and what to look for in a reputable seed bank. As of 2026, cannabis seeds are shipped to ${sn} as collector items and genetic preservation specimens, with ${st.plants > 0 ? 'home cultivation permitted for qualifying individuals' : 'cultivation laws determined by state-level regulation'}.</p>
${legalStatusTable(st, sn)}
<h2>Seed Types Available for ${sn}</h2>
${top5StrainsTable(st, sn)}
<p>The three primary seed categories serve different growing approaches:</p>
<ul>
<li><strong>${CL.fem}</strong> — Produce only female (bud-producing) plants, eliminating the need to identify and remove males. Best for growers who want maximum usable yield from every plant.</li>
<li><strong>${CL.auto}</strong> — Flower based on plant age rather than light cycle, typically finishing in 8-12 weeks from seed. Ideal for ${sn}'s ${st.season} season and beginners who want a simplified growing process.</li>
<li><strong>${CL.cbd}</strong> — Produce flower with high CBD content and low THC, suited for therapeutic use without strong psychoactive effects.</li>
</ul>

<h2>Why Genetics Matter in ${sn}'s Climate</h2>
${growingConditionsChart(st, sn)}
<p>${sn}'s ${st.climate} climate across zones ${st.zone} creates specific growing conditions. Strains bred for similar environments produce better results than genetics developed for completely different climates. Our ${a(`Top 10 seeds for ${sn}`, `/top-10-cannabis-seeds-in-${state.replace(/\s+/g, '-')}`)} guide provides strain-by-strain breakdowns matched to local conditions.</p>

<h2>Ordering Seeds to ${sn}</h2>
<p>Royal King Seeds ships to all 50 states with discreet packaging, tracked delivery, and a germination guarantee. Every order is packaged in plain, unmarked packaging with no external indication of contents. Browse our ${CL.all} to explore over 1,200 strains available for delivery to ${sn}.</p>
<p>For legal context on cannabis in ${sn}, see our ${a(`marijuana laws guide`, `/is-marijuana-legal-in-${state.replace(/\s+/g, '-')}`)}.</p>
${comparisonToNeighborStates(sn, slug)}`,
    metaTitle: `Buy Marijuana Seeds in ${sn} — 2026 Guide | Royal King Seeds`,
    metaDesc: `Where to buy marijuana seeds in ${sn}: best strains, seed types, and shipping details for 2026. Discreet delivery to ${sn} with germination guarantee.`,
  };
}

function generateGrowingGuidePage(slug, title) {
  const h = hash(slug);
  // Extract location if present
  let state = extractState(slug);
  let sn = state ? stateName(state) : 'the United States';
  let st = state ? getStateData(state) : null;

  if (slug.includes('guide-to-buying-marijuana-seeds')) {
    return {
      content: `
<p>Purchasing marijuana seeds in the United States involves navigating a landscape of federal and state laws, seed bank options, and genetic choices. This guide covers the practical aspects of buying seeds in 2026 — from understanding seed types and quality indicators to choosing a seed bank and selecting strains that match your growing environment.</p>

<h2>Understanding Seed Types</h2>
<div style="overflow-x:auto;margin:1.5em 0">
<table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e5e7eb">
<caption style="font-weight:600;font-size:16px;padding:12px;background:#275C53;color:white;text-align:left">Cannabis Seed Types Comparison</caption>
<tr style="background:#f9fafb"><th style="padding:10px 14px;border:1px solid #e5e7eb;text-align:left">Seed Type</th><th style="padding:10px 14px;border:1px solid #e5e7eb;text-align:left">Advantages</th><th style="padding:10px 14px;border:1px solid #e5e7eb;text-align:left">Best For</th><th style="padding:10px 14px;border:1px solid #e5e7eb;text-align:left">Considerations</th></tr>
<tr><td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">Feminized</td><td style="padding:10px 14px;border:1px solid #e5e7eb">99%+ female plants, no males to remove</td><td style="padding:10px 14px;border:1px solid #e5e7eb">Growers focused on flower yield</td><td style="padding:10px 14px;border:1px solid #e5e7eb">Require light schedule management</td></tr>
<tr style="background:#f9fafb"><td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">Autoflower</td><td style="padding:10px 14px;border:1px solid #e5e7eb">Flower by age, faster harvest</td><td style="padding:10px 14px;border:1px solid #e5e7eb">Beginners, short seasons, stealth grows</td><td style="padding:10px 14px;border:1px solid #e5e7eb">Generally smaller yields than photos</td></tr>
<tr><td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">Regular</td><td style="padding:10px 14px;border:1px solid #e5e7eb">Natural genetics, breeding potential</td><td style="padding:10px 14px;border:1px solid #e5e7eb">Breeders, experienced growers</td><td style="padding:10px 14px;border:1px solid #e5e7eb">50/50 male/female ratio</td></tr>
<tr style="background:#f9fafb"><td style="padding:10px 14px;border:1px solid #e5e7eb;font-weight:600">CBD Seeds</td><td style="padding:10px 14px;border:1px solid #e5e7eb">High CBD, low THC therapeutic use</td><td style="padding:10px 14px;border:1px solid #e5e7eb">Medical patients, wellness users</td><td style="padding:10px 14px;border:1px solid #e5e7eb">Lower demand in recreational markets</td></tr>
</table>
</div>

<h2>Legal Landscape in 2026</h2>
<p>Cannabis seeds exist in a distinct legal category from marijuana plants and flower. Seeds are sold as collector items, genetic preservation specimens, and agricultural products. Royal King Seeds ships to all 50 states — browse our ${CL.all} for over 1,200 strains.</p>
<p>State laws on cultivation vary significantly. Some states allow home growing for recreational users, others limit cultivation to medical patients, and several prohibit all marijuana cultivation. Always verify your state's current laws before germinating seeds.</p>

<div style="margin:1.5em 0;padding:20px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px">
<h4 style="margin:0 0 12px;color:#1e40af">2026 Legal Status Snapshot</h4>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center">
<div style="background:white;padding:16px;border-radius:8px;border:1px solid #e5e7eb"><div style="font-size:28px;font-weight:700;color:#22c55e">24</div><div style="font-size:12px;color:#6b7280;margin-top:4px">States with Recreational</div></div>
<div style="background:white;padding:16px;border-radius:8px;border:1px solid #e5e7eb"><div style="font-size:28px;font-weight:700;color:#eab308">38</div><div style="font-size:12px;color:#6b7280;margin-top:4px">States with Medical</div></div>
<div style="background:white;padding:16px;border-radius:8px;border:1px solid #e5e7eb"><div style="font-size:28px;font-weight:700;color:#275C53">50</div><div style="font-size:12px;color:#6b7280;margin-top:4px">States We Ship To</div></div>
</div>
</div>

<h2>What to Look for in a Seed Bank</h2>
<p>The difference between a reliable seed bank and a questionable one shows up in germination rates, genetic accuracy, shipping reliability, and customer support. Here are the factors that matter:</p>
<ul>
<li><strong>Germination guarantee</strong> — Reputable banks stand behind their seeds. Royal King Seeds guarantees 92%+ germination rates.</li>
<li><strong>Genetic accuracy</strong> — The strain you order should be the strain you receive. This requires proper breeding practices and quality control.</li>
<li><strong>Discreet shipping</strong> — Plain packaging with no external indication of contents protects your privacy.</li>
<li><strong>Strain selection</strong> — A deep catalog means you can find genetics matched to your specific growing conditions.</li>
<li><strong>US-based operation</strong> — Domestic shipping avoids customs delays and international legal complications.</li>
</ul>

<h2>Choosing Strains for Your Climate</h2>
<p>The single biggest factor in growing success is matching your seed selection to your growing environment. A strain that produces 600g/m² in a Mediterranean climate may fail completely in a short-season northern state. Consider your USDA hardiness zone, outdoor season length, humidity levels, and whether you're growing indoors or outdoors.</p>
<p>Browse our state-specific guides for tailored recommendations: ${a('California seeds', '/top-10-cannabis-seeds-in-california')}, ${a('Florida seeds', '/top-10-cannabis-seeds-in-florida')}, ${a('Michigan seeds', '/top-10-cannabis-seeds-in-michigan')}, ${a('Colorado seeds', '/top-10-cannabis-seeds-in-colorado')}, and ${a('Texas seeds', '/top-10-cannabis-seeds-in-texas')}.</p>

<h2>Popular Categories</h2>
<p>Explore our most popular seed categories: ${CL.fem}, ${CL.auto}, ${CL.ind}, ${CL.sat}, ${CL.cbd}, ${CL.thc}, ${CL.kush}, and ${CL.outdoor}. Our ${CL.best} page highlights the strains with the highest customer satisfaction and reorder rates.</p>`,
      metaTitle: 'Guide to Buying Marijuana Seeds in the USA — 2026 | Royal King Seeds',
      metaDesc: 'Complete guide to buying cannabis seeds in the United States in 2026. Seed types, legal status, strain selection, and what to look for in a seed bank.',
    };
  }

  // Growing guide for a specific state (best seeds to grow in X, seeds that thrive in X)
  if (!st) {
    // Fallback for states we don't have data for
    return {
      content: `<p>${title} — content for this growing guide is being developed. Browse our ${CL.all} for strain recommendations, and check our ${a('blog', '/blog')} for growing tips.</p>`,
      metaTitle: title + ' | Royal King Seeds',
      metaDesc: title,
    };
  }

  return generateTop10Page(slug, title, state, st);
}

// ── Main execution ──
async function main() {
  console.log('Fetching static pages...');

  // Fetch all static pages
  let allPages = [];
  let offset = 0;
  const limit = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('pages')
      .select('id, slug, title, page_type, status')
      .eq('page_type', 'page')
      .eq('status', 'published')
      .order('slug')
      .range(offset, offset + limit - 1);
    if (error) { console.error(error); return; }
    allPages = allPages.concat(data);
    if (data.length < limit) break;
    offset += limit;
  }

  // Filter: exclude buy-cannabis pages, utility pages
  const excludeSlugs = ['affiliate', 'contact', 'faq', 'legal', 'privacy', 'refund-returns', 'shipping', 'terms'];
  const pages = allPages.filter(p => {
    if (excludeSlugs.includes(p.slug)) return false;
    if (p.slug.startsWith('buy-cannabis')) return false;
    return true;
  });

  console.log(`Found ${pages.length} pages to rewrite`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const page of pages) {
    const type = detectPageType(page.slug, page.title);
    const state = extractState(page.slug);
    const st = state ? getStateData(state) : null;

    let result;
    try {
      switch (type) {
        case 'legal':
          if (!st) { console.log(`SKIP (no state data): ${page.slug}`); skipped++; continue; }
          result = generateLegalPage(page.slug, page.title, state, st);
          break;
        case 'top10':
          if (!st) { console.log(`SKIP (no state data): ${page.slug}`); skipped++; continue; }
          result = generateTop10Page(page.slug, page.title, state, st);
          break;
        case 'medical-card':
          if (!st) { console.log(`SKIP (no state data): ${page.slug}`); skipped++; continue; }
          result = generateMedicalCardPage(page.slug, page.title, state, st);
          break;
        case 'seed-buying':
          if (!st) { console.log(`SKIP (no state data): ${page.slug}`); skipped++; continue; }
          result = generateSeedBuyingPage(page.slug, page.title, state, st);
          break;
        case 'growing-guide':
          result = generateGrowingGuidePage(page.slug, page.title);
          break;
        default:
          console.log(`SKIP (unknown type): ${page.slug}`);
          skipped++;
          continue;
      }

      // Update title to replace old years with 2026
      let newTitle = page.title.replace(/202[0-5]/g, '2026');
      // Also update slug years in title if needed
      if (newTitle === page.title && /\d{4}/.test(page.title)) {
        newTitle = page.title; // Keep original if no old year found
      }

      // Update in database
      const { error: updateError } = await supabase
        .from('pages')
        .update({
          content: result.content,
          meta_title: result.metaTitle,
          meta_description: result.metaDesc,
          title: newTitle,
          updated_at: new Date().toISOString(),
        })
        .eq('id', page.id);

      if (updateError) {
        console.error(`ERROR updating ${page.slug}:`, updateError.message);
        errors++;
      } else {
        updated++;
        console.log(`✓ Updated: ${page.slug} (${type})`);
      }
    } catch (e) {
      console.error(`ERROR processing ${page.slug}:`, e.message);
      errors++;
    }
  }

  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors}`);
}

main();
