import { Capital } from '@/types/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCapitalsStore = defineStore('capitals', () => {
  const capitals = ref<Capital[]>([])

  async function fetchCapitals () {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all')
      const data = await response.json()
      capitals.value = data.map((country: any) => ({
        capitalName: country.capital?.[0] || 'Unknown',
        countryName: country.name.common,
        latlng: country.capitalInfo.latlng || [0, 0],
      }))
    } catch (error) {
      console.error('Error fetching capitals:', error)
    }
  }

  return {
    capitals,
    fetchCapitals,
  }
})
