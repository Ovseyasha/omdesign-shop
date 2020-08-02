<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12" tile>
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Регистрация</v-toolbar-title>
                <v-spacer></v-spacer>
                <template>
                  <v-btn icon large>
                    <router-link to="/">
                      <img :src="require('@/assets/icon.png')" width="40" alt="logo" />
                    </router-link>
                  </v-btn>
                </template>
              </v-toolbar>
              <v-card-text>
                <h3 class="help">
                  Уже есть аккаунт?
                  <router-link to="/login">Войдите!</router-link>
                </h3>
                <v-form>
                  <v-text-field
                    label="* Email"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="email"
                    :error-messages="emailErrors"
                    required
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="* Пароль"
                    name="password"
                    prepend-icon="mdi-lock"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    @click:append="show = !show"
                    v-model="pass"
                    :error-messages="passErrors"
                    required
                    @input="$v.pass.$touch()"
                    @blur="$v.pass.$touch()"
                  ></v-text-field>
                  <label>
                    Выберите фото:
                    <ChangeImg :img="''" @changed-img="changeImg" />
                  </label>

                  <v-radio-group
                    v-model="sex"
                    row
                    label="* Выберите пол:"
                    :error-messages="sexErrors"
                    required
                    @input="$v.sex.$touch()"
                    @blur="$v.sex.$touch()"
                  >
                    <v-radio label="Женщина"></v-radio>
                    <v-radio label="Мужчина"></v-radio>
                  </v-radio-group>
                  <v-text-field
                    label="* Имя"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="name"
                    :error-messages="nameErrors"
                    required
                    @input="$v.name.$touch()"
                    @blur="$v.name.$touch()"
                  ></v-text-field>
                  <v-text-field
                    label="Фамилия"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="user.surName"
                  ></v-text-field>
                  <label>
                    Дата рождения:
                    <v-date-picker
                      full-width
                      class="mx-0"
                      locale="ru"
                      v-model="user.dateBirth"
                      color="secondary"
                      header-color="primary"
                    ></v-date-picker>
                  </label>
                  <v-text-field
                    label="Номер телефона"
                    prepend-icon="mdi-cellphone "
                    type="text"
                    v-model="user.phone"
                  ></v-text-field>
                  <v-text-field label="Город" prepend-icon="mdi-map-marker" v-model="user.city"></v-text-field>
                  <v-text-field label="Улица" prepend-icon="mdi-home-city " v-model="user.street"></v-text-field>
                  <v-text-field label="Дом" prepend-icon="mdi-home" v-model="user.building"></v-text-field>
                  <v-text-field
                    label="Квартира"
                    prepend-icon="mdi-home-floor-1 "
                    v-model="user.apartament"
                  ></v-text-field>
                </v-form>
                <h3
                  class="help mt-2"
                >* - Помечены обязательные поля, для удобства рекомеднуем заполнить все</h3>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="reg" tile>Зарегистрироваться</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import ChangeImg from '@/components/app/ChangeImg'
export default {
  data () {
    return {
      email: '',
      pass: '',
      sex: '',
      name: '',
      show: false,
      user: {
        avatar: null,
        name: '',
        surName: '',
        city: '',
        sex: '',
        dateBirth: '',
        pass: '',
        phone: '',
        street: '',
        building: '',
        apartament: '',
        wishList: '',
        ListOrder: []
      }
    }
  },
  validations: {
    email: {
      required,
      email
    },
    pass: {
      required,
      minLength: minLength(6)
    },
    sex: {
      required
    },
    name: {
      required
    }
  },
  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Email введен не верно')
      !this.$v.email.required && errors.push('Введите Email')
      return errors
    },
    passErrors () {
      const errors = []
      if (!this.$v.pass.$dirty) return errors
      !this.$v.pass.minLength && errors.push('Количество символов слишком мало')
      !this.$v.pass.required && errors.push('Введите пароль')
      return errors
    },
    sexErrors () {
      const errors = []
      if (!this.$v.sex.$dirty) return errors
      !this.$v.sex.required && errors.push('Пол не выбран')
      return errors
    },
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Введите имя')
      return errors
    }
  },
  methods: {
    changeImg (v) {
      this.user.avatar = v
    },
    async reg () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return false
      }
      try {
        this.user.email = this.email
        this.user.pass = this.pass
        this.user.sex = this.sex
        this.user.name = this.name
        console.log(this.user)
        // const formData = {
        //   email: this.email,
        //   password: this.pas
        // }
        // await this.$store.dispatch('user/login', formData)
        // this.$router.push('/')
      } catch (error) {
      }
    }
  },
  components: {
    ChangeImg
  }
}
</script>

<style lang="less">
.help {
  font-weight: 300 !important;
}
</style>
