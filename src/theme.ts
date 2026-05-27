export const C = {
  bg:        '#0a0a0f',
  surface:   '#111118',
  border:    '#1e1e2e',
  borderHi:  '#3a3a5c',
  text:      '#e2e2e8',
  textMuted: '#6b6b80',
  textSub:   '#a0a0c0',
  primary:   '#4f46e5',
  primaryDk: '#4338ca',
  success:   '#4ade80',
  warning:   '#facc15',
  danger:    '#f87171',
  purple:    '#c084fc',
} as const;

export const S = {
  card: {
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    marginBottom: 12,
  },
  row: { flexDirection: 'row' as const, alignItems: 'center' as const },
  label: { fontSize: 11, color: C.textMuted, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '600' as const, color: C.text },
  body: { fontSize: 14, color: C.textSub, lineHeight: 20 },
  btn: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center' as const,
  },
} as const;
