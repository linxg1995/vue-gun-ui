/*
 * @Description: 工具类函数管理
 * @Author: LXG
 * @Date: 2020-05-14
 * @LastEditTime: 2020-07-01
 */
/**
     * @description: 数组快速排序
     * @param {Array} sourceArr 源数组
     * @param {String} conf 配置
     */
function quicksort(sourceArr, config = {}) {
    // 长度小于等于1时不需要排序
    if (sourceArr.length <= 1) {
        return sourceArr
    }

    const conf = Object.assign({
        sortKey: '', // 排序字段
        desc: false // 降序
    }, config)
    // 归类
    let [prepend, mid, append] = [[], [], []]
    for (let i = 0; i < sourceArr.length; i++) {
        if (sourceArr[i].prepOrder != undefined &&
            sourceArr[i].prepOrder != null) {
            prepend.push(sourceArr[i])
            continue
        }
        if (sourceArr[i].apOrder != undefined &&
            sourceArr[i].apOrder != null) {
            append.push(sourceArr[i])
            continue
        }
        mid.push(sourceArr[i])
    }
    // 递归排序
    [prepend, mid, append] = [
        sort(prepend, 'prepOrder'),
        sort(mid, conf.sortKey),
        sort(append, 'apOrder')
    ]

    return [...prepend, ...mid, ...append]

    function sort(arr, key) {
        if (arr.length <= 1) {
            return arr
        }
        let [left, basic, right] = [[], arr[0], []]
        for (let i = 1; i < arr.length; i++) {
            if ((arr[i][key] || arr[i])
                <
                (basic[key] || basic)) {
                left.push(arr[i])
            } else {
                right.push(arr[i])
            }
        }
        if (conf.desc) {
            return [...sort(right, key), basic, ...sort(left, key)]
        } else {
            return [...sort(left, key), basic, ...sort(right, key)]
        }
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
    quicksort
}