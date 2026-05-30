export type Language = "en" | "te";

export const translations = {
  en: {
    siteTitle: "Hindu Graveyard Construction",
    subtitle: "Donation Registry",
    heroTitleEn: "Hindu Graveyard Construction — Donation Registry",
    heroTitleTe: "హిందూ స్మశానవాటిక నిర్మాణం — విరాళాల నమోదు",
    totalRaised: "Total Amount Raised",
    latestDonations: "Recent Donations",
    topDonors: "Top Donors",
    allDonations: "All Donations",
    donorName: "Donor Name",
    amount: "Amount",
    date: "Date",
    rank: "Rank",
    search: "Search by name...",
    serialNo: "S.No",
    loading: "Loading donations...",
    noDonations: "No donations yet.",
    footer:
      "🙏 This donation supports the construction of a Hindu burial ground for our community",
    adminLogin: "Admin Login",
    username: "Username",
    password: "Password",
    login: "Login",
    logout: "Logout",
    dashboard: "Admin Dashboard",
    addDonation: "Add Donation",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this donation?",
    invalidCredentials: "Invalid username or password",
    nameRequired: "Donor name is required",
    amountRequired: "Amount must be greater than 0",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
  },
  te: {
    siteTitle: "హిందూ స్మశానవాటిక నిర్మాణం",
    subtitle: "విరాళాల నమోదు",
    heroTitleEn: "Hindu Graveyard Construction — Donation Registry",
    heroTitleTe: "హిందూ స్మశానవాటిక నిర్మాణం — విరాళాల నమోదు",
    totalRaised: "మొత్తం సేకరించిన మొత్తం",
    latestDonations: "తాజా విరాళాలు",
    topDonors: "అగ్రశ్రేణి దాతలు",
    allDonations: "అన్ని విరాళాలు",
    donorName: "దాత పేరు",
    amount: "మొత్తం",
    date: "తేదీ",
    rank: "స్థానం",
    search: "పేరు వెతకండి...",
    serialNo: "క్ర.సం.",
    loading: "విరాళాలు లోడ్ అవుతున్నాయి...",
    noDonations: "ఇంకా విరాళాలు లేవు.",
    footer:
      "🙏 ఈ విరాళం మన సమాజానికి హిందూ స్మశాన వాటిక నిర్మాణానికి తోడ్పడుతుంది",
    adminLogin: "అడ్మిన్ లాగిన్",
    username: "వినియోగదారు పేరు",
    password: "పాస్‌వర్డ్",
    login: "లాగిన్",
    logout: "లాగ్ అవుట్",
    dashboard: "అడ్మిన్ డాష్‌బోర్డ్",
    addDonation: "విరాళం జోడించండి",
    delete: "తొలగించు",
    confirmDelete: "ఈ విరాళాన్ని తొలగించాలా?",
    invalidCredentials: "తప్పు వినియోగదారు పేరు లేదా పాస్‌వర్డ్",
    nameRequired: "దాత పేరు అవసరం",
    amountRequired: "మొత్తం 0 కంటే ఎక్కువగా ఉండాలి",
    previous: "మునుపటి",
    next: "తదుపరి",
    page: "పేజీ",
    of: "లో",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export interface Donation {
  id: number;
  name: string;
  amount: number;
  createdAt: string;
}
