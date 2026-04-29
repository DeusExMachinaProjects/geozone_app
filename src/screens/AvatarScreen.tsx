import React, {useMemo, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../navigation/types';
import {
  AvatarPreview,
  DEFAULT_AVATAR_CONFIG,
} from '../features/avatar/components/AvatarPreview';
import {
  accessoryOptions,
  bodyOptions,
  bottomOptions,
  hairOptions,
  shoesOptions,
  topOptions,
} from '../features/avatar/data/avatarOptions';
import type {
  AvatarAccessoryStyle,
  AvatarBodyType,
  AvatarBottomStyle,
  AvatarConfig,
  AvatarDirection,
  AvatarHairStyle,
  AvatarShoesStyle,
  AvatarTopStyle,
} from '../features/avatar/types';

type AvatarScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Avatar'
>;

type TabKey = 'hair' | 'face' | 'top' | 'bottom' | 'shoes' | 'accessory';

type PreviewPatchKey =
  | 'hairStyle'
  | 'topStyle'
  | 'bottomStyle'
  | 'shoesStyle'
  | 'accessoryStyle';

type OptionPreviewMode = 'hair' | 'top' | 'bottom' | 'shoes' | 'accessory';

const directions: AvatarDirection[] = ['front', 'right', 'back', 'left'];

export default function AvatarScreen() {
  const navigation = useNavigation<AvatarScreenNavigationProp>();

  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  const [directionIndex, setDirectionIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabKey>('hair');

  const direction = directions[directionIndex] ?? 'front';
  const avatarSize = zoomed ? 250 : 210;

  const currentBodyLabel = useMemo(() => {
    return bodyOptions.find(item => item.id === config.bodyType)?.label ?? '';
  }, [config.bodyType]);

  function rotateAvatar() {
    setDirectionIndex(prev => (prev + 1) % directions.length);
  }

  function toggleZoom() {
    setZoomed(prev => !prev);
  }

  function updateBodyType(bodyType: AvatarBodyType) {
    setConfig(prev => ({
      ...prev,
      bodyType,
    }));
  }

  function updateHairStyle(hairStyle: AvatarHairStyle) {
    setConfig(prev => ({
      ...prev,
      hairStyle,
    }));
  }

  function updateTopStyle(topStyle: AvatarTopStyle) {
    setConfig(prev => ({
      ...prev,
      topStyle,
    }));
  }

  function updateBottomStyle(bottomStyle: AvatarBottomStyle) {
    setConfig(prev => ({
      ...prev,
      bottomStyle,
    }));
  }

  function updateShoesStyle(shoesStyle: AvatarShoesStyle) {
    setConfig(prev => ({
      ...prev,
      shoesStyle,
    }));
  }

  function updateAccessoryStyle(accessoryStyle: AvatarAccessoryStyle) {
    setConfig(prev => ({
      ...prev,
      accessoryStyle,
    }));
  }

  function renderTabButton(tab: TabKey, label: string, icon: string) {
    const active = selectedTab === tab;

    return (
      <Pressable
        key={tab}
        onPress={() => setSelectedTab(tab)}
        style={[styles.tabButton, active && styles.tabButtonActive]}>
        <Text style={[styles.tabIcon, active && styles.activeText]}>
          {icon}
        </Text>
        <Text style={[styles.tabLabel, active && styles.activeText]}>
          {label}
        </Text>
      </Pressable>
    );
  }

  function renderBodySelector() {
    return (
      <View style={styles.bodySelector}>
        <View>
          <Text style={styles.sectionEyebrow}>BASE</Text>
          <Text style={styles.bodyTitle}>Tipo de cuerpo</Text>
        </View>

        <View style={styles.bodyButtons}>
          {bodyOptions.map(item => {
            const active = config.bodyType === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => updateBodyType(item.id)}
                style={[styles.bodyButton, active && styles.bodyButtonActive]}>
                <Text
                  style={[styles.bodyButtonText, active && styles.activeText]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  function renderHairOptions() {
    return (
      <OptionGrid
        title="Estilo de cabello"
        items={hairOptions}
        selectedId={config.hairStyle}
        config={config}
        previewPatchKey="hairStyle"
        previewMode="hair"
        onSelect={value => updateHairStyle(value as AvatarHairStyle)}
      />
    );
  }

  function renderTopOptions() {
    return (
      <OptionGrid
        title="Ropa superior"
        items={topOptions}
        selectedId={config.topStyle}
        config={config}
        previewPatchKey="topStyle"
        previewMode="top"
        onSelect={value => updateTopStyle(value as AvatarTopStyle)}
      />
    );
  }

  function renderBottomOptions() {
    return (
      <OptionGrid
        title="Ropa inferior"
        items={bottomOptions}
        selectedId={config.bottomStyle}
        config={config}
        previewPatchKey="bottomStyle"
        previewMode="bottom"
        onSelect={value => updateBottomStyle(value as AvatarBottomStyle)}
      />
    );
  }

  function renderShoesOptions() {
    return (
      <OptionGrid
        title="Calzado"
        items={shoesOptions}
        selectedId={config.shoesStyle}
        config={config}
        previewPatchKey="shoesStyle"
        previewMode="shoes"
        onSelect={value => updateShoesStyle(value as AvatarShoesStyle)}
      />
    );
  }

  function renderAccessoryOptions() {
    return (
      <OptionGrid
        title="Accesorios"
        items={accessoryOptions}
        selectedId={config.accessoryStyle}
        config={config}
        previewPatchKey="accessoryStyle"
        previewMode="accessory"
        onSelect={value => updateAccessoryStyle(value as AvatarAccessoryStyle)}
      />
    );
  }

  function renderFacePanel() {
    return (
      <View style={styles.panelContent}>
        <Text style={styles.panelTitle}>Rostro</Text>
        <Text style={styles.panelDescription}>
          Por ahora el rostro viene integrado en la base del cuerpo. El siguiente
          paso será separar ojos, cejas y boca como capas independientes.
        </Text>
      </View>
    );
  }

  function renderSelectedPanel() {
    switch (selectedTab) {
      case 'hair':
        return renderHairOptions();
      case 'face':
        return renderFacePanel();
      case 'top':
        return renderTopOptions();
      case 'bottom':
        return renderBottomOptions();
      case 'shoes':
        return renderShoesOptions();
      case 'accessory':
        return renderAccessoryOptions();
      default:
        return renderHairOptions();
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.headerButton}>
            <Text style={styles.headerButtonText}>‹</Text>
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.title}>Crea tu avatar</Text>
            <Text style={styles.subtitle}>
              Personaliza tu estilo para conquistar GeoZone.
            </Text>
          </View>

          <Pressable style={[styles.headerButton, styles.saveButton]}>
            <Text style={styles.saveButtonText}>□</Text>
          </Pressable>
        </View>

        <View style={styles.previewCard}>
          <View style={styles.previewGlow} />

          <AvatarPreview
            config={config}
            direction={direction}
            size={avatarSize}
            previewMode="full"
          />

          <View style={styles.previewActions}>
            <Pressable onPress={rotateAvatar} style={styles.previewActionButton}>
              <Text style={styles.previewActionIcon}>↻</Text>
              <Text style={styles.previewActionLabel}>Girar</Text>
            </Pressable>

            <Pressable onPress={toggleZoom} style={styles.previewActionButton}>
              <Text style={styles.previewActionIcon}>{zoomed ? '−' : '+'}</Text>
              <Text style={styles.previewActionLabel}>
                {zoomed ? 'Alejar' : 'Acercar'}
              </Text>
            </Pressable>
          </View>
        </View>

        {renderBodySelector()}

        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}>
            {renderTabButton('hair', 'Cabello', '✦')}
            {renderTabButton('face', 'Rostro', '◉')}
            {renderTabButton('top', 'Superior', '▣')}
            {renderTabButton('bottom', 'Inferior', '▥')}
            {renderTabButton('shoes', 'Calzado', '◒')}
            {renderTabButton('accessory', 'Accesorios', '◇')}
          </ScrollView>
        </View>

        <View style={styles.panel}>{renderSelectedPanel()}</View>

        <View style={styles.summaryCard}>
          <Text style={styles.sectionEyebrow}>ACTUAL</Text>
          <Text style={styles.summaryText}>
            Base {currentBodyLabel} · Vista {direction}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type OptionGridProps<T extends string> = {
  title: string;
  items: Array<{
    id: T;
    label: string;
  }>;
  selectedId: T;
  config: AvatarConfig;
  previewPatchKey: PreviewPatchKey;
  previewMode: OptionPreviewMode;
  onSelect: (id: T) => void;
};

function OptionGrid<T extends string>({
  title,
  items,
  selectedId,
  config,
  previewPatchKey,
  previewMode,
  onSelect,
}: OptionGridProps<T>) {
  return (
    <View style={styles.panelContent}>
      <Text style={styles.panelTitle}>{title}</Text>

      <View style={styles.optionGrid}>
        {items.map(item => {
          const active = selectedId === item.id;

          const previewConfig = {
            ...config,
            [previewPatchKey]: item.id,
          } as AvatarConfig;

          return (
            <Pressable
              key={item.id}
              onPress={() => onSelect(item.id)}
              style={[styles.optionCard, active && styles.optionCardActive]}>
              <View style={styles.optionPreview}>
                <AvatarPreview
                  config={previewConfig}
                  direction="front"
                  size={86}
                  showShadow={false}
                  previewMode={previewMode}
                />
              </View>

              <Text
                numberOfLines={1}
                style={[styles.optionLabel, active && styles.activeText]}>
                {item.label}
              </Text>

              {active ? (
                <View style={styles.checkBadge}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#050505',
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 42,
  },

  header: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  headerButton: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 42,
    lineHeight: 42,
    marginTop: -4,
  },

  saveButton: {
    backgroundColor: 'rgba(255,79,79,0.14)',
    borderColor: 'rgba(255,79,79,0.45)',
  },

  saveButtonText: {
    color: '#FF6258',
    fontSize: 25,
    fontWeight: '900',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.62)',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },

  previewCard: {
    height: 290,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,79,79,0.55)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  previewGlow: {
    position: 'absolute',
    bottom: -82,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,75,68,0.28)',
  },

  previewActions: {
    position: 'absolute',
    right: 16,
    top: 64,
    gap: 14,
  },

  previewActionButton: {
    width: 74,
    minHeight: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },

  previewActionIcon: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
  },

  previewActionLabel: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.76)',
    fontSize: 12,
    fontWeight: '800',
  },

  bodySelector: {
    marginTop: 16,
    borderRadius: 24,
    padding: 16,
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.075)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  sectionEyebrow: {
    color: '#FF5A52',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },

  bodyTitle: {
    marginTop: 5,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  bodyButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  bodyButton: {
    minWidth: 110,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  bodyButtonActive: {
    backgroundColor: 'rgba(255,80,72,0.28)',
    borderColor: '#FF5A52',
  },

  bodyButtonText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    fontWeight: '900',
  },

  tabsContainer: {
    marginTop: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },

  tabsContent: {
    padding: 10,
    gap: 10,
  },

  tabButton: {
    width: 96,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  tabButtonActive: {
    backgroundColor: 'rgba(255,79,79,0.20)',
    borderColor: '#FF5A52',
  },

  tabIcon: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 24,
    fontWeight: '900',
  },

  tabLabel: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.62)',
    fontSize: 12,
    fontWeight: '900',
  },

  activeText: {
    color: '#FFFFFF',
  },

  panel: {
    marginTop: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  panelContent: {
    padding: 16,
  },

  panelTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 14,
  },

  panelDescription: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    lineHeight: 20,
  },

  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  optionCard: {
    width: '30.5%',
    minWidth: 96,
    height: 138,
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    position: 'relative',
  },

  optionCardActive: {
    borderColor: '#FF5A52',
    backgroundColor: 'rgba(255,79,79,0.16)',
  },

  optionPreview: {
    width: 86,
    height: 86,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  optionLabel: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },

  checkBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5A52',
    borderWidth: 2,
    borderColor: '#101010',
  },

  checkText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  summaryCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  summaryText: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    fontWeight: '700',
  },
});