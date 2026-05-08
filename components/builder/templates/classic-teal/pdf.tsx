import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { ResumeDraft } from '@/lib/types/resume';

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 10, color: '#0f172a', fontFamily: 'Helvetica' },
  row: { flexDirection: 'row', gap: 14 },
  left: { width: '35%', paddingRight: 12 },
  right: { width: '65%' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f766e', marginBottom: 4 },
  subtitle: { fontSize: 11, marginBottom: 8 },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
    color: '#155e75',
  },
  line: { marginBottom: 3 },
  itemTitle: { fontSize: 10, fontWeight: 'bold' },
  muted: { color: '#475569' },
  chip: { fontSize: 9, marginBottom: 2 },
});

export function ClassicTealPdf({ draft }: { draft: ResumeDraft }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{draft.basics.fullName}</Text>
        <Text style={styles.subtitle}>{draft.basics.professionalTitle}</Text>
        <Text style={[styles.line, styles.muted]}>
          {[draft.basics.email, draft.basics.phone, draft.basics.location].filter(Boolean).join(' • ')}
        </Text>
        <Text style={[styles.line, styles.muted]}>
          {[draft.basics.github, draft.basics.linkedin, draft.basics.website].filter(Boolean).join(' • ')}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text>{draft.basics.summary}</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.left}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              {[...draft.skills.frontend, ...draft.skills.backend, ...draft.skills.database, ...draft.skills.soft].map(
                (skill) => (
                  <Text key={skill} style={styles.chip}>
                    • {skill}
                  </Text>
                ),
              )}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {draft.education.map((item) => (
                <View key={`${item.institution}-${item.year}`} style={{ marginBottom: 8 }}>
                  <Text style={styles.itemTitle}>{item.degree}</Text>
                  <Text>{item.institution}</Text>
                  <Text style={styles.muted}>{item.year}</Text>
                </View>
              ))}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interests</Text>
              {draft.extras.interests.concat(draft.extras.hobbies).map((item) => (
                <Text key={item} style={styles.chip}>
                  • {item}
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.right}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {draft.experience.map((item) => (
                <View key={`${item.company}-${item.role}`} style={{ marginBottom: 10 }}>
                  <Text style={styles.itemTitle}>
                    {item.role} — {item.company}
                  </Text>
                  <Text style={styles.muted}>
                    {item.start} - {item.current ? 'Present' : item.end}
                  </Text>
                  <Text>{item.summary}</Text>
                </View>
              ))}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {draft.projects.map((project) => (
                <View key={project.title} style={{ marginBottom: 10 }}>
                  <Text style={styles.itemTitle}>{project.title}</Text>
                  <Text>{project.description}</Text>
                  <Text style={styles.muted}>{project.technologies.join(', ')}</Text>
                  <Text style={styles.muted}>{project.link}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
