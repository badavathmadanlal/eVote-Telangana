/**
 * Fictional State & Constituency Registry for Final Year Project Demonstration
 */
export const STATES_DATA = [
  {
    id: 'telangana',
    name: 'Telangana',
    capital: 'Hyderabad',
    commission: 'Telangana State Election Commission',
    description: 'State Election Portal for the Legislative Assembly of Telangana.',
    bannerUrl: '',
    constituencies: [
      { id: '057-Musheerabad', name: '057-Musheerabad', district: 'Hyderabad', registeredVoters: 245000 },
      { id: '058-Malakpet', name: '058-Malakpet', district: 'Hyderabad', registeredVoters: 215000 },
      { id: '059-Amberpet', name: '059-Amberpet', district: 'Hyderabad', registeredVoters: 198000 },
      { id: '060-Khairatabad', name: '060-Khairatabad', district: 'Hyderabad', registeredVoters: 260000 },
      { id: '061-Jubilee Hills', name: '061-Jubilee Hills', district: 'Hyderabad', registeredVoters: 310000 }
    ]
  },
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    capital: 'Amaravati',
    commission: 'Andhra Pradesh State Election Commission',
    description: 'State Election Portal for Andhra Pradesh Assembly Constituencies.',
    bannerUrl: '',
    constituencies: [
      { id: '019-Vijayawada West', name: '019-Vijayawada West', district: 'NTR', registeredVoters: 230000 },
      { id: '020-Vijayawada Central', name: '020-Vijayawada Central', district: 'NTR', registeredVoters: 245000 },
      { id: '021-Vijayawada East', name: '021-Vijayawada East', district: 'NTR', registeredVoters: 260000 },
      { id: '022-Guntur West', name: '022-Guntur West', district: 'Guntur', registeredVoters: 255000 },
      { id: '023-Visakhapatnam North', name: '023-Visakhapatnam North', district: 'Visakhapatnam', registeredVoters: 280000 }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi',
    capital: 'New Delhi',
    commission: 'State Election Commission of NCT of Delhi',
    description: 'Democratic Remote Voting Portal for the National Capital Territory of Delhi.',
    bannerUrl: '',
    constituencies: [
      { id: '040-New Delhi', name: '040-New Delhi', district: 'New Delhi', registeredVoters: 145000 },
      { id: '041-Chandni Chowk', name: '041-Chandni Chowk', district: 'Central Delhi', registeredVoters: 125000 },
      { id: '042-Greater Kailash', name: '042-Greater Kailash', district: 'South Delhi', registeredVoters: 180000 },
      { id: '043-Dwarka', name: '043-Dwarka', district: 'South West Delhi', registeredVoters: 210000 },
      { id: '044-Rohini', name: '044-Rohini', district: 'North West Delhi', registeredVoters: 195000 }
    ]
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    capital: 'Chennai',
    commission: 'Tamil Nadu State Election Commission',
    description: 'State Election Portal for Tamil Nadu Assembly Constituencies.',
    bannerUrl: '',
    constituencies: [
      { id: '011-Dr. Radhakrishnan Nagar', name: '011-Dr. Radhakrishnan Nagar', district: 'Chennai', registeredVoters: 260000 },
      { id: '012-Harbour', name: '012-Harbour', district: 'Chennai', registeredVoters: 175000 },
      { id: '013-Chepauk-Thiruvallikeni', name: '013-Chepauk-Thiruvallikeni', district: 'Chennai', registeredVoters: 235000 },
      { id: '014-Thousand Lights', name: '014-Thousand Lights', district: 'Chennai', registeredVoters: 240000 },
      { id: '015-Mylapore', name: '015-Mylapore', district: 'Chennai', registeredVoters: 250000 }
    ]
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    capital: 'Mumbai',
    commission: 'Maharashtra State Election Commission',
    description: 'State Election Portal for Maharashtra Assembly Constituencies.',
    bannerUrl: '',
    constituencies: [
      { id: '182-Worli', name: '182-Worli', district: 'Mumbai City', registeredVoters: 265000 },
      { id: '183-Shivadi', name: '183-Shivadi', district: 'Mumbai City', registeredVoters: 240000 },
      { id: '184-Byculla', name: '184-Byculla', district: 'Mumbai City', registeredVoters: 230000 },
      { id: '185-Malabar Hill', name: '185-Malabar Hill', district: 'Mumbai City', registeredVoters: 270000 },
      { id: '186-Colaba', name: '186-Colaba', district: 'Mumbai City', registeredVoters: 255000 }
    ]
  },
  {
    id: 'assam',
    name: 'Assam',
    capital: 'Dispur',
    commission: 'Assam State Election Commission',
    description: 'State Election Portal for Assam Legislative Assembly Constituencies.',
    bannerUrl: '',
    constituencies: [
      { id: '051-Jalukbari', name: '051-Jalukbari', district: 'Kamrup Metropolitan', registeredVoters: 205000 },
      { id: '052-Dispur', name: '052-Dispur', district: 'Kamrup Metropolitan', registeredVoters: 380000 },
      { id: '053-Gauhati East', name: '053-Gauhati East', district: 'Kamrup Metropolitan', registeredVoters: 230000 },
      { id: '054-Gauhati West', name: '054-Gauhati West', district: 'Kamrup Metropolitan', registeredVoters: 275000 },
      { id: '055-Hajo', name: '055-Hajo', district: 'Kamrup', registeredVoters: 185000 }
    ]
  }
];

export const getStateById = (stateId) => {
  if (!stateId) return null;
  const clean = stateId.toLowerCase().trim();
  return STATES_DATA.find(s => s.id === clean || s.name.toLowerCase() === clean) || null;
};
