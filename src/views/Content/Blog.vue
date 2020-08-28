<template>
  <v-col xl="10" lg="10" cols="12">
    <v-row>
      <v-col cols="12">
        <h1 class="font-weight-thin text-center">Блог</h1>
      </v-col>
    </v-row>
    <Loader v-if="loading" />
    <v-row v-else>
      <v-col cols="12" v-for="a in articles" :key="a.id">
        <v-row>
          <v-col cols="12">
            <h2 class="font-weight-light">{{a.title}}</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <p v-if="a.code" class="c" v-html="a.code"></p>
          </v-col>
        </v-row>
        <v-row>
          <v-col xl="6" lg="6" cols="12">
            <v-img v-if="a.media.length < 2" height="400" contain :src="a.media[0].img"></v-img>
            <v-carousel
              v-else
              height="400"
              hide-delimiters
              hide-delimiter-background
              show-arrows-on-hover
            >
              <v-carousel-item v-for="(slide, i) in a.media" :key="i">
                <v-img contain height="400" :src="slide.img"></v-img>
              </v-carousel-item>
            </v-carousel>
          </v-col>
          <v-col xl="6" lg="6" cols="12">
            <p class="font-weight-light" v-for="(p,index) in a.desc" :key="index">{{p}}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <p class="font-weight-light text-right">Дата публикации: {{a.date}}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-divider></v-divider>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  async mounted () {
    await this.$store.dispatch('blog/read')
    await this.$store.dispatch('meta/read')
    this.title = this.$store.getters['meta/list'][1].title
    this.desc = this.$store.getters['meta/list'][1].desc
    this.loading = false
  },
  data () {
    return {
      loading: true,
      title: '',
      desc: ''
    }
  },
  computed: {
    articles () {
      const a = this.$store.getters['blog/articles']
      return a.reverse()
    }
  },
  metaInfo () {
    return {
      title: '| ' + this.title.toUpperCase()
    }
  }
}
</script>

<style lang="less">
.c {
  position: relative;
  width: 100%;
  height: 655px;
  @media (max-width: 1264px) {
    height: 500px;
  }
  @media (max-width: 960px) {
    height: 400px;
  }
  @media (max-width: 600px) {
    height: 230px;
  }
}
</style>
