<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ messages}}
              </li>
            </template>
          </ul>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input v-model="user.image" class="form-control" type="text" placeholder="URL of profile picture">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="user.bio" class="form-control form-control-lg" rows="8"
                          placeholder="Short bio about you"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="user.email" class="form-control form-control-lg" type="text" placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="user.password" class="form-control form-control-lg" type="password"
                       placeholder="Password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" @click.prevent="handleSubmit">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr/>
          <button class="btn btn-outline-danger" @click="handleLogout">Or click here to logout.</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined
import { mapState } from 'vuex'
import { updateUser } from '@/api/user'

export default {
  name: 'SettingsIndex',

  middleware: 'authenticated',

  data() {
    return {
      user: {
        bio: null,
        email: null,
        image: null,
        username: null,
        password: ''
      },
      errors: {}
    }
  },

  computed: {
    ...mapState({ storeUser: 'user' })
  },

  mounted() {
    this.user.bio = this.storeUser.bio
    this.user.email = this.storeUser.email
    this.user.image = this.storeUser.image
    this.user.username = this.storeUser.username
    this.user.password = this.storeUser.password
  },

  methods: {
    async handleSubmit() {
      try {
        const { data } = await updateUser({ user: this.user })

        this.$store.commit('setUser', data.user)

        Cookie.set('user', data.user)
        this.$router.push(`/profile/${data.user.username}`)
      } catch (e) {
        this.errors = e.response.data.errors
      }
    },

    handleLogout () {
      this.$store.commit('setUser', null)
      Cookie.set('user', null)
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>
