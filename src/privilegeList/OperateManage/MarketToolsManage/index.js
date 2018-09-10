/**************降价拍*****************/
// 降价拍商品列表
export const operatorDepreciatelist='/admin/operActivityDepreciate/operatorDepreciatelist';
// 新建降价拍
export const operatorAddDepreciate = '/admin/operActivityDepreciate/operatorAddDepreciate';
// 结束/删除/减少库存/下架
export const operatorUpdateDepreciatelist_1 = '/admin/operActivityDepreciate/operatorUpdateDepreciatelist_1';
export const operatorUpdateDepreciatelist_2 = '/admin/operActivityDepreciate/operatorUpdateDepreciatelist_2';
export const operatorUpdateDepreciatelist_3 = '/admin/operActivityDepreciate/operatorUpdateDepreciatelist_3';
export const operatorUpdateDepreciatelist_4 = '/admin/operActivityDepreciate/operatorUpdateDepreciatelist_4';
// 查询降价拍商品详情
export const operatorfindById = '/admin/operActivityDepreciate/operatorfindById';




/**************秒杀*****************/
// 新建秒杀
export const addOperatorSeckill = '/admin/operActivitySeckill/addOperatorSeckill';
// 秒杀活动查询
export const queryOperatorSeckillList = '/admin/operActivitySeckill/queryOperatorSeckillList';
// 结束/删除/下架秒杀
export const updateActiviySeckillStatus_1 = '/admin/operActivitySeckill/updateActiviySeckillStatus_1';
export const updateActiviySeckillStatus_2 = '/admin/operActivitySeckill/updateActiviySeckillStatus_2';
export const updateActiviySeckillStatus_3 = '/admin/operActivitySeckill/updateActiviySeckillStatus_3';
// 查看活动详情
export const findActivitySeckillByActivityCode = '/admin/operActivitySeckill/findActivitySeckillByActivityCode';



/**************优惠套餐*****************/
// 套餐列表
export const queryOperActivityPackagePageList = '/admin/operActivityPackage/queryOperActivityPackagePageList';
// 批量删除（逻辑删除）与下架
export const batchDeleteOperActivityPackage_1 = '/admin/operActivityPackage/batchDeleteOperActivityPackage_1';//批量删除
export const batchDeleteOperActivityPackage_2 = '/admin/operActivityPackage/batchDeleteOperActivityPackage_2';//批量下架
// 修改套餐状态
export const updateOperActivityPackageStatusById_1 = '/admin/operActivityPackage/updateOperActivityPackageStatusById_1';//提交审核
export const updateOperActivityPackageStatusById_2 = '/admin/operActivityPackage/updateOperActivityPackageStatusById_2';//通过驳回审核
export const updateOperActivityPackageStatusById_3 = '/admin/operActivityPackage/updateOperActivityPackageStatusById_3';//套餐上架
export const updateOperActivityPackageStatusById_4 = '/admin/operActivityPackage/updateOperActivityPackageStatusById_4';//套餐下架
// 优惠套餐产品查询
export const queryPackageProductList = '/admin/operActivityPackageProduct/queryPackageProductList';
// 添加产品和规格
export const addPackageProduct = '/admin/operActivityPackageProduct/addPackageProduct';
// 修改产品库存
export const updatePackageSpecValueStock = '/admin/operActivityPackageSpecValue/updatePackageSpecValueStock';
// 查看库存管理
export const queryPackageSpecValueStockList = '/admin/operActivityPackageSpecValue/queryPackageSpecValueStockList';
// 修改优惠套餐价格和库存
export const updateOperActivityPackagePriceAndStock = '/admin/operActivityPackage/updateOperActivityPackagePriceAndStock';
// 查询优惠套餐价格库存管理
export const queryPackageSpecValueLPriceAndStockList = '/admin/operActivityPackageSpecValue/queryPackageSpecValueLPriceAndStockList';
// 查看套餐详情
export const findOperActivityPackageDetailsById = '/admin/operActivityPackage/findOperActivityPackageDetailsById';
// 添加套餐
export const addOperActivityPackage = '/admin/operActivityPackage/addOperActivityPackage';
// 编辑套餐数据
export const updateOperActivityPackage = '/admin/operActivityPackage/updateOperActivityPackage';
// 编辑套餐数据回显
export const findOperActivityPackageById = '/admin/operActivityPackage/findOperActivityPackageById';


/**************公用*****************/
// 新建商品查询
export const queryProductByNameOrCode='admin/operator/queryProductByNameOrCode';
// 新建商品规格查询
export const queryProductSpecById='/admin/operator/queryProductSpecById';
// 发布人列表
export const operatorqueyByStatus = '/admin/adminUser/operatorqueyByStatus';
// 获取一二级类目列表
export const getCategoryList = '/admin/productCategory/queryProductCategoryPageList';
// 根据类目查询品牌列表
export const queryCategoryBrandCid = 'admin/categoryBrand/queryCategoryBrandCid';
// 上传图片
export const addImg='/admin/ossClient/aliyunOSSUploadImage';
// 获取供应商列表
export const querySupplierBrandPageList = '/admin/supplierBrand/querySupplierBrandPageList';
// 获取模板列表
export const getFreightTemplateList = '/admin/freightTemplate/getFreightTemplateList';
// 获取所有标签
export const queryTagLibraryList = '/admin/tagLibrary/queryTagLibraryList';
// 添加新标签
export const addTagLibrary = '/admin/tagLibrary/addTagLibrary';
