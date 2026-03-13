/**
 * 冷链物流潜在客户数据导入脚本
 *
 * 使用方法:
 * node scripts/import-leads.js
 *
 * 数据来源：prospecting/leads_summary_for_import.md
 * 导入目标：~/Library/Application Support/solo-crm/crm.db (macOS)
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const os = require('os');

// 获取数据库路径 (与 solo-crm 应用一致)
function getDatabasePath() {
  const homeDir = os.homedir();

  // macOS
  if (process.platform === 'darwin') {
    return path.join(homeDir, 'Library', 'Application Support', 'solo-crm', 'crm.db');
  }

  // Windows
  if (process.platform === 'win32') {
    return path.join(process.env.APPDATA, 'solo-crm', 'crm.db');
  }

  // Linux
  return path.join(homeDir, '.config', 'solo-crm', 'crm.db');
}

// P0 级公司数据
const p0Companies = [
  {
    name: "双汇发展 (万洲国际)",
    industry: "肉类进口/加工",
    phone: "",
    website: "",
    address: "河南省漯河市",
    notes: "A 股上市公司，肉类加工龙头，年冷链支出 800-1500 万 RMB",
    tier: "P0",
    estimated_spend: 12000000
  },
  {
    name: "蜀海 (北京) 供应链管理有限责任公司",
    industry: "餐饮供应链",
    phone: "",
    website: "",
    address: "北京市",
    notes: "海底捞旗下供应链公司，年冷链支出 600-1000 万 RMB",
    tier: "P0",
    estimated_spend: 8000000
  },
  {
    name: "深圳百果园实业发展有限公司",
    industry: "水果连锁",
    phone: "",
    website: "",
    address: "广东省深圳市",
    notes: "全国最大水果连锁，5000+ 门店，年冷链支出 400-700 万 RMB",
    tier: "P0",
    estimated_spend: 5500000
  },
  {
    name: "广州钱大妈生鲜超市连锁有限公司",
    industry: "社区生鲜",
    phone: "",
    website: "",
    address: "广东省广州市",
    notes: "社区生鲜龙头，3000+ 门店，年冷链支出 400-700 万 RMB",
    tier: "P0",
    estimated_spend: 5500000
  },
  {
    name: "上海水产集团有限公司",
    industry: "海鲜进口",
    phone: "",
    website: "",
    address: "上海市",
    notes: "国企背景，海鲜进口龙头，年冷链支出 600-1000 万 RMB",
    tier: "P0",
    estimated_spend: 8000000
  },
  {
    name: "中粮冷冻食品有限公司",
    industry: "食品进出口",
    phone: "",
    website: "",
    address: "北京市",
    notes: "央企背景，年冷链支出 800-1500 万 RMB",
    tier: "P0",
    estimated_spend: 11000000
  },
  {
    name: "百济神州有限公司",
    industry: "创新药",
    phone: "",
    website: "",
    address: "北京市",
    notes: "科创板/港股/美股三地上市，年冷链支出 600-1000 万 RMB",
    tier: "P0",
    estimated_spend: 8000000
  },
  {
    name: "药明康德股份有限公司",
    industry: "CRO/CDMO",
    phone: "",
    website: "",
    address: "上海市",
    notes: "CRO 行业龙头，年冷链支出 800-1500 万 RMB",
    tier: "P0",
    estimated_spend: 11000000
  },
  {
    name: "安井食品集团股份有限公司",
    industry: "火锅食材",
    phone: "",
    website: "",
    address: "福建省厦门市",
    notes: "A 股上市公司，火锅食材龙头，年冷链支出 500-900 万 RMB",
    tier: "P0",
    estimated_spend: 7000000
  },
  {
    name: "郑州三全食品股份有限公司",
    industry: "速冻食品",
    phone: "",
    website: "",
    address: "河南省郑州市",
    notes: "上市公司，速冻食品龙头，年冷链支出 400-700 万 RMB",
    tier: "P0",
    estimated_spend: 5500000
  },
  {
    name: "盒马鲜生",
    industry: "生鲜电商",
    phone: "",
    website: "",
    address: "上海市",
    notes: "阿里巴巴旗下，年冷链支出 400-600 万 RMB",
    tier: "P0",
    estimated_spend: 5000000
  },
  {
    name: "叮咚买菜",
    industry: "生鲜电商",
    phone: "",
    website: "",
    address: "上海市",
    notes: "前置仓模式，年冷链支出 500-800 万 RMB",
    tier: "P0",
    estimated_spend: 6500000
  },
  {
    name: "呷哺呷哺餐饮管理有限公司",
    industry: "火锅连锁",
    phone: "",
    website: "",
    address: "北京市",
    notes: "A 股上市公司，800+ 门店，年冷链支出 400-700 万 RMB",
    tier: "P0",
    estimated_spend: 5500000
  },
  {
    name: "光明乳业股份有限公司",
    industry: "乳制品",
    phone: "",
    website: "",
    address: "上海市",
    notes: "上市公司，乳制品龙头，年冷链支出 600-1000 万 RMB",
    tier: "P0",
    estimated_spend: 8000000
  },
  {
    name: "华莱士食品股份有限公司",
    industry: "西式快餐",
    phone: "",
    website: "",
    address: "福建省福州市",
    notes: "20000+ 门店，年冷链支出 1000-2000 万 RMB",
    tier: "P0",
    estimated_spend: 15000000
  }
];

// P1 级公司数据
const p1Companies = [
  {
    name: "郑州思念食品有限公司",
    industry: "速冻食品",
    notes: "速冻水饺、汤圆，年冷链支出 350-600 万 RMB",
    tier: "P1",
    estimated_spend: 4500000
  },
  {
    name: "广州酒家集团股份有限公司",
    industry: "速冻食品",
    notes: "广式点心，年冷链支出 200-400 万 RMB",
    tier: "P1",
    estimated_spend: 3000000
  },
  {
    name: "恒天然商贸 (上海) 有限公司",
    industry: "乳制品进口",
    notes: "新西兰乳业巨头，年冷链支出 500-800 万 RMB",
    tier: "P1",
    estimated_spend: 6500000
  },
  {
    name: "达能 (中国) 食品饮料有限公司",
    industry: "乳制品进口",
    notes: "婴幼儿奶粉，年冷链支出 400-700 万 RMB",
    tier: "P1",
    estimated_spend: 5500000
  },
  {
    name: "上海梅林正广和股份有限公司",
    industry: "肉类进口",
    notes: "上市公司，年冷链支出 400-700 万 RMB",
    tier: "P1",
    estimated_spend: 5500000
  },
  {
    name: "山东新希望六和集团有限公司",
    industry: "肉类进口/加工",
    notes: "年冷链支出 500-800 万 RMB",
    tier: "P1",
    estimated_spend: 6500000
  },
  {
    name: "京东物流冷链",
    industry: "生鲜冷链物流",
    notes: "全国冷链网络，年冷链支出 1000 万 + RMB",
    tier: "P1",
    estimated_spend: 12000000
  },
  {
    name: "顺丰冷运",
    industry: "物流平台",
    notes: "冷链干线、城配，年冷链支出 1000 万 + RMB",
    tier: "P1",
    estimated_spend: 12000000
  },
  {
    name: "信达生物制药 (苏州) 有限公司",
    industry: "创新药",
    notes: "单抗药物，年冷链支出 500-800 万 RMB",
    tier: "P1",
    estimated_spend: 6500000
  },
  {
    name: "君实生物制药有限公司",
    industry: "创新药",
    notes: "新冠药物、抗体，年冷链支出 400-700 万 RMB",
    tier: "P1",
    estimated_spend: 5500000
  },
  {
    name: "复宏汉霖生物制药有限公司",
    industry: "创新药",
    notes: "生物类似药，年冷链支出 350-600 万 RMB",
    tier: "P1",
    estimated_spend: 4500000
  },
  {
    name: "康龙化成 (北京) 新药技术股份有限公司",
    industry: "CRO",
    notes: "年冷链支出 400-700 万 RMB",
    tier: "P1",
    estimated_spend: 5500000
  },
  {
    name: "朴朴超市",
    industry: "生鲜电商",
    notes: "30 分钟达，年冷链支出 300-500 万 RMB",
    tier: "P1",
    estimated_spend: 4000000
  },
  {
    name: "鲜生活冷链",
    industry: "生鲜冷链物流",
    notes: "新希望旗下，年冷链支出 500-800 万 RMB",
    tier: "P1",
    estimated_spend: 6500000
  },
  {
    name: "小龙坎餐饮管理有限公司",
    industry: "火锅连锁",
    notes: "600+ 门店，年冷链支出 250-450 万 RMB",
    tier: "P1",
    estimated_spend: 3500000
  },
  {
    name: "大龙燚餐饮管理有限公司",
    industry: "火锅连锁",
    notes: "400+ 门店，年冷链支出 200-350 万 RMB",
    tier: "P1",
    estimated_spend: 2750000
  },
  {
    name: "蜀大侠餐饮管理有限公司",
    industry: "火锅连锁",
    notes: "500+ 门店，年冷链支出 200-400 万 RMB",
    tier: "P1",
    estimated_spend: 3000000
  },
  {
    name: "汉堡王 (中国) 有限公司",
    industry: "西式快餐",
    notes: "1500+ 门店，年冷链支出 500-800 万 RMB",
    tier: "P1",
    estimated_spend: 6500000
  },
  {
    name: "Ole' 精品超市",
    industry: "高端超市",
    notes: "华润万家旗下，100+ 门店，年冷链支出 150-300 万 RMB",
    tier: "P1",
    estimated_spend: 2250000
  },
  {
    name: "永辉超市股份有限公司",
    industry: "超市连锁",
    notes: "上市公司，年冷链支出 200-300 万 RMB",
    tier: "P1",
    estimated_spend: 2500000
  }
];

// 初始化数据库 (创建表和迁移)
function initializeDatabase(db) {
  // 创建 migrations 表
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 检查是否已运行初始迁移
  const checkMigration = db.prepare('SELECT name FROM _migrations WHERE name = ?');
  const hasInitialSchema = checkMigration.get('001_initial_schema');

  if (!hasInitialSchema) {
    console.log('📦 初始化数据库架构...');

    // 创建所有表
    db.exec(`
      -- Contacts
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        company_id INTEGER,
        company_name TEXT,
        tags TEXT DEFAULT '',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Companies
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        website TEXT,
        industry TEXT,
        address TEXT,
        phone TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Deals
      CREATE TABLE IF NOT EXISTS deals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        contact_id INTEGER,
        company_id INTEGER,
        company_name TEXT,
        stage TEXT DEFAULT 'lead',
        value REAL DEFAULT 0,
        probability INTEGER DEFAULT 0,
        close_date DATE,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Tasks
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        due_date DATE,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'pending',
        contact_id INTEGER,
        deal_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Activities
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        contact_id INTEGER,
        deal_id INTEGER,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Indexes
      CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name);
      CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
      CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
      CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
      CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
      CREATE INDEX IF NOT EXISTS idx_activities_contact ON activities(contact_id);
    `);

    // 记录迁移
    db.prepare('INSERT INTO _migrations (name) VALUES (?)').run('001_initial_schema');
    console.log('✓ 数据库架构创建完成');
  }
}

// 导入公司数据
function importCompanies(db, companies) {
  const checkStmt = db.prepare('SELECT id FROM companies WHERE name = ?');
  const insertStmt = db.prepare(`
    INSERT INTO companies (name, industry, phone, website, address, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
  const updateStmt = db.prepare(`
    UPDATE companies
    SET industry = ?, phone = ?, website = ?, address = ?, notes = ?, updated_at = datetime('now')
    WHERE name = ?
  `);

  let inserted = 0;
  let updated = 0;

  for (const company of companies) {
    const fullNotes = `[${company.tier}] 预估年冷链支出：${(company.estimated_spend / 10000).toFixed(0)} 万 RMB\n${company.notes || ''}`;

    try {
      const existing = checkStmt.get(company.name);

      if (existing) {
        updateStmt.run(
          company.industry || '',
          company.phone || '',
          company.website || '',
          company.address || '',
          fullNotes,
          company.name
        );
        updated++;
      } else {
        insertStmt.run(
          company.name,
          company.industry || '',
          company.phone || '',
          company.website || '',
          company.address || '',
          fullNotes
        );
        inserted++;
      }
    } catch (error) {
      console.error(`✗ 处理失败 ${company.name}: ${error.message}`);
    }
  }

  return { inserted, updated };
}

// 创建销售机会 (Deals)
function createDeals(db, tier) {
  const companies = db.prepare(`SELECT id, name FROM companies WHERE notes LIKE ?`).all(`[${tier}]%`);

  const checkStmt = db.prepare('SELECT id FROM deals WHERE company_id = ? AND title LIKE ?');
  const insertDeal = db.prepare(`
    INSERT INTO deals (title, company_id, company_name, stage, value, probability, close_date, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  let created = 0;

  for (const company of companies) {
    const stage = tier === 'P0' ? 'qualification' : 'prospecting';
    const value = tier === 'P0' ? 800000 : 400000;
    const probability = tier === 'P0' ? 60 : 30;
    const closeDate = tier === 'P0' ? '2026-04-30' : '2026-06-30';
    const title = `${company.name} - 冷链物流合作`;

    try {
      const existing = checkStmt.get(company.id, '%冷链物流合作%');

      if (!existing) {
        insertDeal.run(
          title,
          company.id,
          company.name,
          stage,
          value,
          probability,
          closeDate,
          `从 ${tier} 级潜在客户导入`
        );
        created++;
      }
    } catch (error) {
      console.error(`✗ 创建 Deal 失败 ${company.name}: ${error.message}`);
    }
  }

  return created;
}

// 主函数
function main() {
  console.log('🚀 开始导入冷链物流潜在客户数据...\n');

  const dbPath = getDatabasePath();
  console.log(`📁 数据库路径：${dbPath}\n`);

  // 确保目录存在
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`✓ 创建目录：${dbDir}`);
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  try {
    // 初始化数据库
    initializeDatabase(db);

    // 导入 P0 级公司
    console.log('\n📋 导入 P0 级公司 (15 家)...');
    const p0Result = importCompanies(db, p0Companies);
    console.log(`   ✓ P0 级：导入 ${p0Result.inserted} 家，更新 ${p0Result.updated} 家`);

    // 导入 P1 级公司
    console.log('\n📋 导入 P1 级公司 (20 家)...');
    const p1Result = importCompanies(db, p1Companies);
    console.log(`   ✓ P1 级：导入 ${p1Result.inserted} 家，更新 ${p1Result.updated} 家`);

    // 创建销售机会
    console.log('\n💼 创建销售机会 (Deals)...');
    const p0Deals = createDeals(db, 'P0');
    const p1Deals = createDeals(db, 'P1');
    console.log(`   ✓ P0 级 Deal: ${p0Deals} 个`);
    console.log(`   ✓ P1 级 Deal: ${p1Deals} 个`);

    // 统计信息
    const totalCompanies = db.prepare('SELECT COUNT(*) as count FROM companies').get().count;
    const totalDeals = db.prepare('SELECT COUNT(*) as count FROM deals').get().count;

    console.log('\n📊 导入完成统计:');
    console.log(`   总公司在库：${totalCompanies} 家`);
    console.log(`   总销售机会：${totalDeals} 个`);
    console.log('\n✅ 导入完成！\n');

  } catch (error) {
    console.error('❌ 导入过程出错:', error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

main();
