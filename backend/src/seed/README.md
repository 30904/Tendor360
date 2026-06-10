# Tender360 Database Seeding System

This directory contains comprehensive seed scripts for populating the Tender360 database with realistic test data.

## 📁 Structure

```
seed/
├── index.js                    # Main seeding orchestrator
├── runIndividualSeeders.js     # Individual seeder runner
├── supportSeed.js             # Support system seeding
├── README.md                  # This file
└── seeders/
    ├── roleSeeder.js          # User roles and permissions
    ├── userSeeder.js          # User accounts
    ├── tenderSeeder.js        # Tender records
    ├── documentSeeder.js      # Document records
    ├── evaluationSeeder.js    # Evaluation records
    ├── pricingSeeder.js       # Pricing records
    ├── calendarSeeder.js      # Calendar events
    ├── contractSeeder.js      # Contract records
    ├── reportSeeder.js        # Report templates
    ├── settingSeeder.js       # System settings
    ├── alertSeeder.js         # User alerts
    ├── savedSearchSeeder.js   # Saved search criteria
    └── evaluationTemplateSeeder.js # Evaluation templates
```

## 🚀 Quick Start

### Run All Seeders
```bash
cd backend
npm run seed:dev
```

### Run Individual Seeders
```bash
cd backend/src/seed
node runIndividualSeeders.js <seeder-name>
```

### Run Multiple Seeders
```bash
cd backend/src/seed
node runIndividualSeeders.js tenders,documents,evaluations
```

## 📋 Available Seeders

| Seeder | Description | Dependencies |
|--------|-------------|--------------|
| `roles` | User roles and permissions | None |
| `users` | User accounts | roles |
| `tenders` | Tender records | users |
| `documents` | Document records | users, tenders |
| `evaluations` | Evaluation records | users, tenders |
| `pricing` | Pricing records | users, tenders |
| `calendar` | Calendar events | users, tenders |
| `contracts` | Contract records | users, tenders |
| `reports` | Report templates | users |
| `settings` | System settings | None |
| `alerts` | User alerts | users |
| `saved-searches` | Saved search criteria | users |
| `evaluation-templates` | Evaluation templates | users |
| `support` | Support tickets and FAQs | users |

## 🔧 Usage Examples

### Seed Everything
```bash
npm run seed:dev
```

### Seed Only Tenders
```bash
node runIndividualSeeders.js tenders
```

### Seed User-Related Data
```bash
node runIndividualSeeders.js users,tenders,documents,evaluations
```

### Seed Support System
```bash
node runIndividualSeeders.js support
```

### Get Help
```bash
node runIndividualSeeders.js --help
```

## 📊 Data Generated

### Users (5 users)
- **Admin**: admin@tender360.com / Admin@123
- **Manager**: manager@tender360.com / Manager@123
- **Reviewer**: reviewer@tender360.com / Reviewer@123
- **Pricing**: pricing@tender360.com / Pricing@123
- **Guest**: guest@tender360.com / Guest@123

### Tenders (20+ tenders)
- Various therapeutic areas (Diabetes, Oncology, Cardiovascular, etc.)
- Different tender types (Hospital, Government RFP, Private, etc.)
- Realistic AI match scores (60-95%)
- Multiple pipeline stages
- Various priority levels and deadlines

### Documents (15+ documents)
- Different document types (TENDER_DOCUMENT, CONTRACT, SPECIFICATION, etc.)
- AI extraction results with realistic confidence scores
- Version control and metadata
- Comments and collaboration features

### Evaluations (10+ evaluations)
- Comprehensive evaluation criteria
- Technical, financial, and experience scoring
- Different evaluation types (PRELIMINARY, TECHNICAL, COMPREHENSIVE)
- Realistic decision outcomes

### Pricing (8+ pricing records)
- Line-item pricing with quantities and units
- Cost and margin calculations
- Different currencies and win probabilities

### Calendar Events (12+ events)
- Deadlines, milestones, meetings, and reminders
- Different priority levels and statuses
- Attendee management and reminders
- Recurring events

### Contracts (5+ contracts)
- Post-award contract management
- Milestones and deliverables tracking
- Payment terms and performance metrics
- Risk management

### Reports (6+ report templates)
- Performance, analytics, and financial reports
- Different formats (PDF, Excel, CSV)
- Scheduled and manual reports
- Chart configurations

### Settings (20+ system settings)
- General, security, UI, and notification settings
- Different data types and validation rules
- Categorized and ordered settings

### Alerts (8+ user alerts)
- New tender notifications
- Deadline reminders
- Status change alerts
- Custom search alerts
- Different frequencies and channels

### Saved Searches (10+ saved searches)
- High-value tender searches
- Therapeutic area-specific searches
- Urgent deadline searches
- Public and private searches
- Shared searches with permissions

### Evaluation Templates (6+ templates)
- Healthcare equipment comprehensive template
- Pharmaceutical services technical template
- IT services general template
- Construction preliminary template
- Financial services comprehensive template
- Education technology technical template

### Support System
- Support tickets with different categories and priorities
- FAQ entries with categories and tags
- Realistic ticket statuses and assignments
- Message threads and attachments

## 🔄 Data Relationships

The seeders create realistic relationships between entities:

- **Users** own and are assigned to **Tenders**
- **Tenders** have **Documents**, **Evaluations**, **Pricing**, and **Calendar Events**
- **Evaluations** reference **Tenders** and are created by **Users**
- **Contracts** are linked to **Tenders**
- **Alerts** and **Saved Searches** belong to **Users**
- **Evaluation Templates** are created by admin **Users**

## 🛠️ Customization

### Adding New Seeders
1. Create a new seeder file in `seeders/` directory
2. Follow the existing pattern with proper error handling
3. Add the seeder to `index.js` imports and execution order
4. Add to `runIndividualSeeders.js` seeders object

### Modifying Existing Data
- Edit the respective seeder files
- Adjust quantities, values, and relationships
- Ensure data consistency across related entities

### Environment-Specific Data
- Use environment variables for different data sets
- Create separate seeder functions for different environments
- Use conditional logic based on `NODE_ENV`

## 🚨 Important Notes

### Dependencies
- Always run seeders in the correct order due to foreign key relationships
- Users and Roles must be seeded before other entities
- Tenders should be seeded before related entities (Documents, Evaluations, etc.)

### Data Cleanup
- Seeders clear existing data before inserting new data
- Use `clearAllCollections()` function with caution in production
- Consider using upsert operations for production environments

### Performance
- Large datasets may take time to seed
- Consider batching operations for better performance
- Monitor memory usage during seeding

## 🔍 Troubleshooting

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running and accessible
2. **Missing Dependencies**: Run seeders in the correct order
3. **Validation Errors**: Check model schemas and required fields
4. **Memory Issues**: Reduce batch sizes for large datasets

### Debug Mode
- Add console.log statements in seeders for debugging
- Use MongoDB Compass to verify data insertion
- Check database indexes and constraints

## 📈 Monitoring

### Seeding Progress
- Each seeder provides progress updates
- Check console output for completion status
- Verify record counts match expectations

### Data Quality
- Validate relationships between entities
- Check for duplicate or missing data
- Ensure realistic data distributions

## 🔐 Security

### Production Considerations
- Never run seeders in production without careful review
- Use environment-specific data sets
- Implement proper access controls
- Consider data anonymization for sensitive information

### Default Credentials
- Change default passwords in production
- Use strong, unique passwords
- Implement proper user management

---

**Note**: This seeding system is designed for development and testing purposes. Always review and customize data for production environments.
