<template>
  <Loader v-if="loading" />
  <v-col cols="12" v-else>
    <v-row>
      <v-col cols="12">
        <h1 class="font-weight-thin text-center">Редактирование продукта</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col xl="10" lg="10" md="10" cols="12">
        <form style="width: 100%">
          <v-text-field v-model="product.name" label="Название" required></v-text-field>
          <v-select
            v-model="product.category"
            :items="categories"
            item-text="name"
            item-value="id"
            label="Категория"
            required
          ></v-select>
          <v-select v-model="product.status" :items="status" label="Наличие" required></v-select>
          <v-text-field v-model="product.price" label="Цена" required></v-text-field>
          <v-checkbox label="Сделать скидку" v-model="saleOpen"></v-checkbox>
          <v-text-field v-model="oldPrice" v-if="saleOpen" label="Новая цена" required></v-text-field>
          <v-combobox
            v-model="product.sizes"
            :items="product.sizes"
            hide-selected
            label="Добавить размер"
            multiple
            persistent-hint
            small-chips
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    Нажми
                    <kbd>enter</kbd> что бы добавить размер
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
          <v-divider class="mt-10"></v-divider>
          <SlideEditor :slides="product.photos" @changed="slideChange" />
          <h2 class="font-weight-light text-center mb-5">Описание</h2>
          <SubsEditor :subs="product.desc" @change="loadSubs" />
          <v-btn class="mr-4 font-weight-light" @click="submit" tile x-large block>Сохранить</v-btn>
        </form>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import SlideEditor from '@/components/app/SlideEditor'
import SubsEditor from '@/components/app/SubsEditor'
export default {
  async mounted () {
    await this.$store.dispatch('category/read')
    await this.$store.dispatch('products/read')
    this.product = this.$store.getters['products/productById'](this.$route.params.id)
    this.oldPrice = this.product.oldPrice !== false ? this.product.oldPrice : ''
    this.saleOpen = this.oldPrice !== ''
    this.loading = false
  },
  data () {
    return {
      loading: true,
      saleOpen: false,
      oldPrice: '',
      name: '',
      email: '',
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4'
      ],
      checkbox: false,
      // ____________________________________
      product: {},
      deletedName: []
    }
  },
  computed: {
    categories () {
      const cat = this.$store.getters['category/categories']
      return cat
    },
    status () {
      return ['Скоро в продаже', 'На складе', 'Распроданно']
    }
  },
  methods: {
    slideChange (v, d) {
      this.deletedName = d
      this.product.photos = v
    },
    loadSubs (v) {
      this.product.desc = v
    },
    async submit () {
      try {
        this.loading = true
        for (const photo of this.product.photos) {
          delete photo.url
        }
        if (this.oldPrice !== '') {
          this.product.oldPrice = this.oldPrice
          this.product.isNew = false
        }
        if (!this.saleOpen) {
          this.product.isNew = true
          this.product.oldPrice = false
        }
        await this.$store.dispatch('products/update', {
          product: this.product,
          id: this.product.id,
          deletedName: this.deletedName
        })
        this.loading = false
        this.$router.push('/admin/products')
      } catch (error) {
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
