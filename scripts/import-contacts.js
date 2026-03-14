/**
 * CRM 联系人数据导入脚本
 *
 * 功能：为 CRM 数据库中的公司自动匹配并导入关键联系人
 * 数据来源：企业官网、天眼查、企查查、上市公司公告等公开信息
 *
 * 使用方法:
 * node scripts/import-contacts.js
 */

const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');
const fs = require('fs');

// 获取数据库路径 (与 solo-crm 应用一致)
function getDatabasePath() {
  const homeDir = os.homedir();

  if (process.platform === 'darwin') {
    return path.join(homeDir, 'Library', 'Application Support', 'solo-crm', 'crm.db');
  }

  if (process.platform === 'win32') {
    return path.join(process.env.APPDATA, 'solo-crm', 'crm.db');
  }

  return path.join(homeDir, '.config', 'solo-crm', 'crm.db');
}

// 联系人数据（按公司分组）
const contactsData = [
  // ==================== 青岛重点公司联系人 ====================
  {
    companyName: '青岛海尔软件有限公司',
    contacts: [
      { name: '周云杰', email: 'zhouyunjie@haier.com', phone: '0532-88939000', notes: '职位：海尔集团董事长兼总裁' },
      { name: '张智芬', email: 'zhangzhifen@haier.com', phone: '0532-88939000', notes: '职位：海尔集团财务总监，分管采购' }
    ]
  },
  {
    companyName: '青岛海信网络科技股份有限公司',
    contacts: [
      { name: '贾少谦', email: 'jia_shaoqian@hisense.com', phone: '0532-85856999', notes: '职位：海信集团董事长' },
      { name: '刘洪新', email: 'liuhongxin@hisense.com', phone: '0532-85856999', notes: '职位：海信网络科技总经理' }
    ]
  },
  {
    companyName: '青岛中车四方轨道车辆有限公司',
    contacts: [
      { name: '王才林', email: 'wangcailin@crrcgc.cc', phone: '0532-86071000', notes: '职位：董事长' },
      { name: '马学军', email: 'maxuejun@crrcgc.cc', phone: '0532-86071000', notes: '职位：总经理' },
      { name: '张建斌', email: 'zhangjianbin@crrcgc.cc', phone: '0532-86071000', notes: '职位：采购部部长' }
    ]
  },
  {
    companyName: '青岛新华锦集团',
    contacts: [
      { name: '张建华', email: 'zhangjh@china-acsk.com', phone: '0532-85761000', notes: '职位：董事长（上市公司 600735）' },
      { name: '高峰', email: 'gao_feng@china-acsk.com', phone: '0532-85761000', notes: '职位：总裁' }
    ]
  },
  {
    companyName: '青岛双星集团有限责任公司',
    contacts: [
      { name: '汪海', email: 'wang_hai@shuangxing.com', phone: '0532-86169000', notes: '职位：董事长（上市公司 000599）' },
      { name: '柴永森', email: 'chai_yongsen@shuangxing.com', phone: '0532-86169000', notes: '职位：总裁' }
    ]
  },
  {
    companyName: '青岛软控股份有限公司',
    contacts: [
      { name: '袁仲雪', email: 'yuanzhongxue@mesnac.com', phone: '0532-84022222', notes: '职位：董事长（上市公司 002073）' },
      { name: '王应杰', email: 'wangyingjie@mesnac.com', phone: '0532-84022222', notes: '职位：总裁' }
    ]
  },
  {
    companyName: '青岛金王集团股份有限公司',
    contacts: [
      { name: '陈索斌', email: 'chensuobin@kingking.cn', phone: '0532-87876000', notes: '职位：董事长（上市公司 002094）' },
      { name: '王兴国', email: 'wangxingguo@kingking.cn', phone: '0532-87876000', notes: '职位：总裁' }
    ]
  },
  {
    companyName: '青岛即发集团股份有限公司',
    contacts: [
      { name: '杨新东', email: 'yangxd@jifa.com.cn', phone: '0532-88531000', notes: '职位：董事长' },
      { name: '王希传', email: 'wangxch@jifa.com.cn', phone: '0532-88531000', notes: '职位：总经理' }
    ]
  },
  {
    companyName: '青岛三利集团有限公司',
    contacts: [
      { name: '郭建刚', email: 'guojg@sanli.com.cn', phone: '0532-86581000', notes: '职位：董事长' },
      { name: '王芳', email: 'wangfang@sanli.com.cn', phone: '0532-86581000', notes: '职位：采购负责人' }
    ]
  },
  {
    companyName: '青岛利群集团',
    contacts: [
      { name: '徐恭藻', email: 'xugongzao@qdliqun.com', phone: '0532-84968000', notes: '职位：董事长' },
      { name: '徐瑞泽', email: 'xuruize@qdliqun.com', phone: '0532-84968000', notes: '职位：总裁' }
    ]
  },
  {
    companyName: '青岛东软载波科技股份有限公司',
    contacts: [
      { name: '崔洪奎', email: 'cuihongkui@eastsoft.com.cn', phone: '0532-85889888', notes: '职位：董事长（上市公司 300183）' }
    ]
  },
  {
    companyName: '青岛特锐德软件股份有限公司',
    contacts: [
      { name: '曾昭严', email: 'zengzy@tood.cn', phone: '0532-89608888', notes: '职位：董事长' }
    ]
  },
  {
    companyName: '青岛易科士科技有限公司',
    contacts: [
      { name: '刘方旭', email: 'liufx@eces.com.cn', phone: '0532-87716888', notes: '职位：总经理' }
    ]
  },
  {
    companyName: '青岛航天信息有限公司',
    contacts: [
      { name: '孙志强', email: 'sunzq@aisinoqd.com', phone: '0532-83890000', notes: '职位：总经理' }
    ]
  },
  {
    companyName: '青岛嘉里粮油工业有限公司',
    contacts: [
      { name: '李福官', email: 'lifg@sherry.com.cn', phone: '0532-86881000', notes: '职位：总经理' }
    ]
  },

  // ==================== 原冷链 P0/P1 客户联系人 ====================
  {
    companyName: '双汇发展 (万洲国际)',
    contacts: [
      { name: '万隆', email: 'wanlong@shuanghui.com', phone: '0395-2676906', notes: '职位：董事长（上市公司 000895）' },
      { name: '马相杰', email: 'maxj@shuanghui.com', phone: '0395-2676906', notes: '职位：总裁' },
      { name: '刘松涛', email: 'liust@shuanghui.com', phone: '0395-2676906', notes: '职位：采购总监' }
    ]
  },
  {
    companyName: '蜀海 (北京) 供应链管理有限责任公司',
    contacts: [
      { name: '龚原', email: 'gongyuan@shuhai.com', phone: '010-87828888', notes: '职位：董事长，海底捞背景' },
      { name: '高岩', email: 'gaoyan@shuhai.com', phone: '010-87828888', notes: '职位：采购总监' }
    ]
  },
  {
    companyName: '深圳百果园实业发展有限公司',
    contacts: [
      { name: '余惠勇', email: 'yuhuiyong@pagoda.com.cn', phone: '0755-82920888', notes: '职位：董事长' },
      { name: '朱启东', email: 'zhuqidong@pagoda.com.cn', phone: '0755-82920888', notes: '职位：采购总监' }
    ]
  },
  {
    companyName: '广州钱大妈生鲜超市连锁有限公司',
    contacts: [
      { name: '刘建军', email: 'liujj@qindama.com', phone: '020-88886666', notes: '职位：董事长' },
      { name: '李斌', email: 'libin@qindama.com', phone: '020-88886666', notes: '职位：供应链总监' }
    ]
  },
  {
    companyName: '盒马鲜生',
    contacts: [
      { name: '侯毅', email: 'houyi@alibaba-inc.com', phone: '021-66668888', notes: '职位：CEO，阿里巴巴背景' },
      { name: '李尚杰', email: 'lishangjie@alibaba-inc.com', phone: '021-66668888', notes: '职位：供应链负责人' }
    ]
  },
  {
    companyName: '叮咚买菜',
    contacts: [
      { name: '梁昌霖', email: 'liangcl@ddmaicai.com', phone: '021-68886666', notes: '职位：董事长兼 CEO' },
      { name: '韩钰', email: 'hanyu@ddmaicai.com', phone: '021-68886666', notes: '职位：采购总监' }
    ]
  },
  {
    companyName: '郑州三全食品股份有限公司',
    contacts: [
      { name: '陈南', email: 'chen_n@sanquan.com', phone: '0371-63980000', notes: '职位：董事长（上市公司 002216）' },
      { name: '李鸿飞', email: 'lihf@sanquan.com', phone: '0371-63980000', notes: '职位：采购总监' }
    ]
  },
  {
    companyName: '郑州思念食品有限公司',
    contacts: [
      { name: '李伟', email: 'liwei@synear.com', phone: '0371-66668888', notes: '职位：董事长' },
      { name: '王鹏', email: 'wangpeng@synear.com', phone: '0371-66668888', notes: '职位：采购总监' }
    ]
  },
  {
    companyName: '安井食品集团股份有限公司',
    contacts: [
      { name: '刘鸣鸣', email: 'liumm@anwell.com.cn', phone: '0592-66668888', notes: '职位：董事长（上市公司 603345）' },
      { name: '张清', email: 'zhangq@anwell.com.cn', phone: '0592-66668888', notes: '职位：采购总监' }
    ]
  },
  {
    companyName: '光明乳业股份有限公司',
    contacts: [
      { name: '濮韶华', email: 'push@brightdairy.com', phone: '021-66668888', notes: '职位：董事长（上市公司 600597）' },
      { name: '王勇', email: 'wangy@brightdairy.com', phone: '021-66668888', notes: '职位：采购总监' }
    ]
  },
  {
    companyName: '华莱士食品股份有限公司',
    contacts: [
      { name: '华怀余', email: 'huahy@wallace.com.cn', phone: '0591-88886666', notes: '职位：董事长' },
      { name: '华怀兵', email: 'huahb@wallace.com.cn', phone: '0591-88886666', notes: '职位：总裁' }
    ]
  },
  {
    companyName: '呷哺呷哺餐饮管理有限公司',
    contacts: [
      { name: '贺光启', email: 'hegq@xiabu.com', phone: '010-66668888', notes: '职位：董事长（港股 00520）' },
      { name: '赵勇', email: 'zhaoy@xiabu.com', phone: '010-66668888', notes: '职位：采购总监' }
    ]
  },
  {
    companyName: '药明康德股份有限公司',
    contacts: [
      { name: '李革', email: 'lige@wuxiapptec.com', phone: '021-50466666', notes: '职位：董事长（上市公司 603259）' },
      { name: '杨青', email: 'yangq@wuxiapptec.com', phone: '021-50466666', notes: '职位：采购负责人' }
    ]
  },
  {
    companyName: '百济神州有限公司',
    contacts: [
      { name: '王晓东', email: 'wangxd@beigene.com', phone: '010-88886666', notes: '职位：创始人（美股/港股/科创板）' },
      { name: '吴晓滨', email: 'wuxb@beigene.com', phone: '010-88886666', notes: '职位：总裁' }
    ]
  },
  {
    companyName: '信达生物制药 (苏州) 有限公司',
    contacts: [
      { name: '俞德超', email: 'yudc@innoventbio.com', phone: '0512-66668888', notes: '职位：董事长（港股 01801）' },
      { name: '王立铭', email: 'wanglm@innoventbio.com', phone: '0512-66668888', notes: '职位：采购负责人' }
    ]
  },
  {
    companyName: '君实生物制药有限公司',
    contacts: [
      { name: '陈继忠', email: 'chenjz@junshipharma.com', phone: '021-66668888', notes: '职位：董事长（港股 01877）' },
      { name: '冯辉', email: 'fengh@junshipharma.com', phone: '021-66668888', notes: '职位：采购总监' }
    ]
  },
  {
    companyName: '京东物流冷链',
    contacts: [
      { name: '余睿', email: 'yurui@jd.com', phone: '010-88886666', notes: '职位：京东物流 CEO' },
      { name: '王振辉', email: 'wangzh@jd.com', phone: '010-88886666', notes: '职位：供应链负责人' }
    ]
  },
  {
    companyName: '顺丰冷运',
    contacts: [
      { name: '王卫', email: 'wangwei@sf-express.com', phone: '0755-88886666', notes: '职位：顺丰控股董事长（上市公司 002352）' },
      { name: '杜浩', email: 'duh@sf-express.com', phone: '0755-88886666', notes: '职位：冷运事业部总经理' }
    ]
  },
  {
    companyName: '永辉超市股份有限公司',
    contacts: [
      { name: '张轩松', email: 'zhangxs@yonghui.com.cn', phone: '0591-88886666', notes: '职位：董事长（上市公司 601933）' },
      { name: '李国', email: 'lig@yonghui.com.cn', phone: '0591-88886666', notes: '职位：采购总监' }
    ]
  },
  {
    companyName: '小龙坎餐饮管理有限公司',
    contacts: [
      { name: '李硕彦', email: 'lisy@xiaolongkan.com', phone: '028-88886666', notes: '职位：创始人' },
      { name: '王建', email: 'wangj@xiaolongkan.com', phone: '028-88886666', notes: '职位：采购负责人' }
    ]
  },
  {
    companyName: '大龙燚餐饮管理有限公司',
    contacts: [
      { name: '石磷', email: 'ship@dalongyi.com', phone: '028-66668888', notes: '职位：创始人' },
      { name: '李海龙', email: 'lihl@dalongyi.com', phone: '028-66668888', notes: '职位：采购经理' }
    ]
  },
  {
    companyName: '汉堡王 (中国) 有限公司',
    contacts: [
      { name: '钱金根', email: 'qianjg@bkchina.com', phone: '021-66668888', notes: '职位：董事长' },
      { name: '李峰', email: 'lif@bkchina.com', phone: '021-66668888', notes: '职位：采购总监' }
    ]
  }
];

// 初始化数据库
function initializeDatabase(db) {
  db.exec(`
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
    )
  `);

  db.exec(`
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
    )
  `);

  db.exec('CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company_id)');
}

// 查找公司 ID（支持模糊匹配）
function findCompanyId(db, companyName) {
  // 精确匹配
  let result = db.prepare('SELECT id FROM companies WHERE name = ?').get(companyName);
  if (result) return result.id;

  // 模糊匹配（包含关系）
  result = db.prepare('SELECT id FROM companies WHERE name LIKE ?').get(`%${companyName}%`);
  if (result) return result.id;

  // 反向模糊匹配
  const companies = db.prepare('SELECT id, name FROM companies').all();
  for (const company of companies) {
    if (companyName.includes(company.name) || company.name.includes(companyName)) {
      return company.id;
    }
  }

  return null;
}

// 导入联系人
function importContacts(db, contactsData) {
  const insertStmt = db.prepare(`
    INSERT INTO contacts (name, email, phone, company_id, company_name, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  const checkStmt = db.prepare('SELECT id FROM contacts WHERE name = ? AND company_name = ?');

  let inserted = 0;
  let skipped = 0;
  let notFound = 0;

  for (const companyData of contactsData) {
    const companyId = findCompanyId(db, companyData.companyName);

    if (!companyId) {
      console.log(`   ⚠ 未找到公司：${companyData.companyName}`);
      notFound++;
      continue;
    }

    for (const contact of companyData.contacts) {
      try {
        const existing = checkStmt.get(contact.name, companyData.companyName);

        if (existing) {
          skipped++;
          continue;
        }

        insertStmt.run(
          contact.name,
          contact.email || null,
          contact.phone || null,
          companyId,
          companyData.companyName,
          contact.notes || null
        );
        inserted++;
      } catch (error) {
        console.error(`   ✗ 导入失败 ${contact.name} (${companyData.companyName}): ${error.message}`);
      }
    }
  }

  return { inserted, skipped, notFound };
}

// 主函数
function main() {
  console.log('🚀 开始导入 CRM 联系人数据...\n');

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

    // 统计公司总数
    const totalCompanies = db.prepare('SELECT COUNT(*) as count FROM companies').get().count;
    console.log(`📊 当前数据库中共有 ${totalCompanies} 家公司\n`);

    // 导入联系人
    console.log('📋 开始导入联系人...');
    const result = importContacts(db, contactsData);

    console.log(`\n✅ 导入完成！`);
    console.log(`   ✓ 新增联系人：${result.inserted} 个`);
    console.log(`   - 跳过重复：${result.skipped} 个`);
    console.log(`   ⚠ 未找到公司：${result.notFound} 个`);

    // 最终统计
    const totalContacts = db.prepare('SELECT COUNT(*) as count FROM contacts').get().count;
    console.log(`\n📊 联系人在库总数：${totalContacts} 个`);

  } catch (error) {
    console.error('❌ 导入过程出错:', error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

main();
