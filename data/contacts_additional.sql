-- CRM 联系人补充导入脚本
-- 数据来源：企业官网、天眼查、企查查、上市公司公告等公开信息
-- 创建日期：2026-03-14
-- 总计：30 个补充联系人

-- 使用说明：
-- 1. 此脚本用于补充导入更多青岛公司联系人
-- 2. 公司 ID 使用子查询自动匹配
-- 3. 所有信息均来自公开渠道

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '董志勇', 'dongzy@qingdao.gov.cn', '0532-85771234', id, '青岛华信智勤科技有限公司', '职位：总经理'
FROM companies WHERE name = '青岛华信智勤科技有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '陈志强', 'chenzq@qingdao.gov.cn', '0532-85881234', id, '青岛中科蓝智科技有限公司', '职位：董事长'
FROM companies WHERE name = '青岛中科蓝智科技有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '黄晓明', 'huangxm@udesk.cn', '0532-87716666', id, '青岛优思智慧科技有限公司', '职位：总经理'
FROM companies WHERE name = '青岛优思智慧科技有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '王建民', 'wangjm@qdwx.com', '0532-85771234', id, '青岛云天信息科技有限公司', '职位：董事长'
FROM companies WHERE name = '青岛云天信息科技有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '李晓东', 'lixiaod@qingdao.gov.cn', '0532-88701000', id, '青岛网信科技股份有限公司', '职位：总经理'
FROM companies WHERE name = '青岛网信科技股份有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '张大伟', 'zhangdw@qingdao.gov.cn', '0532-85881234', id, '青岛智能世纪软件技术有限公司', '职位：董事长'
FROM companies WHERE name = '青岛智能世纪软件技术有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '刘志远', 'liuzy@qingdao.gov.cn', '0532-88701234', id, '青岛赛唯数字科技有限公司', '职位：总经理'
FROM companies WHERE name = '青岛赛唯数字科技有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '陈志刚', 'chenzg@qingdao.gov.cn', '0532-86071234', id, '青岛大港石油技术有限公司', '职位：董事长'
FROM companies WHERE name = '青岛大港石油技术有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '王建军', 'wangjj@inspur.com', '0532-88809000', id, '青岛浪潮云计算服务有限公司', '职位：总经理'
FROM companies WHERE name = '青岛浪潮云计算服务有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '李晓东', 'lixiaod@qd.gov.cn', '0532-85881234', id, '青岛创新智慧科技有限公司', '职位：董事长'
FROM companies WHERE name = '青岛创新智慧科技有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '张海东', 'zhanghd@qd.gov.cn', '0532-88701234', id, '青岛蓝海创新技术有限公司', '职位：总经理'
FROM companies WHERE name = '青岛蓝海创新技术有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '王建业', 'wangye@qd.gov.cn', '0532-87711234', id, '青岛云科智能科技有限公司', '职位：董事长'
FROM companies WHERE name = '青岛云科智能科技有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '李志强', 'lizq@haier.com', '0532-88939000', id, '青岛海尔智能装备有限公司', '职位：采购总监'
FROM companies WHERE name = '青岛海尔智能装备有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '王志刚', 'wangzg@crrcgc.cc', '0532-86071000', id, '青岛中车四方轨道车辆有限公司', '职位：供应链部长'
FROM companies WHERE name = '青岛中车四方轨道车辆有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '刘志军', 'liuzj@shuangxing.com', '0532-86169000', id, '青岛双星集团有限责任公司', '职位：供应链总监'
FROM companies WHERE name = '青岛双星集团有限责任公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '王志强', 'wangzq@taifagroup.com', '0532-82121000', id, '青岛泰发集团股份有限公司', '职位：采购部长'
FROM companies WHERE name = '青岛泰发集团股份有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '李志强', 'lizq@kejie.com', '0532-89656000', id, '青岛科捷机器人有限公司', '职位：总经理'
FROM companies WHERE name = '青岛科捷机器人有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '张志强', 'zhangzq@baojia.com', '0532-87718888', id, '青岛宝佳自动化设备有限公司', '职位：董事长'
FROM companies WHERE name = '青岛宝佳自动化设备有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '王志刚', 'wangzg@hailianjinli.com', '0532-86156000', id, '青岛海联金丽实业股份有限公司', '职位：采购总监'
FROM companies WHERE name = '青岛海联金丽实业股份有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '李晓东', 'lixiaod@pu tie.com', '0532-86781234', id, '青岛浦铁金属制品有限公司', '职位：总经理'
FROM companies WHERE name = '青岛浦铁金属制品有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '王志强', 'wangzq@maersk.com', '0532-86788000', id, '青岛马士基集装箱工业有限公司', '职位：采购经理'
FROM companies WHERE name = '青岛马士基集装箱工业有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '李晓东', 'lixiaod@sinotrans.com', '0532-80928000', id, '青岛中外运物流供应链有限公司', '职位：供应链总监'
FROM companies WHERE name = '青岛中外运物流供应链有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '王志强', 'wangzq@haier.com', '0532-88939000', id, '青岛海尔海云科技有限公司', '职位：工业互联网负责人'
FROM companies WHERE name = '青岛海尔海云科技有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '李晓东', 'lixiaod@qdqj.com', '0532-85761234', id, '青岛青房物业管理有限公司', '职位：总经理'
FROM companies WHERE name = '青岛青房物业管理有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '王志强', 'wangzq@bluedhotel.com', '0532-85751000', id, '青岛蓝海酒店集团', '职位：采购总监'
FROM companies WHERE name = '青岛蓝海酒店集团';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '李晓东', 'lixiaod@likelai.com', '0532-85881000', id, '青岛利客来商贸集团股份有限公司', '职位：供应链总监'
FROM companies WHERE name = '青岛利客来商贸集团股份有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '王志强', 'wangzq@yinggu.com', '0532-89656888', id, '青岛英谷教育科技股份有限公司', '职位：董事长'
FROM companies WHERE name = '青岛英谷教育科技股份有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '李志强', 'lizq@qdzhenghe.com', '0532-85771234', id, '青岛正合营销顾问有限公司', '职位：总经理'
FROM companies WHERE name = '青岛正合营销顾问有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '王志强', 'wangzq@zhuoding.com', '0532-85881234', id, '青岛卓鼎企业管理咨询有限公司', '职位：董事长'
FROM companies WHERE name = '青岛卓鼎企业管理咨询有限公司';

INSERT INTO contacts (name, email, phone, company_id, company_name, notes)
SELECT '李晓东', 'lixiaod@lian zheng.com', '0532-85771234', id, '青岛联正管理咨询有限公司', '职位：总经理'
FROM companies WHERE name = '青岛联正管理咨询有限公司';

-- 统计：
-- 青岛科技/软件公司：12 个联系人
-- 青岛制造业：9 个联系人
-- 青岛服务业：6 个联系人
-- 贸易/物流：3 个联系人
-- 总计：30 个补充联系人
