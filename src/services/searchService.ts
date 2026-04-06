import { GoogleGenAI } from "@google/genai";

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  category: 'App' | 'Service' | 'Feature' | 'AI';
  icon?: string;
}

const INTERNAL_PAGES: SearchResult[] = [
  { id: 'home', title: 'Home', description: 'Main dashboard and overview', path: '/', category: 'App' },
  { id: 'mentorship', title: 'Mentorship', description: 'Learn forex trading from experts', path: '/services/mentorship', category: 'Service' },
  { id: 'signals', title: 'Signal Services', description: 'Premium trading signals', path: '/services/signals', category: 'Service' },
  { id: 'investment', title: 'Investment', description: 'Earn up to 30% ROI', path: '/services/investment', category: 'Service' },
  { id: 'assets', title: 'Wallet / Assets', description: 'Manage your funds and assets', path: '/assets', category: 'App' },
  { id: 'support', title: 'Support', description: 'Get help and contact us', path: '/support', category: 'App' },
  { id: 'evaluation', title: 'Evaluation', description: 'Pass your prop firm easily', path: '/services/evaluation', category: 'Service' },
  { id: 'account-management', title: 'Account Management', description: 'Expert management for your accounts', path: '/services/account-management', category: 'Service' },
  { id: 'add-funds', title: 'Add Funds', description: 'Deposit money into your account', path: '/deposit-funds', category: 'Feature' },
  { id: 'transactions', title: 'Transactions', description: 'View your transaction history', path: '/transactions', category: 'Feature' },
  { id: 'activities', title: 'Activities', description: 'Track your service activities', path: '/activities/investment', category: 'Feature' },
  { id: 'markets', title: 'Markets', description: 'Real-time market data', path: '/markets', category: 'App' },
  { id: 'copy-trading', title: 'Copy Trading', description: 'Follow top traders', path: '/copy-trading', category: 'App' },
  { id: 'ai-insights', title: 'AI Insights', description: 'Smart market analysis', path: '/ai-insights', category: 'App' },
];

const SYNONYMS: Record<string, string[]> = {
  'fund': ['deposit', 'add funds', 'money', 'wallet'],
  'profit': ['investment', 'roi', 'earn', 'yield'],
  'learn': ['mentorship', 'education', 'course', 'forex trading'],
  'help': ['support', 'contact', 'tickets'],
  'withdraw': ['transactions', 'payout'],
  'prop': ['evaluation', 'challenge', 'firm'],
};

export async function searchInternal(query: string): Promise<SearchResult[]> {
  const lowerQuery = query.toLowerCase();
  
  return INTERNAL_PAGES.filter(page => {
    const titleMatch = page.title.toLowerCase().includes(lowerQuery);
    const descMatch = page.description.toLowerCase().includes(lowerQuery);
    
    // Check synonyms
    const synonymMatch = Object.entries(SYNONYMS).some(([key, values]) => {
      if (key.includes(lowerQuery) || values.some(v => v.includes(lowerQuery))) {
        return page.title.toLowerCase().includes(key) || page.id.includes(key);
      }
      return false;
    });

    return titleMatch || descMatch || synonymMatch;
  });
}

export async function searchGemini(query: string): Promise<SearchResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a financial and market expert for Owambe Traders. 
      The user is asking: "${query}". 
      If it's a market question (e.g., price, trends, news), provide a concise, professional summary (max 2-3 sentences).
      If it's not a market question, try to be helpful but brief.
      Always maintain a professional tone.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    if (response.text) {
      return {
        id: 'gemini-ai',
        title: 'AI Insights',
        description: response.text,
        path: '/ai-insights',
        category: 'AI'
      };
    }
  } catch (error) {
    console.error("Gemini Search Error:", error);
  }
  
  return null;
}
