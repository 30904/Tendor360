const mongoose = require('mongoose');
const EvaluationTemplate = require('../../models/EvaluationTemplate');
const User = require('../../models/User');

const seedEvaluationTemplates = async () => {
  try {
    console.log('📋 Seeding evaluation templates...');
    
    // Get admin user to create templates
    const adminUser = await User.findOne({ roles: { $in: ['SYSTEM ADMINISTRATOR'] } });
    if (!adminUser) {
      console.log('⚠️ No admin user found, skipping evaluation template seeding');
      return;
    }

    const templateData = [
      {
        companyId: adminUser.companyId,
        name: 'Healthcare Equipment - Comprehensive',
        description: 'Comprehensive evaluation template for healthcare equipment tenders',
        category: 'HEALTHCARE',
        evaluationType: 'COMPREHENSIVE',
        criteria: [
          {
            category: 'TECHNICAL',
            name: 'Technical Specifications Compliance',
            description: 'Adherence to technical specifications and requirements',
            weight: 25,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 1
          },
          {
            category: 'TECHNICAL',
            name: 'Quality Standards',
            description: 'Compliance with quality standards (ISO, FDA, CE)',
            weight: 20,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 2
          },
          {
            category: 'FINANCIAL',
            name: 'Cost Competitiveness',
            description: 'Competitive pricing compared to market rates',
            weight: 20,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 3
          },
          {
            category: 'EXPERIENCE',
            name: 'Healthcare Industry Experience',
            description: 'Previous experience in healthcare sector',
            weight: 15,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 4
          },
          {
            category: 'CAPACITY',
            name: 'Manufacturing Capacity',
            description: 'Ability to meet delivery timelines',
            weight: 10,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 5
          },
          {
            category: 'COMPLIANCE',
            name: 'Regulatory Compliance',
            description: 'Compliance with healthcare regulations',
            weight: 10,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 6
          }
        ],
        thresholds: {
          bidThreshold: 75,
          noBidThreshold: 45,
          riskThreshold: 60
        },
        isActive: true,
        isDefault: true,
        createdBy: adminUser._id,
        tags: ['healthcare', 'equipment', 'comprehensive']
      },
      {
        companyId: adminUser.companyId,
        name: 'Pharmaceutical Services - Technical',
        description: 'Technical evaluation template for pharmaceutical services',
        category: 'HEALTHCARE',
        evaluationType: 'TECHNICAL',
        criteria: [
          {
            category: 'TECHNICAL',
            name: 'GMP Compliance',
            description: 'Good Manufacturing Practice compliance',
            weight: 30,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 1
          },
          {
            category: 'TECHNICAL',
            name: 'Quality Control Systems',
            description: 'Quality control and assurance systems',
            weight: 25,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 2
          },
          {
            category: 'EXPERIENCE',
            name: 'Pharmaceutical Experience',
            description: 'Experience in pharmaceutical manufacturing',
            weight: 20,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 3
          },
          {
            category: 'CAPACITY',
            name: 'Production Capacity',
            description: 'Manufacturing and production capacity',
            weight: 15,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 4
          },
          {
            category: 'COMPLIANCE',
            name: 'FDA/EMA Compliance',
            description: 'FDA and EMA regulatory compliance',
            weight: 10,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 5
          }
        ],
        thresholds: {
          bidThreshold: 80,
          noBidThreshold: 50,
          riskThreshold: 65
        },
        isActive: true,
        isDefault: false,
        createdBy: adminUser._id,
        tags: ['pharmaceutical', 'technical', 'manufacturing']
      },
      {
        companyId: adminUser.companyId,
        name: 'IT Services - General',
        description: 'General evaluation template for IT services',
        category: 'IT',
        evaluationType: 'COMPREHENSIVE',
        criteria: [
          {
            category: 'TECHNICAL',
            name: 'Technical Architecture',
            description: 'Technical solution architecture and design',
            weight: 25,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 1
          },
          {
            category: 'TECHNICAL',
            name: 'Security Standards',
            description: 'Information security and data protection',
            weight: 20,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 2
          },
          {
            category: 'FINANCIAL',
            name: 'Cost Proposal',
            description: 'Cost-effectiveness of the proposal',
            weight: 20,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 3
          },
          {
            category: 'EXPERIENCE',
            name: 'IT Project Experience',
            description: 'Previous experience in similar IT projects',
            weight: 15,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 4
          },
          {
            category: 'CAPACITY',
            name: 'Resource Availability',
            description: 'Availability of qualified resources',
            weight: 10,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 5
          },
          {
            category: 'RISK',
            name: 'Project Risk Management',
            description: 'Risk identification and mitigation strategies',
            weight: 10,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 6
          }
        ],
        thresholds: {
          bidThreshold: 70,
          noBidThreshold: 40,
          riskThreshold: 55
        },
        isActive: true,
        isDefault: true,
        createdBy: adminUser._id,
        tags: ['IT', 'services', 'general']
      },
      {
        companyId: adminUser.companyId,
        name: 'Construction - Preliminary',
        description: 'Preliminary evaluation template for construction projects',
        category: 'CONSTRUCTION',
        evaluationType: 'PRELIMINARY',
        criteria: [
          {
            category: 'TECHNICAL',
            name: 'Technical Approach',
            description: 'Technical approach and methodology',
            weight: 30,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 1
          },
          {
            category: 'EXPERIENCE',
            name: 'Construction Experience',
            description: 'Experience in similar construction projects',
            weight: 25,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 2
          },
          {
            category: 'CAPACITY',
            name: 'Project Management Capacity',
            description: 'Project management and execution capacity',
            weight: 20,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 3
          },
          {
            category: 'FINANCIAL',
            name: 'Financial Stability',
            description: 'Financial stability and capability',
            weight: 15,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 4
          },
          {
            category: 'COMPLIANCE',
            name: 'Safety Compliance',
            description: 'Safety standards and compliance',
            weight: 10,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 5
          }
        ],
        thresholds: {
          bidThreshold: 70,
          noBidThreshold: 40,
          riskThreshold: 60
        },
        isActive: true,
        isDefault: false,
        createdBy: adminUser._id,
        tags: ['construction', 'preliminary', 'infrastructure']
      },
      {
        companyId: adminUser.companyId,
        name: 'Financial Services - Comprehensive',
        description: 'Comprehensive evaluation template for financial services',
        category: 'FINANCIAL',
        evaluationType: 'COMPREHENSIVE',
        criteria: [
          {
            category: 'FINANCIAL',
            name: 'Financial Proposal',
            description: 'Cost and pricing proposal',
            weight: 30,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 1
          },
          {
            category: 'TECHNICAL',
            name: 'Service Delivery Model',
            description: 'Service delivery methodology and approach',
            weight: 25,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 2
          },
          {
            category: 'EXPERIENCE',
            name: 'Financial Services Experience',
            description: 'Experience in financial services sector',
            weight: 20,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 3
          },
          {
            category: 'COMPLIANCE',
            name: 'Regulatory Compliance',
            description: 'Compliance with financial regulations',
            weight: 15,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 4
          },
          {
            category: 'RISK',
            name: 'Risk Management',
            description: 'Risk management and mitigation strategies',
            weight: 10,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 5
          }
        ],
        thresholds: {
          bidThreshold: 75,
          noBidThreshold: 45,
          riskThreshold: 65
        },
        isActive: true,
        isDefault: true,
        createdBy: adminUser._id,
        tags: ['financial', 'services', 'comprehensive']
      },
      {
        companyId: adminUser.companyId,
        name: 'Education Technology - Technical',
        description: 'Technical evaluation template for education technology solutions',
        category: 'EDUCATION',
        evaluationType: 'TECHNICAL',
        criteria: [
          {
            category: 'TECHNICAL',
            name: 'Technology Platform',
            description: 'Educational technology platform and features',
            weight: 30,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 1
          },
          {
            category: 'TECHNICAL',
            name: 'User Interface Design',
            description: 'User interface and user experience design',
            weight: 20,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 2
          },
          {
            category: 'EXPERIENCE',
            name: 'Education Sector Experience',
            description: 'Experience in education technology',
            weight: 20,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 3
          },
          {
            category: 'CAPACITY',
            name: 'Support and Training',
            description: 'Support services and training capabilities',
            weight: 15,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 4
          },
          {
            category: 'COMPLIANCE',
            name: 'Data Privacy Compliance',
            description: 'Student data privacy and security compliance',
            weight: 15,
            maxScore: 10,
            scoringMethod: 'NUMERIC',
            isRequired: true,
            order: 5
          }
        ],
        thresholds: {
          bidThreshold: 75,
          noBidThreshold: 45,
          riskThreshold: 60
        },
        isActive: true,
        isDefault: false,
        createdBy: adminUser._id,
        tags: ['education', 'technology', 'technical']
      }
    ];

    // Clear existing evaluation templates
    await EvaluationTemplate.deleteMany({});
    console.log('🗑️ Cleared existing evaluation templates');

    // Create evaluation templates
    const templates = await EvaluationTemplate.insertMany(templateData);
    console.log(`✅ Created ${templates.length} evaluation templates`);

    // Update usage statistics for some templates
    const popularTemplates = templates.slice(0, 3);
    for (const template of popularTemplates) {
      const randomUsageCount = Math.floor(Math.random() * 50) + 10;
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const lastUsed = new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000);
      
      await EvaluationTemplate.findByIdAndUpdate(template._id, {
        usageCount: randomUsageCount,
        lastUsed: lastUsed
      });
    }

    console.log('✅ Updated evaluation template usage data');

  } catch (error) {
    console.error('❌ Error seeding evaluation templates:', error);
    throw error;
  }
};

module.exports = seedEvaluationTemplates;
