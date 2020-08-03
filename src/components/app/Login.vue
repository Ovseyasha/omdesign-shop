<template>
  <v-app id="inspire">
    <Messager :message="msg"></Messager>
    <v-main>
      <v-container class="fill-height" fluid>
        <Loader v-if="loading" />
        <v-row v-else align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12" tile>
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Вход</v-toolbar-title>
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
                <v-form>
                  <v-text-field
                    label="Email"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="email"
                    :error-messages="emailErrors"
                    required
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                  ></v-text-field>

                  <v-text-field
                    counter="6"
                    class="invalid"
                    id="password"
                    label="Пароль"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="pass"
                    :error-messages="passErrors"
                    required
                    @input="$v.pass.$touch()"
                    @blur="$v.pass.$touch()"
                  ></v-text-field>
                </v-form>
                <h3 class="help">
                  Нет аккаунта?
                  <router-link to="/registration">Зарегистрируйтесь!</router-link>
                </h3>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" tile @click="sign">Войти</v-btn>
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
import Messager from '@/components/app/Messager'
export default {
  data () {
    return {
      loading: false,
      error: '',
      email: '',
      pass: ''
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
      if (!this.$v.email.$dirty) return errors
      !this.$v.pass.minLength && errors.push('Количество символов слишком мало')
      !this.$v.pass.required && errors.push('Введите пароль')
      return errors
    },
    msg () {
      return this.error === '' ? this.$route.query.message : this.error
    }
  },
  methods: {
    async sign () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return false
      }
      try {
        this.loading = true
        const formData = {
          email: this.email,
          password: this.pass
        }
        await this.$store.dispatch('users/login', formData)
        this.loading = false
        this.$router.push('/')
      } catch (error) {
        this.error = error.code
        this.loading = false
      }
    }
  },
  components: {
    Messager
  }
}
</script>

<style lang="less">
.help {
  font-weight: 300 !important;
}
</style>
