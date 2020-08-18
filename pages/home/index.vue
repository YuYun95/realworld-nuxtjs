<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">拉勾</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link class="nav-link" :class="{active: tab ==='your_feed'}"
                           :to="{name: 'home',query:{tab:'your_feed'}}" exact>Your Feed
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" :class="{active: tab ==='global_feed'}" :to="{name: 'home'}" exact>Global
                  Feed
                </nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link class="nav-link" :class="{active: tab ==='tag'}"
                           :to="{name: 'home',query:{tab:'tag',tag:tag}}" exact># {{tag}}
                </nuxt-link>
              </li>
            </ul>
          </div>

          <div v-for="article in articles" :key="article.slug" class="article-preview">
            <div class="article-meta">
              <nuxt-link :to="{ name:'profile', params:{ username:article.author.username }}">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link :to="{name:'profile', params:{ username:article.author.username }}" class="author">
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button @click="onFavorite(article)" class="btn btn-outline-primary btn-sm pull-xs-right" :class="{active:
              article.favorited}" :disabled="article.favoriteDisabled">
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="{name:'article', params: { slug: article.slug }}" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description}}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <!--分页列表-->
          <nav>
            <ul class="pagination">
              <li class="page-item" :class="{active: item === page}" v-for="item in totalPage" :key="item">
                <nuxt-link
                  class="page-link"
                  :to="{ name: 'home',
                        query: {
                        page: item,
                        tag: $route.query.tag,
                        tab: tab
                        }}"
                >
                  {{item}}
                </nuxt-link>
              </li>
            </ul>
          </nav>

        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="item in tags"
                :to="{name:'home', query:{tag:item, tab:'tag'}}"
                :key="item"
                class="tag-pill tag-default">
                {{item}}
              </nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getArticles, getYourFeedArticles, addFavorite, deFavorite } from '@/api/article'
import { getTags } from '@/api/tag'

export default {
  name: 'HomeIndex',

  watchQuery: ['page', 'tag', 'tab'],

  async asyncData({ query }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    const tab = query.tab || 'global_feed'
    const tag = query.tag
    const loadArticles = tab === 'global_feed' ? getArticles : getYourFeedArticles

    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit,
        tag,
        offset: (page - 1) * limit
      }),
      getTags()
    ])

    const { articles, articlesCount } = articleRes.data
    const { tags } = tagRes.data

    // 主动给article增加一个favoriteDisabled属性
    // 用来控制用户无法频繁点击，避免因为网络原因导致视图和数据库的点赞数不一致
    // 下面这句话写在asyncData方法的return之前
    articles.forEach(article => article.favoriteDisabled = false)

    return {
      articles, // 文章列表
      articlesCount, // 文章总数
      tags, // 标签列表
      limit, // 每页大小
      page, // 页码
      tab, // 选项卡
      tag // 数据标签
    }
  },

  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },

  methods: {
    async onFavorite(article) {
      article.favoriteDisabled = true // 不允许点击
      if (article.favorited) {
        // 取消点赞
        await deFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false // 允许点击
    }
  }
}

</script>

<style scoped>

</style>
