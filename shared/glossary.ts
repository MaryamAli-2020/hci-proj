/**
 * Legal Terms Glossary
 * Comprehensive database of UAE legal terms with definitions
 */

export interface TermDefinition {
  term: string;
  arabicTerm: string;
  definition: string;
  arabicDefinition: string;
  category: 'labor' | 'civil' | 'criminal' | 'family' | 'corporate' | 'ip' | 'immigration';
  complexity: 'simple' | 'moderate' | 'complex';
  examples: string[];
  relatedTerms: string[];
  citations: string[]; // law-id references
  synonyms: string[];
}

export const glossaryTerms: TermDefinition[] = [
  // Labour Terms
  {
    term: "Gratuity",
    arabicTerm: "تعويض نهاية الخدمة",
    definition: "A lump-sum payment made to employees upon termination of employment as compensation for years of service.",
    arabicDefinition: "مكافأة نقدية تُدفع للموظف عند انتهاء خدمته من قبل صاحب العمل.",
    category: "labor",
    complexity: "moderate",
    examples: [
      "An employee with 5 years of service receives half of last month's salary for each year as gratuity",
      "Gratuity is calculated based on the final wage and length of employment"
    ],
    relatedTerms: ["End of Service", "Employment Termination", "Severance Pay"],
    citations: ["labor-3"],
    synonyms: ["End of Service Benefit", "Severance Pay"]
  },
  {
    term: "Overtime",
    arabicTerm: "العمل الإضافي",
    definition: "Work performed beyond the standard working hours, typically compensated at a higher rate than regular wages.",
    arabicDefinition: "العمل الذي يتجاوز ساعات العمل المقررة يومياً أو أسبوعياً.",
    category: "labor",
    complexity: "simple",
    examples: [
      "An employee working 10 hours when standard is 8 hours receives overtime pay",
      "Overtime must be compensated at minimum 25% above the ordinary wage"
    ],
    relatedTerms: ["Working Hours", "Compensation", "Wages"],
    citations: ["labor-1"],
    synonyms: ["Extra Time", "Additional Hours"]
  },
  {
    term: "Annual Leave",
    arabicTerm: "الإجازة السنوية",
    definition: "Paid time off that employees are entitled to take each year, typically at least 30 days in the UAE.",
    arabicDefinition: "فترة راحة مدفوعة الأجر يحق للموظف الحصول عليها كل سنة بحد أدنى 30 يوماً.",
    category: "labor",
    complexity: "simple",
    examples: [
      "An employee is entitled to 30 days of paid annual leave",
      "Annual leave includes public holidays in the UAE"
    ],
    relatedTerms: ["Public Holiday", "Leave Entitlement", "Paid Time Off"],
    citations: ["labor-2"],
    synonyms: ["Vacation", "Holiday", "Paid Leave"]
  },
  {
    term: "Minimum Wage",
    arabicTerm: "الحد الأدنى للأجور",
    definition: "The lowest hourly or monthly compensation an employer is legally required to pay to an employee.",
    arabicDefinition: "أقل أجر يجب أن يحصل عليه الموظف من صاحب العمل.",
    category: "labor",
    complexity: "simple",
    examples: [
      "In the UAE, the minimum wage for private sector workers is AED 2,500 per month",
      "Minimum wage applies to all workers regardless of position"
    ],
    relatedTerms: ["Compensation", "Salary", "Wages", "Labour Law"],
    citations: ["labor-4"],
    synonyms: ["Base Wage", "Minimum Pay"]
  },
  {
    term: "Workplace Safety",
    arabicTerm: "السلامة والصحة المهنية",
    definition: "Employer obligations to provide safe and healthy working conditions for employees.",
    arabicDefinition: "التزام صاحب العمل بتوفير بيئة عمل آمنة وصحية للموظفين.",
    category: "labor",
    complexity: "moderate",
    examples: [
      "Employers must provide safety equipment and training",
      "Workers in hazardous conditions are entitled to additional protections"
    ],
    relatedTerms: ["Health Insurance", "Workers' Compensation", "Occupational Safety"],
    citations: ["labor-5"],
    synonyms: ["Occupational Health", "Work Safety"]
  },
  {
    term: "Employment Contract",
    arabicTerm: "عقد التوظيف",
    definition: "A binding agreement between an employer and employee specifying terms of employment.",
    arabicDefinition: "اتفاق قانوني بين صاحب العمل والموظف يحدد شروط التوظيف.",
    category: "labor",
    complexity: "moderate",
    examples: [
      "An employment contract must specify job duties, salary, and working hours",
      "Both parties must sign the contract for it to be binding"
    ],
    relatedTerms: ["Contract", "Employment", "Terms and Conditions"],
    citations: ["labor-8"],
    synonyms: ["Work Agreement", "Job Contract"]
  },

  // Civil Terms
  {
    term: "Contract",
    arabicTerm: "العقد",
    definition: "A legally binding agreement between parties that is enforceable by law.",
    arabicDefinition: "اتفاق قانوني ملزم بين طرفين أو أكثر يكون قابلاً للتنفيذ أمام المحاكم.",
    category: "civil",
    complexity: "moderate",
    examples: [
      "A sales contract transfers ownership of goods from seller to buyer",
      "Contracts must have offer, acceptance, and consideration to be valid"
    ],
    relatedTerms: ["Agreement", "Offer", "Acceptance", "Consideration"],
    citations: ["civil-1"],
    synonyms: ["Agreement", "Accord", "Deal"]
  },
  {
    term: "Liability",
    arabicTerm: "المسؤولية",
    definition: "The state of being responsible for an action or inaction, especially by law.",
    arabicDefinition: "التزام قانوني بتحمل المسؤولية عن تصرف أو إهمال معين.",
    category: "civil",
    complexity: "complex",
    examples: [
      "A company is liable for damages caused by its negligence",
      "Product liability holds manufacturers responsible for defective products"
    ],
    relatedTerms: ["Negligence", "Damage", "Responsibility"],
    citations: ["civil-1"],
    synonyms: ["Responsibility", "Accountability", "Obligation"]
  },
  {
    term: "Negligence",
    arabicTerm: "الإهمال",
    definition: "Failure to take proper care in doing something, resulting in damage or loss.",
    arabicDefinition: "عدم اتخاذ الاحتياطات اللازمة والمعقولة مما يسبب ضرراً للآخرين.",
    category: "civil",
    complexity: "complex",
    examples: [
      "A driver's negligence causes an accident and injures a pedestrian",
      "Negligence requires proof of duty, breach, causation, and damage"
    ],
    relatedTerms: ["Duty of Care", "Breach", "Damage", "Causation"],
    citations: ["civil-1"],
    synonyms: ["Carelessness", "Dereliction of Duty"]
  },

  // Immigration Terms
  {
    term: "Visa",
    arabicTerm: "التأشيرة",
    definition: "An official permit allowing entry into and residence in a country for a specified period.",
    arabicDefinition: "تصريح رسمي يسمح بدخول والإقامة في الدولة لفترة محددة.",
    category: "immigration",
    complexity: "simple",
    examples: [
      "A student visa allows international students to study in the UAE",
      "Work visas are sponsored by UAE employers"
    ],
    relatedTerms: ["Residency", "Residence Permit", "Entry Permit"],
    citations: ["labor-6"],
    synonyms: ["Travel Permit", "Entry Document"]
  },
  {
    term: "Residency",
    arabicTerm: "الإقامة",
    definition: "The state of residing or being established in a place as a legal resident.",
    arabicDefinition: "حالة الإقامة القانونية والمستقرة في دولة معينة.",
    category: "immigration",
    complexity: "simple",
    examples: [
      "Work visa holders obtain UAE residency status",
      "Residency is documented through the Emirates ID card"
    ],
    relatedTerms: ["Visa", "Emirates ID", "Resident"],
    citations: ["labor-6"],
    synonyms: ["Residence", "Legal Residency"]
  },

  // Corporate Terms
  {
    term: "Free Zone",
    arabicTerm: "المناطق الحرة",
    definition: "Designated areas in the UAE where businesses can operate with special privileges like 100% foreign ownership.",
    arabicDefinition: "مناطق خاصة في الإمارات تتمتع بامتيازات تجارية خاصة.",
    category: "corporate",
    complexity: "moderate",
    examples: [
      "Many businesses operate in JAFZA (Jebel Ali Free Zone) in Dubai",
      "Free zones offer tax exemptions and simplified procedures"
    ],
    relatedTerms: ["Business License", "Trade License", "Foreign Ownership"],
    citations: ["corporate-2"],
    synonyms: ["Special Economic Zone", "Export Processing Zone"]
  },
  {
    term: "Trade License",
    arabicTerm: "الترخيص التجاري",
    definition: "An official permit required to operate a business legally in a specific jurisdiction.",
    arabicDefinition: "تصريح رسمي مطلوب لتشغيل عمل تجاري بشكل قانوني.",
    category: "corporate",
    complexity: "simple",
    examples: [
      "Businesses must obtain a trade license from the Department of Commerce",
      "License must be renewed annually"
    ],
    relatedTerms: ["Business License", "Registration", "Business Setup"],
    citations: ["corporate-3"],
    synonyms: ["Business License", "Operating License"]
  },

  // Intellectual Property
  {
    term: "Copyright",
    arabicTerm: "حقوق النشر",
    definition: "Exclusive legal right to produce, reproduce, publish, or distribute an original literary, musical, or artistic work.",
    arabicDefinition: "الحق الحصري في إنتاج وتوزيع وبيع عمل فني أو أدبي أصلي.",
    category: "ip",
    complexity: "complex",
    examples: [
      "An author automatically holds copyright to their published work",
      "Copyright infringement includes unauthorized copying or distribution"
    ],
    relatedTerms: ["Intellectual Property", "Patent", "Trademark", "Fair Use"],
    citations: ["corporate-1"],
    synonyms: ["Author's Right", "Literary Property"]
  },
  {
    term: "Trademark",
    arabicTerm: "العلامة التجارية",
    definition: "A symbol, word, phrase, or design legally registered as representing a company or product.",
    arabicDefinition: "رمز أو كلمة أو صورة تميز منتجات أو خدمات شركة عن غيرها.",
    category: "ip",
    complexity: "moderate",
    examples: [
      "Nike's swoosh logo is a registered trademark",
      "Trademark infringement occurs when a similar mark causes consumer confusion"
    ],
    relatedTerms: ["Intellectual Property", "Brand", "Registered Mark"],
    citations: ["corporate-1"],
    synonyms: ["Brand Mark", "Service Mark"]
  },
  {
    term: "Patent",
    arabicTerm: "براءة الاختراع",
    definition: "A government license conferring a right or title, typically protecting an invention for a set period.",
    arabicDefinition: "شهادة حكومية تعطي المخترع حقاً حصرياً لاستخدام واستغلال اختراعه.",
    category: "ip",
    complexity: "complex",
    examples: [
      "A pharmaceutical company obtains a patent for a new drug",
      "Patents typically last 20 years from the filing date"
    ],
    relatedTerms: ["Intellectual Property", "Invention", "Patent Rights"],
    citations: ["corporate-1"],
    synonyms: ["Patent Right", "Invention Right"]
  },

  // Family Law Terms
  {
    term: "Custody",
    arabicTerm: "الحضانة",
    definition: "Legal guardianship and care of a child or minor.",
    arabicDefinition: "الحق والمسؤولية القانونية برعاية وتربية الطفل.",
    category: "family",
    complexity: "moderate",
    examples: [
      "In case of divorce, the court determines custody of children",
      "Custody arrangements prioritize the best interests of the child"
    ],
    relatedTerms: ["Guardianship", "Parental Rights", "Child Welfare"],
    citations: ["family-1"],
    synonyms: ["Guardianship", "Care and Control"]
  },
  {
    term: "Inheritance",
    arabicTerm: "الميراث",
    definition: "Property, titles, debts, and obligations that pass to an heir upon the death of an ancestor.",
    arabicDefinition: "الممتلكات والحقوق والالتزامات التي تنتقل من المتوفى للوارث.",
    category: "family",
    complexity: "complex",
    examples: [
      "Inheritance is distributed according to Islamic law principles in the UAE",
      "The distribution depends on the relationship to the deceased"
    ],
    relatedTerms: ["Will", "Estate", "Succession", "Heir"],
    citations: ["family-1"],
    synonyms: ["Succession", "Legacy", "Bequest"]
  },
];

export class GlossaryService {
  /**
   * Get definition for a term
   */
  static getDefinition(term: string, language: 'en' | 'ar' = 'en'): TermDefinition | null {
    const foundTerm = glossaryTerms.find(
      t => t.term.toLowerCase() === term.toLowerCase() ||
           t.arabicTerm === term ||
           t.synonyms.some(s => s.toLowerCase() === term.toLowerCase())
    );
    return foundTerm || null;
  }

  /**
   * Get all terms in a category
   */
  static getTermsByCategory(category: string): TermDefinition[] {
    return glossaryTerms.filter(t => t.category === category);
  }

  /**
   * Get related terms
   */
  static getRelatedTerms(term: string): TermDefinition[] {
    const mainTerm = this.getDefinition(term);
    if (!mainTerm) return [];

    return glossaryTerms.filter(
      t => mainTerm.relatedTerms.includes(t.term) ||
           mainTerm.citations.some(c => t.citations.includes(c))
    );
  }

  /**
   * Search terms by keyword
   */
  static searchTerms(keyword: string): TermDefinition[] {
    const lowerKeyword = keyword.toLowerCase();
    return glossaryTerms.filter(
      t => t.term.toLowerCase().includes(lowerKeyword) ||
           t.definition.toLowerCase().includes(lowerKeyword) ||
           t.examples.some(e => e.toLowerCase().includes(lowerKeyword)) ||
           t.synonyms.some(s => s.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * Get terms by complexity level
   */
  static getTermsByComplexity(complexity: 'simple' | 'moderate' | 'complex'): TermDefinition[] {
    return glossaryTerms.filter(t => t.complexity === complexity);
  }

  /**
   * Get all categories
   */
  static getCategories(): string[] {
    return [...new Set(glossaryTerms.map(t => t.category))];
  }

  /**
   * Add custom term
   */
  static addCustomTerm(definition: TermDefinition): void {
    if (!glossaryTerms.find(t => t.term === definition.term)) {
      glossaryTerms.push(definition);
    }
  }
}
