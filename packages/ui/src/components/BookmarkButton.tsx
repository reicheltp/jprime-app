import React from 'react'
import { Pressable, Text } from 'react-native'
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

  return (
    <Pressable
      onPress={() => toggle.mutate(sessionId)}
      disabled={isLoading}
      className={`flex-row items-center gap-1.5 px-4 py-2 rounded-md border min-h-[44px] ${
        isBookmarked
          ? 'bg-primary border-primary'
          : 'bg-neutral-700 border-neutral-600'
      } ${isLoading ? 'opacity-50' : ''}`}
    >
      <Text className={size === 'sm' ? 'text-sm' : 'text-base'}>
        {isBookmarked ? '🔖' : '🔗'}
      </Text>
      <Text
        className={`font-medium ${size === 'sm' ? 'text-sm' : 'text-base'} text-white`}
      >
        {isLoading ? '…' : isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </Text>
    </Pressable>
  )
}
