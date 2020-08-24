<template>
  <v-col xl="6" lg="6" md="6" cols="12">
    <Loader v-if="loading" />
    <form v-else>
      <ChangeImg :discount="true" :img="url" @changed-img="changeImg" />
      <SubsEditor :subs="desc" @change="loadSubs" />
      <v-date-picker full-width v-model="endDate" locale="Ru" class="mb-5"></v-date-picker>
      <v-btn color="primary" tile x-large block @click="submit">Сохранить</v-btn>
    </form>
  </v-col>
</template>

<script>
import ChangeImg from '@/components/app/ChangeImg'
import SubsEditor from '@/components/app/SubsEditor'
export default {
  async mounted () {
    await this.$store.dispatch('discounts/read')
    const d = this.$store.getters['discounts/readById'](this.$route.params.id)
    this.url = d.url
    this.oldPath = d.fileName
    this.desc = d.desc
    this.endDate = d.endDate
    this.loading = false
  },
  data () {
    return {
      url: '',
      desc: [''],
      endDate: null,
      loading: true,
      oldPath: null
    }
  },
  methods: {
    changeImg (v) {
      this.url = v
    },
    loadSubs (v) {
      this.desc = v
    },
    async submit () {
      try {
        this.loading = true
        const discount = {
          url: this.url,
          desc: this.desc,
          endDate: this.endDate,
          fileName: this.oldPath
        }
        await this.$store.dispatch('discounts/update', { discount, id: this.$route.params.id })
        this.url = ''
        this.desc = ['']
        this.endDate = null
        this.loading = false
        this.$router.push('/admin/discounts')
      } catch (error) {
        console.log(error)
      }
    }
  },
  components: {
    ChangeImg,
    SubsEditor
  }
}
</script>

<style>
</style>
