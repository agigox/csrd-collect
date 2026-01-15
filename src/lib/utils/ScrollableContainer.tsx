import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  CSSProperties,
} from "react";
import "./ScrollableContainer.css";

export interface ScrollableContainerProps {
  children: React.ReactNode;
  /** Width of the scrollbar thumb and track */
  scrollbarWidth?: number;
  /** Background color of the scrollbar track */
  trackColor?: string;
  /** Background color of the scrollbar thumb */
  thumbColor?: string;
  /** Border radius of the scrollbar thumb */
  thumbBorderRadius?: number;
  /** Border radius of the scrollbar track */
  trackBorderRadius?: number;
  /** Height of the scrollbar thumb */
  thumbHeight?: number;
  /** Additional className for the container */
  className?: string;
  /** Maximum height of the container - scroll appears when content exceeds this. Container shrinks to fit content if smaller. */
  height?: number | string;
  /** Custom styles for the container */
  style?: CSSProperties;
  /** Callback fired when overflow state changes (scrollbar appears/disappears) */
  onOverflowChange?: (hasOverflow: boolean) => void;
}

export const ScrollableContainer = ({
  children,
  scrollbarWidth = 8,
  trackColor = "transparent",
  thumbColor = "rgba(59, 67, 74, 0.4)",
  thumbBorderRadius = 10,
  trackBorderRadius = 10,
  thumbHeight = 64,
  className = "",
  height,
  style,
  onOverflowChange,
}: ScrollableContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [hasOverflow, setHasOverflow] = useState(false);
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);

  // Check for overflow
  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight } = contentRef.current;
        const newHasOverflow = scrollHeight > clientHeight;
        setHasOverflow((prev) => {
          if (prev !== newHasOverflow) {
            onOverflowChange?.(newHasOverflow);
          }
          return newHasOverflow;
        });
      }
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [children, onOverflowChange]);

  // Update thumb position on scroll
  const updateThumbPosition = useCallback(() => {
    if (!contentRef.current || !trackRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const trackHeight = trackRef.current.clientHeight;
    const maxThumbTop = trackHeight - thumbHeight;
    const scrollableDistance = scrollHeight - clientHeight;

    if (scrollableDistance > 0) {
      const newThumbTop = (scrollTop / scrollableDistance) * maxThumbTop;
      setThumbTop(Math.min(Math.max(0, newThumbTop), maxThumbTop));
    }
  }, [thumbHeight]);

  // Handle content scroll
  const handleScroll = useCallback(() => {
    updateThumbPosition();
  }, [updateThumbPosition]);

  // Handle mouse down on thumb
  const handleThumbMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartScrollTop.current = contentRef.current?.scrollTop || 0;
  }, []);

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !contentRef.current || !trackRef.current) return;

      const deltaY = e.clientY - dragStartY.current;
      const trackHeight = trackRef.current.clientHeight;
      const { scrollHeight, clientHeight } = contentRef.current;
      const scrollableDistance = scrollHeight - clientHeight;
      const maxThumbTop = trackHeight - thumbHeight;

      const scrollDelta = (deltaY / maxThumbTop) * scrollableDistance;
      contentRef.current.scrollTop = dragStartScrollTop.current + scrollDelta;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, thumbHeight]);

  // Handle click on track
  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    if (
      !contentRef.current ||
      !trackRef.current ||
      e.target === thumbRef.current
    )
      return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - trackRect.top;
    const trackHeight = trackRef.current.clientHeight;
    const { scrollHeight, clientHeight } = contentRef.current;
    const scrollableDistance = scrollHeight - clientHeight;

    const clickRatio = clickY / trackHeight;
    contentRef.current.scrollTop = clickRatio * scrollableDistance;
  }, []);

  // Handle wheel event on the container
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!contentRef.current || !hasOverflow) return;

      contentRef.current.scrollTop += e.deltaY;
    },
    [hasOverflow]
  );

  return (
    <div
      ref={containerRef}
      className={`scrollable-container ${
        hasOverflow ? "scrollable-container--has-overflow" : ""
      } ${className}`}
      style={{ maxHeight: height, ...style }}
      data-name="ScrollableContainer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={handleWheel}
    >
      <div
        ref={contentRef}
        className="scrollable-container__content"
        onScroll={handleScroll}
      >
        {children}
      </div>

      {hasOverflow && (
        <div
          ref={trackRef}
          className="scrollable-container__track scrollable-container__track--active"
          style={{
            width: scrollbarWidth,
            backgroundColor: trackColor,
            borderRadius: trackBorderRadius,
          }}
          onClick={handleTrackClick}
        >
          <div
            ref={thumbRef}
            className={`scrollable-container__thumb ${
              isHovered || isDragging
                ? "scrollable-container__thumb--visible"
                : ""
            }`}
            style={{
              height: thumbHeight,
              width: scrollbarWidth,
              backgroundColor: thumbColor,
              borderRadius: thumbBorderRadius,
              transform: `translateY(${thumbTop}px)`,
            }}
            onMouseDown={handleThumbMouseDown}
          />
        </div>
      )}
    </div>
  );
};
