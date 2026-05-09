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
  link: { color: '#475569', wordBreak: 'break-all' },
  entry: { marginBottom: 8 },
  entryWide: { marginBottom: 10 },
});

function nonEmpty<T extends string>(values: (T | undefined | null)[]): T[] {
  return values.filter((v): v is T => Boolean(v && v.trim?.() !== ''));
}

export function ClassicTealPdf({ draft }: { draft: ResumeDraft }) {
  const allSkills = nonEmpty([
    ...draft.skills.frontend,
    ...draft.skills.backend,
    ...draft.skills.database,
    ...draft.skills.soft,
  ]);
  const interests = nonEmpty([...draft.extras.interests, ...draft.extras.hobbies]);
  const contactPrimary = nonEmpty([
    draft.basics.email,
    draft.basics.phone,
    draft.basics.location,
  ]);
  const contactLinks = nonEmpty([
    draft.basics.github,
    draft.basics.linkedin,
    draft.basics.website,
  ]);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View wrap={false}>
          <Text style={styles.title}>{draft.basics.fullName || 'Untitled resume'}</Text>
          <Text style={styles.subtitle}>{draft.basics.professionalTitle}</Text>
          {contactPrimary.length > 0 ? (
            <Text style={[styles.line, styles.muted]}>
              {contactPrimary.join(' • ')}
            </Text>
          ) : null}
          {contactLinks.length > 0 ? (
            <Text style={[styles.line, styles.link]}>{contactLinks.join(' • ')}</Text>
          ) : null}
        </View>

        {draft.basics.summary ? (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text>{draft.basics.summary}</Text>
          </View>
        ) : null}

        <View style={styles.row}>
          <View style={styles.left}>
            {allSkills.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                {allSkills.map((skill, index) => (
                  <Text key={`skill-${index}`} style={styles.chip}>
                    • {skill}
                  </Text>
                ))}
              </View>
            ) : null}

            {draft.education.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {draft.education.map((item, index) => (
                  <View key={`edu-${index}`} style={styles.entry} wrap={false}>
                    <Text style={styles.itemTitle}>{item.degree}</Text>
                    <Text>{item.institution}</Text>
                    <Text style={styles.muted}>{item.year}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {interests.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interests</Text>
                {interests.map((item, index) => (
                  <Text key={`interest-${index}`} style={styles.chip}>
                    • {item}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>

          <View style={styles.right}>
            {draft.experience.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {draft.experience.map((item, index) => (
                  <View key={`exp-${index}`} style={styles.entryWide} wrap={false}>
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
            ) : null}

            {draft.projects.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {draft.projects.map((project, index) => (
                  <View key={`prj-${index}`} style={styles.entryWide} wrap={false}>
                    <Text style={styles.itemTitle}>{project.title}</Text>
                    <Text>{project.description}</Text>
                    {project.technologies.length > 0 ? (
                      <Text style={styles.muted}>
                        {project.technologies.filter(Boolean).join(', ')}
                      </Text>
                    ) : null}
                    {project.link ? <Text style={styles.link}>{project.link}</Text> : null}
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      </Page>
    </Document>
  );
}
