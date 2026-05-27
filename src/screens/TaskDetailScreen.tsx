import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackRouteProp } from '@react-navigation/native-stack';
import { C, S } from '../theme';
import { operatorApi, tasksApi } from '../api/tasks';
import type { AgencyTask, Question } from '../api/tasks';
import StatusBadge from '../components/StatusBadge';
import QuestionItem from '../components/QuestionItem';
import type { RootStackParams } from '../navigation/AppNavigator';

type RouteProps = NativeStackRouteProp<RootStackParams, 'TaskDetail'>;

export default function TaskDetailScreen() {
  const route     = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { shopTaskId } = route.params;

  const [task, setTask]           = useState<AgencyTask | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answered, setAnswered]   = useState<Set<number>>(new Set());
  const [loading, setLoading]     = useState(true);
  const [completing, setCompleting] = useState(false);

  const load = useCallback(async () => {
    try {
      // We don't have a direct "get shop task" endpoint, so we use what we have
      // The AgencyTask is passed via navigation; questions come from the task endpoint
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [shopTaskId]);

  useEffect(() => { load(); }, [load]);

  async function handleStart() {
    try {
      const res = await operatorApi.start(shopTaskId);
      setTask(res.data);

      // Load questions for this task
      if (res.data.taskId) {
        const qRes = await tasksApi.questions(res.data.taskId);
        setQuestions(qRes.data);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message ?? 'Could not start task.');
    }
  }

  async function handleAnswer(questionId: number, answers: number[], response?: string) {
    try {
      await operatorApi.answer(shopTaskId, { questionId, answers, response });
      setAnswered((prev) => new Set([...prev, questionId]));
    } catch {
      Alert.alert('Error', 'Could not submit answer.');
    }
  }

  async function handleComplete() {
    Alert.alert(
      'Complete task',
      'Mark this task as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            setCompleting(true);
            try {
              await operatorApi.complete(shopTaskId);
              Alert.alert('Done!', 'Task marked as completed.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch {
              Alert.alert('Error', 'Could not complete task.');
            } finally {
              setCompleting(false);
            }
          },
        },
      ],
    );
  }

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  const pendingAnswers = questions.filter((q) => !answered.has(q.id));
  const canComplete = questions.length === 0 || pendingAnswers.length === 0;

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content}>
      {/* Status row */}
      <View style={[S.row, { justifyContent: 'space-between', marginBottom: 16 }]}>
        <Text style={s.sectionLabel}>Shop Task #{shopTaskId}</Text>
        {task && <StatusBadge status={task.status} />}
      </View>

      {/* Start button (task not started yet) */}
      {(!task || task.status === 0) && (
        <View style={s.startBox}>
          <Text style={s.startTitle}>Ready to begin?</Text>
          <Text style={s.startSub}>Starting the task will mark it as in progress.</Text>
          <Pressable style={s.startBtn} onPress={handleStart}>
            <Text style={s.startBtnText}>▶ Start Task</Text>
          </Pressable>
        </View>
      )}

      {/* Questions */}
      {task && task.status >= 1 && (
        <>
          <Text style={s.sectionLabel}>
            Questions ({answered.size}/{questions.length} answered)
          </Text>

          {questions.length === 0 && (
            <View style={[S.card, { marginBottom: 16 }]}>
              <Text style={{ color: C.textMuted, fontSize: 14 }}>
                No questions — tap Complete when done.
              </Text>
            </View>
          )}

          {questions.map((q) => (
            <QuestionItem
              key={q.id}
              question={q}
              shopTaskId={shopTaskId}
              onAnswer={handleAnswer}
              answered={answered.has(q.id)}
            />
          ))}

          {/* Complete button */}
          {task.status < 2 && (
            <Pressable
              style={[s.completeBtn, !canComplete && s.completeBtnDisabled]}
              onPress={handleComplete}
              disabled={!canComplete || completing}
            >
              {completing
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.completeBtnText}>
                    {canComplete ? '✓ Complete Task' : `Answer ${pendingAnswers.length} more questions`}
                  </Text>
              }
            </Pressable>
          )}

          {task.status === 2 && (
            <View style={s.completedBanner}>
              <Text style={s.completedText}>✓ Task Completed</Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: C.bg },
  content: { padding: 20 },
  center:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sectionLabel: {
    fontSize: 11, fontWeight: '600', color: C.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12,
  },
  startBox: {
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  startTitle:  { fontSize: 18, fontWeight: '700', color: C.text },
  startSub:    { fontSize: 13, color: C.textMuted, textAlign: 'center' },
  startBtn:    { ...S.btn, backgroundColor: C.primary, marginTop: 8, paddingHorizontal: 32 },
  startBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  completeBtn: {
    ...S.btn,
    backgroundColor: '#1a3a1a',
    borderWidth: 1,
    borderColor: '#2a5a2a',
    marginTop: 16,
  },
  completeBtnDisabled: { opacity: 0.5 },
  completeBtnText: { color: C.success, fontSize: 15, fontWeight: '600' },
  completedBanner: {
    backgroundColor: '#1a2a1a',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a4a2a',
    marginTop: 16,
  },
  completedText: { color: C.success, fontSize: 16, fontWeight: '700' },
});
