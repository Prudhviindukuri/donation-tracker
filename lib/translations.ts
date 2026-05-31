export type Language = "en" | "te";
export type PaymentMode = "CASH" | "ONLINE";

export const translations = {
  en: {
    siteTitle: "Hindu Graveyard Construction",
    subtitle: "Donation Registry",
    heroTitleEn: "Maha Prasthanam : Pippara — Hindu Graveyard Construction — Donations",
    heroTitleTe: "మహాప్రస్థనం : పిప్పర — హిందూ స్మశానవాటిక నిర్మాణం — విరాళాలు",
    totalRaised: "Total Amount Raised",
    latestDonations: "Recent Donations",
    topDonors: "Top Donors",
    allDonations: "All Donations",
    donorName: "Donor Name",
    fatherName: "Father's Name",
    amount: "Amount",
    date: "Date",
    paymentMode: "Payment Mode",
    cash: "Cash",
    online: "Online",
    rank: "Rank",
    search: "Search by name...",
    sortBy: "Sort by",
    dateNewest: "Date (newest first)",
    dateOldest: "Date (oldest first)",
    amountHigh: "Amount (high to low)",
    amountLow: "Amount (low to high)",
    filterAll: "All",
    bucketUnder10k: "< ₹10K",
    bucket10to25k: "₹10K–25K",
    bucket25to50k: "₹25K–50K",
    bucket50to1L: "₹50K–1L",
    bucket1Lplus: "₹1L+",
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
    edit: "Edit",
    editDonation: "Edit Donation",
    save: "Save",
    cancel: "Cancel",
    updateFailed: "Failed to update donation",
    actions: "Actions",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this donation?",
    invalidCredentials: "Invalid username or password",
    nameRequired: "Donor name is required",
    amountRequired: "Amount must be greater than 0",
    dateRequired: "Date is required",
    paymentModeRequired: "Payment mode is required",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
  },
  te: {
    siteTitle: "హిందూ స్మశానవాటిక నిర్మాణం",
    subtitle: "విరాళాల నమోదు",
    heroTitleEn: "Maha Prasthanam : Pippara — Hindu Graveyard Construction — Donations",
    heroTitleTe: "మహాప్రస్థనం : పిప్పర — హిందూ స్మశానవాటిక నిర్మాణం — విరాళాలు",
    totalRaised: "మొత్తం సేకరించిన మొత్తం",
    latestDonations: "తాజా విరాళాలు",
    topDonors: "అగ్రశ్రేణి దాతలు",
    allDonations: "అన్ని విరాళాలు",
    donorName: "దాత పేరు",
    fatherName: "తండ్రి పేరు",
    amount: "మొత్తం",
    date: "తేదీ",
    paymentMode: "చెల్లింపు విధానం",
    cash: "నగదు",
    online: "ఆన్‌లైన్",
    rank: "స్థానం",
    search: "పేరు వెతకండి...",
    sortBy: "క్రమబద్ధీకరించు",
    dateNewest: "తేదీ (కొత్తవి ముందు)",
    dateOldest: "తేదీ (పాతవి ముందు)",
    amountHigh: "మొత్తం (ఎక్కువ నుండి తక్కువ)",
    amountLow: "మొత్తం (తక్కువ నుండి ఎక్కువ)",
    filterAll: "అన్నీ",
    bucketUnder10k: "< ₹10K",
    bucket10to25k: "₹10K–25K",
    bucket25to50k: "₹25K–50K",
    bucket50to1L: "₹50K–1L",
    bucket1Lplus: "₹1L+",
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
    edit: "సవరించు",
    editDonation: "విరాళం సవరించండి",
    save: "సేవ్",
    cancel: "రద్దు",
    updateFailed: "విరాళం నవీకరించడం విఫలమైంది",
    actions: "చర్యలు",
    delete: "తొలగించు",
    confirmDelete: "ఈ విరాళాన్ని తొలగించాలా?",
    invalidCredentials: "తప్పు వినియోగదారు పేరు లేదా పాస్‌వర్డ్",
    nameRequired: "దాత పేరు అవసరం",
    amountRequired: "మొత్తం 0 కంటే ఎక్కువగా ఉండాలి",
    dateRequired: "తేదీ అవసరం",
    paymentModeRequired: "చెల్లింపు విధానం అవసరం",
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

export function formatPaymentMode(
  mode: PaymentMode,
  lang: Language
): string {
  if (mode === "CASH") return translations[lang].cash;
  return translations[lang].online;
}

export function todayInputDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface Donation {
  id: number;
  name: string;
  fatherName: string;
  amount: number;
  donationDate: string;
  paymentMode: PaymentMode;
  createdAt: string;
}
