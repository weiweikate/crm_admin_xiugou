export const userTaskQuery = ['/shareJobs/userJobs/queryList', { methods: 'post' }]; // 用户任务分页查询
export const userTaskNameQuery = ['/shareJobs/queryJobsNames', { methods: 'get' }]; // 用户任务名称查询
export const deleteTaskJobs = ['/shareJobs/deleteJobs', { methods: 'get' }]; // 删除任务
export const saveJobs = ['/shareJobs/saveJobs', { methods: 'post' }]; // 添加/修改任务 通过id区分添加或修改
export const shareTaskQuery = ['/shareJobs/queryList', { methods: 'post' }]; // 秀值任务分页查询
export const addRecord = ['/user/showValueRecord/addRecord', { methods: 'post' }]; // 秀值充值
export const queryUserByCode = ['/user/showValueRecord/queryUserByCode', { methods: 'get' }]; // 根据授权码查询用户信息
export const queryUserCountByLevelId = ['/user/showValueRecord/queryUserCountByLevelId', { methods: 'get' }]; // 根据用户层级查询用户信息
export const updateRecordAudit = ['/user/showValueRecord/updateRecord', { methods: 'get' }]; // 通过/审核
export const queryRecordPageList = ['/user/showValueRecord/queryRecordPageList', { methods: 'post' }]; // 查询充值记录列表
export const addShowValBeanTemplate = ['/showValueTemplate/addTemplate', { methods: 'post' }]; // 添加模板
export const queryProfitTemplatePageList = ['/showValueTemplate/queryTemplatePageList', { methods: 'get' }]; //查询模板列表
export const queryProfitTemplateById = ['/showValueTemplate/findTemplateById', { methods: 'get' }]; //根据ID查询模板详情
export const updateProfitTemplateById = ['/showValueTemplate/updateTemplate', { methods: 'post' }]; //修改模板
export const deleteProfitTemplate = ['/showValueTemplate/deleteTemplate', { methods: 'get' }]; //删除模板
export const updateProfitTemplateStatus = ['/showValueTemplate/updateStatus', { methods: 'post' }]; //启用/停用
