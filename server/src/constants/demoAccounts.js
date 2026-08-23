/**
 * Academic Demonstration Accounts Registry
 * Used exclusively for Final Year Project demonstration environments without real cellular SMS dependencies.
 * Contains 6 Fictional Demo Citizens (1 per supported Indian State).
 */
export const DEMO_OTP = '123456';

export const DEMO_CITIZENS = [
  {
    firstName: 'Raju',
    lastName: 'Kumar',
    mobileNumber: '9000000001',
    aadhaar: '999900000001',
    epicNumber: 'DEMO-TEL-001',
    state: 'Telangana',
    district: 'Hyderabad',
    mandal: 'Musheerabad',
    village: 'Bholakpur',
    constituency: '057-Musheerabad',
    address: 'H.No 1-2-345/A, Musheerabad, Hyderabad - 500020',
    email: 'raju.kumar@demo.evote.ac.in',
    isDemoAccount: true,
    isMobileVerified: true,
    isKycVerified: false,
    kycStatus: 'pending',
    role: 'voter',
    hasVoted: false
  },
  {
    firstName: 'Arjun',
    lastName: 'Reddy',
    mobileNumber: '9000000002',
    aadhaar: '999900000002',
    epicNumber: 'DEMO-AP-001',
    state: 'Andhra Pradesh',
    district: 'NTR',
    mandal: 'Vijayawada Urban',
    village: 'One Town',
    constituency: '019-Vijayawada West',
    address: 'Plot 45, One Town, Vijayawada - 520001',
    email: 'arjun.reddy@demo.evote.ac.in',
    isDemoAccount: true,
    isMobileVerified: true,
    isKycVerified: false,
    kycStatus: 'pending',
    role: 'voter',
    hasVoted: false
  },
  {
    firstName: 'Rohit',
    lastName: 'Sharma',
    mobileNumber: '9000000003',
    aadhaar: '999900000003',
    epicNumber: 'DEMO-DEL-001',
    state: 'Delhi',
    district: 'New Delhi',
    mandal: 'Chanakyapuri',
    village: 'Connaught Place',
    constituency: '040-New Delhi',
    address: 'Flat 12-B, Connaught Place, New Delhi - 110001',
    email: 'rohit.sharma@demo.evote.ac.in',
    isDemoAccount: true,
    isMobileVerified: true,
    isKycVerified: false,
    kycStatus: 'pending',
    role: 'voter',
    hasVoted: false
  },
  {
    firstName: 'Karthik',
    lastName: 'Raj',
    mobileNumber: '9000000004',
    aadhaar: '999900000004',
    epicNumber: 'DEMO-TN-001',
    state: 'Tamil Nadu',
    district: 'Chennai',
    mandal: 'Tondiarpet',
    village: 'RK Nagar',
    constituency: '011-Dr. Radhakrishnan Nagar',
    address: 'New Door 88, RK Nagar, Chennai - 600021',
    email: 'karthik.raj@demo.evote.ac.in',
    isDemoAccount: true,
    isMobileVerified: true,
    isKycVerified: false,
    kycStatus: 'pending',
    role: 'voter',
    hasVoted: false
  },
  {
    firstName: 'Akash',
    lastName: 'Patil',
    mobileNumber: '9000000005',
    aadhaar: '999900000005',
    epicNumber: 'DEMO-MH-001',
    state: 'Maharashtra',
    district: 'Mumbai City',
    mandal: 'Lower Parel',
    village: 'Worli Seaface',
    constituency: '182-Worli',
    address: 'Seaface Towers, Worli, Mumbai - 400018',
    email: 'akash.patil@demo.evote.ac.in',
    isDemoAccount: true,
    isMobileVerified: true,
    isKycVerified: false,
    kycStatus: 'pending',
    role: 'voter',
    hasVoted: false
  },
  {
    firstName: 'Tajesh',
    lastName: 'Roy',
    mobileNumber: '9000000006',
    aadhaar: '999900000006',
    epicNumber: 'DEMO-AS-001',
    state: 'Assam',
    district: 'Kamrup Metropolitan',
    mandal: 'Guwahati',
    village: 'Jalukbari',
    constituency: '051-Jalukbari',
    address: 'River View Road, Jalukbari, Guwahati - 781014',
    email: 'tajesh.roy@demo.evote.ac.in',
    isDemoAccount: true,
    isMobileVerified: true,
    isKycVerified: false,
    kycStatus: 'pending',
    role: 'voter',
    hasVoted: false
  }
];

export const isDemoMobile = (mobile) => {
  const clean = String(mobile || '').trim().replace(/\D/g, '');
  return (
    clean === '9000000001' ||
    clean === '9000000002' ||
    clean === '9000000003' ||
    clean === '9000000004' ||
    clean === '9000000005' ||
    clean === '9000000006' ||
    clean === '1234567890' ||
    clean === '1234567891'
  );
};

export const getDemoCitizen = (mobile) => {
  const clean = String(mobile || '').trim().replace(/\D/g, '');
  const found = DEMO_CITIZENS.find(c => c.mobileNumber === clean);
  if (found) return found;
  // Legacy aliases
  if (clean === '1234567890') return DEMO_CITIZENS[0];
  if (clean === '1234567891') return DEMO_CITIZENS[0];
  return null;
};
