#!/usr/bin/env python3
"""
Add autoflower products from CSV list.
- Creates new auto products based on feminized templates
- Adds SKUs to existing autos
- Ensures all are published with proper auto naming
"""

import json
import re
import copy
from datetime import datetime

# Load existing products
with open('src/lib/products/products-ca-raw.json') as f:
    products = json.load(f)

by_slug = {p['slug']: p for p in products}
max_id = max(p['id'] for p in products)

# CSV data: Name -> SKU
csv_raw = """3 Kings Cannabis Seeds,RKV1K16304-10-02
Blue Amnesia Cannabis Seeds,RKS1D20121-02-04
24k Gold Cannabis Seeds,RK9UG20893-06-14
3X Crazy Cannabis Seeds,RK1KW20907-09-06
5th Element Cannabis Seeds,RKY4P20924-06-04
A-10 Cannabis Seeds,RK3C720949-01-06
Ace Killer OG Cannabis Seeds,RK2IS20971-09-14
Abusive OG Cannabis Seeds,RKTEN20982-06-04
Afghan Big Bud Cannabis Seeds,RKHVK21002-06-08
Ace of Spades Cannabis Seeds,RKUXE21008-06-04
Afghan Kush Cannabis Seeds,RKK1A21013-06-14
Afghan Skunk Cannabis Seeds,RK1YY21020-06-08
Afgooey Cannabis Seeds,RK94721026-06-06
Agent Orange Cannabis Seeds,RK9HN21039-06-16
AK-47 Cannabis Seeds,RK2BU21045-06-02
AK-48 Cannabis Seeds,RKKSZ21052-06-08
Alien Dawg Cannabis Seeds,RK18J21089-09-06
Alien Kush Cannabis Seeds,RKPMX21096-06-04
Alien Rock Candy Cannabis Seeds,RK7E221110-06-04
9 Pound Hammer Cannabis Seeds,RK6N221117-07-14
Afghani Cannabis Seeds,RK7ZU21124-06-14
American Haze Cannabis Seeds,RKXSS21139-06-16
Amnesia Cannabis Seeds,RK32M21145-06-02
Banana OG Cannabis Seeds,RKG8Y21164-06-14
Blackberry Kush Cannabis Seeds,RK9L821184-06-04
Blue Cheese Cannabis Seeds,RK6OO21194-06-04
Blueberry Kush Cannabis Seeds,RKP5921204-09-10
Bubba Kush Cannabis Seeds,RKMBD21224-06-14
Critical Kush Cannabis Seeds,RKJFR21299-06-06
Death Star Cannabis Seeds,RK7ZB21319-06-04
Durban Poison Cannabis Seeds,RKT7B21350-06-02
Jack Herer Cannabis Seeds,RK1IZ21522-06-08
LA Confidential Cannabis Seeds,RKCI321582-07-04
Larry OG Cannabis Seeds,RK72F21602-09-08
Mango Kush Cannabis Seeds,RKS8I21632-06-04
Mazar Cannabis Seeds,RK95S21688-06-08
NYC Diesel Cannabis Seeds,RKJ8O21728-06-16
Obama Kush Cannabis Seeds,RKL3H21738-09-06
OG Kush Cannabis Seeds,RKHRA21740-06-06
Purple Kush Cannabis Seeds,RKW9C21852-06-10
White Widow Cannabis Seeds,RKDLP22050-06-14
Afghan Cannabis Seeds,RK8YK22070-01-06
AK Cannabis Seeds,RKS3A22081-06-02
Blueberry Cannabis Seeds,RKQEC22091-06-08
Bubblegum Cannabis Seeds,RKP3G22101-06-14
Candy Kush Cannabis Seeds,RKPXR22111-01-04
Cheese Cannabis Seeds,RKI9822121-06-06
Cream Cannabis Seeds,RKYES22131-01-04
Gorilla Glue Cannabis Seeds,RKUD422151-06-14
Haze XL Cannabis Seeds,RK4IF22162-01-02
Kush XL Cannabis Seeds,RK64822182-01-06
Northern Lights Cannabis Seeds,RK68M22207-08-06
Pineapple Cannabis Seeds,RKH8322216-01-02
Skunk Cannabis Seeds,RK5RC22226-01-04
Sour Kush Cannabis Seeds,RKVTK22236-06-06
Acapulco Gold Cannabis Seeds,RKVLD22358-07-02
Blue Dream Cannabis Seeds,RKQ1422368-07-16
A-Train Cannabis Seeds,RKOKU23021-06-14
LSD Cannabis Seeds,RKZ1K23658-01-06
Bruce Banner #3 Cannabis Seeds,RKKTV23664-01-16
Pink Bubba Cannabis Seeds,RKY3A23757-06-08
Godfather OG Cannabis Seeds,RK47K23909-06-16
THC Bomb Cannabis Seeds,RK81L23930-06-14
Banana Kush Cannabis Seeds,RKAWH23958-06-14
Orange Bud Cannabis Seeds,RK78C24006-06-16
Lemon OG Kush Cannabis Seeds,RKUT424167-01-08
CBD Solomatic Cannabis Seeds,RKLS424935-06-12
Amherst Diesel Cannabis Seeds,RKUH125702-06-16
Dank Sinatra Cannabis Seeds,RKWGY25788-06-08
Crouching Tiger Hidden Alien Cannabis Seeds,RKA2125795-06-04
El Chapo OG Cannabis Seeds,RKK2225810-06-08
Cream Caramel Cannabis Seeds,RK13B25815-06-04
Grease Monkey Cannabis Seeds,RKS6525887-06-14
White Fire OG Cannabis Seeds,RKESQ25892-06-08
Maui Wowie Cannabis Seeds,RK9H625903-09-02
Ghost Train Haze Cannabis Seeds,RK2M925946-06-04
Alien Bubba Cannabis Seeds,RKJLF25983-01-08
Willys Wonder Cannabis Seeds,RKL1Y26172-10-06
Tyson Cannabis Seeds,RKHYM26181-01-14
Alien Rift Cannabis Seeds,RKR7J26191-01-06
Death Bubba Cannabis Seeds,RK4OA26207-06-14
Strawberry Cheesecake Cannabis Seeds,RK16N26216-06-04
Purple Punch Cannabis Seeds,RKGZO26230-01-10
Blue Knight Cannabis Seeds,RK7R226337-06-07-04
Fucking Incredible Cannabis Seeds,RKDC226353-06-08
Amnesia Haze Cannabis Seeds,RKZ5R26519-06-02
Exodus Cheese Cannabis Seeds,RKFT826538-01-06
American Kush Cannabis Seeds,RKN2626543-01-04
White Fire 43 Cannabis Seeds,RK2M926766-01-06
Yumboldt Cannabis Seeds,RKP5R26771-01-08
Phantom Cookies Cannabis Seeds,RKJLB26975-06-16
Old School OG Cannabis Seeds,RK7WM26985-06-06
Maui Pineapple Chunk Cannabis Seeds,RKHWG26995-06-04
Mob Boss Cannabis Seeds,RKSEG27004-01-06
Medicine Man Cannabis Seeds,RK2X827009-06-14
Island Sweet Skunk Cannabis Seeds,RK2Q427020-06-08
Black Mamba Cannabis Seeds,RK36I27276-06-14
Tangerine Dream Cannabis Seeds,RKQ2827290-09-08
Big Devil Cannabis Seeds,RK6LJ2729631-05-08
Blue Mango Cannabis Seeds,RKHFV2729643-05-04
California Orange Cannabis Seeds,RK93A2729666-05-16
Cherry Kush Cannabis Seeds,RKG2M2729678-05-04
Lemon Cannabis Seeds,RK5312729733-05-08
Magnum Cannabis Seeds,RKYO32729745-05-04
Mandarin Cannabis Seeds,RKT422729751-05-02
Critical Fast Bud Cannabis Seeds,RK25U2729757-05-08
Lowryder Cannabis Seeds,RKAVA2729763-05-08
Maxi Gom Cannabis Seeds,RK3832729775-06-04
Tahoe OG Kush Cannabis Seeds,RKTL82729782-06-04
Sweet Tooth Cannabis Seeds,RKFV32729789-10-16
Pineapple Mayhem Cannabis Seeds,RKP762729795-06-14
Purple Monkey Balls Cannabis Seeds,RKX452729941-05-10
Purple Skunk Cannabis Seeds,RKE432730011-05-10
Lemon Drop Cannabis Seeds,RK22U2730017-05-02
Blue Kush Cannabis Seeds,RK6RW2730080-05-06
Critical Jack Cannabis Seeds,RKTR62730103-05-08
Big Buddha Cheese Cannabis Seeds,RKY9I2730109-05-06
Pure Kush Cannabis Seeds,RK3P62730227-05-04
Lavender Jones Cannabis Seeds,RKF892730238-05-10
Dream Queen Cannabis Seeds,RK9F52730323-05-02
Hindu Skunk Cannabis Seeds,RKNIC2730418-05-06
Platinum GSC Cannabis Seeds,RK8GX2730498-06-14
Purple Gorilla Cannabis Seeds,RKMO92730504-06-10
Sour Amnesia Cannabis Seeds,RKB8G2730547-05-02
Blue Haze Cannabis Seeds,RKCAZ2730573-05-14
Blueberry Haze Cannabis Seeds,RKVI52730579-05-02
Charlie Sheen Cannabis Seeds,RKPSB2730814-05-08
Burmese Kush Cannabis Seeds,RK4182730827-05-16
Cherry Diesel Cannabis Seeds,RKQP22730833-05-16
Gods Green Crack Cannabis Seeds,RKSC72730845-05-16
Purple Sour Diesel Cannabis Seeds,RKQ8N2730912-05-10
Hashberry Cannabis Seeds,RKW4O2730948-05-16
Lucid Dream Kush Cannabis Seeds,RK1V52730971-05-16
Mickey Kush Cannabis Seeds,RKMDM2730977-05-06
Pitbull Pit Cannabis Seeds,RKPR92730983-05-06
Sage N Sour Cannabis Seeds,RKK122730995-05-16
Strawberry Haze Cannabis Seeds,RKO492731001-05-16
Euforia Cannabis Seeds,RKOO12731046-05-02
Kandy Kush Cannabis Seeds,RKV272731078-05-06
Nebula Cannabis Seeds,RK4482731105-05-02
Hash Plant Cannabis Seeds,RKB3E2731176-05-06
Jack Flash Cannabis Seeds,RK4G52731182-06-06
New Glue Cannabis Seeds,RK44V2731200-05-14
Quantum Kush Cannabis Seeds,RKO212731224-05-06
Corleone Kush Cannabis Seeds,RK9982731242-05-06
Dragonas Breath Cannabis Seeds,RK9PJ2731255-05-08
Jamaican Dream Cannabis Seeds,RKS952731261-05-16
Maui Cannabis Seeds,RKV562731273-05-02
Recon Cannabis Seeds,RK2X72731300-05-08
Tangerine Haze Cannabis Seeds,RK8WN2731312-05-02
Wonder Woman Cannabis Seeds,RKA3K2731324-05-02
Dairy Queen Cannabis Seeds,RK12W2731402-05-02
Hawaiian Cannabis Seeds,RK91E2731426-05-04
LA Woman Cannabis Seeds,RKIGH2731493-05-08
OG Diesel Kush Cannabis Seeds,RK5852731512-05-02
Raspberry Cough Kush Cannabis Seeds,RKU952731532-05-08
Violator Kush Cannabis Seeds,RKHVN2731552-05-04
Glass Slipper Cannabis Seeds,RK86J2731570-05-16
Killer Queen Cannabis Seeds,RK9TH2731589-05-04
Nuken Cannabis Seeds,RKSQ22731609-05-14
Red Congolese Cannabis Seeds,RKMFE2731731-05-16
White Lightning Cannabis Seeds,RKPC52731841-06-08
Jager Cannabis Seeds,RKSKL2731885-06-14
White Nightmare Cannabis Seeds,RKILQ2731933-06-16
Jupiter OG Cannabis Seeds,RK2RB2731968-05-08
Master Yoda Cannabis Seeds,RKNDZ2731987-05-04
Ripped Bubba Cannabis Seeds,RKMN72732006-05-04
White Rhino Cannabis Seeds,RK67U2732026-05-06
Diamond OG Cannabis Seeds,RKLGK2732045-05-06
Kryptonite Cannabis Seeds,RK9JD2732061-05-08
Mazar I Sharif Cannabis Seeds,RK73Q2732076-05-14
Pineapple Kush Cannabis Seeds,RKB832732082-06-08
Thin Mint GSC Cannabis Seeds,RKOQI2732132-05-06
Cannalope Kush Cannabis Seeds,RKQ632732150-05-16
Hempstar Cannabis Seeds,RK5Y32732168-05-02
Mazar x Blueberry Cannabis Seeds,RK3S52732186-05-10
Shoreline Cannabis Seeds,RK22Y2732204-05-16
Afghani Bullrider Cannabis Seeds,RK5EW2732222-05-08
Golden Ticket Cannabis Seeds,RK7M42732234-05-16
Royal Kush Cannabis Seeds,RK3M82732259-05-06
FPOG Cannabis Seeds,RKL2R2732306-05-10
Silver Kush Cannabis Seeds,RKFZ82732365-05-06
Cataract Kush Cannabis Seeds,RK3912732386-05-14
Silverback Gorilla Cannabis Seeds,RK9CW2732418-05-14
Pre-98 Bubba Kush Cannabis Seeds,RKW5G2732436-05-08
Sister Glue Cannabis Seeds,RK8532732537-05-08
Dogwalker OG Cannabis Seeds,RK1AP2732551-05-06
Triangle Kush Cannabis Seeds,RKZHY2732575-05-04
Green Queen Cannabis Seeds,RKATZ2732587-04-02
Snow White Cannabis Seeds,RK6LC2732605-05-14
Dr. Who Cannabis Seeds,RKKPJ2732617-05-02
Power Kush Cannabis Seeds,RK2142732629-05-02
Tutti Frutti Cannabis Seeds,RKRRH2732773-05-02
Green Goblin Cannabis Seeds,RKAHC2732785-05-16
Sour Alien Cannabis Seeds,RK5762732809-05-14
Green Poison Cannabis Seeds,RKJRV2732827-05-04
Sour Apple Cannabis Seeds,RKR2R2732839-05-08
Green Ribbon Cannabis Seeds,RK6C82732857-05-06
Sour Cheese Cannabis Seeds,RKN332732875-05-02
Purple Afghani Cannabis Seeds,RKTJH2732976-05-10
Purple Alien OG Cannabis Seeds,RKP682732982-05-10
Purple Arrow Cannabis Seeds,RKQP42733001-05-10
Purple Berry Cannabis Seeds,RKR3X2733015-05-10
Purple Candy Cannabis Seeds,RKYUU2733033-05-10
Purple Chemdawg Cannabis Seeds,RKAXC2733045-05-04
Purple Dragon Cannabis Seeds,RK1972733065-05-10
Purple Dream Cannabis Seeds,RKX152733086-05-10
Purple Voodoo Cannabis Seeds,RKIUW2733337-06-10
Sugar Black Rose Cannabis Seeds,RKDZP2733368-05-14
Cookie Wreck Cannabis Seeds,RK2VN2733386-05-04
Super Jack Cannabis Seeds,RKN9K2733405-05-06
Superglue Cannabis Seeds,RK76H2733437-05-16
Sweet Diesel Cannabis Seeds,RKGC52733459-05-16
Crystal Coma Cannabis Seeds,RK3RK2733482-05-02
Dark Side of the Moon Cannabis Seeds,RK4432733495-04
Blue Dynamite Cannabis Seeds,RKS632733510-05-14
Money Maker Cannabis Seeds,RKC742733523-05-04
Purple Passion Cannabis Seeds,RKZ7Z2733583-05-10
Tuna Kush Cannabis Seeds,RK83B2733595-05-04
Snow Leopard Cannabis Seeds,RKVXV2733661-05-06
Pakistani Chitral Kush Cannabis Seeds,RKCM52733679-05-14
Space Dawg Cannabis Seeds,RK23N2733697-05-04
Crown OG Cannabis Seeds,RK5L92733733-05-08
Candy Cane Cannabis Seeds,RK5552733766-05-10
B-52 Cannabis Seeds,RKHLL2733784-05-14
U2 Kush Cannabis Seeds,RKMPZ2733796-05-14
Neptune OG Cannabis Seeds,RKGQ12733808-05-06
Sour Bubble Cannabis Seeds,RK59E2733818-06-14
Dream Berry Cannabis Seeds,RKHG62733832-05-04
Hawaiian Purple Kush Cannabis Seeds,RK7ZL2733851-05-10
Burkle Cannabis Seeds,RKXLY2733864-05-08
Grape Skunk Cannabis Seeds,RK4952733883-05-14
Purple Cotton Candy Cannabis Seeds,RKHMJ2734018-08-10
Gravity Cannabis Seeds,RKOPY2734024-05-04
Sensi Skunk Cannabis Seeds,RKH372734042-06-08
OGas Pearl Cannabis Seeds,RK5B72734073-05-08
Misty Kush Cannabis Seeds,RK3MU2734087-05-04
LA Ultra Cannabis Seeds,RKPM82734099-05-06
Black Bubba Cannabis Seeds,RK3PK2734118-05-14
Purple Star Cannabis Seeds,RK1C52734133-05-10
Grape Inferno Cannabis Seeds,RK4UY2734214-05-04
Grape Cookies Cannabis Seeds,RK21A2734226-05-04
Crown Royale Cannabis Seeds,RK39F2734244-06-10
Pluto Kush Cannabis Seeds,RKRH82734271-01-08
Blue Blood Cannabis Seeds,RKB552734278-06-06
Sweet Baby Jane Cannabis Seeds,RKD1X2734290-06-08
Green Love Potion Cannabis Seeds,RKKB72734304-08-08
The OX Cannabis Seeds,RK3DX2734323-06-14
Lee Roy Cannabis Seeds,RKBTK2734435-05-08
Motavation Cannabis Seeds,RKUK22734582-10-16
Jawa Pie Cannabis Seeds,RK2IL2734602-06-04
Super Bud Cannabis Seeds,RKC7L2734614-06-08
Quin-N-Tonic Cannabis Seeds,RKRA52734626-06-04
Neptune Kush Cannabis Seeds,RK5Y92734702-06-02
Supergirl Cannabis Seeds,RK5R62734734-06-14
Aliens On Moonshine Cannabis Seeds,RKZ522734740-06-08
Reclining Buddha Cannabis Seeds,RK6HJ2734876-06-06
Purple Martian Kush Cannabis Seeds,RK8KO2734882-09-10
Ayahuasca Purple Cannabis Seeds,RKBS12734888-06-10
Special Kush #1 Cannabis Seeds,RKQ1X2734894-06-14
Fruitylicious Cannabis Seeds,RK15U2734938-06-04
Triple Cheese Cannabis Seeds,RKZAV2734944-06-06
Faygo Red Pop Cannabis Seeds,RK8VI2734950-06-14
Blue Zombie Cannabis Seeds,RKO962734957-04
Pakistan Valley Kush Cannabis Seeds,RKS6N2734963-06-14
Illuminati OG Cannabis Seeds,RK11W2734969-04
Ogre Berry Cannabis Seeds,RKGOO2735031-06-14
XXX 420 Cannabis Seeds,RKU1T2735037-06-06
Hashbar OG Cannabis Seeds,RK2ZB2735044-06-06
Guido Kush Cannabis Seeds,RK7TA2735063-06-16
Rainbow Jones Cannabis Seeds,RK2H32735069-02
Fat Purple Cannabis Seeds,RKB7R2735114-06-10
Godas Treat Cannabis Seeds,RKGDG2735171-06-04
Dutch Kush Cannabis Seeds,RKRLP2735190-06-14
Sour Ape Cannabis Seeds,RKI4L2735205-06-06
Appleberry Cannabis Seeds,RKB932735268-04
Bakerstreet Cannabis Seeds,RKFZV2735281-08-14
Blue Ox Cannabis Seeds,RKUG72735303-09-14
Deadwood Cannabis Seeds,RK9B42735315-10-06
The Sister Cannabis Seeds,RK8Z42735322-06-08
Kahuna Cannabis Seeds,RKGQI2735341-06-14
Humboldt Dream Cannabis Seeds,RK5122735359-06-14
Paris XXX Cannabis Seeds,RKPF62735378-06-14
Casper OG Cannabis Seeds,RKI452735384-09-14
Jelly Roll Cannabis Seeds,RK77L2735390-06-04
West OG Cannabis Seeds,RKWKA2735409-06-04
Pure Love Cannabis Seeds,RKT942735415-06-04
G13 Widow Cannabis Seeds,RK1I12735517-06-08
Kali Dog Cannabis Seeds,RKMV22735546-06-16
Puna Budder Cannabis Seeds,RK1CO2735554-06-08
Sour Dubble Cannabis Seeds,RKO1Q2735566-06-16
Industrial Plant Cannabis Seeds,RK2ZD2735585-06-08
Tiger Woods Cannabis Seeds,RK4RH2735603-10-04
Killer Grape Cannabis Seeds,RKUA52735622-06-14
Tigermelon Cannabis Seeds,RK35G2735668-06-14
Reserve L.A.K. Federal Cannabis Seeds,RKJ3G2736461-06-06
Night Train Cannabis Seeds,RKIK92736468-06-16
Ortega Cannabis Seeds,RK5K32736480-06-14
Agent Tangie Cannabis Seeds,RKSXV2736486-06-16
Purple Sage Cannabis Seeds,RK61O2736561-06-10
Alien Reunion Cannabis Seeds,RK5UI2736580-10-16
Maui Haole Cannabis Seeds,RK4JV2736601-06-02
Turbo Mind Warp Cannabis Seeds,RKC5V2736625-06-02
China Yunnan Cannabis Seeds,RKE512736643-06-04
Dizzy OG Cannabis Seeds,RKU522736681-06-08
Godzilla Glue Cannabis Seeds,RK93Q2736764-06-14
Chupacabra Cannabis Seeds,RKQI92736784-06-06
Sweet Berry Cannabis Seeds,RK76N2736796-06-04
Damnesia Cannabis Seeds,RKPGI2736802-06-02
Mint Chocolate Chip Cannabis Seeds,RK3QK2736840-07-04
Lemon Daddy Cannabis Seeds,RKF572736907-06-16
Red Widow Cannabis Seeds,RK2RI2736960-08-14
Bear Dance Cannabis Seeds,RKIJH2736981-05-02
Dawgfather OG Cannabis Seeds,RKM862737001-06-02
Venus OG Cannabis Seeds,RKY762737019-06-02
Fruity Widow Cannabis Seeds,RKSPF2737031-06-08
Cheeseburger Cannabis Seeds,RK1JJ2737067-06-08
WTF Cannabis Seeds,RK2BJ2737085-06-14
L.A. Sunshine Cannabis Seeds,RK9MK2737103-06-14
Green Line OG Cannabis Seeds,RK3O42737133-06-02
Euphoria Cookies Cannabis Seeds,RKOKF2737145-08-06
Tembo Kush Cannabis Seeds,RKHDS2737189-04
Mandala #1 Cannabis Seeds,RK8TD2737196-06-06
Grape Soda Cannabis Seeds,RKZMQ2737204-06-04
Gupta Kush Cannabis Seeds,RK51V2737212-06-04
Queso Cannabis Seeds,RKQUX2737251-06-08
Guptilla Cannabis Seeds,RKM7A2737258-04
Blue Kiss Cannabis Seeds,RKAF92737297-06-06
Blue Galaxy Cannabis Seeds,RK8472737332-06-14
Six Shooter Cannabis Seeds,RK7FP2737344-06-14
Sweet Nina Cannabis Seeds,RK7892737362-06-02
Pop Rox Cannabis Seeds,RK12K2737454-09-04
Aberdeen Cannabis Seeds,RKJTN2737460-08-16
Grilled Cheese Cannabis Seeds,RK34J2737493-06-02
Blue Jay Way Cannabis Seeds,RK2HN2737512-06-14
Mean Misty Cannabis Seeds,RK3G92737536-06-16
Golden Nugget Cannabis Seeds,RKI6S2737577-06-08
Chocolate Chunk Cannabis Seeds,RK7X32737629-06-14
Smelliot Cannabis Seeds,RKUU62737655-06-16
Gatekeeper OG Cannabis Seeds,RKKEN2737688-06-16
Silverfalls Kush Cannabis Seeds,RKQS92737695-06-06
Remedy Cannabis Seeds,RKS6H2737816-04-04
Purple Nepal Candy Cannabis Seeds,RK1DR2738104-06-10
Big Band Cannabis Seeds,RKBWY2738184-09-04
Banana Cream OG Cannabis Seeds,RK9QK2738190-10-08
Dinachem Cannabis Seeds,RK8552738196-06-02
Hyper Critical Cannabis Seeds,RKW4X2743984-05-06
Blueberry Gusto Cannabis Seeds,RKV892744044-05-14
The Big Stink Cannabis Seeds,RKX292744079-04-06
Lemon Drizzle Cannabis Seeds,RKHUV2744178-05-06
Raisinberry Cannabis Seeds,RKWFA2744243-02
Blue Fruit Cannabis Seeds,RKPDQ2744295-05-06
Strawberry Cheese Cannabis Seeds,RKS182744376-05-06
Fruit Cannabis Seeds,RKPXT2744383-04-08
Black Jack Cannabis Seeds,RKZ7E2744404-05-14
Big Cheese Cannabis Seeds,RKJG32744418-05-08
Mandarine Cannabis Seeds,RKTGE2744491-04
Sticky Dickie Cannabis Seeds,RKQ5F2744588-03-04
Big Blue Cannabis Seeds,RKORS2744596-05-14
Wild Hog Cannabis Seeds,RK4K72744608-04-08
Critical Purple Cannabis Seeds,RKB9X2744620-05-10
Critical Glue Cannabis Seeds,RKTIC2744632-03-14
Candy Cream Cannabis Seeds,RKEGD2744650-05-04
Electric Blue Cannabis Seeds,RKZ772744662-03-04
Blue Jack City Cannabis Seeds,RKU562744668-05-04
Northern Cream Cannabis Seeds,RKHC12744705-04-02
Afghan Hawaiian Cannabis Seeds,RKP3J16305-06-06
Godzilla Cookies Cannabis Seeds,RKWI12758960-06-08
Purple Lemonade Cannabis Seeds,RKETC2759000-09-10
Gorilla Cookies Cannabis Seeds,RK4HA2759027-10-16
Strawberry Gorilla Cannabis Seeds,RKDG92759057-10-02
Cookies Gelato Cannabis Seeds,RK5PI2766639-06-14
Royal Gorilla Cannabis Seeds,RKA622766824-10-02
Mimosa Cannabis Seeds,RKUSM2766857-10-04
Pine Cannabis Seeds,RKZ782766895-05-06
NYC Sour Diesel Cannabis Seeds,RKLK62770420-01-16
Goatlato Cannabis Seeds,RKM8D2770450-01-14
Corkscrew Cannabis Seeds,RKTT92770484-01-16
Gelato Cake Cannabis Seeds,RK3752773339-06-16
Royal Cheese Cannabis Seeds,RKVNQ2774478-09-06
Green Crack Punch Cannabis Seeds,RKUO82774507-09-04
Sweet ZZ Cannabis Seeds,RK4GV2816136-06-04
Papaya Cookies Cannabis Seeds,RKY4G2821718-06
Wilson Cannabis Seeds,RK7712839655-02"""

# Manual slug overrides for names that don't derive cleanly
slug_overrides = {
    "AK-47": "ak-47-auto",
    "AK-48": "ak-48-auto",
    "A-10": "a-10-auto",
    "A-Train": "a-train-auto",
    "B-52": "b-52-auto",
    "Bruce Banner #3": "bruce-banner-3-auto",
    "Dragon\u2019s Breath": "dragon-s-breath-auto",
    "Dragonas Breath": "dragon-s-breath-auto",
    "God\u2019s Treat": "god-s-treat-auto",
    "Godas Treat": "god-s-treat-auto",
    "OG\u2019s Pearl": "og-s-pearl-auto",
    "OGas Pearl": "og-s-pearl-auto",
    "Willy\u2019s Wonder": "willy-s-wonder-auto",
    "Willys Wonder": "willy-s-wonder-auto",
    "Dr. Who": "dr-who-auto",
    "Special Kush #1": "special-kush-1-auto",
    "Mandala #1": "mandala-1-auto",
    "Reserve L.A.K. Federal": "reserve-l-a-k-federal-auto",
    "L.A. Sunshine": "l-a-sunshine-auto",
    "NYC Sour Diesel": "nyc-sour-diesel-auto",
    "NYC Diesel": "nyc-diesel-auto",
    "LA Confidential": "la-confidential-auto",
    "LA Woman": "la-woman-auto",
    "LA Ultra": "la-ultra-auto",
    "CBD Solomatic": "cbd-solomatic-auto",
    "Gorilla Glue": "gorilla-glue-auto",
    "Quin-N-Tonic": "quin-n-tonic-auto",
    "Thin Mint GSC": "thin-mint-gsc-auto",
    "Platinum GSC": "platinum-gsc-auto",
    "FPOG": "fpog-auto",
    "LSD": "lsd-auto",
    "Gods Green Crack": "god-s-green-crack-auto",
    "Mazar I Sharif": "mazar-i-sharif-auto",
    "Mazar x Blueberry": "mazar-x-blueberry-auto",
    "Pre-98 Bubba Kush": "pre-98-bubba-kush-auto",
    "XXX 420": "xxx-420-auto",
    "Critical Fast Bud": "critical-fast-bud-auto",
    "Sage N Sour": "sage-n-sour-auto",
    "3X Crazy": "3x-crazy-auto",
    "WTF": "wtf-auto",
    "Maxi Gom": "maxi-gom-auto",
    "Jack Flash": "jack-flash-auto",
    "Cannalope Kush": "cannalope-kush-auto",
}

# Feminized slug overrides (to find the template)
fem_slug_overrides = {
    "AK-47": "ak-47-feminized",
    "AK-48": "ak-48-feminized",
    "A-Train": "a-train-feminized",
    "B-52": "b-52-feminized",
    "Bruce Banner #3": "bruce-banner-3-feminized",
    "Dragon\u2019s Breath": "dragon-s-breath-feminized",
    "Dragonas Breath": "dragon-s-breath-auto",  # already exists as auto
    "God\u2019s Treat": "god-s-treat-feminized",
    "Godas Treat": "god-s-treat-feminized",
    "OG\u2019s Pearl": "og-s-pearl-feminized",
    "OGas Pearl": "og-s-pearl-feminized",
    "Willy\u2019s Wonder": "willy-s-wonder-auto",  # already exists as auto
    "Willys Wonder": "willy-s-wonder-auto",
    "Dr. Who": "dr-who-auto",  # already exists as auto
    "Special Kush #1": "special-kush-1-feminized",
    "Mandala #1": "mandala-1-feminized",
    "Reserve L.A.K. Federal": "reserve-l-a-k-federal-feminized",
    "L.A. Sunshine": "l-a-sunshine-feminized",
    "NYC Sour Diesel": "nyc-sour-diesel-feminized",
    "NYC Diesel": "nyc-diesel-feminized",
    "LA Confidential": "la-confidential-feminized",
    "LA Woman": "la-woman-auto",
    "LA Ultra": "la-ultra-feminized",
    "CBD Solomatic": "cbd-solomatic-feminized",
    "Gorilla Glue": "gorilla-glue-feminized",
    "Quin-N-Tonic": "quin-n-tonic-feminized",
    "Thin Mint GSC": "thin-mint-gsc-auto",
    "Platinum GSC": "platinum-gsc-feminized",
    "FPOG": "fpog-feminized",
    "LSD": "lsd-feminized",
    "Gods Green Crack": "god-s-green-crack-auto",
    "Mazar I Sharif": "mazar-i-sharif-feminized",
    "Mazar x Blueberry": "mazar-x-blueberry-feminized",
    "Pre-98 Bubba Kush": "pre-98-bubba-kush-feminized",
    "XXX 420": "xxx-420-feminized",
    "Critical Fast Bud": "critical-fast-bud-feminized",
    "Sage N Sour": "sage-n-sour-auto",
    "3X Crazy": "3x-crazy-feminized",
    "WTF": "wtf-feminized",
    "Maxi Gom": "maxi-gom-feminized",
    "Jack Flash": "jack-flash-feminized",
    "Cannalope Kush": "cannalope-kush-auto",
}


def name_to_slug(name, suffix="-auto"):
    """Convert strain name to slug"""
    s = name.lower()
    s = s.replace("'s", "-s").replace("\u2019s", "-s").replace("'", "").replace("\u2019", "")
    s = s.replace(".", "").replace("#", "").replace(",", "")
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'\s+', '-', s.strip())
    s = re.sub(r'-+', '-', s)
    return s + suffix


def find_fem_template(name):
    """Find feminized product to use as template"""
    if name in fem_slug_overrides:
        slug = fem_slug_overrides[name]
        return by_slug.get(slug)

    fem_slug = name_to_slug(name, "-feminized")
    return by_slug.get(fem_slug)


def make_auto_name(base_name):
    """Create proper auto product name"""
    return f"{base_name} Auto"


def make_auto_categories(fem_cats):
    """Convert feminized categories to auto categories"""
    auto_cats = []
    for c in fem_cats:
        if c == 'feminized-seeds':
            auto_cats.append('autoflowering-seeds')
        elif 'feminized' in c:
            auto_cats.append(c.replace('feminized', 'auto-flowering'))
        else:
            auto_cats.append(c)
    if 'autoflowering-seeds' not in auto_cats:
        auto_cats.append('autoflowering-seeds')
    if 'shop-all-cannabis-seeds' not in auto_cats:
        auto_cats.append('shop-all-cannabis-seeds')
    return auto_cats


def create_auto_product(base_name, sku, template, new_id):
    """Create a new auto product from feminized template or from scratch"""
    auto_slug = slug_overrides.get(base_name) or name_to_slug(base_name)
    auto_name = make_auto_name(base_name)

    now = datetime.utcnow().isoformat() + "+00:00"

    if template:
        product = copy.deepcopy(template)
        product['id'] = new_id
        product['slug'] = auto_slug
        product['name'] = auto_name
        product['autoflower'] = True
        product['feminized'] = True  # Autos are also feminized
        product['status'] = 'published'
        product['sku'] = sku
        product['categories'] = make_auto_categories(template.get('categories', []))
        product['created_at'] = now
        product['updated_at'] = now
        # Clear image - will use dynamic generation or leaf placeholder
        # Keep image if template has one, user said they'll add images later
        product['image_url'] = ''
        # Update meta
        product['meta_title'] = f"Buy {auto_name} Cannabis Seeds Online USA | Royal King Seeds"
        product['meta_description'] = f"Buy {auto_name} cannabis seeds in the USA. Autoflowering · {template.get('thc_content', '20%')} THC · Fast seed-to-harvest. Free shipping over $99. Germination guaranteed."
    else:
        # Create from scratch
        product = {
            'id': new_id,
            'slug': auto_slug,
            'name': auto_name,
            'description': '',  # Will be dynamically generated by product-engine
            'short_description': f"Buy {auto_name} cannabis seeds online in the USA. Autoflowering strain with fast 8-10 week seed-to-harvest cycle. Discreet shipping to all 50 states.",
            'categories': ['shop-all-cannabis-seeds', 'autoflowering-seeds'],
            'strain_type': 'hybrid',
            'thc_content': '20%',
            'indica_percent': 50,
            'sativa_percent': 50,
            'effects': ['Relaxed', 'Happy', 'Euphoric'],
            'flavors': [],
            'best_use': '["Anytime","Relaxation"]',
            'price': 36.97,
            'sale_price': None,
            'seed_options': [
                {"label": "3 Seeds", "price": 36.97},
                {"label": "5 Seeds", "price": 52.96},
                {"label": "10 Seeds", "price": 99.91},
                {"label": "15 Seeds", "price": 119.99},
                {"label": "25 Seeds", "price": 198.85}
            ],
            'feminized': True,
            'autoflower': True,
            'in_stock': True,
            'image_url': '',
            'status': 'published',
            'flowering_time': '',
            'plant_height': '',
            'indoor_yield': '',
            'outdoor_yield': '',
            'difficulty': 'beginner',
            'created_at': now,
            'updated_at': now,
            'stock_quantity': 9999,
            'low_stock_threshold': 10,
            'sku': sku,
            'meta_title': f"Buy {auto_name} Cannabis Seeds Online USA | Royal King Seeds",
            'meta_description': f"Buy {auto_name} cannabis seeds in the USA. Autoflowering · Fast seed-to-harvest. Free shipping over $99. Germination guaranteed.",
            'weight': 0
        }

    return product


# Parse CSV
csv_items = []
for line in csv_raw.strip().split('\n'):
    parts = line.rsplit(',', 1)
    name = parts[0].replace(' Cannabis Seeds', '').strip()
    sku = parts[1].strip()
    csv_items.append((name, sku))

print(f"CSV items: {len(csv_items)}")

# Process each item
created = 0
updated_sku = 0
already_ok = 0
errors = []

for base_name, sku in csv_items:
    auto_slug = slug_overrides.get(base_name) or name_to_slug(base_name)

    if auto_slug in by_slug:
        # Already exists - update SKU and ensure published + autoflower
        p = by_slug[auto_slug]
        changed = False
        if p.get('sku') != sku:
            p['sku'] = sku
            changed = True
        if p.get('status') != 'published':
            p['status'] = 'published'
            changed = True
        if not p.get('autoflower'):
            p['autoflower'] = True
            changed = True
        # Ensure name says "Auto" not "Feminized"
        if 'Feminized' in p.get('name', '') or 'Auto' not in p.get('name', ''):
            p['name'] = make_auto_name(base_name)
            changed = True
        if changed:
            updated_sku += 1
        else:
            already_ok += 1
    else:
        # Need to create
        max_id += 1
        template = find_fem_template(base_name)
        new_product = create_auto_product(base_name, sku, template, max_id)
        products.append(new_product)
        by_slug[new_product['slug']] = new_product
        created += 1

print(f"\nResults:")
print(f"  Created new: {created}")
print(f"  Updated (SKU/status/name): {updated_sku}")
print(f"  Already correct: {already_ok}")
print(f"  Errors: {len(errors)}")
print(f"  Total products now: {len(products)}")

# Save
with open('src/lib/products/products-ca-raw.json', 'w') as f:
    json.dump(products, f, indent=2)

print("\nSaved products-ca-raw.json")

# Verify a few
for test_slug in ['3-kings-auto', 'ak-47-auto', 'bruce-banner-3-auto', 'god-s-treat-auto', 'lsd-auto']:
    p = by_slug.get(test_slug)
    if p:
        print(f"  {test_slug}: name={p['name']}, auto={p.get('autoflower')}, sku={p.get('sku','')[:15]}..., status={p.get('status')}")
    else:
        print(f"  {test_slug}: NOT FOUND!")
