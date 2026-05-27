import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { C, S } from '../theme';
import StatusBadge from './StatusBadge';
import type { AgencyTask } from '../api/tasks';

interface Props {
  item: AgencyTask;
  onPress: () => void;
}

export default function TaskCard({ item, onPress }: Props) {
  const due = item.dueDate ? new Date(item.dueDate).toLocaleDateString() : null;
  const title = item.task?.title ?? `Task #${item.taskId}`;
  const qCount = item.task?._count?.questions ?? 0;

  return (
    <Pressable style={({ pressed }) => [s.card, pressed && s.cardPressed]} onPress={onPress}>
      <View style={[S.row, { justifyContent: 'space-between', marginBottom: 10 }]}>
        <Text style={s.title} numberOfLines={2}>{title}</Text>
        <StatusBadge status={item.status} />
      </View>

      <View style={[S.row, { gap: 16 }]}>
        {qCount > 0 && (
          <View style={S.row}>
            <Text style={s.icon}>❓</Text>
            <Text style={s.meta}>{qCount} questions</Text>
          </View>
        )}
        {due && (
          <View style={S.row}>
            <Text style={s.icon}>📅</Text>
            <Text style={s.meta}>Due {due}</Text>
          </View>
        )}
      </View>

      {item.status === 0 && (
        <View style={s.cta}>
          <Text style={s.ctaText}>Tap to start →</Text>
        </View>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    ...S.card,
  },
  cardPressed: {
    borderColor: C.primary,
    opacity: 0.9,
  },
  title: {
    ...S.title,
    flex: 1,
    marginRight: 10,
  },
  meta: {
    fontSize: 12,
    color: C.textMuted,
    marginLeft: 4,
  },
  icon: {
    fontSize: 12,
  },
  cta: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 8,
  },
  ctaText: {
    fontSize: 12,
    color: C.primary,
    fontWeight: '500',
  },
});
