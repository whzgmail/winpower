import { getToken } from '@/utils'
import {useStore} from '/src/stores';
function handleKeepAlive (to) {
    if (to.matched && to.matched.length > 2) {
        for (let i = 0; i < to.matched.length; i++) {
            const element = to.matched[i]
            if (element.components.default.name === 'layout') {
                to.matched.splice(i, 1)
                handleKeepAlive(to)
            }
        }
    }
}

export function beforeEach (to, from){
    if (
        // 检查用户是否已登录
        !getToken() &&
        // ❗️ 避免无限重定向
        to.name !== 'login'
    ) {
        // 将用户重定向到登录页面
        return { name: 'login' }
    }
}