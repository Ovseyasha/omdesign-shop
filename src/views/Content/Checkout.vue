<template>
  <Loader v-if="loading" />
  <v-col xl="10" lg="10" cols="12" v-else class="font-weight-light">
    <v-row justify="center">
      <h1 class="font-weight-light text-center">Информация о покупателе</h1>
    </v-row>
    <v-row justify="center">
      <p class="font-weight-light text-center">
        Выбранно товаров:
        <span class="secondary--text">{{info.productInCart.length}}</span>,
        на сумму:
        <span class="secondary--text">{{total | price}}</span>
      </p>
    </v-row>

    <v-row>
      <v-col cols="12">
        <form class="form">
          <v-row justify="center">
            <v-col xl="4" lg="4" cols="12">
              <v-text-field label="Имя" v-model="info.name" required></v-text-field>
              <v-text-field label="Фамилия" v-model="info.surName" required></v-text-field>
              <v-text-field label="Email" v-model="info.email" required></v-text-field>
              <v-text-field label="Телефон" v-model="info.phone" required></v-text-field>
              <!-- <v-text-field label="Время доставки" required></v-text-field> -->
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateFormatted"
                    label="Дата доставки"
                    required
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title scrollable locale="ru">
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">Отмена</v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(date)">Ок</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col xl="4" lg="4" cols="12">
              <v-text-field label="Город" v-model="info.city" required></v-text-field>
              <v-text-field label="Улица" v-model="info.street" required></v-text-field>
              <v-text-field label="Дом" v-model="info.building" required></v-text-field>
              <v-text-field label="Квартира" v-model="info.apartament" required></v-text-field>
              <v-menu
                ref="menu2"
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="time"
                    required
                    label="Время доставки"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  scrollable
                  format="24hr"
                  v-if="menu2"
                  v-model="time"
                  full-width
                  @click:minute="$refs.menu2.save(time)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col xl="4" lg="4" cols="12">
              <v-row>
                <v-col>
                  <v-textarea
                    label="Коментарий к заказу"
                    hint="Например: код домофона, особенности входа в дом и т.д."
                    v-model="comment"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-radio-group v-model="payMethod" label="Способ оплаты при получении заказа:">
                    <v-radio class="mt-3" label="Наличные" value="nal"></v-radio>
                    <v-radio label="Картой" value="card"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-btn
            class="font-weight-light"
            x-large
            block
            color="primary"
            tile
            @click="submit"
          >Оформить заказ</v-btn>
        </form>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  async mounted () {
    await this.$store.dispatch('users/getInfo')
    this.total = await this.$store.getters['cart/total']
    this.info = this.$store.getters['users/info']

    if (typeof (this.total) === 'object') {
      this.$router.push('/cart')
    }
    this.loading = false
  },
  data: vm => {
    return {
      loading: true,
      total: '',
      info: [],
      date: new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * 2).toISOString().substr(0, 10),
      dateFormatted: vm.formatDate(new Date(new Date().getTime() + (24 * 60 * 60 * 1000) * 2).toISOString().substr(0, 10)),
      menu: false,
      time: '15:00',
      menu2: false,
      comment: '',
      payMethod: 'nal'
    }
  },
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    }
  },
  methods: {
    async submit () {
      try {
        this.loading = true
        const order = {
          name: this.info.name,
          surName: this.info.surName,
          email: this.info.email,
          phone: this.info.phone,
          dateDeliv: this.date,
          city: this.info.city,
          street: this.info.street,
          building: this.info.building,
          apartament: this.info.apartament,
          timeDeliv: this.time,
          comment: this.comment,
          payMethod: this.payMethod,
          products: this.info.productInCart,
          total: this.total
        }
        await this.$store.dispatch('orders/create', order)
        await this.$store.dispatch('cart/clearCart')
        this.loading = false
        this.$router.push('/account')
      } catch (error) {
      }
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  },
  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
    }
  },
  metaInfo () {
    return {
      title: '| ' + 'ОФОРМЕЛНИЕ ЗАКАЗА'
    }
  }
}
</script>

<style lang="less">
.form {
  width: 100%;
}
</style>
