-- CRM 联系人数据快速查看脚本
-- 使用方法：sqlite3 crm.db < quick_view.sql

.headers on
.mode column

-- 统计信息
SELECT '=== 联系人总体统计 ===' as report;
SELECT
    COUNT(*) as '联系人总数',
    COUNT(DISTINCT company_name) as '覆盖公司数',
    COUNT(DISTINCT company_id) as '关联公司数'
FROM contacts;

-- 按公司统计联系人数
SELECT '=== 各公司联系人数 Top 15 ===' as report;
SELECT
    company_name as '公司名称',
    COUNT(*) as '联系人数'
FROM contacts
GROUP BY company_name
ORDER BY contact_count DESC
LIMIT 15;

-- 按职位类型统计
SELECT '=== 联系人职位分布 ===' as report;
SELECT
    CASE
        WHEN notes LIKE '%董事长%' OR notes LIKE '%CEO%' THEN '董事长/CEO'
        WHEN notes LIKE '%总裁%' OR notes LIKE '%总经理%' THEN '总裁/总经理'
        WHEN notes LIKE '%采购%' THEN '采购负责人'
        WHEN notes LIKE '%供应链%' THEN '供应链负责人'
        WHEN notes LIKE '%总监%' THEN '其他总监'
        ELSE '其他'
    END as '职位类型',
    COUNT(*) as '人数'
FROM contacts
GROUP BY 1
ORDER BY 2 DESC;
