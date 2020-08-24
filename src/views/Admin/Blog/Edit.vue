<template>
  <v-col cols="12">
    <v-row>
      <v-col cols="12">
        <h1 class="font-weight-thin text-center">Редактирование публикации</h1>
      </v-col>
    </v-row>
    <Loader v-if="loading" />
    <v-row v-else justify="center">
      <v-col xl="10" lg="10" md="10" cols="12">
        <form @submit.prevent="editArticle">
          <v-text-field v-model="article.title" label="Название" required></v-text-field>
          <v-btn
            tile
            block
            class="font-weight-light mt-5 mb-5"
            @click="openModal = true"
          >Вставить видео со стороннего источника</v-btn>
          <SubsEditor :subs="article.desc" @change="loadSubs" />
          <SlideEditor :slides="article.media" @changed="slideChange" />
          <v-btn type="submit" tile block class="font-weight-light" color="primary">Сохранить</v-btn>
        </form>
      </v-col>
    </v-row>
    <v-dialog v-model="openModal" width="500">
      <v-card>
        <v-card-title class="headline">Вставьте код</v-card-title>
        <v-divider></v-divider>
        <v-col cols="12">
          <v-textarea
            v-model="code"
            hint="Вставьте код (<frame>) с видеоресурсов (YouTube, vimeo и др.) "
          ></v-textarea>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn block color="primary" text @click="openModal = false">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import SlideEditor from '@/components/app/SlideEditor'
import SubsEditor from '@/components/app/SubsEditor'
export default {
  async mounted () {
    await this.$store.dispatch('blog/read')
    this.article = this.$store.getters['blog/articleById'](this.$route.params.id)
    this.code = this.article.code
    this.loading = false
  },
  data () {
    return {
      loading: true,
      article: {},
      code: '',
      openModal: false,
      deletedName: []
    }
  },
  methods: {
    slideChange (v, d) {
      this.deletedName = d
      this.article.photos = v
    },
    loadSubs (v) {
      this.article.desc = v
    },
    async editArticle () {
      try {
        this.loading = true
        if (this.code !== '') {
          this.article.code = this.code
        }
        this.article.media.forEach(m => delete m.url)
        await this.$store.dispatch('blog/update', {
          article: this.article,
          deletedName: this.deletedName
        })
        this.loading = false
        this.$router.push('/admin/blog')
      } catch (error) {
        console.log(error)
      }
    }
  },
  components: {
    SlideEditor,
    SubsEditor
  }
}
</script>

<style>
</style>
