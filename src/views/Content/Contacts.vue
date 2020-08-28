<template>
  <v-col xl="10" lg="10" md="10" cols="12">
    <Messager :message="message" />
    <v-row>
      <v-col cols="12">
        <h1 class="font-weight-thin text-center">Обратная связь</h1>
      </v-col>
    </v-row>
    <Loader v-if="loading" />
    <v-row v-else>
      <v-col cols="12">
        <h3
          class="font-weight-light"
        >Здесь вы можете написать письмо о проблеме на сайте или по сотрудничеству</h3>
        <form @submit.prevent="sendMail">
          <v-row>
            <v-col cols="6">
              <v-text-field required v-model="mail.name" label="Ваше имя"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field required v-model="mail.email" label="Ваш Email" type="email"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field required v-model="mail.subject" label="Тема сообщения"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea required v-model="mail.message" label="Сообщение"></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn type="submit" tile x-large block>Отпавить</v-btn>
            </v-col>
          </v-row>
        </form>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  async mounted () {
    await this.$store.dispatch('meta/read')
    this.title = this.$store.getters['meta/list'][3].title
    this.desc = this.$store.getters['meta/list'][3].desc
    await this.$store.dispatch('users/getInfo')
    const user = this.$store.getters['users/info'] || {}
    this.mail.name = user.name || ''
    this.mail.email = user.email || ''
    this.loading = false
  },
  data () {
    return {
      loading: true,
      mail: {
        name: '',
        email: '',
        subject: '',
        message: '',
        isNew: true,
        date: new Date().toLocaleString()
      },
      message: '',
      title: '',
      desc: ''
    }
  },
  methods: {
    async sendMail () {
      try {
        this.loading = true
        await this.$store.dispatch('contact/create', this.mail)
        // сделать через глобальный компонент уведомлений!
        this.message = 'Письмо отправленно!'
        this.mail.subject = ''
        this.mail.message = ''
        this.loading = false
      } catch (error) {
        // сделать через глобальный компонент уведомлений!
        this.message = 'Письмо не отправленно.'
      }
    }
  },
  metaInfo () {
    return {
      title: '| ' + this.title.toUpperCase(),
      meta: [{
        vmid: 'description',
        name: 'description',
        content: this.desc
      }]
    }
  }
}
</script>

<style lang="less">
</style>
