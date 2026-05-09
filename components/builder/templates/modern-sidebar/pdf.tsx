import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { ResumeDraft } from '@/lib/types/resume';

const styles = StyleSheet.create({
  page: { fontSize: 10, fontFamily: 'Helvetica', flexDirection: 'row' },
  sidebar: { width: '36%', backgroundColor: '#164e63', padding: 24, color: '#ffffff' },
  main: { width: '64%', padding: 24, backgroundColor: '#ffffff', color: '#0f172a' },
  name: { fontSize: 22, fontWeight: 'bold' },
  title: { fontSize: 11, color: '#a5f3fc', marginTop: 2, marginBottom: 12 },
  sidebarLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: '#cffafe',
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 4,
  },
  sidebarText: {
    fontSize: 9,
    color: '#e0f2fe',
    lineHeight: 1.5,
    wordBreak: 'break-all',
  },
  chip: {
    fontSize: 9,
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#0f766e',
    textTransform: 'uppercase',
    marginBottom: 6,
    marginTop: 10,
  },
  body: { fontSize: 10, lineHeight: 1.5, color: '#1f2937' },
  itemTitle: { fontSize: 10, fontWeight: 'bold' },
  meta: { fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 },
  link: { fontSize: 9, color: '#64748b', wordBreak: 'break-all' },
  entry: { marginBottom: 8 },
});

function nonEmpty<T extends string>(values: (T | undefined | null)[]): T[] {
  return values.filter((v): v is T => Boolean(v && v.trim?.() !== ''));
}

export function ModernSidebarPdf({ draft }: { draft: ResumeDraft }) {
  const allSkills = nonEmpty([
    ...draft.skills.frontend,
    ...draft.skills.backend,
    ...draft.skills.database,
    ...draft.skills.soft,
  ]);
  const interests = nonEmpty([...draft.extras.interests, ...draft.extras.hobbies]);
  const sidebarContacts = nonEmpty([
    draft.basics.email,
    draft.basics.phone,
    draft.basics.location,
    draft.basics.website,
    draft.basics.github,
    draft.basics.linkedin,
  ]);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.sidebar}>
          <View wrap={false}>
            <Text style={styles.name}>{draft.basics.fullName || 'Untitled resume'}</Text>
            <Text style={styles.title}>{draft.basics.professionalTitle}</Text>
            {sidebarContacts.map((line, index) => (
              <Text key={`contact-${index}`} style={styles.sidebarText}>
                {line}
              </Text>
            ))}
          </View>

          {allSkills.length > 0 ? (
            <View wrap={false}>
              <Text style={styles.sidebarLabel}>Skills</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {allSkills.map((skill, index) => (
                  <Text key={`skill-${index}`} style={styles.chip}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          ) : null}

          {draft.education.length > 0 ? (
            <View>
              <Text style={styles.sidebarLabel}>Education</Text>
              {draft.education.map((item, index) => (
                <View key={`edu-${index}`} style={{ marginBottom: 6 }} wrap={false}>
                  <Text style={[styles.sidebarText, { fontWeight: 'bold' }]}>
                    {item.degree}
                  </Text>
                  <Text style={styles.sidebarText}>{item.institution}</Text>
                  <Text style={styles.sidebarText}>{item.year}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {interests.length > 0 ? (
            <View wrap={false}>
              <Text style={styles.sidebarLabel}>Interests</Text>
              <Text style={styles.sidebarText}>{interests.join(', ')}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.main}>
          {draft.basics.summary ? (
            <View wrap={false}>
              <Text style={styles.sectionLabel}>Summary</Text>
              <Text style={styles.body}>{draft.basics.summary}</Text>
            </View>
          ) : null}

          {draft.experience.length > 0 ? (
            <View>
              <Text style={styles.sectionLabel}>Experience</Text>
              {draft.experience.map((item, index) => (
                <View key={`exp-${index}`} style={styles.entry} wrap={false}>
                  <Text style={styles.itemTitle}>
                    {item.role} · {item.company}
                  </Text>
                  <Text style={styles.meta}>
                    {item.start} - {item.current ? 'Present' : item.end}
                  </Text>
                  <Text style={styles.body}>{item.summary}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {draft.projects.length > 0 ? (
            <View>
              <Text style={styles.sectionLabel}>Projects</Text>
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
        </View>
      </Page>
    </Document>
  );
}
