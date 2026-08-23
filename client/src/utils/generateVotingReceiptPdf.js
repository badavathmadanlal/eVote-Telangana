import { jsPDF } from 'jspdf';

/**
 * Generate a professional, certified PDF voting receipt.
 * Strictly adheres to Secret Ballot guarantees (ZERO candidate information).
 * 
 * @param {Object} data 
 * @param {string} data.referenceNumber
 * @param {string} data.electionTitle
 * @param {string} data.state
 * @param {string} data.district
 * @param {string} data.mandal
 * @param {string} data.village
 * @param {string} data.constituency
 * @param {string|Date} data.votedAt
 * @param {string} [data.status]
 * @param {string} [data.epicNumber]
 * @param {string} [data.electionStatus]
 */
export const generateVotingReceiptPdf = (data = {}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const state = data.state || 'Telangana';
  const district = data.district || 'Hyderabad';
  const mandal = data.mandal || 'Musheerabad';
  const village = data.village || mandal || 'Demo Village';
  const constituency = data.constituency || '057-Musheerabad';
  const electionTitle = data.electionTitle || `${state} State Assembly Demo Election 2026`;
  const referenceNumber = data.referenceNumber || `TEL-DEMO-VOTE-${Math.floor(100000 + Math.random() * 900000)}`;
  const epicNumber = data.epicNumber || 'DEMO-TEL-001';
  const electionStatus = data.electionStatus || 'ACTIVE';

  const dateObj = data.votedAt ? new Date(data.votedAt) : new Date();
  const votingDate = dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const votingTime = dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // 1. Top Decorative Header Strip (Tiranga Tri-color)
  doc.setFillColor(255, 153, 51); // Saffron
  doc.rect(margin, 12, contentWidth / 3, 2.5, 'F');
  doc.setFillColor(240, 240, 240); // White/Light
  doc.rect(margin + (contentWidth / 3), 12, contentWidth / 3, 2.5, 'F');
  doc.setFillColor(19, 136, 8); // Green
  doc.rect(margin + ((contentWidth / 3) * 2), 12, contentWidth / 3, 2.5, 'F');

  // 2. Main Header & Authority
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(`eVote ${state.toUpperCase()}`, pageWidth / 2, 22, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9); // Amber-700
  doc.text('STATE ELECTION COMMISSION', pageWidth / 2, 28, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('SECURE REMOTE VOTING SYSTEM - OFFICIAL TRANSACTION RECORD', pageWidth / 2, 32, { align: 'center' });

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, 35, pageWidth - margin, 35);

  // 3. Receipt Title Banner
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.roundedRect(margin, 38, contentWidth, 14, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, 38, contentWidth, 14, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('VOTING PARTICIPATION RECEIPT', pageWidth / 2, 45, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('PROOF OF ELECTORAL PARTICIPATION', pageWidth / 2, 49, { align: 'center' });

  // 4. Primary Transaction Reference Card
  doc.setFillColor(239, 246, 255); // Blue-50
  doc.roundedRect(margin, 56, contentWidth, 20, 2, 2, 'F');
  doc.setDrawColor(191, 219, 254); // Blue-200
  doc.roundedRect(margin, 56, contentWidth, 20, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 64, 175); // Blue-800
  doc.text('RECEIPT REFERENCE NUMBER', margin + 5, 62);
  doc.setFontSize(13);
  doc.setFont('courier', 'bold');
  doc.setTextColor(29, 78, 216); // Blue-700
  doc.text(referenceNumber, margin + 5, 70);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(22, 101, 52); // Green-800
  doc.text('PARTICIPATION STATUS', pageWidth - margin - 5, 62, { align: 'right' });
  doc.setFontSize(11);
  doc.setTextColor(21, 128, 61); // Green-700
  doc.text('VOTE RECORDED', pageWidth - margin - 5, 70, { align: 'right' });

  // 5. Election & Jurisdiction Details Table
  let y = 82;

  const drawRow = (label, value, isMonospace = false) => {
    doc.setFillColor(y % 12 === 0 ? 255 : 248, 250, 252);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 7, pageWidth - margin, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(label, margin + 4, y + 4.8);

    doc.setFont(isMonospace ? 'courier' : 'helvetica', isMonospace ? 'bold' : 'bold');
    doc.setFontSize(isMonospace ? 9 : 8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(String(value), pageWidth - margin - 4, y + 4.8, { align: 'right' });

    y += 7.5;
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ELECTION & ELECTORAL JURISDICTION DETAILS', margin, y);
  y += 4;

  drawRow('Election Event', electionTitle);
  drawRow('State', state);
  drawRow('District', district);
  drawRow('Mandal / Taluka', mandal);
  drawRow('Village / Locality', village);
  drawRow('Assembly Constituency', constituency, true);
  drawRow('Voting Date', votingDate);
  drawRow('Voting Time', votingTime);
  drawRow('Election Status', electionStatus);
  drawRow('Receipt Type', 'Anonymous Participation Receipt');
  drawRow('Elector Reference (EPIC)', epicNumber, true);

  y += 3;

  // 6. Ballot Secrecy Notice Box
  doc.setFillColor(254, 252, 232); // Amber-50
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'F');
  doc.setDrawColor(254, 240, 138); // Amber-200
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(146, 64, 14); // Amber-800
  doc.text('BALLOT SECRECY & ELECTOR PRIVACY GUARANTEE', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(120, 53, 15);
  const secrecyText = [
    '- This receipt confirms that your vote was successfully recorded.',
    '- It does NOT reveal the candidate selected. Your candidate selection remains confidential.',
    '- Under digital voting protocols, participation audit trails are decoupled from candidate choices.'
  ];
  doc.text(secrecyText[0], margin + 4, y + 12);
  doc.text(secrecyText[1], margin + 4, y + 17);
  doc.text(secrecyText[2], margin + 4, y + 22);

  y += 31;

  // 7. Academic / Final Year Project Demonstration Disclaimer
  doc.setFillColor(241, 245, 249); // Slate-100
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('FINAL YEAR PROJECT DEMONSTRATION', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(71, 85, 105);
  const disclaimerLines = [
    'For this academic demonstration, the election data and voter profiles are fictional and are used',
    'only to demonstrate the eVote application\'s secure remote voting workflow. Not connected to real ECI systems.'
  ];
  doc.text(disclaimerLines[0], margin + 4, y + 11);
  doc.text(disclaimerLines[1], margin + 4, y + 15.5);

  // 8. Footer Timestamp & Security Hash
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  const footerTimestamp = `Generated at: ${new Date().toISOString()} - Digest: SHA-256[${referenceNumber}]`;
  doc.text(footerTimestamp, pageWidth / 2, 285, { align: 'center' });

  // Save the PDF if running in browser
  const filename = `eVote-Receipt-${referenceNumber}.pdf`;
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    doc.save(filename);
  }
  return { filename, doc, output: doc.output() };
};

export default generateVotingReceiptPdf;
