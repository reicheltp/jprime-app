import React from 'react'
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useBookmarks, useToggleBookmark } from '@jprime/api'

interface BookmarkButtonProps {
  sessionId: string
  size?: 'sm' | 'md'
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  sessionId,
  size = 'md',
}) => {
  const { data: bookmarks } = useBookmarks()
  const toggle = useToggleBookmark()

  const isBookmarked = bookmarks?.has(sessionId) ?? false
  const isLoading = toggle.isPending
  const iconSize = size === 'sm' ? 14 : 16
  const fontSize = size === 'sm' ? 13 : 14

  return (
    <Pressable
      onPress={() => toggle.mutate(sessionId)}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.base,
        isBookmarked ? styles.active : styles.inactive,
        isLoading && styles.loading,
        pressed && !isLoading && styles.pressed,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={isBookmarked ? '#FFFFFF' : '#E83283'} />
      ) : (
        <>
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={iconSize}
            color={isBookmarked ? '#FFFFFF' : '#E83283'}
          />
          <Text style={[styles.label, { fontSize }, isBookmarked ? styles.labelActive : styles.labelInactive]}>
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Text>
        </>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
  },
  inactive: {
    backgroundColor: 'transparent',
    borderColor: '#E83283',
  },
  active: {
    backgroundColor: '#E83283',
    borderColor: '#E83283',
    shadowColor: '#E83283',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  loading: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  label: {
    fontWeight: '600',
  },
  labelActive: {
    color: '#FFFFFF',
  },
  labelInactive: {
    color: '#E83283',
  },
})
