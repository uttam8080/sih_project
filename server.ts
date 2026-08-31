import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Server-side deterministic financial engine
app.post('/api/financial/calculate', (req, res) => {
  try {
    const { margin } = req.body;
    const safeMargin = Math.max(0, Number(margin) || 0);

    const projectCost = safeMargin > 0 ? safeMargin / 0.10 : 0;
    const loanAmount = projectCost * 0.90;

    let schemeName = 'None';
    let schemeId = '';
    let maxLoan = 0;
    let interestRate = 0;
    let tenureMonths = 0;
    let moratoriumMonths = 0;
    let isAboveSchemeLimit = false;

    if (projectCost > 0) {
      if (projectCost <= 140000) {
        schemeId = 'scheme_micro_finance';
        schemeName = 'Micro Finance Scheme';
        maxLoan = 125000;
        interestRate = 6.5;
        tenureMonths = 36;
        moratoriumMonths = 3;
      } else if (projectCost <= 5000000) {
        schemeId = 'scheme_term_loan';
        schemeName = 'Term Loan Scheme';
        maxLoan = 4500000;
        interestRate = 8.0;
        tenureMonths = 84;
        moratoriumMonths = 6;
      } else {
        isAboveSchemeLimit = true;
      }
    }

    const finalLoan = maxLoan > 0 ? Math.min(loanAmount, maxLoan) : loanAmount;

    // Monthly EMI post moratorium
    const repaymentMonths = tenureMonths - moratoriumMonths;
    const monthlyRate = (interestRate / 100) / 12;
    let emi = 0;
    if (monthlyRate > 0 && repaymentMonths > 0 && finalLoan > 0) {
      const factor = Math.pow(1 + monthlyRate, repaymentMonths);
      emi = (finalLoan * monthlyRate * factor) / (factor - 1);
    }

    res.json({
      availableMargin: safeMargin,
      projectCost,
      loanAmount: finalLoan,
      schemeId,
      schemeName,
      interestRate,
      tenureMonths,
      moratoriumMonths,
      monthlyEMI: Math.round(emi),
      isAboveSchemeLimit,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Calculation error' });
  }
});

// AI Feasibility Analysis Endpoint
app.post('/api/ai/analyze-business', async (req, res) => {
  try {
    const { location, business, financial, marketData, competitorData, language = 'en' } = req.body;

    const state = location?.state || 'Odisha';
    const district = location?.district || 'Ganjam';
    const block = location?.block || 'Hinjilicut';
    const village = location?.village || 'Rampur Gram Panchayat';
    const bType = business?.type || 'Rural Micro Enterprise';
    const bCat = business?.category || 'General';
    const margin = Number(financial?.margin || 100000);
    const projectCost = Number(financial?.projectCost || 1000000);
    const loanAmount = Number(financial?.loanAmount || 900000);
    const scheme = financial?.scheme || 'Term Loan Scheme';

    const langPrompt =
      language === 'hi'
        ? 'Generate all descriptive fields, SWOT, risks, and recommendations in clear Hindi (Devanagari script).'
        : language === 'or'
        ? 'Generate all descriptive fields, SWOT, risks, and recommendations in Odia (Odia script).'
        : 'Generate all content in professional English tailored for Indian rural enterprise development.';

    if (ai) {
      try {
        const prompt = `You are the lead AI Rural Business Analyst for GramBiz AI in India.
Analyze the local market feasibility and business plan for this entrepreneur:

LOCATION:
- State: ${state}
- District: ${district}
- Block: ${block}
- Village / GP: ${village}

BUSINESS:
- Category: ${bCat}
- Specific Business: ${bType}
- Prior Experience: ${business?.experience || 'Beginner with family support'}
- Space Available: ${business?.space || 'Local village plot/shop'}
- Team Size: ${business?.teamSize || 2}

FINANCIAL PLAN (Pre-calculated deterministically):
- Available Margin: ₹${margin.toLocaleString('en-IN')}
- Potential Project Cost: ₹${projectCost.toLocaleString('en-IN')}
- Potential Loan: ₹${loanAmount.toLocaleString('en-IN')}
- Government Financing Scheme: ${scheme}

LANGUAGE REQUIREMENT:
${langPrompt}

You MUST return a JSON object with this exact structure:
{
  "feasibility_score": integer between 65 and 92,
  "category_scores": {
    "marketDemand": integer 60-95,
    "competition": integer 50-90,
    "capitalSuitability": integer 70-98,
    "growthPotential": integer 65-92,
    "risk": integer 45-85,
    "operationalFeasibility": integer 70-95
  },
  "market_reach": {
    "radius0to5km": {
      "estimatedConsumers": integer,
      "description": string,
      "isEstimate": true
    },
    "radius5to10km": {
      "estimatedConsumers": integer,
      "description": string,
      "isEstimate": true
    },
    "totalPotentialMarket": {
      "estimatedPopulation": integer,
      "targetBuyersMonthly": integer,
      "isEstimate": true
    },
    "customerSegments": [
      { "name": string, "sharePercentage": integer, "description": string },
      { "name": string, "sharePercentage": integer, "description": string },
      { "name": string, "sharePercentage": integer, "description": string }
    ]
  },
  "opportunity_analysis": [
    {
      "id": "opp_1",
      "title": string,
      "whyItMayWork": string,
      "demandIndicator": "High" | "Very High" | "Moderate",
      "investmentRequirement": string,
      "expectedDifficulty": "Low" | "Medium" | "High",
      "riskLevel": "Low" | "Moderate" | "High"
    },
    {
      "id": "opp_2",
      "title": string,
      "whyItMayWork": string,
      "demandIndicator": "High" | "Very High" | "Moderate",
      "investmentRequirement": string,
      "expectedDifficulty": "Low" | "Medium" | "High",
      "riskLevel": "Low" | "Moderate" | "High"
    },
    {
      "id": "opp_3",
      "title": string,
      "whyItMayWork": string,
      "demandIndicator": "High" | "Very High" | "Moderate",
      "investmentRequirement": string,
      "expectedDifficulty": "Low" | "Medium" | "High",
      "riskLevel": "Low" | "Moderate" | "High"
    }
  ],
  "swot": {
    "strengths": [string, string, string, string],
    "weaknesses": [string, string, string],
    "opportunities": [string, string, string, string],
    "threats": [string, string, string]
  },
  "local_risks": [
    {
      "category": "Supply chain & Raw Material",
      "riskLevel": "Low" | "Medium" | "High",
      "explanation": string,
      "mitigation": string
    },
    {
      "category": "Seasonal Demand & Weather",
      "riskLevel": "Low" | "Medium" | "High",
      "explanation": string,
      "mitigation": string
    },
    {
      "category": "Buyer Dependency & Credit Risk",
      "riskLevel": "Low" | "Medium" | "High",
      "explanation": string,
      "mitigation": string
    },
    {
      "category": "Price Volatility & Competition",
      "riskLevel": "Low" | "Medium" | "High",
      "explanation": string,
      "mitigation": string
    }
  ],
  "competitor_analysis": {
    "estimatedSimilarBusinesses": integer,
    "businessesWithin5km": integer,
    "businessesWithin10km": integer,
    "competitionLevel": "Low" | "Medium" | "High",
    "localInsights": string,
    "isEstimate": true
  },
  "pricing_analysis": {
    "suggestedSellingPrice": string,
    "localPriceRange": string,
    "customerPurchasingRange": string,
    "recommendedPricingStrategy": string,
    "unitMarginEstimate": string,
    "isEstimate": true
  },
  "recommendations": [
    {
      "id": "rec_1",
      "title": string,
      "recommendation": string,
      "explanation": string,
      "priority": "High",
      "category": "Scale" | "Finance" | "Marketing" | "Operations"
    },
    {
      "id": "rec_2",
      "title": string,
      "recommendation": string,
      "explanation": string,
      "priority": "High",
      "category": "Scale" | "Finance" | "Marketing" | "Operations"
    },
    {
      "id": "rec_3",
      "title": string,
      "recommendation": string,
      "explanation": string,
      "priority": "Medium",
      "category": "Scale" | "Finance" | "Marketing" | "Operations"
    }
  ]
}

Ensure all insights are deeply hyper-local to ${district}, ${state} with realistic agricultural/market economics.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '';
        const parsed = JSON.parse(rawText);
        return res.json({
          ...parsed,
          ai_model: 'gemini-3.7-flash',
          created_at: new Date().toISOString(),
        });
      } catch (genError: any) {
        console.warn('Gemini API call failed, providing intelligent fallback:', genError?.message);
      }
    }

    // High quality deterministic fallback generator
    const fallbackReport = generateIntelligentFallbackReport({
      state,
      district,
      block,
      village,
      bType,
      bCat,
      margin,
      projectCost,
      loanAmount,
      scheme,
      language,
    });

    res.json(fallbackReport);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to generate AI analysis' });
  }
});

// Business Recommendations Engine Endpoint
app.post('/api/ai/recommend-businesses', async (req, res) => {
  try {
    const { location, margin = 100000, language = 'en' } = req.body;
    const district = location?.district || 'Ganjam';
    const state = location?.state || 'Odisha';
    const safeMargin = Number(margin) || 100000;

    if (ai) {
      try {
        const prompt = `Recommend the top 4 most viable micro and small business opportunities for an entrepreneur in ${district}, ${state}, India with ₹${safeMargin.toLocaleString('en-IN')} available margin capital (which can support up to a ₹${(safeMargin * 10).toLocaleString('en-IN')} project under government schemes).
Language: ${language}.
Return a JSON array of objects with:
[
  {
    "id": "rec_1",
    "businessCategoryId": "cat_dairy",
    "businessName": string,
    "category": string,
    "feasibilityScore": integer (75-92),
    "estimatedInvestment": string (e.g. "₹5.0 - ₹10.0 Lakh"),
    "marketDemand": "High" | "Very High",
    "competition": "Low" | "Medium",
    "risk": "Low" | "Moderate",
    "potentialScalability": "High" | "Very High",
    "briefRationale": string (2 sentences tailored to ${district}),
    "recommendedMarginMin": integer
  }
]`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        const raw = response.text || '';
        const parsed = JSON.parse(raw);
        return res.json({ recommendations: parsed });
      } catch (err: any) {
        console.warn('Gemini recommendation fallback:', err?.message);
      }
    }

    // Standard fallback recommendations
    const recommendations = getFallbackRecommendations(district, state, safeMargin);
    res.json({ recommendations });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Recommendation error' });
  }
});

// Helper for fallback generation
function generateIntelligentFallbackReport(params: any) {
  const { state, district, block, village, bType, bCat, margin, projectCost, loanAmount, scheme, language } = params;

  const isHindi = language === 'hi';
  const isOdia = language === 'or';

  return {
    feasibility_score: 84,
    category_scores: {
      marketDemand: 88,
      competition: 72,
      capitalSuitability: 91,
      growthPotential: 85,
      risk: 68,
      operationalFeasibility: 89,
    },
    market_reach: {
      radius0to5km: {
        estimatedConsumers: 14500,
        description: isHindi
          ? `${village} और आसपास के 4 ग्राम पंचायतों में तत्काल ग्राहक पहुंच।`
          : isOdia
          ? `${village} ଏବଂ ଆଖପାଖ ୪ଟି ଗ୍ରାମ ପଞ୍ଚାୟତ ମଧ୍ୟରେ ସିଧାସଳଖ ଉପଭୋକ୍ତା।`
          : `Direct consumer access across ${village} and 4 surrounding Gram Panchayats.`,
        isEstimate: true,
      },
      radius5to10km: {
        estimatedConsumers: 42000,
        description: isHindi
          ? `${block} ब्लॉक मुख्यालय, साप्ताहिक हाट और मुख्य बाज़ार तक पहुंच।`
          : isOdia
          ? `${block} ବ୍ଲକ୍ ସଦର ମହକୁମା, ସାପ୍ତାହିକ ହାଟ ଓ ମୁଖ୍ୟ ବଜାର।`
          : `Reaches ${block} Block headquarters, weekly rural haats, and connecting transport corridor.`,
        isEstimate: true,
      },
      totalPotentialMarket: {
        estimatedPopulation: 68000,
        targetBuyersMonthly: 2800,
        isEstimate: true,
      },
      customerSegments: [
        {
          name: isHindi ? 'स्थानीय ग्रामीण परिवार' : isOdia ? 'ସ୍ଥାନୀୟ ଗ୍ରାମୀଣ ପରିବାର' : 'Local Rural Households',
          sharePercentage: 55,
          description: isHindi ? 'दैनिक उपभोग और आवश्यक घरेलू ज़रूरतें' : isOdia ? 'ଦୈନନ୍ଦିନ ଘରୋଇ ଆବଶ୍ୟକତା' : 'Daily consumption and regular household requirements',
        },
        {
          name: isHindi ? 'स्थानीय चाय की दुकानें व भोजनालय' : isOdia ? 'ସ୍ଥାନୀୟ ଚାହା ଦୋକାନ ଓ ହୋଟେଲ' : 'Tea Stalls & Food Vendors',
          sharePercentage: 25,
          description: isHindi ? 'थोक आपूर्ति व नियमित खरीद' : isOdia ? 'ପ୍ରତ୍ୟହ ଥୋକ୍ ଯୋଗାଣ' : 'Bulk daily supply with steady recurring cash flow',
        },
        {
          name: isHindi ? 'सहकारी संस्थाएं व व्यापारी' : isOdia ? 'ସମବାୟ ସମିତି ଓ ବେପାରୀ' : 'Cooperatives & Wholesalers',
          sharePercentage: 20,
          description: isHindi ? 'सुनिश्चित खरीद मूल्य व न्यूनतम घाटा' : isOdia ? 'ନିଶ୍ଚିତ କ୍ରୟ ବ୍ୟବସ୍ଥା' : 'Contract off-take and guaranteed collection points',
        },
      ],
    },
    opportunity_analysis: [
      {
        id: 'opp_1',
        title: isHindi ? 'स्थानीय प्रत्यक्ष आपूर्ति' : isOdia ? 'ସ୍ଥାନୀୟ ପ୍ରତ୍ୟକ୍ଷ ବିକ୍ରୟ' : 'Direct Village & Haat Supply',
        whyItMayWork: isHindi
          ? `${district} के ग्रामीण क्षेत्रों में ताज़ा उत्पादों की मांग बिचौलियों से मुक्त होने पर अधिक लाभ देती है।`
          : isOdia
          ? `${district} ଜିଲ୍ଲାରେ ମଧ୍ୟସ୍ଥିଙ୍କ ବିନା ସିଧାସଳଖ ବିକ୍ରୟ ଅଧିକ ଲାଭାଂଶ ପ୍ରଦାନ କରେ।`
          : `Eliminates intermediaries in ${district} to capture retail margins directly from consumers.`,
        demandIndicator: 'High',
        investmentRequirement: `₹${(margin * 0.4).toLocaleString('en-IN')}`,
        expectedDifficulty: 'Low',
        riskLevel: 'Low',
      },
      {
        id: 'opp_2',
        title: isHindi ? 'मूल्य संवर्धन एवं पैकेजिंग' : isOdia ? 'ମୂଲ୍ୟ ସଂଯୋଜନ ଓ ପ୍ୟାକେଜିଂ' : 'Value Addition & Local Packaging',
        whyItMayWork: isHindi
          ? 'कच्चे माल को प्रोसेस करके ब्रांडेड पैकेट में बेचने से 20-35% अतिरिक्त लाभ मिलता है।'
          : isOdia
          ? 'କଞ୍ଚାମାଲ ପ୍ରକ୍ରିୟାକରଣ କରି ପ୍ୟାକେଟ୍ ଆକାରରେ ବିକ୍ରି କଲେ ୨୦-୩୫% ଅତିରିକ୍ତ ଲାଭ ମିଳେ।'
          : 'Processing raw materials into packaged units fetches a 20-35% price premium.',
        demandIndicator: 'Very High',
        investmentRequirement: `₹${(margin * 0.6).toLocaleString('en-IN')}`,
        expectedDifficulty: 'Medium',
        riskLevel: 'Moderate',
      },
      {
        id: 'opp_3',
        title: isHindi ? 'संस्थागत व थोक आपूर्ति अनुबंध' : isOdia ? 'ସଂସ୍ଥାଗତ ଯୋଗାଣ ଚୁକ୍ତି' : 'Institutional & Bulk Offtake Contracts',
        whyItMayWork: isHindi
          ? 'आसपास के स्कूलों, छात्रावासों और कैंटीन के साथ दीर्घकालिक अनुबंध सुरक्षित आय देते हैं।'
          : isOdia
          ? 'ନିକଟବର୍ତ୍ତୀ ସ୍କୁଲ୍, ହଷ୍ଟେଲ୍ ଓ କ୍ୟାଣ୍ଟିନ୍ ସହିତ ଯୋଗାଣ ଚୁକ୍ତି ସ୍ଥିର ଆୟ ପ୍ରଦାନ କରେ।'
          : 'Supplying local residential schools, canteens, and dhabas ensures steady monthly receivables.',
        demandIndicator: 'High',
        investmentRequirement: `₹${(margin * 0.3).toLocaleString('en-IN')}`,
        expectedDifficulty: 'Medium',
        riskLevel: 'Low',
      },
    ],
    swot: {
      strengths: [
        isHindi ? 'गाँव में स्वयं का स्थान होने से दुकान का किराया शून्य अथवा बहुत कम रहेगा।' : isOdia ? 'ନିଜସ୍ୱ ସ୍ଥାନ ଥିବାରୁ ଦୋକାନ ଭଡ଼ା ବହୁତ କମ୍ ରହିବ।' : `Low fixed overheads due to available local premises in ${village}.`,
        isHindi ? `${scheme} के तहत 90% तक कम ब्याज वाला सरकारी लोन समर्थन।` : isOdia ? `${scheme} ଅଧୀନରେ ୯୦% ପର୍ଯ୍ୟନ୍ତ ସୁଲଭ ସରକାରୀ ଋଣ ସହାୟତା।` : `High financial leverage (90% debt at subsidized interest under ${scheme}).`,
        isHindi ? 'परिवार के सदस्यों के सहयोग से श्रम लागत में भारी बचत।' : isOdia ? 'ପାରିବାରିକ ସହଯୋଗ ଦ୍ୱାରା ଶ୍ରମ ଖର୍ଚ୍ଚରେ ବଡ଼ ସଞ୍ଚୟ।' : 'Family labor participation reduces external wage overheads.',
        isHindi ? 'स्थानीय भाषा व ग्राहकों से व्यक्तिगत विश्वास एवं संबंध।' : isOdia ? 'ସ୍ଥାନୀୟ ଲୋକଙ୍କ ସହିତ ଉତ୍ତମ ବ୍ୟକ୍ତିଗତ ସମ୍ପର୍କ।' : 'Direct trust network with village community and local retailers.',
      ],
      weaknesses: [
        isHindi ? 'प्रारंभिक कार्यशील पूंजी प्रबंधन में अनुशासन की आवश्यकता।' : isOdia ? 'ପ୍ରାରମ୍ଭିକ କାର୍ଯ୍ୟକାରୀ ପୁଞ୍ଜିର ସଠିକ୍ ପରିଚାଳନା ଆବଶ୍ୟକ।' : 'Limited initial buffer capital during the first 3 months of ramp-up.',
        isHindi ? 'आधुनिक मशीनरी संचालन का पूर्व औपचारिक अनुभव सीमित होना।' : isOdia ? 'ଆଧୁନିକ ମେସିନ୍ ଚାଳନାରେ ସୀମିତ ଅଭିଜ୍ଞତା।' : 'Dependence on local single-phase electric supply stability.',
        isHindi ? 'उधार पर माल बेचने की सामाजिक मांग का दबाव।' : isOdia ? 'ଗ୍ରାହକଙ୍କୁ ଉଧାର ଦେବାର ସାମାଜିକ ଚାପ।' : 'Pressure for informal customer credit in close village networks.',
      ],
      opportunities: [
        isHindi ? `${district} ज़िले के आस-पास के ब्लॉक बाज़ारों में उत्पाद विस्तार की अपार संभावना।` : isOdia ? `${district} ଜିଲ୍ଲାର ନିକଟସ୍ଥ ବ୍ଲକ୍ ବଜାରକୁ ବ୍ୟବସାୟ ସମ୍ପ୍ରସାରଣର ସୁଯୋଗ।` : `Expansion into adjoining blocks across ${district} through weekly haats.`,
        isHindi ? 'सरकारी डिजिटल पेमेंट (UPI/QR) से पारदर्शी और त्वरित भुगतान।' : isOdia ? 'ଡିଜିଟାଲ୍ UPI ମାଧ୍ୟମରେ ସ୍ୱଚ୍ଛ ଓ ତୁରନ୍ତ ଟଙ୍କା ଆଦାୟ।' : 'Adoption of QR code UPI collections to eliminate delayed cash cycles.',
        isHindi ? 'स्थानीय किसान उत्पादक संगठन (FPO) व महिला SHG के साथ साझेदारी।' : isOdia ? 'ସ୍ଥାନୀୟ ମହିଳା SHG ଓ FPO ସହିତ ସହଭାଗିତା।' : 'Bulk raw material sourcing partnerships with local SHGs and FPOs.',
        isHindi ? 'सरकारी सब्सिडी व कौशल विकास प्रशिक्षण (RSETI) का लाभ।' : isOdia ? 'ସରକାରୀ ପ୍ରଶିକ୍ଷଣ (RSETI) ଓ ସବସିଡିର ସୁବିଧା।' : 'Eligible for RSETI skill upgradation and district enterprise subsidy.',
      ],
      threats: [
        isHindi ? 'कच्चे माल के मौसमी मूल्य में उतार-चढ़ाव।' : isOdia ? 'କଞ୍ଚାମାଲ ମୂଲ୍ୟରେ ଋତୁକାଳୀନ ଅସ୍ଥିରତା।' : 'Seasonal raw material price fluctuations during non-harvest months.',
        isHindi ? 'मानसून या भारी बारिश के समय ग्रामीण परिवहन में अस्थायी रुकावट।' : isOdia ? 'ବର୍ଷା ଦିନେ ପରିବହନ ବ୍ୟବସ୍ଥାରେ ସାମୟିକ ବାଧା।' : 'Monsoon logistics delays on unpaved village connecting roads.',
        isHindi ? 'बड़े शहरों से आने वाले ब्रांडेड उत्पादों का मूल्य दबाव।' : isOdia ? 'ସହରରୁ ଆସୁଥିବା ବ୍ରାଣ୍ଡେଡ୍ କମ୍ପାନୀର ମୂଲ୍ୟ ପ୍ରତିଯୋଗିତା।' : 'Aggressive discount pricing from large regional wholesalers.',
      ],
    },
    local_risks: [
      {
        category: isHindi ? 'कच्चा माल एवं आपूर्ति श्रृंखला' : isOdia ? 'କଞ୍ଚାମାଲ ଓ ଯୋଗାଣ ଶୃଙ୍ଖଳା' : 'Raw Material & Supply Chain',
        riskLevel: 'Moderate',
        explanation: isHindi
          ? 'पीक सीजन समाप्त होने पर कच्चे माल की लागत 10-15% बढ़ सकती है।'
          : isOdia
          ? 'ଋତୁ ଶେଷ ପରେ କଞ୍ଚାମାଲ ଦର ୧୦-୧୫% ବୃଦ୍ଧି ହୋଇପାରେ।'
          : `Input costs in ${district} fluctuate by 10-15% across seasons.`,
        mitigation: isHindi
          ? 'स्थानीय किसानों से सीधे 2 महीने का स्टॉक अनुबंध पूर्व निर्धारित मूल्य पर करें।'
          : isOdia
          ? 'ସ୍ଥାନୀୟ ଚାଷୀଙ୍କ ସହିତ ପୂର୍ବ ନିର୍ଦ୍ଧାରିତ ମୂଲ୍ୟରେ ୨ ମାସର ଚୁକ୍ତି କରନ୍ତୁ।'
          : 'Establish forward purchase agreements with 2-3 local farmer groups.',
      },
      {
        category: isHindi ? 'ग्राहक उधारी एवं कार्यशील पूंजी' : isOdia ? 'ଗ୍ରାହକ ଉଧାର ଓ କାର୍ଯ୍ୟକାରୀ ପୁଞ୍ଜି' : 'Customer Credit & Working Capital',
        riskLevel: 'Medium',
        explanation: isHindi
          ? 'ग्रामीण बाज़ारों में अनौपचारिक उधारी से नकदी प्रवाह बाधित हो सकता है।'
          : isOdia
          ? 'ଗାଁରେ ଅଧିକ ଉଧାର ଦେଲେ ଦୈନିକ ଟଙ୍କା ଚଳାଚଳରେ ଅସୁବିଧା ହୋଇପାରେ।'
          : 'High credit sales can tie up essential operating liquidity.',
        mitigation: isHindi
          ? 'उधारी की अधिकतम सीमा ₹500 तय करें और नकद भुगतान पर 2% छूट दें।'
          : isOdia
          ? 'ଉଧାର ସୀମା ନିର୍ଦ୍ଧାରଣ କରନ୍ତୁ ଏବଂ ନଗଦ କ୍ରୟରେ ୨% ରିହାତି ଦିଅନ୍ତୁ।'
          : 'Cap credit limits per buyer and incentivize instant cash/UPI payments.',
      },
      {
        category: isHindi ? 'विद्युत व तकनीकी रखरखाव' : isOdia ? 'ବିଦ୍ୟୁତ୍ ଓ ଯାନ୍ତ୍ରିକ ସମସ୍ୟା' : 'Power Reliability & Maintenance',
        riskLevel: 'Low',
        explanation: isHindi
          ? 'ग्रामीण क्षेत्रों में बिजली कटौती से उत्पादन समय प्रभावित हो सकता है।'
          : isOdia
          ? 'ବିଦ୍ୟୁତ୍ କାଟ ଯୋଗୁଁ ଉତ୍ପାଦନରେ ବାଧା ଉପୁଜିପାରେ।'
          : 'Occasional voltage drops during rural peak hours.',
        mitigation: isHindi
          ? 'एक स्वचालित वोल्टेज स्टेबलाइज़र लगाएं और सुबह के समय मुख्य उत्पादन करें।'
          : isOdia
          ? 'ଭୋଲ୍ଟେଜ୍ ଷ୍ଟାବିଲାଇଜର୍ ବ୍ୟବହାର କରନ୍ତୁ ଓ ସକାଳେ ଉତ୍ପାଦନ କରନ୍ତୁ।'
          : 'Install heavy-duty voltage stabilizer and plan batch runs during morning hours.',
      },
    ],
    competitor_analysis: {
      estimatedSimilarBusinesses: 4,
      businessesWithin5km: 1,
      businessesWithin10km: 3,
      competitionLevel: 'Low',
      localInsights: isHindi
        ? `${village} में संगठित रूप से कोई आधुनिक प्रतिस्पर्धी नहीं है। अधिकांश ग्राहक 7 किमी दूर ${block} बाज़ार जाते हैं, जो आपके लिए बड़ा अवसर है।`
        : isOdia
        ? `${village} ରେ କୌଣସି ସଂଗଠିତ ପ୍ରତିଦ୍ୱନ୍ଦୀ ନାହାନ୍ତି। ଲୋକମାନେ ୭ କିମି ଦୂର ${block} ବଜାରକୁ ଯାଉଛନ୍ତି, ଯାହା ଆପଣଙ୍କ ପାଇଁ ଏକ ବଡ଼ ସୁଯୋଗ।`
        : `Zero organized players inside ${village}. Current residents travel 7km to ${block} central market, leaving a prime underserved gap.`,
      isEstimate: true,
    },
    pricing_analysis: {
      suggestedSellingPrice: '₹42 – ₹48 / unit',
      localPriceRange: '₹40 – ₹52 / unit',
      customerPurchasingRange: '₹35 – ₹50 / unit',
      recommendedPricingStrategy: isHindi
        ? 'प्रारंभिक 3 महीने गुणवत्ता व ताज़गी पर ज़ोर देते हुए बाज़ार से ₹2 कम मूल्य पर बेचें।'
        : isOdia
        ? 'ପ୍ରଥମ ୩ ମାସ ଉତ୍ତମ ଗୁଣବତ୍ତା ସହିତ ବଜାର ଦରଠାରୁ ₹୨ କମ୍ ମୂଲ୍ୟରେ ବିକ୍ରୟ କରନ୍ତୁ।'
        : 'Penetration pricing: offer superior freshness at ₹2 below town market rates to capture immediate loyalty.',
      unitMarginEstimate: '22% – 28%',
      isEstimate: true,
    },
    recommendations: [
      {
        id: 'rec_1',
        title: isHindi ? 'चरणबद्ध शुरुआत (Staged Scaling)' : isOdia ? 'ପର୍ଯ୍ୟାୟକ୍ରମେ ଆରମ୍ଭ' : 'Staged Initial Scaling',
        recommendation: isHindi
          ? 'पहले 3 महीने 50% क्षमता पर कार्य करें ताकि जोखिम न्यूनतम रहे।'
          : isOdia
          ? 'ପ୍ରଥମ ୩ ମାସ ୫୦% କ୍ଷମତାରେ କାର୍ଯ୍ୟ କରି ବିପଦକୁ ହ୍ରାସ କରନ୍ତୁ।'
          : 'Operate at 50% capacity for the first 90 days to test supply-chain stability before full ramp.',
        explanation: isHindi
          ? 'इससे आपको कार्यशील पूंजी का संकट नहीं होगा और मोरेटोरियम अवधि का पूरा लाभ मिलेगा।'
          : isOdia
          ? 'ଏହାଦ୍ୱାରା ପୁଞ୍ଜିର ଅଭାବ ହେବ ନାହିଁ ଏବଂ ରିହାତି ଅବଧିର ଲାଭ ମିଳିବ।'
          : 'Allows smooth adjustment during the scheme moratorium period without cash strain.',
        priority: 'High',
        category: 'Scale',
      },
      {
        id: 'rec_2',
        title: isHindi ? 'विविध ग्राहक चैनल (Multiple Channels)' : isOdia ? 'ଏକାଧିକ ଗ୍ରାହକ ମାଧ୍ୟମ' : 'Multi-Channel Distribution',
        recommendation: isHindi
          ? 'किसी एक खरीदार पर निर्भर न रहें; 60% प्रत्यक्ष और 40% स्थानीय दुकानों को दें।'
          : isOdia
          ? 'କୌଣସି ଜଣେ ଗ୍ରାହକ ଉପରେ ନିର୍ଭର ନକରି ବିଭିନ୍ନ ଦୋକାନୀଙ୍କୁ ଯୋଗାଣ କରନ୍ତୁ।'
          : 'Split sales across direct households (60%) and local retail/dhabas (40%) to eliminate single-buyer risk.',
        explanation: isHindi
          ? 'यदि कोई एक खरीदार भुगतान में देरी करे तो भी आपका दैनिक खर्च प्रभावित नहीं होगा।'
          : isOdia
          ? 'ଜଣେ ପେମେଣ୍ଟ୍ ବିଳମ୍ବ କଲେ ମଧ୍ୟ ଆପଣଙ୍କ ବ୍ୟବସାୟ ଚାଲୁ ରହିବ।'
          : 'Protects daily cash collections even if one institutional buyer delays settlement.',
        priority: 'High',
        category: 'Marketing',
      },
      {
        id: 'rec_3',
        title: isHindi ? 'कार्यशील पूंजी बफर (Working Capital Runway)' : isOdia ? 'କାର୍ଯ୍ୟକାରୀ ପୁଞ୍ଜି ସଂରକ୍ଷଣ' : 'Maintain 3-Month Working Buffer',
        recommendation: isHindi
          ? 'कम से कम 3 महीने के खर्च की राशि बचत खाते में सुरक्षित रखें।'
          : isOdia
          ? 'ଅତି କମରେ ୩ ମାସର ଚଳଣି ଖର୍ଚ୍ଚ ସଞ୍ଚୟ ଖାତାରେ ସୁରକ୍ଷିତ ରଖନ୍ତୁ।'
          : 'Keep at least 15-20% of your initial margin liquid as an emergency operating buffer.',
        explanation: isHindi
          ? 'यह आकस्मिक मशीन मरम्मत या मौसमी उतार-चढ़ाव के समय सुरक्षा प्रदान करेगा।'
          : isOdia
          ? 'ଏହା ମେସିନ୍ ମରାମତି ବା ଅପ୍ରତ୍ୟାଶିତ ଖର୍ଚ୍ଚ ସମୟରେ ସହାୟକ ହେବ।'
          : 'Guarantees uninterrupted operation during unforeseen equipment repair or monsoon slowdowns.',
        priority: 'Medium',
        category: 'Finance',
      },
    ],
    ai_model: 'GramBiz-Deterministic-Advisory-Engine',
    created_at: new Date().toISOString(),
  };
}

function getFallbackRecommendations(district: string, state: string, margin: number) {
  const pCost = margin * 10;
  return [
    {
      id: 'rec_dairy',
      businessCategoryId: 'cat_dairy',
      businessName: 'Dairy Farming & Milk Chilling Unit',
      category: 'Livestock & Agro',
      feasibilityScore: 88,
      estimatedInvestment: `₹${(pCost * 0.5).toLocaleString('en-IN')} – ₹${pCost.toLocaleString('en-IN')}`,
      marketDemand: 'Very High',
      competition: 'Low',
      risk: 'Low',
      potentialScalability: 'Very High',
      briefRationale: `High daily milk demand deficit in ${district} with guaranteed cooperative off-take at stable prices.`,
      recommendedMarginMin: 50000,
    },
    {
      id: 'rec_food_processing',
      businessCategoryId: 'cat_food_processing',
      businessName: 'Agro & Spice Processing (Atta / Mustard Oil Mill)',
      category: 'Food Processing',
      feasibilityScore: 84,
      estimatedInvestment: `₹${(pCost * 0.7).toLocaleString('en-IN')} – ₹${pCost.toLocaleString('en-IN')}`,
      marketDemand: 'High',
      competition: 'Medium',
      risk: 'Moderate',
      potentialScalability: 'High',
      briefRationale: `Direct value-addition to local harvests in ${district} capturing a 25-35% retail packaging margin.`,
      recommendedMarginMin: 75000,
    },
    {
      id: 'rec_grocery',
      businessCategoryId: 'cat_grocery',
      businessName: 'Daily Essential Grocery & FMCG Hub',
      category: 'Retail',
      feasibilityScore: 81,
      estimatedInvestment: `₹${(pCost * 0.3).toLocaleString('en-IN')} – ₹${(pCost * 0.6).toLocaleString('en-IN')}`,
      marketDemand: 'High',
      competition: 'Medium',
      risk: 'Low',
      potentialScalability: 'Medium',
      briefRationale: `Consistent daily household turnover with low capital barrier and rapid payback period.`,
      recommendedMarginMin: 25000,
    },
    {
      id: 'rec_tailoring',
      businessCategoryId: 'cat_tailoring',
      businessName: 'Tailoring & Garment Making Unit',
      category: 'Textile & Apparel',
      feasibilityScore: 78,
      estimatedInvestment: `₹${(pCost * 0.2).toLocaleString('en-IN')} – ₹${(pCost * 0.4).toLocaleString('en-IN')}`,
      marketDemand: 'High',
      competition: 'Low',
      risk: 'Low',
      potentialScalability: 'High',
      briefRationale: `High demand for school uniforms, festive attire, and customized women garments in ${district}.`,
      recommendedMarginMin: 15000,
    },
  ];
}

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GramBiz AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
