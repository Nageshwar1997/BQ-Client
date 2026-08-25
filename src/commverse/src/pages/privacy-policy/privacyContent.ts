export interface PrivacyInfoItem {
  label: string;
  value: string;
  href?: string;
}

export interface PrivacyParagraphBlock {
  type: 'paragraph';
  text: string;
  uppercase?: boolean;
}

export interface PrivacyListBlock {
  type: 'list';
  items: string[];
}

export type PrivacyBlock = PrivacyParagraphBlock | PrivacyListBlock;

export interface PrivacySection {
  id: string;
  title: string;
  blocks?: PrivacyBlock[];
  subsections?: PrivacySection[];
}

export const privacyIntro = [
  `This Privacy Policy (“Policy”) is a legally binding agreement between You and Ctruh Technologies Pvt. Ltd. (“Ctruh,” “we,” “our” or “us”), governing the collection, use, storage, processing, disclosure, and protection of Your personal data in connection with Your use of Commverse Studio (“Platform” or “Services”), accessible at commverse.studio and its associated sub-domains.`,
  `This Policy is read together with Our Terms of Service. By accessing or using the Platform in any capacity, You signify that You have read, understood, and agree to be bound by this Policy in its entirety. If You do not agree, You must discontinue all use immediately.`,
];

export const privacyLegalInfo: PrivacyInfoItem[] = [
  {
    label: 'Legal Entity',
    value: 'Ctruh Technologies Pvt. Ltd.',
  },
  {
    label: 'Platform',
    value: 'Commverse Studio (commverse.studio)',
  },
  {
    label: 'Registered Address',
    value:
      'Ctruh Technologies Private Limited, 3rd floor, Obeya Tranquil, 1185, 5th Main Rd, 7th Sector, HSR Layout, Bengaluru, Karnataka 560102',
  },
  {
    label: 'Privacy / DPO Email',
    value: 'privacy@ctruh.com',
    href: 'mailto:privacy@ctruh.com',
  },
  {
    label: 'General Contact',
    value: 'contact@ctruh.com',
    href: 'mailto:contact@ctruh.com',
  },
  {
    label: 'Website',
    value: 'www.ctruh.com',
    href: 'https://www.ctruh.com',
  },
];

export const privacySections: PrivacySection[] = [
  {
    id: '1',
    title: 'Scope and Applicability',
    blocks: [
      {
        type: 'paragraph',
        text: 'This Policy applies to all individuals and entities interacting with Commverse Studio, including but not limited to registered users, enterprise clients, developers using Our APIs or SDKs, administrators, guests, and visitors to Our websites and sub-domains. It covers personal data collected and processed through:',
      },
      {
        type: 'list',
        items: [
          'The Commverse Studio web, desktop, and mobile applications',
          'APIs, SDKs, embeds, and developer tools offered by Ctruh',
          'Customer support, onboarding, and survey interactions',
          'Marketing, promotional, and communication channels',
          'Third-party integrations and plugins enabled within the Platform',
        ],
      },
      {
        type: 'paragraph',
        text: 'This Policy applies globally. Where local laws impose stricter obligations, We comply with those requirements to the extent applicable to Our operations.',
      },
    ],
  },
  {
    id: '2',
    title: 'Identity of the Data Controller',
    blocks: [
      {
        type: 'paragraph',
        text: 'Ctruh Technologies Pvt. Ltd. is the data controller responsible for all personal data processed in connection with Commverse Studio.',
      },
      {
        type: 'paragraph',
        text: 'For data subjects located in the European Economic Area (EEA), United Kingdom, or other jurisdictions with applicable data protection laws, Ctruh acts as controller under the General Data Protection Regulation (GDPR), UK GDPR, or equivalent legislation as applicable.',
      },
    ],
  },
  {
    id: '3',
    title: 'Key Definitions',
    blocks: [
      {
        type: 'paragraph',
        text: 'The following terms used in this Policy carry the meanings set out below:',
      },
      {
        type: 'list',
        items: [
          'Personal Information / Personal Data: Any information relating to an identified or identifiable natural person.',
          'Traffic Data: Technical data automatically collected during Your interaction with the Platform, including IP addresses, device identifiers, and session metadata.',
          'User-Generated Content (UGC): Any content, prompts, files, or data You create, upload, or submit through the Platform.',
          'AI-Generated Outputs: Content produced by artificial intelligence or generative models within the Platform based on Your inputs.',
          'Sub-Processor: A third-party service provider engaged by Ctruh to process personal data on Our behalf under a binding Data Processing Agreement.',
          'Applicable Law: The Information Technology Act, 2000 and rules thereunder (India); GDPR and UK GDPR (EEA/UK); CCPA/CPRA (California); PDPA (Singapore); and any other applicable national or regional data protection legislation.',
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'Personal Data We Collect',
    blocks: [
      {
        type: 'paragraph',
        text: 'We collect personal data across the following categories, depending on how You use the Platform:',
      },
    ],
    subsections: [
      {
        id: '4.1',
        title: 'Identity and Account Data',
        blocks: [
          {
            type: 'list',
            items: [
              'Full legal name, display name, and username',
              'Email address and verified contact information',
              'Profile photograph, avatar assets, and bio',
              'Password (stored in irreversibly hashed form only)',
              'Government-issued identity data (where required for enterprise verification)',
              'Date of birth and demographic information provided voluntarily',
            ],
          },
        ],
      },
      {
        id: '4.2',
        title: 'Technical and Device Data (Traffic Data)',
        blocks: [
          {
            type: 'list',
            items: [
              'IP addresses and geolocation data (city-level; precise location only where explicitly consented)',
              'Device identifiers (UUID, advertising IDs, hardware fingerprint)',
              'Browser type, version, operating system, and hardware configuration',
              'Session tokens, cookies, and local storage identifiers',
              'Screen resolution, input methods, rendering capabilities, and performance telemetry',
              'Domain server details and referring/exit page data',
            ],
          },
        ],
      },
      {
        id: '4.3',
        title: 'Usage and Behavioral Data',
        blocks: [
          {
            type: 'list',
            items: [
              'Feature usage patterns, click-through data, and in-Platform navigation flows',
              'Time spent within sessions, frequency of access, and interaction logs',
              'Content created, modified, shared, or deleted within the Platform',
              'Collaboration events including comments, version history, and co-editing activity',
              'Error logs, crash reports, and diagnostic telemetry',
            ],
          },
        ],
      },
      {
        id: '4.4',
        title: 'User-Generated Content and AI Inputs',
        blocks: [
          {
            type: 'list',
            items: [
              'Prompts, instructions, and text inputs submitted to AI features',
              'Uploaded files including images, videos, audio, documents, and datasets',
              'Brand assets, creative briefs, and style specifications',
              'URLs and external content references provided by You',
            ],
          },
        ],
      },
      {
        id: '4.5',
        title: 'AI-Generated Outputs and Derived Data',
        blocks: [
          {
            type: 'list',
            items: [
              'Content generated by AI models in response to Your inputs (images, text, video, code, etc.)',
              'Generation parameters, model settings, and workflow configurations',
              'De-identified performance signals and scoring metrics derived from creative outputs (not linked to individuals)',
            ],
          },
        ],
      },
      {
        id: '4.6',
        title: 'Communication and Support Data',
        blocks: [
          {
            type: 'list',
            items: [
              'Messages, queries, and attachments submitted via support channels',
              'Feedback, bug reports, feature requests, and survey responses',
              'Call or session recordings and transcripts (where legally permitted and disclosed)',
            ],
          },
        ],
      },
      {
        id: '4.7',
        title: 'Payment and Billing Data',
        blocks: [
          {
            type: 'list',
            items: [
              'Billing name, address, company name, and invoice details',
              'Transaction identifiers, subscription tier, credit balance, and billing history',
            ],
          },
          {
            type: 'paragraph',
            text: 'Full payment card numbers are never stored by Ctruh. All payment processing is handled exclusively by PCI-DSS Level 1 certified third-party processors (e.g., Stripe).',
          },
        ],
      },
      {
        id: '4.8',
        title: 'Integration and Third-Party Data',
        blocks: [
          {
            type: 'list',
            items: [
              'OAuth tokens and API credentials for services You choose to connect',
              'Data retrieved or synchronized from authorized integrations (e.g., cloud storage, productivity suites, marketplace platforms)',
            ],
          },
          {
            type: 'paragraph',
            text: 'We do not access end-customer personal data from Your integrations unless explicitly permitted by the integration and expressly authorized by You.',
          },
        ],
      },
    ],
  },
  {
    id: '5',
    title: 'How We Collect Personal Data',
    blocks: [
      {
        type: 'list',
        items: [
          'Directly from You: When You register, create a profile, upload content, submit forms, make purchases, or contact support.',
          'Automatically: Via cookies, analytics tools, log files, and performance telemetry during Your use of the Platform.',
          'From Third-Party Integrations: When You connect external services (e.g., Google, Apple, marketplace APIs) and authorize data access.',
          'From Public Sources: Publicly available information used for market research or competitive analysis, handled in compliance with Applicable Law.',
          'From Communications: Any information You provide by email, telephone, chat, or other channels may be collected, retained, and used as described in this Policy.',
        ],
      },
    ],
  },
  {
    id: '6',
    title: 'Legal Basis for Processing',
    blocks: [
      {
        type: 'paragraph',
        text: 'We process personal data only where We hold a valid legal basis under Applicable Law. The legal grounds We rely on include:',
      },
      {
        type: 'list',
        items: [
          'Contractual Necessity: Processing required to deliver the Services You have subscribed to or requested.',
          'Legitimate Interests: Processing for fraud prevention, platform security, product improvement, and analytics, where Our interests are not overridden by Your fundamental rights and freedoms.',
          'Consent: Processing based on Your explicit, informed, and freely given consent — particularly for marketing communications, optional analytics, and AI training features where disclosed.',
          'Legal Obligation: Processing required to comply with Applicable Law, court orders, tax obligations, or regulatory requirements.',
          'Vital Interests: Processing necessary to protect life or safety in emergency circumstances.',
        ],
      },
      {
        type: 'paragraph',
        text: 'You may withdraw consent at any time without affecting the lawfulness of processing already carried out. Withdrawal of consent may limit Your access to certain features of the Platform.',
      },
    ],
  },
  {
    id: '7',
    title: 'How We Use Your Personal Data',
    blocks: [
      {
        type: 'paragraph',
        text: 'Personal data is used solely for the following purposes:',
      },
      {
        type: 'list',
        items: [
          'Account creation, authentication, and identity verification',
          'Delivering, maintaining, and improving the Platform and its core features',
          'Personalizing Your experience and adapting content to Your preferences and usage patterns',
          'Processing payments, managing subscriptions, and administering billing',
          'Sending transactional communications including receipts, security alerts, account notifications, and service updates',
          'Sending marketing and promotional communications (only with Your consent; opt-out available in every such communication)',
          'Conducting analytics, product research, and usage audits to improve Services',
          'Detecting, preventing, and responding to fraud, abuse, unauthorized access, and security threats',
          'Preventing potentially illegal activity and screening for undesirable or abusive behavior',
          'Enforcing Our Terms of Service, Acceptable Use Policy, and other applicable agreements',
          'Complying with legal obligations including tax reporting, regulatory requirements, and lawful government requests',
          'Supporting AI feature delivery including content generation, workflow automation, and creative optimization (see Section 8)',
        ],
      },
      {
        type: 'paragraph',
        text: 'We do not use Your personal data for fully automated decision-making that produces legal or similarly significant effects without human review, unless explicitly disclosed, consented to, and required for service delivery.',
      },
    ],
  },
  {
    id: '8',
    title: 'AI Features and Automated Processing',
    blocks: [
      {
        type: 'paragraph',
        text: 'Where Commverse Studio incorporates AI-powered features — including generative AI, recommendation engines, creative optimization, and intelligent automation — the following terms apply:',
      },
    ],
    subsections: [
      {
        id: '8.1',
        title: 'AI Input Processing',
        blocks: [
          {
            type: 'paragraph',
            text: 'Content and data You submit to AI features are processed to generate the outputs You request. We do not use Your personal data, prompts, uploaded content, or AI outputs to train, fine-tune, or improve shared or foundational AI models without Your explicit, opt-in consent.',
          },
        ],
      },
      {
        id: '8.2',
        title: 'De-identified Performance Signals',
        blocks: [
          {
            type: 'paragraph',
            text: 'We may use de-identified and aggregated performance signals — such as engagement patterns, output effectiveness metrics, and usage trends — to improve workspace-specific models and optimization logic. These signals cannot reasonably be used to identify any individual.',
          },
        ],
      },
      {
        id: '8.3',
        title: 'Automated Decision-Making Disclosure',
        blocks: [
          {
            type: 'paragraph',
            text: 'Certain features involve automated creative optimization and content regeneration workflows. These processes affect creative assets only and do not produce legal or similarly significant effects on individuals. You retain full responsibility for reviewing AI-generated outputs before use or publication.',
          },
        ],
      },
      {
        id: '8.4',
        title: 'Human Review',
        blocks: [
          {
            type: 'paragraph',
            text: 'Limited manual review by authorized Ctruh personnel may occur solely for quality assurance, abuse prevention, compliance, and technical troubleshooting purposes. Such access is logged, role-restricted, and governed by strict confidentiality obligations.',
          },
        ],
      },
      {
        id: '8.5',
        title: 'Your Responsibility for Uploaded Data',
        blocks: [
          {
            type: 'paragraph',
            text: 'You are solely responsible for ensuring You hold all necessary rights, permissions, licenses, and consents to upload any personal data, images, or likenesses of individuals to the Platform, including consents for AI processing and any intended commercial use.',
          },
        ],
      },
    ],
  },
  {
    id: '9',
    title: 'Disclosure and Sharing of Personal Data',
    blocks: [
      {
        type: 'paragraph',
        text: 'We do not sell, rent, or trade Your personal data. We may share data only under the following limited and controlled circumstances:',
      },
    ],
    subsections: [
      {
        id: '9.1',
        title: 'Authorized Sub-Processors and Service Providers',
        blocks: [
          {
            type: 'paragraph',
            text: 'We engage vetted third-party vendors to assist in delivering Our Services, including cloud hosting, analytics, customer support, payment processing, and email delivery. All sub-processors operate under Data Processing Agreements (DPAs) and may only process data on Our documented instructions.',
          },
        ],
      },
      {
        id: '9.2',
        title: 'Payment Gateway Partners',
        blocks: [
          {
            type: 'paragraph',
            text: 'We share limited billing data with our payment gateway partners solely to facilitate secure transactions. Such partners are PCI-DSS certified and are prohibited from using Your data for any other purpose.',
          },
        ],
      },
      {
        id: '9.3',
        title: 'Third-Party AI Providers',
        blocks: [
          {
            type: 'paragraph',
            text: 'Where specific AI features require third-party model providers, data may be transmitted securely under contractual restrictions explicitly prohibiting the training on, or independent retention of, Your data.',
          },
        ],
      },
      {
        id: '9.4',
        title: 'Enterprise and Team Account Administrators',
        blocks: [
          {
            type: 'paragraph',
            text: 'Where Commverse Studio is deployed under an enterprise or team account, the account administrator may access certain usage data and activity logs pertaining to users within their organization. Such access is governed by the enterprise client’s own privacy and compliance obligations to their users.',
          },
        ],
      },
      {
        id: '9.5',
        title: 'Legal and Regulatory Disclosures',
        blocks: [
          {
            type: 'paragraph',
            text: 'We may disclose personal data in response to valid legal process (court orders, subpoenas, government requests) or where We have a bona fide belief that disclosure is necessary to: (a) comply with Applicable Law; (b) protect the rights, property, or safety of Ctruh, Our users, or the public; (c) enforce Our agreements; or (d) detect, prevent, or address fraud or illegal activity. We will notify affected users of such requests to the extent permitted by law.',
          },
        ],
      },
      {
        id: '9.6',
        title: 'Corporate Transactions',
        blocks: [
          {
            type: 'paragraph',
            text: 'In the event of a merger, acquisition, restructuring, or asset transfer, personal data may be transferred to the acquiring or successor entity subject to equivalent privacy protections. We will provide advance notice where required.',
          },
        ],
      },
      {
        id: '9.7',
        title: 'Aggregated and De-identified Data',
        blocks: [
          {
            type: 'paragraph',
            text: 'We may share aggregated, anonymized, or de-identified data — from which no individual can reasonably be identified — with partners, researchers, or the public for product development, industry analysis, or research purposes.',
          },
        ],
      },
    ],
  },
  {
    id: '10',
    title: 'International Data Transfers',
    blocks: [
      {
        type: 'paragraph',
        text: 'Ctruh operates globally and may transfer Your personal data to countries outside Your country of residence, including jurisdictions that may not afford the same level of data protection as Your home country.',
      },
      {
        type: 'paragraph',
        text: 'For transfers from the EEA, UK, or Switzerland, We rely on:',
      },
      {
        type: 'list',
        items: [
          'Standard Contractual Clauses (SCCs) approved by the European Commission',
          'Adequacy decisions issued by relevant supervisory authorities',
          'Other lawful transfer mechanisms recognized under Applicable Law',
        ],
      },
      {
        type: 'paragraph',
        text: 'You may request a copy of the applicable transfer safeguards by contacting Our Data Protection Officer at privacy@ctruh.com.',
      },
    ],
  },
  {
    id: '11',
    title: 'Cookies and Tracking Technologies',
    blocks: [
      {
        type: 'paragraph',
        text: 'We use cookies, pixel tags, local storage, and similar technologies. Log files are also used as standard practice, recording IP addresses, browser type, internet service provider, date and time stamps, referring/exit pages, and click data. These log files are not linked to personally identifiable information.',
      },
      {
        type: 'paragraph',
        text: 'Cookie categories We use:',
      },
      {
        type: 'list',
        items: [
          'Strictly Necessary: Required for core Platform functionality and security. Cannot be disabled without impairing service delivery.',
          'Performance and Analytics: Measure usage patterns, diagnose issues, and improve the Platform.',
          'Functional: Remember Your preferences, settings, and session customizations.',
          'Marketing and Advertising: Deliver relevant promotions only with Your explicit consent.',
        ],
      },
      {
        type: 'paragraph',
        text: 'We do not control or accept liability for third-party cookies placed on Your device by external services integrated with the Platform.',
      },
      {
        type: 'paragraph',
        text: 'You may manage cookie preferences via Our Cookie Preference Center (accessible in Platform settings) or Your browser’s built-in privacy controls. Disabling non-essential cookies does not impair core functionality.',
      },
    ],
  },
  {
    id: '12',
    title: 'Data Retention',
    blocks: [
      {
        type: 'paragraph',
        text: 'We retain personal data only for as long as necessary to fulfil the purposes described in this Policy, comply with legal obligations, resolve disputes, prevent fraud, and enforce Our agreements. Specific periods include:',
      },
      {
        type: 'list',
        items: [
          'Active account data: Retained for the duration of the account relationship.',
          'Transactional and billing records: Retained for 7 years to satisfy tax and financial regulations.',
          'Usage and analytics data: Identifiable logs deleted after 90 days; data aggregated and anonymized thereafter.',
          'Support and communication records: Retained for 3 years from the date of last interaction.',
          'Deleted account data: Purged from production systems within 30 days, and from backup infrastructure within 90 days of deletion confirmation.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Where retention is required by Applicable Law or for pending legal proceedings, exceptions to the above periods apply. We may continue to retain data in anonymized form for analytical and research purposes without time limitation.',
      },
    ],
  },
  {
    id: '13',
    title: 'Data Deletion',
    blocks: [
      {
        type: 'paragraph',
        text: 'You have the right to request deletion of Your Personal Information, subject to certain exceptions. To submit a deletion request, email Us at contact@ctruh.com. Upon verification of Your identity and confirmation of the request, We will delete Your Personal Information from Our records unless retention is required to:',
      },
      {
        type: 'list',
        items: [
          'Complete an ongoing transaction or fulfil Our contractual obligations to You',
          'Detect security incidents, prevent fraud, or prosecute illegal activity',
          'Comply with a legal obligation or defend against legal claims',
        ],
      },
      {
        type: 'paragraph',
        text: 'When You delete Your account, We delete or irreversibly anonymize the data You provided and data collected during Your use of the Services. Deleted or anonymized data cannot be restored by You or by Us.',
      },
    ],
  },
  {
    id: '14',
    title: 'Security Measures',
    blocks: [
      {
        type: 'paragraph',
        text: 'We implement comprehensive, industry-standard security controls to protect Your personal data against unauthorized access, disclosure, alteration, loss, or destruction:',
      },
      {
        type: 'list',
        items: [
          'Encryption: All data in transit is protected using TLS 1.3. All data at rest is encrypted using AES-256 encryption.',
          'Access Controls: Role-based access control (RBAC), multi-factor authentication (MFA), and least-privilege principles govern all internal access to personal data.',
          'Infrastructure: Our systems are hosted on SOC 2 Type II and ISO 27001 certified cloud infrastructure providers in compliance with the Information Technology Act, 2000 and the rules made thereunder.',
          'Monitoring: Continuous security monitoring, intrusion detection, anomaly alerting, and audit logging are operational at all times.',
          'Assessments: Regular internal and third-party penetration tests, vulnerability assessments, and security audits are conducted.',
          'Incident Response: We maintain a documented incident response plan. In the event of a data breach, We will notify affected users and relevant supervisory authorities within 72 hours of discovery, to the extent required by Applicable Law and as the nature and extent of the disclosure becomes known to Us.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Notwithstanding these measures, no system is completely impenetrable. Transmission of information via the internet or telephone networks is not entirely secure. You are responsible for maintaining the confidentiality of Your account credentials and for any activity occurring under Your account.',
      },
    ],
  },
  {
    id: '15',
    title: 'Your Data Subject Rights',
    blocks: [
      {
        type: 'paragraph',
        text: 'Subject to Applicable Law, You have the following rights with respect to Your personal data:',
      },
      {
        type: 'list',
        items: [
          'Right of Access: Obtain a copy of the personal data We hold about You and confirmation of how it is being processed.',
          'Right to Rectification: Request correction of inaccurate or incomplete personal data.',
          'Right to Erasure (‘Right to be Forgotten’): Request deletion of Your personal data, subject to legal retention obligations.',
          'Right to Restriction: Request that We limit processing of Your data in certain circumstances.',
          'Right to Data Portability: Receive Your personal data in a structured, commonly used, machine-readable format.',
          'Right to Object: Object to processing based on legitimate interests or for direct marketing purposes.',
          'Right to Withdraw Consent: Withdraw previously given consent at any time, without affecting the lawfulness of prior processing.',
          'Right Against Automated Decision-Making: Request human review of any decision taken solely by automated means that produces legal or similarly significant effects.',
          'Right to Lodge a Complaint: File a complaint with the relevant data protection supervisory authority in Your jurisdiction.',
        ],
      },
      {
        type: 'paragraph',
        text: 'To exercise any of these rights, submit a verified request to privacy@ctruh.com. We will acknowledge and respond within 30 days of receipt. Identity verification may be required. Requests are handled free of charge unless manifestly unfounded or excessive.',
      },
    ],
  },
  {
    id: '16',
    title: "Children's Privacy",
    blocks: [
      {
        type: 'paragraph',
        text: 'Commverse Studio is not designed for, directed at, or intended to be used by persons under the age of 18 (or the applicable age of digital consent in Your jurisdiction). The Platform is available only to persons who can form a legally binding contract under the Indian Contract Act, 1872, and equivalent legislation in other jurisdictions. We do not knowingly solicit or collect personal data from minors.',
      },
      {
        type: 'paragraph',
        text: 'If you are under 18, You must use the Platform only under the supervision of a parent, legal guardian, or responsible adult. If We become aware that We have inadvertently collected data from a minor, We will delete it promptly. If You believe We hold such data, please notify Us immediately at privacy@ctruh.com.',
      },
    ],
  },
  {
    id: '17',
    title: 'Third-Party Links and Integrations',
    blocks: [
      {
        type: 'paragraph',
        text: 'The Platform may contain links to, or integrations with, third-party websites, applications, or services not operated by Ctruh. This Policy does not apply to those third-party services. We are not responsible for the privacy practices, security, or content of such third parties. We strongly encourage You to review the privacy policies of any third-party services You access through or connect to the Platform.',
      },
    ],
  },
  {
    id: '18',
    title: 'Confidentiality',
    blocks: [
      {
        type: 'paragraph',
        text: 'We use Our best efforts to keep confidential any Personal Information marked as confidential or which We consider to be of a confidential nature, except for information which: (a) was already known to Us prior to collection; (b) was lawfully received from a third party not subject to similar confidentiality obligations; (c) is independently developed by Us; or (d) is required to be disclosed by Applicable Law.',
      },
      {
        type: 'paragraph',
        text: 'Except as described in this Policy, We will not share Personal Information with third parties unless We have a bona fide belief that such disclosure is necessary to comply with legal process, protect the rights, property, or safety of Ctruh, Our employees, users or third parties, enforce the Agreement, or respond to legal claims.',
      },
    ],
  },
  {
    id: '19',
    title: 'Updates to This Privacy Policy',
    blocks: [
      {
        type: 'paragraph',
        text: 'We reserve the right to modify this Policy at any time. Material changes will be communicated through:',
      },
      {
        type: 'list',
        items: [
          'In-Platform notifications within Commverse Studio',
          'Email notification to Your registered email address',
          'Prominent notice on commverse.studio for at least 30 days prior to the effective date',
        ],
      },
      {
        type: 'paragraph',
        text: 'Continued use of the Platform after the effective date of any updated Policy constitutes Your acceptance of the revised terms. We encourage You to review this page frequently. If You do not agree to the changes, You must cease use of the Platform and may request deletion of Your data.',
      },
    ],
  },
  {
    id: '20',
    title: 'Regulatory Complaints',
    blocks: [
      {
        type: 'paragraph',
        text: 'If You believe Your data protection rights have been violated, You have the right to lodge a complaint with the appropriate supervisory authority in Your jurisdiction:',
      },
      {
        type: 'list',
        items: [
          'India: Ministry of Electronics & Information Technology (MeitY), as applicable under the Digital Personal Data Protection Act, 2023.',
          'EEA: The data protection authority of Your EU member state.',
          "United Kingdom: The Information Commissioner's Office (ICO) at ico.org.uk.",
          'Sweden: The Datainspektionen at datainspektionen.se.',
        ],
      },
      {
        type: 'paragraph',
        text: 'We encourage You to contact Us first at privacy@ctruh.com so that We may attempt to resolve Your concerns directly, expeditiously, and within 1 (one) month of receipt of Your grievance.',
      },
    ],
  },
  {
    id: '21',
    title: 'Your Acceptance',
    blocks: [
      {
        type: 'paragraph',
        text: 'You accept this Policy by accessing the Platform and/or availing the Services. You have a legal right to access a copy of Your Personal Information held by Us and to correct any errors in such data. You also have the right to request that we cease using Your Personal Information for direct marketing purposes.',
      },
      {
        type: 'paragraph',
        text: 'For any queries, concerns, discrepancies, or grievances with respect to Your personal data or this Policy, please contact Us at:',
      },
    ],
  },
];

export const privacyContactInfo: PrivacyInfoItem[] = [
  {
    label: 'Privacy / DPO',
    value: 'privacy@ctruh.com',
    href: 'mailto:privacy@ctruh.com',
  },
  {
    label: 'General Support',
    value: 'contact@ctruh.com',
    href: 'mailto:contact@ctruh.com',
  },
  {
    label: 'Website',
    value: 'www.ctruh.com',
    href: 'https://www.ctruh.com',
  },
  {
    label: 'Platform',
    value: 'commverse.studio',
    href: 'https://commverse.studio',
  },
];

export const privacyClosingNotes = [
  'This document constitutes the complete Privacy Policy of Commverse Studio by Ctruh Technologies Pvt. Ltd. All prior versions are superseded.',
  '© 2026 Ctruh Technologies Pvt. Ltd. All Rights Reserved.',
];
