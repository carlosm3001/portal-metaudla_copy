import React from "react";
export default class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(){ return { hasError: true }; }
  componentDidCatch(err, info){ console.error("UI error:", err, info); }
  render(){ return this.state.hasError ? <div className="p-6 text-danger">Ha ocurrido un error en la UI.</div> : this.props.children; }
}