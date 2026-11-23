// Realistic Government Scheme Database for SchemeSathi Prototype
const SCHEMES_DATABASE = [
  {
    id: "pm-kisan",
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    benefit: "₹6,000 per year (in 3 installments of ₹2,000) directly into bank account via DBT",
    targetGroup: "Small & Marginal Farmers",
    officialSummary: "Central Sector scheme with 100% funding from Government of India to provide income support to all landholding farmers' families in the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities.",
    simpleExplanation: "If you or your family owns cultivable farmland, the Central Government will send ₹2,000 straight into your bank account every 4 months (total ₹6,000 per year). No middlemen or agent fees.",
    simpleExplanationHi: "यदि आपके पास खेती योग्य भूमि है, तो केंद्र सरकार हर 4 महीने में ₹2,000 (सालाना ₹6,000) सीधे आपके बैंक खाते में भेजेगी।",
    criteria: {
      occupation: ["farmer"],
      maxIncome: 800000,
      minAge: 18,
      maxAge: 100,
      gender: ["male", "female", "other"],
      requiresLand: true
    },
    documents: [
      { name: "Aadhaar Card", mandatory: true, description: "Must be linked to your primary bank account" },
      { name: "Land Ownership Record (Khatauni / 7/12 / Patta)", mandatory: true, description: "Certified copy of land revenue records showing your name" },
      { name: "Active Bank Account Passbook", mandatory: true, description: "NPCI seeded for Aadhaar Enabled Payment System (AePS)" },
      { name: "Citizenship / Domicile Certificate", mandatory: false, description: "State resident proof" }
    ],
    applicationSteps: [
      "Visit the official portal at pmkisan.gov.in or your nearest Common Service Centre (CSC).",
      "Click on 'Farmers Corner' -> 'New Farmer Registration'.",
      "Enter Aadhaar number and select state, enter land record details & bank account IFSC.",
      "Complete e-KYC using Aadhaar OTP or biometric at CSC."
    ],
    officialUrl: "https://pmkisan.gov.in",
    helpline: "155261 / 011-24300606",
    matchTags: ["farmer", "rural", "income-support", "landowner"]
  },
  {
    id: "ayushman-bharat",
    title: "Ayushman Bharat - PM-JAY (Pradhan Mantri Jan Arogya Yojana)",
    ministry: "Ministry of Health and Family Welfare",
    category: "Healthcare",
    benefit: "Free health insurance coverage up to ₹5,00,000 per family per year for secondary & tertiary hospital care",
    targetGroup: "Low-income, BPL, and Vulnerable Families",
    officialSummary: "A flagship health assurance scheme aiming to provide health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families based on SECC 2011 database.",
    simpleExplanation: "A 'Golden Card' that gives you and your entire family free medical treatment and surgery up to ₹5 Lakhs every year in any empanelled private or government hospital across India. You don't have to pay cash up front.",
    simpleExplanationHi: "यह गोल्डन कार्ड आपको और आपके पूरे परिवार को देश के किसी भी सरकारी या प्राइवेट अस्पताल में ₹5 लाख तक का सालाना मुफ्त इलाज दिलाता है।",
    criteria: {
      occupation: ["farmer", "daily-wage", "unemployed", "small-business", "homemaker", "senior"],
      maxIncome: 300000,
      minAge: 0,
      maxAge: 100,
      gender: ["male", "female", "other"],
      requiresBpl: true
    },
    documents: [
      { name: "Aadhaar Card", mandatory: true, description: "Of all family members seeking coverage" },
      { name: "Ration Card (BPL / Antyodaya / Priority HH)", mandatory: true, description: "Valid NFSA / state ration card" },
      { name: "Active Mobile Number", mandatory: true, description: "For OTP verification" },
      { name: "Income Certificate", mandatory: false, description: "Issued by Tehsildar/Revenue Officer" }
    ],
    applicationSteps: [
      "Check eligibility at beneficiaries.nha.gov.in or visit any empaneled hospital / CSC.",
      "Authenticate your identity using Aadhaar OTP or fingerprint.",
      "Verify family members listed in your Ration Card.",
      "Download your Ayushman Golden Card instantly on your phone or print at CSC."
    ],
    officialUrl: "https://beneficiary.nha.gov.in",
    helpline: "14555",
    matchTags: ["health", "bpl", "insurance", "hospital"]
  },
  {
    id: "pm-mudra",
    title: "Pradhan Mantri MUDRA Yojana (PMMY)",
    ministry: "Ministry of Finance",
    category: "Business & Loans",
    benefit: "Collateral-free business loans up to ₹10 Lakhs (Shishu: up to ₹50K, Kishore: ₹50K-₹5L, Tarun: ₹5L-₹10L) at low interest",
    targetGroup: "Small shopkeepers, Artisans, Vendors, Micro-entrepreneurs",
    officialSummary: "A scheme launched to provide loans up to 10 lakhs to the non-corporate, non-farm small/micro enterprises without any collateral requirement to foster self-employment and micro business expansion.",
    simpleExplanation: "Want to start or expand a shop, workshop, food stall, or service business? You can get a loan from ₹50,000 up to ₹10 Lakhs from any bank without keeping your house or land as mortgage (collateral-free).",
    simpleExplanationHi: "अगर आप कोई दुकान, ढाबा या छोटा व्यवसाय शुरू या बड़ा करना चाहते हैं, तो बिना जमीन या घर गिरवी रखे ₹50,000 से ₹10 लाख तक का सस्ता लोन ले सकते हैं।",
    criteria: {
      occupation: ["small-business", "daily-wage", "unemployed"],
      maxIncome: 1500000,
      minAge: 18,
      maxAge: 65,
      gender: ["male", "female", "other"]
    },
    documents: [
      { name: "Aadhaar Card & PAN Card", mandatory: true, description: "Identity & Tax KYC" },
      { name: "Proof of Business Address", mandatory: true, description: "Shop license, electricity bill, or rent agreement" },
      { name: "Last 6 Months Bank Statement", mandatory: true, description: "Personal or current account" },
      { name: "Business Quotation / Project Report", mandatory: true, description: "Cost breakdown of machinery or stock to be purchased" }
    ],
    applicationSteps: [
      "Prepare a 1-page business plan or equipment purchase quotation.",
      "Apply online on Udyamimitra portal (udyamimitra.in) or visit any commercial bank / regional rural bank.",
      "Submit the MUDRA loan application along with KYC and business proof.",
      "Loan sanctions typically occur within 7 to 15 working days."
    ],
    officialUrl: "https://www.mudra.org.in",
    helpline: "1800-180-1111",
    matchTags: ["business", "loan", "entrepreneur", "self-employed"]
  },
  {
    id: "nsp-post-matric",
    title: "Post-Matric Scholarship Scheme (SC / ST / OBC / EWS)",
    ministry: "Ministry of Social Justice & Empowerment",
    category: "Education",
    benefit: "Full tuition fee reimbursement + monthly maintenance allowance (up to ₹13,500/year for hostellers, ₹7,000 for day scholars)",
    targetGroup: "College & University Students from SC/ST/OBC/Minority/EWS backgrounds",
    officialSummary: "Centrally Sponsored Scheme providing financial assistance to students studying at post-matriculation or post-secondary stage to enable them to complete their higher education.",
    simpleExplanation: "If you are in college, diploma, or university and belong to SC, ST, or OBC/EWS, government covers your college fees and gives monthly cash into your bank for books and living expenses.",
    simpleExplanationHi: "कॉलेज, डिग्री या डिप्लोमा की पढ़ाई कर रहे SC/ST/OBC/EWS छात्रों की कॉलेज फीस सरकार भरेगी, साथ ही किताबों और रहने के लिए महीने का खर्च भी देगी।",
    criteria: {
      occupation: ["student"],
      caste: ["sc", "st", "obc", "ews"],
      maxIncome: 250000,
      minAge: 16,
      maxAge: 30,
      gender: ["male", "female", "other"]
    },
    documents: [
      { name: "Caste / Category Certificate", mandatory: true, description: "Issued by authorized Tehsildar or competent authority" },
      { name: "Income Certificate (< ₹2.5 LPA)", mandatory: true, description: "Current financial year family income certificate" },
      { name: "College Admission Fee Receipt & Bonafide", mandatory: true, description: "Proof of enrollment in recognized institution" },
      { name: "Previous Year Marksheets (Class 10/12/Sem)", mandatory: true, description: "With passing marks (min 50%)" },
      { name: "Aadhaar Linked Bank Passbook", mandatory: true, description: "Student's own active bank account" }
    ],
    applicationSteps: [
      "Register on National Scholarship Portal (scholarships.gov.in) with Aadhaar OTR.",
      "Fill scholarship application form & upload marksheets, caste & income certificates.",
      "Submit form online; your college nodal officer verifies your details.",
      "District officer approves and scholarship amount is credited via DBT."
    ],
    officialUrl: "https://scholarships.gov.in",
    helpline: "0120-6619540",
    matchTags: ["student", "scholarship", "college", "fees", "sc", "st", "obc"]
  },
  {
    id: "standup-india",
    title: "Stand-Up India Scheme (For Women & SC/ST Entrepreneurs)",
    ministry: "Ministry of Finance",
    category: "Women Empowerment",
    benefit: "Bank loans between ₹10 Lakhs and ₹1 Crore for setting up a greenfield enterprise (manufacturing, services, agri-allied, or trading)",
    targetGroup: "Women of all categories & SC/ST individuals aspiring to launch enterprises",
    officialSummary: "Facilitates bank loans between 10 lakh and 1 crore to at least one SC/ST borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.",
    simpleExplanation: "Are you a woman or SC/ST citizen with a dream to start a factory, diagnostic center, bakery, or trading firm? Every bank branch is mandated to give ₹10 Lakh to ₹1 Crore loan to at least one woman and one SC/ST entrepreneur.",
    simpleExplanationHi: "यदि आप महिला या SC/ST नागरिक हैं और नया उद्योग या व्यवसाय शुरू करना चाहती हैं, तो बैंक से ₹10 लाख से ₹1 करोड़ तक का भारी लोन आसानी से मिल सकता है।",
    criteria: {
      occupation: ["small-business", "unemployed", "homemaker"],
      gender: ["female"],
      special: ["sc", "st", "women"],
      minAge: 18,
      maxAge: 65
    },
    documents: [
      { name: "Identity & Address Proof (Aadhaar/Passport/Voter ID)", mandatory: true, description: "Personal verification" },
      { name: "Caste Certificate (if applying under SC/ST)", mandatory: false, description: "Not required for general women applicants" },
      { name: "Detailed Project Report (DPR)", mandatory: true, description: "Financial projections and business model summary" },
      { name: "Pollution Clearance / Trade License (if applicable)", mandatory: false, description: "Based on business category" }
    ],
    applicationSteps: [
      "Visit standupmitra.in and complete the online readiness questionnaire.",
      "Upload your project profile and choose a preferred bank branch.",
      "Get connected to handholding agencies for business plan polishing.",
      "Bank evaluates and releases initial loan disbursement."
    ],
    officialUrl: "https://www.standupmitra.in",
    helpline: "1800-180-1111",
    matchTags: ["women", "business", "sc", "st", "startup", "high-value-loan"]
  },
  {
    id: "pm-svanidhi",
    title: "PM SVANidhi (PM Street Vendor's AtmaNirbhar Nidhi)",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Livelihood & Urban Poor",
    benefit: "Micro-credit working capital loan: 1st tranche ₹10,000, 2nd tranche ₹20,000, 3rd tranche ₹50,000 with 7% interest subsidy & cashback on digital transactions",
    targetGroup: "Street vendors, hawkers, roadside cart owners in urban & peri-urban areas",
    officialSummary: "A special micro-credit facility for street vendors to provide affordable working capital loans to resume their livelihoods affected by economic disruptions.",
    simpleExplanation: "If you sell tea, vegetables, fast food, flowers, or merchandise on a roadside stall, you get ₹10,000 immediately without collateral. When you repay on time, you get ₹20,000 and next ₹50,000 with interest discount and monthly UPI cashback.",
    simpleExplanationHi: "सड़क किनारे ठेला, चाय, फल या सब्जी लगाने वाले भाई-बहनों को बिना गारंटी ₹10,000 का लोन। समय पर चुकाने पर ₹20,000 और फिर ₹50,000 का बड़ा लोन और कैशबैक।",
    criteria: {
      occupation: ["daily-wage", "small-business"],
      area: ["urban", "peri-urban"],
      maxIncome: 200000,
      minAge: 18,
      maxAge: 70,
      gender: ["male", "female", "other"]
    },
    documents: [
      { name: "Aadhaar Card", mandatory: true, description: "Linked with mobile number for OTP" },
      { name: "Vending Certificate / Identity Card / Letter of Recommendation (LoR)", mandatory: true, description: "Issued by Urban Local Body (ULB) / Town Vending Committee" },
      { name: "Bank Account Details", mandatory: true, description: "Active savings account" }
    ],
    applicationSteps: [
      "Check vending census list or obtain Letter of Recommendation from local Municipality.",
      "Apply through pmsvanidhi.mohua.gov.in or via Banking Correspondent / CSC.",
      "Choose preferred lender (Lending institution like SBI, PNB, or microfinance bank).",
      "Loan disbursed directly to bank account within 3 to 7 days."
    ],
    officialUrl: "https://pmsvanidhi.mohua.gov.in",
    helpline: "1800-113-111",
    matchTags: ["vendor", "hawker", "urban", "loan", "microfinance"]
  },
  {
    id: "pm-vishwakarma",
    title: "PM Vishwakarma Scheme",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    category: "Artisans & Craftsmen",
    benefit: "PM Vishwakarma Certificate & ID, ₹15,000 toolkit incentive, free skill training with ₹500/day stipend, and collateral-free loan up to ₹3 Lakhs at concessional 5% interest",
    targetGroup: "18 traditional trades (Carpenters, Blacksmiths, Potters, Cobblers, Tailors, Weavers, Barbers, Sculptors, etc.)",
    officialSummary: "A comprehensive initiative to provide end-to-end support to artisans and craftspeople who work with their hands and tools, enhancing the quality and market reach of their products.",
    simpleExplanation: "Traditional hand-workers (like tailors, carpenters, potters, blacksmiths, barbers, washermen) get ₹15,000 free for modern tools, 5 days paid training (₹500 per day), an official master craftsman certificate, and loans up to ₹3 Lakhs at just 5% interest.",
    simpleExplanationHi: "दर्जी, बढ़ई, लोहार, कुम्हार, मोची, धोबी और नाई भाइयों को ₹15,000 फ्री टूलकिट, ₹500 रोजाना वजीफे के साथ फ्री ट्रेनिंग और सिर्फ 5% ब्याज पर ₹3 लाख तक का लोन।",
    criteria: {
      occupation: ["daily-wage", "small-business", "artisan"],
      minAge: 18,
      maxAge: 65,
      gender: ["male", "female", "other"]
    },
    documents: [
      { name: "Aadhaar Card", mandatory: true, description: "Identity verification" },
      { name: "Mobile linked to Aadhaar", mandatory: true, description: "For biometrics and verification" },
      { name: "Bank Passbook", mandatory: true, description: "For toolkit grant credit" },
      { name: "Ration Card", mandatory: true, description: "To ensure single beneficiary per family" }
    ],
    applicationSteps: [
      "Visit nearest Common Service Centre (CSC) with Aadhaar and mobile.",
      "Complete biometric registration for your specific trade.",
      "Gram Panchayat or Urban Local Body verifies trade practice.",
      "Receive digital ID, attend 5-7 days skill training, and receive ₹15,000 tool voucher."
    ],
    officialUrl: "https://pmvishwakarma.gov.in",
    helpline: "1800-267-7777",
    matchTags: ["artisan", "tailor", "carpenter", "craftsman", "tools", "loan"]
  },
  {
    id: "sukanya-samriddhi",
    title: "Sukanya Samriddhi Yojana (SSY)",
    ministry: "Ministry of Finance",
    category: "Women & Child",
    benefit: "High guaranteed interest rate (8.2% p.a.), complete tax exemption (EEE) under Section 80C, maturity corpus of ₹20-50 Lakhs for daughter's higher education & marriage",
    targetGroup: "Parents / Legal Guardians of girl children aged 0 to 10 years",
    officialSummary: "A government-backed savings scheme targeted at the parents of girl children, designed to encourage parents to build a fund for the future education and marriage expenses of their female child.",
    simpleExplanation: "If you have a daughter below 10 years, open an account with as little as ₹250. The government gives the highest safe interest (8.2%) with zero income tax. By the time she turns 21 or enters university, you have a massive lump sum for her dreams.",
    simpleExplanationHi: "10 साल से कम उम्र की बेटी के नाम पर सिर्फ ₹250 से खाता खोलें। सरकार सबसे ज्यादा 8.2% ब्याज देगी और पूरा पैसा टैक्स-फ्री होगा, जो बेटी की उच्च शिक्षा और भविष्य को सुरक्षित करेगा।",
    criteria: {
      occupation: ["farmer", "student", "small-business", "daily-wage", "salaried", "homemaker"],
      gender: ["female", "male", "other"], // parent applying
      hasGirlChildUnder10: true,
      minAge: 18,
      maxAge: 70
    },
    documents: [
      { name: "Birth Certificate of the Girl Child", mandatory: true, description: "Issued by municipal authority/hospital" },
      { name: "Aadhaar / PAN Card of Parent/Guardian", mandatory: true, description: "KYC of applicant" },
      { name: "Address Proof", mandatory: true, description: "Electricity bill, voter ID, or passport" },
      { name: "Passport size photographs of child and parent", mandatory: true, description: "For account opening form" }
    ],
    applicationSteps: [
      "Collect the SSY account opening form from any Post Office or authorized commercial bank branch.",
      "Fill the form and attach daughter's birth certificate and your KYC documents.",
      "Deposit initial minimum amount of ₹250 (cash, cheque, or DD).",
      "Receive passbook with account number. Deposits can be made online via IPPB or netbanking."
    ],
    officialUrl: "https://www.indiapost.gov.in",
    helpline: "1800-266-6868",
    matchTags: ["girl-child", "savings", "tax-free", "education", "daughter"]
  },
  {
    id: "pm-awas-yojana",
    title: "Pradhan Mantri Awas Yojana (PMAY-Gramin & Urban 2.0)",
    ministry: "Ministry of Housing and Urban Affairs / Rural Development",
    category: "Housing",
    benefit: "Financial grant up to ₹1.20 - ₹1.30 Lakhs for rural pacca house construction, or interest subsidy up to ₹1.80 Lakhs on home loans for urban poor",
    targetGroup: "Homeless families or households living in kutcha/dilapidated houses",
    officialSummary: "A comprehensive housing mission to provide all-weather pucca houses with basic amenities like piped water, electricity, and sanitation to all eligible rural and urban families.",
    simpleExplanation: "If your family does not own a concrete (pucca) house anywhere in India, the government gives you direct cash funds (up to ₹1.30 Lakhs) plus 90 days MGNREGA wages to construct your own permanent home.",
    simpleExplanationHi: "अगर आपका खुद का पक्का मकान नहीं है, तो सरकार पक्का घर बनाने के लिए सीधे ₹1.20 से ₹1.30 लाख की नकद सहायता और शौचालय के लिए अलग से पैसे देती है।",
    criteria: {
      occupation: ["farmer", "daily-wage", "unemployed", "small-business", "homemaker"],
      maxIncome: 300000,
      minAge: 18,
      maxAge: 85,
      gender: ["male", "female", "other"],
      noPaccaHouse: true
    },
    documents: [
      { name: "Aadhaar Card", mandatory: true, description: "Of all adult family members" },
      { name: "Bank Passbook with IFSC", mandatory: true, description: "For direct phased subsidy transfers" },
      { name: "MGNREGA Job Card Number", mandatory: false, description: "For unskilled labour wage entitlement" },
      { name: "Swachh Bharat Mission (SBM) Toilet Registration No", mandatory: false, description: "For additional toilet construction incentive" },
      { name: "Land / Plot Ownership document or NOC", mandatory: true, description: "Proof of site where house will be built" }
    ],
    applicationSteps: [
      "Contact your Gram Panchayat Secretary / Ward Councilor or register on pmayg.nic.in / pmay-urban.gov.in.",
      "Geo-tagging and site inspection of current kutcha house by village nodal officer.",
      "Beneficiary sanction order generated and published on AwaasSoft portal.",
      "Installments released in 3 stages linked to construction progress (Foundation, Lintel, Completion)."
    ],
    officialUrl: "https://pmayg.nic.in",
    helpline: "1800-11-6446",
    matchTags: ["house", "housing", "pucca-house", "rural", "urban", "bpl"]
  },
  {
    id: "atal-pension",
    title: "Atal Pension Yojana (APY)",
    ministry: "Ministry of Finance (PFRDA)",
    category: "Social Security & Pension",
    benefit: "Guaranteed monthly pension between ₹1,000 and ₹5,000 for life after age 60, with return of corpus to spouse/nominee",
    targetGroup: "Unorganized sector workers, daily-wagers, gig workers aged 18 to 40 years",
    officialSummary: "A guaranteed pension scheme for all citizens in the unorganized sector administered through PFRDA under the National Pension System (NPS) architecture.",
    simpleExplanation: "A secure government pension for workers who don't have corporate Provident Fund (PF). Invest a tiny amount (like ₹42 to ₹210 per month starting at young age), and after age 60 you will receive a guaranteed monthly salary for life.",
    simpleExplanationHi: "असंगठित क्षेत्र के कामगारों के लिए सरकारी पेंशन योजना। हर महीने बस ₹50 से ₹200 जमा करें, और 60 की उम्र के बाद जीवनभर ₹1,000 से ₹5,000 की पक्की मासिक पेंशन पाएं।",
    criteria: {
      occupation: ["daily-wage", "farmer", "small-business", "unemployed", "homemaker"],
      minAge: 18,
      maxAge: 40,
      gender: ["male", "female", "other"]
    },
    documents: [
      { name: "Aadhaar Card", mandatory: true, description: "Identity & proof of age" },
      { name: "Savings Bank Account / Post Office Account", mandatory: true, description: "Must have auto-debit facility enabled" },
      { name: "Nominee Aadhaar Details", mandatory: true, description: "Spouse or dependent nominee" }
    ],
    applicationSteps: [
      "Visit the bank branch where you have an active savings account.",
      "Fill the APY registration form with nominee details and select desired pension slab (₹1K to ₹5K).",
      "Ensure sufficient balance on the designated auto-debit date every month.",
      "Download your Permanent Retirement Account Number (PRAN) card online via NSDL portal."
    ],
    officialUrl: "https://www.npscra.nsdl.co.in",
    helpline: "1800-110-069",
    matchTags: ["pension", "retirement", "unorganized", "monthly-income", "elderly"]
  }
];
