<script setup lang="ts">
  import { Capital } from '@/types/types'
  import { computed, ref } from 'vue'
  import { useCapitalsStore } from '@/stores/capitalsStore'

  const capitalsStore = useCapitalsStore()
  const capitals = computed<Capital[]>(() => capitalsStore.capitals)

  onMounted(() => {
    capitalsStore.fetchCapitals()
  })

  const capital = ref<string>('')

  const distance = ref<number>(2500)

  const currentCapital = computed<Capital | undefined>(() => {
    return capitals.value.find(c => c.capitalName === capital.value)
  })

  const capitalsWithDistance = computed<Capital[]>(() => {
    if (!currentCapital?.value) {
      return []
    }

    return capitals.value.filter(cap => cap.region === currentCapital?.value?.region)
      .map(cap => ({
        ...cap,
        distance: cap.latlng ? haversineDistance(
          currentCapital.value!.latlng[0],
          currentCapital.value!.latlng[1],
          cap.latlng[0],
          cap.latlng[1]
        ) : 0,
      }))
      .filter(cap => cap.distance <= distance.value && cap.distance !== 0)
      .sort((cap1, cap2) => cap1.distance - cap2.distance)
  })

  // Function to calculate the Haversine distance
  function haversineDistance (lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Radius of the Earth in kilometers
    const toRadians = (degree: number) => degree * (Math.PI / 180)

    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return parseInt(R * c) // Return the distance in kilometers
  }

</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>Settings:</h2>
        <v-form>
          <v-row>
            <!-- Capital Selector -->
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="capital"
                :item-title="(item)=>item ? item.capitalName+','+item.countryName: 'Please select a capital'"
                item-value="capitalName"
                :items="capitals"
                label="Capital"
                :menu-props="{ maxHeight: '300px' }"
              />
            </v-col>

            <!-- Distance Input -->
            <v-col cols="12" md="2">
              <v-text-field
                v-model="distance"
                label="Distance (km)"
                max="5000"
                min="0"
                outlined
                type="number"
              />
            </v-col>

            <!-- Distance Slider -->
            <v-col cols="12" md="6">
              <v-slider
                v-model="distance"
                label="Select distance"
                max="5000"
                min="0"
                step="10"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h2>Results:</h2>
        <v-list dense>
          <v-list-item
            v-for="capitalWithDistance in capitalsWithDistance"
            :key="capitalWithDistance.capitalName + capitalWithDistance.countryName"
          >
            <v-list-item-title>
              {{ capitalWithDistance.capitalName }}, {{ capitalWithDistance.countryName }} ({{ capitalWithDistance.distance }} km)
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>

</template>

<style scoped>

</style>
