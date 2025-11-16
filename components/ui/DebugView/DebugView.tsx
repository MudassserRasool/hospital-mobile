import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface DebugViewProps {
  data?: any;
  title?: string;
  expanded?: boolean;
}

const DebugView: React.FC<DebugViewProps> = ({
  data = {},
  title = 'Debug Panel',
  expanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );

  const toggleSection = (path: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const formatValue = (val: any): string => {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (typeof val === 'string') return `"${val}"`;
    if (typeof val === 'function') return '[Function]';
    if (val instanceof Date) return val.toISOString();
    return String(val);
  };

  const getValueColor = (val: any): string => {
    if (val === null || val === undefined) return '#999';
    if (typeof val === 'boolean') return '#569CD6';
    if (typeof val === 'number') return '#B5CEA8';
    if (typeof val === 'string') return '#CE9178';
    return '#D4D4D4';
  };

  const renderValue = (
    value: any,
    key: string,
    depth: number = 0,
    path: string = ''
  ) => {
    const currentPath = path ? `${path}.${key}` : key;
    const indent = depth * 16;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const isCollapsed = collapsedSections.has(currentPath);
      const entries = Object.entries(value);

      return (
        <View key={currentPath} style={{ marginLeft: indent }}>
          <TouchableOpacity
            onPress={() => toggleSection(currentPath)}
            style={styles.objectHeader}
          >
            <ThemedText style={styles.expandIcon}>
              {isCollapsed ? '▶' : '▼'}
            </ThemedText>
            <ThemedText style={styles.key}>{key}:</ThemedText>
            <ThemedText style={styles.objectBrace}>
              {`{ ${entries.length} ${entries.length === 1 ? 'key' : 'keys'} }`}
            </ThemedText>
          </TouchableOpacity>

          {!isCollapsed && (
            <View style={styles.objectContent}>
              {entries.map(([k, v]) =>
                renderValue(v, k, depth + 1, currentPath)
              )}
            </View>
          )}
        </View>
      );
    }

    if (Array.isArray(value)) {
      const isCollapsed = collapsedSections.has(currentPath);

      return (
        <View key={currentPath} style={{ marginLeft: indent }}>
          <TouchableOpacity
            onPress={() => toggleSection(currentPath)}
            style={styles.objectHeader}
          >
            <ThemedText style={styles.expandIcon}>
              {isCollapsed ? '▶' : '▼'}
            </ThemedText>
            <ThemedText style={styles.key}>{key}:</ThemedText>
            <ThemedText style={styles.arrayBracket}>
              {`[ ${value.length} ${value.length === 1 ? 'item' : 'items'} ]`}
            </ThemedText>
          </TouchableOpacity>

          {!isCollapsed && (
            <View style={styles.objectContent}>
              {value.map((v, i) =>
                renderValue(v, `[${i}]`, depth + 1, currentPath)
              )}
            </View>
          )}
        </View>
      );
    }

    return (
      <View key={currentPath} style={[styles.row, { marginLeft: indent }]}>
        <ThemedText style={styles.key}>{key}:</ThemedText>
        <ThemedText style={[styles.value, { color: getValueColor(value) }]}>
          {formatValue(value)}
        </ThemedText>
      </View>
    );
  };

  // Auto-log to console
  React.useEffect(() => {
    console.log(`[${title}]`, data);
  }, [data, title]);

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.header}
      >
        <ThemedText style={styles.expandIcon}>
          {isExpanded ? '▼' : '▶'}
        </ThemedText>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.badge}>
          {typeof data === 'object' ? Object.keys(data).length : '1'}
        </ThemedText>
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView style={styles.content}>
          {typeof data === 'object' && data !== null ? (
            Object.entries(data).map(([key, value]) => renderValue(value, key))
          ) : (
            <View style={styles.row}>
              <ThemedText
                style={[styles.value, { color: getValueColor(data) }]}
              >
                {formatValue(data)}
              </ThemedText>
            </View>
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
};

export default DebugView;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    margin: 8,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#252526',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4D4D4',
    flex: 1,
    marginLeft: 8,
  },
  badge: {
    backgroundColor: '#007ACC',
    color: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
    maxHeight: 400,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  key: {
    color: '#9CDCFE',
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'monospace',
  },
  value: {
    flex: 1,
    fontFamily: 'monospace',
  },
  objectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  objectContent: {
    marginLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#333',
    paddingLeft: 8,
  },
  objectBrace: {
    color: '#808080',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  arrayBracket: {
    color: '#808080',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  expandIcon: {
    color: '#808080',
    marginRight: 4,
    fontSize: 12,
  },
});

/*
<DebugView 
  data={{ 
    user: { name: 'John', age: 30 },
    items: [1, 2, 3],
    active: true 
  }} 
  title="User Data"
/>
*/
