import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urjasetu';

async function reportStaleTowns() {
  console.log('--- UrjaSetu Stale Town Audit Script ---');
  console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);

  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    if (!db) throw new Error('Database handle is undefined');

    const townsColl = db.collection('towns');
    const sitesColl = db.collection('sites');
    const proposalsColl = db.collection('proposals');

    const nonPuneTowns = await townsColl.find({ name: { $ne: 'Pune' } }).toArray();
    console.log(`\n1. Non-Pune Town Records (${nonPuneTowns.length}):`);
    nonPuneTowns.forEach((t) => console.log(`   - ID: ${t._id}, Name: ${t.name}, State: ${t.state}`));

    const nonPuneSites = await sitesColl.find({
      $and: [
        { city: { $ne: 'Pune' } },
        { cityName: { $ne: 'Pune' } },
        { cityName: { $ne: 'Pune Municipal Corporation' } },
      ],
    }).toArray();
    console.log(`\n2. Non-Pune Candidate Site Records (${nonPuneSites.length}):`);
    nonPuneSites.forEach((s) => console.log(`   - ID: ${s.id || s._id}, Code: ${s.code}, Name: ${s.name}, City: ${s.city || s.cityName}`));

    const nonPuneProposals = await proposalsColl.find({
      $and: [
        { cityName: { $ne: 'Pune' } },
        { cityName: { $ne: 'Pune Municipal Corporation' } },
      ],
    }).toArray();
    console.log(`\n3. Non-Pune Proposal Records (${nonPuneProposals.length}):`);
    nonPuneProposals.forEach((p) => console.log(`   - ID: ${p.id || p._id}, Title: ${p.title}, City: ${p.cityName}`));

    console.log('\n--- Audit Complete (No records were deleted or modified) ---\n');
  } catch (err) {
    console.error('Error conducting stale town audit:', (err as Error).message);
  } finally {
    await mongoose.disconnect();
  }
}

reportStaleTowns();
