import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

// SF Symbol names used in the app
export type SFSymbolName = 
  | 'bag.fill'
  | 'map.fill'
  | 'list.bullet'
  | 'person.circle.fill'
  | 'leaf.fill'
  | 'cross.fill'
  | 'cup.and.saucer.fill'
  | 'scissors'
  | 'mappin'
  | 'square.grid.3x3'
  | 'pawprint.fill'
  | 'star.fill'
  | 'xmark'
  | 'location.fill'
  | 'phone.fill'
  | 'cart.fill'
  | 'heart.fill'
  | 'message.fill'
  | 'chevron.left'
  | 'gearshape'
  | 'camera.fill'
  | 'square.and.arrow.up'
  | 'grid'
  | 'heart'
  | 'chevron.right'
  | 'textformat'
  | 'bookmark'
  | 'message';

type IconMapping = Record<SFSymbolName, MaterialIconName>;

/**
 * SF Symbols to Material Icons mapping
 * This ensures consistent icon usage across platforms
 */
const MAPPING: IconMapping = {
  'bag.fill': 'shopping-bag',
  'map.fill': 'map',
  'list.bullet': 'list',
  'person.circle.fill': 'account-circle',
  'leaf.fill': 'eco',
  'cross.fill': 'close',
  'cup.and.saucer.fill': 'local-cafe',
  'scissors': 'content-cut',
  'mappin': 'place',
  'square.grid.3x3': 'grid-view',
  'pawprint.fill': 'pets',
  'star.fill': 'star',
  'xmark': 'close',
  'location.fill': 'place',
  'phone.fill': 'phone',
  'cart.fill': 'shopping-cart',
  'heart.fill': 'favorite',
  'message.fill': 'message',
  'chevron.left': 'chevron-left',
  'gearshape': 'settings',
  'camera.fill': 'camera-alt',
  'square.and.arrow.up': 'share',
  'grid': 'grid-view',
  'heart': 'favorite-border',
  'chevron.right': 'chevron-right',
  'textformat': 'text-format',
  'bookmark': 'bookmark',
  'message': 'message',
} as const;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: SFSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
