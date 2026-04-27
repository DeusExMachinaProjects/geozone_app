import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {styles, palette} from '../theme/screens/AvatarScreen.styles';
import {AvatarSprite} from '../features/avatar/components/AvatarSprite';
import {
  AVATAR_OPTIONS,
  CATEGORY_LABELS,
  COLOR_PALETTES,
  DEFAULT_AVATAR,
} from '../features/avatar/data/avatarOptions';
import {loadAvatarConfig, saveAvatarConfig} from '../features/avatar/storage/avatarStorage';
import type {AvatarBodyType, AvatarCategory, AvatarConfig, AvatarFacing} from '../features/avatar/types';

const CATEGORY_ORDER: AvatarCategory[] = ['hair', 'face', 'top', 'bottom', 'shoes', 'accessories'];
const FACING_OPTIONS: {id: AvatarFacing; label: string}[] = [
  {id: 'front', label: 'Frente'},
  {id: 'right', label: 'Perfil'},
  {id: 'back', label: 'Espalda'},
  {id: 'left', label: 'Perfil 2'},
];

export function AvatarScreen() {
  const navigation = useNavigation();
  const [avatar, setAvatar] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [activeCategory, setActiveCategory] = useState<AvatarCategory>('hair');
  const [previewFacing, setPreviewFacing] = useState<AvatarFacing>('front');
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadAvatarConfig()
      .then(savedAvatar => {
        if (mounted) {
          setAvatar(savedAvatar);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const selectedValue = useMemo(() => getSelectedValue(avatar, activeCategory), [activeCategory, avatar]);
  const selectedColor = useMemo(() => getSelectedColor(avatar, activeCategory), [activeCategory, avatar]);

  const updateAvatar = (patch: Partial<AvatarConfig>) => {
    setAvatar(current => ({...current, ...patch}));
  };

  const selectOption = (category: AvatarCategory, id: string) => {
    if (category === 'hair') {
      updateAvatar({hairStyle: id});
      return;
    }

    if (category === 'face') {
      updateAvatar({skinTone: id});
      return;
    }

    if (category === 'top') {
      updateAvatar({topStyle: id});
      return;
    }

    if (category === 'bottom') {
      updateAvatar({bottomStyle: id});
      return;
    }

    if (category === 'shoes') {
      updateAvatar({shoeStyle: id});
      return;
    }

    updateAvatar({accessory: id});
  };

  const selectColor = (category: AvatarCategory, color: string) => {
    if (category === 'hair') {
      updateAvatar({hairColor: color});
      return;
    }

    if (category === 'face') {
      updateAvatar({skinTone: color});
      return;
    }

    if (category === 'top') {
      updateAvatar({topColor: color});
      return;
    }

    if (category === 'bottom') {
      updateAvatar({bottomColor: color});
      return;
    }

    if (category === 'shoes') {
      updateAvatar({shoeColor: color});
      return;
    }

    updateAvatar({accessoryColor: color});
  };

  const saveAvatar = async () => {
    try {
      await saveAvatarConfig(avatar);
      Alert.alert('Avatar guardado', 'Tu avatar de GeoZone quedó listo para usar.');
    } catch {
      Alert.alert('No se pudo guardar', 'Intenta nuevamente en unos segundos.');
    }
  };

  const rotatePreview = () => {
    const currentIndex = FACING_OPTIONS.findIndex(item => item.id === previewFacing);
    const next = FACING_OPTIONS[(currentIndex + 1) % FACING_OPTIONS.length];
    setPreviewFacing(next.id);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={palette.bg} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Text style={styles.iconButtonText}>‹</Text>
          </Pressable>

          <View style={styles.headerCopy}>
            <Text style={styles.title}>Crea tu avatar</Text>
            <Text style={styles.subtitle}>Personaliza tu estilo para conquistar GeoZone.</Text>
          </View>

          <Pressable style={styles.diceButton} onPress={() => setAvatar(randomAvatar())}>
            <Text style={styles.diceText}>▣</Text>
          </Pressable>
        </View>

        <View style={styles.previewCard}>
          <View style={styles.previewGlow} />
          <View style={styles.gridFloor} />
          <AvatarSprite config={avatar} facing={previewFacing} size={zoomed ? 205 : 168} />

          <View style={styles.previewActions}>
            <Pressable style={styles.previewActionButton} onPress={rotatePreview}>
              <Text style={styles.previewActionIcon}>↻</Text>
              <Text style={styles.previewActionText}>Girar</Text>
            </Pressable>
            <Pressable style={styles.previewActionButton} onPress={() => setZoomed(current => !current)}>
              <Text style={styles.previewActionIcon}>{zoomed ? '−' : '+'}</Text>
              <Text style={styles.previewActionText}>{zoomed ? 'Alejar' : 'Acercar'}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bodyTypeCard}>
          <View>
            <Text style={styles.sectionOverline}>Base</Text>
            <Text style={styles.sectionTitle}>Tipo de cuerpo</Text>
          </View>

          <View style={styles.bodyToggleGroup}>
            <BodyToggle
              label="Masculino"
              active={avatar.bodyType === 'masculine'}
              onPress={() => updateAvatar({bodyType: 'masculine'})}
            />
            <BodyToggle
              label="Femenino"
              active={avatar.bodyType === 'feminine'}
              onPress={() => updateAvatar({bodyType: 'feminine'})}
            />
          </View>
        </View>

        <View style={styles.editorCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryTabs}>
            {CATEGORY_ORDER.map(category => {
              const meta = CATEGORY_LABELS[category];
              const active = category === activeCategory;
              return (
                <Pressable
                  key={category}
                  style={[styles.categoryTab, active && styles.categoryTabActive]}
                  onPress={() => setActiveCategory(category)}>
                  <Text style={[styles.categoryIcon, active && styles.categoryIconActive]}>{meta.icon}</Text>
                  <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>{meta.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.editorSection}>
            <Text style={styles.editorTitle}>{getEditorTitle(activeCategory)}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionList}>
              {AVATAR_OPTIONS[activeCategory].map(option => {
                const active = selectedValue === option.id;
                const optionAvatar = buildPreviewAvatar(avatar, activeCategory, option.id);

                return (
                  <Pressable
                    key={option.id}
                    style={[styles.optionTile, active && styles.optionTileActive]}
                    onPress={() => selectOption(activeCategory, option.id)}>
                    <AvatarSprite config={optionAvatar} size={74} facing="front" />
                    <Text style={[styles.optionLabel, active && styles.optionLabelActive]} numberOfLines={1}>
                      {option.label}
                    </Text>
                    {active ? <Text style={styles.checkBadge}>✓</Text> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.editorSection}>
            <Text style={styles.editorTitle}>{getColorTitle(activeCategory)}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorList}>
              {COLOR_PALETTES[activeCategory].map(color => {
                const active = selectedColor.toLowerCase() === color.toLowerCase();
                return (
                  <Pressable
                    key={color}
                    style={[styles.colorButton, active && styles.colorButtonActive]}
                    onPress={() => selectColor(activeCategory, color)}>
                    <View style={[styles.colorSwatch, {backgroundColor: color}]} />
                    {active ? <Text style={styles.colorCheck}>✓</Text> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.editorSection}>
            <Text style={styles.editorTitle}>Vista previa para mapa</Text>
            <View style={styles.facingGrid}>
              {FACING_OPTIONS.map(item => {
                const active = item.id === previewFacing;
                return (
                  <Pressable
                    key={item.id}
                    style={[styles.facingTile, active && styles.facingTileActive]}
                    onPress={() => setPreviewFacing(item.id)}>
                    <AvatarSprite config={avatar} facing={item.id} size={82} />
                    <Text style={[styles.facingLabel, active && styles.facingLabelActive]}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <Pressable style={styles.saveButton} onPress={saveAvatar}>
          <Text style={styles.saveButtonText}>Guardar avatar ✦</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function BodyToggle({label, active, onPress}: {label: string; active: boolean; onPress: () => void}) {
  return (
    <Pressable style={[styles.bodyToggle, active && styles.bodyToggleActive]} onPress={onPress}>
      <Text style={[styles.bodyToggleText, active && styles.bodyToggleTextActive]}>{label}</Text>
    </Pressable>
  );
}

function getSelectedValue(avatar: AvatarConfig, category: AvatarCategory) {
  if (category === 'hair') {
    return avatar.hairStyle;
  }
  if (category === 'face') {
    return avatar.skinTone;
  }
  if (category === 'top') {
    return avatar.topStyle;
  }
  if (category === 'bottom') {
    return avatar.bottomStyle;
  }
  if (category === 'shoes') {
    return avatar.shoeStyle;
  }
  return avatar.accessory;
}

function getSelectedColor(avatar: AvatarConfig, category: AvatarCategory) {
  if (category === 'hair') {
    return avatar.hairColor;
  }
  if (category === 'face') {
    return avatar.skinTone;
  }
  if (category === 'top') {
    return avatar.topColor;
  }
  if (category === 'bottom') {
    return avatar.bottomColor;
  }
  if (category === 'shoes') {
    return avatar.shoeColor;
  }
  return avatar.accessoryColor;
}

function buildPreviewAvatar(avatar: AvatarConfig, category: AvatarCategory, id: string): AvatarConfig {
  if (category === 'hair') {
    return {...avatar, hairStyle: id};
  }
  if (category === 'face') {
    return {...avatar, skinTone: id};
  }
  if (category === 'top') {
    return {...avatar, topStyle: id};
  }
  if (category === 'bottom') {
    return {...avatar, bottomStyle: id};
  }
  if (category === 'shoes') {
    return {...avatar, shoeStyle: id};
  }
  return {...avatar, accessory: id};
}

function getEditorTitle(category: AvatarCategory) {
  if (category === 'hair') {
    return 'Estilo de cabello';
  }
  if (category === 'face') {
    return 'Tono de piel';
  }
  if (category === 'top') {
    return 'Ropa superior';
  }
  if (category === 'bottom') {
    return 'Ropa inferior';
  }
  if (category === 'shoes') {
    return 'Zapatillas';
  }
  return 'Accesorios';
}

function getColorTitle(category: AvatarCategory) {
  if (category === 'hair') {
    return 'Color de cabello';
  }
  if (category === 'face') {
    return 'Tono';
  }
  if (category === 'top') {
    return 'Color superior';
  }
  if (category === 'bottom') {
    return 'Color inferior';
  }
  if (category === 'shoes') {
    return 'Color de calzado';
  }
  return 'Color de accesorio';
}

function randomAvatar(): AvatarConfig {
  const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

  const bodyType: AvatarBodyType = Math.random() > 0.5 ? 'masculine' : 'feminine';

  return {
    bodyType,
    skinTone: pick(COLOR_PALETTES.face),
    hairStyle: pick(AVATAR_OPTIONS.hair).id,
    hairColor: pick(COLOR_PALETTES.hair),
    topStyle: pick(AVATAR_OPTIONS.top).id,
    topColor: pick(COLOR_PALETTES.top),
    bottomStyle: pick(AVATAR_OPTIONS.bottom).id,
    bottomColor: pick(COLOR_PALETTES.bottom),
    shoeStyle: pick(AVATAR_OPTIONS.shoes).id,
    shoeColor: pick(COLOR_PALETTES.shoes),
    accessory: pick(AVATAR_OPTIONS.accessories).id,
    accessoryColor: pick(COLOR_PALETTES.accessories),
  };
}

export default AvatarScreen;
