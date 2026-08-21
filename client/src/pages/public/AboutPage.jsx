import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900">About eVote Telangana</h1>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-gray-700 leading-relaxed">
        <p>
          The Remote Voting System (eVote Telangana) is an initiative by the Election Commission of Telangana designed to provide a secure, transparent, and efficient digital voting mechanism for citizens.
        </p>
        <p>
          By utilizing state-of-the-art encryption, identity verification against master databases, and automated audit trails, the system ensures that every vote counts, is tamper-proof, and stays confidential.
        </p>
        <h2 className="text-xl font-bold text-gray-900 pt-4">Core Principles</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Integrity:</strong> Unalterable ballot storage using robust cryptographic frameworks.</li>
          <li><strong>Accessibility:</strong> Empowering citizens to vote from any remote location seamlessly.</li>
          <li><strong>Privacy:</strong> Strict decoupling between voter identities and their cast ballots.</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
