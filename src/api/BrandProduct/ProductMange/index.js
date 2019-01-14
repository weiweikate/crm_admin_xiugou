// 获取一二级类目列表
export const getCategoryList = '/admin/productCategory/queryProductCategoryPageList';
// 根据类目查询品牌列表
export const queryCategoryBrandCid = 'admin/categoryBrand/queryCategoryBrandCid';
// 添加产品
export const addProduct = '/admin/product/addProduct';
// 上传图片
export const addImg = '/admin/ossClient/aliyunOSSUploadImage';
// 获取供应商列表
export const querySupplierBrandPageList = '/admin/supplierBrand/querySupplierBrandPageList';
// 获取模板列表
export const getFreightTemplateList = '/admin/freightTemplate/getFreightTemplateList';
// 获取所有标签
export const queryTagLibraryList = '/admin/tagLibrary/queryTagLibraryList';
// 添加新标签
export const addTagLibrary = '/admin/tagLibrary/addTagLibrary';
// 根据id获取产品详情
export const findProductById = '/admin/product/findProductById';
// 根据二级id产品id获取产品信息
export const querySaleSpecList = '/admin/saleSpec/querySaleSpecList';
// 编辑产品，根据id获取产品信息
export const findProductAllDataById = '/admin/product/findProductAllDataById';
// 添加规格
export const addSaleSpecValue = '/admin/saleSpecValue/addSaleSpecValue';
// 删除规格
export const deleteSaleSpecValue = '/admin/saleSpecValue/deleteSaleSpecValue';
// 提交产品规格
export const addProductSpec = '/admin/price/addProductSpec';
// 获取产品价格
export const queryProductPriceSaleSpecList = '/admin/price/queryProductPriceSaleSpecList';
// 保存产品价格
export const updateProductPrice = '/admin/price/updateProductPrice';
// 获取库存列表
export const queryProductStockList = '/admin/price/queryProductStockList';
// 保存库存信息
export const updateProductStock = '/admin/price/updateProductStock';
// 产品审核操作
export const updateProductStatus = '/admin/product/updateProductStatus';
// 产品上架/下架操作
export const updateProductShelves = '/admin/product/updateProductShelves';
// 批量操作
export const updateBatchProductStatus = '/admin/product/updateBatchProductStatus';
// 编辑产品
export const updateProduct = '/admin/product/updateProduct';

// 根据二级分类查询参数
export const infoParmByCategoryIdList = '/admin/infoParm/infoParmByCategoryIdList';
