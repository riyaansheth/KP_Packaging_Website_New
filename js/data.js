/* ===========================================================
   K P Packaging, Site Data
   Single source of truth for products, industries, capabilities.
   =========================================================== */

const COMPANY = {
  name: "K P Packaging",
  legal: "K P Packaging Ltd.",
  tagline: "Coated paper & flexible packaging, perfected over three decades.",
  stats: [
    { value: "30+", label: "Years of expertise" },
    { value: "20+", label: "Countries served" },
    { value: "425+", label: "Clients worldwide" }
  ],
  clients: [
    { name: "Wockhardt", logo: "/assets/logos/wockhardt.png" },
    { name: "Cipla", logo: "/assets/logos/cipla.png" },
    { name: "Dr. Reddy's", logo: "/assets/logos/dr-reddys.png" },
    { name: "Godrej", logo: "/assets/logos/godrej.png" },
    { name: "Wipro", logo: "/assets/logos/wipro.png" },
    { name: "Zydus", logo: "/assets/logos/zydus.png" },
    { name: "Amul", logo: "/assets/logos/amul.png" },
    { name: "Parksons", logo: "/assets/logos/parksons.png" },
    { name: "Intas", logo: "/assets/logos/intas.png" }
  ],
  certs: [
    { name: "ISO Certified", logo: "/assets/certs/iso.png" },
    { name: "AEO Indian Customs", logo: "/assets/certs/custom.jpg" },
    { name: "Make in India", logo: "/assets/certs/make-in-india.png" },
    { name: "MSME", logo: "/assets/certs/msme.png" },
    { name: "CE", logo: "/assets/certs/ce.png" },
    { name: "IAF", logo: "/assets/certs/iaf.png" }
  ],
  team: [
    { name: "Madhukant Vira", role: "Chairman", photo: "/assets/team/3.png" },
    { name: "Ketan Vira", role: "CEO", photo: "/assets/team/2.png" },
    { name: "Prem Vira", role: "Director", photo: "/assets/team/1.png" }
  ],
  offices: [
    {
      tag: "Corporate Office",
      city: "Mumbai",
      address: "A to Z Industrial Estate, Western Wing, Office No 138, Ganpat Rao Kadam Marg, Lower Parel, Mumbai, 400013",
      street: "A to Z Industrial Estate, Western Wing, Office No 138, Ganpat Rao Kadam Marg, Lower Parel",
      locality: "Mumbai", region: "Maharashtra", postal: "400013", country: "IN",
      phone: "+91 85916 56966",
      phoneRaw: "+918591656966",
      email: "prem@kppackaging.com"
    },
    {
      tag: "Manufacturing Plant",
      city: "Silvassa",
      address: "No 7, 8 & 9, Sr No 245/3, Sankeshwar Industrial Estate, Behind Prince Pipe, Silvassa, Dadra and Nagar Haveli, 396230",
      street: "No 7, 8 & 9, Sr No 245/3, Sankeshwar Industrial Estate, Behind Prince Pipe",
      locality: "Silvassa", region: "Dadra and Nagar Haveli", postal: "396230", country: "IN",
      phone: "+91 85916 94328",
      phoneRaw: "+918591694328",
      email: "sales@kppackaging.com"
    }
  ],

  /* ---- GEO/AEO entity + answer content ---- */
  url: "https://kppackaging.com",
  founded: "1990",                 // "over 3 decades"; replace with exact year when confirmed
  logo: "/assets/kp-logo.png",
  ogImage: "/assets/og-cover.svg",
  sameAs: [],                      // add official LinkedIn/Instagram/Facebook URLs when available
  summary: "K P Packaging Ltd. is a Mumbai-based manufacturer and distributor of coated papers and flexible packaging with over 30 years of experience. The company runs a Korean-built extrusion coating and lamination plant in Silvassa, India, and supplies pharmaceutical, food & beverage, FMCG and medical/surgical packaging to 425+ clients across 20+ countries.",
  why: [
    { title: "Three decades of converting expertise", text: "Over 30 years in coated paper and flexible packaging, from a PVC leather-cloth pioneer to a modern primary-packaging house." },
    { title: "Manufacturing + distribution under one roof", text: "In-house extrusion-coated laminates plus authorized distribution for leading Indian paper mills, source coating, printing and substrate from a single partner." },
    { title: "State-of-the-art Korean coating line", text: "A modern extrusion lamination and coating plant in Silvassa, with rotogravure printing and multiple slitting & rewinding machines." },
    { title: "Trusted by industry leaders", text: "Supplies Wockhardt, Cipla, Dr. Reddy's, Godrej, Wipro, Zydus, Amul, Parksons and Intas across 20+ countries." },
    { title: "Pharma- and food-grade quality", text: "FSC- and FDA-aligned barrier papers for medicines, ORS sachets, blister packs, paper cups and food packaging." }
  ],
  faq: [
    { q: "What does K P Packaging do?", a: "K P Packaging manufactures extrusion-coated paper laminates and distributes a wide range of mill-grade papers for primary and flexible packaging, serving the pharmaceutical, food & beverage, FMCG and medical/surgical industries." },
    { q: "Where is K P Packaging located?", a: "Its corporate office is in Lower Parel, Mumbai, Maharashtra, and its manufacturing plant is in Sankeshwar Industrial Estate, Silvassa, Dadra and Nagar Haveli, India." },
    { q: "Is K P Packaging a manufacturer or a distributor?", a: "Both. K P Packaging manufactures extrusion-coated laminates in-house and is also an authorized distributor for multiple Indian paper mills." },
    { q: "Does K P Packaging export internationally?", a: "Yes. K P Packaging serves 425+ clients across more than 20 countries and is actively expanding its international business." },
    { q: "What types of coated paper does K P Packaging make?", a: "Glassine, MG Poster, Chromo, Cupstock, MG Kraft, 3-ply and 4-ply foil laminates, Folding Box Board, Duplex Board, Greaseproof, Maplitho, Non-Tearable, PE-coated stiffener, tissue, and medical Bactite and Grid Lacquer papers." },
    { q: "Is K P Packaging's paper food-safe and pharma-grade?", a: "Yes. It supplies FDA- and FSC-aligned glassine and barrier papers for pharmaceuticals and food-safe cupstock and greaseproof papers for food and beverage packaging." },
    { q: "How do I request a quote from K P Packaging?", a: "Contact the corporate office at prem@kppackaging.com or +91 85916 56966, the plant at sales@kppackaging.com or +91 85916 94328, or use the enquiry form on kppackaging.com." }
  ]
};

const CAPABILITIES = [
  {
    slug: "extrusion-coating",
    title: "Extrusion Coating & Lamination",
    icon: "layers",
    blurb: "Poly (PE) coating on printed & unprinted Paper, Board, PET, BOPP, Aluminium Foil and Fabric.",
    detail: "Our state-of-the-art extrusion lamination and coating line, imported from Korea, applies LDPE and specialty polymer layers across a wide range of substrates to deliver moisture, grease and oxygen barriers for primary packaging."
  },
  {
    slug: "rotogravure-printing",
    title: "Rotogravure Printing",
    icon: "printer",
    blurb: "High-resolution, multi-colour gravure printing for sharp, durable, on-brand packaging.",
    detail: "Our rotogravure press delivers consistent, high-volume print quality on films, foils and papers, ideal for branded flexible packaging and pharmaceutical laminates."
  },
  {
    slug: "slitting-rewinding",
    title: "Slitting & Rewinding",
    icon: "scissors",
    blurb: "Multiple slitting and rewinding machines for precise reel widths to customer spec.",
    detail: "Jumbo rolls are converted into precise, customer-specified reel widths and lengths, plain or printed, with tight tolerance and clean edges."
  },
  {
    slug: "paper-distribution",
    title: "Paper Distribution",
    icon: "truck",
    blurb: "Authorized distributor for leading Indian paper mills across a broad grade range.",
    detail: "Beyond manufacturing, we are authorized distributors for multiple Indian paper mills, supplying MG Poster, Maplitho, Cupstock, MG/MF Kraft, Greaseproof, Chromo, Glassine, Duplex, FBB, SBS and more."
  }
];

const INDUSTRIES = [
  {
    slug: "pharmaceutical",
    name: "Pharmaceutical",
    art: "roll-art",
    image: "/assets/industries/pharmaceutical.jpg",
    blurb: "Barrier papers and foil laminates for tablet strips, ORS sachets and blister packs.",
    detail: "We supply the barrier-grade papers and aluminium foil laminates that protect medicines from moisture, light and air, from glassine sachets to 4-ply foil laminates used by leading pharma brands.",
    products: ["glassine-paper", "4-ply-paper", "3-ply-paper", "folding-box-board", "non-tearable-paper"]
  },
  {
    slug: "food-beverage",
    name: "Food & Beverage",
    art: "roll-art--kraft",
    image: "/assets/industries/food-beverage.jpg",
    blurb: "Food-safe, grease- and moisture-resistant papers for cups, wraps and pouches.",
    detail: "Food-contact-safe cupstock, greaseproof and MG poster papers engineered for hot & cold beverages, bakery, dairy and ready-to-eat packaging.",
    products: ["cupstock-paper", "greaseproof-paper", "mg-poster-paper", "mg-kraft", "3-ply-paper"]
  },
  {
    slug: "fmcg",
    name: "FMCG & Retail",
    art: "roll-art--cream",
    image: "/assets/industries/fmcg.jpg",
    blurb: "Printable, durable coated papers and boards for everyday branded products.",
    detail: "High-gloss, print-ready chromo and poster papers plus folding box board for retail packaging that needs shelf appeal and structural strength.",
    products: ["chromo-paper", "mg-poster-paper", "folding-box-board", "duplex-board", "maplitho-paper"]
  },
  {
    slug: "medical-surgical",
    name: "Medical & Surgical",
    art: "roll-art",
    image: "/assets/industries/medical-surgical.jpg",
    blurb: "Sterilizable, bacterial-barrier papers for gloves, syringes and surgical disposables.",
    detail: "Steam-sterilizable Bactite and grid-lacquer papers with bacterial-barrier and self-sealing properties for medical gloves, syringes, catheters and surgical sutures.",
    products: ["bactite", "grid-lacquer", "non-tearable-paper"]
  }
];

/* ---------- PRODUCTS (16) ---------- */
const PRODUCTS = [
  {
    slug: "glassine-paper",
    image: "/assets/products/glassine-paper.webp",
    name: "Glassine Paper",
    aka: "Poly Coated Glassine Paper",
    tagline: "Smooth, super-calendered barrier paper for pharmaceutical packaging.",
    art: "roll-art--cream",
    arm: "Both",
    featured: true,
    construction: "Glassine base + optional PE / VMCH / HSL coating",
    desc: "Glassine is a smooth, super-calendered glossy paper resistant to air, water and grease, an ideal base for pharmaceutical packaging. It is an extremely niche paper, manufactured by only one paper mill in India, and serves as a base that can be further coated using complex polymers.",
    applications: ["ORS sachets", "Strip packing of tablets", "Primary medicine packaging (Saridon, Decdan, Practin)"],
    properties: ["Smooth super-calendered glossy finish", "Resistant to air, water & grease", "Passes stringent quality control", "Multiple coating options for varied protection"],
    variants: ["Pure glassine paper", "Poly-coated glassine", "VMCH / HSL-coated glassine", "Plain or printed reels"],
    coatings: ["PE", "VMCH", "HSL"],
    specs: { finish: "Super-calendered, glossy", coating_type: "PE / VMCH / HSL (optional)", sizes_reels: "Plain or printed reels" },
    certs: ["FSC", "FDA"],
    industries: ["pharmaceutical"],
    cats: { construction: "single", coating: "specialty", fn: ["barrier", "printable"] }
  },
  {
    slug: "mg-poster-paper",
    image: "/assets/products/mg-poster-paper.jpg",
    name: "MG Poster Paper",
    aka: "Machine Glazed / Sandwich Paper",
    tagline: "Glossy, high-strength poly-coated paper, a best-seller for primary packaging.",
    art: "roll-art--kraft",
    arm: "Manufactured",
    featured: true,
    construction: "Poster paper + LDPE coating",
    desc: "MG Poster Paper, Machine Glazed Poster Paper, known overseas as poly coated poster paper or 'Sandwich Paper', is one of our best-selling and most sought-after products for primary packaging. Coated with a layer of LDPE during production, it has an extremely glossy appearance, a smooth exterior, high tensile strength and good stiffness. It is an affordable alternative to chromo paper.",
    applications: ["Heat-sealable wrapping", "Pouches", "Inner lining in carton boxes", "Food item packaging", "Apparel & glass wrapping", "Sugar & salt packaging", "Band-aid packaging", "Glove pouches"],
    properties: ["High tensile strength", "Stiff construction", "Glossy appearance", "Smooth exterior finish", "Affordable alternative to chromo"],
    variants: ["Coated", "Uncoated", "Custom specifications"],
    coatings: ["LDPE"],
    specs: { coating_type: "LDPE", finish: "Glossy, machine glazed" },
    certs: [],
    industries: ["food-beverage", "fmcg"],
    cats: { construction: "single", coating: "pe", fn: ["heatseal", "printable"] }
  },
  {
    slug: "chromo-paper",
    image: "/assets/products/chromo-paper.jpg",
    name: "Chromo Paper",
    aka: "Poly Coated Chromo Paper",
    tagline: "Water-resistant, high-gloss coated paper built for premium print.",
    art: "roll-art--cream",
    arm: "Manufactured",
    featured: true,
    construction: "Chromo base + inorganic coating + extrusion polymer",
    desc: "Poly coated chromo paper is a highly water-resistant and durable product. It is coated with an inorganic compound that adds ink absorbency, surface gloss and high smoothness. Polymers are applied through extrusion coating lamination, giving the paper additional strength, texture and durability.",
    applications: ["Tobacco sachets", "Magazine paper", "Labels", "Green tea packaging", "Gutka & pan masala packaging"],
    properties: ["Water-resistant", "Extended shelf life", "Excellent for printing", "High ink absorbency", "Gloss finish & smooth texture", "Enhanced strength & durability"],
    variants: ["C1S (one side coated)", "C2S (two sides coated)"],
    coatings: ["Inorganic coat", "Extrusion polymer"],
    specs: { coating_type: "Inorganic + extrusion polymer", finish: "High gloss" },
    certs: [],
    industries: ["fmcg"],
    cats: { construction: "single", coating: "pe", fn: ["printable", "barrier"] }
  },
  {
    slug: "cupstock-paper",
    image: "/assets/products/cupstock-paper.jpg",
    name: "Cupstock Paper",
    aka: "PE Coated Cupstock",
    tagline: "Food-safe paper for hot & cold cups, bowls and food service.",
    art: "roll-art--kraft",
    arm: "Both",
    featured: true,
    construction: "2, 3 ply base + PE / PLA / water-based coating",
    desc: "Cupstock paper is a food-safe paper suitable for both hot and cold food and beverages. The base consists of 2, 3 plies that prevent liquid penetration into inner layers, and coatings provide effective protection against light, oxygen, humidity, grease and heat.",
    applications: ["Paper cups", "Noodle & soup bowls", "Food wrappers", "Grocery bags", "Tray mats & meal boxes", "Fast-food containers", "Dry food trays", "Dairy product packaging"],
    properties: ["High hygiene standards", "Low heat transfer", "Liquid-tight when coated", "Moisture & water resistant", "Good sealing properties", "Sustainable & renewable"],
    variants: ["Bleached / unbleached", "Single-sided PE", "Double-sided PE"],
    coatings: ["PE (one/both sides)", "Polylactic acid (PLA)", "Water-based"],
    specs: { coating_type: "PE / PLA / water-based", mechanical: "Scott Bond support", finish: "Food-grade" },
    certs: ["Food-safe"],
    industries: ["food-beverage"],
    cats: { construction: "board", coating: "pe", fn: ["barrier", "heatseal"] }
  },
  {
    slug: "3-ply-paper",
    image: "/assets/products/3-ply-paper.jpg",
    name: "3 Ply Paper",
    aka: "Paper + Polymer + Aluminium Foil",
    tagline: "Lightweight, leak-proof foil laminate for maximum freshness.",
    art: "roll-art",
    arm: "Manufactured",
    featured: true,
    construction: "Paper + Polymer + Aluminium Foil",
    desc: "3 Ply Paper, composed of Paper, Polymer and Aluminium Foil, is renowned for sustainability and its superior ability to maintain freshness. It is lightweight, durable, recyclable and leak-proof, effectively blocking water, moisture, air and light.",
    applications: ["Foil bags", "Green tea sachets", "Meat packaging", "Freshness-critical products"],
    properties: ["Excellent thermal conductivity", "Purity & neutrality", "Grease resistance", "Strong texture for varied designs", "Protects against temperature, air, light & moisture"],
    variants: ["Custom laminate structures"],
    coatings: ["Polymer", "Aluminium foil"],
    specs: { construction: "Paper + PE + Foil" },
    certs: [],
    industries: ["pharmaceutical", "food-beverage"],
    cats: { construction: "3ply", coating: "foil", fn: ["barrier"] }
  },
  {
    slug: "4-ply-paper",
    image: "/assets/products/4-ply-paper.webp",
    name: "4 Ply Paper",
    aka: "Paper + PE + Foil + PE",
    tagline: "An extra polymer layer for the toughest pharma & pan-masala barriers.",
    art: "roll-art--kraft",
    arm: "Manufactured",
    featured: true,
    construction: "Paper + PE + Aluminium Foil + PE",
    desc: "Enhancing the versatility of 3 Ply Paper, an extra polymer layer creates 4 Ply Paper, a material highly valued in the pharmaceutical industry for packaging tablet strips and ORS powders. It preserves formulation effectiveness by protecting against moisture and harmful elements while maintaining potency over time.",
    applications: ["Pharmaceutical tablet strips", "ORS powders (e.g. Electral)", "Pan masala packaging", "Moisture-sensitive food & medicine"],
    properties: ["Blocks moisture effectively", "Maintains product freshness", "Protects against extreme temperatures", "Preserves formulation potency"],
    variants: ["Glassine 4 Ply", "Chromo 4 Ply", "Kraft 4 Ply"],
    coatings: ["PE", "Aluminium foil"],
    specs: { construction: "Paper + PE + Foil + PE" },
    certs: [],
    industries: ["pharmaceutical"],
    cats: { construction: "4ply", coating: "foil", fn: ["barrier"] }
  },
  {
    slug: "mg-kraft",
    image: "/assets/products/mg-kraft.jpg",
    name: "MG Kraft Paper",
    aka: "Machine Glazed Kraft",
    tagline: "High-strength, eco-friendly kraft with a glossy machine-glazed top.",
    art: "roll-art--kraft",
    arm: "Both",
    featured: true,
    construction: "Kraft base + optional polymer coating",
    desc: "MG Kraft paper is a machine-glazed coated kraft paper that stands out for high tensile strength owing to a greater paper density. It has a natural brown appearance with a high-gloss finish on the top side and is eco-friendly. It can be further coated with polymer layers for enhanced performance.",
    applications: ["Food packaging", "Paper bags", "Envelopes", "Box manufacturing"],
    properties: ["High tensile strength", "Machine-glazed finish", "Natural brown colour & texture", "High MG gloss on top surface", "Strong bursting factor (BF)", "Notable tearing & tensile strength"],
    variants: ["Uncoated", "Polymer coated"],
    coatings: ["Optional polymer"],
    specs: { strength: "Measured by Bursting Factor (BF)", finish: "Natural brown, MG gloss top" },
    certs: [],
    industries: ["food-beverage", "fmcg"],
    cats: { construction: "single", coating: "uncoated", fn: ["printable"] }
  },
  {
    slug: "folding-box-board",
    image: "/assets/products/folding-box-board.jpg",
    name: "Folding Box Board",
    aka: "FBB Paper",
    tagline: "Low-density, high-stiffness board with a superb print surface.",
    art: "roll-art--cream",
    arm: "Distributed",
    featured: false,
    construction: "Chemical pulp / mechanical pulp / chemical pulp layers",
    desc: "FBB, also known as Folding Box Board, is made up of multiple layers of mechanical pulp between layers of chemical pulp, a low-density material with high stiffness. It features a printable bleached surface, an unbleached yellowish centre layer and a bleached inner layer, making it ideal for scoring and bending without tearing or splitting.",
    applications: ["Health & beauty packaging", "Frozen foods", "Confectionery", "Pharmaceutical cartons", "Cigarette packaging"],
    properties: ["Low-density, high stiffness", "Smooth surface for superior print", "Excellent for foil stamping & cold foil", "High thickness with brightness", "Recyclable & eco-friendly", "Lightweight, lowers transport cost"],
    variants: ["Various grammages"],
    coatings: ["Bleached surface"],
    specs: { structure: "Bleached / yellowish centre / bleached inner", finish: "Smooth, high brightness" },
    certs: [],
    industries: ["pharmaceutical", "fmcg", "food-beverage"],
    cats: { construction: "board", coating: "uncoated", fn: ["printable"] }
  },
  {
    slug: "duplex-board",
    image: "/assets/products/duplex-board.webp",
    name: "Duplex Board",
    aka: "Grey Back / White Back",
    tagline: "Rigid, anti-curl coated board with a bright, print-ready face.",
    art: "roll-art--cream",
    arm: "Distributed",
    featured: false,
    construction: "Two-ply board, coated one side",
    desc: "Duplex board is a form of cardboard with a single-sided grey or white colour, made up of two plies. It carries a shiny coated finish on one side, making it superior for printing, and comes in High Weight Coating and Low Weight Coating variants depending on usage.",
    applications: ["Packaging", "Food industry (food-grade)", "Pharmaceutical", "General retail cartons"],
    properties: ["Water-resistant coated exterior", "Tough yet lightweight, bright white", "Rigid, stiff multi-layer build", "Smooth finish for all print types", "Anti-curl property", "Moisture resistant with quality shine"],
    variants: ["High Weight Coating", "Low Weight Coating", "Grey back", "White back"],
    coatings: ["Single-side coat"],
    specs: { variants: "HWC / LWC", finish: "Shiny coated one side" },
    certs: ["Food-grade"],
    industries: ["fmcg", "pharmaceutical", "food-beverage"],
    cats: { construction: "board", coating: "uncoated", fn: ["printable"] }
  },
  {
    slug: "non-tearable-paper",
    image: "/assets/products/non-tearable-paper.jpg",
    name: "Non Tearable Paper",
    aka: "Synthetic Spun-bound Paper",
    tagline: "Synthetic, breathable, tear-proof, the strength of paper, film and fabric.",
    art: "roll-art",
    arm: "Distributed",
    featured: false,
    construction: "High-density spun-bound polyethylene fibres",
    desc: "Non Tearable Paper is lightweight, breathable and resistant to water, wear and tear. Manufactured from high-density spun-bound polyethylene fibres and completely synthetic, it combines the performance of paper, film and fabric, making it ideal for a wide range of applications.",
    applications: ["Medical & pharmaceutical packaging", "Industrial protective apparel", "Building protection during construction", "Postal envelopes (Priority/Express)", "Lab & pharma sterilization"],
    properties: ["Lightweight & breathable", "Water, wear & tear resistant", "Bacterial penetration resistant", "Dimensionally stable when printed/coated", "Withstands gamma & ethylene-oxide sterilization", "100% recyclable"],
    variants: ["Coated, embossed, hot-foil stamped, laminated, perforated, punched, stitched, welded, heat-sealed"],
    coatings: ["Optional finishing"],
    specs: { material: "Spun-bound polyethylene", recyclable: "100% recyclable" },
    certs: [],
    industries: ["medical-surgical", "pharmaceutical"],
    cats: { construction: "single", coating: "specialty", fn: ["sterilizable", "barrier"] }
  },
  {
    slug: "pe-coated-stiffener-paper",
    image: "/assets/products/pe-coated-stiffener-paper.jpg",
    name: "Polyethylene Coated Stiffener Paper",
    aka: "PE Coated Stiffener",
    tagline: "Rigid PE-coated stiffener for shape, support and moisture protection.",
    art: "roll-art--kraft",
    arm: "Manufactured",
    featured: false,
    construction: "Stiffener base + polyethylene coating",
    desc: "Polyethylene coated stiffener paper provides structure and rigidity to packaging while adding a moisture and grease barrier. The PE coating makes it leak-resistant and protects packed products against humidity, helping garments, cartons and pouches hold their shape.",
    applications: ["Apparel & garment stiffeners", "Carton reinforcement", "Salt, pepper & tea packaging", "Meat & food product packaging"],
    properties: ["Rigid & supportive", "Leak-resistant", "Moisture & grease barrier", "Good texture & strength", "Recyclable & lightweight"],
    variants: ["Various grammages & coating weights"],
    coatings: ["Polyethylene"],
    specs: { coating_type: "Polyethylene" },
    certs: [],
    industries: ["food-beverage", "fmcg"],
    cats: { construction: "single", coating: "pe", fn: ["barrier"] }
  },
  {
    slug: "greaseproof-paper",
    image: "/assets/products/greaseproof-paper.jpg",
    name: "Greaseproof Paper",
    aka: "Butter / Bakery Paper",
    tagline: "Non-stick, heat-resistant cellulose paper for food and baking.",
    art: "roll-art--cream",
    arm: "Both",
    featured: false,
    construction: "Cellulose-based, non-stick",
    desc: "Greaseproof paper, often known as butter paper, is a versatile, non-stick, cellulose-based material essential in food packaging. It has a smooth texture, a low water-absorption rate and heat resistance suitable for lining cake tins and baking applications, while preventing oil penetration.",
    applications: ["Packaging butter & margarine", "Wrapping food items", "Lining cake tins & baking", "General cooking use"],
    properties: ["Non-stick surface", "Heat resistant up to 220°C", "Breathable material", "Food-safe, no harmful leaching", "Prevents oil penetration", "Retains moisture better than foil"],
    variants: ["Plain", "Printed"],
    coatings: ["Cellulose, non-stick"],
    specs: { heat_resistance: "Up to 220°C", material: "Cellulose-based", water_absorption: "Low rate" },
    certs: ["Food-safe"],
    industries: ["food-beverage"],
    cats: { construction: "single", coating: "uncoated", fn: ["barrier"] }
  },
  {
    slug: "maplitho-paper",
    image: "/assets/products/maplitho-paper.webp",
    name: "Maplitho Paper",
    aka: "Surface-Sized Wood-Free Paper",
    tagline: "Eco-friendly, wood-free printing & writing paper.",
    art: "roll-art--cream",
    arm: "Distributed",
    featured: false,
    construction: "Wood-free, surface-sized",
    desc: "Maplitho, meaning 'surface size-paper', is an eco-friendly, wood-free paper distributed by K P Packaging. The nature of the paper used for printing plays an important role in the quality of the final printed product, and Maplitho enables crisp embossing on both sides.",
    applications: ["Computer stationery", "Bills, invoices & cashbooks", "Leaflets & mailers", "Calendars & writing pads", "Label printing", "Braille printing", "Laser / inkjet / photocopy"],
    properties: ["Eco-friendly & wood-free", "Embossing on both sides", "Available in multiple sizes", "Available in two shades", "Recyclable"],
    variants: ["Two shades", "Multiple sizes"],
    coatings: ["Surface-sized"],
    specs: { type: "Wood-free, surface-sized", shades: "Two" },
    certs: [],
    industries: ["fmcg"],
    cats: { construction: "single", coating: "uncoated", fn: ["printable"] }
  },
  {
    slug: "tissue-paper",
    image: "/assets/products/tissue-paper.jpg",
    name: "Tissue Paper",
    aka: "Hygiene Tissue",
    tagline: "Soft, absorbent, hygienic tissue from recycled pulp.",
    art: "roll-art--cream",
    arm: "Distributed",
    featured: false,
    construction: "Recycled paper pulp",
    desc: "Tissue paper is a lightweight paper made from recycled paper pulp. Distributed by K P Packaging, it is hygienic and versatile, used in facial tissues, paper napkins, paper towels and bathroom tissues, and can be customized with manufacturer branding.",
    applications: ["Facial tissues", "Paper napkins", "Paper towels", "Bathroom & toilet tissue", "Wrapping & packaging", "Cushioning fragile items", "Infection control"],
    properties: ["Soft, absorbent & disposable", "Hygienic", "Customizable branding", "Specialty variants available", "Made from recycled pulp"],
    variants: ["Facial", "Napkin", "Towel", "Bathroom"],
    coatings: [", "],
    specs: { material: "Recycled paper pulp" },
    certs: [],
    industries: ["food-beverage"],
    cats: { construction: "single", coating: "uncoated", fn: [] }
  },
  {
    slug: "bactite",
    image: "/assets/products/bactite.jpg",
    name: "Bactite Paper",
    aka: "Medical Sterilization Paper",
    tagline: "Steam-sterilizable, bacterial-barrier paper for medical packaging.",
    art: "roll-art",
    arm: "Manufactured",
    featured: false,
    construction: "Kraft & polymer reinforced",
    desc: "Hygienically produced and free from optical brighteners, Bactite paper is developed to fulfil special requirements of heat sealability and is suitable for steam sterilization, giving it a colour indication. Its excellent fluid-repellent quality and bacterial-growth barrier make it ideal for packaging medical products, mainly hand gloves.",
    applications: ["Medical hand-glove packaging", "Sterilized medical equipment", "Surgical disposables"],
    properties: ["High dry & wet strength", "Lint-free", "Tear-resistant", "Kraft & polymer reinforced", "Colour indication for steam sterilization", "Free from optical brighteners"],
    variants: ["Plain", "Printed"],
    coatings: ["Heat-sealable"],
    specs: { feature: "Steam-sterilizable with colour indication" },
    certs: [],
    industries: ["medical-surgical"],
    cats: { construction: "single", coating: "specialty", fn: ["sterilizable", "heatseal"] }
  },
  {
    slug: "grid-lacquer",
    image: "/assets/products/grid-lacquer.jpg",
    name: "Grid Lacquer Paper",
    aka: "Medical Grade Lacquer Paper",
    tagline: "Self-sealing, extrusion-coated paper for surgical disposables.",
    art: "roll-art",
    arm: "Manufactured",
    featured: false,
    construction: "Extrusion coating lamination",
    desc: "Medical grade Grid Lacquer Paper with extrusion coating lamination is used in the packaging of various medical and surgical gloves, syringes, catheters and needles. It is self-sealing and requires no PE coating, with excellent adhesive strength and a superior printing surface.",
    applications: ["Medical & surgical gloves", "Blister-wrapping of syringes", "Catheters & needles", "Surgical disposables"],
    properties: ["Excellent adhesive strength & sealability", "High paper strength", "Self-sealing, no PE coating required", "Superior printing-quality surface"],
    variants: ["Plain", "Printed"],
    coatings: ["Lacquer / extrusion coat"],
    specs: { feature: "Self-sealing, no PE required" },
    certs: [],
    industries: ["medical-surgical"],
    cats: { construction: "single", coating: "specialty", fn: ["sterilizable", "heatseal"] }
  }
];

/* ---------- Catalogue filter definitions ---------- */
const FILTERS = {
  industry: [
    { key: "pharmaceutical", label: "Pharmaceutical" },
    { key: "food-beverage", label: "Food & Beverage" },
    { key: "fmcg", label: "FMCG & Retail" },
    { key: "medical-surgical", label: "Medical & Surgical" }
  ],
  construction: [
    { key: "single", label: "Single-ply" },
    { key: "3ply", label: "3-Ply" },
    { key: "4ply", label: "4-Ply" },
    { key: "board", label: "Board" }
  ],
  coating: [
    { key: "pe", label: "PE Coated" },
    { key: "foil", label: "Foil Laminate" },
    { key: "specialty", label: "Specialty Coated" },
    { key: "uncoated", label: "Uncoated" }
  ],
  fn: [
    { key: "barrier", label: "Moisture / Grease Barrier" },
    { key: "heatseal", label: "Heat-Sealable" },
    { key: "sterilizable", label: "Sterilizable" },
    { key: "printable", label: "Print-Ready" }
  ]
};

/* ---------- Node (build-time) export; no-op in the browser ---------- */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { COMPANY, CAPABILITIES, INDUSTRIES, PRODUCTS, FILTERS };
}
