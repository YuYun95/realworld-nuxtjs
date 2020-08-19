<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages" v-if="errors">
            <div v-for="(value, field) in errors" :key="field" class="ng-scope">
              <li v-for="error in value" :key="error" class="ng-binding ng-scope">
                {{field}} {{error}}
              </li>
            </div>
          </ul>
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input v-model="article.title" type="text" class="form-control form-control-lg"
                       placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="article.description" type="text" class="form-control"
                       placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="article.body" class="form-control" rows="8"
                          placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="tag" type="text" class="form-control" placeholder="Enter tags"
                       @keyup.enter="handlerEnterTag">
                <div class="tag-list">
                  <span v-for="(tag, index) in article.tagList" :key="index" class="tag-default tag-pill">
                  <i class="ion-close-round" @click="handlerRemoveTag(index)"></i>
                  {{tag}}
                </span>
                </div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click.prevent="handleSubmit">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { createArticle, getArticle, updateArticle } from '@/api/article'

export default {
  name: 'EditorIndex',

  // 在路由匹配组件渲染之前会执行中间件处理
  middleware: 'authenticated',

  data() {
    return {
      errors: null,
      slug: null,
      tag: '',
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      }
    }
  },

  async mounted() {
    const { slug } = this.$route.params
    if (slug) {
      this.slug = slug
      const { data } = await getArticle(slug)
      this.article = data.article
    }
  },

  methods: {
    handlerEnterTag() {
      this.article.tagList.push(this.tag)
      this.tag = ''
    },

    handlerRemoveTag(index) {
      this.article.tagList.splice(index, 1)
    },

    async handleSubmit() {
      try {
        if (this.slug) {
          const { data } = await updateArticle(this.slug, this.article)
          this.$router.push(`/article/${data.article.slug}`)
        } else {
          const { data } = await createArticle(this.article)
          this.$router.push(`/article/${data.article.slug}`)
        }

      } catch (e) {
        this.errors = e.response.data.errors
      }

    }
  }
}
</script>

<style scoped>

</style>
