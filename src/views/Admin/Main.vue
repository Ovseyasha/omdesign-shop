<template>
  <v-col cols="12">
    <v-row>
      <v-col cols="12">
        <h1 class="font-weight-light text-center">Описание страниц сайта (SEO)</h1>
      </v-col>
    </v-row>
    <Loader v-if="loading" />
    <v-row v-else>
      <v-col v-for="(m,index) in meta" :key="index" xl="3" lg="3" md="3" cols="12">
        <v-text-field label="Название страницы" v-model="m.title"></v-text-field>
        <v-textarea
          label="Описание страницы"
          v-model="m.desc"
          hint="Это описание пользователи видят в посковиках"
        ></v-textarea>
      </v-col>
      <v-col cols="12">
        <v-btn x-large block class="font-weight-light" tile color="primary" @click="save">Сохранить</v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  async mounted () {
    await this.$store.dispatch('meta/read')
    this.meta = this.$store.getters['meta/list']
    this.loading = false
  },
  data () {
    return {
      loading: true,
      meta: {},
      msg: ''
    }
  },
  methods: {
    async save () {
      try {
        this.loading = true
        await this.$store.dispatch('meta/update', this.meta)
        this.loading = false
      } catch (error) {
        this.msg = error
      }
    }
  }
}
</script>

<style>
</style>
