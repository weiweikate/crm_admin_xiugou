import request from '@/http/http.js';
import utils from '@/utils/index.js';

const getUserId = {
    methods: {
        getUserId() {
            this.id = this.$route.query.memberId || JSON.parse(sessionStorage.getItem('memberId'));
        }
    }
};
// 分页
const myMixinTable = {
    data() {
        return {
            page: {
                currentPage: 1,
                totalPage: 0,
                pageSize: 20
            }
        };
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.page.currentPage = val;
            console.log(`当前页: ${this.page.currentPage}`);
            this.getList(val);
        },
        getTbaleHeight() {
            const winHeight = window.screen.availHeight - 520;
            this.height = winHeight;
        }
    }
};
// 数据字典
const queryDictonary = {
    data() {
        return {
            dicNum: 0,
            divDKey: '',
            tmpAxiosData: ''
        };
    },
    methods: {
        async queryDictonary(dKey = 'WTLX') {
            this.divDKey = dKey;
            const data = {
                code: dKey
            };
            await request.queryDictionaryDetailsType(data).then(res => {
                this.tmpAxiosData = res.data;
            }).catch(err => {
                this.dicNum++;
                console.log(err);
                if (this.dicNum < 3) {
                    this.queryDictonary(this.divDKey);
                }
            });
        }
    }
};

// 上传图片限制
const beforeAvatarUpload = {
    data() {
        return {};
    },
    methods: {
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt3M = file.size / 1024 / 1024 < 3;
            if (!isJPG || !isLt3M) {
                this.$message.error('请上传3M以内jpg,jpeg,png格式的图片!');
            }
            return isJPG && isLt3M;
        }
    }
};
// 上传图片
const uploadImage = {
    data() {
        return {
            imageInfoMix: {}
        };
    },
    methods: {
        /**
         * 上传之前
         * @param file 文件
         * @param name 保存图片的字段
         * @param size 尺寸限制 e.g. ['100*100','200*200']
         * @returns {Promise<any | never>}
         */
        beforeUploadImage(file, name, size) {
            const that = this;
            if (!this.imageInfoMix[name] && !(this.imageInfoMix[name] instanceof Array)) {
                this.imageInfoMix[name] = [];
            }
            return new Promise(function(resolve, reject) {
                if (file.type.split('/')[0] != 'image') {
                    reject('请上传图片!');
                }
                const _URL = window.URL || window.webkitURL;
                const image = new Image();
                image.onload = function() {
                    const realWidth = image.width;
                    const realHeight = image.height;
                    const realSize = `${realWidth}*${realHeight}`;
                    if (size) {
                        if (size.includes(realSize)) {
                            that.imageInfoMix[name].push({
                                uid: file.uid,
                                width: realWidth,
                                height: realHeight,
                                size: `${Math.ceil(file.size / 1024)}kb`,
                                url: '',
                                uploading: true
                            });
                            resolve();
                        } else {
                            reject(`${file.name}上传图片尺寸不符合!`);
                        }
                    } else {
                        that.imageInfoMix[name].push({
                            uid: file.uid,
                            width: realWidth,
                            height: realHeight,
                            size: `${Math.ceil(file.size / 1024)}kb`,
                            url: '',
                            upload: false
                        });
                        resolve();
                    }
                };
                image.src = _URL.createObjectURL(file);
            }).then(() => {
                return file;
            }, (err) => {
                console.log(err);
                this.$notify.warning(err);
                return Promise.reject();
            }
            );
        },
        /**
         * 正在上传
         * @param file 文件
         * @param name 保存图片的字段
         * @param event 上传事件
         * @returns {Promise<any | never>}
         */
        onProgressImage(event, file, name) {
            console.log('正在上传');
            const list = this.imageInfoMix[name];
            list.forEach(v => {
                if (v.uid === file.uid) {
                    this.$notify.warning(`${file.name}正在上传(${event.percent}%)`);
                }
            });
        },
        /**
         * 上传成功
         * @param file 文件
         * @param name 保存图片的字段
         * @param res 接口返回值
         * @returns {Promise<any | never>}
         */
        onSuccessImage(res, file, name) {
            const list = this.imageInfoMix[name];
            list.forEach(v => {
                if (v.uid === file.uid) {
                    v.url = res.data;
                    v.upload = true;
                    this.$notify.success(`${file.name}上传成功`);
                }
            });
        },
        /**
         * 上传失败
         * @param file 文件
         * @param name 保存图片的字段
         * @param res 接口返回值
         * @returns {Promise<any | never>}
         */
        onErrorImage(res, file, name) {
            const list = this.imageInfoMix[name];
            list.forEach(v => {
                if (v.uid === file.uid) {
                    v.url = res.data;
                    v.upload = false;
                    this.$notify.error(`${file.name}上传失败`);
                }
            });
        }
    }
};

// 商品预览弹窗
const myProductDialog = {
    data() {
        return {
            mask: false,
            src: ''
        };
    },
    methods: {
        toH5(code) {
            this.mask = true;
            this.src = utils.getSrc(code);
        },
        closeMask() {
            this.mask = false;
        }
    }
};
export { getUserId, myMixinTable, queryDictonary, beforeAvatarUpload, uploadImage, myProductDialog };
