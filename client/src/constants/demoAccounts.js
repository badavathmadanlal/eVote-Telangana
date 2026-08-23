/**
 * Academic Demonstration Accounts Registry (Client)
 * Used for Final Year Project demo authentication without cellular SMS.
 */
export const DEMO_OTP = '123456';

export const DEMO_CITIZENS = [
  {
    firstName: 'Raju',
    lastName: 'Kumar',
    name: 'Raju Kumar',
    mobile: '9000000001',
    mobileNumber: '9000000001',
    otp: '123456',
    epic: 'DEMO-TEL-001',
    epicNumber: 'DEMO-TEL-001',
    state: 'Telangana',
    district: 'Hyderabad',
    mandal: 'Musheerabad',
    village: 'Bholakpur',
    constituency: '057-Musheerabad'
  },
  {
    firstName: 'Arjun',
    lastName: 'Reddy',
    name: 'Arjun Reddy',
    mobile: '9000000002',
    mobileNumber: '9000000002',
    otp: '123456',
    epic: 'DEMO-AP-001',
    epicNumber: 'DEMO-AP-001',
    state: 'Andhra Pradesh',
    district: 'NTR',
    mandal: 'Vijayawada Urban',
    village: 'One Town',
    constituency: '019-Vijayawada West'
  },
  {
    firstName: 'Rohit',
    lastName: 'Sharma',
    name: 'Rohit Sharma',
    mobile: '9000000003',
    mobileNumber: '9000000003',
    otp: '123456',
    epic: 'DEMO-DEL-001',
    epicNumber: 'DEMO-DEL-001',
    state: 'Delhi',
    district: 'New Delhi',
    mandal: 'Chanakyapuri',
    village: 'Connaught Place',
    constituency: '040-New Delhi'
  },
  {
    firstName: 'Karthik',
    lastName: 'Raj',
    name: 'Karthik Raj',
    mobile: '9000000004',
    mobileNumber: '9000000004',
    otp: '123456',
    epic: 'DEMO-TN-001',
    epicNumber: 'DEMO-TN-001',
    state: 'Tamil Nadu',
    district: 'Chennai',
    mandal: 'Tondiarpet',
    village: 'RK Nagar',
    constituency: '011-Dr. Radhakrishnan Nagar'
  },
  {
    firstName: 'Akash',
    lastName: 'Patil',
    name: 'Akash Patil',
    mobile: '9000000005',
    mobileNumber: '9000000005',
    otp: '123456',
    epic: 'DEMO-MH-001',
    epicNumber: 'DEMO-MH-001',
    state: 'Maharashtra',
    district: 'Mumbai City',
    mandal: 'Lower Parel',
    village: 'Worli Seaface',
    constituency: '182-Worli'
  },
  {
    firstName: 'Tajesh',
    lastName: 'Roy',
    name: 'Tajesh Roy',
    mobile: '9000000006',
    mobileNumber: '9000000006',
    otp: '123456',
    epic: 'DEMO-AS-001',
    epicNumber: 'DEMO-AS-001',
    state: 'Assam',
    district: 'Kamrup Metropolitan',
    mandal: 'Guwahati',
    village: 'Jalukbari',
    constituency: '051-Jalukbari'
  }
];

export const getDemoCitizenByState = (stateName) => {
  if (!stateName) return null;
  const clean = stateName.toLowerCase().trim();
  return DEMO_CITIZENS.find(c => c.state.toLowerCase() === clean) || null;
};
