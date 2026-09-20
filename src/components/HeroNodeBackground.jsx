import { useEffect, useRef } from 'react';

// One connected graph: shared junctions keep the side and center paths attached.
const leftNodes = [[24, 170], [156, 208], [300, 130], [78, 380], [260, 442], [30, 604], [168, 692], [340, 762]];
const nodes = [
  ...leftNodes,
  ...leftNodes.map(([x, y]) => [1440 - x, 900 - y]),
  [480, 175], [720, 220], [960, 155],
  [485, 515], [720, 560], [955, 505],
  [720, 790],
];
const sideEdges = [
  [0, 1, 82, 163], [1, 2, 220, 130],
  [0, 3, 20, 294], [1, 3, 118, 312],
  [3, 4, 180, 388], [3, 5, 4, 506],
  [4, 6, 212, 592], [5, 6, 78, 690],
  [6, 7, 254, 720],
];
const edgePath = ([from, to, cx, cy]) => (
  'M' + nodes[from].join(' ') + ' Q' + cx + ' ' + cy + ' ' + nodes[to].join(' ')
);
const sidePaths = [
  ...sideEdges,
  ...sideEdges.map(([from, to, cx, cy]) => [from + 8, to + 8, 1440 - cx, 900 - cy]),
].map(edgePath);

// Each moving point follows a continuous route from the left graph to the right.
const routes = [
  'M300 130 Q390 125 480 175 Q600 240 720 220 Q840 200 960 155 Q1030 130 1100 138',
  'M260 442 Q365 470 485 515 Q600 580 720 560 Q840 540 955 505 Q1160 450 1362 520',
  'M340 762 Q530 830 720 790 Q930 750 1140 770',
];
const branches = [
  [16, 19, 440, 360],
  [18, 21, 1010, 340],
  [20, 22, 760, 675],
].map(edgePath);

export default function HeroNodeBackground({ active = true, reduceMotion = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (active && !reduceMotion) ref.current?.unpauseAnimations?.();
    else ref.current?.pauseAnimations?.();
  }, [active, reduceMotion]);

  return (
    <div data-hero-nodes aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 top-1/4 size-80 rounded-full bg-blue-400/[0.04] blur-3xl dark:bg-blue-500/[0.06]" />
      <div className="absolute -right-32 bottom-1/4 size-80 rounded-full bg-cyan-400/[0.04] blur-3xl dark:bg-cyan-400/[0.05]" />
      <svg ref={ref} viewBox="0 0 1440 900" preserveAspectRatio="none" focusable="false"
        className="h-full w-full text-blue-500/35 dark:text-blue-400/40 [mask-image:linear-gradient(to_right,#000,rgba(0,0,0,0.45)_35%,rgba(0,0,0,0.45)_65%,#000)]">
        <g className={reduceMotion ? undefined : 'hero-node-drift'}
          style={{ animationPlayState: active ? 'running' : 'paused', animationDelay: '-2s' }}>
          {[...sidePaths, ...routes, ...branches].map(path => (
            <path key={path} d={path} fill="none" stroke="currentColor" strokeWidth="0.85"
              vectorEffect="non-scaling-stroke" />
          ))}
          {nodes.map(([x, y], index) => (
            <g key={index} transform={'translate(' + x + ' ' + y + ')'}>
              <circle r="9" fill="currentColor" opacity="0.08" />
              <circle r={index % 3 === 0 ? 3.2 : 2.3} fill="currentColor" opacity="0.9" />
            </g>
          ))}
          {!reduceMotion && [...routes, sidePaths[2], sidePaths[11]].map((path, index) => (
            <circle key={path} r="2.6" fill="currentColor">
              <animateMotion path={path} dur={index < 3 ? '28s' : '20s'}
                begin={(-index * 6 - 3) + 's'} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      </svg>
    </div>
  );
}
