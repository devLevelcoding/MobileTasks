import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme';

const CONFIGS = {
  0: { label: 'Pending',     bg: '#1e1e2e', color: C.textMuted },
  1: { label: 'In Progress', bg: '#1a2a1a', color: C.success   },
  2: { label: 'Completed',   bg: '#1a2a3a', color: '#60a5fa'   },
  3: { label: 'Overdue',     bg: '#2a1a1a', color: C.danger    },
} as const;

export default function StatusBadge({ status }: { status: number }) {
  const cfg = CONFIGS[status as keyof typeof CONFIGS] ?? CONFIGS[0];
  return (
    <View style={[s.pill, { backgroundColor: cfg.bg }]}>
      <Text style={[s.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  text: { fontSize: 11, fontWeight: '600' },
});
