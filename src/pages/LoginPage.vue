<template>
    <q-page class="q-pa-md flex flex-center">
        <q-card class="q-pa-lg shadow-2 rounded-borders" style="width: 400px; max-width: 90%;">
            <q-card-section>
                <div class="text-h6 text-center">Login</div>
            </q-card-section>

            <q-form @submit.prevent="onLogin">
                <q-card-section class="q-gutter-md">
                    <q-banner v-if="serverError" class="bg-red-2 text-negative q-mb-md">
                        {{ serverError }}
                    </q-banner>
                    <q-input filled v-model="email" type="email" label="Email" lazy-rules
                        :rules="[val => !!val || 'Email is required']" />
                    <q-input filled v-model="password" type="password" label="Password" lazy-rules
                        :rules="[val => !!val || 'Password is required']" />
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn label="Login" type="submit" color="primary" />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const serverError = ref('')

const router = useRouter()


async function onLogin() {
    try {
        serverError.value = ''

        const response = await fetch(`${import.meta.env.VITE_API_URL}/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: email.value,
                password: password.value,
                grant_type: 'password',
                client_id: import.meta.env.VITE_CLIENT_ID,
                client_secret: import.meta.env.VITE_CLIENT_SECRET
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            serverError.value = errorData?.error_description;
            return
        }

        const data = await response.json()

        // Store token and redirect to another page if needed
        localStorage.setItem('access_token', data.access_token)
        await router.push('/');
    } catch (error) {
        console.error('Login error:', error)
    }
}

</script>

<style scoped>
.q-page {
    height: 100vh;
}
</style>