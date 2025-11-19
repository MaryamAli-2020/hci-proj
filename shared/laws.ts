export interface LawVersion {
  date: string;
  title: string;
  changes: string;
}

export interface ContentSection {
  title: string;
  content: string;
}

export interface Law {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  lastUpdated: string;
  legalReference: string;
  emirate?: string;
  keywords: string[];
  aiSummary?: string;
  sections?: ContentSection[];
  versions?: LawVersion[];
  crossReferences?: string[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  count: number;
}

export const categories: Category[] = [
  {
    id: "labor",
    title: "Labour Law",
    description: "UAE Labour Law and employment regulations",
    icon: "💼",
    color: "from-green-500 to-emerald-500",
    count: 12,
  },
  {
    id: "civil",
    title: "Civil Law",
    description: "Civil and commercial law matters",
    icon: "📋",
    color: "from-blue-500 to-cyan-500",
    count: 15,
  },
  {
    id: "criminal",
    title: "Criminal Law",
    description: "Criminal offenses and penalties under UAE law",
    icon: "⚖️",
    color: "from-red-500 to-pink-500",
    count: 11,
  },
  {
    id: "family",
    title: "Family Law",
    description: "Personal status, marriage, inheritance, and custody",
    icon: "👨‍👩‍👧‍👦",
    color: "from-purple-500 to-pink-500",
    count: 10,
  },
  {
    id: "corporate",
    title: "Corporate & Commercial Law",
    description: "Business entities, contracts, and commercial transactions",
    icon: "🏢",
    color: "from-amber-500 to-orange-500",
    count: 13,
  },
  {
    id: "intellectual",
    title: "Intellectual Property",
    description: "Patents, trademarks, copyrights, and IP protection",
    icon: "🧠",
    color: "from-indigo-500 to-purple-500",
    count: 9,
  },
];

export const laws: Law[] = [
  // Labour Laws
  {
    id: "labor-1",
    title: "Working Hours and Overtime",
    description: "Maximum working hours and compensation for overtime",
    content: "The normal working hours shall not exceed 48 hours per week, which may be distributed over the days of the work week. For workers in hazardous or unhealthy conditions, the normal working hours shall not exceed 40 hours per week. Overtime work shall be remunerated at least 25% above the ordinary wage.",
    category: "labor",
    lastUpdated: "2024-01-15",
    legalReference: "UAE Labour Law Federal Decree No. 8 of 1980, Articles 64-66",
    keywords: ["working hours", "overtime", "compensation", "wages"],
    aiSummary: "UAE law limits standard work weeks to 48 hours maximum, with stricter 40-hour limits for hazardous roles. All overtime must be compensated at minimum 25% above the regular wage rate, providing important protections for worker compensation.",
    sections: [
      {
        title: "Standard Working Hours",
        content: "The normal working hours shall not exceed 48 hours per week, which may be distributed over the days of the work week."
      },
      {
        title: "Hazardous Work Conditions",
        content: "For workers in hazardous or unhealthy conditions, the normal working hours shall not exceed 40 hours per week."
      },
      {
        title: "Overtime Compensation",
        content: "Overtime work shall be remunerated at least 25% above the ordinary wage."
      }
    ],
    versions: [
      {
        date: "2024-01-15",
        title: "Current Version",
        changes: "Latest amendment with updated overtime rates"
      },
      {
        date: "2022-06-20",
        title: "Previous Amendment",
        changes: "Clarified hazardous work classifications"
      },
      {
        date: "2020-03-10",
        title: "Original Decree",
        changes: "Federal Decree No. 8 of 1980 enacted"
      }
    ],
    crossReferences: ["labor-2", "labor-5", "labor-6"]
  },
  {
    id: "labor-2",
    title: "Annual Leave and Public Holidays",
    description: "Employees' entitlement to annual leave and public holidays",
    content: "Every worker shall be entitled to an annual leave of at least 30 calendar days, including public holidays. For workers engaged in arduous or hazardous occupations, the leave shall be extended to 45 days. The worker shall be paid his full wages during the leave period.",
    category: "labor",
    lastUpdated: "2024-01-14",
    legalReference: "UAE Labour Law Federal Decree No. 8 of 1980, Articles 70-72",
    keywords: ["annual leave", "public holidays", "vacation", "paid leave"],
    aiSummary: "UAE workers are entitled to minimum 30 days annual leave including public holidays, with extended 45 days for hazardous work. All leave is paid at full wages, protecting workers' right to rest and leisure.",
    sections: [
      { title: "Minimum Annual Leave", content: "Every worker shall be entitled to an annual leave of at least 30 calendar days, including public holidays." },
      { title: "Extended Leave for Hazardous Work", content: "For workers engaged in arduous or hazardous occupations, the leave shall be extended to 45 days." },
      { title: "Leave Payment", content: "The worker shall be paid his full wages during the leave period." }
    ],
    versions: [
      { date: "2024-01-14", title: "Current Version", changes: "Updated leave day calculations" },
      { date: "2021-09-15", title: "Amendment", changes: "Extended leave for hazardous occupations" }
    ],
    crossReferences: ["labor-1", "labor-6"]
  },
  {
    id: "labor-3",
    title: "End of Service Gratuity",
    description: "Compensation for workers upon termination of employment",
    content: "An employer shall pay an end of service gratuity to every worker whose service is terminated. For workers with less than one year of service: no gratuity. For one year to less than five years: 1/3 of the last wage for each year of service. For five years and above: 1/2 of the last wage for each year of service.",
    category: "labor",
    lastUpdated: "2024-01-13",
    legalReference: "UAE Labour Law Federal Decree No. 8 of 1980, Article 84",
    keywords: ["gratuity", "severance", "termination", "end of service"],
    aiSummary: "UAE employers must provide severance gratuity to terminated workers, calculated as 1/3 of last wage per year (1-5 years) or 1/2 per year (5+ years). No gratuity applies for employment under one year.",
    sections: [
      { title: "Service Less Than 1 Year", content: "No gratuity for workers with less than one year of service." },
      { title: "Service 1-5 Years", content: "1/3 of the last wage for each year of service." },
      { title: "Service 5 Years and Above", content: "1/2 of the last wage for each year of service." }
    ],
    versions: [
      { date: "2024-01-13", title: "Current Version", changes: "Confirmed gratuity calculations" }
    ],
    crossReferences: ["labor-8"]
  },
  {
    id: "labor-4",
    title: "Minimum Wage Requirements",
    description: "Minimum wages for workers in UAE",
    content: "The minimum wage for workers in the private sector shall be determined by ministerial decision. Currently, the general minimum wage is AED 2,500 per month for all workers in the private sector. Workers under collective labour agreements may receive higher wages.",
    category: "labor",
    lastUpdated: "2024-01-12",
    legalReference: "UAE Cabinet Resolution No. 15 of 2020 regarding Minimum Wage",
    keywords: ["minimum wage", "salary", "AED 2500", "compensation"],
    aiSummary: "The UAE's current minimum wage for private sector workers is AED 2,500 per month. This can be adjusted by ministerial decision, and workers under collective agreements may earn higher amounts.",
    sections: [
      { title: "General Minimum Wage", content: "The general minimum wage is AED 2,500 per month for all workers in the private sector." },
      { title: "Ministerial Adjustments", content: "The minimum wage may be adjusted by ministerial decision." },
      { title: "Collective Agreements", content: "Workers under collective labour agreements may receive higher wages." }
    ],
    versions: [
      { date: "2024-01-12", title: "Current Version", changes: "AED 2,500 minimum wage in effect" },
      { date: "2020-12-20", title: "Cabinet Resolution", changes: "Minimum wage set at AED 2,500" }
    ],
    crossReferences: ["labor-1", "labor-6"]
  },
  {
    id: "labor-5",
    title: "Workplace Safety and Health",
    description: "Employer obligations regarding worker safety",
    content: "Employers must provide safe and healthy working conditions, ensure proper ventilation, adequate lighting, and sanitary facilities. Employers must provide safety equipment and training. Workers must be protected from hazardous conditions, and employers must maintain accident insurance coverage.",
    category: "labor",
    lastUpdated: "2024-01-11",
    legalReference: "UAE Labour Law Federal Decree No. 8 of 1980, Articles 30-37; Federal Law No. 38 of 1998",
    keywords: ["safety", "health", "hazard", "workplace conditions"],
    aiSummary: "UAE law mandates employers maintain safe working conditions with proper ventilation, lighting, and sanitary facilities. Employers must provide safety equipment, training, and insurance coverage for workplace accidents.",
    sections: [
      { title: "Safe Working Conditions", content: "Employers must provide safe and healthy working conditions, ensure proper ventilation, adequate lighting, and sanitary facilities." },
      { title: "Safety Equipment and Training", content: "Employers must provide safety equipment and training." },
      { title: "Hazard Protection and Insurance", content: "Workers must be protected from hazardous conditions, and employers must maintain accident insurance coverage." }
    ],
    versions: [
      { date: "2024-01-11", title: "Current Version", changes: "Safety standards reaffirmed" }
    ],
    crossReferences: ["labor-1", "labor-7"]
  },
  {
    id: "labor-6",
    title: "Employment Contract Requirements",
    description: "Mandatory terms and conditions in employment contracts",
    content: "An employment contract must include: nature of work, place of work, wage or salary, work hours, leave entitlements, and employment duration. The contract must be in Arabic and provided to the worker. No deduction from wages except for legal requirements and authorized deductions.",
    category: "labor",
    lastUpdated: "2024-01-10",
    legalReference: "UAE Labour Law Federal Decree No. 8 of 1980, Articles 16-24",
    keywords: ["employment contract", "terms", "conditions", "wages"],
    aiSummary: "Valid UAE employment contracts must specify job nature, location, wages, hours, leave, and duration in Arabic. Wage deductions only allowed for legal/authorized purposes, protecting worker pay and rights.",
    sections: [
      { title: "Mandatory Contract Terms", content: "An employment contract must include: nature of work, place of work, wage or salary, work hours, leave entitlements, and employment duration." },
      { title: "Contract Language", content: "The contract must be in Arabic and provided to the worker." },
      { title: "Wage Protection", content: "No deduction from wages except for legal requirements and authorized deductions." }
    ],
    versions: [
      { date: "2024-01-10", title: "Current Version", changes: "Contract requirements clarified" }
    ],
    crossReferences: ["labor-1", "labor-2", "labor-4"]
  },
  {
    id: "labor-7",
    title: "Discrimination and Harassment",
    description: "Protection against workplace discrimination",
    content: "No worker shall be discriminated against based on nationality, gender, religion, or social class. Employers must maintain respectful workplaces free from harassment and intimidation. Violations can result in fines from AED 10,000 to AED 50,000.",
    category: "labor",
    lastUpdated: "2024-01-09",
    legalReference: "UAE Labour Law Federal Decree No. 8 of 1980, Article 9; Federal Law No. 5 of 1985",
    keywords: ["discrimination", "harassment", "equality", "workplace rights"],
    aiSummary: "UAE law prohibits workplace discrimination based on nationality, gender, religion, or social status. Employers must ensure harassment-free environments, with violations resulting in AED 10,000-50,000 fines.",
    sections: [
      { title: "Prohibited Discrimination", content: "No worker shall be discriminated against based on nationality, gender, religion, or social class." },
      { title: "Employer Responsibilities", content: "Employers must maintain respectful workplaces free from harassment and intimidation." },
      { title: "Penalties", content: "Violations can result in fines from AED 10,000 to AED 50,000." }
    ],
    versions: [
      { date: "2024-01-09", title: "Current Version", changes: "Anti-discrimination provisions reaffirmed" }
    ],
    crossReferences: ["labor-5"]
  },
  {
    id: "labor-8",
    title: "Termination of Employment",
    description: "Procedures and legal grounds for terminating employment",
    content: "Employment may be terminated by notice, immediate dismissal for just cause, or end of contract. For termination by notice, a minimum notice period of 30 days is required from the employer. Just cause includes gross misconduct, neglect of duty, or repeated violations. The worker must receive end of service gratuity unless dismissed for just cause.",
    category: "labor",
    lastUpdated: "2024-01-08",
    legalReference: "UAE Labour Law Federal Decree No. 8 of 1980, Articles 120-126",
    keywords: ["termination", "dismissal", "notice period", "employment end"],
    aiSummary: "Employment termination requires 30 days' notice minimum. Just cause dismissals (gross misconduct, neglect) don't require gratuity, while regular terminations do provide end-of-service compensation.",
    sections: [
      { title: "Termination Methods", content: "Employment may be terminated by notice, immediate dismissal for just cause, or end of contract." },
      { title: "Notice Period", content: "For termination by notice, a minimum notice period of 30 days is required from the employer." },
      { title: "Just Cause Grounds", content: "Just cause includes gross misconduct, neglect of duty, or repeated violations." },
      { title: "Gratuity Rights", content: "The worker must receive end of service gratuity unless dismissed for just cause." }
    ],
    versions: [
      { date: "2024-01-08", title: "Current Version", changes: "Termination procedures clarified" }
    ],
    crossReferences: ["labor-3"]
  },

  // Civil Law
  {
    id: "civil-1",
    title: "Contract Formation and Validity",
    description: "Requirements for valid contracts under UAE civil law",
    content: "A valid contract requires: offer and acceptance, intention to create legal relations, consideration, and legal capacity of parties. Both parties must have reached the age of 21 years and be of sound mind. The subject matter must be legal and possible. Contracts are binding once accepted and cannot be unilaterally withdrawn unless agreed.",
    category: "civil",
    lastUpdated: "2024-01-15",
    legalReference: "UAE Civil Code Federal Law No. 5 of 1985, Articles 127-147",
    keywords: ["contract", "formation", "validity", "agreement"],
    aiSummary: "Valid UAE contracts require offer/acceptance, mutual intent, consideration, and parties 21+ years old and of sound mind. The subject must be legal and possible, and binding contracts cannot be unilaterally withdrawn.",
    sections: [
      { title: "Essential Elements", content: "A valid contract requires: offer and acceptance, intention to create legal relations, consideration, and legal capacity of parties." },
      { title: "Legal Capacity", content: "Both parties must have reached the age of 21 years and be of sound mind." },
      { title: "Subject Matter", content: "The subject matter must be legal and possible." },
      { title: "Binding Nature", content: "Contracts are binding once accepted and cannot be unilaterally withdrawn unless agreed." }
    ],
    versions: [
      { date: "2024-01-15", title: "Current Version", changes: "Contract formation rules updated" }
    ],
    crossReferences: ["civil-4", "corporate-4"]
  },
  {
    id: "civil-2",
    title: "Property Ownership and Rights",
    description: "Ownership rights and property transactions",
    content: "Property ownership gives the owner full rights of possession, use, and disposal, subject to law and property of others. Real property includes land and structures. Personal property includes movable items. Property rights can be transferred through sale, gift, or inheritance. Foreign nationals may own property in certain Dubai and Abu Dhabi designated areas.",
    category: "civil",
    lastUpdated: "2024-01-14",
    legalReference: "UAE Civil Code Federal Law No. 5 of 1985, Articles 184-225; Dubai Law No. 26 of 2006",
    keywords: ["property", "ownership", "real estate", "possession"],
    aiSummary: "Property ownership includes possession, use, and disposal rights for both real property (land/structures) and personal property (movable items). Foreign nationals can own property in designated areas.",
    sections: [
      { title: "Ownership Rights", content: "Property ownership gives the owner full rights of possession, use, and disposal, subject to law and property of others." },
      { title: "Types of Property", content: "Real property includes land and structures. Personal property includes movable items." },
      { title: "Transfer of Rights", content: "Property rights can be transferred through sale, gift, or inheritance." },
      { title: "Foreign Nationals", content: "Foreign nationals may own property in certain Dubai and Abu Dhabi designated areas." }
    ],
    versions: [
      { date: "2024-01-14", title: "Current Version", changes: "Property law clarified" }
    ],
    crossReferences: ["family-4"]
  },
  {
    id: "civil-3",
    title: "Debt and Liability",
    description: "Legal obligations and debt settlement",
    content: "Debt is a fixed obligation to pay a specific sum. Debtors must pay at the agreed time and place. If debt becomes due and unpaid, the debtor is liable for compensation and damages. Debt can be settled by payment, novation, or by agreement. Civil liability arises from breach of contract or unlawful act causing damage.",
    category: "civil",
    lastUpdated: "2024-01-13",
    legalReference: "UAE Civil Code Federal Law No. 5 of 1985, Articles 249-286",
    keywords: ["debt", "liability", "payment", "obligation"],
    aiSummary: "Debtors must pay fixed obligations at agreed times/places. Unpaid debts trigger liability for compensation. Debt can be settled by payment, novation, or agreement; civil liability arises from breach or unlawful acts.",
    sections: [
      { title: "Debt Definition", content: "Debt is a fixed obligation to pay a specific sum." },
      { title: "Payment Obligations", content: "Debtors must pay at the agreed time and place." },
      { title: "Default Liability", content: "If debt becomes due and unpaid, the debtor is liable for compensation and damages." },
      { title: "Debt Settlement", content: "Debt can be settled by payment, novation, or by agreement. Civil liability arises from breach of contract or unlawful act causing damage." }
    ],
    versions: [
      { date: "2024-01-13", title: "Current Version", changes: "Debt obligations clarified" }
    ],
    crossReferences: ["civil-1", "civil-4"]
  },
  {
    id: "civil-4",
    title: "Negotiable Instruments",
    description: "Cheques, promissory notes, and bills of exchange",
    content: "Cheques are written orders to pay a sum of money on demand. They must be presented within 6 months of issuance. Bounced cheques due to insufficient funds are an offense. Promissory notes and bills of exchange follow similar rules. A cheque can be dishonored only if funds are insufficient; other issues may not prevent payment.",
    category: "civil",
    lastUpdated: "2024-01-12",
    legalReference: "UAE Negotiable Instruments Law Federal Law No. 11 of 2020",
    keywords: ["cheque", "negotiable instrument", "payment", "promissory note"],
    aiSummary: "Cheques are demand payment orders with 6-month presentation limits. Insufficient funds cheques are criminal offenses. Promissory notes and bills of exchange follow similar rules in UAE law.",
    sections: [
      { title: "Cheque Definition", content: "Cheques are written orders to pay a sum of money on demand." },
      { title: "Presentation Time", content: "They must be presented within 6 months of issuance." },
      { title: "Bounced Cheques", content: "Bounced cheques due to insufficient funds are an offense." },
      { title: "Other Instruments", content: "Promissory notes and bills of exchange follow similar rules." }
    ],
    versions: [
      { date: "2024-01-12", title: "Current Version", changes: "Negotiable instruments law updated" }
    ],
    crossReferences: ["civil-1", "civil-3"]
  },
  {
    id: "civil-5",
    title: "Warranty and Product Liability",
    description: "Seller's obligations and consumer protection",
    content: "The seller warrants that goods are of satisfactory quality, fit for purpose, and match the description. For defective goods, buyers may claim replacement, repair, or refund. The warranty period is generally 12 months from purchase. Consumer protection applies to all sales of goods and services in the consumer market.",
    category: "civil",
    lastUpdated: "2024-01-11",
    legalReference: "UAE Consumer Protection Law Federal Law No. 24 of 2006, Articles 4-12",
    keywords: ["warranty", "product liability", "defect", "consumer protection"],
    aiSummary: "Sellers must warrant goods meet quality standards and match descriptions. Defective goods allow buyers to claim replacement, repair, or refund within 12 months. Consumer protection covers all goods and services.",
    sections: [
      { title: "Seller Warranty", content: "The seller warrants that goods are of satisfactory quality, fit for purpose, and match the description." },
      { title: "Defective Goods Remedies", content: "For defective goods, buyers may claim replacement, repair, or refund." },
      { title: "Warranty Period", content: "The warranty period is generally 12 months from purchase." },
      { title: "Consumer Protection Scope", content: "Consumer protection applies to all sales of goods and services in the consumer market." }
    ],
    versions: [
      { date: "2024-01-11", title: "Current Version", changes: "Consumer protection standards updated" }
    ],
    crossReferences: ["civil-1", "civil-3"]
  },

  // Criminal Law
  {
    id: "criminal-1",
    title: "Theft and Embezzlement",
    description: "Criminal penalties for theft and misappropriation",
    content: "Theft is the taking of another's property without permission with intent to keep it. Punishment ranges from 6 months to 3 years imprisonment and/or fines. Embezzlement by employees is punishable by imprisonment up to 5 years. Aggravated theft with weapons carries stricter penalties up to 10 years.",
    category: "criminal",
    lastUpdated: "2024-01-15",
    legalReference: "UAE Penal Code Federal Law No. 3 of 1987, Articles 379-386",
    keywords: ["theft", "embezzlement", "stealing", "misappropriation"],
  },
  {
    id: "criminal-2",
    title: "Fraud and Forgery",
    description: "Penalties for fraudulent acts and document forgery",
    content: "Fraud includes deception causing financial loss. Punishment is 3 months to 3 years imprisonment and/or fine. Forgery of documents is punishable by 6 months to 5 years imprisonment. Using forged documents is also criminal. Forgery of official documents carries enhanced penalties.",
    category: "criminal",
    lastUpdated: "2024-01-14",
    legalReference: "UAE Penal Code Federal Law No. 3 of 1987, Articles 338-357; 383",
    keywords: ["fraud", "forgery", "deception", "false document"],
  },
  {
    id: "criminal-3",
    title: "Assault and Injury",
    description: "Criminal penalties for violence and bodily harm",
    content: "Simple assault causing injury is punishable by 6 months to 2 years imprisonment. Grievous bodily harm carries 1 to 3 years imprisonment. Assault by government officials carries enhanced penalties. Intentional injury with specified implements carries 1 to 5 years imprisonment depending on severity.",
    category: "criminal",
    lastUpdated: "2024-01-13",
    legalReference: "UAE Penal Code Federal Law No. 3 of 1987, Articles 334-336",
    keywords: ["assault", "injury", "violence", "bodily harm"],
  },
  {
    id: "criminal-4",
    title: "Drug Offenses",
    description: "Penalties for drug trafficking and possession",
    content: "Possession of drugs for personal use is punishable by 3 months to 1 year imprisonment. Drug trafficking carries 4 years to life imprisonment depending on quantity and substance. Distribution and sale of drugs carry 10 years to life imprisonment. Cultivation of narcotic plants carries severe penalties.",
    category: "criminal",
    lastUpdated: "2024-01-12",
    legalReference: "UAE Anti-Narcotics Law Federal Law No. 14 of 1995, Articles 12-40",
    keywords: ["drug", "trafficking", "possession", "narcotics"],
  },
  {
    id: "criminal-5",
    title: "Traffic Violations and DUI",
    description: "Penalties for traffic offenses and driving under influence",
    content: "Driving under alcohol influence is a serious criminal offense. Penalties include fines from AED 1,000 to AED 50,000, imprisonment up to 6 months, vehicle confiscation, and license suspension. Blood alcohol level above 50mg is illegal. Causing injury while driving under influence carries 5 to 10 years imprisonment.",
    category: "criminal",
    lastUpdated: "2024-01-11",
    legalReference: "UAE Traffic Law Federal Law No. 21 of 1995, Articles 79-95; Penal Code Articles 269-272",
    keywords: ["DUI", "traffic", "alcohol", "driving under influence"],
  },

  // Family Law
  {
    id: "family-1",
    title: "Marriage and Consent",
    description: "Legal requirements for marriage in UAE",
    content: "Marriage is a contract between man and woman. Both must be of legal age (18 years, or 16-17 with guardian consent). Both must consent freely. The marriage must be registered with authorities. A marriage contract specifies rights and obligations. Marriage without proper registration is not valid in law.",
    category: "family",
    lastUpdated: "2024-01-15",
    legalReference: "UAE Personal Status Law Federal Law No. 28 of 2005, Articles 1-17",
    keywords: ["marriage", "consent", "contract", "registration"],
  },
  {
    id: "family-2",
    title: "Divorce and Separation",
    description: "Procedures for dissolution of marriage",
    content: "Divorce can be by mutual consent, judicial decree, or talaq (repudiation). For mutual divorce, both parties must agree and register with authorities. Judicial divorce is granted for specific grounds including non-support, harmful behavior, or failure of marital obligations. Women have right to request divorce (khul') in exchange for surrendering rights.",
    category: "family",
    lastUpdated: "2024-01-14",
    legalReference: "UAE Personal Status Law Federal Law No. 28 of 2005, Articles 99-125",
    keywords: ["divorce", "separation", "dissolution", "talaq"],
  },
  {
    id: "family-3",
    title: "Child Custody and Rights",
    description: "Child custody determinations and parental rights",
    content: "Child custody is determined based on child's best interests. Mother has right to custody of children until age 13 (boys) and 15 (girls) in default cases. Father is responsible for financial support. Both parents have guardianship rights. Court may award custody to other qualified guardians if parents are unfit. Children's rights include education, healthcare, and inheritance.",
    category: "family",
    lastUpdated: "2024-01-13",
    legalReference: "UAE Personal Status Law Federal Law No. 28 of 2005, Articles 143-162",
    keywords: ["custody", "child rights", "guardianship", "parental rights"],
  },
  {
    id: "family-4",
    title: "Inheritance and Succession",
    description: "Rules for distribution of deceased's estate",
    content: "Islamic inheritance law applies unless the deceased left a non-Islamic will. Heirs are classified as primary (children, parents, spouse) and secondary. The deceased's spouse receives 1/4 or 1/8 depending on heirs. Children share the remaining estate. Males and females inherit differently under Islamic law. Non-Muslims can make valid wills for their property.",
    category: "family",
    lastUpdated: "2024-01-12",
    legalReference: "UAE Personal Status Law Federal Law No. 28 of 2005, Articles 234-270",
    keywords: ["inheritance", "succession", "estate", "heirs"],
  },

  // Corporate Law
  {
    id: "corporate-1",
    title: "Company Formation and Registration",
    description: "Process for establishing a business entity",
    content: "Companies can be formed as private, public, or free zone entities. Each requires registration with the Department of Economic Development. Required documents include memorandum and articles, identification, and commercial registration. A company must have a local partner (51% ownership required unless in free zone or eligible exemption).",
    category: "corporate",
    lastUpdated: "2024-01-15",
    legalReference: "UAE Commercial Companies Law Federal Law No. 2 of 2015, Articles 1-60",
    keywords: ["company", "formation", "registration", "business entity"],
  },
  {
    id: "corporate-2",
    title: "Limited Liability Company (LLC)",
    description: "Structure and requirements for LLCs",
    content: "An LLC is a partnership with limited liability. Minimum 2 partners, maximum 50. Minimum capital AED 10,000. Each partner's liability limited to their capital contribution. Partners share profits and losses as agreed. Requires annual financial statements and audits. Free zone LLCs can have 100% foreign ownership.",
    category: "corporate",
    lastUpdated: "2024-01-14",
    legalReference: "UAE Commercial Companies Law Federal Law No. 2 of 2015, Articles 96-130",
    keywords: ["LLC", "limited liability", "partnership", "capital"],
  },
  {
    id: "corporate-3",
    title: "Public Joint Stock Company",
    description: "Structure and regulations for public companies",
    content: "A public company has shares available to public investment. Minimum share capital AED 10 million. Must have board of directors (minimum 3, maximum 15). Annual general assembly required. Subject to Central Bank supervision if listed. Must comply with corporate governance standards and disclosure requirements.",
    category: "corporate",
    lastUpdated: "2024-01-13",
    legalReference: "UAE Commercial Companies Law Federal Law No. 2 of 2015, Articles 146-213",
    keywords: ["public company", "shares", "stock", "board of directors"],
  },
  {
    id: "corporate-4",
    title: "Commercial Contracts",
    description: "Legal requirements for business contracts",
    content: "Business contracts must clearly specify parties, consideration, obligations, duration, and dispute resolution. Contracts in Arabic are preferred for UAE enforcement. Contracts must comply with UAE law. Violations result in breach of contract liability. Specific contracts like sales, agency, lease have additional legal requirements.",
    category: "corporate",
    lastUpdated: "2024-01-12",
    legalReference: "UAE Civil Code Federal Law No. 5 of 1985, Articles 127-322",
    keywords: ["contract", "business agreement", "terms", "obligations"],
  },

  // Intellectual Property
  {
    id: "intellectual-1",
    title: "Trademark Protection",
    description: "Registration and protection of trademarks in UAE",
    content: "Trademarks can be words, symbols, designs, or combinations. Registration with Ministry of Economy provides exclusive rights and nationwide protection. Valid for 10 years, renewable indefinitely. Infringement is prohibited. Registration is required before using ® symbol. Non-use for 3 consecutive years may result in cancellation.",
    category: "intellectual",
    lastUpdated: "2024-01-15",
    legalReference: "UAE Trademark Law Federal Law No. 23 of 1992, Articles 1-25",
    keywords: ["trademark", "brand", "registration", "intellectual property"],
  },
  {
    id: "intellectual-2",
    title: "Copyright Protection",
    description: "Automatic copyright protection for creative works",
    content: "Copyright automatically protects original literary, artistic, musical, and dramatic works upon creation. No registration required. Copyright holder has exclusive rights to reproduce, distribute, and publicly perform. Copyright lasts for author's lifetime plus 50 years. Works created by employees belong to employer unless agreed otherwise.",
    category: "intellectual",
    lastUpdated: "2024-01-14",
    legalReference: "UAE Copyright Law Federal Law No. 7 of 2002, Articles 1-30",
    keywords: ["copyright", "author", "creative work", "intellectual property"],
  },
];
