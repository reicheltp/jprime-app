import { View, Text, ScrollView, Linking, Pressable } from 'react-native'
import { Card } from '@jprime/ui'
import { Ionicons } from '@expo/vector-icons'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']

export default function VenueScreen() {
  const handlePress = (url: string) => Linking.openURL(url)

  return (
    <ScrollView
      className="flex-1 bg-dark"
      contentContainerClassName="p-6"
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Venue Overview */}
      <Card variant="glass" className="mb-6">
        <View className="flex-row items-start mb-4">
          <Ionicons name="business-outline" size={24} color="#39CBFB" className="mr-3" />
          <Text className="text-white text-h3 font-bold flex-1">Venue</Text>
        </View>
        <Text className="text-neutral-300 text-body mb-4">
          jPrime 2026 will be held on <Text className="text-cyan font-semibold">June 3-4, 2026</Text> at the
          <Text className="text-white font-semibold"> "John Atanasoff" Innovation Forum</Text> in
          <Text className="text-white font-semibold"> Sofia Tech Park</Text>.
        </Text>
        <Text className="text-neutral-300 text-body">
          One of the leading and most preferable locations for events connected with hi-tech,
          entrepreneurship, science, ecology, education, innovations, digitalisation and healthcare.
        </Text>
      </Card>

      {/* Location */}
      <Card variant="glass" className="mb-6">
        <View className="flex-row items-start mb-4">
          <Ionicons name="location-outline" size={24} color="#39CBFB" className="mr-3" />
          <Text className="text-white text-h4 font-semibold">Location</Text>
        </View>
        <Pressable onPress={() => handlePress('https://goo.gl/maps/67NtDSTADcG2')}>
          <View className="flex-row items-center">
            <Text className="text-cyan text-body underline">
              Tsarigradsko Shosse 111B, Sofia, Bulgaria
            </Text>
            <Ionicons name="open-outline" size={16} color="#39CBFB" className="ml-2" />
          </View>
        </Pressable>
        <Text className="text-neutral-400 text-caption mt-2">
          Sofia Tech Park is located 6 km away from Sofia International Airport. 
          It usually takes up to 10 minutes to reach the venue by car.
        </Text>
      </Card>

      {/* Transportation */}
      <Card variant="glass" className="mb-6">
        <View className="flex-row items-start mb-4">
          <Ionicons name="car-sport-outline" size={24} color="#39CBFB" className="mr-3" />
          <Text className="text-white text-h4 font-semibold">Transportation</Text>
        </View>
        <Text className="text-neutral-300 text-body">
          Average taxi price: <Text className="text-white font-semibold">€0.40-0.45 per km</Text>
        </Text>
      </Card>

      {/* Travel Information */}
      <Card variant="glass" className="mb-6">
        <View className="flex-row items-start mb-4">
          <Ionicons name="airplane-outline" size={24} color="#39CBFB" className="mr-3" />
          <Text className="text-white text-h4 font-semibold">Travel Information</Text>
        </View>
        <View className="mb-3">
          <Text className="text-white text-caption font-semibold mb-1">Bulgaria</Text>
          <Text className="text-neutral-300 text-body">
            EU citizens do not require a visa. Free entrance for Schengen visa holders. 
            For other countries, check 
            <Text className="text-cyan underline" onPress={() => handlePress('https://visaguide.world/europe/bulgaria-visa/')}>here</Text>.
          </Text>
        </View>
        <View>
          <Text className="text-white text-caption font-semibold mb-1">Local Currency</Text>
          <Text className="text-neutral-300 text-body">Euro (EUR)</Text>
        </View>
        <Pressable onPress={() => handlePress('https://en.wikipedia.org/wiki/Bulgaria')} className="mt-3">
          <View className="flex-row items-center">
            <Text className="text-cyan text-caption underline">More info on Wikipedia</Text>
            <Ionicons name="open-outline" size={14} color="#39CBFB" className="ml-1" />
          </View>
        </Pressable>
      </Card>

      {/* Accommodation */}
      <Card variant="glass" className="mb-6">
        <View className="flex-row items-start mb-4">
          <Ionicons name="bed-outline" size={24} color="#39CBFB" className="mr-3" />
          <Text className="text-white text-h4 font-semibold">Accommodation</Text>
        </View>
        <Text className="text-neutral-300 text-body mb-3">
          For conference guests, we recommend:
        </Text>
        <Pressable onPress={() => handlePress('https://hotelvegasofia.bg/')}>
          <View className="flex-row items-center">
            <Text className="text-cyan text-body underline font-medium">
              Vega Hotel Sofia
            </Text>
            <Ionicons name="open-outline" size={16} color="#39CBFB" className="ml-2" />
          </View>
        </Pressable>
        <Text className="text-neutral-400 text-caption mt-1">
          Located approximately a 20-minute walk from the venue.
        </Text>
        <Pressable onPress={() => handlePress('mailto:ivan@jprime.io')} className="mt-3">
          <View className="flex-row items-center">
            <Text className="text-cyan text-caption underline">Contact Ivan for more information</Text>
            <Ionicons name="mail-outline" size={14} color="#39CBFB" className="ml-1" />
          </View>
        </Pressable>
      </Card>

      {/* Contact */}
      <Card variant="glass" className="mb-6">
        <View className="flex-row items-start mb-4">
          <Ionicons name="mail-outline" size={24} color="#39CBFB" className="mr-3" />
          <Text className="text-white text-h4 font-semibold">Contact Us</Text>
        </View>
        <View className="mb-3">
          <Text className="text-white text-caption font-semibold mb-1">Sponsors / Tickets / Questions</Text>
          <Pressable onPress={() => handlePress('mailto:conference@jprime.io')}>
            <Text className="text-cyan text-body underline">conference@jprime.io</Text>
          </Pressable>
        </View>
        <View>
          <Text className="text-white text-caption font-semibold mb-1">Phone</Text>
          <Pressable onPress={() => handlePress('tel:+359887749325')}>
            <Text className="text-cyan text-body underline">+359 887 749 325</Text>
          </Pressable>
        </View>
      </Card>
    </ScrollView>
  )
}
