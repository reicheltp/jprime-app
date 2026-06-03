import React, { useState } from 'react'
import { View, Text, Image } from 'react-native'

interface SpeakerAvatarProps {
  photoUrl: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES: Record<string, { container: string; text: string }> = {
  sm: { container: 'w-10 h-10', text: 'text-sm' },
  md: { container: 'w-16 h-16', text: 'text-xl' },
  lg: { container: 'w-24 h-24', text: 'text-3xl' },
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    const word = parts[0] ?? ''
    return word.slice(0, 2).toUpperCase()
  }
  const first = parts[0]?.[0] ?? ''
  const last = parts[parts.length - 1]?.[0] ?? ''
  return (first + last).toUpperCase()
}

export const SpeakerAvatar: React.FC<SpeakerAvatarProps> = ({
  photoUrl,
  name,
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false)
  const sizes = SIZE_CLASSES[size] ?? SIZE_CLASSES['md']!
  const showImage = photoUrl !== null && !imgError

  return (
    <View
      className={`${sizes.container} rounded-full overflow-hidden bg-primary items-center justify-center`}
    >
      {showImage ? (
        <Image
          source={{ uri: photoUrl }}
          className="w-full h-full"
          onError={() => setImgError(true)}
        />
      ) : (
        <Text className={`${sizes.text} text-white font-bold`}>{initials(name)}</Text>
      )}
    </View>
  )
}
