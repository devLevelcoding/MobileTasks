import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, RefreshControl, Pressable,
} from 'react-native';
import { C, S } from '../theme';
import { tasksApi } from '../api/tasks';
import type { Task } from '../api/tasks';
import StatusBadge from '../components/StatusBadge';

const LIMIT = 25;

export default function AllTasksScreen() {
  const [tasks, setTasks]         = useState<Task[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);

  async function fetchTasks(p = 1, refresh = false) {
    try {
      const res = await tasksApi.list({ page: p, limit: LIMIT });
      const { data, total } = res.data;
      setTasks((prev) => (p === 1 ? data : [...prev, ...data]));
      setHasMore(p * LIMIT < total);
      setPage(p);
    } catch {
      // silently fail on load-more errors
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchTasks(1); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks(1, true);
  }, []);

  const onEndReached = () => {
    if (hasMore && !loading) fetchTasks(page + 1);
  };

  return (
    <View style={s.root}>
      {loading && tasks.length === 0 ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={s.list}
          renderItem={({ item }) => <AllTaskRow task={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyIcon}>📋</Text>
              <Text style={s.emptyText}>No tasks available</Text>
            </View>
          }
          ListFooterComponent={
            hasMore && tasks.length > 0
              ? <ActivityIndicator color={C.textMuted} style={{ marginVertical: 16 }} />
              : null
          }
        />
      )}
    </View>
  );
}

function AllTaskRow({ task }: { task: Task }) {
  const due    = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;
  const shops  = task._count?.shopTasks ?? 0;
  const qCount = task._count?.questions ?? 0;

  return (
    <View style={S.card}>
      <View style={[S.row, { justifyContent: 'space-between', marginBottom: 8 }]}>
        <Text style={s.taskTitle} numberOfLines={2}>{task.title}</Text>
        <StatusBadge status={task.status} />
      </View>
      <View style={[S.row, { gap: 16, flexWrap: 'wrap' }]}>
        <MetaItem icon="🏬" label={`${shops} shops`} />
        {qCount > 0 && <MetaItem icon="❓" label={`${qCount} questions`} />}
        {due && <MetaItem icon="📅" label={`Due ${due}`} />}
      </View>
    </View>
  );
}

function MetaItem({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={S.row}>
      <Text style={{ fontSize: 12 }}>{icon}</Text>
      <Text style={s.meta}> {label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root:      { flex: 1, backgroundColor: C.bg },
  list:      { padding: 16 },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty:     { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 15, color: C.textMuted },
  taskTitle: { fontSize: 15, fontWeight: '600', color: C.text, flex: 1, marginRight: 8 },
  meta:      { fontSize: 12, color: C.textMuted },
});
