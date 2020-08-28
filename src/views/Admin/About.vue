<template>
  <v-col class="12">
    <v-row>
      <v-col cols="12">
        <h1 class="font-weight-thin text-center">О магазине</h1>
      </v-col>
    </v-row>
    <Loader v-if="loading" />
    <v-row v-else>
      <v-col v-for="(c,index) in cells" :key="index" xl="4" lg="4" md="4" cols="12">
        <v-card tile height="500" width="500" class="mx-auto">
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <v-select
                  :items="items"
                  item-value="value"
                  item-text="text"
                  v-model="c.format"
                  v-if="c.format === null"
                  label="Формат ячейки"
                ></v-select>
              </v-col>
              <v-col cols="12" v-if="c.format === 'textWith'">
                <v-text-field @change="setData" v-model="c.title" label="Заголовок"></v-text-field>
                <v-textarea
                  counter="815"
                  @change="setData"
                  v-model="c.content"
                  label="Введите текст"
                ></v-textarea>
              </v-col>
              <v-col cols="12" v-if="c.format === 'photo'">
                <ChangeImg
                  @change="setData"
                  :img="c.content.url || c.content"
                  @changed-img="changeImg(index, $event)"
                />
              </v-col>
              <v-col cols="12" v-if="c.format === 'code'">
                <v-textarea @change="setData" v-model="c.content" label="Введите код"></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-btn
                  class="font-weight-light"
                  tile
                  v-if="c.format !== null"
                  x-large
                  block
                  @click="clearCell(index)"
                >Отмена</v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn
                  @click="deleteCell(index)"
                  class="font-weight-light"
                  tile
                  block
                  x-large
                >Удалить</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-card>
      </v-col>
      <v-col xl="4" lg="4" md="4" cols="12">
        <v-card tile height="500" width="500" class="d-flex align-center mx-auto">
          <v-row justify="center" align-self="center">
            <v-btn width="200" height="200" @click="addCells" x-large icon>
              <v-icon size="200">mdi-plus</v-icon>
            </v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import ChangeImg from '@/components/app/ChangeImg'
export default {
  async mounted () {
    await this.$store.dispatch('about/read')
    this.cells = this.$store.getters['about/cells']
    this.loading = false
  },
  data () {
    return {
      loading: true,
      items: [
        {
          text: 'Текст с заголовком',
          value: 'textWith'
        },
        {
          text: 'Фото',
          value: 'photo'
        }, {
          text: 'Видео(из стороннего ресурса)',
          value: 'code'
        }
      ],
      cells: []
    }
  },
  computed: {

  },
  methods: {
    async setData () {
      try {
        this.loading = true
        await this.$store.dispatch('about/set', this.cells)
        this.loading = false
      } catch (error) {
      }
    },
    changeImg (i, v) {
      this.cells[i].content = {}
      this.cells[i].content.url = v
      this.setData()
    },
    addCells () {
      this.cells.push({
        format: null,
        title: null,
        content: ''
      })
    },
    clearCell (i) {
      this.cells[i].format = null
      this.cells[i].title = null
      this.cells[i].content = ''
    },
    deleteCell (i) {
      this.cells.splice(i, 1)
      this.setData()
    }
  },
  components: { ChangeImg }
}
</script>

<style>
</style>
