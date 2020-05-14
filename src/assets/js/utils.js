/*
 * @Description: 工具类方法管理
 * @Author: LXG
 * @Date: 2020-05-14
 * @LastEditTime: 2020-05-14
 */
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
                return (targ.length)
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
    }
}