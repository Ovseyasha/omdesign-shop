<template>
  <v-col cols="12">
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="title" label="Название фотографии"></v-text-field>
          </v-col>
        </v-row>
        <v-row justify="center">
          <input
            type="file"
            style="display: none"
            accept="image/*"
            ref="fileInput"
            @change="onfilePicked"
          />
          <v-col cols="auto">
            <v-btn block @click="onPickFile" tile class="font-weight-light" color="primary">
              <v-icon left>mdi-paperclip</v-icon>Выбрать фото
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <p>{{filename}}</p>
          </v-col>
          <v-col cols="auto">
            <v-btn block tile class="font-weight-light" @click="add">
              <v-icon left>mdi-plus</v-icon>Добавить
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn block tile class="font-weight-light" @click="save" color="primary">
              <v-icon left>mdi-upload</v-icon>Сохранить изменения
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(slide,index) in newSlides" :key="index" align-self="end">
        <template v-if="slide.img !== ''">
          <v-row justify="center">
            <img :src="slide.url || slide.img" height="200px" />
          </v-row>
          <v-row justify="center">
            <div class="text-center font-weight-light mt-5">{{slide.title}}</div>
          </v-row>
          <v-row justify="center">
            <v-btn x-large @click="remove(index)" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  props: ['slides'],
  mounted () {
    if (this.slides) {
      this.newSlides = this.slides
    }
  },
  data () {
    return {
      title: '',
      image: null,
      imageUrl: '',
      filename: '',
      newSlides: [],
      deleted: []
    }
  },
  methods: {
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onfilePicked (event) {
      const files = event.target.files
      const fileName = files[0].name
      this.filename = fileName
      if (fileName.lastIndexOf('.') <= 0) {
        return alert('please add a avild file!')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    },
    add () {
      this.newSlides.push({
        title: this.title,
        url: this.imageUrl,
        img: this.image,
        fileName: this.filename
      })
      this.title = ''
      this.imageUrl = ''
      this.filename = ''
    },
    remove (i) {
      this.deleted.push(this.newSlides[i].fileName)
      this.newSlides.splice(i, 1)
    },
    save () {
      this.$emit('changed', this.newSlides, this.deleted)
    }
  }
}
</script>

<style lang="less" scoped>
.slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin: 1%;
}
</style>
