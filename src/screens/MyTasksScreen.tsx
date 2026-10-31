import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, FlatList, Pressable, StyleSheet,
  ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C } from '../theme';
import { operatorApi } from '../api/tasks';
import type { AgencyTask } from '../api/tasks';
import { useAuthStore } from '../store/authStore';
import TaskCard from '../components/TaskCard';
import type { RootStackParams } from '../navigation/AppNavigator';

const LIMIT = 20;
const FILTERS = [
  { label: 'All',     value: undefined },
  { label: 'Pending', value: 0 },
  { label: 'Active',  value: 1 },
  { label: 'Done',    value: 2 },
] as const;

export default function MyTasksScreen() {
  const navigation   = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const { user, agencyIds, setAgencyIds, logout } = useAuthStore();

  const [tasks, setTasks]           = useState<AgencyTask[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage]             = useState(1);
  const [hasMore, setHasMore]       = useState(true);
  const [filter, setFilter]         = useState<number | undefined>(undefined);

  async function fetchTasks(p = 1, refresh = false) {
    try {
      const res = await operatorApi.myTasksAuto({ page: p, limit: LIMIT, status: filter });
      const { data, total, agencyIds: ids } = res.data;

      if (ids?.length && !agencyIds.length) setAgencyIds(ids);
      setTasks((prev) => (p === 1 ? data : [...prev, ...data]));
      setHasMore(p * LIMIT < total);
      setPage(p);
    } catch {
      if (!refresh) Alert.alert('Error', 'Could not load tasks.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchTasks(1); }, [filter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks(1, true);
  }, [filter]);

  const onEndReached = () => {
    if (hasMore && !loading) fetchTasks(page + 1);
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Hello, {user?.username} 👋</Text>
          <Text style={s.agencyLabel}>
            {agencyIds.length
              ? `Agency ${agencyIds.length > 1 ? `×${agencyIds.length}` : `#${agencyIds[0]}`}`
              : 'No agency assigned'}
          </Text>
        </View>
        <Pressable onPress={logout} style={s.logoutBtn}>
          <Text style={s.logoutText}>Logout</Text>
        </Pressable>
      </View>

      {/* Filter chips */}
      <View style={s.filters}>
        {FILTERS.map((f) => (
          <Pressable
            key={String(f.value)}
            style={[s.chip, filter === f.value && s.chipActive]}
            onPress={() => { setFilter(f.value); setPage(1); }}
          >
            <Text style={[s.chipText, filter === f.value && s.chipTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading && tasks.length === 0 ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={s.list}
          renderItem={({ item }) => (
            <TaskCard
              item={item}
              onPress={() =>
                navigation.navigate('TaskDetail', {
                  shopTaskId: item.id,
                  taskTitle:  item.task?.title ?? `Task #${item.taskId}`,
                })
              }
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyIcon}>📭</Text>
              <Text style={s.emptyText}>
                {agencyIds.length === 0 ? 'No agency assigned yet' : 'No tasks found'}
              </Text>
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

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  greeting:    { fontSize: 16, fontWeight: '600', color: C.text },
  agencyLabel: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  logoutBtn: {
    backgroundColor: '#1e1e2e', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: C.border,
  },
  logoutText: { fontSize: 13, color: C.textMuted },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999,
    backgroundColor: '#1e1e2e', borderWidth: 1, borderColor: C.border,
  },
  chipActive:     { backgroundColor: '#1a1a38', borderColor: C.primary },
  chipText:       { fontSize: 13, color: C.textMuted },
  chipTextActive: { color: C.primary, fontWeight: '600' },
  list:      { padding: 16 },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty:     { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 15, color: C.textMuted },
});
