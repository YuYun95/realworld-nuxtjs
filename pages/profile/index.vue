<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{profile.username}}</h4>
            <p>
              {{profile.bio}}
            </p>
            <button v-if="profile.username !== user.username" class="btn btn-sm btn-outline-secondary action-btn"
                    @click="handlerFollow">
              <i class="ion-plus-round"></i>
              &nbsp;
              {{profile.following ? 'UnFollow' : 'Follow'}} {{profile.username}}
            </button>
            <button v-else class="btn btn-sm btn-outline-secondary action-btn">
              <nuxt-link :to="{name:'settings'}">
                <i class="ion-gear-a"></i>
                &nbsp;
                Edit Profile Settings
              </nuxt-link>
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{active: tab === 'my'}"
                  :to="{name: 'profile',params: {profile: profile.username},query: {tab: 'my'}}">
                  My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{active: tab === 'favorited'}"
                  :to="{name: 'profile',params: {profile: profile.username},query: {tab: 'favorited'}}">
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>

          <div v-for="article in articles" :key="article.slug" class="article-preview">
            <div class="article-meta">
              <nuxt-link
                :to="{name: 'profile', params:{username:article.author.username}}">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link :to="{name: 'profile', params:{username:article.author.username}}" class="author">
                  {{article.author.username}}
                </nuxt-link>
                <span class="date">{{article.createdAt | date('MMM DD, YYYY')}}</span>
              </div>
              <button
                :class="{active: article.favorited}"
                :disabled="article.favoriteDisabled"
                class="btn btn-outline-primary btn-sm pull-xs-right"
                @click="onFavorite(article)"
              >
                <i class="ion-heart"></i>
                {{article.favoritesCount}}
              </button>
            </div>
            <nuxt-link :to="{name:'article', params:{slug:article.slug}}" class="preview-link">
              <h1>{{article.title}}</h1>
              <p>{{article.description}}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li class="tag-default tag-pill tag-outline" v-for="tag in article.tagList" :key="tag">
                  {{tag}}
                </li>
              </ul>
            </nuxt-link>
          </div>
          <!-- 分页 -->
          <template v-if="totalPage">
            <nav>
              <ul class="pagination">
                <li class="page-item" :class="{active: item === page}" v-for="item in totalPage" :key="item">
                  <nuxt-link
                    class="page-link"
                    :to="{name: 'profile',
                  params: {username: profile.username},
                  query: {page: item,tab}}"
                  >
                    {{item}}
                  </nuxt-link>
                </li>
              </ul>
            </nav>
          </template>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getProfiles } from '@/api/profile'
import { getArticles, addFavorite, deFavorite, followAuthor, unFollow, } from '@/api/article'

export default {
  name: 'UserProfile',

  middleware: 'authenticated',

  data() {
    return {
      profile: {},
      tab: '',
      limit: '',
      page: '',
      articles: '',
      articlesCount: '',
    }
  },

  watch: {
    $route() {
      this.handleGetProfiles()
      this.handleGetArticles()
    }
  },

  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    },
  },

  mounted() {
    this.handleGetProfiles()
    this.handleGetArticles()
  },

  methods: {
    async handleGetProfiles() {
      const { data } = await getProfiles(this.$route.params.username || this.user.username)
      this.profile = data.profile
    },

    async handleGetArticles() {
      const { tab = 'my', page = 1 } = this.$route.query
      const { username } = this.$route.params
      const limit = 5
      const offset = (page - 1) * limit

      const articleParams = tab === 'my' ? { author: username } : { favorited: username }
      articleParams.limit = limit
      articleParams.offset = offset

      const [profileRes, articlesRes] = await Promise.all([
        getProfiles(username), getArticles(articleParams)
      ])
      const { profile } = profileRes.data
      const { articles, articlesCount } = articlesRes.data
      articles.forEach(article => article.favoriteDisabled = false)

      this.tab = tab
      this.limit = limit
      this.page = page
      this.profile = profile
      this.articles = articles
      this.articlesCount = articlesCount
    },

    async handlerFollow() {
      const author = this.profile.username
      const isFollow = this.profile.following
      if (isFollow) {
        try {
          await unFollow(author)
          this.profile.following = false
        } catch (e) {
        }
      } else {
        try {
          await followAuthor(author)
          this.profile.following = true
        } catch (e) {
        }
      }
    },

    async onFavorite(article) {
      if (!this.user) return this.$router.push('/login')
      article.favoriteDisabled = true // 禁用点击
      if (article.favorited) {
        // 取消点赞
        await deFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false // 允许点击
    },
  }
}
</script>

<style scoped>

</style>
