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
  sidebarText: { fontSize: 9, color: '#e0f2fe', lineHeight: 1.5 },
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
});

export function ModernSidebarPdf({ draft }: { draft: ResumeDraft }) {
  const allSkills = [
    ...draft.skills.frontend,
    ...draft.skills.backend,
    ...draft.skills.database,
    ...draft.skills.soft,
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <Text style={styles.name}>{draft.basics.fullName}</Text>
          <Text style={styles.title}>{draft.basics.professionalTitle}</Text>
          {draft.basics.email ? <Text style={styles.sidebarText}>{draft.basics.email}</Text> : null}
          {draft.basics.phone ? <Text style={styles.sidebarText}>{draft.basics.phone}</Text> : null}
          {draft.basics.location ? <Text style={styles.sidebarText}>{draft.basics.location}</Text> : null}
          {draft.basics.website ? <Text style={styles.sidebarText}>{draft.basics.website}</Text> : null}
          {draft.basics.github ? <Text style={styles.sidebarText}>{draft.basics.github}</Text> : null}
          {draft.basics.linkedin ? <Text style={styles.sidebarText}>{draft.basics.linkedin}</Text> : null}

          {allSkills.length > 0 ? (
            <>
              <Text style={styles.sidebarLabel}>Skills</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {allSkills.map((skill) => (
                  <Text key={skill} style={styles.chip}>
                    {skill}
                  </Text>
                ))}
              </View>
            </>
          ) : null}

          <Text style={styles.sidebarLabel}>Education</Text>
          {draft.education.map((item) => (
            <View key={`${item.institution}-${item.year}`} style={{ marginBottom: 6 }}>
              <Text style={[styles.sidebarText, { fontWeight: 'bold' }]}>{item.degree}</Text>
              <Text style={styles.sidebarText}>{item.institution}</Text>
              <Text style={styles.sidebarText}>{item.year}</Text>
            </View>
          ))}

          <Text style={styles.sidebarLabel}>Interests</Text>
          <Text style={styles.sidebarText}>
            {[...draft.extras.interests, ...draft.extras.hobbies].join(', ')}
          </Text>
        </View>

        <View style={styles.main}>
          <Text style={styles.sectionLabel}>Summary</Text>
          <Text style={styles.body}>{draft.basics.summary}</Text>

          <Text style={styles.sectionLabel}>Experience</Text>
          {draft.experience.map((item) => (
            <View key={`${item.company}-${item.role}`} style={{ marginBottom: 8 }}>
              <Text style={styles.itemTitle}>
                {item.role} · {item.company}
              </Text>
              <Text style={styles.meta}>
                {item.start} - {item.current ? 'Present' : item.end}
              </Text>
              <Text style={styles.body}>{item.summary}</Text>
            </View>
          ))}

          <Text style={styles.sectionLabel}>Projects</Text>
          {draft.projects.map((project) => (
            <View key={project.title} style={{ marginBottom: 8 }}>
              <Text style={styles.itemTitle}>{project.title}</Text>
              <Text style={styles.body}>{project.description}</Text>
              <Text style={styles.meta}>{project.technologies.join(', ')}</Text>
              <Text style={[styles.body, { color: '#64748b' }]}>{project.link}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
