export interface Law {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  lastUpdated: string;
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
    id: "criminal",
    title: "Criminal Law",
    description: "Laws related to criminal offenses and justice",
    icon: "⚖️",
    color: "from-red-500 to-pink-500",
    count: 12,
  },
  {
    id: "civil",
    title: "Civil Law",
    description: "Laws governing disputes between individuals and organizations",
    icon: "📋",
    color: "from-blue-500 to-cyan-500",
    count: 18,
  },
  {
    id: "corporate",
    title: "Corporate Law",
    description: "Laws applicable to businesses and corporations",
    icon: "🏢",
    color: "from-amber-500 to-orange-500",
    count: 15,
  },
  {
    id: "family",
    title: "Family Law",
    description: "Laws covering marriage, divorce, custody, and inheritance",
    icon: "👨‍👩‍👧‍👦",
    color: "from-purple-500 to-pink-500",
    count: 10,
  },
  {
    id: "labor",
    title: "Labor Law",
    description: "Laws protecting workers' rights and employment regulations",
    icon: "💼",
    color: "from-green-500 to-emerald-500",
    count: 14,
  },
  {
    id: "intellectual",
    title: "Intellectual Property",
    description: "Laws protecting patents, copyrights, and trademarks",
    icon: "🧠",
    color: "from-indigo-500 to-purple-500",
    count: 11,
  },
];

export const laws: Law[] = [
  {
    id: "criminal-1",
    title: "Assault and Battery",
    description: "Understanding the legal definitions and penalties",
    content: `Assault and battery are two distinct crimes that are often confused. Assault refers to threatening or attempting to cause bodily harm, while battery involves actual physical contact. Both are serious criminal offenses that can result in fines and imprisonment. The severity depends on factors such as the degree of injury, use of weapons, and prior criminal history. Victims may also pursue civil remedies.`,
    category: "criminal",
    lastUpdated: "2024-01-15",
  },
  {
    id: "criminal-2",
    title: "DUI/DWI Laws",
    description: "Driving under the influence regulations and consequences",
    content: `Driving under the influence (DUI) or driving while impaired (DWI) laws vary by jurisdiction but generally prohibit operating a vehicle while impaired by alcohol or drugs. Penalties include license suspension, fines, jail time, and mandatory alcohol education programs. A blood alcohol content (BAC) of 0.08% or higher is typically considered legally impaired. Repeat offenses carry increasingly severe penalties.`,
    category: "criminal",
    lastUpdated: "2024-01-10",
  },
  {
    id: "civil-1",
    title: "Contract Law Basics",
    description: "Essential principles of binding agreements",
    content: `A contract is a legally binding agreement between two or more parties. For a contract to be valid, it must include an offer, acceptance, consideration, and intention to create legal relations. Both parties must have the capacity to contract and agree to the same terms. Breach of contract occurs when one party fails to perform their obligations, which can lead to damages awarded by the court.`,
    category: "civil",
    lastUpdated: "2024-01-12",
  },
  {
    id: "civil-2",
    title: "Property Law Fundamentals",
    description: "Rights and responsibilities of property ownership",
    content: `Property law governs the ownership, use, and transfer of property, both real and personal. Real property includes land and structures, while personal property includes movable items. Property owners have the right to use, sell, or lease their property, but must respect others' rights and local regulations. Disputes often arise over property boundaries, easements, and encroachments.`,
    category: "civil",
    lastUpdated: "2024-01-08",
  },
  {
    id: "corporate-1",
    title: "Company Formation and Registration",
    description: "Steps to legally establish a business entity",
    content: `Forming a company involves selecting a business structure (sole proprietorship, LLC, corporation, etc.), registering the business name, obtaining an EIN, and registering for taxes. Each structure has different liability protections, tax implications, and administrative requirements. Corporations provide liability protection but involve more complex compliance. LLCs offer flexibility with protection. Proper documentation and registration are essential for legal recognition.`,
    category: "corporate",
    lastUpdated: "2024-01-14",
  },
  {
    id: "corporate-2",
    title: "Employment Contracts",
    description: "Terms, conditions, and legal aspects of employment",
    content: `Employment contracts outline the terms of the employment relationship, including compensation, duties, benefits, and termination conditions. Valid contracts protect both employers and employees by clearly defining expectations. Contracts can be at-will or for a specific term. Non-compete and non-disclosure clauses require careful drafting to be enforceable. Both parties must receive consideration for the contract to be binding.`,
    category: "corporate",
    lastUpdated: "2024-01-09",
  },
  {
    id: "family-1",
    title: "Divorce and Separation",
    description: "Legal process and considerations for dissolving marriage",
    content: `Divorce is the legal dissolution of marriage. Requirements vary by jurisdiction but typically involve residency periods and grounds for divorce (fault or no-fault). The divorce process includes property division, spousal support, and child custody determinations. Mediation and settlement agreements can simplify the process. Court involvement is necessary if parties cannot agree on all issues. Legal representation is strongly recommended.`,
    category: "family",
    lastUpdated: "2024-01-11",
  },
  {
    id: "family-2",
    title: "Child Custody and Support",
    description: "Legal arrangements and obligations for children",
    content: `Child custody determines which parent has legal and physical responsibility for children. Courts prioritize the child's best interests. Custody can be sole or joint. Child support obligations are calculated based on parental income and custody arrangements. Both obligations continue until the child reaches the age of majority. Modifications can be requested if circumstances significantly change.`,
    category: "family",
    lastUpdated: "2024-01-07",
  },
  {
    id: "labor-1",
    title: "Minimum Wage and Hours",
    description: "Employee compensation and working hour regulations",
    content: `Labor laws establish minimum wage requirements and regulate working hours. The federal minimum wage is supplemented by state and local requirements. Employers must track hours and ensure workers receive overtime pay (typically 1.5x) for hours exceeding 40 per week. Some exempt employees are not entitled to overtime. Violations can result in penalties, back pay, and damages. Records must be maintained for inspection.`,
    category: "labor",
    lastUpdated: "2024-01-13",
  },
  {
    id: "labor-2",
    title: "Workplace Safety and OSHA",
    description: "Occupational health and safety standards",
    content: `The Occupational Safety and Health Administration (OSHA) sets and enforces workplace safety standards. Employers must maintain a safe working environment, provide safety training, and maintain records of injuries and illnesses. OSHA inspects workplaces and can issue citations for violations. Employees have the right to report unsafe conditions without retaliation. These protections apply across most industries and employments.`,
    category: "labor",
    lastUpdated: "2024-01-06",
  },
  {
    id: "intellectual-1",
    title: "Copyright Law",
    description: "Protection of creative works and intellectual property",
    content: `Copyright protects original works of authorship, including literary, dramatic, musical, and artistic works. Copyright exists automatically upon creation and grants exclusive rights to reproduce, distribute, and perform the work. Copyright protection typically lasts for the author's lifetime plus 70 years. Registration provides additional legal benefits. Fair use permits limited use for purposes like criticism and education.`,
    category: "intellectual",
    lastUpdated: "2024-01-05",
  },
  {
    id: "intellectual-2",
    title: "Trademark Protection",
    description: "Branding and brand protection strategies",
    content: `Trademarks protect words, symbols, and designs that identify goods or services. Registration at the USPTO provides nationwide protection and the right to use the ® symbol. Trademark rights can last indefinitely if renewal fees are paid. Use of similar marks in ways that create confusion is infringement. Proper use and monitoring are essential to maintain trademark rights.`,
    category: "intellectual",
    lastUpdated: "2024-01-04",
  },
];
