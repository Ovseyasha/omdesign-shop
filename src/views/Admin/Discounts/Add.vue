<template>
  <v-col cols="6">
    <Loader v-if="loading" />
    <form v-else>
      <ChangeImg :img="''" @changed-img="changeImg" />
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
  data () {
    return {
      url: '',
      desc: [''],
      endDate: null,
      loading: false
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
          endDate: this.endDate
        }
        // console.log(discount.url, discount.url.name)
        await this.$store.dispatch('discounts/create', discount)
        this.url = ''
        this.desc = ['']
        this.endDate = null
        this.loading = false
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
