<template>
  <Loader v-if="loading" />
  <v-col v-else xl="10" lg="10" md="10" cols="12" class="font-weight-light">
    <v-row>
      <v-col cols="12">
        <v-btn icon color="secondary" x-large router-link to="/account">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h1 class="ml-2 mb-15 font-weight-thin">Редактирование профиля</h1>
        <v-btn tile class="font-weight-light" block x-large @click="modal = !modal">Изменить пароль</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-form class="form">
          <v-row justify="center">
            <v-col xl="6" lg="6" cols="12">
              <v-text-field label="Имя" v-model="user.name" required></v-text-field>
              <v-text-field label="Фамилия" v-model="user.surName" required></v-text-field>
              <v-text-field label="Email" v-model="user.email" required></v-text-field>
              <v-text-field label="Телефон" v-model="user.phone" required></v-text-field>
            </v-col>
            <v-col xl="6" lg="6" cols="12">
              <v-text-field label="Город" v-model="user.city" required></v-text-field>
              <v-text-field label="Улица" v-model="user.street" required></v-text-field>
              <v-text-field label="Дом" v-model="user.building" required></v-text-field>
              <v-text-field label="Квартира" v-model="user.apartament" required></v-text-field>
            </v-col>
          </v-row>
          <small v-if="error === 'Заполните все поля!'" class="error--text">{{error}}</small>
          <v-btn
            class="font-weight-light"
            x-large
            block
            color="primary"
            tile
            @click="submit"
          >Сохранить</v-btn>
        </v-form>
      </v-col>
    </v-row>
    <v-dialog v-model="modal" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Изменение пароля</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Новый пароль" v-model="newPass" type="password" required></v-text-field>
                <v-text-field
                  label="Повторите пароль"
                  :error-messages="error !== null ? error : ''"
                  v-model="rePass"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="modal = false">Отмена</v-btn>
          <v-btn color="secondary" text @click="changePass">Изменить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
export default {
  async mounted () {
    await this.$store.dispatch('users/getInfo')
    this.user = this.$store.getters['users/info']
    this.loading = false
  },
  data () {
    return {
      loading: true,
      user: {},
      modal: false,
      newPass: '',
      rePass: '',
      error: null
    }
  },
  methods: {
    async submit () {
      try {
        this.loading = true
        await this.$store.dispatch('users/editProfile', this.user)
        this.loading = false
      } catch (error) {
        console.log(error)
      }
    },
    async changePass () {
      try {
        this.loading = true
        if (this.newPass === this.rePass) {
          await this.$store.dispatch('users/changePass', this.newPass)
        } else {
          this.error = 'Пароли не совпадают!'
        }
        this.newPass = ''
        this.rePass = ''
        this.modal = false
        this.loading = false
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
</style>
