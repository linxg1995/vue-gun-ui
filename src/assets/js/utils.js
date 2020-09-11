/*
 * @Description: 工具类函数管理
 * @Author: LXG
 * @Date: 2020-05-14
 * @LastEditTime: 2020-09-11
 */

// SortHandler类 排序器
class SortHandler {
    constructor() {
        this.OPTION = undefined // 全局选项
        this.BASE_ORDER = undefined // 全局基础排序值
        this.prep = undefined // 前队列
        this.mid = undefined // 中队列
        this.ap = undefined // 后队列
    }

    beforeHandle(arr, option) {
        this.OPTION = Object.assign({
            sortKey: '', // 排序字段，默认本身
            baseOrder: 50, // 基础排序值
            desc: false // 降序，默认升序
        }, option)
        this.BASE_ORDER = this.OPTION.baseOrder
        this.prep = new Array()
        this.mid = new Array()
        this.ap = new Array()
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].prepOrder != undefined &&
                arr[i].prepOrder != null) {
                this.prep.push(arr[i])
                continue
            }
            if (arr[i].apOrder != undefined &&
                arr[i].apOrder != null) {
                this.ap.push(arr[i])
                continue
            }
            this.mid.push(arr[i])
        }
    }
    bubble(sourceArr, option) {
        // 长度小于等于1时不需要排序
        if (sourceArr.length <= 1) {
            return sourceArr
        }
        this.beforeHandle(sourceArr, option)

        this.prep = bubbleSort.call(this, this.prep, 'prepOrder')
        this.mid = bubbleSort.call(this, this.mid, this.OPTION.sortKey)
        this.ap = bubbleSort.call(this, this.ap, 'apOrder')

        return this.afterHandle()

        function bubbleSort(arr, key) {
            if (arr.length <= 1) {
                return arr
            }
            let [left, right] = [null, null]
            for (let i = 0, l = arr.length; i < l; i++) {
                for (let j = 0, m = l - 1; j < m - i; j++) {
                    left = key ? (arr[m - j - 1][key] ?? this.DEF_ORDER) : arr[m - j - 1]
                    right = key ? (arr[m - j][key] ?? this.DEF_ORDER) : arr[m - j]
                    if (right < left) {
                        [arr[m - j - 1], arr[m - j]] = [arr[m - j], arr[m - j - 1]]
                    }
                }
            }
            return arr
        }
    }
    quick(sourceArr, option) {
        // 长度小于等于1时不需要排序
        if (sourceArr.length <= 1) {
            return sourceArr
        }
        this.beforeHandle(sourceArr, option)

        this.prep = quickSort.call(this, this.prep, 'prepOrder')
        this.mid = quickSort.call(this, this.mid, this.OPTION.sortKey)
        this.ap = quickSort.call(this, this.ap, 'apOrder')

        return this.afterHandle()

        function quickSort(arr, key) {
            if (arr.length <= 1) {
                return arr
            }
            let [left, basic, right] = [[], arr[0], []]
            // 空值合并运算符
            let basVal = key ? (basic[key] ?? this.DEF_ORDER) : basic
            let compVal = null
            for (let i = 1; i < arr.length; i++) {
                compVal = key ? (arr[i][key] ?? this.DEF_ORDER) : arr[i]
                if (compVal < basVal) {
                    left.push(arr[i])
                } else {
                    right.push(arr[i])
                }
            }
            return [...quickSort.call(this, left, key), basic, ...quickSort.call(this, right, key)]
        }
    }
    merge(sourceArr, option) {
        // 长度<=1时不需要排序
        if (sourceArr.length <= 1) {
            return sourceArr
        }

        this.beforeHandle(sourceArr, option)

        console.log(sourceArr);
        branch.call(this, sourceArr)

        function branch(arr, start = 0, end = arr.length - 1) {
            // 拆成1个时不需要再归并
            if (end <= start) return
            let mid = parseInt((start + end) / 2)
            branch.call(this, arr, start, mid)
            branch.call(this, arr, mid + 1, end)
            mergeSort.call(this, arr, start, mid, end)
        }
        function mergeSort(arr, start, mid, end) {
            let temp = new Array()
            console.log('mergeSort', start, mid, end)
            let [i, j] = [start, mid + 1]
            do {
                if (arr[i] <= arr[j]) {
                    temp.push(arr[i++])
                } else {
                    temp.push(arr[j++])
                }
            } while (i <= mid && j <= end);
            while (i <= mid) {
                temp.push(arr[i++])
            }
            while (j <= end) {
                temp.push(arr[j++])
            }
            for (let k = 0; k < temp.length; k++) {
                arr[start + k] = temp[k];
            }
        }
    }
    afterHandle() {
        if (this.OPTION.desc) {
            this.mid = this.mid.reverse()
        }
        return this.prep.concat(this.mid, this.ap)
    }

}
// SortHandler实例
const sort = new SortHandler()

export default {
    /**
     * @description: 校验非空
     * @param {String||Number||Array||Object} targ 校验目标
     * @param {String} type 校验类型
     */
    checkNotNull(targ, type) {
        if (targ === undefined || targ === null) {
            return false
        }

        if (!type) {
            switch (typeof targ) {
                case 'string':
                case 'number':
                    type = (typeof targ)
                    break
                case 'object':
                    if (targ instanceof Array) {
                        type = 'array'
                    } else if (targ instanceof Object) {
                        type = 'object'
                    }
                    break
                default:
                    break
            }
        }
        switch (type) {
            case 'string':
                return (targ !== '')
            case 'number':
                return (!isNaN(targ))
            case 'array':
                return (targ.length ? true : false)
            case 'object':
                return (JSON.stringify(targ) !== '{}')
            default:
                return false
        }
    },
    /**
     * @description: 生成UUID
     * @param {Boolean} needLine 需要横杠隔开
     */
    createUUID(needLine = true) {
        function createFourFigures() {
            let number = Math.floor(Math.random() * 61440) + 4096
            return number.toString(16)
        }

        let uuid = [
            '',
            createFourFigures(),
            createFourFigures(),
            createFourFigures(),
            ''
        ]
        for (let i = 0; i < 2; i++) {
            uuid[0] += createFourFigures()
            uuid[4] += createFourFigures()
        }
        uuid[4] += createFourFigures()

        uuid = uuid.join(needLine ? '-' : '')

        // console.log("uuid:", uuid)
        return uuid
    },
    /**
     * @description: 对象可选链操作
     * @param {Object} sourceObj 源对象
     * @param {Array} propQueue 属性队列
     */
    optChain(sourceObj, propQueue = []) {
        let val = sourceObj
        for (let i = 0; i < propQueue.length; i++) {
            val = val?.[propQueue[i]]
        }
        return val
    },
    /**
     * @description: 排序器
     * @description: .bubble() 冒泡排序
     * @description: .quick() 快速排序
     * @param {Array} sourceArr 源数组
     * @param {Object} option 选项
     * @param {String}  option.sortKey 排序字段
     * @param {Boolean} option.desc 是否倒序
     */
    sort,
    /**
     * @description: 节流
     * @param {Function} fn 执行函数
     * @param {Number} delay 延迟时间
     */
    throttle() {
        let time = null
        return function (fn, delay) {
            if (!time) {
                fn()
                time = setTimeout(function () {
                    clearTimeout(time)
                    time = null
                }, delay);
            }
        }
    }
}