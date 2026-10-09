/**
 * 地点的 position 与 hotspot 均使用原始底图的归一化坐标（0–1）。
 * hotspot 覆盖底图中原有的建筑框和名称，不另行绘制或改写地图文字。
 */

const UNKNOWN = '待实地核验';
const UPDATED_AT = '2026-09-25';

const referenceMap = {
  label: '用户提供的龙子湖校区平面参考图',
  type: '参考图'
};

const teachingReport = {
  label: '学校公开教学周报',
  type: '学校公开文件',
  url: 'https://jwc.hafu.edu.cn/__local/5/53/F6/3E1B53079236BBE33FB723A15_918EB376_260D40.pdf'
};

const schoolMessageBoard = {
  label: '河南财政金融学院留言板公开信息',
  type: '学校公开页面',
  url: 'https://www.hafu.edu.cn/lyb/index.jsp'
};

const publicGuide = {
  label: '公开校园攻略样本',
  type: '公开平台样本',
  url: 'https://www.sina.cn/news/detail/4790686820335779.html'
};

const studentSamples = {
  label: '公开学生经验样本',
  type: '非官方样本',
  url: 'https://collegeschat.github.io/universities/he-nan-cai-zheng-jin-rong-xue-yuan-long-zi-hu-xiao-qu/'
};

const px = (left, top, right, bottom) => ({
  x: ((left + right) / 2) / 1080,
  y: ((top + bottom) / 2) / 1535,
  width: (right - left) / 1080,
  height: (bottom - top) / 1535
});

function mapPlace({ id, name, aliases = [], category, hotspot, summary, notice = '建筑用途、入口与开放安排需现场确认。' }) {
  return {
    id, name, aliases, category,
    position: { x: hotspot.x, y: hotspot.y },
    hotspot,
    summary,
    entrance: UNKNOWN,
    hours: UNKNOWN,
    facilities: UNKNOWN,
    notice,
    verificationStatus: '待核实',
    confidence: '低',
    sources: [referenceMap],
    updatedAt: UPDATED_AT,
    photos: []
  };
}

function teachingPlace({ id, name, aliases = [], hotspot, summary, notice }) {
  return {
    id, name, aliases, category: '教学楼',
    position: { x: hotspot.x, y: hotspot.y },
    hotspot,
    summary,
    entrance: UNKNOWN,
    hours: UNKNOWN,
    facilities: '楼层导览、电梯与无障碍信息待采集',
    notice,
    verificationStatus: '部分核实',
    confidence: '高',
    sources: [referenceMap, teachingReport],
    updatedAt: UPDATED_AT,
    photos: []
  };
}

export const places = [
  mapPlace({ id: 'north-gate', name: '北门', aliases: ['校园北门'], category: '校门', hotspot: px(597, 400, 659, 440), summary: '参考图标注的校园北侧出入口。', notice: '开放时段与访客入校规则以学校最新通知为准。' }),
  mapPlace({ id: 'kindergarten', name: '幼儿园', aliases: ['校内幼儿园'], category: '校园设施', hotspot: px(710, 422, 800, 454), summary: '参考图标注的校内幼儿园建筑。' }),
  mapPlace({ id: 'gymnasium', name: '体育馆', aliases: ['室内体育馆'], category: '运动场地', hotspot: px(830, 424, 900, 452), summary: '参考图标注的室内体育场馆。' }),

  mapPlace({ id: 'ruiyuan-su-3', name: '瑞园宿3舍', aliases: ['瑞园宿3', 'B区宿3'], category: '宿舍', hotspot: px(794, 462, 884, 490), summary: '参考图标注的瑞园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'ruiyuan-su-8', name: '瑞园宿8舍', aliases: ['瑞园宿8', 'B区宿8'], category: '宿舍', hotspot: px(908, 462, 1000, 490), summary: '参考图标注的瑞园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'ruiyuan-su-2', name: '瑞园宿2舍', aliases: ['瑞园宿2', 'B区宿2'], category: '宿舍', hotspot: px(794, 496, 884, 522), summary: '参考图标注的瑞园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'ruiyuan-su-7', name: '瑞园宿7舍', aliases: ['瑞园宿7', 'B区宿7'], category: '宿舍', hotspot: px(908, 496, 1000, 522), summary: '参考图标注的瑞园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'ruiyuan-xue-4', name: '瑞园学4舍', aliases: ['瑞园学4', 'B区学4'], category: '宿舍', hotspot: px(686, 510, 778, 530), summary: '参考图标注的瑞园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'ruiyuan-su-1', name: '瑞园宿1舍', aliases: ['瑞园宿1', 'B区宿1'], category: '宿舍', hotspot: px(794, 526, 884, 548), summary: '参考图标注的瑞园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'ruiyuan-su-6', name: '瑞园宿6舍', aliases: ['瑞园宿6', 'B区宿6'], category: '宿舍', hotspot: px(908, 526, 1000, 548), summary: '参考图标注的瑞园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'ruiyuan-xue-3', name: '瑞园学3舍', aliases: ['瑞园学3', 'B区学3'], category: '宿舍', hotspot: px(686, 532, 778, 552), summary: '参考图标注的瑞园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'ruiyuan-xue-2', name: '瑞园学2舍', aliases: ['瑞园学2', 'B区学2'], category: '宿舍', hotspot: px(686, 572, 778, 592), summary: '参考图标注的瑞园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'ruiyuan-xue-1', name: '瑞园学1舍', aliases: ['瑞园学1', 'B区学1'], category: '宿舍', hotspot: px(686, 600, 778, 620), summary: '参考图标注的瑞园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'ruiyuan-canteen', name: '瑞园餐厅', aliases: ['图中餐厅', 'B区餐厅', 'B区食堂'], category: '餐饮', hotspot: px(804, 578, 846, 644), summary: '参考图和学校公开联系方式均显示瑞园宿舍区设有餐厅。' }),
  mapPlace({ id: 'unicom-office', name: '联通营业厅', aliases: ['联通', '校园营业厅'], category: '生活服务', hotspot: px(852, 574, 894, 648), summary: '参考图标注的校园通信服务点。' }),
  mapPlace({ id: 'ruiyuan-su-5', name: '瑞园宿5舍', aliases: ['瑞园宿5', 'B区宿5'], category: '宿舍', hotspot: px(908, 574, 1000, 596), summary: '参考图标注的瑞园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'ruiyuan-su-4', name: '瑞园宿4舍', aliases: ['瑞园宿4', 'B区宿4'], category: '宿舍', hotspot: px(908, 606, 1000, 630), summary: '参考图标注的瑞园宿舍楼，当前住宿安排待逐栋确认。' }),

  mapPlace({ id: 'badminton-court', name: '羽毛球场', aliases: ['羽毛球'], category: '运动场地', hotspot: px(326, 452, 420, 490), summary: '参考图标注的羽毛球运动区域。' }),
  mapPlace({ id: 'tennis-court', name: '网球场', aliases: ['网球'], category: '运动场地', hotspot: px(334, 502, 424, 546), summary: '参考图标注的网球运动区域。' }),
  mapPlace({ id: 'basketball-court', name: '篮球场', aliases: ['篮球'], category: '运动场地', hotspot: px(326, 574, 424, 620), summary: '参考图标注的篮球运动区域。' }),
  mapPlace({ id: 'stadium', name: '田径场', aliases: ['体育场', '操场', '跑道'], category: '运动场地', hotspot: px(478, 516, 550, 554), summary: '参考图清晰标注的田径运动区域。', notice: '活动、考试或维护期间可能临时调整开放范围。' }),

  mapPlace({ id: 'family-residential-area', name: '家属院', aliases: ['家属区'], category: '校园设施', hotspot: px(142, 700, 290, 752), summary: '参考图标注的家属生活区域。', notice: '属于生活区域，地图不展示住户或房间等个人信息。' }),
  mapPlace({ id: 'campus-clinic', name: '校医院', aliases: ['医务室', '医院'], category: '生活服务', hotspot: px(244, 802, 342, 844), summary: '参考图标注的校内医疗服务建筑。', notice: '服务范围与值班时间需以现场或学校通知为准。' }),
  mapPlace({ id: 'hot-water-room', name: '热水房', aliases: ['开水房', '热水处'], category: '生活服务', hotspot: px(228, 1092, 288, 1130), summary: '参考图在祥园宿舍区西侧标有热水房。', notice: '需区分集中热水房与宿舍楼内饮水设备。' }),

  mapPlace({ id: 'xiangyuan-xue-7', name: '祥园学7舍', aliases: ['祥园学7', 'A区学7'], category: '宿舍', hotspot: px(446, 774, 568, 808), summary: '参考图标注的祥园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'xiangyuan-xue-6', name: '祥园学6舍', aliases: ['祥园学6', 'A区学6'], category: '宿舍', hotspot: px(354, 816, 468, 848), summary: '参考图标注的祥园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'xiangyuan-xue-5', name: '祥园学5舍', aliases: ['祥园学5', 'A区学5'], category: '宿舍', hotspot: px(330, 866, 448, 900), summary: '参考图标注的祥园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'xiangyuan-xue-4', name: '祥园学4舍', aliases: ['祥园学4', 'A区学4'], category: '宿舍', hotspot: px(328, 942, 448, 974), summary: '参考图标注的祥园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'xiangyuan-xue-3', name: '祥园学3舍', aliases: ['祥园学3', 'A区学3'], category: '宿舍', hotspot: px(374, 990, 494, 1022), summary: '参考图标注的祥园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'xiangyuan-xue-2', name: '祥园学2舍', aliases: ['祥园学2', 'A区学2'], category: '宿舍', hotspot: px(444, 1034, 578, 1068), summary: '参考图标注的祥园宿舍楼，当前住宿安排待逐栋确认。' }),
  mapPlace({ id: 'xiangyuan-canteen', name: '祥园餐厅', aliases: ['图中餐厅', 'A区餐厅', '餐厅'], category: '餐饮', hotspot: px(340, 1034, 424, 1116), summary: '位于祥园宿舍区南侧，学校公开信息将龙子湖餐厅列为校内餐饮服务点。' }),
  mapPlace({ id: 'bathhouse', name: '浴室', aliases: ['澡堂', '公共浴室'], category: '生活服务', hotspot: px(298, 1132, 360, 1178), summary: '参考图将浴室标在校区西南侧、祥园宿舍区附近。', notice: '公开样本中的开放时段存在冲突，暂不展示具体时间。' }),

  mapPlace({ id: 'apartment-building-3', name: '3号公寓楼', aliases: ['公寓楼3号'], category: '宿舍', hotspot: px(322, 1206, 420, 1238), summary: '参考图标注的公寓建筑，当前用途和住宿安排待核实。' }),
  mapPlace({ id: 'apartment-building-2', name: '2号公寓楼', aliases: ['公寓楼2号'], category: '宿舍', hotspot: px(322, 1256, 420, 1288), summary: '参考图标注的公寓建筑，当前用途和住宿安排待核实。' }),
  mapPlace({ id: 'apartment-building-1', name: '1号公寓楼', aliases: ['公寓楼1号'], category: '宿舍', hotspot: px(322, 1294, 420, 1328), summary: '参考图标注的公寓建筑，当前用途和住宿安排待核实。' }),
  mapPlace({ id: 'security-office', name: '保卫处办公楼', aliases: ['保卫处'], category: '办公', hotspot: px(394, 1290, 500, 1326), summary: '参考图标注的校园保卫办公建筑。' }),

  teachingPlace({ id: 'wenyuan-building', name: '文渊楼', aliases: ['文渊', '文渊教学楼'], hotspot: px(478, 1124, 584, 1158), summary: '学校公开教学周报显示文渊楼包含普通教学和语音教室等教学空间。', notice: '教室编号规则和常用入口需现场拍摄确认。' }),
  teachingPlace({ id: 'wenjin-building', name: '文津楼', aliases: ['文津', '文津教学楼'], hotspot: px(480, 1204, 584, 1238), summary: '学校公开教学周报列有文津楼多个普通教室。', notice: '需核对楼号方向、教室编号规则与常用入口。' }),
  mapPlace({ id: 'zhili-building', name: '知理楼', aliases: ['知理'], category: '教学楼', hotspot: px(758, 978, 842, 1014), summary: '参考图标注的教学建筑，内部功能尚未获得足够公开资料支持。' }),
  mapPlace({ id: 'zhilian-building', name: '知廉楼', aliases: ['知廉'], category: '教学楼', hotspot: px(758, 1038, 842, 1074), summary: '参考图标注的教学建筑，内部功能尚未获得足够公开资料支持。' }),
  mapPlace({ id: 'zhixing-building', name: '知行楼', aliases: ['知行'], category: '教学楼', hotspot: px(758, 1094, 842, 1130), summary: '参考图标注的教学建筑，内部功能尚未获得足够公开资料支持。' }),
  teachingPlace({ id: 'qihui-building', name: '启慧楼', aliases: ['启慧', '实验楼'], hotspot: px(758, 1148, 842, 1184), summary: '学校公开教学周报显示启慧楼包含软件工程、网络和大数据等实验教学空间。', notice: '实验室可能仅在课程时段开放。' }),
  teachingPlace({ id: 'qizhi-building', name: '启智楼', aliases: ['启智', '启智教学楼'], hotspot: px(758, 1204, 842, 1242), summary: '学校公开教学周报显示启智楼包含普通教室和阶梯教室等教学空间。', notice: '需实测从祥园、瑞园到达该楼的步行时间。' }),
  mapPlace({ id: 'administration-building', name: '行政办公楼', aliases: ['行政楼', '办公楼'], category: '办公', hotspot: px(736, 1322, 856, 1358), summary: '参考图标注的行政办公建筑，学生办事部门与开放安排尚待核实。', notice: '办理事务前应先核对学校通知或向辅导员确认对应部门。' }),

  mapPlace({ id: 'east-gate', name: '东门', aliases: ['校园东门'], category: '校门', hotspot: px(972, 846, 1040, 914), summary: '参考图标注的校园东侧出入口。', notice: '开放时段与访客、外卖通行规则以学校最新通知为准。' }),
  mapPlace({ id: 'south-gate', name: '南门', aliases: ['校园南门'], category: '校门', hotspot: px(620, 1396, 684, 1442), summary: '参考图标注的校园南侧主要出入口。', notice: '开放时段与访客入校规则以学校最新通知为准。' })
];

export const categoryGroups = [
  { id: 'all', label: '全部地点', categories: [] },
  { id: 'study', label: '教学楼', categories: ['教学楼'] },
  { id: 'living', label: '宿舍生活', categories: ['宿舍', '生活服务', '校园设施'] },
  { id: 'food', label: '餐饮', categories: ['餐饮'] },
  { id: 'sport', label: '运动', categories: ['运动场地'] },
  { id: 'office', label: '办公', categories: ['办公'] },
  { id: 'gate', label: '校门', categories: ['校门'] }
];
