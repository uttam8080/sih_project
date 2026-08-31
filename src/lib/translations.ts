import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  heroHeadline: string;
  heroHeadlineHighlight: string;
  heroSubtitle: string;
  analyzeMyBusiness: string;
  exploreSchemes: string;
  whereToStart: string;
  state: string;
  district: string;
  block: string;
  village: string;
  selectState: string;
  selectDistrict: string;
  enterBlock: string;
  enterVillage: string;
  availableMarginCapital: string;
  availableMarginDesc: string;
  projectCost: string;
  projectCostDesc: string;
  loanAmount: string;
  loanAmountDesc: string;
  businessInterest: string;
  generateAnalysisBtn: string;
  howItWorks: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  featuresTitle: string;
  featuresSubtitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  feature5Title: string;
  feature5Desc: string;
  feature6Title: string;
  feature6Desc: string;
  officialSchemes: string;
  officialSchemesSubtitle: string;
  financialSafetyDisclaimer: string;
  dashboardGreeting: string;
  dashboardSubtitle: string;
  startNewAnalysis: string;
  totalAnalyses: string;
  recommendedBusinesses: string;
  totalProjectCost: string;
  potentialLoanCapacity: string;
  recentAnalyses: string;
  viewReport: string;
  repaymentPlan: string;
  repaymentCalculator: string;
  whatBusinessToStart: string;
  whatBusinessSubtitle: string;
  myReports: string;
  profile: string;
  adminDashboard: string;
  login: string;
  register: string;
  logout: string;
  saveReport: string;
  downloadPdf: string;
  shareReport: string;
  feasibilityScore: string;
  marketDemand: string;
  competition: string;
  capitalSuitability: string;
  growthPotential: string;
  risk: string;
  operationalFeasibility: string;
  marketReach: string;
  localOpportunities: string;
  swotAnalysis: string;
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
  localRiskAnalysis: string;
  competitorIntelligence: string;
  pricingIntelligence: string;
  aiAdvisor: string;
  financialStructure: string;
  tenure: string;
  moratorium: string;
  interestRate: string;
  verifiedData: string;
  estimatedData: string;
  userInput: string;
  demoMode: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'GramBiz AI',
    tagline: 'Rural Business Intelligence & Financial Structuring',
    heroHeadline: 'Start the Right Business.',
    heroHeadlineHighlight: 'Build It With Confidence.',
    heroSubtitle: 'AI-powered hyper-local business intelligence and financial planning for rural and semi-urban entrepreneurs.',
    analyzeMyBusiness: 'Analyze My Business',
    exploreSchemes: 'Explore Schemes',
    whereToStart: 'Where do you want to start?',
    state: 'State',
    district: 'District',
    block: 'Block / Tehsil',
    village: 'Village / Gram Panchayat',
    selectState: 'Select State',
    selectDistrict: 'Select District',
    enterBlock: 'Enter Block / Tehsil name',
    enterVillage: 'Enter Village name',
    availableMarginCapital: 'Available Margin Capital',
    availableMarginDesc: 'The amount you contribute yourself toward the project.',
    projectCost: 'Potential Project Cost',
    projectCostDesc: 'The estimated total amount required to establish the business (Margin / 10%).',
    loanAmount: 'Potential Loan',
    loanAmountDesc: 'The portion of the project cost potentially financed through the scheme (90%).',
    businessInterest: 'What business are you interested in?',
    generateAnalysisBtn: 'Generate Business Analysis →',
    howItWorks: 'How It Works',
    howItWorksSubtitle: 'A structured 4-step path from rural business idea to funded reality',
    step1Title: 'Tell us your location',
    step1Desc: 'Enter your State, District, Block, and Village for hyper-local intelligence.',
    step2Title: 'Tell us your available capital',
    step2Desc: 'Enter your savings/margin. We deterministically calculate your 10x project cost & 90% loan.',
    step3Title: 'Choose or discover a business',
    step3Desc: 'Select an industry or let our AI recommend high-demand, low-competition ventures.',
    step4Title: 'Get your AI feasibility + financial plan',
    step4Desc: 'Receive a personalized SWOT, local risks, competitor analysis, pricing, and repayment schedule.',
    featuresTitle: 'Complete Rural Business Suite',
    featuresSubtitle: 'Engineered specifically for Indian micro-enterprises and government financing schemes',
    feature1Title: 'Hyper-Local Market Intelligence',
    feature1Desc: 'Understand demand, customer catchments, and consumer reach within 5km and 10km of your village.',
    feature2Title: 'Business Opportunity Analysis',
    feature2Desc: 'Discover underserved local niches and high-profit micro-manufacturing or retail opportunities.',
    feature3Title: 'Competitor Intelligence',
    feature3Desc: 'Gauge the estimated density of existing shops and service providers to avoid saturated markets.',
    feature4Title: 'AI Business Feasibility',
    feature4Desc: 'Get a personalized SWOT, operational difficulty rating, and actionable mitigating steps.',
    feature5Title: 'Smart Scheme Calculator',
    feature5Desc: 'Automatically match Micro Finance Scheme (up to ₹1.40L) or Term Loan Scheme (up to ₹50L).',
    feature6Title: 'Repayment Planning',
    feature6Desc: 'Understand principal, subsidized interest rates, moratorium period, and projected payment schedules.',
    officialSchemes: 'Government Financing Schemes',
    officialSchemesSubtitle: 'Configured with official guidelines for rural & semi-urban micro-enterprises',
    financialSafetyDisclaimer: 'Eligibility and financing shown here are estimates based on the configured scheme rules. Final approval, eligibility, interest, and repayment terms are determined by the relevant financing authority.',
    dashboardGreeting: 'Good Day',
    dashboardSubtitle: "Let's find a business opportunity that works for you.",
    startNewAnalysis: '+ Start New Analysis',
    totalAnalyses: 'Total Analyses',
    recommendedBusinesses: 'Recommended Businesses',
    totalProjectCost: 'Total Potential Project Cost',
    potentialLoanCapacity: 'Potential Loan Capacity',
    recentAnalyses: 'Recent Analyses',
    viewReport: 'View Report',
    repaymentPlan: 'Repayment Plan',
    repaymentCalculator: 'Financial Calculator',
    whatBusinessToStart: 'What Business Should I Start?',
    whatBusinessSubtitle: 'AI-ranked viable business opportunities for your exact location & margin capital',
    myReports: 'My Reports',
    profile: 'My Profile',
    adminDashboard: 'Admin Panel',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    saveReport: 'Save Report',
    downloadPdf: 'Download PDF',
    shareReport: 'Share Report',
    feasibilityScore: 'Overall Feasibility Score',
    marketDemand: 'Market Demand',
    competition: 'Competition Level',
    capitalSuitability: 'Capital Suitability',
    growthPotential: 'Growth Potential',
    risk: 'Risk Assessment',
    operationalFeasibility: 'Operational Feasibility',
    marketReach: 'Market Reach & Customer Base',
    localOpportunities: 'Local Business Opportunities',
    swotAnalysis: 'Hyper-Local SWOT Analysis',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    opportunities: 'Opportunities',
    threats: 'Threats',
    localRiskAnalysis: 'Local Risk & Mitigation Analysis',
    competitorIntelligence: 'Competitor Intelligence',
    pricingIntelligence: 'Local Pricing & Unit Economics',
    aiAdvisor: 'AI Business Advisor Recommendations',
    financialStructure: 'Your Financial Structure',
    tenure: 'Tenure',
    moratorium: 'Moratorium',
    interestRate: 'Interest Rate',
    verifiedData: 'Verified Data',
    estimatedData: 'Estimated Data',
    userInput: 'User Input',
    demoMode: 'Demo Mode Active',
  },
  hi: {
    appName: 'GramBiz AI',
    tagline: 'ग्रामीण व्यापार सलाहकार एवं वित्तीय नियोजन',
    heroHeadline: 'सही व्यवसाय चुनें।',
    heroHeadlineHighlight: 'आत्मविश्वास के साथ आगे बढ़ें।',
    heroSubtitle: 'ग्रामीण और अर्ध-शहरी सूक्ष्म उद्यमियों के लिए एआई-संचालित स्थानीय व्यापार परामर्श और सरकारी वित्तीय योजना।',
    analyzeMyBusiness: 'मेरे व्यवसाय का विश्लेषण करें',
    exploreSchemes: 'सरकारी योजनाएं देखें',
    whereToStart: 'आप कहाँ से व्यवसाय शुरू करना चाहते हैं?',
    state: 'राज्य',
    district: 'ज़िला',
    block: 'ब्लॉक / तहसील',
    village: 'गाँव / ग्राम पंचायत',
    selectState: 'राज्य चुनें',
    selectDistrict: 'ज़िला चुनें',
    enterBlock: 'ब्लॉक का नाम लिखें',
    enterVillage: 'गाँव का नाम लिखें',
    availableMarginCapital: 'उपलब्ध पूंजी (मार्जिन)',
    availableMarginDesc: 'वह राशि जो आप स्वयं व्यवसाय में लगा सकते हैं।',
    projectCost: 'अनुमानित कुल लागत',
    projectCostDesc: 'व्यवसाय शुरू करने के लिए कुल आवश्यक राशि (पूंजी / 10%)।',
    loanAmount: 'संभावित ऋण (लोन)',
    loanAmountDesc: 'सरकारी योजना द्वारा समर्थित संभावित ऋण राशि (कुल लागत का 90%)।',
    businessInterest: 'आप किस व्यवसाय में रुचि रखते हैं?',
    generateAnalysisBtn: 'व्यापार विश्लेषण तैयार करें →',
    howItWorks: 'यह कैसे काम करता है?',
    howItWorksSubtitle: 'गाँव में सफल व्यापार शुरू करने के लिए 4 आसान कदम',
    step1Title: 'अपना स्थान बताएं',
    step1Desc: 'सटीक स्थानीय बाज़ार डेटा के लिए अपना राज्य, ज़िला, ब्लॉक और गाँव चुनें।',
    step2Title: 'अपनी उपलब्ध पूंजी बताएं',
    step2Desc: 'अपनी बचत राशि डालें। सिस्टम स्वतः 10 गुना कुल लागत और 90% लोन निकालेगा।',
    step3Title: 'व्यवसाय चुनें या खोजें',
    step3Desc: 'अपनी पसंद का व्यवसाय चुनें या हमारे एआई से सुझाव प्राप्त करें।',
    step4Title: 'एआई रिपोर्ट व लोन योजना पाएं',
    step4Desc: 'स्थानीय मांग, जोखिम, प्रतिस्पर्धी जानकारी और ईएमआई किश्त सारणी प्राप्त करें।',
    featuresTitle: 'ग्रामीण उद्यमियों के लिए प्रमुख सुविधाएं',
    featuresSubtitle: 'भारतीय ग्रामीण बाज़ार और सरकारी ऋण योजनाओं के अनुकूल विशेष रूप से निर्मित',
    feature1Title: 'अति-स्थानीय बाज़ार जानकारी',
    feature1Desc: 'अपने गाँव के 5 से 10 किमी दायरे में मांग और संभावित ग्राहकों की संख्या जानें।',
    feature2Title: 'व्यापार अवसर विश्लेषण',
    feature2Desc: 'स्थानीय क्षेत्र में कम प्रतिस्पर्धा और अधिक लाभ वाले नए व्यवसाय खोजें।',
    feature3Title: 'प्रतिस्पर्धी विश्लेषण',
    feature3Desc: 'आसपास की मौजूदा दुकानों व व्यवसायों की स्थिति समझें ताकि नुकसान न हो।',
    feature4Title: 'एआई व्यवहार्यता (SWOT) रिपोर्ट',
    feature4Desc: 'ताकत, कमजोरी, अवसर और खतरों का आपकी पूंजी व गाँव अनुसार सटीक विश्लेषण।',
    feature5Title: 'स्मार्ट सरकारी योजना चयन',
    feature5Desc: 'माइक्रो फाइनेंस योजना (₹1.40 लाख तक) या टर्म लोन योजना (₹50 लाख तक) का स्वतः मिलान।',
    feature6Title: 'आसान किश्त एवं ईएमआई नियोजन',
    feature6Desc: 'ब्याज दर, छूट अवधि (मोरेटोरियम) और मासिक/वार्षिक भुगतान सारणी समझें।',
    officialSchemes: 'सरकारी वित्तीय योजनाएं',
    officialSchemesSubtitle: 'ग्रामीण व लघु उद्यमियों के लिए निर्धारित सरकारी नियम',
    financialSafetyDisclaimer: 'यहाँ दिखाई गई पात्रता और वित्तीय आंकड़े निर्धारित योजना नियमों पर आधारित अनुमान हैं। अंतिम स्वीकृति, ब्याज दर और शर्तें संबंधित बैंक/वित्तीय संस्था द्वारा तय की जाती हैं।',
    dashboardGreeting: 'नमस्ते',
    dashboardSubtitle: 'आइए आपके गाँव के लिए सबसे सही और लाभदायक व्यवसाय खोजें।',
    startNewAnalysis: '+ नया विश्लेषण शुरू करें',
    totalAnalyses: 'कुल विश्लेषण',
    recommendedBusinesses: 'अनुशंसित व्यवसाय',
    totalProjectCost: 'कुल संभावित लागत',
    potentialLoanCapacity: 'कुल ऋण क्षमता',
    recentAnalyses: 'हाल के विश्लेषण',
    viewReport: 'रिपोर्ट देखें',
    repaymentPlan: 'किश्त योजना',
    repaymentCalculator: 'ईएमआई कैलकुलेटर',
    whatBusinessToStart: 'मैं कौन सा व्यवसाय शुरू करूँ?',
    whatBusinessSubtitle: 'आपके स्थान और पूंजी के आधार पर सर्वोत्तम व्यवसायों की सूची',
    myReports: 'मेरी रिपोर्टें',
    profile: 'मेरी प्रोफ़ाइल',
    adminDashboard: 'प्रशासन डैशबोर्ड',
    login: 'लॉग इन',
    register: 'नया खाता बनाएं',
    logout: 'लॉग आउट',
    saveReport: 'रिपोर्ट सहेजें',
    downloadPdf: 'पीडीएफ डाउनलोड',
    shareReport: 'रिपोर्ट साझा करें',
    feasibilityScore: 'समग्र व्यवहार्यता स्कोर',
    marketDemand: 'बाज़ार की मांग',
    competition: 'प्रतिस्पर्धा स्तर',
    capitalSuitability: 'पूंजी उपयुक्तता',
    growthPotential: 'विकास की संभावना',
    risk: 'जोखिम आकलन',
    operationalFeasibility: 'संचालन सुगमता',
    marketReach: 'बाज़ार पहुंच एवं उपभोक्ता',
    localOpportunities: 'स्थानीय व्यापार अवसर',
    swotAnalysis: 'स्थानीय SWOT विश्लेषण',
    strengths: 'मजबूत पक्ष (ताकत)',
    weaknesses: 'कमज़ोर पक्ष',
    opportunities: 'विकास के अवसर',
    threats: 'संभावित खतरे व जोखिम',
    localRiskAnalysis: 'स्थानीय जोखिम एवं समाधान',
    competitorIntelligence: 'प्रतिस्पर्धी बाज़ार स्थिति',
    pricingIntelligence: 'मूल्य निर्धारण एवं लाभ मार्जिन',
    aiAdvisor: 'एआई सलाहकार की मुख्य सिफारिशें',
    financialStructure: 'आपकी वित्तीय संरचना',
    tenure: 'लोन अवधि',
    moratorium: 'छूट अवधि (मोरेटोरियम)',
    interestRate: 'ब्याज दर',
    verifiedData: 'सत्यापित डेटा',
    estimatedData: 'अनुमानित डेटा',
    userInput: 'उपयोगकर्ता इनपुट',
    demoMode: 'डेमो मोड सक्रिय',
  },
  or: {
    appName: 'GramBiz AI',
    tagline: 'ଗ୍ରାମୀଣ ବ୍ୟବସାୟ ପରାମର୍ଶ ଏବଂ ଆର୍ଥିକ ଯୋଜନା',
    heroHeadline: 'ସଠିକ୍ ବ୍ୟବସାୟ ବାଛନ୍ତୁ।',
    heroHeadlineHighlight: 'ଆତ୍ମବିଶ୍ୱାସର ସହିତ ଆଗକୁ ବଢ଼ନ୍ତୁ।',
    heroSubtitle: 'ଗ୍ରାମୀଣ ଓ ଅର୍ଦ୍ଧ-ସହରାଞ୍ଚଳ କ୍ଷୁଦ୍ର ଉଦ୍ୟୋଗୀଙ୍କ ପାଇଁ AI-ଆଧାରିତ ସ୍ଥାନୀୟ ବ୍ୟବସାୟ ଗୁଇନ୍ଦା ଏବଂ ସରକାରୀ ଋଣ ଯୋଜନା।',
    analyzeMyBusiness: 'ବ୍ୟବସାୟ ବିଶ୍ଳେଷଣ କରନ୍ତୁ',
    exploreSchemes: 'ସରକାରୀ ଯୋଜନା ଦେଖନ୍ତୁ',
    whereToStart: 'ଆପଣ କେଉଁଠାରେ ବ୍ୟବସାୟ ଆରମ୍ଭ କରିବାକୁ ଚାହାଁନ୍ତି?',
    state: 'ରାଜ୍ୟ',
    district: 'ଜିଲ୍ଲା',
    block: 'ବ୍ଲକ୍ / ତହସିଲ',
    village: 'ଗ୍ରାମ / ପଞ୍ଚାୟତ',
    selectState: 'ରାଜ୍ୟ ବାଛନ୍ତୁ',
    selectDistrict: 'ଜିଲ୍ଲା ବାଛନ୍ତୁ',
    enterBlock: 'ବ୍ଲକ୍ ନାମ ଲେଖନ୍ତୁ',
    enterVillage: 'ଗ୍ରାମ ନାମ ଲେଖନ୍ତୁ',
    availableMarginCapital: 'ଉପଲବ୍ଧ ନିଜସ୍ୱ ପୁଞ୍ଜି (Margin)',
    availableMarginDesc: 'ଆପଣ ନିଜେ ବିନିଯୋଗ କରିପାରୁଥିବା ଅର୍ଥରାଶି।',
    projectCost: 'ଆନୁମାନିକ ମୋଟ ପ୍ରକଳ୍ପ ଖର୍ଚ୍ଚ',
    projectCostDesc: 'ବ୍ୟବସାୟ ପ୍ରତିଷ୍ଠା ପାଇଁ ଆବଶ୍ୟକ ମୋଟ ଅର୍ଥରାଶି (ପୁଞ୍ଜି / 10%)।',
    loanAmount: 'ସମ୍ଭାବ୍ୟ ଋଣ ପରିମାଣ',
    loanAmountDesc: 'ଯୋଜନା ଅଧୀନରେ ଉପଲବ୍ଧ ସମ୍ଭାବ୍ୟ ଋଣ (ପ୍ରକଳ୍ପ ଖର୍ଚ୍ଚର 90%)।',
    businessInterest: 'ଆପଣ କେଉଁ ବ୍ୟବସାୟରେ ଆଗ୍ରହୀ?',
    generateAnalysisBtn: 'ବ୍ୟବସାୟ ବିଶ୍ଳେଷଣ ପ୍ରସ୍ତୁତ କରନ୍ତୁ →',
    howItWorks: 'ଏହା କିପରି କାର୍ଯ୍ୟ କରେ?',
    howItWorksSubtitle: 'ଗାଁରେ ନୂତନ ବ୍ୟବସାୟ ଆରମ୍ଭ କରିବା ପାଇଁ ୪ଟି ସହଜ ପଦକ୍ଷେପ',
    step1Title: 'ଆପଣଙ୍କ ଅଞ୍ଚଳ ଜଣାନ୍ତୁ',
    step1Desc: 'ସଠିକ୍ ତଥ୍ୟ ପାଇଁ ନିଜର ରାଜ୍ୟ, ଜିଲ୍ଲା, ବ୍ଲକ୍ ଏବଂ ଗ୍ରାମ ନାମ ପ୍ରବେଶ କରନ୍ତୁ।',
    step2Title: 'ନିଜର ପୁଞ୍ଜି ଜଣାନ୍ତୁ',
    step2Desc: 'ନିଜର ସଞ୍ଚୟ ପୁଞ୍ଜି ଲେଖନ୍ତୁ। ସିଷ୍ଟମ୍ ସ୍ୱତଃ ୧୦ ଗୁଣା ପ୍ରକଳ୍ପ ମୂଲ୍ୟ ଏବଂ ୯୦% ଋଣ ହିସାବ କରିବ।',
    step3Title: 'ବ୍ୟବସାୟ ଚୟନ କରନ୍ତୁ',
    step3Desc: 'ନିଜ ପସନ୍ଦର ବ୍ୟବସାୟ ବାଛନ୍ତୁ କିମ୍ବା ଆମ AI ରୁ ଲାଭଦାୟକ ବ୍ୟବସାୟ ପରାମର୍ଶ ନିଅନ୍ତୁ।',
    step4Title: 'AI ରିପୋର୍ଟ ଓ ଋଣ ଯୋଜନା ପାଆନ୍ତୁ',
    step4Desc: 'ସ୍ଥାନୀୟ ଚାହିଦା, ପ୍ରତିଦ୍ୱନ୍ଦୀ ସୂଚନା, ସମ୍ଭାବ୍ୟ ବିପଦ ଏବଂ କିସ୍ତି (EMI) ଯୋଜନା ପାଆନ୍ତୁ।',
    featuresTitle: 'ଗ୍ରାମୀଣ ଉଦ୍ୟୋଗୀଙ୍କ ପାଇଁ ସୁବିଧା',
    featuresSubtitle: 'ଭାରତୀୟ ଗ୍ରାମୀଣ ବଜାର ଏବଂ ସରକାରୀ ଆର୍ଥିକ ଯୋଜନା ପାଇଁ ସ୍ୱତନ୍ତ୍ର ଭାବେ ନିର୍ମିତ',
    feature1Title: 'ଅତି-ସ୍ଥାନୀୟ ବଜାର ସୂଚନା',
    feature1Desc: 'ଆପଣଙ୍କ ଗ୍ରାମର ୫ ରୁ ୧୦ କିମି ମଧ୍ୟରେ ଉପଭୋକ୍ତା ଚାହିଦା ଓ ସୁବିଧା ଜାଣନ୍ତୁ।',
    feature2Title: 'ବ୍ୟବସାୟ ସୁଯୋଗ ବିଶ୍ଳେଷଣ',
    feature2Desc: 'ସ୍ଥାନୀୟ ଅଞ୍ଚଳରେ ଥିବା ଅଣସେବିତ ଓ ଉଚ୍ଚ ଲାଭଦାୟକ ବ୍ୟବସାୟ ଚିହ୍ନଟ କରନ୍ତୁ।',
    feature3Title: 'ପ୍ରତିଦ୍ୱନ୍ଦୀ ଅନୁଧ୍ୟାନ',
    feature3Desc: 'ପାଖାପାଖି ଥିବା ଦୋକାନ ଏବଂ ସମାନ ବ୍ୟବସାୟର ସ୍ଥିତି ବୁଝନ୍ତୁ।',
    feature4Title: 'AI ବ୍ୟବସାୟ ଉପଯୁକ୍ତତା ରିପୋର୍ଟ',
    feature4Desc: 'ଆପଣଙ୍କ ପୁଞ୍ଜି ଓ ଅଞ୍ଚଳ ଅନୁଯାୟୀ ସଠିକ୍ SWOT ବିଶ୍ଳେଷଣ।',
    feature5Title: 'ସ୍ମାର୍ଟ ସରକାରୀ ଯୋଜନା ଚୟନ',
    feature5Desc: 'ମାଇକ୍ରୋ ଫାଇନାନ୍ସ (₹1.40 ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ) କିମ୍ବା ଟର୍ମ ଲୋନ୍ (₹50 ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ) ସ୍ୱୟଂଚାଳିତ ଚୟନ।',
    feature6Title: 'ଋଣ ପରିଶୋଧ ଓ EMI ଯୋଜନା',
    feature6Desc: 'ସୁଧ ହାର, ରିହାତି ଅବଧି (Moratorium) ଏବଂ ମାସିକ କିସ୍ତି ହିସାବ ସହଜରେ ବୁଝନ୍ତୁ।',
    officialSchemes: 'ସରକାରୀ ଆର୍ଥିକ ଯୋଜନା',
    officialSchemesSubtitle: 'ଗ୍ରାମୀଣ କ୍ଷୁଦ୍ର ଉଦ୍ୟୋଗ ପାଇଁ ସରକାରୀ ନିୟମାବଳୀ ଅନୁଯାୟୀ ପ୍ରସ୍ତୁତ',
    financialSafetyDisclaimer: 'ଏଠାରେ ପ୍ରଦର୍ଶିତ ଯୋଗ୍ୟତା ଏବଂ ଆର୍ଥିକ ହିସାବ ଅନୁମାନିତ। ଚୂଡ଼ାନ୍ତ ଋଣ ମଞ୍ଜୁରୀ, ସୁଧ ହାର ଏବଂ ସର୍ତ୍ତାବଳୀ ସମ୍ପୃକ୍ତ ବ୍ୟାଙ୍କ କିମ୍ବା ଆର୍ଥିକ ସଂସ୍ଥା ଦ୍ୱାରା ନିର୍ଦ୍ଧାରିତ ହୁଏ।',
    dashboardGreeting: 'ନମସ୍କାର',
    dashboardSubtitle: 'ଆସନ୍ତୁ ଆପଣଙ୍କ ପାଇଁ ଏକ ଲାଭଦାୟକ ବ୍ୟବସାୟ ସୁଯୋଗ ଖୋଜିବା।',
    startNewAnalysis: '+ ନୂଆ ବିଶ୍ଳେଷଣ ଆରମ୍ଭ କରନ୍ତୁ',
    totalAnalyses: 'ମୋଟ ବିଶ୍ଳେଷଣ',
    recommendedBusinesses: 'ପରାମର୍ଶିତ ବ୍ୟବସାୟ',
    totalProjectCost: 'ମୋଟ ସମ୍ଭାବ୍ୟ ଖର୍ଚ୍ଚ',
    potentialLoanCapacity: 'ସମ୍ଭାବ୍ୟ ଋଣ କ୍ଷମତା',
    recentAnalyses: 'ନିକଟ ଅତୀତର ବିଶ୍ଳେଷଣ',
    viewReport: 'ରିପୋର୍ଟ ଦେଖନ୍ତୁ',
    repaymentPlan: 'କିସ୍ତି ଯୋଜନା',
    repaymentCalculator: 'ଆର୍ଥିକ କ୍ୟାଲକୁଲେଟର',
    whatBusinessToStart: 'ମୁଁ କେଉଁ ବ୍ୟବସାୟ ଆରମ୍ଭ କରିବି?',
    whatBusinessSubtitle: 'ଆପଣଙ୍କ ଅଞ୍ଚଳ ଓ ପୁଞ୍ଜି ଅନୁଯାୟୀ ଶ୍ରେଷ୍ଠ ବ୍ୟବସାୟ ସୁଯୋଗ',
    myReports: 'ମୋର ରିପୋର୍ଟଗୁଡ଼ିକ',
    profile: 'ମୋର ପ୍ରୋଫାଇଲ୍',
    adminDashboard: 'ପ୍ରଶାସନ ଡ୍ୟାସବୋର୍ଡ',
    login: 'ଲଗ୍ ଇନ୍',
    register: 'ନୂଆ ଖାତା ଖୋଲନ୍ତୁ',
    logout: 'ଲଗ୍ ଆଉଟ୍',
    saveReport: 'ରିପୋର୍ଟ ସାଇତନ୍ତୁ',
    downloadPdf: 'PDF ଡାଉନଲୋଡ୍',
    shareReport: 'ରିପୋର୍ଟ ସେୟାର୍ କରନ୍ତୁ',
    feasibilityScore: 'ସାମଗ୍ରିକ ବ୍ୟବସାୟ ସ୍କୋର',
    marketDemand: 'ବଜାର ଚାହିଦା',
    competition: 'ପ୍ରତିଦ୍ୱନ୍ଦିତା ସ୍ତର',
    capitalSuitability: 'ପୁଞ୍ଜି ଉପଯୋଗୀତା',
    growthPotential: 'ବୃଦ୍ଧିର ସମ୍ଭାବନା',
    risk: 'ବିପଦ ଆକଳନ',
    operationalFeasibility: 'ପରିଚାଳନା ସୁଗମତା',
    marketReach: 'ବଜାର ପହଞ୍ଚ ଓ ଉପଭୋକ୍ତା',
    localOpportunities: 'ସ୍ଥାନୀୟ ବ୍ୟବସାୟ ସୁଯୋଗ',
    swotAnalysis: 'ସ୍ଥାନୀୟ SWOT ବିଶ୍ଳେଷଣ',
    strengths: 'ଶକ୍ତି ଓ ସୁବିଧା',
    weaknesses: 'ଦୁର୍ବଳତା',
    opportunities: 'ସୁଯୋଗ',
    threats: 'ସମ୍ଭାବ୍ୟ ଆହ୍ୱାନ ଓ ବିପଦ',
    localRiskAnalysis: 'ସ୍ଥାନୀୟ ବିପଦ ଓ ନିରାକରଣ',
    competitorIntelligence: 'ପ୍ରତିଦ୍ୱନ୍ଦୀ ଗୁଇନ୍ଦା ସୂଚନା',
    pricingIntelligence: 'ମୂଲ୍ୟ ନିର୍ଦ୍ଧାରଣ ଓ ଲାଭ',
    aiAdvisor: 'AI ବ୍ୟବସାୟ ପରାମର୍ଶଦାତାଙ୍କ ସୁପାରିଶ',
    financialStructure: 'ଆପଣଙ୍କ ଆର୍ଥିକ ସଂରଚନା',
    tenure: 'ଋଣ ଅବଧି',
    moratorium: 'ରିହାତି ଅବଧି (Moratorium)',
    interestRate: 'ସୁଧ ହାର',
    verifiedData: 'ପ୍ରମାଣିତ ତଥ୍ୟ',
    estimatedData: 'ଆନୁମାନିକ ତଥ୍ୟ',
    userInput: 'ଉପଭୋକ୍ତା ପ୍ରଦତ୍ତ ତଥ୍ୟ',
    demoMode: 'ଡେମୋ ମୋଡ୍ ସକ୍ରିୟ',
  },
};
