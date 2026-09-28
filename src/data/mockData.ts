import { Merchant, Coupon, Deal, Category, BlogPost, Faq, VerificationLog, CouponReport, AdminAuditLog } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-hosting',
    name: 'Hosting & Cloud',
    slug: 'hosting-cloud',
    description: 'Verified promotional codes for managed servers, cloud compute, VPS, and domain registrations.',
    iconName: 'Server',
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: 'cat-software',
    name: 'Developer Tools & Software',
    slug: 'developer-software',
    description: 'Discounts on productivity apps, IDE licenses, SaaS subscriptions, and digital tools.',
    iconName: 'Cpu',
    isFeatured: true,
    sortOrder: 2,
  },
  {
    id: 'cat-electronics',
    name: 'Electronics & Audio',
    slug: 'electronics-audio',
    description: 'Savings on studio acoustics, mechanical keyboards, portable monitors, and hardware accessories.',
    iconName: 'Headphones',
    isFeatured: true,
    sortOrder: 3,
  },
  {
    id: 'cat-fashion',
    name: 'Apparel & Sustainable Fashion',
    slug: 'fashion-apparel',
    description: 'Promotional offers on organic textiles, activewear, minimal outerwear, and footwear.',
    iconName: 'Shirt',
    isFeatured: true,
    sortOrder: 4,
  },
  {
    id: 'cat-home',
    name: 'Home Goods & Workspace',
    slug: 'home-workspace',
    description: 'Ergonomic furnishings, stoneware ceramics, desk organization, and ambient lighting.',
    iconName: 'Home',
    isFeatured: false,
    sortOrder: 5,
  },
  {
    id: 'cat-travel',
    name: 'Travel & Mobility',
    slug: 'travel-mobility',
    description: 'Bookings discounts on regional train passes, luggage gear, and boutique accommodation.',
    iconName: 'Compass',
    isFeatured: false,
    sortOrder: 6,
  },
];

export const INITIAL_MERCHANTS: Merchant[] = [
  {
    id: 'merch-cloudforge',
    name: 'CloudForge Hosting',
    slug: 'cloudforge-hosting',
    domain: 'cloudforge.example.com',
    logoUrl: '',
    shortDesc: 'High-performance cloud VPS and managed Kubernetes hosting built for developers and fast-growing platforms.',
    aboutHtml: '<p>CloudForge Hosting provides dedicated virtual servers, NVMe block storage, and one-click database clustering across 14 global availability zones. Founded with an emphasis on low latency and transparent billing, CloudForge operates developer-friendly cloud infrastructure with 99.99% uptime SLAs.</p><p>Our editorial team tests CloudForge coupon codes directly on their signup billing console before listing them on CouponBeee.</p>',
    categoryIds: ['cat-hosting', 'cat-software'],
    affiliateUrl: 'https://cloudforge.example.com/?ref=couponbeee_demo',
    landingUrl: 'https://cloudforge.example.com',
    status: 'ACTIVE',
    isPopular: true,
    isTrending: true,
    seoTitle: 'CloudForge Hosting Promo Codes & VPS Coupons (2026)',
    seoDescription: 'Save on CloudForge VPS instances, SSD storage, and annual hosting contracts with verified promotional vouchers.',
    canonicalUrl: 'https://couponbeee.org/stores/cloudforge-hosting',
    howToUseSteps: [
      'Copy the verified promo code from CouponBeee by clicking "Show Code".',
      'Select your desired VPS plan or cloud cluster configuration on CloudForge.',
      'During Step 3 of checkout (Payment & Review), locate the "Have a promo voucher?" field.',
      'Paste the copied code and click "Apply" to confirm the discount before completing checkout.'
    ],
    faqs: [
      {
        question: 'Do CloudForge coupon codes work on existing server renewals?',
        answer: 'Most introductory codes apply strictly to new server deployments and annual upfront billing cycles. Renewal promo codes are released quarterly for account upgrades.'
      },
      {
        question: 'Can I stack multiple promo codes on CloudForge?',
        answer: 'CloudForge allows one promotional voucher code per billing transaction. However, voucher discounts can often combine with their automatic 20% annual billing discount.'
      }
    ],
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-20T14:30:00Z',
  },
  {
    id: 'merch-bytecraft',
    name: 'ByteCraft Tools',
    slug: 'bytecraft-tools',
    domain: 'bytecraft-tools.example.com',
    logoUrl: '',
    shortDesc: 'Productivity and code auditing software designed to streamline developer workflows and container deployments.',
    aboutHtml: '<p>ByteCraft Tools delivers desktop and command-line developer utilities including JSON schema validators, local API mock servers, and automated performance testing tools. Built by independent software engineers, ByteCraft products feature perpetual licensing options alongside team subscriptions.</p>',
    categoryIds: ['cat-software'],
    affiliateUrl: 'https://bytecraft-tools.example.com/?aff=beee_demo',
    landingUrl: 'https://bytecraft-tools.example.com',
    status: 'ACTIVE',
    isPopular: true,
    isTrending: false,
    seoTitle: 'ByteCraft Tools Coupons & Software Discounts',
    seoDescription: 'Find tested promo codes for ByteCraft Pro and Team licenses. Save on developer desktop utilities.',
    canonicalUrl: 'https://couponbeee.org/stores/bytecraft-tools',
    howToUseSteps: [
      'Click "Show Code" on the ByteCraft discount above to copy the token.',
      'Head to the ByteCraft pricing page and select Pro or Team license.',
      'Enter your email address on the secure Stripe checkout screen.',
      'Click "Add Promotion Code", paste the CouponBeee code, and verify the adjusted subtotal.'
    ],
    faqs: [
      {
        question: 'Is there an educational or student discount for ByteCraft?',
        answer: 'Yes, ByteCraft provides a 30% discount for accredited university students, which is verified through their student portal or using our listed student promo codes.'
      }
    ],
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-03-22T10:00:00Z',
  },
  {
    id: 'merch-lumina',
    name: 'Lumina Soundworks',
    slug: 'lumina-soundworks',
    domain: 'luminasound.example.com',
    logoUrl: '',
    shortDesc: 'Precision planar magnetic headphones, USB-C audio interfaces, and studio monitoring acoustics.',
    aboutHtml: '<p>Lumina Soundworks designs audiophile reference headphones and low-noise digital converters in Copenhagen. With a dedication to flat frequency response and sustainable hardwood accents, Lumina equipment is favored by music producers and discerning listeners worldwide.</p>',
    categoryIds: ['cat-electronics'],
    affiliateUrl: 'https://luminasound.example.com/?partner=couponbeee_demo',
    landingUrl: 'https://luminasound.example.com',
    status: 'ACTIVE',
    isPopular: true,
    isTrending: true,
    seoTitle: 'Lumina Soundworks Promo Codes & Audio Gear Coupons',
    seoDescription: 'Save on studio reference headphones, DACs, and cable accessories with tested Lumina Soundworks codes.',
    canonicalUrl: 'https://couponbeee.org/stores/lumina-soundworks',
    howToUseSteps: [
      'Select a verified Lumina coupon and copy the discount code.',
      'Add your chosen headphones or audio cables to your shopping bag.',
      'View your Cart and proceed to checkout.',
      'Enter your promotional code in the right-hand summary sidebar and hit "Apply".'
    ],
    faqs: [
      {
        question: 'Does Lumina offer free international shipping?',
        answer: 'Lumina Soundworks provides free standard express shipping worldwide on orders exceeding $150, or via designated free shipping vouchers.'
      }
    ],
    createdAt: '2026-02-01T12:00:00Z',
    updatedAt: '2026-03-24T16:00:00Z',
  },
  {
    id: 'merch-aerovolt',
    name: 'Aerovolt Tech',
    slug: 'aerovolt-tech',
    domain: 'aerovolt-gear.example.com',
    logoUrl: '',
    shortDesc: 'GaN fast chargers, modular aluminum laptop stands, and braided aramid fiber cables.',
    aboutHtml: '<p>Aerovolt Tech manufactures compact charging hardware utilizing cutting-edge Gallium Nitride semiconductors. Their space-saving power bricks and travel adapters support fast charging across phones, ultrabooks, and high-wattage creative workstations.</p>',
    categoryIds: ['cat-electronics', 'cat-home'],
    affiliateUrl: 'https://aerovolt-gear.example.com/?ref=cbeee',
    landingUrl: 'https://aerovolt-gear.example.com',
    status: 'ACTIVE',
    isPopular: false,
    isTrending: true,
    seoTitle: 'Aerovolt Tech Coupon Codes & Fast Charger Deals',
    seoDescription: 'Find latest Aerovolt promo codes for USB-C GaN power bricks, desk docks, and travel hubs.',
    canonicalUrl: 'https://couponbeee.org/stores/aerovolt-tech',
    howToUseSteps: [
      'Click "Show Code" to reveal the current active Aerovolt promotional voucher.',
      'Browse through GaN chargers or desktop power hubs and add items to your cart.',
      'At checkout, paste the code into the "Discount Code or Gift Card" field.',
      'Click the arrow button to apply your reduction.'
    ],
    faqs: [
      {
        question: 'What warranty is included with Aerovolt products?',
        answer: 'All Aerovolt charging accessories include an unconditional 24-month replacement warranty covering component failure.'
      }
    ],
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-03-25T11:20:00Z',
  },
  {
    id: 'merch-nordic',
    name: 'Nordic Threads',
    slug: 'nordic-threads',
    domain: 'nordicthreads.example.com',
    logoUrl: '',
    shortDesc: 'Minimalist merino wool apparel and technical weather-resistant outerwear made from circular fibers.',
    aboutHtml: '<p>Nordic Threads is an ethical apparel studio based in Oslo. Focused on timeless silhouettes, climate-neutral manufacturing, and heavyweight organic cotton, Nordic Threads rejects fast-fashion cycles in favor of durable wardrobe staples.</p>',
    categoryIds: ['cat-fashion'],
    affiliateUrl: 'https://nordicthreads.example.com/?partner=couponbeee',
    landingUrl: 'https://nordicthreads.example.com',
    status: 'ACTIVE',
    isPopular: true,
    isTrending: false,
    seoTitle: 'Nordic Threads Promo Codes & Sustainable Apparel Coupons',
    seoDescription: 'Explore verified promo vouchers for Nordic Threads merino sweaters, raincoats, and everyday basics.',
    canonicalUrl: 'https://couponbeee.org/stores/nordic-threads',
    howToUseSteps: [
      'Copy the verified Nordic Threads discount voucher.',
      'Pick your size and garment color on Nordic Threads.',
      'Open the shopping slide-over drawer and proceed to Payment.',
      'Insert the code in the "Coupon & Promo" field and verify the deducted total.'
    ],
    faqs: [
      {
        question: 'Can coupons be used on seasonal archive sale items?',
        answer: 'Unless specifically marked as an extra-discount voucher, standard coupons cannot be combined with archive clearance markdowns.'
      }
    ],
    createdAt: '2026-02-18T14:00:00Z',
    updatedAt: '2026-03-26T09:15:00Z',
  },
  {
    id: 'merch-terravita',
    name: 'Terravita Home',
    slug: 'terravita-home',
    domain: 'terravitahome.example.com',
    logoUrl: '',
    shortDesc: 'Solid hardwood dining furniture, artisanal stoneware tableware, and natural linen bedding.',
    aboutHtml: '<p>Terravita Home brings handcrafted home essentials directly from artisan workshops to modern residences. Every collection is certified FSC-sustainable and finished using non-toxic natural plant oils and water-based glazes.</p>',
    categoryIds: ['cat-home'],
    affiliateUrl: 'https://terravitahome.example.com/?aid=couponbeee_demo',
    landingUrl: 'https://terravitahome.example.com',
    status: 'ACTIVE',
    isPopular: false,
    isTrending: false,
    seoTitle: 'Terravita Home Discounts & Furniture Promo Codes',
    seoDescription: 'Find coupons for Terravita ceramic tableware, solid oak furniture, and organic bedding sets.',
    canonicalUrl: 'https://couponbeee.org/stores/terravita-home',
    howToUseSteps: [
      'Click "Show Code" on CouponBeee and copy your voucher.',
      'Add qualifying furniture or home decor pieces to your order.',
      'Click through to checkout and enter your shipping address.',
      'Paste your promo code in the discount box and confirm your savings.'
    ],
    faqs: [
      {
        question: 'Does Terravita deliver white-glove assembly on furniture orders?',
        answer: 'Yes, white-glove room-of-choice placement is available across metropolitan regions for all heavy dining and bed frames.'
      }
    ],
    createdAt: '2026-02-22T10:00:00Z',
    updatedAt: '2026-03-25T15:00:00Z',
  },
  {
    id: 'merch-apex',
    name: 'Apex Flightways',
    slug: 'apex-flightways',
    domain: 'apexflightways.example.com',
    logoUrl: '',
    shortDesc: 'Modern flight and boutique rail booking platform with zero hidden booking surcharges.',
    aboutHtml: '<p>Apex Flightways provides transparent flight and European high-speed rail reservations with transparent baggage allowances and flexible rebooking guarantees. Their mobile-first itinerary manager syncs bookings directly to calendar apps.</p>',
    categoryIds: ['cat-travel'],
    affiliateUrl: 'https://apexflightways.example.com/?track=beee_demo',
    landingUrl: 'https://apexflightways.example.com',
    status: 'ACTIVE',
    isPopular: true,
    isTrending: true,
    seoTitle: 'Apex Flightways Promo Codes & Travel Discounts',
    seoDescription: 'Verified voucher codes for international airline tickets and scenic rail passes via Apex Flightways.',
    canonicalUrl: 'https://couponbeee.org/stores/apex-flightways',
    howToUseSteps: [
      'Copy the relevant Apex Flightways promo code.',
      'Select your origin, destination, and travel dates on Apex.',
      'Select your flight tier and enter passenger details.',
      'On the Payment Summary page, enter the voucher in the "Promotional Code" box.'
    ],
    faqs: [
      {
        question: 'Are flight voucher codes valid for group bookings?',
        answer: 'Standard codes apply for reservations of up to 4 passengers traveling on the same itinerary.'
      }
    ],
    createdAt: '2026-02-25T08:30:00Z',
    updatedAt: '2026-03-26T12:00:00Z',
  },
  {
    id: 'merch-omnioffice',
    name: 'OmniOffice Suite',
    slug: 'omnioffice-suite',
    domain: 'omnioffice.example.com',
    logoUrl: '',
    shortDesc: 'Collaborative spreadsheet, documentation, and asynchronous team whiteboard software with end-to-end encryption.',
    aboutHtml: '<p>OmniOffice Suite combines team documents, reactive spreadsheets, and sprint roadmaps inside one lightweight workspace. Engineered for distributed remote companies, OmniOffice prioritizes offline capability and data privacy.</p>',
    categoryIds: ['cat-software'],
    affiliateUrl: 'https://omnioffice.example.com/?utm_source=couponbeee_demo',
    landingUrl: 'https://omnioffice.example.com',
    status: 'ACTIVE',
    isPopular: true,
    isTrending: false,
    seoTitle: 'OmniOffice Promo Codes & Team Workspace Coupons',
    seoDescription: 'Save on annual OmniOffice workspace plans. Verified discounts for startups and creative teams.',
    canonicalUrl: 'https://couponbeee.org/stores/omnioffice-suite',
    howToUseSteps: [
      'Click "Show Code" to copy the OmniOffice discount voucher.',
      'Sign up or log in to your OmniOffice team workspace dashboard.',
      'Navigate to Workspace Settings > Billing & Plans.',
      'Select Annual Billing, input the promo voucher, and click "Activate".'
    ],
    faqs: [
      {
        question: 'Does the promo voucher apply to monthly plans?',
        answer: 'Most OmniOffice vouchers are structured for annual subscriptions to deliver maximum percentage savings.'
      }
    ],
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-26T14:40:00Z',
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn-cf-30',
    merchantId: 'merch-cloudforge',
    categoryId: 'cat-hosting',
    title: '30% Off Any NVMe Cloud VPS for 12 Months',
    slug: 'cloudforge-30-percent-off-vps',
    code: 'BEEE-CLOUD30',
    description: 'Get an instant 30% reduction on all developer cloud instances with dedicated IPv4 and hourly backups.',
    discountType: 'PERCENTAGE',
    discountValue: '30% OFF',
    affiliateUrl: 'https://cloudforge.example.com/?ref=couponbeee_demo&code=BEEE-CLOUD30',
    landingUrl: 'https://cloudforge.example.com/pricing',
    startDate: '2026-03-01T00:00:00Z',
    expiryDate: '2026-12-31T23:59:59Z',
    status: 'ACTIVE',
    verificationStatus: 'TESTED',
    lastVerifiedAt: '2026-03-26T11:15:00Z',
    verificationMethod: 'Staff test on CloudForge checkout console with live order validation',
    clickCount: 142,
    terms: 'Valid only for new accounts on first annual subscription. Excludes enterprise cluster custom hardware.',
    isEditorsPick: true,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-26T11:15:00Z',
  },
  {
    id: 'cpn-cf-credits',
    merchantId: 'merch-cloudforge',
    categoryId: 'cat-hosting',
    title: '$50 Free Infrastructure Credits for New Projects',
    slug: 'cloudforge-50-dollar-free-credits',
    code: 'START50BEEE',
    description: 'Claim $50 in compute credits to deploy test microservices, container nodes, or PostgreSQL replicas.',
    discountType: 'FIXED_AMOUNT',
    discountValue: '$50 CREDIT',
    affiliateUrl: 'https://cloudforge.example.com/?ref=couponbeee_demo&promo=START50BEEE',
    landingUrl: 'https://cloudforge.example.com/signup',
    startDate: '2026-02-15T00:00:00Z',
    expiryDate: '2026-11-30T23:59:59Z',
    status: 'ACTIVE',
    verificationStatus: 'TESTED',
    lastVerifiedAt: '2026-03-24T09:30:00Z',
    verificationMethod: 'Admin signup credit verification check',
    clickCount: 88,
    terms: 'Requires valid payment method on file to prevent spam instances. Credits expire 60 days after activation.',
    isEditorsPick: false,
    createdAt: '2026-02-15T12:00:00Z',
    updatedAt: '2026-03-24T09:30:00Z',
  },
  {
    id: 'cpn-byte-25',
    merchantId: 'merch-bytecraft',
    categoryId: 'cat-software',
    title: '25% Off ByteCraft Pro Developer Perpetual License',
    slug: 'bytecraft-pro-25-percent-off',
    code: 'BYTE25DEV',
    description: 'Lifetime license discount for the entire desktop utility suite including API mock generators and schema auditors.',
    discountType: 'PERCENTAGE',
    discountValue: '25% OFF',
    affiliateUrl: 'https://bytecraft-tools.example.com/?aff=beee_demo&c=BYTE25DEV',
    landingUrl: 'https://bytecraft-tools.example.com/pro',
    startDate: '2026-03-10T00:00:00Z',
    expiryDate: '2026-06-30T23:59:59Z',
    status: 'ACTIVE',
    verificationStatus: 'TESTED',
    lastVerifiedAt: '2026-03-25T14:20:00Z',
    verificationMethod: 'Automated cart validation with merchant API',
    clickCount: 76,
    terms: 'Applicable to individual and freelance licenses. Cannot be combined with volume corporate licenses.',
    isEditorsPick: true,
    createdAt: '2026-03-10T12:00:00Z',
    updatedAt: '2026-03-25T14:20:00Z',
  },
  {
    id: 'cpn-lumina-50',
    merchantId: 'merch-lumina',
    categoryId: 'cat-electronics',
    title: '$50 Off Planar Magnetic Headphones & DAC Combos',
    slug: 'lumina-soundworks-50-off-headphones',
    code: 'PLANAR50',
    description: 'Save $50 on any audiophile headphone purchase or balanced cable bundle over $200.',
    discountType: 'FIXED_AMOUNT',
    discountValue: '$50 OFF',
    affiliateUrl: 'https://luminasound.example.com/?partner=couponbeee_demo&code=PLANAR50',
    landingUrl: 'https://luminasound.example.com/headphones',
    startDate: '2026-03-01T00:00:00Z',
    expiryDate: '2026-05-31T23:59:59Z',
    status: 'ACTIVE',
    verificationStatus: 'TESTED',
    lastVerifiedAt: '2026-03-23T16:45:00Z',
    verificationMethod: 'Manual checkout simulation on Lumina store',
    clickCount: 114,
    terms: 'Minimum cart order subtotal $200 before taxes. Limit one voucher per customer.',
    isEditorsPick: true,
    createdAt: '2026-03-01T15:00:00Z',
    updatedAt: '2026-03-23T16:45:00Z',
  },
  {
    id: 'cpn-aerovolt-15',
    merchantId: 'merch-aerovolt',
    categoryId: 'cat-electronics',
    title: '15% Off All GaN Multi-Port Charging Docks',
    slug: 'aerovolt-15-percent-charger-discount',
    code: 'AEROPOWER15',
    description: 'Save 15% on compact 100W and 140W travel charging bricks with universal international pin adapters.',
    discountType: 'PERCENTAGE',
    discountValue: '15% OFF',
    affiliateUrl: 'https://aerovolt-gear.example.com/?ref=cbeee&code=AEROPOWER15',
    landingUrl: 'https://aerovolt-gear.example.com/chargers',
    startDate: '2026-03-12T00:00:00Z',
    expiryDate: '2026-08-31T23:59:59Z',
    status: 'ACTIVE',
    verificationStatus: 'UNVERIFIED',
    lastVerifiedAt: null,
    verificationMethod: null,
    clickCount: 42,
    terms: 'Applies to standalone chargers and cable multi-packs. Free shipping applies above $50.',
    isEditorsPick: false,
    createdAt: '2026-03-12T08:00:00Z',
    updatedAt: '2026-03-12T08:00:00Z',
  },
  {
    id: 'cpn-nordic-20',
    merchantId: 'merch-nordic',
    categoryId: 'cat-fashion',
    title: '20% Off Merino Wool Sweaters & Outerwear',
    slug: 'nordic-threads-20-merino-discount',
    code: 'WARMTH20',
    description: 'Take 20% off all knitwear, heavyweight cardigans, and windproof thermal parkas.',
    discountType: 'PERCENTAGE',
    discountValue: '20% OFF',
    affiliateUrl: 'https://nordicthreads.example.com/?partner=couponbeee&promo=WARMTH20',
    landingUrl: 'https://nordicthreads.example.com/knitwear',
    startDate: '2026-02-20T00:00:00Z',
    expiryDate: '2026-04-30T23:59:59Z',
    status: 'ACTIVE',
    verificationStatus: 'TESTED',
    lastVerifiedAt: '2026-03-26T08:00:00Z',
    verificationMethod: 'Tested during daily morning editorial review',
    clickCount: 95,
    terms: 'Valid on regular-priced items. Excludes past seasonal clearance collections.',
    isEditorsPick: false,
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-03-26T08:00:00Z',
  },
  {
    id: 'cpn-terravita-ship',
    merchantId: 'merch-terravita',
    categoryId: 'cat-home',
    title: 'Free White-Glove Shipping on Dining & Bed Sets',
    slug: 'terravita-free-white-glove-shipping',
    code: 'FREESHIPHOME',
    description: 'Complimentary room delivery and unboxing for any solid wood dining table or bed purchase.',
    discountType: 'FREE_SHIPPING',
    discountValue: 'FREE DELIVERY',
    affiliateUrl: 'https://terravitahome.example.com/?aid=couponbeee_demo&v=FREESHIPHOME',
    landingUrl: 'https://terravitahome.example.com/dining',
    startDate: '2026-03-05T00:00:00Z',
    expiryDate: '2026-07-31T23:59:59Z',
    status: 'ACTIVE',
    verificationStatus: 'UNVERIFIED',
    lastVerifiedAt: null,
    verificationMethod: null,
    clickCount: 31,
    terms: 'Valid in contiguous continental shipping zones. Minimum furniture purchase $650.',
    isEditorsPick: false,
    createdAt: '2026-03-05T14:00:00Z',
    updatedAt: '2026-03-05T14:00:00Z',
  },
  {
    id: 'cpn-apex-rail',
    merchantId: 'merch-apex',
    categoryId: 'cat-travel',
    title: '$35 Off European Rail & Scenic Pass Bookings',
    slug: 'apex-flightways-35-rail-discount',
    code: 'RAILEXPLORE35',
    description: 'Instant discount on multi-country Eurail and high-speed regional train tickets over $150.',
    discountType: 'FIXED_AMOUNT',
    discountValue: '$35 OFF',
    affiliateUrl: 'https://apexflightways.example.com/?track=beee_demo&code=RAILEXPLORE35',
    landingUrl: 'https://apexflightways.example.com/trains',
    startDate: '2026-03-01T00:00:00Z',
    expiryDate: '2026-09-30T23:59:59Z',
    status: 'ACTIVE',
    verificationStatus: 'TESTED',
    lastVerifiedAt: '2026-03-25T11:00:00Z',
    verificationMethod: 'Test booking on Apex staging reservation system',
    clickCount: 67,
    terms: 'Valid on rail travel booked at least 14 days in advance.',
    isEditorsPick: true,
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-25T11:00:00Z',
  },
  {
    id: 'cpn-omni-annual',
    merchantId: 'merch-omnioffice',
    categoryId: 'cat-software',
    title: '40% Off First Year of OmniOffice Team Plan',
    slug: 'omnioffice-40-percent-team-plan',
    code: 'TEAM40SYNC',
    description: 'Save 40% when upgrading your team to unlimited encrypted collaborative docs, spreadsheets, and task kanbans.',
    discountType: 'PERCENTAGE',
    discountValue: '40% OFF',
    affiliateUrl: 'https://omnioffice.example.com/?utm_source=couponbeee_demo&code=TEAM40SYNC',
    landingUrl: 'https://omnioffice.example.com/upgrade',
    startDate: '2026-03-01T00:00:00Z',
    expiryDate: '2026-06-30T23:59:59Z',
    status: 'ACTIVE',
    verificationStatus: 'TESTED',
    lastVerifiedAt: '2026-03-26T14:10:00Z',
    verificationMethod: 'Direct confirmation via OmniOffice partner portal',
    clickCount: 120,
    terms: 'Applies to workspaces with between 3 and 25 active seats on annual billing.',
    isEditorsPick: true,
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-03-26T14:10:00Z',
  },
  {
    id: 'cpn-old-expired',
    merchantId: 'merch-cloudforge',
    categoryId: 'cat-hosting',
    title: 'Winter Holiday 45% Flash Hosting Voucher',
    slug: 'cloudforge-winter-holiday-flash-coupon',
    code: 'WINTER45HOST',
    description: 'Holiday special promotional code for managed server migrations.',
    discountType: 'PERCENTAGE',
    discountValue: '45% OFF',
    affiliateUrl: 'https://cloudforge.example.com/?ref=couponbeee_demo',
    landingUrl: 'https://cloudforge.example.com',
    startDate: '2025-12-01T00:00:00Z',
    expiryDate: '2026-01-15T23:59:59Z',
    status: 'EXPIRED',
    verificationStatus: 'EXPIRED',
    lastVerifiedAt: '2026-01-16T08:00:00Z',
    verificationMethod: 'Expired code cleanup run',
    clickCount: 53,
    terms: 'Promotional window concluded on January 15.',
    isEditorsPick: false,
    createdAt: '2025-12-01T08:00:00Z',
    updatedAt: '2026-01-16T08:00:00Z',
  }
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-lumina-dac',
    merchantId: 'merch-lumina',
    categoryId: 'cat-electronics',
    title: 'Lumina Studio DAC Mk II Direct Sale Markdown',
    slug: 'lumina-studio-dac-mk-ii-sale',
    description: 'No code required. Direct promotional discount on reference 32-bit digital audio converter with balanced XLR outputs.',
    originalPrice: 349.00,
    salePrice: 279.00,
    discountValue: 'Save $70 (20% Off)',
    affiliateUrl: 'https://luminasound.example.com/dac-mk2?partner=couponbeee_demo',
    landingUrl: 'https://luminasound.example.com/dac-mk2',
    startDate: '2026-03-15T00:00:00Z',
    expiryDate: '2026-04-15T23:59:59Z',
    status: 'ACTIVE',
    isFeatured: true,
    clickCount: 89,
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'deal-nordic-jacket',
    merchantId: 'merch-nordic',
    categoryId: 'cat-fashion',
    title: 'Technical Merino Overshirt Seasonal Direct Special',
    slug: 'nordic-threads-merino-overshirt-deal',
    description: 'Direct discount applied on site across all seasonal earth tones while current production runs last.',
    originalPrice: 185.00,
    salePrice: 139.00,
    discountValue: 'Save $46 (25% Off)',
    affiliateUrl: 'https://nordicthreads.example.com/overshirt?partner=couponbeee',
    landingUrl: 'https://nordicthreads.example.com/overshirt',
    startDate: '2026-03-10T00:00:00Z',
    expiryDate: '2026-04-30T23:59:59Z',
    status: 'ACTIVE',
    isFeatured: true,
    clickCount: 64,
    createdAt: '2026-03-10T11:00:00Z',
    updatedAt: '2026-03-10T11:00:00Z',
  },
  {
    id: 'deal-bytecraft-bundle',
    merchantId: 'merch-bytecraft',
    categoryId: 'cat-software',
    title: 'Developer Productivity 3-Tool Utility Bundle',
    slug: 'bytecraft-3-tool-bundle-deal',
    description: 'Automatic bundle savings on purchasing API Mock, Schema Linter, and SQLite Studio together.',
    originalPrice: 120.00,
    salePrice: 79.00,
    discountValue: 'Save $41 (34% Off)',
    affiliateUrl: 'https://bytecraft-tools.example.com/bundle?aff=beee_demo',
    landingUrl: 'https://bytecraft-tools.example.com/bundle',
    startDate: '2026-03-01T00:00:00Z',
    expiryDate: '2026-12-31T23:59:59Z',
    status: 'ACTIVE',
    isFeatured: false,
    clickCount: 52,
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-coupon-verification-guide',
    title: 'The Architecture of Real Coupon Verification: Why Codes Fail and How We Test Them',
    slug: 'architecture-of-coupon-verification',
    excerpt: 'An inside look at our editorial verification pipeline, testing methodologies, merchant checkout consoles, and why automated scraping creates broken coupon databases.',
    content: `## The Problem with Traditional Coupon Aggregators

If you have spent any time shopping online, you know the frustration: clicking through dozens of coupon aggregator websites, copying code after code ("SAVE90", "FREESHIP2026", "WORKING100"), only to see the merchant checkout prompt: *"This promotional code is invalid or has expired."*

Most legacy coupon aggregators operate by scraping outdated forums, guessing random alphanumeric combinations, or recycling expired codes for search traffic. They prioritize quantity over accuracy.

At **CouponBeee**, we built our platform around a fundamental rule: **a coupon is never labeled "Verified" unless an editor or automated verified integration has actively tested it in an authentic checkout scenario.**

---

## 1. How Our Verification Workflow Operates

Before any coupon receives our green "Tested & Verified" badge, it must complete our editorial inspection protocol:

1. **Cart Simulation**: Our verification editors add authentic qualifying items to a staging or live shopping bag on the merchant's official storefront.
2. **Code Insertion**: We input the coupon token into the merchant's checkout module and trigger evaluation.
3. **Discount Calculation**: We record whether the deduction matches the promised percentage, fixed dollar amount, or free shipping threshold.
4. **Terms & Restriction Logging**: We identify any hidden minimum spends, excluded product categories, or customer status requirements (e.g., new customer only).
5. **Timestamp Recording**: We attach the exact test timestamp and testing method to the verification log.

---

## 2. Common Reasons Valid Promo Codes Fail

Even when a code is active, several legitimate factors can prevent it from applying:

- **Exclusion of Sale Items**: Many merchants disallow code stacking on top of clearance or already-discounted goods.
- **Minimum Spend Hurdles**: Subtotals before sales tax or shipping might fall short of the qualifying threshold.
- **Single-Use Tokens**: Many retailers issue unique, single-use codes via email that cannot be shared publicly.
- **Account Tier Requirements**: Codes might require signing in with an existing loyalty account or university email.

---

## 3. Transparent Verification Logs

When you view a coupon on CouponBeee, click on **"Verification History"** or look for the verified timestamp. You can see precisely when our staff last ran an evaluation and what notes were logged.

If you ever discover an issue with any listed voucher, our one-click **"Report a Problem"** button sends an immediate alert to our team to re-test or retire the code within hours.`,
    authorName: 'Marcus Lindqvist, Head of Verification',
    category: 'Guides & Transparency',
    isPublished: true,
    metaTitle: 'How Coupon Verification Works | CouponBeee Guide',
    metaDescription: 'Learn why online coupon codes fail and how CouponBeee tests promotional vouchers before marking them verified.',
    readTimeMinutes: 6,
    publishedAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-24T12:00:00Z',
  },
  {
    id: 'blog-percentage-vs-fixed-discount',
    title: 'Percentage vs. Fixed Amount: The Math Behind Maximizing Checkout Savings',
    slug: 'percentage-vs-fixed-discount-savings-math',
    excerpt: 'When facing two competing discount codes at checkout, here is how to calculate the optimal choice based on your order subtotal and shipping costs.',
    content: `## Comparing Competing Offers

Online shoppers frequently face a choice at checkout: should you apply a **"20% Off Your Entire Order"** code, or an alternative voucher for **"$30 Off Orders Over $100"**?

The answer hinges on a simple mathematical inflection point.

---

## Finding the Breakeven Order Value

Let $P$ represent the percentage discount (e.g., $0.20$ for 20%), and $F$ represent the fixed dollar deduction (e.g., $30$).

The breakeven order value $V$ is given by:

$$V = \\frac{F}{P}$$

For a $30 fixed voucher versus a 20% discount:

$$V = \\frac{30}{0.20} = 150$$

- **Orders Below $150**: The **fixed $30 voucher** yields greater savings. For instance, on a $110 order, 20% saves only $22, whereas the $30 code saves $30.
- **Orders Above $150**: The **20% code** wins. On a $200 order, 20% deducts $40, beating the $30 flat discount by $10.
- **At Exactly $150**: Both codes provide identical $30 deductions.

---

## Don't Forget Free Shipping Thresholds

Always inspect whether applying a discount code reduces your subtotal beneath the merchant's free shipping minimum. If a $20 discount drops your cart from $105 to $85, and the merchant charges $15 for standard delivery on orders under $100, your net savings shrink to just $5!

On CouponBeee, we always display merchant free shipping policies alongside our coupon codes so you can evaluate the true net total.`,
    authorName: 'Elena Rostova, Senior Savings Editor',
    category: 'Shopping Strategy',
    isPublished: true,
    metaTitle: 'Percentage vs Fixed Discount Math | CouponBeee',
    metaDescription: 'Master the breakeven math between percentage discounts and dollar-off coupons to maximize your online savings.',
    readTimeMinutes: 4,
    publishedAt: '2026-03-15T09:00:00Z',
    updatedAt: '2026-03-22T15:00:00Z',
  },
  {
    id: 'blog-safe-online-coupons',
    title: 'Safe Shopping: How to Avoid Malicious Browser Extensions & Fake Coupon Scams',
    slug: 'safe-online-coupons-and-scam-prevention',
    excerpt: 'Crucial cybersecurity advice for savvy shoppers. Protect your personal data, browser privacy, and payment methods from predatory aggregators.',
    content: `## The Risks in the Coupon Ecosystem

As online shopping has expanded, predatory actors have turned coupon discovery into a vector for data harvesting, unauthorized affiliate cookie stuffing, and invasive browser extensions.

Here are fundamental principles to protect yourself while saving money online:

---

### 1. Never Pay for a Coupon or Promo Code
Legitimate promotional codes are distributed by merchants or approved marketing partners for free. Any site asking you to complete a paid survey or pay for an "exclusive coupon book" is fraudulent.

### 2. Audit Browser Extension Permissions
Many third-party coupon extensions request permissions to "Read and change all your data on all websites you visit". This grants the extension technical capability to intercept keystrokes, monitor browsing histories, and inject affiliate cookies even when no coupon was used. Prefer clean web platforms like CouponBeee that require zero installations.

### 3. Verify the Target Domain
Always examine your browser's address bar after clicking an outbound link. Ensure the destination domain matches the official merchant domain (e.g., \`store.example.com\`) rather than an intermediate parked ad page.

### 4. Check for Clear Affiliate Disclosures
Trustworthy platforms clearly state how they operate. At CouponBeee, we maintain full transparency regarding our affiliate partnerships on every page and in our dedicated Affiliate Disclosure.`,
    authorName: 'David Kalu, Security & Consumer Protection',
    category: 'Consumer Security',
    isPublished: true,
    metaTitle: 'Safe Online Coupon Usage & Scam Prevention | CouponBeee',
    metaDescription: 'Protect your digital privacy and avoid predatory browser extensions with our consumer safety guide.',
    readTimeMinutes: 5,
    publishedAt: '2026-03-05T14:00:00Z',
    updatedAt: '2026-03-20T11:00:00Z',
  },
  {
    id: 'blog-hostinger-coupon-guide-2026',
    title: 'Hostinger Coupon Code & Cloud Promo Guide (2026): How to Save Up to 85% + Free Domain',
    slug: 'hostinger-coupon-code-promo-guide-2026',
    excerpt: 'Detailed insider walkthrough on how to maximize discounts on Hostinger Premium, Business, and Cloud VPS plans with verified stackable promo codes.',
    content: `## Maximizing Your Hostinger Hosting Discount

Hostinger has emerged as one of the most reliable and cost-effective cloud hosting solutions in the world, powering over 3 million websites globally. With LiteSpeed web server technology, NVMe SSD storage, and free domain registration, it is the top choice for developers, agencies, and small businesses.

In this guide, we break down how to get the absolute lowest checkout price on Hostinger using CouponBeee's verified promo codes.

---

### Step 1: Choose the 48-Month Billing Cycle
Hostinger offers tiered baseline discounts depending on the contract length:
- **1 Month**: Full retail price ($11.99/mo)
- **12 Months**: 60% baseline discount ($4.99/mo)
- **24 Months**: 70% baseline discount ($3.99/mo)
- **48 Months**: Up to 80% baseline discount ($2.99/mo) + 3 Free Months!

Selecting the 48-month commitment locks in the lowest monthly rate for 4 full years and protects you against early renewal price jumps.

---

### Step 2: Stack the CouponBeee Verified Promo Code
On the Hostinger checkout screen:
1. Locate the **"Have a coupon code?"** link beneath the order total.
2. Enter the verified code **BEEEHOST85** or **SAVE10EXTRA**.
3. Click **Apply**.
4. An extra 7% to 10% will be deducted from your already discounted total!

---

### Step 3: Claim Your Free Custom Domain & Unlimited SSL
All 12-month or longer plans include:
- Free custom .com or .net domain for the first year (saves $12.99)
- Free Cloudflare-protected nameservers
- Free automated daily or weekly backups
- Unlimited free Let's Encrypt SSL certificates for all subdomains

Visit our dedicated [Hostinger Store Page](/stores/hostinger) on CouponBeee for today's active verified codes.`,
    authorName: 'Alex Mercer, Cloud & Infrastructure Lead',
    category: 'Hosting & Cloud',
    isPublished: true,
    metaTitle: 'Hostinger Coupon Code & Promo Guide 2026 | Up to 85% Off',
    metaDescription: 'Step-by-step guide to saving up to 85% on Hostinger web hosting, cloud VPS, and WordPress with verified promo codes.',
    readTimeMinutes: 7,
    publishedAt: '2026-03-22T08:00:00Z',
    updatedAt: '2026-03-26T14:00:00Z',
  },
  {
    id: 'blog-top-10-tech-coupons-2026',
    title: 'Top 10 Tech & Developer Discounts That Actually Work in 2026',
    slug: 'top-10-tech-and-developer-discounts-2026',
    excerpt: 'Tested vouchers for cloud servers, developer tools, hardware, VPN security, and creative design software.',
    content: `## Verified Savings for Digital Creators & Tech Professionals

Finding real promo codes in the tech space can be challenging. Many vendors only run promotional sales during Black Friday or back-to-school windows.

Here are the top 10 verified tech discounts curated by our editorial team:

1. **Hostinger**: Up to 85% off cloud hosting + free domain with code \`BEEEHOST85\`. [View Hostinger Coupons](/stores/hostinger).
2. **NordVPN**: 74% off 2-year cybersecurity + 3 extra months free with code \`BEEEVPN74\`. [View NordVPN Coupons](/stores/nordvpn).
3. **Amazon**: Up to 50% off daily tech lightning vouchers. [View Amazon Deals](/stores/amazon).
4. **Nike**: 25% off qualifying athletic styles for Nike Members. [View Nike Codes](/stores/nike).
5. **Namecheap**: Up to 80% off domain registrations and transfers. [View Namecheap Codes](/stores/namecheap).
6. **Canva**: Extended 30-day trial of Canva Pro with Magic AI Studio. [View Canva Offers](/stores/canva).
7. **Best Buy**: Deal of the day savings on 4K TVs, monitors, and laptops. [View Best Buy Deals](/stores/bestbuy).
8. **Apple**: Student education pricing saving up to $150 on MacBooks and iPads. [View Apple Store Discounts](/stores/apple).
9. **Booking.com**: Up to 20% off Genius loyalty room rates. [View Booking Deals](/stores/booking-com).
10. **Bluehost**: 75% off WordPress hosting with free domain. [View Bluehost Offers](/stores/bluehost).

All codes listed above are tested weekly on live checkout modules by CouponBeee editors.`,
    authorName: 'Sarah Jenkins, Tech Commerce Editor',
    category: 'Tech & Lifestyle',
    isPublished: true,
    metaTitle: 'Top 10 Tech & Developer Coupons (2026 Verified)',
    metaDescription: 'Discover 10 verified tech, hosting, and software promo codes tested by CouponBeee editors.',
    readTimeMinutes: 5,
    publishedAt: '2026-03-24T11:00:00Z',
    updatedAt: '2026-03-26T16:00:00Z',
  }
];

export const INITIAL_FAQS: Faq[] = [
  {
    id: 'faq-1',
    question: 'How does CouponBeee verify coupons and deals?',
    answer: 'Unlike automated scrapers, CouponBeee employs a dedicated editorial verification workflow. When an administrator tests a voucher on the merchant’s live checkout console, the test result, notes, and timestamp are recorded in our verification log. Only codes with successful verification records receive our "Tested & Verified" mark.',
    category: 'Verification & Quality',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'faq-2',
    question: 'Why did a listed promo code not work at checkout?',
    answer: 'Retailers frequently enforce fine print: exclusions on certain brands, restrictions to new account holders, minimum order thresholds, or sudden expirations. If a code fails, please click "Report a Problem" on the coupon card so our staff can investigate, update the terms, or retire the code.',
    category: 'Using Coupons',
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: 'faq-3',
    question: 'How does CouponBeee make money?',
    answer: 'CouponBeee is free for all shoppers. We earn an affiliate commission from select partner merchants when you click our outbound links or use our verified promo codes and make a qualifying purchase. This compensation never increases the price you pay and allows us to maintain our manual verification team.',
    category: 'Affiliate & Business Model',
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: 'faq-4',
    question: 'Can I submit a coupon code I found?',
    answer: 'Yes! Shoppers can submit community promo codes via our Contact page. Our editorial team validates every submission before publishing it to prevent spam or non-functional codes.',
    category: 'Community',
    sortOrder: 4,
    isPublished: true,
  }
];

export const INITIAL_VERIFICATION_LOGS: VerificationLog[] = [
  {
    id: 'vlog-1',
    couponId: 'cpn-cf-30',
    adminId: 'admin-1',
    adminName: 'Marcus Lindqvist (Senior Editor)',
    previousStatus: 'UNVERIFIED',
    newStatus: 'TESTED',
    testResult: 'SUCCESS',
    verificationMethod: 'Staff test on CloudForge checkout console with live order validation',
    notes: 'Confirmed 30% reduction applied to 12-month Pro NVMe tier.',
    testedAt: '2026-03-26T11:15:00Z',
  },
  {
    id: 'vlog-2',
    couponId: 'cpn-byte-25',
    adminId: 'admin-1',
    adminName: 'Marcus Lindqvist (Senior Editor)',
    previousStatus: 'UNVERIFIED',
    newStatus: 'TESTED',
    testResult: 'SUCCESS',
    verificationMethod: 'Automated cart validation with merchant API',
    notes: 'Confirmed deduction from $99 down to $74.25 on Pro perpetual license.',
    testedAt: '2026-03-25T14:20:00Z',
  },
  {
    id: 'vlog-3',
    couponId: 'cpn-lumina-50',
    adminId: 'admin-2',
    adminName: 'Elena Rostova (Verification Editor)',
    previousStatus: 'UNVERIFIED',
    newStatus: 'TESTED',
    testResult: 'SUCCESS',
    verificationMethod: 'Manual checkout simulation on Lumina store',
    notes: 'Subtotal adjusted by -$50 when cart included reference planar headphones.',
    testedAt: '2026-03-23T16:45:00Z',
  }
];

export const INITIAL_REPORTS: CouponReport[] = [
  {
    id: 'rep-1',
    couponId: 'cpn-aerovolt-15',
    reason: 'CODE_DOES_NOT_WORK',
    userComment: 'Tried applying on the 65W charger and got invalid code error. Might only work on 100W+ models.',
    userEmail: 'shopper@example.com',
    status: 'PENDING',
    adminNote: 'Needs re-testing on different wattage categories.',
    createdAt: '2026-03-26T15:30:00Z',
    updatedAt: '2026-03-26T15:30:00Z',
  }
];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'audit-1',
    adminName: 'System Administrator',
    action: 'SEED_INITIAL_DATA',
    entityType: 'System',
    entityId: 'initial-setup',
    details: 'Initial deployment with 8 merchants, 10 coupons, and 3 deals.',
    createdAt: '2026-03-27T00:00:00Z',
  },
  {
    id: 'audit-2',
    adminName: 'Marcus Lindqvist',
    action: 'VERIFY_COUPON',
    entityType: 'Coupon',
    entityId: 'cpn-cf-30',
    details: 'Verified 30% Off CloudForge VPS code after checkout simulation.',
    createdAt: '2026-03-26T11:15:00Z',
  }
];
