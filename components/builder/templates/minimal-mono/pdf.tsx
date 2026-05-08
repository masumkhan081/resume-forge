import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { ResumeDraft } from '@/lib/types/resume';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Times-Roman', color: '#1f2937' },
  name: { fontSize: 24 },
  title: { fontSize: 11, fontStyle: 'italic', color: '#475569', marginTop: 2, marginBottom: 8 },
  contacts: { fontSize: 9, color: '#475569', marginBottom: 4 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#cbd5e1', marginTop: 8, marginBottom: 12 },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 9,
    letterSpacing: 2,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  body: { fontSize: 10, lineHeight: 1.5 },
  itemTitle: { fontSize: 10, fontWeight: 'bold' },
  meta: { fontSize: 9, fontStyle: 'italic', color: '#64748b' },
});

export function MinimalMonoPdf({ draft }: { draft: ResumeDraft }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{draft.basics.fullName}</Text>
        <Text style={styles.title}>{draft.basics.professionalTitle}</Text>
        <Text style={styles.contacts}>
          {[draft.basics.email, draft.basics.phone, draft.basics.location].filter(Boolean).join('  ·  ')}
        </Text>
        <Text style={styles.contacts}>
          {[draft.basics.website, draft.basics.github, draft.basics.linkedin].filter(Boolean).join('  ·  ')}
        </Text>
        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.body}>{draft.basics.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.body}>
            {[
              ...draft.skills.frontend,
              ...draft.skills.backend,
              ...draft.skills.database,
              ...draft.skills.soft,
            ].join('  ·  ')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {draft.experience.map((item) => (
            <View key={`${item.company}-${item.role}`} style={{ marginBottom: 8 }}>
              <Text style={styles.itemTitle}>
                {item.role} — {item.company}
              </Text>
              <Text style={styles.meta}>
                {item.start} – {item.current ? 'Present' : item.end}
              </Text>
              <Text style={styles.body}>{item.summary}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {draft.projects.map((project) => (
            <View key={project.title} style={{ marginBottom: 8 }}>
              <Text style={styles.itemTitle}>{project.title}</Text>
              <Text style={styles.body}>{project.description}</Text>
              <Text style={styles.meta}>
                {project.technologies.join(', ')} · {project.link}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {draft.education.map((item) => (
            <Text key={`${item.institution}-${item.year}`} style={styles.body}>
              {item.degree}, {item.institution} · {item.year}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
