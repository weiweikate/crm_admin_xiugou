import request from '@/http/http.js';
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
            },
        };
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.page.currentPage = val;
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
                console.log(res);
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
export { getUserId, myMixinTable, queryDictonary };
