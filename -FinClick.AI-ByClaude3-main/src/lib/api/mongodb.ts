import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || 'finclick-ai';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Collection names
export const COLLECTIONS = {
  users: 'users',
  companies: 'companies',
  financialData: 'financial_data',
  analyses: 'analyses',
  industryBenchmarks: 'industry_benchmarks',
  reports: 'reports',
  auditLogs: 'audit_logs'
};

// User operations
export async function createUser(userData: any) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.users);
  
  const user = {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await collection.insertOne(user);
  return { ...user, _id: result.insertedId };
}

export async function getUserById(userId: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.users);
  
  return await collection.findOne({ _id: new ObjectId(userId) });
}

export async function updateUser(userId: string, updates: any) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.users);
  
  const result = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { 
      $set: {
        ...updates,
        updatedAt: new Date()
      }
    }
  );
  
  return result.modifiedCount > 0;
}

// Company operations
export async function createCompany(companyData: any) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.companies);
  
  const company = {
    ...companyData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await collection.insertOne(company);
  return { ...company, _id: result.insertedId };
}

export async function getCompanyById(companyId: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.companies);
  
  return await collection.findOne({ _id: new ObjectId(companyId) });
}

export async function getUserCompanies(userId: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.companies);
  
  return await collection.find({ userId }).toArray();
}

// Financial data operations
export async function saveFinancialData(financialData: any) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.financialData);
  
  const data = {
    ...financialData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await collection.insertOne(data);
  return { ...data, _id: result.insertedId };
}

export async function getFinancialData(companyId: string, years?: number[]) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.financialData);
  
  const query: any = { companyId };
  if (years && years.length > 0) {
    query.year = { $in: years };
  }
  
  return await collection.find(query).sort({ year: -1 }).toArray();
}

// Analysis operations
export async function createAnalysis(analysisData: any) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.analyses);
  
  const analysis = {
    ...analysisData,
    status: 'processing',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await collection.insertOne(analysis);
  return { ...analysis, _id: result.insertedId };
}

export async function updateAnalysis(analysisId: string, updates: any) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.analyses);
  
  const result = await collection.updateOne(
    { _id: new ObjectId(analysisId) },
    { 
      $set: {
        ...updates,
        updatedAt: new Date()
      }
    }
  );
  
  return result.modifiedCount > 0;
}

export async function getAnalysis(analysisId: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.analyses);
  
  return await collection.findOne({ _id: new ObjectId(analysisId) });
}

export async function getUserAnalyses(userId: string, limit: number = 10) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.analyses);
  
  return await collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

// Industry benchmarks operations
export async function saveIndustryBenchmark(benchmarkData: any) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.industryBenchmarks);
  
  const benchmark = {
    ...benchmarkData,
    year: new Date().getFullYear(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Upsert to update existing or create new
  const result = await collection.replaceOne(
    {
      sector: benchmark.sector,
      activity: benchmark.activity,
      region: benchmark.region,
      metric: benchmark.metric,
      year: benchmark.year
    },
    benchmark,
    { upsert: true }
  );
  
  return benchmark;
}

export async function getIndustryBenchmarks(
  sector: string,
  activity: string,
  region: string,
  metrics?: string[]
) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.industryBenchmarks);
  
  const query: any = { sector, activity, region };
  if (metrics && metrics.length > 0) {
    query.metric = { $in: metrics };
  }
  
  return await collection.find(query).toArray();
}

// Report operations
export async function saveReport(reportData: any) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.reports);
  
  const report = {
    ...reportData,
    createdAt: new Date()
  };
  
  const result = await collection.insertOne(report);
  return { ...report, _id: result.insertedId };
}

export async function getReport(reportId: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.reports);
  
  return await collection.findOne({ _id: new ObjectId(reportId) });
}

// Audit log operations
export async function createAuditLog(logData: any) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.auditLogs);
  
  const log = {
    ...logData,
    timestamp: new Date()
  };
  
  await collection.insertOne(log);
}

// Aggregation operations
export async function getAnalysisStatistics(userId: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.analyses);
  
  const pipeline = [
    { $match: { userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ];
  
  const results = await collection.aggregate(pipeline).toArray();
  
  return results.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {} as Record<string, number>);
}

export async function getTopAnalyzedSectors(limit: number = 10) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.companies);
  
  const pipeline = [
    {
      $group: {
        _id: '$sector',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ];
  
  return await collection.aggregate(pipeline).toArray();
}

// Search operations
export async function searchCompanies(searchTerm: string, userId?: string) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.companies);
  
  const query: any = {
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { nameEn: { $regex: searchTerm, $options: 'i' } }
    ]
  };
  
  if (userId) {
    query.userId = userId;
  }
  
  return await collection.find(query).limit(20).toArray();
}

// Cleanup operations
export async function deleteOldAnalyses(daysToKeep: number = 90) {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTIONS.analyses);
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  const result = await collection.deleteMany({
    createdAt: { $lt: cutoffDate },
    status: { $in: ['completed', 'failed'] }
  });
  
  return result.deletedCount;
}

// Transaction operations
export async function runTransaction(operations: () => Promise<any>) {
  const { client } = await connectToDatabase();
  const session = client.startSession();
  
  try {
    await session.withTransaction(async () => {
      await operations();
    });
  } finally {
    await session.endSession();
  }
}

// Index creation
export async function createIndexes() {
  const { db } = await connectToDatabase();
  
  // Users indexes
  await db.collection(COLLECTIONS.users).createIndex({ email: 1 }, { unique: true });
  
  // Companies indexes
  await db.collection(COLLECTIONS.companies).createIndex({ userId: 1 });
  await db.collection(COLLECTIONS.companies).createIndex({ sector: 1, activity: 1 });
  
  // Financial data indexes
  await db.collection(COLLECTIONS.financialData).createIndex({ companyId: 1, year: -1 });
  
  // Analyses indexes
  await db.collection(COLLECTIONS.analyses).createIndex({ userId: 1, createdAt: -1 });
  await db.collection(COLLECTIONS.analyses).createIndex({ companyId: 1 });
  await db.collection(COLLECTIONS.analyses).createIndex({ status: 1 });
  
  // Industry benchmarks indexes
  await db.collection(COLLECTIONS.industryBenchmarks).createIndex(
    { sector: 1, activity: 1, region: 1, metric: 1, year: 1 },
    { unique: true }
  );
  
  // Audit logs indexes
  await db.collection(COLLECTIONS.auditLogs).createIndex({ userId: 1, timestamp: -1 });
  await db.collection(COLLECTIONS.auditLogs).createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days
}
