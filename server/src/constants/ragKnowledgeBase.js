/**
 * eVote Controlled Election Knowledge Dataset (RAG Knowledge Base)
 * Authoritative, verified election guidance documents for academic demonstration.
 * 
 * Schema per document:
 * - id: string
 * - title: string
 * - category: 'GENERAL_ELECTION_INFO' | 'VOTING_GUIDANCE' | 'ELECTION_CONDUCT' | 'FAQ' | 'STATE_GUIDELINES'
 * - state: 'ALL' | 'Telangana' | 'Andhra Pradesh' | 'Delhi' | 'Tamil Nadu' | 'Maharashtra' | 'Assam'
 * - constituency: 'ALL' | specific constituency string
 * - language: 'English'
 * - source: 'eVote Academic Knowledge Base' | 'State Election Commission Guidelines'
 * - content: string
 * - version: '1.0.0'
 * - keywords: Array<string>
 */

export const RAG_KNOWLEDGE_DOCUMENTS = [
  // ==========================================
  // 1. GENERAL ELECTION INFORMATION
  // ==========================================
  {
    id: 'gen-001',
    title: 'What is an Election?',
    category: 'GENERAL_ELECTION_INFO',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['what is an election', 'election definition', 'democratic election', 'purpose of election', 'electoral process'],
    content: 'An election is a formal, constitutional democratic decision-making process by which eligible citizens select their representatives to hold public legislative office. In democratic systems, elections uphold universal adult suffrage, allowing electors to exercise their franchise through a free, fair, and confidential balloting process.'
  },
  {
    id: 'gen-002',
    title: 'What is an Assembly Constituency?',
    category: 'GENERAL_ELECTION_INFO',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['what is an assembly constituency', 'what is a constituency', 'constituency', 'electoral district', 'assembly segment', 'registered constituency', 'constituency definition'],
    content: 'An Assembly Constituency is a constitutionally demarcated geographic electoral district represented by a single elected member in the State Legislative Assembly (Vidhan Sabha). Every registered elector is assigned to a specific constituency based on their residential address as recorded on the official State Electoral Roll.'
  },
  {
    id: 'gen-003',
    title: 'Meaning of ACTIVE Election',
    category: 'GENERAL_ELECTION_INFO',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['active election', 'meaning of active election', 'what does active mean', 'what does an active election mean', 'live election', 'voting open', 'polling active'],
    content: 'An ACTIVE election is a currently open polling event where the designated voting window is live. Verified, eligible citizens registered in that specific constituency are actively authorized to access the digital ballot, review contesting candidates, and cast their confidential encrypted vote.'
  },
  {
    id: 'gen-004',
    title: 'Meaning of UPCOMING Election',
    category: 'GENERAL_ELECTION_INFO',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['upcoming election', 'meaning of upcoming election', 'what does upcoming election mean', 'scheduled election', 'future election', 'not started'],
    content: 'An UPCOMING election is a gazetted polling event that has been officially scheduled by the State Election Commission but whose voting window has not yet opened. Voters can view election timelines, constituency profiles, and candidate manifests in advance of polling day.'
  },
  {
    id: 'gen-005',
    title: 'Meaning of COMPLETED Election',
    category: 'GENERAL_ELECTION_INFO',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['completed election', 'meaning of completed election', 'what does completed election mean', 'closed election', 'past election', 'election finished', 'results tabulated'],
    content: 'A COMPLETED election is a concluded polling session where the official voting window has closed. The digital ballot box is locked, individual ballots are securely tabulated, and certified turnout metrics and outcome summaries are published on the Results portal.'
  },
  {
    id: 'gen-006',
    title: 'General Election Process & Lifecycle',
    category: 'GENERAL_ELECTION_INFO',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['election process', 'how does election work', 'how does the election process work', 'election lifecycle', 'polling steps', 'electoral stages'],
    content: 'The general election lifecycle consists of: 1) Electoral Roll publication and voter registration; 2) Candidate nomination filing and scrutiny; 3) Identity verification (KYC); 4) Polling phase during which electors cast confidential ballots; 5) Ballot tallying and audit verification; and 6) Official declaration of certified election results.'
  },

  // ==========================================
  // 2. VOTING GUIDANCE
  // ==========================================
  {
    id: 'vote-001',
    title: 'How to Vote (Step-by-Step Remote Voting Guide)',
    category: 'VOTING_GUIDANCE',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['how do i vote', 'how to vote', 'steps to vote', 'voting procedure', 'cast my vote', 'guide to voting', 'how do i cast my vote'],
    content: 'To vote remotely on eVote: 1) Sign in with your registered mobile number and OTP; 2) Ensure your voter identity verification (KYC) is Complete; 3) Navigate to the Elections section and find the Active election for your constituency; 4) Click "Proceed to Ballot" to review contesting candidates; 5) Select your preferred candidate and confirm your choice; 6) Download your official cryptographic participation receipt from Voting History.'
  },
  {
    id: 'vote-002',
    title: 'Steps Before Voting (Pre-Voting Checklist)',
    category: 'VOTING_GUIDANCE',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['steps before voting', 'what should i do before voting', 'before voting', 'prepare for voting', 'voter checklist'],
    content: 'Before voting: 1) Confirm your registered state and constituency details in your Citizen Profile; 2) Check that your Voter ID (EPIC) and Aadhaar KYC verification is verified; 3) Review the official candidate roster and party symbols for your assembly constituency; 4) Verify that the polling window for your election is marked as ACTIVE.'
  },
  {
    id: 'vote-003',
    title: 'What is Voter Identity Verification (KYC)?',
    category: 'VOTING_GUIDANCE',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['what is voter verification', 'voter verification', 'kyc verification', 'identity verification', 'why kyc is needed', 'electoral roll check', 'how do i verify my voter kyc'],
    content: 'Voter Identity Verification (KYC) is a mandatory security measure that cross-references a citizen\'s Voter ID (EPIC) and Aadhaar credentials against the official State Electoral Roll. This guarantees that only legitimate, authenticated electors registered in their respective constituencies can access the ballot, preventing duplicate voting and impersonation.'
  },
  {
    id: 'vote-004',
    title: 'Documents Required for Voter Identity Verification',
    category: 'VOTING_GUIDANCE',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['documents required for verification', 'what documents are required', 'what documents are required for verification', 'verification documents', 'id proof for voting', 'epic card', 'aadhaar for voting'],
    content: 'For voter verification, electors require: 1) A valid 10-character Election Photo Identity Card (EPIC) number issued by the Election Commission; 2) A 12-digit Aadhaar number for demographic matching; 3) A registered mobile number capable of receiving one-time passcodes (OTP).'
  },
  {
    id: 'vote-005',
    title: 'Voting Eligibility Requirements',
    category: 'VOTING_GUIDANCE',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['am i eligible to vote', 'voting eligibility', 'eligibility requirements', 'who can vote', 'voter qualification', 'am i eligible'],
    content: 'To be eligible to vote on eVote, a citizen must: 1) Be an Indian citizen aged 18 years or older; 2) Be enrolled on the current State Electoral Roll; 3) Possess a valid EPIC voter card number; 4) Have successfully completed voter identity (KYC) verification; and 5) Have an active election scheduled in their registered constituency.'
  },
  {
    id: 'vote-006',
    title: 'What is a Voting Receipt? (Cryptographic Participation Proof)',
    category: 'VOTING_GUIDANCE',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['what is a voting receipt', 'voting receipt', 'ballot receipt', 'cryptographic receipt', 'proof of voting', 'receipt hash', 'where can i find my voting receipt'],
    content: 'A Voting Receipt is an immutable cryptographic digital record generated immediately upon submitting your ballot. It serves as mathematical proof that your vote was cast and recorded on the electoral ledger, providing a unique receipt reference and timestamp while keeping your candidate selection strictly confidential.'
  },
  {
    id: 'vote-007',
    title: 'General Voter Responsibilities & Democratic Duty',
    category: 'VOTING_GUIDANCE',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['what are voter responsibilities', 'voter responsibilities', 'voter duties', 'citizen responsibilities', 'democratic responsibility', 'duties of a voter'],
    content: 'Voter responsibilities include: 1) Maintaining the privacy of login credentials and OTPs; 2) Casting votes independently without external coercion; 3) Researching candidate profiles and policy manifestos prior to voting; 4) Verifying receipt generation following ballot submission; and 5) Reporting any election malpractice to the official voter helpline.'
  },

  // ==========================================
  // 3. ELECTION CONDUCT & INTEGRITY
  // ==========================================
  {
    id: 'cond-001',
    title: 'What is the Model Code of Conduct (MCC)?',
    category: 'ELECTION_CONDUCT',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['what is the model code of conduct', 'model code of conduct', 'mcc', 'election rules', 'campaign rules', 'code of conduct', 'general election conduct'],
    content: 'The Model Code of Conduct (MCC) is a set of statutory guidelines issued by the Election Commission to regulate political parties and candidates during election periods. It ensures free and fair elections by prohibiting hate speech, voter bribery, misuse of official government machinery, and campaigning during the silence period prior to polling.'
  },
  {
    id: 'cond-002',
    title: 'Political Neutrality & AI Assistant Principles',
    category: 'ELECTION_CONDUCT',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['political neutrality', 'neutrality', 'assistant neutrality', 'fairness', 'unbiased info'],
    content: 'The eVote AI Assistant strictly adheres to constitutional political neutrality. It provides factual, non-partisan electoral information regarding scheduled elections, registered candidates, and polling guidelines, and is prohibited from endorsing, recommending, or ranking any candidate or political organization.'
  },
  {
    id: 'cond-003',
    title: 'Ballot Secrecy & Voter Privacy Guarantees',
    category: 'ELECTION_CONDUCT',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['ballot secrecy', 'vote privacy', 'is my vote secret', 'secret ballot', 'confidential voting', 'who did i vote for'],
    content: 'Under constitutional secret ballot guarantees, an elector\'s personal identity is mathematically decoupled from their cast vote before the encrypted ballot enters the tallying vault. No administrator, election officer, or AI system can view or disclose which candidate an individual citizen selected.'
  },

  // ==========================================
  // 4. COMMON FAQS
  // ==========================================
  {
    id: 'faq-001',
    title: 'Can I Change My Vote After Submitting?',
    category: 'FAQ',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['can i change my vote', 'change vote', 'modify vote', 're-vote', 'recast vote', 'vote again'],
    content: 'No. In accordance with established electoral laws, once a vote is encrypted and confirmed on the ledger, it is final and immutable. A voter cannot alter, re-cast, or cancel their submitted ballot.'
  },
  {
    id: 'faq-002',
    title: 'Who Do I Contact for Technical or Voter Support?',
    category: 'FAQ',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['voter helpline', 'who do i contact', 'help desk', 'toll free helpline', 'call 1950', 'support number', 'contact election office'],
    content: 'For electoral grievances, technical assistance, or voter help, citizens can call the National Voters\' Toll-Free Helpline at 1950 (available 24x7) or submit a grievance ticket through the Contact page.'
  },
  {
    id: 'faq-003',
    title: 'How Are Election Results Tabulated and Verified?',
    category: 'FAQ',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['how are results tabulated', 'counting votes', 'result verification', 'election tabulation', 'tallying process', 'how results are counted'],
    content: 'After the polling window concludes, all encrypted ballots in the constituency vault are decrypted and counted using automated, verifiable cryptographic tallies. Certified outcomes, voter turnout percentages, and candidate vote shares are published on the Results portal.'
  },
  {
    id: 'faq-004',
    title: 'Can I Vote Remotely from Any Device?',
    category: 'FAQ',
    state: 'ALL',
    constituency: 'ALL',
    language: 'English',
    source: 'eVote Academic Knowledge Base',
    version: '1.0.0',
    keywords: ['vote from mobile', 'vote from device', 'remote voting devices', 'browser requirements', 'can i vote from my phone'],
    content: 'Yes. The eVote portal is accessible from any modern web browser on desktop computers, laptops, tablets, and smartphones, enabling verified electors to participate in scheduled elections securely from anywhere.'
  },

  // ==========================================
  // 5. STATE-SPECIFIC ELECTORAL GUIDELINES
  // ==========================================
  {
    id: 'state-ts-001',
    title: 'Telangana State Election Commission Guidelines',
    category: 'STATE_GUIDELINES',
    state: 'Telangana',
    constituency: 'ALL',
    language: 'English',
    source: 'Telangana State Election Commission Guidelines',
    version: '1.0.0',
    keywords: ['telangana election rules', 'telangana guidelines', 'telangana voting info', 'telangana sec', 'tsec', 'elections in telangana', 'what elections are happening in my state telangana'],
    content: 'The Telangana State Election Commission (TSEC) oversees local body and legislative assembly polling across 119 constituencies in Telangana, including Musheerabad, Malakpet, Amberpet, Khairatabad, and Jubilee Hills. Electors in Telangana must be registered on the state electoral roll to access authorized ballots.'
  },
  {
    id: 'state-ap-001',
    title: 'Andhra Pradesh State Election Commission Guidelines',
    category: 'STATE_GUIDELINES',
    state: 'Andhra Pradesh',
    constituency: 'ALL',
    language: 'English',
    source: 'Andhra Pradesh State Election Commission Guidelines',
    version: '1.0.0',
    keywords: ['andhra pradesh election rules', 'andhra pradesh guidelines', 'ap sec', 'andhra voting info', 'elections in andhra pradesh', 'what elections are happening in my state andhra pradesh'],
    content: 'The Andhra Pradesh State Election Commission conducts democratic elections across 175 assembly segments in Andhra Pradesh, including Vijayawada West, Vijayawada Central, Vijayawada East, Guntur West, and Visakhapatnam North. Electors must hold a valid Andhra Pradesh EPIC card to participate.'
  },
  {
    id: 'state-dl-001',
    title: 'State Election Commission of NCT of Delhi Guidelines',
    category: 'STATE_GUIDELINES',
    state: 'Delhi',
    constituency: 'ALL',
    language: 'English',
    source: 'State Election Commission of NCT of Delhi Guidelines',
    version: '1.0.0',
    keywords: ['delhi election rules', 'delhi guidelines', 'delhi sec', 'delhi voting info', 'nct of delhi', 'elections in delhi', 'what elections are happening in my state delhi'],
    content: 'The State Election Commission of NCT of Delhi administers legislative assembly and civic elections across 70 constituencies, including New Delhi, Chandni Chowk, Greater Kailash, Dwarka, and Rohini. Verified Delhi electors can cast ballots during gazetted active polling sessions.'
  },
  {
    id: 'state-tn-001',
    title: 'Tamil Nadu State Election Commission Guidelines',
    category: 'STATE_GUIDELINES',
    state: 'Tamil Nadu',
    constituency: 'ALL',
    language: 'English',
    source: 'Tamil Nadu State Election Commission Guidelines',
    version: '1.0.0',
    keywords: ['tamil nadu election rules', 'tamil nadu guidelines', 'tn sec', 'tamil nadu voting info', 'elections in tamil nadu', 'what elections are happening in my state tamil nadu'],
    content: 'The Tamil Nadu State Election Commission supervises electoral governance across 234 assembly segments in Tamil Nadu, including Dr. Radhakrishnan Nagar, Harbour, Chepauk-Thiruvallikeni, Saidapet, and Kolathur. Verified electors participate through confidential digital ballot submission.'
  },
  {
    id: 'state-mh-001',
    title: 'Maharashtra State Election Commission Guidelines',
    category: 'STATE_GUIDELINES',
    state: 'Maharashtra',
    constituency: 'ALL',
    language: 'English',
    source: 'Maharashtra State Election Commission Guidelines',
    version: '1.0.0',
    keywords: ['maharashtra election rules', 'maharashtra guidelines', 'maharashtra sec', 'maharashtra voting info', 'elections in maharashtra', 'what elections are happening in my state maharashtra'],
    content: 'The Maharashtra State Election Commission conducts democratic balloting across 288 assembly constituencies, including Worli, Colaba, Bandra West, Shivajinagar, and Thane. Electors must be authenticated on the Maharashtra electoral roll to access candidate ballots.'
  },
  {
    id: 'state-as-001',
    title: 'Assam State Election Commission Guidelines',
    category: 'STATE_GUIDELINES',
    state: 'Assam',
    constituency: 'ALL',
    language: 'English',
    source: 'Assam State Election Commission Guidelines',
    version: '1.0.0',
    keywords: ['assam election rules', 'assam guidelines', 'assam sec', 'assam voting info', 'elections in assam', 'what elections are happening in my state assam'],
    content: 'The Assam State Election Commission oversees electoral processes across 126 assembly segments, including Jalukbari, Dispur, Gauhati East, Gauhati West, and Silchar. Assam electors must verify their credentials against the state roll to participate in active polling.'
  }
];
