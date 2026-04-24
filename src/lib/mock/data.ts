import type {
  Card,
  Connection,
  Invite,
  Notification,
  Resonance,
  User,
} from '../db/types';

/**
 * Canonical mock dataset shared by all Mock repositories.
 * These are loaded once at module time and mutated in place by mock writes.
 */

const now = new Date('2026-04-24T09:00:00.000Z');
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000);

export const CURRENT_USER_ID = 'u-me';

export const USERS: User[] = [
  {
    id: 'u-me',
    handle: 'Yo',
    bio: '想把每一個日子都寫成一張卡片。',
    region: 'TW',
    primaryLocale: 'zh-TW',
    autoTranslateTo: ['en'],
    verified: true,
    phoneHash: 'x',
    avatarSeed: '77',
    initials: 'YO',
    accentColor: 'oklch(88% 0.08 55)',
    joinedAt: daysAgo(180),
    handleChangedAt: daysAgo(180),
  },
  {
    id: 'u-alex',
    handle: 'alex',
    bio: 'City kid. Notes on identity & growing up.',
    region: 'US',
    primaryLocale: 'en',
    autoTranslateTo: ['zh-TW'],
    verified: true,
    phoneHash: 'x',
    avatarSeed: '13',
    initials: 'AC',
    accentColor: 'oklch(90% 0.065 55)',
    joinedAt: daysAgo(420),
    handleChangedAt: daysAgo(120),
  },
  {
    id: 'u-mara',
    handle: 'mara',
    bio: 'Letters I couldn’t send. Softness practiced aloud.',
    region: 'BR',
    primaryLocale: 'en',
    autoTranslateTo: ['zh-TW'],
    verified: true,
    phoneHash: 'x',
    avatarSeed: '29',
    initials: 'MS',
    accentColor: 'oklch(94% 0.032 290)',
    joinedAt: daysAgo(260),
    handleChangedAt: daysAgo(260),
  },
  {
    id: 'u-jin',
    handle: 'jin',
    bio: 'Three failed startups. Still curious.',
    region: 'KR',
    primaryLocale: 'ko',
    autoTranslateTo: ['en', 'zh-TW'],
    verified: true,
    phoneHash: 'x',
    avatarSeed: '41',
    initials: 'JP',
    accentColor: 'oklch(93% 0.042 140)',
    joinedAt: daysAgo(310),
    handleChangedAt: daysAgo(310),
  },
  {
    id: 'u-amara',
    handle: 'amara',
    bio: 'Grandmother’s hands live in mine.',
    region: 'GH',
    primaryLocale: 'en',
    autoTranslateTo: [],
    verified: true,
    phoneHash: 'x',
    avatarSeed: '53',
    initials: 'AO',
    accentColor: 'oklch(92% 0.075 88)',
    joinedAt: daysAgo(540),
    handleChangedAt: daysAgo(60),
  },
  {
    id: 'u-yuki',
    handle: 'yuki',
    bio: 'Grief keeps its own time.',
    region: 'JP',
    primaryLocale: 'ja',
    autoTranslateTo: ['en'],
    verified: true,
    phoneHash: 'x',
    avatarSeed: '67',
    initials: 'YT',
    accentColor: 'oklch(92% 0.033 215)',
    joinedAt: daysAgo(800),
    handleChangedAt: daysAgo(200),
  },
  {
    id: 'u-lea',
    handle: 'lea',
    bio: 'Night trains, strangers, small epiphanies.',
    region: 'FR',
    primaryLocale: 'en',
    autoTranslateTo: ['zh-TW'],
    verified: false,
    phoneHash: 'x',
    avatarSeed: '83',
    initials: 'LM',
    accentColor: 'oklch(89% 0.047 18)',
    joinedAt: daysAgo(90),
    handleChangedAt: daysAgo(90),
  },
];

function card(
  partial: Omit<Card, 'translations' | 'readCount' | 'resonanceCount' | 'inviteCount'> & {
    translations?: Card['translations'];
    readCount?: number;
    resonanceCount?: number;
    inviteCount?: number;
  }
): Card {
  return {
    translations: {},
    readCount: 0,
    resonanceCount: 0,
    inviteCount: 0,
    ...partial,
  };
}

export const CARDS: Card[] = [
  card({
    id: 'c-alex-1',
    authorId: 'u-alex',
    thoughtCore: '離開家鄉不是為了逃離誰,而是為了遇見自己。',
    story:
      '我十八歲那年坐上了去紐約的夜班巴士。座位後面的男生全程戴著耳機,我盯著窗外的燈影,想著阿嬤的菜籃。\n\n到了那個誰也不認識我的城市,我才第一次聽清楚自己的名字。它不再是別人口中被呼喚的責任,而是一個我需要慢慢認領的身分。',
    tags: ['Identity', '離家', '成長'],
    media: { type: 'image', url: '', label: 'leaving home · portrait' },
    originalLocale: 'en',
    translations: {
      en: {
        title: 'I left my hometown at 18',
        thoughtCore: 'Leaving home isn’t running from someone — it’s meeting yourself.',
        story: 'I took the overnight bus to New York at 18…',
        aiGenerated: true,
      },
    },
    visibility: 'public',
    publishedAt: daysAgo(2),
    readCount: 482,
    resonanceCount: 37,
    inviteCount: 5,
    accentHue: 55,
  }),
  card({
    id: 'c-mara-1',
    authorId: 'u-mara',
    thoughtCore: '有些話,寫下來,是為了自己先聽見。',
    story:
      '父親走了六年以後,我才終於把那封信寫完。開頭我寫「爸」,寫了又劃掉,劃掉又寫。\n\n那天深夜我把信念給自己聽,念到一半哭得說不下去。但奇怪的是,念完以後我睡了六年以來最深的一覺。',
    tags: ['Family', '和解', '書寫'],
    originalLocale: 'zh-TW',
    translations: {},
    visibility: 'public',
    publishedAt: daysAgo(3),
    readCount: 1032,
    resonanceCount: 84,
    inviteCount: 12,
    accentHue: 290,
  }),
  card({
    id: 'c-jin-1',
    authorId: 'u-jin',
    thoughtCore: '失敗不是終點,而是讓你認得出真心的地方。',
    story:
      '第三次收掉公司那天,我沒有哭。我走去巷口那家開了二十年的麵店,老闆看到我笑了一下,沒問什麼。\n\n那碗麵救了我。不是因為它多好吃,而是因為有個人記得我,即使我連自己都忘了。',
    tags: ['Growth', '失敗', '勇氣'],
    originalLocale: 'zh-TW',
    translations: {},
    visibility: 'public',
    publishedAt: daysAgo(5),
    readCount: 642,
    resonanceCount: 51,
    inviteCount: 7,
    accentHue: 140,
  }),
  card({
    id: 'c-amara-1',
    authorId: 'u-amara',
    thoughtCore: '記憶住在手上,不住在紙上。',
    story:
      '阿嬤從不寫食譜。鹽是「差不多」,火候是「等它香」。\n\n她走了以後,我試著複製她的湯,總是差那麼一點。後來我才懂,差的不是鹽,是那雙已經不在的手。',
    tags: ['Memory', '家族', '廚房'],
    originalLocale: 'zh-TW',
    translations: {},
    visibility: 'public',
    publishedAt: daysAgo(7),
    readCount: 1204,
    resonanceCount: 92,
    inviteCount: 14,
    accentHue: 88,
  }),
  card({
    id: 'c-yuki-1',
    authorId: 'u-yuki',
    thoughtCore: '悲傷沒有進度條,痊癒也沒有。',
    story:
      '有三年,我幾乎沒有開口說話。\n\n不是說不出,是說了也沒人可以聽。後來有一天,我對著貓說了一句「早安」,牠眨了眨眼,我就哭了整個早上。',
    tags: ['Grief', '沈默', '療癒'],
    originalLocale: 'ja',
    translations: {},
    visibility: 'public',
    publishedAt: daysAgo(9),
    readCount: 908,
    resonanceCount: 74,
    inviteCount: 8,
    accentHue: 215,
  }),
  card({
    id: 'c-lea-1',
    authorId: 'u-lea',
    thoughtCore: '五小時的陌生人,比五年的熟人還近。',
    story:
      '從巴黎到馬賽的夜車上,我旁邊坐了一位快七十歲的女士。\n\n她開頭只是問我借筆,後來我們聊到她年輕時的戀人、我正在放棄的碩士。車到站時她握了我的手說,「記得勇敢。」我到現在還記得。',
    tags: ['Connection', '陌生人', '旅程'],
    originalLocale: 'en',
    translations: {},
    visibility: 'public',
    publishedAt: daysAgo(10),
    readCount: 521,
    resonanceCount: 48,
    inviteCount: 6,
    accentHue: 18,
  }),
  // Current-user cards
  card({
    id: 'c-me-1',
    authorId: 'u-me',
    thoughtCore: '寫下一句話,就像點亮一盞燈。',
    story:
      '今天下午下了一場奇怪的雨,陽台的曬衣夾掉在地上。我撿起來的時候突然想到,有些很小的事,其實一直在等我注意到它。\n\n我把今天這場雨記下來,不是因為它多特別,而是因為我願意停下來看它。',
    tags: ['日常', '書寫', '慢'],
    originalLocale: 'zh-TW',
    translations: {},
    visibility: 'public',
    publishedAt: daysAgo(1),
    readCount: 82,
    resonanceCount: 9,
    inviteCount: 1,
    accentHue: 290,
  }),
  card({
    id: 'c-me-2',
    authorId: 'u-me',
    thoughtCore: '被看見,比被喜歡更難得。',
    story:
      '昨天同事說:「你今天看起來很累。」我愣了一下,然後笑了。\n\n不是因為很感動,只是因為發現原來「被看見」這件事這麼稀有。',
    tags: ['關係', '工作', '脆弱'],
    originalLocale: 'zh-TW',
    translations: {},
    visibility: 'connections',
    publishedAt: daysAgo(4),
    readCount: 12,
    resonanceCount: 3,
    inviteCount: 0,
    accentHue: 140,
  }),
  card({
    id: 'c-me-3',
    authorId: 'u-me',
    thoughtCore: '(私人)我到底在害怕什麼?',
    story:
      '今天深夜躺在床上翻來覆去。\n\n寫給未來的自己:不要忘記現在這個害怕說出口的念頭。',
    tags: ['內省'],
    originalLocale: 'zh-TW',
    translations: {},
    visibility: 'private',
    publishedAt: daysAgo(0),
    readCount: 0,
    resonanceCount: 0,
    inviteCount: 0,
    accentHue: 215,
  }),
  card({
    id: 'c-me-draft-1',
    authorId: 'u-me',
    thoughtCore: '為什麼總是想要別人的認同?',
    story: '(草稿,還在想)',
    tags: [],
    originalLocale: 'zh-TW',
    translations: {},
    visibility: 'private',
    publishedAt: null,
    readCount: 0,
    resonanceCount: 0,
    inviteCount: 0,
    accentHue: 55,
  }),
];

export const CONNECTIONS: Connection[] = [
  {
    id: 'u-alex_u-me',
    userIds: ['u-alex', 'u-me'],
    establishedAt: daysAgo(40),
  },
  {
    id: 'u-jin_u-me',
    userIds: ['u-jin', 'u-me'],
    establishedAt: daysAgo(12),
  },
];

export const INVITES: Invite[] = [
  {
    id: 'inv-1',
    fromUserId: 'u-mara',
    toUserId: 'u-me',
    message: '你寫父親那張卡,我讀了三遍。我也寫過一封沒寄的信,想告訴你這件事。',
    referenceCardId: 'c-mara-1',
    status: 'pending',
    expiresAt: new Date(now.getTime() + 5 * 86_400_000),
    createdAt: daysAgo(2),
  },
];

export const RESONANCES: Resonance[] = [
  {
    id: 'r-1',
    cardId: 'c-mara-1',
    userId: 'u-me',
    note: '讓我想到自己那封寫給阿公的。',
    createdAt: daysAgo(2),
  },
  {
    id: 'r-2',
    cardId: 'c-amara-1',
    userId: 'u-me',
    createdAt: daysAgo(5),
  },
  {
    id: 'r-3',
    cardId: 'c-alex-1',
    userId: 'u-me',
    createdAt: daysAgo(1),
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    userId: 'u-me',
    type: 'invite',
    payload: { inviteId: 'inv-1', fromHandle: 'mara' },
    readAt: null,
    createdAt: daysAgo(2),
  },
  {
    id: 'n-2',
    userId: 'u-me',
    type: 'resonance_summary',
    payload: { count: 4, period: 'yesterday' },
    readAt: null,
    createdAt: daysAgo(1),
  },
  {
    id: 'n-3',
    userId: 'u-me',
    type: 'translation_done',
    payload: { cardId: 'c-me-1', locale: 'en' },
    readAt: daysAgo(1),
    createdAt: daysAgo(1),
  },
];
