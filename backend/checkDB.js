const mongoose = require('mongoose');
const Evaluation = require('./src/models/Evaluation');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const evals = await Evaluation.find({});
  console.log("TOTAL EVALUATIONS:", evals.length);
  evals.forEach(e => {
    console.log(`- ${e.evaluationName} | Status: ${e.status} | Evaluator: ${e.evaluator} | Company: ${e.companyId}`);
  });
  process.exit();
}

check();
