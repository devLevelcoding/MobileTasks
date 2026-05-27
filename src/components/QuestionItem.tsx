import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { C, S } from '../theme';
import type { Question } from '../api/tasks';

interface Props {
  question: Question;
  shopTaskId: number;
  onAnswer: (questionId: number, answers: number[], response?: string) => void;
  answered?: boolean;
}

export default function QuestionItem({ question, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [textResponse, setTextResponse] = useState('');
  const isQuiz = question.type === 1;
  const isText = question.type === 2;

  function toggleAnswer(idx: number) {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  }

  function submit() {
    if (isText) {
      onAnswer(question.id, [], textResponse);
    } else {
      onAnswer(question.id, selected);
    }
  }

  return (
    <View style={[s.container, answered && s.containerDone]}>
      <Text style={s.qText}>{question.question}</Text>

      {isQuiz && question.answers && (
        <View style={s.answers}>
          {question.answers.map((a, idx) => (
            <Pressable
              key={idx}
              style={[s.answerRow, selected.includes(idx) && s.answerSelected]}
              onPress={() => !answered && toggleAnswer(idx)}
            >
              <View style={[s.checkbox, selected.includes(idx) && s.checkboxOn]}>
                {selected.includes(idx) && <Text style={s.checkMark}>✓</Text>}
              </View>
              <Text style={s.answerText}>{a.answer}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {isText && (
        <TextInput
          style={s.textInput}
          placeholder="Type your response…"
          placeholderTextColor={C.textMuted}
          value={textResponse}
          onChangeText={setTextResponse}
          multiline
          editable={!answered}
        />
      )}

      {!answered && (
        <Pressable style={s.submitBtn} onPress={submit}>
          <Text style={s.submitBtnText}>Submit answer</Text>
        </Pressable>
      )}

      {answered && (
        <View style={s.doneBadge}>
          <Text style={s.doneText}>✓ Answered</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    ...S.card,
    marginBottom: 10,
  },
  containerDone: {
    opacity: 0.6,
    borderColor: '#1a2a1a',
  },
  qText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  answers: { gap: 8 },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1a1a28',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  answerSelected: {
    borderColor: C.primary,
    backgroundColor: '#1a1a38',
  },
  checkbox: {
    width: 20, height: 20,
    borderRadius: 4,
    borderWidth: 1, borderColor: C.borderHi,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  answerText: { fontSize: 13, color: C.textSub, flex: 1 },
  textInput: {
    backgroundColor: '#1a1a28',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    color: C.text,
    padding: 10,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    ...S.btn,
    backgroundColor: C.primary,
    marginTop: 12,
  },
  submitBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  doneBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#1a2a1a',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  doneText: { color: C.success, fontSize: 12, fontWeight: '600' },
});
