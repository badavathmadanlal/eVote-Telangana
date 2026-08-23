import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Election from '../models/election.model.js';
import Candidate from '../models/candidate.model.js';
import Vote from '../models/vote.model.js';
import Announcement from '../models/announcement.model.js';
import { STATE_ELECTION_DATA } from '../constants/stateElectionData.js';
import { DEMO_CITIZENS } from '../constants/demoAccounts.js';

const CANDIDATE_TEMPLATES = [
  { party: 'Progressive Democratic Alliance', symbol: 'Torch / Deepam', manifesto: 'Clean energy, municipal infrastructure, and citizen digital empowerment.' },
  { party: 'National People Vanguard', symbol: 'Rising Sun / Suryudu', manifesto: 'Farmer welfare subsidies, free rural connectivity, and health infrastructure.' },
  { party: 'State Welfare Federation', symbol: 'Plow / Nagali', manifesto: 'Skill development centers, youth employment incentives, and public transit.' },
  { party: 'Independent Citizen Forum', symbol: 'Bicycle / Cycle', manifesto: 'Local governance transparency, anti-corruption grievance redressal, and urban parks.' }
];

const FIRST_NAMES = [
  'Ramesh', 'Srinivas', 'Kavitha', 'Prakash', 'Rajesh', 'Sunitha', 'Venkatesh', 'Deepa',
  'Naresh', 'Swapna', 'Manohar', 'Geetha', 'Raghavan', 'Pooja', 'Chandra', 'Divya',
  'Arun', 'Sneha', 'Mohan', 'Meenakshi', 'Vikram', 'Anand', 'Priyanka', 'Sathish'
];

const LAST_NAMES = [
  'Rao', 'Reddy', 'Goud', 'Sharma', 'Varma', 'Patel', 'Nair', 'Iyer',
  'Choudhary', 'Das', 'Sen', 'Menon', 'Naidu', 'Kumar', 'Devi', 'Singhania'
];

class SeedService {
  async seedAllDemoData() {
    console.log('[SEED] Ensuring Deterministic Multi-State Demo Election Database...');

    // 1. Ensure Admin Account
    let admin = await User.findOne({ email: 'admin@ceotelangana.nic.in' });
    if (!admin) {
      admin = await User.create({
        firstName: 'State Election',
        lastName: 'Commission',
        email: 'admin@ceotelangana.nic.in',
        password: 'AdminSecurePassword2026!',
        role: 'admin',
        isEmailVerified: true,
        isMobileVerified: true,
        state: 'Telangana',
        district: 'Hyderabad',
        constituency: '057-Musheerabad'
      });
      console.log('[SEED] Created Admin User: admin@ceotelangana.nic.in');
    }

    // 2. Ensure 6 State-Specific Demo Citizens start fresh (zero votes, unvoted)
    for (const demo of DEMO_CITIZENS) {
      let u = await User.findOne({ mobileNumber: demo.mobileNumber });
      if (!u) {
        await User.create({
          ...demo,
          password: 'DemoPassword2026!',
        });
      } else {
        u.firstName = demo.firstName;
        u.lastName = demo.lastName;
        u.isDemoAccount = true;
        u.epicNumber = demo.epicNumber;
        u.state = demo.state;
        u.district = demo.district;
        u.mandal = demo.mandal;
        u.village = demo.village;
        u.constituency = demo.constituency;
        u.address = demo.address;
        u.hasVoted = false;
        u.isKycVerified = false;
        u.kycStatus = 'pending';
        await u.save();
      }
    }

    // Reset all voter flags
    await User.updateMany({ role: 'voter' }, { hasVoted: false });

    // 3. Seed ~120 Fictional Demo Voters across 30 constituencies (4 per constituency)
    const existingVotersCount = await User.countDocuments({ role: 'voter' });
    if (existingVotersCount < 80) {
      console.log('[SEED] Seeding Fictional Demo Electors...');
      const voterDocs = [];
      let voterIdx = 10;

      for (const state of STATE_ELECTION_DATA) {
        const stateCode = state.id.slice(0, 3).toUpperCase();
        for (const constObj of state.constituencies) {
          for (let i = 1; i <= 4; i++) {
            voterIdx++;
            const fName = FIRST_NAMES[(voterIdx * 3) % FIRST_NAMES.length];
            const lName = LAST_NAMES[(voterIdx * 7) % LAST_NAMES.length];
            const epicNum = `DEMO-${stateCode}-${String(voterIdx).padStart(3, '0')}`;
            const mobile = `98765${String(voterIdx).padStart(5, '0')}`;
            const isVerified = voterIdx % 5 !== 0;

            voterDocs.push({
              firstName: fName,
              lastName: lName,
              email: `${fName.toLowerCase()}.${lName.toLowerCase()}.${voterIdx}@demo.evote.gov.in`,
              mobileNumber: mobile,
              aadhaar: `99990000${String(voterIdx).padStart(4, '0')}`,
              epicNumber: epicNum,
              state: state.name,
              district: constObj.district,
              mandal: constObj.mandal || constObj.name.split('-')[1],
              village: constObj.village || 'Locality Center',
              constituency: constObj.name,
              address: `H.No ${i}-${voterIdx}/A, ${constObj.name}, ${state.name}`,
              password: 'DemoVoterPass123!',
              role: 'voter',
              isMobileVerified: true,
              isKycVerified: isVerified,
              kycStatus: isVerified ? 'verified' : 'pending',
              isDemoAccount: true,
              hasVoted: false
            });
          }
        }
      }

      if (voterDocs.length > 0) {
        await User.insertMany(voterDocs, { ordered: false }).catch(() => null);
        console.log(`[SEED] Created ${voterDocs.length} fictional demo electors.`);
      }
    }

    // 4. Seed EXACTLY 30 ELECTIONS (5 per state: 3 Active, 1 Upcoming, 1 Completed) and clean all votes
    console.log('[SEED] Seeding exactly 30 elections in single atomic batch...');
    await Election.deleteMany({});
    await Candidate.deleteMany({});
    await Vote.deleteMany({});

    const allElectionDocs = [];
    for (const state of STATE_ELECTION_DATA) {
      const cList = state.constituencies;

      allElectionDocs.push(
        {
          title: `${state.name} Legislative Assembly General Election 2026`,
          description: `Official Remote Assembly Election for ${cList[0].name} constituency (${state.name}).`,
          electionType: 'State Legislative Assembly',
          state: state.name,
          constituency: cList[0].name,
          startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
          createdBy: admin._id
        },
        {
          title: `${state.name} Municipal Corporation General Election 2026`,
          description: `Urban Civic Polling Event for ${cList[1].name} constituency (${state.name}).`,
          electionType: 'Urban Local Bodies',
          state: state.name,
          constituency: cList[1].name,
          startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
          createdBy: admin._id
        },
        {
          title: `${state.name} Zilla Parishad Council Election 2026`,
          description: `District Council Democractic Poll for ${cList[2].name} constituency (${state.name}).`,
          electionType: 'District Council',
          state: state.name,
          constituency: cList[2].name,
          startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
          createdBy: admin._id
        },
        {
          title: `${state.name} Urban Local Bodies Election 2027`,
          description: `Scheduled Municipal Ward Election for ${cList[3].name} (${state.name}).`,
          electionType: 'Urban Local Bodies',
          state: state.name,
          constituency: cList[3].name,
          startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          status: 'UPCOMING',
          createdBy: admin._id
        },
        {
          title: `${state.name} State Cooperative Council By-Election 2025`,
          description: `Concluded Special Polling Session for ${cList[4].name} (${state.name}).`,
          electionType: 'Cooperative Council',
          state: state.name,
          constituency: cList[4].name,
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          status: 'COMPLETED',
          createdBy: admin._id
        }
      );
    }

    const createdElections = await Election.insertMany(allElectionDocs);
    console.log(`[SEED] Created ${createdElections.length} verified elections across 6 states.`);

    // 5. Seed Candidates for every election
    const candidateDocs = [];
    for (let eIdx = 0; eIdx < createdElections.length; eIdx++) {
      const elec = createdElections[eIdx];
      CANDIDATE_TEMPLATES.forEach((tmpl, cIdx) => {
        const fName = FIRST_NAMES[(eIdx * 4 + cIdx) % FIRST_NAMES.length];
        const lName = LAST_NAMES[(eIdx * 4 + cIdx) % LAST_NAMES.length];
        candidateDocs.push({
          fullName: `${fName} ${lName}`,
          partyName: tmpl.party,
          partySymbol: tmpl.symbol,
          electionId: elec._id,
          state: elec.state,
          constituency: elec.constituency,
          createdBy: admin._id,
          manifesto: tmpl.manifesto
        });
      });
    }
    await Candidate.insertMany(candidateDocs);
    console.log(`[SEED] Created ${candidateDocs.length} verified candidates.`);

    // 6. Seed State-Aware Announcements (4 per state = 24 total)
    console.log('[SEED] Seeding State-Aware Announcements...');
    await Announcement.deleteMany({});
    const announceDocs = [];

    for (const state of STATE_ELECTION_DATA) {
      announceDocs.push(
        {
          title: `${state.name} Voter Roll Verification Window Updated`,
          content: `The State Election Commission of ${state.name} has extended the digital KYC identity verification portal for all gazetted assembly constituencies.`,
          category: 'VOTER INFORMATION',
          issuer: `Chief Electoral Officer, ${state.name}`,
          state: state.name,
          isPublished: true,
          isPinned: true,
          createdBy: admin._id,
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          title: `${state.name} General Election Polling Timelines Announced`,
          content: `Digital remote polling schedule for active constituencies in ${state.name} is now accessible on the official election directory.`,
          category: 'SCHEDULE',
          issuer: `Chief Electoral Officer, ${state.name}`,
          state: state.name,
          isPublished: true,
          isPinned: false,
          createdBy: admin._id,
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          title: `${state.name} Candidate Nominations Scrutiny Concluded`,
          content: `Returning Officers across ${state.name} have published the finalized candidate manifestos and allocated authorized party symbols.`,
          category: 'NOMINATION',
          issuer: `State Election Commission of ${state.name}`,
          state: state.name,
          isPublished: true,
          isPinned: false,
          createdBy: admin._id,
          updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
        },
        {
          title: `${state.name} Remote Polling Cryptographic Security Guidelines`,
          content: `All ballots cast in ${state.name} are safeguarded using 256-bit TLS encryption, zero-knowledge participation proofs, and immutable ledger receipts.`,
          category: 'SECURITY',
          issuer: `State Election Commission of ${state.name}`,
          state: state.name,
          isPublished: true,
          isPinned: false,
          createdBy: admin._id,
          updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
        }
      );
    }

    await Announcement.insertMany(announceDocs);
    console.log(`[SEED] Seeded ${announceDocs.length} state-aware announcements.`);

    console.log('[SEED] Deterministic Multi-State Demo Database seeding completed successfully.');
  }
}

export default new SeedService();
