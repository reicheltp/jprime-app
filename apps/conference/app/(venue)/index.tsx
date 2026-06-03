import { View, Text, ScrollView } from 'react-native'
import { Card } from '@jprime/ui'

export default function VenueScreen() {
  return (
    <ScrollView
      className="flex-1 bg-dark"
      contentContainerClassName="p-6"
      contentInsetAdjustmentBehavior="automatic"
    >
      <Card variant="glass" className="mb-6">
        <Text className="text-white text-h3 font-bold mb-2">Venue Information</Text>
        <Text className="text-neutral-300 text-body">
          JPrime Conference 2026 will be held at a premier location.
          Detailed venue information coming soon.
        </Text>
      </Card>
      
      <Card variant="glass" className="mb-6">
        <Text className="text-white text-h4 font-semibold mb-2">📍 Location</Text>
        <Text className="text-neutral-300 text-body">TBD</Text>
      </Card>
      
      <Card variant="glass" className="mb-6">
        <Text className="text-white text-h4 font-semibold mb-2">🚇 Transportation</Text>
        <Text className="text-neutral-300 text-body">Transportation details coming soon.</Text>
      </Card>
    </ScrollView>
  )
}
