/*
 * @Description: 工具类函数管理
 * @Author: LXG
 * @Date: 2020-05-14
 * @LastEditTime: 2020-09-14
 */

// SortHandler类 排序器
class SortHandler {
    constructor() {
        this.OPTION = undefined // 全局选项
        this.BASE_ORDER = undefined // 全局基础排序值
        this.compare = undefined // compare()比较函数
    }

    beforeHandle(arr, option) {
        this.OPTION = Object.assign({
            sortKey: '', // 排序字段，默认本身
            baseOrder: 50, // 基础排序值
        }, option)
        this.BASE_ORDER = this.OPTION.baseOrder
        this.compare = this.OPTION.compare || this.defComp
    }
    bubble(sourceArr, option) {
        // 长度<=1时不需要排序
        if (sourceArr.length <= 1) {
            return sourceArr
        }

        this.beforeHandle(sourceArr, option)

        bubbleSort.call(this, sourceArr)

        function bubbleSort(arr) {
            let compRes = null
            for (let i = 0, l = arr.length; i < l; i++) {
                for (let j = 0, m = l - i - 1; j < m; j++) {
                    if (this.OPTION.compare) {
                        compRes = this.OPTION.compare(arr[l - j - 2], arr[l - j - 1])
                    } else {
                        compRes = this.compare(arr[l - j - 2], arr[l - j - 1])
                    }
                    if (!compRes) {
                        let temp = arr[l - j - 2]
                        arr[l - j - 2] = arr[l - j - 1]
                        arr[l - j - 1] = temp
                    }
                }
            }
        }
    }
    quick(sourceArr, option) {
        // 长度<=1时不需要排序
        if (sourceArr.length <= 1) {
            return sourceArr
        }

        this.beforeHandle(sourceArr, option)

        quickSort.call(this, sourceArr)

        function quickSort(arr, start = 0, end = arr.length - 1) {
            if (end <= start) return
            let temp = [arr[start]]
            let mid = start
            for (let i = start + 1; i <= end; i++) {
                if (this.compare(arr[start], arr[i])) {
                    temp.push(arr[i])
                } else {
                    temp.unshift(arr[i])
                    mid++
                }
            }
            for (let i = 0; i < temp.length; i++) {
                arr[start + i] = temp[i];
            }
            quickSort.call(this, arr, start, mid - 1)
            quickSort.call(this, arr, mid + 1, end)
        }
    }
    merge(sourceArr, option) {
        // 长度<=1时不需要排序
        if (sourceArr.length <= 1) {
            return sourceArr
        }

        this.beforeHandle(sourceArr, option)

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
            let [i, j] = [start, mid + 1]
            let compRes = null
            do {
                if (this.OPTION.compare) {
                    compRes = this.OPTION.compare(arr[i], arr[j])
                } else {
                    compRes = this.compare(arr[i], arr[j])
                }
                if (compRes) {
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
    defComp(x, y) {
        if (this.OPTION.sortKey) {
            x = x[this.OPTION.sortKey] ?? this.BASE_ORDER
            y = y[this.OPTION.sortKey] ?? this.BASE_ORDER
        }
        return (x <= y)
    }
}

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
    SortHandler,
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