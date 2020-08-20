<template>
  <div>
    <v-btn icon @click="addToWishList">
      <v-icon :color="color">mdi-heart</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" persistent max-width="490">
      <v-card>
        <v-card-text
          class="font-weight-light text-h5 pt-15"
        >Что бы добавить продукт в Избранное, войдите в систему</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn tile x-large color="primary" text @click="dialog = false">Отмена</v-btn>
          <router-link to="/login">
            <v-btn tile x-large color="secondary" text @click="dialog = false">Войти</v-btn>
          </router-link>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['id'],
  async mounted () {
    await this.$store.dispatch('users/getInfo')
    const wishList = this.$store.getters['users/info'].wishList
    if (typeof (wishList) !== 'undefined') {
      wishList.find((id) => {
        if (id === this.id) {
          this.color = 'error'
        }
      })
    }
  },
  data () {
    return {
      color: '',
      dialog: false
    }
  },
  methods: {
    async addToWishList () {
      const user = await this.$store.dispatch('users/getUid')
      if (this.color !== 'error') {
        if (user === null) {
          this.dialog = true
        } else {
          await this.$store.dispatch('users/addToWishList', this.id)
          this.color = 'error'
        }
      } else {
        await this.$store.dispatch('users/deleteToWishList', this.id)
        this.color = ''
      }
    }
  }
}
</script>

<style>
</style>
