import { z } from 'zod';

export const BRANDS = [
  'espublico',
  'gestiona',
  'esfirma',
  'hacienda-local',
  'rrhh',
  'videoactas',
  'tecnologia',
  'sistemas',
  'drag',
  'ecityclic',
  'medidata',
] as const;

export const BrandSchema = z.enum(BRANDS);
export type Brand = z.infer<typeof BrandSchema>;

export const SLIDE_TYPES = [
  'title',
  'section',
  'tiled',
  'two-column',
  'feature-cards',
  'bullet-list',
  'step-cards',
  'table',
  'bar-chart',
  'closing',
] as const;

export type SlideType = typeof SLIDE_TYPES[number];

// Base slide properties
const BaseSlideSchema = z.object({
  type: z.enum(SLIDE_TYPES),
  brandOverride: BrandSchema.optional(),
  notes: z.string().optional(),
});

// Title slide
export const TitleSlideSchema = BaseSlideSchema.extend({
  type: z.literal('title'),
  h1: z.string().min(1, 'h1 required'),
  highlight: z.string().optional(),
  subtitle: z.string().optional(),
});

// Section divider
export const SectionSlideSchema = BaseSlideSchema.extend({
  type: z.literal('section'),
  h2: z.string().min(1, 'h2 required'),
  subtitle: z.string().optional(),
  dark: z.boolean().optional().default(false),
});

// Tiled content
export const TileSchema = z.object({
  icon: z.string().min(1, 'icon required'),
  title: z.string().min(1, 'title required'),
  text: z.string().min(1, 'text required'),
  gold: z.boolean().optional(),
});

export const TiledSlideSchema = BaseSlideSchema.extend({
  type: z.literal('tiled'),
  title: z.string().min(1, 'title required'),
  tiles: z.array(TileSchema).min(1, 'at least 1 tile').max(4, 'max 4 tiles'),
  variant: z.enum(['2x2', '3-col']).optional().default('2x2'),
});

// Block (for two-column)
export const BlockSchema = z.object({
  type: z.enum(['bullets', 'html', 'text']),
  content: z.string().min(1),
});

// Two column
export const TwoColumnSlideSchema = BaseSlideSchema.extend({
  type: z.literal('two-column'),
  title: z.string().min(1, 'title required'),
  left: BlockSchema,
  right: BlockSchema,
});

// Feature cards
export const FeatureCardSchema = z.object({
  icon: z.string().min(1, 'icon required'),
  title: z.string().min(1, 'title required'),
  text: z.string().min(1, 'text required'),
});

export const FeatureCardsSlideSchema = BaseSlideSchema.extend({
  type: z.literal('feature-cards'),
  title: z.string().min(1, 'title required'),
  cards: z.array(FeatureCardSchema).min(1, 'at least 1 card').max(6),
});

// Bullet list
export const BulletSchema = z.object({
  icon: z.string().min(1, 'icon required'),
  text: z.string().min(1, 'text required'),
});

export const BulletListSlideSchema = BaseSlideSchema.extend({
  type: z.literal('bullet-list'),
  title: z.string().min(1, 'title required'),
  bullets: z.array(BulletSchema).min(1, 'at least 1 bullet').max(5),
  progressive: z.boolean().optional().default(false),
  gold: z.boolean().optional(),
});

// Step cards
export const StepSchema = z.object({
  title: z.string().min(1, 'title required'),
  text: z.string().min(1, 'text required'),
});

export const StepCardsSlideSchema = BaseSlideSchema.extend({
  type: z.literal('step-cards'),
  title: z.string().min(1, 'title required'),
  steps: z.array(StepSchema).min(1, 'at least 1 step').max(5),
  gold: z.boolean().optional(),
});

// Table
export const TableSlideSchema = BaseSlideSchema.extend({
  type: z.literal('table'),
  title: z.string().min(1, 'title required'),
  headers: z.array(z.string().min(1)).min(1, 'at least 1 header'),
  rows: z.array(z.array(z.string())).min(1, 'at least 1 row'),
});

// Bar chart
export const BarSchema = z.object({
  label: z.string().min(1, 'label required'),
  value: z.number().min(0).max(100),
  tone: z.enum(['low', 'mid', 'high']).optional().default('mid'),
});

export const BarChartSlideSchema = BaseSlideSchema.extend({
  type: z.literal('bar-chart'),
  title: z.string().min(1, 'title required'),
  bars: z.array(BarSchema).min(1, 'at least 1 bar').max(8),
});

// Closing slide
export const ClosingSlideSchema = BaseSlideSchema.extend({
  type: z.literal('closing'),
  h2: z.string().min(1, 'h2 required'),
  subtitle: z.string().optional(),
});

// Discriminated union of all slides
export const SlideSchema = z.discriminatedUnion('type', [
  TitleSlideSchema,
  SectionSlideSchema,
  TiledSlideSchema,
  TwoColumnSlideSchema,
  FeatureCardsSlideSchema,
  BulletListSlideSchema,
  StepCardsSlideSchema,
  TableSlideSchema,
  BarChartSlideSchema,
  ClosingSlideSchema,
]);

export type Slide = z.infer<typeof SlideSchema>;

// Image asset
export const ImageAssetSchema = z.object({
  id: z.string(),
  filename: z.string().min(1),
  dataUrl: z.string(), // base64 data URL
});

export type ImageAsset = z.infer<typeof ImageAssetSchema>;

// Deck
export const DeckSchema = z.object({
  name: z.string().regex(/^[a-z0-9-]+$/, 'kebab-case only').min(3).max(50),
  title: z.string().min(1, 'title required').max(200),
  brand: BrandSchema,
  slides: z.array(SlideSchema).min(1, 'at least 1 slide').max(100),
  images: z.array(ImageAssetSchema).optional().default([]),
});

export type Deck = z.infer<typeof DeckSchema>;

// Chat action types for Ollama structured output
export const UpdateSlideActionSchema = z.object({
  type: z.literal('update_slide'),
  index: z.number().int().min(0),
  patch: SlideSchema.partial(),
});

export const AddSlideActionSchema = z.object({
  type: z.literal('add_slide'),
  index: z.number().int().min(0),
  slide: SlideSchema,
});

export const DeleteSlideActionSchema = z.object({
  type: z.literal('delete_slide'),
  index: z.number().int().min(0),
});

export const MoveSlideActionSchema = z.object({
  type: z.literal('move_slide'),
  from: z.number().int().min(0),
  to: z.number().int().min(0),
});

export const ChangeBrandActionSchema = z.object({
  type: z.literal('change_brand'),
  brand: BrandSchema,
});

export const RenameDeckActionSchema = z.object({
  type: z.literal('rename_deck'),
  name: z.string().regex(/^[a-z0-9-]+$/).optional(),
  title: z.string().optional(),
});

export const ActionSchema = z.discriminatedUnion('type', [
  UpdateSlideActionSchema,
  AddSlideActionSchema,
  DeleteSlideActionSchema,
  MoveSlideActionSchema,
  ChangeBrandActionSchema,
  RenameDeckActionSchema,
]);

export type Action = z.infer<typeof ActionSchema>;

// Ollama response
export const OllamaResponseSchema = z.object({
  actions: z.array(ActionSchema),
  reasoning: z.string().optional(),
});

export type OllamaResponse = z.infer<typeof OllamaResponseSchema>;

// Validation helpers
export function validateDeck(data: unknown): Deck {
  return DeckSchema.parse(data);
}

export function validateSlide(data: unknown): Slide {
  return SlideSchema.parse(data);
}

export function validateAction(data: unknown): Action {
  return ActionSchema.parse(data);
}
