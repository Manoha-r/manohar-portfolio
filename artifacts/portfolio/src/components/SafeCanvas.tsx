import { Component, ReactNode, useState, useEffect } from "react";
import { Canvas, CanvasProps } from "@react-three/fiber";

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

const DarkFallback = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d0d1a] to-[#050510]" />
);

interface SafeCanvasProps extends CanvasProps {
  fallback?: ReactNode;
}

export function SafeCanvas({ fallback, children, ...props }: SafeCanvasProps) {
  const [webglOk, setWebglOk] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
  }, []);

  if (webglOk === null) {
    return <div className="absolute inset-0 bg-[#0a0a0f]" />;
  }

  if (!webglOk) {
    return <>{fallback ?? <DarkFallback />}</>;
  }

  return (
    <CanvasErrorBoundary fallback={fallback ?? <DarkFallback />}>
      <Canvas
        gl={{ failIfMajorPerformanceCaveat: false, powerPreference: "default" }}
        {...props}
      >
        {children}
      </Canvas>
    </CanvasErrorBoundary>
  );
}
