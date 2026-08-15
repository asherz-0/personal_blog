// PROTOTYPE — Three card-rail directions for replacing the vertically flattened
// archive sections, switchable via ?variant= on the existing home route.
import {useEffect, useState, type CSSProperties, type PointerEvent} from 'react';
import {ArrowLeft, ArrowRight, CornerUpLeft, Diamond, MoveHorizontal} from 'lucide-react';
import {motion, useReducedMotion, useSpring} from 'motion/react';
import './card-rails-prototype.css';

type PrototypeVariant = 'A' | 'B' | 'C';
type Scenario = 'overflow' | 'short' | 'empty';
type SectionKey = 'consume' | 'write' | 'build';

type CardItem = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  meta: string;
};

type SectionDefinition = {
  key: SectionKey;
  index: string;
  label: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
};

type ScenarioMap = Record<SectionKey, Scenario>;

const VARIANTS: Array<{key: PrototypeVariant; label: string}> = [
  {key: 'A', label: '连续横轨'},
  {key: 'B', label: '控制台分栏'},
  {key: 'C', label: '档案展台'},
];

const SCENARIOS: Array<{key: Scenario; label: string}> = [
  {key: 'overflow', label: '溢出循环'},
  {key: 'short', label: '不足一屏'},
  {key: 'empty', label: '空状态'},
];

const DEFAULT_SCENARIOS: ScenarioMap = {
  consume: 'overflow',
  write: 'short',
  build: 'empty',
};

const SECTIONS: SectionDefinition[] = [
  {
    key: 'consume',
    index: '04',
    label: 'THINGS I CONSUME',
    title: '消费对象',
    description: '书、文章、论文与资料。让输入成为判断的校准源。',
    emptyTitle: '输入队列为空',
    emptyDescription: '没有待整理的书、文章或资料。新的输入会从这里进入。',
  },
  {
    key: 'write',
    index: '05',
    label: 'THINGS I WRITE',
    title: '博文',
    description: '正在形成与已经发布的长期判断，按时间进入公开档案。',
    emptyTitle: '还没有公开博文',
    emptyDescription: '草稿不会出现在这里；第一篇发布后，档案会开始生长。',
  },
  {
    key: 'build',
    index: '06',
    label: 'THINGS I BUILD',
    title: '项目',
    description: '用真实项目验证观点，再把可以复用的结果写回来。',
    emptyTitle: '项目舱暂时空闲',
    emptyDescription: '新的实验与产品会出现在这里，空白也是系统状态的一部分。',
  },
];

const MOCK_DATA: Record<SectionKey, CardItem[]> = {
  consume: [
    {
      id: 'C-01',
      eyebrow: 'BOOK / SYSTEMS',
      title: '《系统之美》',
      summary: '用存量、流量与反馈回路重新观察那些反复出现的问题。',
      meta: 'READING · 68%',
    },
    {
      id: 'C-02',
      eyebrow: 'ESSAY / DESIGN',
      title: 'The Shape of Design',
      summary: '设计不是装饰，而是在约束中组织关系与意图。',
      meta: 'NOTED · 12 IDEAS',
    },
    {
      id: 'C-03',
      eyebrow: 'PAPER / AGENTS',
      title: 'Agentic Design Patterns',
      summary: '把工具调用、记忆与反馈拆成可以观察和修正的模块。',
      meta: 'QUEUE · NEXT',
    },
    {
      id: 'C-04',
      eyebrow: 'BOOK / SCIENCE',
      title: 'The Beginning of Infinity',
      summary: '好解释如何不断生成新的问题，也生成更好的世界模型。',
      meta: 'READ · 2026.07',
    },
    {
      id: 'C-05',
      eyebrow: 'TALK / PRODUCT',
      title: 'The Long Now',
      summary: '把产品判断的时间尺度从季度拉长到真正的长期。',
      meta: 'CAPTURED · 24 MIN',
    },
    {
      id: 'C-06',
      eyebrow: 'ARTICLE / CRAFT',
      title: 'Taste for Makers',
      summary: '品味不是玄学，而是一组可以持续训练的辨别能力。',
      meta: 'REVISIT · MONTHLY',
    },
    {
      id: 'C-07',
      eyebrow: 'BOOK / WRITING',
      title: 'Several Short Sentences',
      summary: '让句子保留力道，让观点在节奏中逐渐显形。',
      meta: 'NOTED · 09 IDEAS',
    },
    {
      id: 'C-08',
      eyebrow: 'REPORT / AI',
      title: 'State of AI 2026',
      summary: '追踪能力、成本与应用边界的真实变化，而不是短期噪声。',
      meta: 'QUEUE · LATER',
    },
  ],
  write: [
    {
      id: 'W-01',
      eyebrow: 'POST / NOTE',
      title: '把思考放到一个长期可访问的地方',
      summary: '社交平台适合交换近况，博客更适合保存仍在形成中的判断。',
      meta: '2026.08.16 · 4 MIN',
    },
    {
      id: 'W-02',
      eyebrow: 'POST / SYSTEMS',
      title: '反馈不是评价，而是方向信息',
      summary: '当反馈回到行动太晚，系统会在纠偏之前先产生振荡。',
      meta: 'DRAFT · 72%',
    },
    {
      id: 'W-03',
      eyebrow: 'POST / PRODUCT',
      title: '先缩短验证路径，再扩大投入',
      summary: '把昂贵承诺改写成最短的真实世界实验。',
      meta: '2026.07.29 · 6 MIN',
    },
    {
      id: 'W-04',
      eyebrow: 'POST / AI',
      title: 'Agent 的边界应该在哪里',
      summary: '授权、可逆性与反馈速度共同决定自动化可以走多远。',
      meta: 'DRAFT · 41%',
    },
    {
      id: 'W-05',
      eyebrow: 'POST / CAREER',
      title: '让能力在项目之间复利',
      summary: '真正可迁移的不是熟练度，而是判断、表达与关系信誉。',
      meta: '2026.06.18 · 8 MIN',
    },
    {
      id: 'W-06',
      eyebrow: 'POST / REVIEW',
      title: '一次有效复盘需要保留什么',
      summary: '保留下一次决策真正用得上的信号，而不是完整流水账。',
      meta: 'DRAFT · 19%',
    },
    {
      id: 'W-07',
      eyebrow: 'POST / CRAFT',
      title: '写作是一种压缩算法',
      summary: '删掉无法改变判断的细节，让结构承担更多信息。',
      meta: '2026.05.03 · 5 MIN',
    },
  ],
  build: [
    {
      id: 'B-01',
      eyebrow: 'WEB / OPEN SOURCE',
      title: 'Personal Archive',
      summary: '以 Markdown 为单一内容源、由 GitHub Actions 自动发布的个人档案。',
      meta: 'LIVE · ITERATING',
    },
    {
      id: 'B-02',
      eyebrow: 'TOOL / KNOWLEDGE',
      title: 'Signal Notes',
      summary: '把阅读标注转成可回看的判断、问题与下一步实验。',
      meta: 'PROTOTYPE · V0.3',
    },
    {
      id: 'B-03',
      eyebrow: 'TOOL / DECISIONS',
      title: 'Decision Ledger',
      summary: '记录决策发生时的上下文、预期与复盘窗口。',
      meta: 'BUILDING · 58%',
    },
    {
      id: 'B-04',
      eyebrow: 'LAB / AGENTS',
      title: 'Agent Control Tower',
      summary: '观察多个 agent 的任务边界、状态、阻塞和交接。',
      meta: 'LAB · ACTIVE',
    },
    {
      id: 'B-05',
      eyebrow: 'SYSTEM / LIFE',
      title: 'Life OS Map',
      summary: '让计划、知识、项目与复盘拥有清晰边界和反馈关系。',
      meta: 'PRIVATE · STEADY',
    },
    {
      id: 'B-06',
      eyebrow: 'EXPERIMENT / MEDIA',
      title: 'Long-form Signals',
      summary: '从长内容中提取可复用的论点、证据和反例。',
      meta: 'EXPERIMENT · 02',
    },
  ],
};

function parseScenario(value: string | null, fallback: Scenario): Scenario {
  return SCENARIOS.some((scenario) => scenario.key === value) ? (value as Scenario) : fallback;
}

function parseVariant(value: string | null): PrototypeVariant {
  return VARIANTS.some((variant) => variant.key === value) ? (value as PrototypeVariant) : 'A';
}

function updateUrlParam(name: string, value: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set(name, value);
  history.replaceState(null, '', url);
}

function TiltCard({item, sectionKey}: {item: CardItem; sectionKey: SectionKey}) {
  const reduceMotion = useReducedMotion();
  const rotateX = useSpring(0, {stiffness: 240, damping: 24, mass: 0.7});
  const rotateY = useSpring(0, {stiffness: 240, damping: 24, mass: 0.7});

  function handlePointerMove(event: PointerEvent<HTMLElement>): void {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateX.set(vertical * -16);
    rotateY.set(horizontal * 16);
  }

  function resetTilt(): void {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.article
      className={`prototype-card prototype-card--${sectionKey}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      tabIndex={0}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
      }}
      aria-label={`${item.eyebrow}: ${item.title}`}
    >
      <div className="prototype-card__signal" aria-hidden="true">
        <span>{item.id}</span>
        <span className="prototype-card__axis">+</span>
      </div>
      <div className="prototype-card__body">
        <div className="prototype-card__eyebrow">{item.eyebrow}</div>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <div className="prototype-card__meta">
          <span>{item.meta}</span>
          <ArrowRight size={14} aria-hidden="true" />
        </div>
      </div>
    </motion.article>
  );
}

function EmptyState({section}: {section: SectionDefinition}) {
  return (
    <div className="prototype-empty" role="status">
      <div className="prototype-empty__scope" aria-hidden="true">
        <span />
        <span />
      </div>
      <div>
        <div className="prototype-empty__code">{section.index} / NO SIGNAL</div>
        <h3>{section.emptyTitle}</h3>
        <p>{section.emptyDescription}</p>
      </div>
    </div>
  );
}

function Rail({section, scenario}: {section: SectionDefinition; scenario: Scenario}) {
  const sourceItems = MOCK_DATA[section.key];
  const items = scenario === 'empty' ? [] : scenario === 'short' ? sourceItems.slice(0, 2) : sourceItems;
  const shouldLoop = scenario === 'overflow';
  const loopStyle = {
    '--prototype-loop-duration': `${Math.max(28, items.length * 5)}s`,
  } as CSSProperties;

  if (items.length === 0) return <EmptyState section={section} />;

  const cards = (copy: 'primary' | 'clone') => (
    <div className="prototype-rail__group" aria-hidden={copy === 'clone' ? true : undefined}>
      {items.map((item) => (
        <TiltCard key={`${copy}-${item.id}`} item={item} sectionKey={section.key} />
      ))}
    </div>
  );

  return (
    <div className={`prototype-rail ${shouldLoop ? 'prototype-rail--looping' : 'prototype-rail--static'}`}>
      <div
        className={`prototype-rail__track ${shouldLoop ? 'prototype-rail__track--looping' : ''}`}
        style={loopStyle}
      >
        {cards('primary')}
        {shouldLoop ? cards('clone') : null}
      </div>
    </div>
  );
}

function ScenarioControl({
  section,
  scenario,
  onChange,
}: {
  section: SectionKey;
  scenario: Scenario;
  onChange: (section: SectionKey, scenario: Scenario) => void;
}) {
  return (
    <div className="prototype-scenario-control" aria-label="切换数据状态">
      {SCENARIOS.map((option) => (
        <button
          key={option.key}
          type="button"
          aria-pressed={scenario === option.key}
          onClick={() => onChange(section, option.key)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function RailStatus({section, scenario}: {section: SectionDefinition; scenario: Scenario}) {
  const count = scenario === 'empty' ? 0 : scenario === 'short' ? 2 : MOCK_DATA[section.key].length;
  const status = scenario === 'overflow' ? 'AUTO / LOOPING' : scenario === 'short' ? 'STATIC / FIT' : 'NO SIGNAL';
  return (
    <div className="prototype-rail-status">
      <span>{status}</span>
      <span>{count.toString().padStart(2, '0')} OBJECTS</span>
    </div>
  );
}

type VariantProps = {
  scenarios: ScenarioMap;
  onScenarioChange: (section: SectionKey, scenario: Scenario) => void;
};

function VariantA({scenarios, onScenarioChange}: VariantProps) {
  return (
    <main className="prototype-variant prototype-variant--a">
      <div className="prototype-intro prototype-intro--a">
        <div className="prototype-intro__label">A / CONTINUOUS RAILS</div>
        <h1>把档案放上轨道。</h1>
        <p>完整宽度、连续经过视野。悬停一张卡片，轨道暂停，指针位置驱动卡片倾斜。</p>
      </div>
      {SECTIONS.map((section) => (
        <section key={section.key} className="prototype-band" aria-labelledby={`a-${section.key}`}>
          <div className="prototype-band__header">
            <div>
              <div className="prototype-section-code">{section.index} // {section.label}</div>
              <h2 id={`a-${section.key}`}>{section.title}</h2>
              <p>{section.description}</p>
            </div>
            <ScenarioControl
              section={section.key}
              scenario={scenarios[section.key]}
              onChange={onScenarioChange}
            />
          </div>
          <RailStatus section={section} scenario={scenarios[section.key]} />
          <Rail section={section} scenario={scenarios[section.key]} />
        </section>
      ))}
    </main>
  );
}

function VariantB({scenarios, onScenarioChange}: VariantProps) {
  return (
    <main className="prototype-variant prototype-variant--b">
      <div className="prototype-intro prototype-intro--b">
        <div>
          <div className="prototype-intro__label">B / BENTO CONSOLE</div>
          <h1>左侧读状态，右侧看对象。</h1>
        </div>
        <p>把分类说明固定成仪表盘侧栏，内容在右侧独立运行，更接近现有 Bento 的工程结构。</p>
      </div>
      {SECTIONS.map((section) => (
        <section key={section.key} className="prototype-console" aria-labelledby={`b-${section.key}`}>
          <div className="prototype-console__panel">
            <div className="prototype-section-code">{section.index} // {section.label}</div>
            <h2 id={`b-${section.key}`}>{section.title}</h2>
            <p>{section.description}</p>
            <ScenarioControl
              section={section.key}
              scenario={scenarios[section.key]}
              onChange={onScenarioChange}
            />
          </div>
          <div className="prototype-console__content">
            <RailStatus section={section} scenario={scenarios[section.key]} />
            <Rail section={section} scenario={scenarios[section.key]} />
          </div>
        </section>
      ))}
    </main>
  );
}

function VariantC({scenarios, onScenarioChange}: VariantProps) {
  return (
    <main className="prototype-variant prototype-variant--c">
      <div className="prototype-intro prototype-intro--c">
        <div className="prototype-intro__index">03</div>
        <div>
          <div className="prototype-intro__label">C / ARCHIVE STAGE</div>
          <h1>每一类对象，都是一个独立展台。</h1>
          <p>更强的分类节奏、更大的卡片舞台，适合内容量不高但希望每一项都被认真观看的档案。</p>
        </div>
      </div>
      {SECTIONS.map((section) => (
        <section key={section.key} className="prototype-stage" aria-labelledby={`c-${section.key}`}>
          <div className="prototype-stage__heading">
            <span aria-hidden="true">{section.index}</span>
            <div>
              <div className="prototype-section-code">{section.label}</div>
              <h2 id={`c-${section.key}`}>{section.title}</h2>
              <p>{section.description}</p>
            </div>
            <ScenarioControl
              section={section.key}
              scenario={scenarios[section.key]}
              onChange={onScenarioChange}
            />
          </div>
          <div className="prototype-stage__frame">
            <RailStatus section={section} scenario={scenarios[section.key]} />
            <Rail section={section} scenario={scenarios[section.key]} />
          </div>
        </section>
      ))}
    </main>
  );
}

function PrototypeSwitcher({
  current,
  onChange,
}: {
  current: PrototypeVariant;
  onChange: (variant: PrototypeVariant) => void;
}) {
  const currentIndex = VARIANTS.findIndex((variant) => variant.key === current);

  function cycle(direction: -1 | 1): void {
    const nextIndex = (currentIndex + direction + VARIANTS.length) % VARIANTS.length;
    onChange(VARIANTS[nextIndex].key);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, [contenteditable="true"]')) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        cycle(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        cycle(1);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const label = VARIANTS[currentIndex]?.label ?? '';

  return (
    <div className="prototype-switcher" aria-label="原型版式切换">
      <button type="button" onClick={() => cycle(-1)} aria-label="上一个版式">
        <ArrowLeft size={15} />
      </button>
      <div>
        <span>PROTOTYPE</span>
        <strong>{current} — {label}</strong>
      </div>
      <button type="button" onClick={() => cycle(1)} aria-label="下一个版式">
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

export function CardRailsPrototype() {
  const searchParams = new URLSearchParams(window.location.search);
  const [variant, setVariant] = useState<PrototypeVariant>(() => parseVariant(searchParams.get('variant')));
  const [scenarios, setScenarios] = useState<ScenarioMap>(() => ({
    consume: parseScenario(searchParams.get('consume'), DEFAULT_SCENARIOS.consume),
    write: parseScenario(searchParams.get('write'), DEFAULT_SCENARIOS.write),
    build: parseScenario(searchParams.get('build'), DEFAULT_SCENARIOS.build),
  }));

  function changeVariant(nextVariant: PrototypeVariant): void {
    setVariant(nextVariant);
    updateUrlParam('variant', nextVariant);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  function changeScenario(section: SectionKey, scenario: Scenario): void {
    setScenarios((current) => ({...current, [section]: scenario}));
    updateUrlParam(section, scenario);
  }

  return (
    <div className="card-rails-prototype selection:bg-orbit-blue selection:text-white" data-variant={variant}>
      <header className="prototype-header">
        <a href={import.meta.env.BASE_URL} aria-label="返回当前站点">
          <span className="prototype-header__mark"><Diamond size={16} fill="currentColor" /></span>
          <span>PERSONAL ARCHIVE / CARD RAIL STUDY</span>
        </a>
        <div>
          <MoveHorizontal size={15} aria-hidden="true" />
          POINTER TILT · INFINITE X · MOCK STATES
        </div>
        <a href={import.meta.env.BASE_URL} className="prototype-header__back">
          <CornerUpLeft size={14} aria-hidden="true" />
          返回站点
        </a>
      </header>

      {variant === 'A' ? <VariantA scenarios={scenarios} onScenarioChange={changeScenario} /> : null}
      {variant === 'B' ? <VariantB scenarios={scenarios} onScenarioChange={changeScenario} /> : null}
      {variant === 'C' ? <VariantC scenarios={scenarios} onScenarioChange={changeScenario} /> : null}

      {import.meta.env.DEV ? <PrototypeSwitcher current={variant} onChange={changeVariant} /> : null}
    </div>
  );
}
