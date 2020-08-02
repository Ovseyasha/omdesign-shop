<template>
  <div class="change">
    <img :src="img" alt="avatar" class="change__img" v-if="imageUrl == '' && img !== '' " />
    <img
      :src="require('@/assets/default.jpg')"
      alt="avatar"
      class="change__img"
      v-else-if="imageUrl == '' && img === ''"
    />
    <img :src="imageUrl" alt="avatar" class="change__img" v-else />
    <div class="change__item">
      <div class="change__file">{{filename}}</div>
      <input
        type="file"
        style="display: none"
        accept="image/*"
        ref="fileInput"
        @change="onfilePicked"
      />
      <v-btn @click="onPickFile" color="primary" tile class="change__btn btn">
        <i class="fas fa-arrow-up"></i> Изменить фото
      </v-btn>
      <v-btn @click="resetImg" color="info" tile class="change__btn change__btn_reset btn">
        <i class="fas fa-trash-restore"></i> Сброс
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: ['img'],
  data () {
    return {
      imageUrl: '',
      image: null,
      filename: '',
      oldPath: this.img
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
      this.$emit('changed-img', this.image)
    },
    resetImg () {
      this.image = this.oldPath
      this.imageUrl = this.oldPath
      this.filename = ''
      this.$emit('changed-img', this.oldPath)
    }
  }
}
</script>

<style lang="less" scoped>
@green: #4d6a00;
.change {
  display: flex;
  flex-direction: column;
  &__img {
    object-fit: cover;
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  &__file {
    text-align: center;
    margin-top: 2%;
    flex-basis: 100%;
  }

  &__btn {
    @media (max-width: 600px) {
      flex-basis: 100%;
      margin: 5px 0;
    }
    margin: 20px 0;
    padding: 10px;
  }
}
</style>
