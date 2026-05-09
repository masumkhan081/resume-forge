import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { ResumeDraft } from '@/lib/types/resume';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Times-Roman', color: '#1f2937' },
  name: { fontSize: 24 },
  title: { fontSize: 11, fontStyle: 'italic', color: '#475569', marginTop: 2, marginBottom: 8 },
  contacts: { fontSize: 9, color: '#475569', marginBottom: 4, wordBreak: 'break-all' },
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
  link: { fontSize: 9, fontStyle: 'italic', color: '#64748b', wordBreak: 'break-all' },
  entry: { marginBottom: 8 },
});

function nonEmpty<T extends string>(values: (T | undefined | null)[]): T[] {
  return values.filter((v): v is T => Boolean(v && v.trim?.() !== ''));
}

export function MinimalMonoPdf({ draft }: { draft: ResumeDraft }) {
  const allSkills = nonEmpty([
    ...draft.skills.frontend,
    ...draft.skills.backend,
    ...draft.skills.database,
    ...draft.skills.soft,
  ]);
  const contactPrimary = nonEmpty([
    draft.basics.email,
    draft.basics.phone,
    draft.basics.location,
  ]);
  const contactLinks = nonEmpty([
    draft.basics.website,
    draft.basics.github,
    draft.basics.linkedin,
  ]);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View wrap={false}>
          <Text style={styles.name}>{draft.basics.fullName || 'Untitled resume'}</Text>
          <Text style={styles.title}>{draft.basics.professionalTitle}</Text>
          {contactPrimary.length > 0 ? (
            <Text style={styles.contacts}>{contactPrimary.join('  ·  ')}</Text>
          ) : null}
          {contactLinks.length > 0 ? (
            <Text style={styles.contacts}>{contactLinks.join('  ·  ')}</Text>
          ) : null}
          <View style={styles.divider} />
        </View>

        {draft.basics.summary ? (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.body}>{draft.basics.summary}</Text>
          </View>
        ) : null}

        {allSkills.length > 0 ? (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.body}>{allSkills.join('  ·  ')}</Text>
          </View>
        ) : null}

        {draft.experience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {draft.experience.map((item, index) => (
              <View key={`exp-${index}`} style={styles.entry} wrap={false}>
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
        ) : null}

        {draft.projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {draft.projects.map((project, index) => (
              <View key={`prj-${index}`} style={styles.entry} wrap={false}>
                <Text style={styles.itemTitle}>{project.title}</Text>
                <Text style={styles.body}>{project.description}</Text>
                {project.technologies.length > 0 ? (
                  <Text style={styles.meta}>
                    {project.technologies.filter(Boolean).join(', ')}
                  </Text>
                ) : null}
                {project.link ? <Text style={styles.link}>{project.link}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {draft.education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {draft.education.map((item, index) => (
              <Text key={`edu-${index}`} style={styles.body}>
                {item.degree}, {item.institution} · {item.year}
              </Text>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
