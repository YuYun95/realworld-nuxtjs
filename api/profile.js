import { request } from '@/plugins/request'

// 获取公共文章列表
export const getProfiles = username => {
  return request({
    url: `/api/profiles/${username}`,
    method: 'GET'
  })
}
