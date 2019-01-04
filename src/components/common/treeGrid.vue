<!--
* @events  @on-row-click 单击行或者单击操作按钮方法
           @on-selection-change  多选模式下 选中项变化时触发
  @props   items 显示的结构化数据
           columns 表格列的配置描述
           type: 'selection'为多选功能 type: 'action' 为操作功能 actions:[{}] 操作按钮
-->
<template>
    <div :style="{'width': tableWidth}" class='autoTable'>
        <table class="table table-bordered" id='mr-tree-table'>
            <thead>
            <tr>
                <th v-for="(column,index) in cloneColumns">
                    <label>
                        {{ renderHeader(column, index) }}
                    </label>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in initItems" :key="item.id" v-show="show(item)" :class="item.parent ? 'child-tr': ''" :data-expanded="expanded">
                <td v-for="(column, snum) in columns" :key="column.key" :style=tdStyle(column,snum)>
                    <div v-if="column.type === 'action'">
                        <el-button :type="action.type" size="small" @click="RowClick(item,index,action.trigger,$event)" v-for='action in (column.actions)' :key="action.text">{{renderButtonText(action, item)}}</el-button>
                    </div>
                    <label @click="toggle(index,item)" v-if="!column.type">
                        <span v-if='snum === 0'>
                            <i v-html='item.spaceHtml'></i>
                            <i class="ms-tree-space"></i>
                            <i v-if='item.children && item.children.length>0 || item.level === 1'  :class="item.expanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                            <i v-else class="ms-tree-space"></i>
                            <!--<i  :class="item.expanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>-->
                        </span> {{renderBody(item,column) }}
                    </label>
                </td>
            </tr>
            <tr v-if="initItems.length === 0">
                <td :colspan="cloneColumns.length">暂无数据</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
    export default {
        name: 'treeGrid',
        props: {
            columns: Array,
            items: {
                type: Array,
                'default': function() {
                    return [];
                }
            },
            doc: {
                type: Object,
                'default': {}
            }
        },
        data() {
            return {
                initItems: [], // 处理后数据数组
                cloneColumns: [], // 处理后的表头数据
                screenWidth: document.body.clientWidth, // 自适应宽
                tdsWidth: 0, // td总宽
                timer: false, // 控制监听时长
                dataLength: 0, // 树形数据长度
                openList: {} // 打开状态列表
            };
        },
        computed: {
            tableWidth() {
                return this.tdsWidth > this.screenWidth && this.screenWidth > 0 ? this.screenWidth + 'px' : '100%';
            }
        },
        watch: {
            screenWidth(val) {
                if (!this.timer) {
                    this.screenWidth = val;
                    this.timer = true;
                    setTimeout(() => {
                        this.timer = false;
                    }, 400);
                }
            },
            items: {
                handler() {
                    if (this.items) {
                        this.dataLength = this.Length(this.items);
                        this.initData(this.deepCopy(this.items), 1, null);
                    }
                },
                deep: true
            },
            columns: {
                handler() {
                    this.cloneColumns = this.makeColumns();
                },
                deep: true
            }
        },
        mounted() {
            if (this.items) {
                this.dataLength = this.Length(this.items);
                this.initData(this.deepCopy(this.items), 1, null);
                this.cloneColumns = this.makeColumns();
            }
            // 绑定onresize事件 监听屏幕变化设置宽
            this.$nextTick(() => {
                this.screenWidth = document.body.clientWidth;
            });
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.body.clientWidth;
                    this.screenWidth = window.screenWidth;
                })();
            };
        },
        methods: {
            // 设置td宽度,td的align
            tdStyle(column, index) {
                const style = {};
                if (column.align) {
                    style['text-align'] = column.align || 'center';
                }
                if (column.width) {
                    style['min-width'] = column.width + 'px';
                }
                if (index === 0) {
                    style['padding'] = 'padding: 0 20px 0 8px;';
                    style['text-align'] = 'left';
                    style['overflow'] = 'hidden';
                    style['white-space'] = 'nowrap';
                }
                return style;
            },
            // 点击某一行事件
            RowClick(data, index, trigger, event) {
                const result = this.makeData(data);
                this.$emit('on-row-click', result, index, data, trigger, event);
            },
            // 点击事件 返回数据处理
            makeData(data) {
                const t = this.type(data);
                let o;
                if (t === 'array') {
                    o = [];
                } else if (t === 'object') {
                    o = {};
                } else {
                    return data;
                }
                if (t === 'array') {
                    for (let i = 0; i < data.length; i++) {
                        o.push(this.makeData(data[i]));
                    }
                } else if (t === 'object') {
                    for (const i in data) {
                        if (i != 'spaceHtml' && i != 'parent' && i != 'level' && i != 'expanded' && i != 'isShow' && i !=
                            'load') {
                            o[i] = this.makeData(data[i]);
                        }
                    }
                }
                return o;
            },
            // 处理表头数据
            makeColumns() {
                const columns = this.deepCopy(this.columns);
                this.tdsWidth = 0;
                columns.forEach((column, index) => {
                    column._index = index;
                    column._width = column.width ? column.width : '';
                    column._sortType = 'normal';
                    this.tdsWidth += column.width ? parseFloat(column.width) : 0;
                });
                return columns;
            },
            // 数据处理 增加自定义属性监听
            initData(items, level, parent) {
                this.initItems = [];
                let spaceHtml = '';
                for (let i = 1; i < level; i++) {
                    spaceHtml += "<i class='ms-tree-space'></i>";
                }
                items.forEach((item, index) => {
                    item = Object.assign({}, item, {
                        'parent': parent,
                        'level': level,
                        'spaceHtml': spaceHtml
                    });
                    if ((typeof item.expanded) === 'undefined') {
                        item = Object.assign({}, item, {
                            'expanded': false
                        });
                    }
                    if ((typeof item.show) === 'undefined') {
                        item = Object.assign({}, item, {
                            'isShow': false
                        });
                    }
                    item = Object.assign({}, item, {
                        'load': item.expanded
                    });
                    this.initItems.push(item);
                    if (item.children && item.expanded) {
                        this.initData(item.children, level + 1, item);
                    }
                });
            },
            //  隐藏显示
            show(item) {
                return ((item.level === 1) || (item.parent && item.parent.expanded && item.isShow));
            },
            toggle(index) {
                const item = this.initItems[index];
                const level = item.level + 1;
                let spaceHtml = '';
                for (let i = 1; i < level; i++) {
                    spaceHtml += "<i class='ms-tree-space'></i>";
                }
                if (item.children && item.children.length) {
                    if (item.expanded) {
                        item.expanded = !item.expanded;
                        this.close(index, item);
                    } else {
                        item.expanded = !item.expanded;
                        if (item.load) {
                            this.open(index, item);
                        } else {
                            item.load = true;
                            item.children.forEach((child, childIndex) => {
                                this.initItems.splice((index + childIndex + 1), 0, child);
                                // 设置监听属性
                                this.$set(this.initItems[index + childIndex + 1], 'parent', item);
                                this.$set(this.initItems[index + childIndex + 1], 'level', level);
                                this.$set(this.initItems[index + childIndex + 1], 'spaceHtml', spaceHtml);
                                this.$set(this.initItems[index + childIndex + 1], 'isShow', true);
                                this.$set(this.initItems[index + childIndex + 1], 'expanded', false);
                            });
                            this.open(index, item);
                        }
                    }
                } else {
                    this.$emit('toggle-item', item, index);
                }
            },
            showItemById(id) {
                const len = this.initItems.length;
                for (let i = 0; i < len; i++) {
                    if (this.initItems[i].id === id) {
                        this.initItems[i].expanded = false;
                        this.toggle(i);
                        break;
                    }
                }
            },
            open(index, item) {
                if (!item.children) return;
                item.children.forEach((child, childIndex) => {
                    child.isShow = true;
                    if (child.children.length) {
                        // 原有点击一级展开一级  现在改为点击一级展开下面所有。 this.open(index + childIndex + 1, child);
                        const toggleIndex = this.getItemIndex(child);
                        if (toggleIndex >= 0) {
                            this.toggle(toggleIndex);
                        }
                    }
                });
            },
            close(index, item) {
                if (item.children) {
                    item.children.forEach((child, childIndex) => {
                        child.isShow = false;
                        child.expanded = false;
                        if (child.children) {
                            this.close(index + childIndex + 1, child);
                        }
                    });
                }
            },
            getItemIndex(item) {
                let index = null;
                this.initItems.forEach((_item, _index) => {
                    if (_item.id === item.id) {
                        index = _index;
                    }
                });
                return index;
            },
            itemShowList() {
                const obj = {};
                this.initItems.forEach(item => {
                    obj[item.id] = {
                        expanded: item.expanded,
                        isShow: item.isShow
                    };
                });
                this.openList = obj;
            },
            closeAll() {
                this.initItems.forEach((item, index) => {
                    item.expanded = false;
                    this.close(index, item);
                });
            },
            openAll() {
                this.initItems.forEach((item, index) => {
                    if (item.children && item.children.length) {
                        item.expanded = false;
                        this.toggle(index);
                    }
                });
            },
            // 数组去重
            getArray(a) {
                let hash = {},
                    len = a.length,
                    result = [];
                for (let i = 0; i < len; i++) {
                    if (!hash[a[i]]) {
                        hash[a[i]] = true;
                        result.push(a[i]);
                    }
                }
                return result;
            },
            All(data) {
                let arr = [];
                data.forEach((item) => {
                    arr.push(item.id);
                    if (item.children && item.children.length > 0) {
                        arr = arr.concat(this.All(item.children));
                    }
                });
                return arr;
            },
            // 返回树形数据长度
            Length(data) {
                let length = data.length;
                data.forEach((child) => {
                    if (child.children) {
                        length += this.Length(child.children);
                    }
                });
                return length;
            },
            // 返回表头
            renderHeader(column, $index) {
                if ('renderHeader' in this.columns[$index]) {
                    return this.columns[$index].renderHeader(column, $index);
                } else {
                    return column.title || '#';
                }
            },
            // 返回内容
            renderBody(row, column, index) {
                return this.doc[column.key] ? this.doc[column.key][row[column.key]] : row[column.key] || '/';
            },
            renderButtonText(action, item) {
                if (action.bind) {
                    return action.bind.bindValue === item.status ? action.text : action.bind.text;
                } else {
                    return action.text;
                }
            },
            // 深度拷贝函数
            deepCopy(data) {
                let t = this.type(data),
                    o, i, ni;
                if (t === 'array') {
                    o = [];
                } else if (t === 'object') {
                    o = {};
                } else {
                    return data;
                }
                if (t === 'array') {
                    for (i = 0, ni = data.length; i < ni; i++) {
                        o.push(this.deepCopy(data[i]));
                    }
                    return o;
                } else if (t === 'object') {
                    for (i in data) {
                        o[i] = this.deepCopy(data[i]);
                    }
                    return o;
                }
            },
            type(obj) {
                const toString = Object.prototype.toString;
                const map = {
                    '[object Boolean]': 'boolean',
                    '[object Number]': 'number',
                    '[object String]': 'string',
                    '[object Function]': 'function',
                    '[object Array]': 'array',
                    '[object Date]': 'date',
                    '[object RegExp]': 'regExp',
                    '[object Undefined]': 'undefined',
                    '[object Null]': 'null',
                    '[object Object]': 'object'
                };
                return map[toString.call(obj)];
            }
        },
        beforeDestroy() {
            window.onresize = null;
        }
    };
</script>
<style lang="less" scoped>
    .autoTable {
        overflow: auto;
    }
    table {
        width: 100%;
        border-spacing: 0;
        border-collapse: collapse;
        font-size: 12px;
        color: #606266;
        text-align: center;
    }
    .table-bordered {
        border: 1px solid #EBEBEB;
    }
    .table>tbody>tr>td,
    .table>tbody>tr>th,
    .table>thead>tr>td,
    .table>thead>tr>th {
        border-top: 1px solid #e7eaec;
        line-height: 1.42857;
        padding: 8px;
        vertical-align: middle;
    }
    .table-bordered>tbody>tr>td,
    .table-bordered>tbody>tr>th,
    .table-bordered>tfoot>tr>td,
    .table-bordered>tfoot>tr>th,
    .table-bordered>thead>tr>td,
    .table-bordered>thead>tr>th {
        border: 1px solid #e7e7e7;
    }
    .table>thead>tr>th {
        border-bottom: 1px solid #DDD;
    }
    .table-bordered>thead>tr>td,
    .table-bordered>thead>tr>th {
        background-color: #fff;
    }
    #mr-tree-table>tbody>tr {
        background-color: #fff;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    #mr-tree-table>tbody>.child-tr {
        background-color: #fff;
    }
    label {
        margin: 0 8px;
    }
    table {
        /deep/ .ms-tree-space {
            position: relative;
            top: 1px;
            display: inline-block;
            font-style: normal;
            font-weight: 400;
            line-height: 1;
            width: 14px;
            height: 14px;
        }
    }
    [class^=el-icon-] {
        font-size: 14px;
    }
    .ms-tree-space::before {
        content: ""
    }
    #mr-tree-table th>label {
        margin: 0;
    }
</style>
