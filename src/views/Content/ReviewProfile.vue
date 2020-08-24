<template>
  <Loader v-if="loading" />
  <v-col v-else xl="10" lg="10" md="10" cols="12" class="font-weight-light">
    <v-row>
      <v-col cols="12" class="d-flex">
        <v-btn icon color="secondary" x-large router-link to="/account">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h1 class="ml-2 mb-15 font-weight-thin">Мои отзывы</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-row v-for="(r,index) in reviews" :key="index">
          <v-col cols="12">
            <v-row justify="space-between">
              <v-col cols="1" align="center">
                <v-avatar>
                  <img :src="r.userAvatar" :alt="r.userName" />
                </v-avatar>
              </v-col>
              <v-col align-self="center" offset-xl="0" offset-lg="0" offset="1">
                <p>{{r.userName}} {{r.userSurName}}</p>
              </v-col>
              <v-col>
                <v-row justify="end">
                  <v-rating v-model="r.score" readonly></v-rating>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <p>{{r.comment}}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                xl="1"
                lg="1"
                cols="4"
                align-self="end"
                v-for="(pic,index) in r.photos"
                :key="index"
              >
                <v-img
                  :src="pic.img"
                  max-height="200px"
                  style="cursor: pointer"
                  @click="openPhotoView(pic.img)"
                ></v-img>
              </v-col>
              <v-dialog tile v-model="photoView" max-width="500">
                <v-card tile>
                  <v-col cols="12">
                    <v-row justify="end">
                      <v-btn icon @click="photoView = false" class="mr-2">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-row>
                  </v-col>
                  <v-img :src="url"></v-img>
                </v-card>
              </v-dialog>
            </v-row>
            <v-row justify="space-between">
              <v-col cols="3">
                <v-row justify="space-between">
                  <v-col cols="5">
                    <v-icon
                      class="mr-2"
                      :color="r.likes ? Object.values(r.likes).find(e => e === userId) ? 'primary' : '': ''"
                    >mdi-thumb-up</v-icon>
                    <small>{{ r.likes ? Object.keys(r.likes).length : 0}}</small>
                  </v-col>
                  <v-col cols="5">
                    <v-icon
                      class="mr-2"
                      :color="r.disLikes ? Object.values(r.disLikes).find(e => e === userId) ? 'primary' : '': ''"
                    >mdi-thumb-down-outline</v-icon>
                    <small>{{ r.disLikes ? Object.keys(r.disLikes).length : 0}}</small>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="3">
                <p>{{r.date}}</p>
              </v-col>
            </v-row>
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  async mounted () {
    await this.$store.dispatch('products/readReviewById')
    this.reviews = this.$store.getters['products/myReviews']
    this.loading = false
  },
  data () {
    return {
      reviews: [],
      loading: true,
      photoView: false,
      url: null
    }
  },
  computed: {
    userId () {
      return this.$store.getters['users/getUid']
    }
  },
  methods: {
    openPhotoView (src) {
      this.url = src
      this.photoView = true
    }
  }
}
</script>

<style>
</style>
