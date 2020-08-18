<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea v-model="comment" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" @click.prevent="handleAddComment">
          Post Comment
        </button>
      </div>
    </form>

    <div v-for="comment in comments" :key="comment.id" class="card">
      <div class="card-block">
        <p class="card-text">{{comment.body}}</p>
      </div>
      <div class="card-footer">
        <nuxt-link :to="{name: 'profile', pragma:{username:comment.author.username}}" class="comment-author">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link :to="{name: 'profile', pragma:{username:comment.author.username}}" class="comment-author">
          {{comment.author.username}}
        </nuxt-link>
        <span class="date-posted">{{comment.createdAt | date('MMM DD, YYYY')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getComments, addComment } from '@/api/article'

export default {
  name: 'ArticleComment',

  props: {
    article: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      comments: [], // 文章评论列表
      comment: '' // 用户评论
    }
  },

  computed: {
    ...mapState(['user'])
  },

  async mounted() {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
  },

  methods: {
    async handleAddComment() {
      const { data } = await addComment(this.article.slug, this.comment)
      this.comments.unshift(data.comment)
      this.comment = ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
