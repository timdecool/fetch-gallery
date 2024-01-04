import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * Le store permet de stocker et traiter les données et préférences de l'utilisateur
 */

export const useUserStore = defineStore('user', () => {
    
    const userToken = ref(null)
    const userJwtToken = ref(null)

    function setUserToken(token) {
        userToken.value = token
        localStorage.setItem('token', JSON.stringify(token))
    }
    
    const getUserToken = computed(() => {
        const token = localStorage.getItem('token')
        return token ? JSON.parse(token):userToken.value
    })
    
    function setUserJwtToken(token) {
        userJwtToken.value = token
        localStorage.setItem('jwtToken', JSON.stringify(token))  
    }
    
    const getUserJwtToken = computed(() => {
        const token = localStorage.getItem('jwtToken')
        return token ? JSON.parse(token):userJwtToken.value
    })
    
    return { 
        getUserJwtToken, setUserJwtToken, 
        getUserToken, setUserToken    
    }
})
