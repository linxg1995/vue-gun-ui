/*
 * @Description: 工具类函数管理
 * @Author: LXG
 * @Date: 2020-05-14
 * @LastEditTime: 2020-06-08
 */
/**
     * @description: 数组快速排序
     * @param {Array} sourceArr 源数组
     * @param {String} conf 配置
     */
function quicksort(sourceArr, conf = {}) {
    let config = Object.assign({
        sortKey: '', // 排序字段
        DESC: false // 降序
    }, conf)

    if (sourceArr.length <= 1) {
        return sourceArr
    }
    const basic = sourceArr[0]
    let left = [], right = []
    for (let i = 1; i < sourceArr.length; i++) {
        if ((sourceArr[i][config.sortKey] || sourceArr[i])
            <
            (basic[config.sortKey] || basic)) {
            left.push(sourceArr[i])
        } else {
            right.push(sourceArr[i])
        }
    }
    if (config.DESC) {
        return [...quicksort(right, conf), basic, ...quicksort(left, conf)]
    }
    return [...quicksort(left, conf), basic, ...quicksort(right, conf)]

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