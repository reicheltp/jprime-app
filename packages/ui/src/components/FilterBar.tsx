import React from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import type { FilterState } from '@jprime/utils'

interface FilterBarProps {
  days: string[]
  tracks: string[]
  value: FilterState
  onChange: (filter: FilterState) => void
}

export const FilterBar: React.FC<FilterBarProps> = ({ days, tracks, value, onChange }) => {
  const hasActiveFilter = value.day !== null || value.track !== null

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {days.map((day, i) => {
          const active = value.day === day
          return (
            <Pressable
              key={day}
              onPress={() => onChange({ ...value, day: active ? null : day })}
              style={[styles.chip, active ? styles.chipActivePrimary : styles.chipInactive]}
            >
              <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                Day {i + 1}
              </Text>
            </Pressable>
          )
        })}

        <View style={styles.divider} />

        {tracks.map((track) => {
          const active = value.track === track
          return (
            <Pressable
              key={track}
              onPress={() => onChange({ ...value, track: active ? null : track })}
              style={[styles.chip, active ? styles.chipActiveCyan : styles.chipInactive]}
            >
              <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                {track}
              </Text>
            </Pressable>
          )
        })}

        {hasActiveFilter && (
          <>
            <View style={styles.divider} />
            <Pressable
              onPress={() => onChange({ day: null, track: null })}
              style={styles.chipClear}
            >
              <Text style={styles.chipTextClear}>✕ Clear</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(52, 58, 64, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 8,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  chipActivePrimary: {
    backgroundColor: '#E83283',
    borderColor: '#E83283',
  },
  chipActiveCyan: {
    backgroundColor: 'rgba(57, 203, 251, 0.2)',
    borderColor: '#39CBFB',
  },
  chipClear: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'transparent',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipTextInactive: {
    color: '#ADB5BD',
  },
  chipTextClear: {
    fontSize: 13,
    fontWeight: '500',
    color: '#808080',
  },
})
