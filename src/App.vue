<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useUserStore } from '@/stores/user'

// Data
const emailInput = ref("")
const passwordInput = ref("")
const currentImgId = ref(0)

const imgTitle = ref("")
const imgSrc = ref("")
const imgAuthor = ref("")
const imgDescription = ref("")

const gallery = ref([])

const userStore = useUserStore()

// LOGIN METHOD
async function login() {
  let result = await axios.post(
    'http://localhost/exercices/jwt/OOP_MVC_PHP/?page=api&action=login', 
    {
    email: emailInput.value,
    password: passwordInput.value
    }, 
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if(result.data !== "") {
      const token = result.data.token
      const decoded = jwtDecode(token)
      userStore.setUserToken(decoded)
      userStore.setUserJwtToken(token)
    }
    else {
      console.log("perdu")
    }

}

async function sendImg() {
  let result = await axios.post(
    'http://localhost/exercices/jwt/OOP_MVC_PHP/?page=api&action=add', 
    {
      title: imgTitle.value,
      src: imgSrc.value,
      description: imgDescription.value,
      author: imgAuthor.value
    }, 
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${userStore.getUserJwtToken}`
      }
    })
}

async function getImgs() {
  let result = await axios.get(
    'http://localhost/exercices/jwt/OOP_MVC_PHP/?page=api'
    )
  gallery.value = result.data
  console.log(gallery.value)
}
getImgs()

function displayText(id) {
  currentImgId.value = id
    
}
function hideText(id) {
  currentImgId.value = 0
}

</script>

<template>
  <form @submit.prevent v-if="!userStore.getUserToken">
    <h1>Login</h1>
    <p>
      <label for="email">Email</label>
      <input type="text" id="email" v-model="emailInput" required>
    </p>

    <p>
      <label for="password">Mot de passe</label>
      <input type="password" id="password" v-model="passwordInput" required>
    </p>
    <button @click="login">Connexion</button>
  </form>
  <template v-else>
    <h3>Bonjour, {{ userStore.getUserToken.user_name }}</h3>
    <form @submit.prevent>
      <h4>Ajouter une image</h4>
      <p>
        <label for="title">Titre</label>
        <input type="text" id="title" v-model="imgTitle" required>
      </p>
      <p>
        <label for="src">Source</label>
        <input type="text" id="src" v-model="imgSrc" required>
      </p>
      <p>
        <label for="desc">Description</label>
        <input type="text" id="desc" v-model="imgDescription" required>
      </p>
      <p>
        <label for="author">Auteur·rice</label>
        <input type="text" id="author" v-model="imgAuthor" required>
      </p>
      <button @click="sendImg">Ajouter une image</button>
    </form>
  </template>

  <section class="gallery">
    <template v-for="img in gallery" :key="img.id">
      <div class="img-container" @mouseenter="displayText(img.id)" @mouseleave="hideText(img.id)">
        <img :src="img.src" class="img-gallery" :alt="img.title">
        <div class="hover-text" :class="img.id === currentImgId ? 'text-up':'text-down'">
          <h5>{{img.title}}</h5>
          <p>{{ img.description }}</p>      
        </div>
      </div>
    </template>

  </section>


</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: center;

}
.img-gallery {
  height: 200px;
  width: auto;
}

.img-container {
  position: relative;
  overflow: hidden;
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.hover-text {
  position: absolute;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.699);
  transition: 0.2s ease-in;
  padding: 20px;
}

.text-down {
  top: 200px;
}

.text-up {
  top: 0px;
}

</style>
