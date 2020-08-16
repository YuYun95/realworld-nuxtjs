import request from '@/utils/request'

// 获取公共文章列表
export const getArticles = params => {
  return request({
    url: '/api/articles',
    method: 'GET',
    params
  })
}

export const getYourFeedArticles = params => {
  return request({
    headers: {
      // 添加用户身份，数据格式：Token空格Token数据
      Authorization: 'Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTA4NjU2LCJ1c2VybmFtZSI6ImppYWlsaW5nIiwiZXhwIjoxNjAyMDcyNDkyfQ.Uoz9baKbVzE8oDpLFzAsmhdIPqLnfDCLmEzU7A8Cfog'
    },
    url: '/api/articles/feed',
    method: 'GET',
    params
  })
}
