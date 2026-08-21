/**
 * eVote AI Assistant — Server-Side Knowledge Base & Guidance Engine
 * All information is based on the ACTUAL implemented codebase.
 * Does NOT fabricate security mechanisms or features.
 */

import faqRepository from '../repositories/faq.repository.js';
import announcementRepository from '../repositories/announcement.repository.js';

// ─── Comprehensive Predefined Guidance ───────────────────────────────────────

const GUIDANCE = {
  // Portal Navigation
  Registration: `To register on eVote Telangana:\n1. Click "Register" on the homepage.\n2. Provide: First Name, Last Name, Email, Mobile Number, Password.\n3. Password must be at least 8 characters.\n4. After registration, complete identity verification in the Citizen Portal.\n\nRoute: /register`,

  Login: `eVote Telangana supports two login methods:\n\n1. Email/Mobile + Password — enter credentials and click Login.\n2. Mobile OTP Login — enter your mobile number, receive an OTP, and verify.\n\nIf login fails, check your credentials or use "Forgot Password".\n\nRoute: /login`,

  'Forgot Password': `To reset your password:\n1. Click "Forgot Password" on the login page.\n2. Enter your registered email or mobile number.\n3. Enter the OTP you receive.\n4. Set and confirm your new password.\n\nRoute: /forgot-password`,

  'Citizen Verification': `Voter identity verification (KYC) is required before voting:\n1. Login to the Citizen Portal.\n2. Go to the Verification section.\n3. Submit your Voter ID (EPIC Card) and Aadhaar number.\n4. An administrator will review and approve your request.\n5. Once approved, you are eligible to vote in elections for your constituency.\n\nRoute: /citizen/verification`,

  Voting: `To cast your vote:\n1. Ensure you are registered, logged in, and verified.\n2. Go to "My Elections" in the Citizen Portal.\n3. Select an active election for your constituency.\n4. Review candidates and select your choice.\n5. Confirm and submit your vote.\n\nEach voter can only vote ONCE per election — enforced by a unique database index.\n\nRoute: /citizen/elections`,

  Election: `Elections in eVote Telangana are organized at three levels:\n- National: Lok Sabha (Parliament) elections\n- State: Vidhan Sabha (State Assembly) elections\n- Local: Municipal, Panchayat, Sarpanch elections\n\nElection status: Upcoming → Active → Closed → Results Published\n\nRoute: /elections`,

  Candidates: `Candidates are listed under each election. Each candidate entry includes:\n- Name, Party, Symbol\n- Constituency\n- Manifesto (if provided)\n\nReview candidate information before casting your vote.\n\nRoute: /elections`,

  Results: `Election results are published after an election is officially closed.\n- Admins publish results after verification.\n- Results show: candidate name, party, vote count, percentage, winner status.\n- Individual votes are NEVER revealed — ballot secrecy is maintained.\n- Only aggregate totals are displayed publicly.\n\nRoute: /results`,

  Contact: `For human support:\n1. Visit the Contact page.\n2. Fill in your details and describe your issue.\n3. Select a category: Account, Verification, Voting, Technical, General, Feedback.\n\nEmail: badavathmadanlal06@gmail.com\nRoute: /contact`,

  // Security Questions
  Security: `eVote Telangana implements the following security measures:\n\n1. Password Hashing: bcrypt with salt factor 10 (pre-save Mongoose hook). Passwords are NEVER stored in plain text. The password field has select:false to prevent accidental exposure.\n\n2. JWT Authentication: Login returns a signed JWT. Every protected API requires the Authorization: Bearer <token> header. The protect middleware validates the token signature and expiry.\n\n3. Role-Based Authorization: The authorize('admin') / authorize('voter') middleware restricts access to routes based on user role.\n\n4. Duplicate Vote Prevention: A unique compound index { citizenId: 1, electionId: 1 } in MongoDB prevents any citizen from voting twice in the same election.\n\n5. Audit Logging: All admin actions are logged in a dedicated AuditLog collection with adminId, action, entityType, description, and status.\n\n6. OTP TTL: OTPs auto-expire using MongoDB's TTL index. The OTP model tracks attempt count.\n\nNOTE: This is an academic project. A production system would additionally implement rate limiting, account lockout, helmet.js, Aadhaar encryption, and DPDP Act compliance.`,

  Privacy: `Your privacy on eVote Telangana:\n\n- Your vote is recorded but individual ballot choices are NEVER exposed through any public API.\n- Results only show aggregate vote totals per candidate.\n- Password is stored as a bcrypt hash — never as plain text.\n- The AI Assistant does NOT send your Aadhaar, password, JWT, or private data to any external service.\n\nThis is an academic project — NOT connected to actual government identity systems.`,

  'Ballot Secrecy': `Ballot secrecy means no one — not even administrators — can see which candidate you voted for.\n\nIn eVote Telangana:\n- The Vote model stores userId + candidateId, but the Results API never exposes this pairing.\n- Results are always aggregated (total votes per candidate only).\n- Admins cannot query "who voted for which candidate" through any exposed API.\n\nLimitation: Full cryptographic anonymization (zero-knowledge proofs, blind signatures) is not implemented in this academic project. A production election system would use these techniques.`,

  'Technical Problems': `For technical issues:\n1. Try refreshing the page.\n2. Clear your browser cache and cookies.\n3. Check that you're logged in (JWT tokens may have expired).\n4. Ensure the backend server is running at http://localhost:5000.\n5. Check the browser console for specific error messages.\n6. Contact support through the Contact page.\n\nRoute: /contact`,

  Navigation: `eVote Telangana has three portals:\n\n1. Public Portal: Home, Elections, Results, Announcements, FAQ, Contact, About\n2. Citizen Portal (/citizen): Dashboard, Verification, My Elections, Voting History, Alerts, Profile\n3. Admin Portal (/admin): Dashboard, Elections, Candidates, Citizens, Results, Announcements, Audit Logs, Analytics, Settings\n\nUse the top Menu button or sidebar to navigate between sections.`,

  // India-wide Election Knowledge
  'Lok Sabha': `Lok Sabha is India's lower house of Parliament:\n- 543 constituencies, each electing one MP (Member of Parliament).\n- Elections every 5 years (or earlier if dissolved).\n- The party/coalition with majority forms the central government.\n- Leader of the majority becomes the Prime Minister.\n\nIn eVote Telangana, Lok Sabha elections are National level elections.`,

  'State Assembly': `State Legislative Assembly (Vidhan Sabha):\n- Each state has its own assembly.\n- Voters elect MLAs (Members of Legislative Assembly).\n- Majority party forms the state government.\n- Their leader becomes the Chief Minister.\n\nExamples: Telangana Legislative Assembly, Maharashtra Vidhan Sabha\nIn eVote Telangana, these are State level elections.`,

  'Municipal Elections': `Local Body / Municipal Elections:\n- Municipal Corporations (e.g., GHMC in Hyderabad)\n- Municipal Councils\n- Gram Panchayats\n- Sarpanch elections (village head)\n\nThese are Local level elections in eVote Telangana.`,

  MP: `MP (Member of Parliament):\n- Represents a Lok Sabha constituency in the Indian Parliament.\n- Directly elected by voters during General Elections.\n- 543 total MPs across India.\n- Term: 5 years.`,

  MLA: `MLA (Member of Legislative Assembly):\n- Represents a constituency in the State Legislative Assembly.\n- Elected by voters in that constituency.\n- Majority of MLAs in a state assembly forms the state government.\n- Term: 5 years.`,

  Sarpanch: `Sarpanch:\n- Elected head of a Gram Panchayat (village-level local government).\n- Directly elected by the village's registered voters.\n- Responsible for local development and administration.\n- Part of India's Panchayati Raj system.`,

  Constituency: `A constituency is a geographic area whose registered voters elect one representative:\n- Parliamentary Constituency → MP (Lok Sabha)\n- Assembly Constituency → MLA (State Assembly)\n- Ward → Councillor (Municipal elections)\n\nIn eVote Telangana, a citizen's constituency determines which elections they can vote in.`,

  'Voter ID': `Voter ID Card (EPIC — Electors Photo Identity Card):\n- Issued by the Election Commission of India.\n- Used to verify voter identity.\n- In eVote Telangana's KYC process, citizens submit their EPIC card number.\n\nNote: This portal is an academic project and is NOT connected to the actual ECI voter database.`,

  // Architecture
  Architecture: `eVote Telangana Architecture:\n\nFrontend: React + Vite + Tailwind CSS\n- Three portals: Public, Citizen, Admin\n- React Router v6 for routing\n- Context API for Auth, Theme, Language\n- Axios service layer\n\nBackend: Node.js + Express\n- Pattern: Route → Controller → Service → Repository → Model\n- JWT authentication + role-based authorization\n- MongoDB via Mongoose\n\nKey Models: User, Citizen, CitizenMaster, Election, Candidate, Vote, AuditLog, OTP, Announcement, FAQ, Contact\n\nSecurity: bcrypt (password hashing), JWT (auth), Mongoose schema validation, unique indexes, OTP TTL`,

  // Admin
  'Admin Dashboard': `The Admin Dashboard shows:\n- Total users and verified citizens\n- Active elections\n- Total votes cast\n- Recent activity\n\nRoute: /admin/dashboard`,

  'Election Management': `Admins can create, update, and delete elections:\n- Set title, type, constituency, start/end dates\n- Manage election status: Upcoming → Active → Closed\n\nRoute: /admin/elections`,

  'Audit Logs': `Audit logs track all admin actions:\n- adminId, action, entityType, entityId, description, status\n- Indexed for fast querying\n- Provides accountability and forensic capability\n\nRoute: /admin/audit-logs`,

  Default: `I'm the eVote AI Assistant! I can help you with:\n\n🗳️ Portal guidance (Register, Login, Verify, Vote, Results)\n📚 Election concepts (Lok Sabha, MLA, MP, Constituency)\n🔐 Security explanations (JWT, bcrypt, ballot secrecy)\n🏗️ Project architecture\n🎓 Interview preparation\n\nTry asking:\n- "How do I register?"\n- "What is an MLA?"\n- "How are passwords stored?"\n- "How does JWT work?"\n- "What is ballot secrecy?"\n- "Explain the project architecture"`,
};

// ─── Intent Detection (Server-Side) ──────────────────────────────────────────

function detectIntent(message) {
  const m = message.toLowerCase();

  if (/register|sign up|create account/.test(m)) return 'Registration';
  if (/login|sign in|log in/.test(m)) return 'Login';
  if (/forgot.*password|reset.*password|change.*password/.test(m)) return 'Forgot Password';
  if (/verif|kyc|voter.*id.*submit|aadhaar.*submit/.test(m)) return 'Citizen Verification';
  if (/how.*vote|cast.*vote|voting.*step|voting.*process/.test(m)) return 'Voting';
  if (/ballot.*secret|secret.*ballot|who.*vote|vote.*privat/.test(m)) return 'Ballot Secrecy';
  if (/lok.*sabha|general.*election.*india/.test(m)) return 'Lok Sabha';
  if (/state.*assembl|vidhan.*sabha/.test(m)) return 'State Assembly';
  if (/municipal|panchayat|sarpanch.*elect|ghmc/.test(m)) return 'Municipal Elections';
  if (/\bmp\b|member.*parliament/.test(m)) return 'MP';
  if (/\bmla\b|member.*legisl/.test(m)) return 'MLA';
  if (/\bsarpanch\b/.test(m)) return 'Sarpanch';
  if (/constituency|ward/.test(m)) return 'Constituency';
  if (/voter.*id|epic.*card/.test(m)) return 'Voter ID';
  if (/election/.test(m)) return 'Election';
  if (/candidate|party/.test(m)) return 'Candidates';
  if (/result|winner/.test(m)) return 'Results';
  if (/contact|support/.test(m)) return 'Contact';
  if (/secure|hack|protect|jwt|bcrypt|password.*stor|role.*auth|duplicat.*vot/.test(m)) return 'Security';
  if (/privacy|data.*protect/.test(m)) return 'Privacy';
  if (/error|bug|broken|technical/.test(m)) return 'Technical Problems';
  if (/navigate|where|find|how.*access/.test(m)) return 'Navigation';
  if (/architect|tech.*stack|how.*built/.test(m)) return 'Architecture';
  if (/admin.*dashboard/.test(m)) return 'Admin Dashboard';
  if (/election.*manag/.test(m)) return 'Election Management';
  if (/audit.*log/.test(m)) return 'Audit Logs';
  if (/\bmp\b|member.*parliament/.test(m)) return 'MP';
  if (/\bmla\b/.test(m)) return 'MLA';

  return 'Default';
}

// ─── Repository Class ─────────────────────────────────────────────────────────

class AssistantRepository {
  async searchKnowledgeBase(query) {
    try {
      // 1. Search FAQs first
      const faqs = await faqRepository.searchFaqs(query);
      if (faqs && faqs.length > 0) {
        return {
          source: 'FAQ',
          data: faqs.map(f => ({ question: f.question, answer: f.answer, category: f.category })),
        };
      }
    } catch (_) {
      // FAQ search failed — continue to announcement search
    }

    try {
      // 2. Search Announcements
      const announcements = await announcementRepository.getAllAnnouncements({ isPublished: true });
      if (announcements && announcements.length > 0) {
        // Simple keyword match
        const q = query.toLowerCase();
        const matched = announcements.filter(a =>
          a.title?.toLowerCase().includes(q) || a.content?.toLowerCase().includes(q)
        );
        if (matched.length > 0) {
          return {
            source: 'Announcements',
            data: matched.map(a => ({ title: a.title, content: a.content, category: a.category })),
          };
        }
      }
    } catch (_) {
      // Announcement search failed — fall through to guidance
    }

    return null;
  }

  getPredefinedGuidance(intent) {
    return GUIDANCE[intent] || GUIDANCE.Default;
  }

  detectIntent(message) {
    return detectIntent(message);
  }
}

export default new AssistantRepository();
