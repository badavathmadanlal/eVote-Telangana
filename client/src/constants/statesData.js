/**
 * Centralized State Election Data Source (Client)
 * Single Source of Truth for all 6 Supported Indian States.
 * Fictional Academic Data for eVote Final Year Project Demonstration.
 */
export const STATES_DATA = [
  {
    id: 'telangana',
    name: 'Telangana',
    capital: 'Hyderabad',
    commission: 'Telangana State Election Commission',
    electionCommission: 'Telangana State Election Commission',
    description: 'Official Digital Polling Portal for the Telangana Legislative Assembly.',
    districts: ['Hyderabad', 'Rangareddy', 'Medchal-Malkajgiri', 'Warangal', 'Nizamabad'],
    activeElectionsCount: 3,
    upcomingElectionsCount: 1,
    completedElectionsCount: 1,
    totalConstituencies: 119,
    demoVotersCount: 15420,
    status: 'Polling Active',
    constituencies: [
      { id: '057-Musheerabad', name: '057-Musheerabad', district: 'Hyderabad', mandal: 'Musheerabad', village: 'Bholakpur', registeredVoters: '2,45,000' },
      { id: '058-Malakpet', name: '058-Malakpet', district: 'Hyderabad', mandal: 'Malakpet', village: 'Old Malakpet', registeredVoters: '2,15,000' },
      { id: '059-Amberpet', name: '059-Amberpet', district: 'Hyderabad', mandal: 'Amberpet', village: 'Shivam Road', registeredVoters: '1,98,000' },
      { id: '060-Khairatabad', name: '060-Khairatabad', district: 'Hyderabad', mandal: 'Khairatabad', village: 'Somajiguda', registeredVoters: '2,60,000' },
      { id: '061-Jubilee Hills', name: '061-Jubilee Hills', district: 'Hyderabad', mandal: 'Shaikpet', village: 'Film Nagar', registeredVoters: '3,10,000' }
    ],
    rules: [
      'Electors must possess an authenticated EPIC voter identity and completed KYC verification.',
      'Voting access is strictly limited to the electors registered constituency segment.',
      'Ballot transactions are encrypted with 256-bit TLS and cryptographically detached from voter IDs.'
    ]
  },
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    capital: 'Amaravati',
    commission: 'Andhra Pradesh State Election Commission',
    electionCommission: 'Andhra Pradesh State Election Commission',
    description: 'Official Digital Polling Portal for the Andhra Pradesh Legislative Assembly.',
    districts: ['NTR', 'Guntur', 'Visakhapatnam', 'Krishna', 'Tirupati'],
    activeElectionsCount: 3,
    upcomingElectionsCount: 1,
    completedElectionsCount: 1,
    totalConstituencies: 175,
    demoVotersCount: 12850,
    status: 'Polling Active',
    constituencies: [
      { id: '019-Vijayawada West', name: '019-Vijayawada West', district: 'NTR', mandal: 'Vijayawada Urban', village: 'One Town', registeredVoters: '2,30,000' },
      { id: '020-Vijayawada Central', name: '020-Vijayawada Central', district: 'NTR', mandal: 'Vijayawada Urban', village: 'Governorpet', registeredVoters: '2,45,000' },
      { id: '021-Vijayawada East', name: '021-Vijayawada East', district: 'NTR', mandal: 'Vijayawada Rural', village: 'Patamata', registeredVoters: '2,60,000' },
      { id: '022-Guntur West', name: '022-Guntur West', district: 'Guntur', mandal: 'Guntur Urban', village: 'Brodipet', registeredVoters: '2,55,000' },
      { id: '023-Visakhapatnam North', name: '023-Visakhapatnam North', district: 'Visakhapatnam', mandal: 'Visakhapatnam Urban', village: 'Seethammadhara', registeredVoters: '2,80,000' }
    ],
    rules: [
      'All electors must complete Aadhaar-linked demo identity verification before ballot release.',
      'Cross-constituency voting is blocked by smart contract rules and backend authentication.',
      'Official ballot audit slips are cryptographically detached for complete privacy.'
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi',
    capital: 'New Delhi',
    commission: 'State Election Commission of NCT of Delhi',
    electionCommission: 'State Election Commission of NCT of Delhi',
    description: 'Official Digital Polling Portal for the National Capital Territory of Delhi.',
    districts: ['New Delhi', 'Central Delhi', 'South Delhi', 'South West Delhi', 'North West Delhi'],
    activeElectionsCount: 3,
    upcomingElectionsCount: 1,
    completedElectionsCount: 1,
    totalConstituencies: 70,
    demoVotersCount: 9400,
    status: 'Polling Active',
    constituencies: [
      { id: '040-New Delhi', name: '040-New Delhi', district: 'New Delhi', mandal: 'Chanakyapuri', village: 'Connaught Place', registeredVoters: '1,45,000' },
      { id: '041-Chandni Chowk', name: '041-Chandni Chowk', district: 'Central Delhi', mandal: 'Kotwali', village: 'Chandni Chowk', registeredVoters: '1,25,000' },
      { id: '042-Greater Kailash', name: '042-Greater Kailash', district: 'South Delhi', mandal: 'Hauz Khas', village: 'GK Part 1', registeredVoters: '1,80,000' },
      { id: '043-Dwarka', name: '043-Dwarka', district: 'South West Delhi', mandal: 'Dwarka', village: 'Sector 6', registeredVoters: '2,10,000' },
      { id: '044-Rohini', name: '044-Rohini', district: 'North West Delhi', mandal: 'Rohini', village: 'Sector 15', registeredVoters: '1,95,000' }
    ],
    rules: [
      'NCT Delhi remote electors must hold valid electoral roll verification.',
      'Single-session token safeguards ensure one ballot submission per registered citizen.',
      'End-to-end ledger proofs guarantee zero candidate leakage.'
    ]
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    capital: 'Chennai',
    commission: 'Tamil Nadu State Election Commission',
    electionCommission: 'Tamil Nadu State Election Commission',
    description: 'Official Digital Polling Portal for the Tamil Nadu Legislative Assembly.',
    districts: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    activeElectionsCount: 3,
    upcomingElectionsCount: 1,
    completedElectionsCount: 1,
    totalConstituencies: 234,
    demoVotersCount: 16200,
    status: 'Polling Active',
    constituencies: [
      { id: '011-Dr. Radhakrishnan Nagar', name: '011-Dr. Radhakrishnan Nagar', district: 'Chennai', mandal: 'Tondiarpet', village: 'RK Nagar', registeredVoters: '2,60,000' },
      { id: '012-Harbour', name: '012-Harbour', district: 'Chennai', mandal: 'Fort-Tondiarpet', village: 'George Town', registeredVoters: '1,75,000' },
      { id: '013-Chepauk-Thiruvallikeni', name: '013-Chepauk-Thiruvallikeni', district: 'Chennai', mandal: 'Mylapore-Triplicane', village: 'Triplicane', registeredVoters: '2,35,000' },
      { id: '014-Thousand Lights', name: '014-Thousand Lights', district: 'Chennai', mandal: 'Egmore-Nungambakkam', village: 'Nungambakkam', registeredVoters: '2,40,000' },
      { id: '015-Mylapore', name: '015-Mylapore', district: 'Chennai', mandal: 'Mylapore', village: 'Alwarpet', registeredVoters: '2,50,000' }
    ],
    rules: [
      'Tamil Nadu digital roll authentication requires verified EPIC registration.',
      'Voters may only cast ballots within their designated Assembly constituency.',
      'Ballot encryption utilizes zero-knowledge cryptographic receipts.'
    ]
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    capital: 'Mumbai',
    commission: 'Maharashtra State Election Commission',
    electionCommission: 'Maharashtra State Election Commission',
    description: 'Official Digital Polling Portal for the Maharashtra Legislative Assembly.',
    districts: ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane'],
    activeElectionsCount: 3,
    upcomingElectionsCount: 1,
    completedElectionsCount: 1,
    totalConstituencies: 288,
    demoVotersCount: 18900,
    status: 'Polling Active',
    constituencies: [
      { id: '182-Worli', name: '182-Worli', district: 'Mumbai City', mandal: 'Lower Parel', village: 'Worli Seaface', registeredVoters: '2,65,000' },
      { id: '183-Shivadi', name: '183-Shivadi', district: 'Mumbai City', mandal: 'Sewri', village: 'Parel Village', registeredVoters: '2,40,000' },
      { id: '184-Byculla', name: '184-Byculla', district: 'Mumbai City', mandal: 'Byculla', village: 'Mazgaon', registeredVoters: '2,30,000' },
      { id: '185-Malabar Hill', name: '185-Malabar Hill', district: 'Mumbai City', mandal: 'Malabar Hill', village: 'Walkeshwar', registeredVoters: '2,70,000' },
      { id: '186-Colaba', name: '186-Colaba', district: 'Mumbai City', mandal: 'Colaba', village: 'Cuffe Parade', registeredVoters: '2,55,000' }
    ],
    rules: [
      'Maharashtra electors must complete biometric/OTP verification.',
      'Voter access is mapped to official Mumbai City assembly boundaries.',
      'Cryptographic ledger receipts verify participation without exposing candidate selection.'
    ]
  },
  {
    id: 'assam',
    name: 'Assam',
    capital: 'Dispur',
    commission: 'Assam State Election Commission',
    electionCommission: 'Assam State Election Commission',
    description: 'Official Digital Polling Portal for the Assam Legislative Assembly.',
    districts: ['Kamrup Metropolitan', 'Kamrup', 'Nagaon', 'Dibrugarh', 'Cachar'],
    activeElectionsCount: 3,
    upcomingElectionsCount: 1,
    completedElectionsCount: 1,
    totalConstituencies: 126,
    demoVotersCount: 11200,
    status: 'Polling Active',
    constituencies: [
      { id: '051-Jalukbari', name: '051-Jalukbari', district: 'Kamrup Metropolitan', mandal: 'Guwahati', village: 'Jalukbari', registeredVoters: '2,05,000' },
      { id: '052-Dispur', name: '052-Dispur', district: 'Kamrup Metropolitan', mandal: 'Dispur', village: 'Ganeshguri', registeredVoters: '3,80,000' },
      { id: '053-Gauhati East', name: '053-Gauhati East', district: 'Kamrup Metropolitan', mandal: 'Guwahati', village: 'Panbazar', registeredVoters: '2,30,000' },
      { id: '054-Gauhati West', name: '054-Gauhati West', district: 'Kamrup Metropolitan', mandal: 'Guwahati', village: 'Bharalumukh', registeredVoters: '2,75,000' },
      { id: '055-Hajo', name: '055-Hajo', district: 'Kamrup', mandal: 'Hajo', village: 'Hajo Town', registeredVoters: '1,85,000' }
    ],
    rules: [
      'Assam state electoral roll records require active digital verification.',
      'Strict constituency isolation prevents cross-constituency ballot access.',
      'Ledger receipts verify participation while candidate choices remain confidential.'
    ]
  }
];

export const normalizeStateId = (stateNameOrId) => {
  if (!stateNameOrId) return 'telangana';
  const clean = stateNameOrId.toString().toLowerCase().trim().replace(/\s+/g, '-');
  const found = STATES_DATA.find(s => s.id === clean || s.name.toLowerCase() === stateNameOrId.toString().toLowerCase().trim());
  return found ? found.id : 'telangana';
};

export const getStateById = (stateId) => {
  const normId = normalizeStateId(stateId);
  return STATES_DATA.find(s => s.id === normId) || STATES_DATA[0];
};

export const getStateDataById = getStateById;

export default STATES_DATA;
