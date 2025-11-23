export interface Contact {
  name: string;
  email: string;
  title: string;
  phone: string;
  linkedIn: string;
}

export interface Brand {
  id: string;
  companyName: string;
  industry: string;
  hqLocation: string;
  division: string;
  description: string;
  foundingDate: string;
  regions: string[];
  annualRevenue: string;
  lastFunding: string;
  totalFunding: string;
  website: string;
  employees: number;
  targetAudience: string;
  sponsorshipTypes: string[];
  keySponsorships: string[];
  strategicFocus: string;
  profileURL: string;
  outreachProfile: string;
  lastUpdated: string;
  logo: string;
  inCRM: boolean;
  contacts: Contact[];
}

