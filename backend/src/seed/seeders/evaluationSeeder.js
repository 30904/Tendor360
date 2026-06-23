const Evaluation = require('../../models/Evaluation');
const Tender = require('../../models/Tender');
const User = require('../../models/User');
const Company = require('../../models/Company');

const seedEvaluations = async () => {
  try {
    // Get all companies and create evaluations for each
    const companies = await Company.find({ isDeleted: false });
    if (companies.length === 0) {
      console.log('ΓÜá∩╕Å No companies found, skipping evaluation seeding');
      return;
    }

    console.log(`Γ£à Creating evaluations for ${companies.length} companies...`);

    for (const company of companies) {
      console.log(`\nΓ£à Creating evaluations for ${company.name}...`);

      // Get tenders and reviewers for this company
      const tenders = await Tender.find({ companyId: company._id }).limit(2);
      const reviewer = await User.findOne({
        companyId: company._id,
        roles: 'REVIEWER'
      });

      if (tenders.length === 0 || !reviewer) {
        console.log(`ΓÜá∩╕Å No tenders or reviewer found for ${company.name}, skipping...`);
        continue;
      }

      // Create evaluations for each tender
      for (const tender of tenders) {
        const evaluations = [
          {
            companyId: company._id,
            tenderId: tender._id,
            evaluationName: `${company.code} - Initial Evaluation - ${tender.title}`,
            evaluationType: 'COMPREHENSIVE',
            criteria: [
              {
                category: 'TECHNICAL',
                name: 'System Architecture',
                description: 'Technical architecture and design quality',
                weight: 25,
                score: 8,
                maxScore: 10,
                scoringMethod: 'NUMERIC',
                notes: 'Well-designed architecture with good scalability',
                evidence: 'Technical documentation provided',
                evaluator: reviewer._id,
                evaluatedAt: new Date()
              },
              {
                category: 'FINANCIAL',
                name: 'Cost Competitiveness',
                description: 'Cost effectiveness and value for money',
                weight: 20,
                score: 7,
                maxScore: 10,
                scoringMethod: 'NUMERIC',
                notes: 'Competitive pricing within market range',
                evidence: 'Detailed cost breakdown provided',
                evaluator: reviewer._id,
                evaluatedAt: new Date()
              },
              {
                category: 'EXPERIENCE',
                name: 'Industry Experience',
                description: 'Previous experience in relevant sector',
                weight: 20,
                score: 9,
                maxScore: 10,
                scoringMethod: 'NUMERIC',
                notes: 'Extensive experience in similar implementations',
                evidence: 'Case studies and references provided',
                evaluator: reviewer._id,
                evaluatedAt: new Date()
              },
              {
                category: 'CAPACITY',
                name: 'Implementation Capacity',
                description: 'Ability to deliver on time and within scope',
                weight: 15,
                score: 8,
                maxScore: 10,
                scoringMethod: 'NUMERIC',
                notes: 'Strong project management capabilities',
                evidence: 'Project plan and team structure provided',
                evaluator: reviewer._id,
                evaluatedAt: new Date()
              },
              {
                category: 'COMPLIANCE',
                name: 'Regulatory Compliance',
                description: 'Compliance with relevant regulations',
                weight: 15,
                score: 8,
                maxScore: 10,
                scoringMethod: 'NUMERIC',
                notes: 'Good understanding of compliance requirements',
                evidence: 'Compliance certificates and documentation',
                evaluator: reviewer._id,
                evaluatedAt: new Date()
              },
              {
                category: 'RISK',
                name: 'Risk Assessment',
                description: 'Risk mitigation and management approach',
                weight: 5,
                score: 7,
                maxScore: 10,
                scoringMethod: 'NUMERIC',
                notes: 'Adequate risk management plan in place',
                evidence: 'Risk assessment document provided',
                evaluator: reviewer._id,
                evaluatedAt: new Date()
              }
            ],
            totalScore: 47,
            weightedScore: 78.5,
            decision: 'BID',
            decisionReason: 'Strong technical capabilities with good financial standing. Recommended for shortlisting.',
            confidenceLevel: 88,
            riskLevel: 'LOW',
            priority: 'HIGH',
            status: 'APPROVED',
            notes: 'Comprehensive evaluation completed. Strong candidate for shortlisting.',
            recommendations: ['Shortlist for next round', 'Request additional financial documents', 'Schedule technical presentation'],
            evaluator: reviewer._id,
            approvedAt: new Date()
          }
        ];

        for (const evaluationItem of evaluations) {
          const existingEval = await Evaluation.findOne({
            companyId: company._id,
            tenderId: evaluationItem.tenderId,
            evaluator: evaluationItem.evaluator
          });
          if (!existingEval) {
            await Evaluation.create(evaluationItem);
            console.log(`Γ£à Created evaluation for tender ${tender.title}`);
          } else {
            console.log(`Γä╣∩╕Å Evaluation already exists for tender ${tender.title}`);
          }
        }
      }

      console.log(`Γ£à Evaluations seeded successfully for ${company.name}`);
      console.log('---');
    }

    console.log('Γ£à All evaluations seeded successfully across all companies');
  } catch (error) {
    console.error('Γ¥î Error seeding evaluations:', error);
    throw error;
  }
};

module.exports = seedEvaluations;
