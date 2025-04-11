<template>
  <q-layout view="hHh lpR fFf">
    <!-- Top Toolbar -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          Blog Management
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Left Drawer (Sidebar) -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list padding>

        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="article" />
          </q-item-section>
          <q-item-section>
            Blogs
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="logout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            Logout
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const leftDrawerOpen = ref(false)
const router = useRouter()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function logout() {

  localStorage.removeItem("access_token");
  await router.push('/login')
}
</script>
