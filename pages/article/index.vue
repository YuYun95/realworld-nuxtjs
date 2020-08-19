<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">

        <h1>{{article.title}}</h1>

        <article-meta :article="article" @updata="handleFollowArticle" @onFavorite="handleFavorite" />

      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article" @updata="handleFollowArticle" @onFavorite="handleFavorite" />
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <article-comment v-if="user" :article="article" />
          <article-unlogin v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getArticle } from '@/api/article'
import MarkdownIt from 'markdown-it'
import ArticleMeta from './components/article-meta'
import ArticleComment from './components/article-comment'
import ArticleUnlogin from './components/article-unlogin'

export default {
  name: 'ArticleIndex',

  components: { ArticleUnlogin, ArticleComment, ArticleMeta },

  async asyncData({ params }) {
    const { data } = await getArticle(params.slug)
    const md = new MarkdownIt()
    const { article } = data
    article.body = md.render(article.body)
    return {
      article
    }
  },

  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  },

  computed: {
    ...mapState(['user'])
  },

  methods: {
    handleFollowArticle(value) {
      this.article.author.following = value
    },

    handleFavorite(value) {
      if (value) {
        this.article.favorited = value
        this.article.favoritesCount += 1
      } else {
        this.article.favorited = value
        this.article.favoritesCount += -1
      }
    }
  }
}
</script>

<style scoped>

</style>
