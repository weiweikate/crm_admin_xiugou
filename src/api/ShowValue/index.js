export const userTaskQuery = ['/shareJobs/userJobs/queryList', { methods: 'post' }]; // 用户任务分页查询
export const userTaskNameQuery = ['/shareJobs/queryList', { methods: 'get' }]; // 用户任务名称查询
export const deleteTaskJobs = ['/shareJobs/deleteJobs', { methods: 'get' }]; // 删除任务
export const saveJobs = ['/shareJobs/saveJobs', { methods: 'post' }]; // 添加/修改任务 通过id区分添加或修改
export const shareTaskQuery = ['/shareJobs/queryList', { methods: 'post' }]; // 秀值任务分页查询
