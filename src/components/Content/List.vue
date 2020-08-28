<template>
  <v-col cols="12">
    <v-row>
      <v-col align="center" cols="12">
        <v-badge color="secondary" :content="count" :value="count">
          <h1 class="font-weight-thin">Список {{mode}}</h1>
        </v-badge>
      </v-col>
    </v-row>
    <Loader v-if="editing" />
    <v-row v-if="mode === 'Категорий'  && !editing " justify="center">
      <v-col cols="12">
        <v-row v-for="(i,index) in sortItems" :key="i.id" justify="center">
          <v-col align="center" align-self="center" xl="4" lg="4" md="4" cols="1">
            <p>{{++index}}</p>
          </v-col>
          <v-col align="center" align-self="center" xl="4" lg="4" md="4" cols="8">
            <v-text-field v-model="i.name" @change="edit(i.name, i.id)"></v-text-field>
          </v-col>
          <v-col align="center" align-self="center" xl="4" lg="4" md="4" cols="2">
            <v-btn x-large icon @click="deleteCategory(i.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-dialog v-model="categoryModal" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Создание категории</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Название" v-model="categoryName" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn tile x-large color="primary" text @click="categoryModal = false">Отмена</v-btn>
            <v-btn tile x-large color="secondary" text @click="createCategory">Создать</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn
        v-show="!categoryModal"
        color="primary"
        @click="categoryModal = !categoryModal"
        fixed
        dark
        right
        fab
        bottom
        title="Создать категорию"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>
    <v-row v-if="mode === 'Продуктов'  && !editing">
      <v-col cols="12">
        <v-row justify="center" v-for="i in sortItems" :key="i.id">
          <v-col align-self="center" xl="3" lg="3" md="3" cols="5">
            <v-badge color="secondary" icon="mdi-new-box" v-if="i.isNew">
              <h2 class="font-weight-light">{{i.name}}</h2>
            </v-badge>
            <h2 v-else class="font-weight-light">{{i.name}}</h2>
            <p class="primary--text">{{i.category.name}}</p>
          </v-col>
          <v-col align-self="center" align="center" xl="2" lg="2" md="2" cols="3">
            <p v-if="i.oldPrice" class="text-decoration-line-through">{{i.oldPrice | price}}</p>
            <p>{{i.price | price}}</p>
          </v-col>
          <v-col align-self="center" align="center" xl="2" lg="2" md="2" cols="2">
            <v-btn x-large icon router :to="`/admin/products/edit/${i.id}`">
              <v-icon>mdi-clipboard-edit-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col align-self="center" align="center" xl="2" lg="2" md="2" cols="2">
            <v-btn x-large icon @click="deleteProduct(i)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-btn
        color="primary"
        fixed
        dark
        right
        fab
        bottom
        title="Создать продукт"
        router
        to="/admin/products/add"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>
    <v-row v-if="mode === 'Заказов'  && !editing">
      <v-col cols="12">
        <v-row v-for="(o,index) in items" :key="index">
          <v-col xl="2" lg="2" md="2" cols="6" align-self="end">
            <h3 class="font-weight-light">{{o.surName}}</h3>
            <p>{{o.name}}</p>
          </v-col>
          <v-col xl="2" lg="2" md="2" cols="6" align-self="end">
            <p>
              <a :href="`mailto:${o.email}`">{{o.email}}</a>
              <br />
              <a :href="`tel:${o.phone}`">{{o.phone}}</a>
            </p>
          </v-col>
          <v-col xl="2" lg="2" md="2" cols="12" align="center" align-self="end">
            <v-select
              @change="updState(o.id, o.state)"
              v-model="o.state"
              :items="states"
              :value="o.state"
              label="Статус заказа"
            ></v-select>
          </v-col>
          <v-col xl="2" lg="2" md="2" cols="4" align="center" align-self="end">
            <p>{{new Date(o.dateDeliv).toLocaleDateString()}}</p>
          </v-col>
          <v-col xl="2" lg="2" md="2" cols="4" align="center" align-self="end">
            <p>{{o.total | price}}</p>
          </v-col>
          <v-col xl="1" lg="1" md="1" cols="2" align="center" align-self="end">
            <v-btn x-large icon @click="openView(o)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </v-col>
          <v-col xl="1" lg="1" md="1" cols="2" align="center" align-self="end">
            <v-btn x-large icon @click="deleteOrder(o.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </v-col>
      <v-dialog v-model="orderModal" max-width="750px">
        <v-card>
          <v-card-title class="headline font-weight-light">Карточка заказа</v-card-title>
          <v-col cols="12">
            <v-row>
              <v-col xl="4" lg="4" md="4" cols="12">
                <p>
                  <span class="font-weight-light">Имя:</span>
                  <span class="font-weight-light secondary--text ml-2">{{order.name}}</span>
                </p>
                <p>
                  <span class="font-weight-light">Фамилия:</span>
                  <span class="font-weight-light secondary--text ml-2">{{order.surName}}</span>
                </p>
                <p>
                  <span class="font-weight-light">Email:</span>
                  <span class="font-weight-light secondary--text ml-2">{{order.email}}</span>
                </p>
                <p>
                  <span class="font-weight-light">Телефон:</span>
                  <span class="font-weight-light secondary--text ml-2">{{order.phone}}</span>
                </p>
              </v-col>
              <v-col xl="4" lg="4" md="4" cols="12">
                <p>
                  <span class="font-weight-light">Город:</span>
                  <span class="font-weight-light secondary--text ml-2">{{order.city}}</span>
                </p>
                <p>
                  <span class="font-weight-light">Улица:</span>
                  <span class="font-weight-light secondary--text ml-2">{{order.street}}</span>
                </p>
                <p>
                  <span class="font-weight-light">Дом:</span>
                  <span class="font-weight-light secondary--text ml-2">{{order.building}}</span>
                </p>
                <p>
                  <span class="font-weight-light">Квартира:</span>
                  <span class="font-weight-light secondary--text ml-2">{{order.apartament}}</span>
                </p>
              </v-col>
              <v-col xl="4" lg="4" md="4" cols="12">
                <p>
                  <span class="font-weight-light">Статус заказа:</span>
                  <span class="font-weight-light secondary--text ml-2">{{order.state}}</span>
                </p>
                <p>
                  <span class="font-weight-light">Дата доставки:</span>
                  <span
                    class="font-weight-light secondary--text ml-2"
                  >{{new Date(order.dateDeliv).toLocaleDateString()}}</span>
                </p>
                <p>
                  <span class="font-weight-light">Время доставки:</span>
                  <span class="font-weight-light secondary--text ml-2">{{order.timeDeliv}}</span>
                </p>
                <p>
                  <span class="font-weight-light">Способ оплаты:</span>
                  <span
                    class="font-weight-light secondary--text ml-2"
                  >{{order.payMethod = 'card' ? 'Карта' : 'Наличные'}}</span>
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <p class="font-weight-light">Комментарий к заказу:</p>
                <p class="font-weight-light secondary--text">{{order.comment}}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-row>
                  <v-col align-self="center" align="center" cols="4">
                    <h6 class="font-weight-light">Наименование</h6>
                  </v-col>
                  <v-col align-self="center" align="center" cols="3">
                    <h6 class="font-weight-light">Сумма</h6>
                  </v-col>
                  <v-col align-self="center" align="center" cols="2">
                    <h6 class="font-weight-light">шт.</h6>
                  </v-col>
                  <v-col align-self="center" align="center" cols="3">
                    <h6 class="font-weight-light">Размер</h6>
                  </v-col>
                </v-row>
                <v-row v-for="p in order.products" :key="p.id">
                  <v-col align-self="center" align="center" cols="4">
                    <h5 class="font-weight-light">{{p.info.name}}</h5>
                    <p class="font-weight-light">{{p.info.category.name}}</p>
                  </v-col>
                  <v-col align-self="center" align="center" cols="3">
                    <p class="font-weight-light">{{p.info.price * p.count | price}}</p>
                  </v-col>
                  <v-col align-self="center" align="center" cols="2">
                    <p>{{p.count}}</p>
                  </v-col>
                  <v-col align-self="center" align="center" cols="3">
                    <p class="font-weight-light">{{p.selectedSize}}</p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <h2 class="font-weight-light text-right">
                      <span>Итог:</span>
                      <span class="secondary--text ml-2">{{order.total | price}}</span>
                    </h2>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn tile block x-large color="primary" text @click="orderModal = false">ОК</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row v-if="mode === 'Публикаций' && !editing">
      <v-col cols="12">
        <v-row v-for="a in sortItems" :key="a.id">
          <v-col cols="7" align-self="center" align="center">
            <h2 class="font-weight-light">{{a.title}}</h2>
          </v-col>
          <v-col cols="2" align-self="center" align="center">
            <v-btn x-large icon router :to="`/admin/blog/edit/${a.id}`">
              <v-icon>mdi-clipboard-edit-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="2" align-self="center" align="center">
            <v-btn x-large icon @click="deleteBlog(a)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-btn
        color="primary"
        fixed
        dark
        right
        fab
        bottom
        title="Создать публикацию"
        router
        to="/admin/blog/add"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>
    <v-row v-if="mode === 'Акций'  && !editing">
      <v-col cols="12">
        <v-row>
          <v-col cols="4" align="center">
            <h2 class="font-weight-light">Дата окончания</h2>
          </v-col>
          <v-col cols="4" align="center"></v-col>
          <v-col cols="4" align="center"></v-col>
        </v-row>
        <v-row v-for="(d,index) in items" :key="index">
          <v-col cols="4" align="center">
            <p>{{d.endDate}}</p>
          </v-col>
          <v-col cols="4" align="center">
            <v-btn x-large icon router :to="`/admin/discounts/edit/${d.id}`">
              <v-icon>mdi-clipboard-edit-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="4" align="center">
            <v-btn x-large icon @click="deleteDiscount(d)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-btn
        color="primary"
        fixed
        dark
        right
        fab
        bottom
        router
        to="/admin/discounts/add"
        title="Создать акцию"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>
    <v-row v-if="mode === 'Сообщений'  && !editing">
      <v-col cols="12">
        <v-row
          v-for="(m,index) in items"
          :key="index"
          :class="{new: m.isNew}"
          class="mail"
          @click="openMail(m.id)"
        >
          <v-col cols="1">
            <v-badge v-if="m.isNew" color="secondary" dot></v-badge>
          </v-col>
          <v-col xl="2" lg="2" md="2" cols="11">
            <p class="secondary--text">{{m.email}}</p>
          </v-col>
          <v-col xl="7" lg="7" md="7" cols="10" class="d-flex">
            <span>{{m.subject}}</span>
            <p class="ml-2 text-truncate info--text">{{m.message}}</p>
          </v-col>
          <v-col xl="2" lg="2" md="2" cols="2" align="center">
            <v-btn @click.stop="deleteMail(m.id)" x-large icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-dialog v-model="modalMail" max-width="500">
        <v-card class="font-weight-light">
          <v-card-title class="headline font-weight-light">
            <span class="mr-2">От:</span>
            <a class="secondary--text" :href="`mailto:${mail.email}`">{{mail.name}}</a>
          </v-card-title>
          <v-card-text class="font-weight-light">
            <p>
              <span class="mr-2 secondary--text">Тема:</span>
              <span>{{mail.subject}}</span>
            </p>
            <v-divider></v-divider>
            <p class="mt-2">{{mail.message}}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="font-weight-light"
              block
              color="secondary"
              tile
              text
              @click="modalMail = false"
            >Закрыть</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-col>
</template>

<script>
export default {
  props: ['items', 'mode'],
  data () {
    return {
      // contact
      modalMail: false,
      mail: {},
      // orders
      states: ['Новый заказ', 'Заказ в пути', 'Заказ доставлен'],
      orderModal: false,
      order: {},
      // category
      editing: false,
      categoryModal: false,
      categoryName: ''
    }
  },
  computed: {
    sortItems () {
      const a = this.items ? this.items : []
      return a.length > 0 ? a.reverse() : []
    },
    count () {
      return this.items ? this.items.length : 0
    }
  },
  methods: {
    // contact
    async deleteMail (i) {
      try {
        this.editing = true
        await this.$store.dispatch('contact/delete', i)
        this.editing = false
      } catch (error) {

      }
    },
    async openMail (id) {
      try {
        this.items.forEach(m => {
          if (m.id === id) {
            this.mail = m
          }
        })
        this.modalMail = true
        await this.$store.dispatch('contact/update', id)
      } catch (error) {

      }
    },
    // discounts
    async deleteDiscount (d) {
      try {
        this.editing = true
        await this.$store.dispatch('discounts/delete', { discount: d, id: d.id })
        this.editing = false
      } catch (error) {
      }
    },
    // blog
    async deleteBlog (article) {
      try {
        this.editing = true
        await this.$store.dispatch('blog/delete', article)
        this.editing = false
      } catch (error) {
      }
    },
    // orders
    async openView (o) {
      try {
        this.editing = true
        this.orderModal = true
        await this.$store.dispatch('products/read')
        o.products.forEach(p => {
          p.info = this.$store.getters['products/productById'](p.id)
        })
        this.order = o
        this.editing = false
      } catch (error) {
      }
    },
    async deleteOrder (id) {
      try {
        this.editing = true
        await this.$store.dispatch('orders/delete', { id })
        this.editing = false
      } catch (error) {

      }
    },
    async updState (id, v) {
      try {
        this.editing = true
        await this.$store.dispatch('orders/update', { id, v })
        this.editing = false
      } catch (error) {
      }
    },
    // products
    async deleteProduct (product) {
      try {
        this.editing = true
        await this.$store.dispatch('products/delete', { product })
        this.editing = false
      } catch (error) {
      }
    },
    // category
    async edit (name, id) {
      try {
        this.editing = true
        if (name !== '') {
          await this.$store.dispatch('category/update', {
            name,
            id
          })
        }
        this.editing = false
      } catch (error) {
      }
    },
    async createCategory () {
      try {
        this.editing = true
        if (this.categoryName !== '') {
          await this.$store.dispatch('category/create', this.categoryName)
        }
        this.categoryName = ''
        this.categoryModal = false
        this.editing = false
      } catch (error) {
      }
    },
    async deleteCategory (id) {
      try {
        this.editing = true
        await this.$store.dispatch('category/delete', id)
        this.editing = false
      } catch (error) {
      }
    }
  }
}
</script>

<style lang="less">
.mail {
  cursor: pointer;
  @media (max-width: 600px) {
    border-bottom: 0.5px solid grey;
  }
  &:hover {
    background-color: darken(#fff, 80%);
  }
}
</style>
