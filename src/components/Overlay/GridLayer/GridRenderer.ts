type Direction = 'up' | 'down' | 'left' | 'right';
type Edge = 'top' | 'bottom' | 'left' | 'right';

interface TrailPoint {
  x: number;
  y: number;
}

interface Orb {
  x: number;
  y: number;
  direction: Direction;
  trail: TrailPoint[];
  trailHead: number;
  trailSize: number;
  lastTurnFrame: number;
}

interface GridRendererConfig {
  cellSize: number;
  orbCount: number;
  orbSpeed: number;
  orbRadius: number;
  turnChance: number;
  trailLength: number;
  gridOffsetX: number;
  gridOffsetY: number;
  gridOverflow: number;
  wrapMargin: number;
  spawnDelay: number;
  spawnStagger: number;
}

const DIRECTION_VECTORS: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 }
};

const PERPENDICULAR_DIRECTIONS: Record<Direction, Direction[]> = {
  up: ['left', 'right'],
  down: ['left', 'right'],
  left: ['up', 'down'],
  right: ['up', 'down']
};

const EDGE_INWARD_DIRECTION: Record<Edge, Direction> = {
  top: 'down',
  bottom: 'up',
  left: 'right',
  right: 'left'
};

const EDGES: Edge[] = ['top', 'bottom', 'left', 'right'];

const TRAIL_MAX_ALPHA = 0.3;
const TRAIL_MIN_SIZE_RATIO = 0.4;
const TRAIL_SIZE_RANGE = 0.6;
const HEAD_CENTER_ALPHA = 0.5;
const HEAD_MID_STOP = 0.5;
const INTERSECTION_TOLERANCE_OFFSET = 0.5;
const TURN_COOLDOWN_FACTOR = 0.8;
const RESIZE_DEBOUNCE_MS = 300;

export class GridRenderer {
  private config: GridRendererConfig;
  private ctx: CanvasRenderingContext2D | null = null;
  private canvasWidth = 0;
  private canvasHeight = 0;
  private orbs: Orb[] = [];
  private frameCount = 0;
  private glowSprite: HTMLCanvasElement | null = null;
  private spawnTimers: ReturnType<typeof setTimeout>[] = [];
  private resizeDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private isMounted = false;

  constructor(config: GridRendererConfig) {
    this.config = config;
  }

  mount(canvas: HTMLCanvasElement): boolean {
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    this.ctx = ctx;
    const { gridOffsetX, gridOffsetY } = this.config;
    this.resize(canvas, canvas.width || 0, canvas.height || 0, gridOffsetX, gridOffsetY);
    this.glowSprite = this.createGlowSprite();
    this.scheduleOrbSpawns();
    this.isMounted = true;

    return true;
  }

  resize(canvas: HTMLCanvasElement, width: number, height: number, gridOffsetX: number, gridOffsetY: number): void {
    canvas.width = width;
    canvas.height = height;
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.config = { ...this.config, gridOffsetX, gridOffsetY };
    if (this.isMounted) this.debouncedRespawnOrbs();
  }

  render(): void {
    if (!this.ctx) return;

    const { canvasWidth: w, canvasHeight: h } = this;
    this.ctx.clearRect(0, 0, w, h);
    this.frameCount++;

    this.debugDrawGrid();

    for (const orb of this.orbs) {
      this.moveOrb(orb);
      this.recordTrail(orb);
      this.handleIntersectionTurn(orb);
      this.wrapOrb(orb);
      this.drawTrail(orb);
      this.drawHead(orb);
    }
  }

  dispose(): void {
    this.spawnTimers.forEach(clearTimeout);
    this.spawnTimers = [];
    if (this.resizeDebounceTimer) clearTimeout(this.resizeDebounceTimer);
    this.resizeDebounceTimer = null;
    this.isMounted = false;
    this.ctx = null;
    this.orbs = [];
    this.glowSprite = null;
    this.frameCount = 0;
  }

  private createGlowSprite(): HTMLCanvasElement {
    const { orbRadius } = this.config;
    const diameter = orbRadius * 2;
    const sprite = document.createElement('canvas');
    sprite.width = diameter;
    sprite.height = diameter;

    const spriteCtx = sprite.getContext('2d');
    if (!spriteCtx) return sprite;

    const gradient = spriteCtx.createRadialGradient(orbRadius, orbRadius, 0, orbRadius, orbRadius, orbRadius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(HEAD_MID_STOP, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    spriteCtx.fillStyle = gradient;
    spriteCtx.fillRect(0, 0, diameter, diameter);

    return sprite;
  }

  private scheduleOrbSpawns(): void {
    const { orbCount, spawnDelay, spawnStagger } = this.config;

    for (let i = 0; i < orbCount; i++) {
      const timer = setTimeout(
        () => {
          this.orbs.push(this.spawnOrbFromEdge());
        },
        spawnDelay + i * spawnStagger
      );
      this.spawnTimers.push(timer);
    }
  }

  private debouncedRespawnOrbs(): void {
    if (this.resizeDebounceTimer) clearTimeout(this.resizeDebounceTimer);
    this.resizeDebounceTimer = setTimeout(() => this.respawnOrbs(), RESIZE_DEBOUNCE_MS);
  }

  private respawnOrbs(): void {
    this.spawnTimers.forEach(clearTimeout);
    this.spawnTimers = [];
    this.orbs = [];
    this.scheduleOrbSpawns();
  }

  private spawnOrbFromEdge(): Orb {
    const { cellSize, gridOffsetX, gridOffsetY, trailLength } = this.config;
    const { canvasWidth: w, canvasHeight: h } = this;

    const edge = EDGES[Math.floor(Math.random() * EDGES.length)];
    const direction = EDGE_INWARD_DIRECTION[edge];

    const cols = Math.floor(w / cellSize) + 1;
    const rows = Math.floor(h / cellSize) + 1;
    const randGridX = Math.floor(Math.random() * cols) * cellSize + gridOffsetX;
    const randGridY = Math.floor(Math.random() * rows) * cellSize + gridOffsetY;

    const positions: Record<Edge, { x: number; y: number }> = {
      top: { x: randGridX, y: 0 },
      bottom: { x: randGridX, y: h },
      left: { x: 0, y: randGridY },
      right: { x: w, y: randGridY }
    };
    const { x, y } = positions[edge];

    return {
      x,
      y,
      direction,
      trail: new Array<TrailPoint>(trailLength),
      trailHead: 0,
      trailSize: 0,
      lastTurnFrame: -100
    };
  }

  private moveOrb(orb: Orb): void {
    const { dx, dy } = DIRECTION_VECTORS[orb.direction];
    orb.x += dx * this.config.orbSpeed;
    orb.y += dy * this.config.orbSpeed;
  }

  private recordTrail(orb: Orb): void {
    const { trailLength } = this.config;
    orb.trail[orb.trailHead] = { x: orb.x, y: orb.y };
    orb.trailHead = (orb.trailHead + 1) % trailLength;
    if (orb.trailSize < trailLength) orb.trailSize++;
  }

  private handleIntersectionTurn(orb: Orb): void {
    const { cellSize, orbSpeed, turnChance, gridOffsetX, gridOffsetY } = this.config;
    const tolerance = orbSpeed + INTERSECTION_TOLERANCE_OFFSET;
    const turnCooldown = (cellSize / orbSpeed) * TURN_COOLDOWN_FACTOR;

    if (!this.isAtIntersection(orb, tolerance)) return;
    if (this.frameCount - orb.lastTurnFrame <= turnCooldown) return;
    if (Math.random() >= turnChance) return;

    const perpDirs = PERPENDICULAR_DIRECTIONS[orb.direction];
    orb.direction = perpDirs[Math.floor(Math.random() * perpDirs.length)];
    orb.x = this.snapToGrid(orb.x, gridOffsetX);
    orb.y = this.snapToGrid(orb.y, gridOffsetY);
    orb.lastTurnFrame = this.frameCount;
  }

  private isAtIntersection(orb: Orb, tolerance: number): boolean {
    const { cellSize, gridOffsetX, gridOffsetY } = this.config;
    const xRemainder = Math.abs((orb.x - gridOffsetX) % cellSize);
    const yRemainder = Math.abs((orb.y - gridOffsetY) % cellSize);
    const xSnapped = xRemainder <= tolerance || cellSize - xRemainder <= tolerance;
    const ySnapped = yRemainder <= tolerance || cellSize - yRemainder <= tolerance;

    return xSnapped && ySnapped;
  }

  private snapToGrid(value: number, offset: number): number {
    const { cellSize } = this.config;

    return Math.round((value - offset) / cellSize) * cellSize + offset;
  }

  private wrapOrb(orb: Orb): void {
    const { gridOverflow, wrapMargin } = this.config;
    const { canvasWidth: w, canvasHeight: h } = this;

    const viewLeft = gridOverflow - wrapMargin;
    const viewRight = w - gridOverflow + wrapMargin;
    const viewTop = gridOverflow - wrapMargin;
    const viewBottom = h - gridOverflow + wrapMargin;

    let didWrap = false;

    if (orb.x < viewLeft) {
      orb.x = viewRight;
      didWrap = true;
    } else if (orb.x > viewRight) {
      orb.x = viewLeft;
      didWrap = true;
    }

    if (orb.y < viewTop) {
      orb.y = viewBottom;
      didWrap = true;
    } else if (orb.y > viewBottom) {
      orb.y = viewTop;
      didWrap = true;
    }

    if (didWrap) this.clearTrail(orb);
  }

  private clearTrail(orb: Orb): void {
    orb.trailHead = 0;
    orb.trailSize = 0;
  }

  private drawTrail(orb: Orb): void {
    if (!this.ctx || !this.glowSprite) return;

    const { orbRadius, trailLength } = this.config;
    const { trail, trailHead, trailSize } = orb;

    for (let i = 0; i < trailSize; i++) {
      const index = (trailHead - trailSize + i + trailLength) % trailLength;
      const point = trail[index];
      const progress = i / trailSize;
      const alpha = progress * TRAIL_MAX_ALPHA;
      const radius = orbRadius * (TRAIL_MIN_SIZE_RATIO + TRAIL_SIZE_RANGE * progress);

      this.ctx.globalAlpha = alpha;
      this.ctx.drawImage(this.glowSprite, point.x - radius, point.y - radius, radius * 2, radius * 2);
    }
  }

  private drawHead(orb: Orb): void {
    if (!this.ctx || !this.glowSprite) return;

    const { orbRadius } = this.config;
    this.ctx.globalAlpha = HEAD_CENTER_ALPHA;
    this.ctx.drawImage(this.glowSprite, orb.x - orbRadius, orb.y - orbRadius, orbRadius * 2, orbRadius * 2);
    this.ctx.globalAlpha = 1;
  }

  private debugDrawGrid(): void {
    if (!this.ctx) return;

    const { cellSize, gridOffsetX, gridOffsetY } = this.config;
    const { canvasWidth: w, canvasHeight: h } = this;

    this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)';
    this.ctx.lineWidth = 1;

    for (let x = gridOffsetX; x <= w; x += cellSize) {
      if (x < 0) continue;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }

    for (let y = gridOffsetY; y <= h; y += cellSize) {
      if (y < 0) continue;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    this.ctx.strokeStyle = '';
  }
}
