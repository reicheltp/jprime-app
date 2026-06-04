import React, { useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

interface SpeakerAvatarProps {
  photoUrl: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: { diameter: 44, fontSize: 15 },
  md: { diameter: 64, fontSize: 22 },
  lg: { diameter: 112, fontSize: 36 },
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
  const { diameter, fontSize } = SIZES[size]
  const showImage = photoUrl !== null && !imgError

  return (
    <View
      style={[
        styles.container,
        { width: diameter, height: diameter, borderRadius: diameter / 2 },
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri: photoUrl }}
          style={styles.image}
          onError={() => setImgError(true)}
        />
      ) : (
        <Text style={[styles.initials, { fontSize }]}>{initials(name)}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#E83283',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(232,50,131,0.35)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
})
