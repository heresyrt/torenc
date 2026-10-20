export const MIN_SCALE = 1;
export const MAX_SCALE = 3;
export const SCALE_STEP = 0.5;

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ViewerTransform extends Point {
  scale: number;
}

export function clampScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

export function changeScale(transform: ViewerTransform, requestedScale: number): ViewerTransform {
  const scale = clampScale(requestedScale);
  return scale === MIN_SCALE
    ? { scale, x: 0, y: 0 }
    : { ...transform, scale };
}

export function clampPan(point: Point, scale: number, viewport: Size, image: Size): Point {
  if (scale <= MIN_SCALE || viewport.width <= 0 || viewport.height <= 0 || image.width <= 0 || image.height <= 0) {
    return { x: 0, y: 0 };
  }

  const fitScale = Math.min(viewport.width / image.width, viewport.height / image.height);
  const displayedWidth = image.width * fitScale * scale;
  const displayedHeight = image.height * fitScale * scale;
  const maxX = Math.max(0, (displayedWidth - viewport.width) / 2);
  const maxY = Math.max(0, (displayedHeight - viewport.height) / 2);

  return {
    x: Math.min(maxX, Math.max(-maxX, point.x)),
    y: Math.min(maxY, Math.max(-maxY, point.y)),
  };
}
