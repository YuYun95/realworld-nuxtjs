<template>
  <div class="article-meta">
    <nuxt-link
      :to="{name: 'profile', params:{username:article.author.username}}">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        class="author"
        :to="{name: 'profile',
        params:{username:article.author.username}}"
      >
        {{article.author.username}}
      </nuxt-link>
      <span class="date">{{article.createdAt | date('MMM DD, YYYY')}}</span>
    </div>
    <span v-if="article.author.username!== user.username">
      <button
        :class="{active: article.author.following}"
        class="btn btn-sm btn-outline-secondary"
        @click="handlerFollow(article.author.username)"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{article.author.following ? 'Unfollow' : 'Follow'}} {{article.author.username}}
      </button>
      &nbsp;&nbsp;
      <button
        :class="{active: article.favorited}"
        class="btn btn-sm btn-outline-primary"
        @click="onFavorite"
      >
        <i class="ion-heart"></i>
        &nbsp;
        {{article.favorited ? 'UnFavorite Article' : 'Favorite Article'}} <span class="counter">({{article.favoritesCount
        }})</span>
      </button>
    </span>
    <span v-else>
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="{name: 'editor',params: {slug: article.slug,},}"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>

      <button
        class="btn btn-outline-danger btn-sm"
        :class="{ disabled: article.isDeleting }"
        @click="handlerDelete(article)"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { followAuthor, unFollow, addFavorite, deFavorite, deleteArticle } from '@/api/article'

export default {
  name: 'ArticleMeta',

  props: {
    article: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapState(['user'])
  },

  methods: {
    async handlerDelete(article) {
      this.article.isDeleting = true
      await deleteArticle(article.slug)
      this.article.isDeleting = false
      this.$router.push('/')
    },

    async handlerFollow(author) {
      const isFollow = this.article.author.following
      if (isFollow) {
        try {
          const { data } = await unFollow(author)
          this.$emit('updata', false)
        } catch (e) {
        }
      } else {
        try {
          const { data } = await followAuthor(author)
          this.$emit('updata', true)
        } catch (e) {
        }
      }
    },

    async onFavorite(){
      const article = this.article
      if (article.favorited) {
        // 取消点赞
        await deFavorite(article.slug)
        this.$emit('onFavorite', false)
      }else {
        // 添加点赞
        await addFavorite(article.slug)
        this.$emit('onFavorite', true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
