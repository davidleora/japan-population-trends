import { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(/*error: Error*/): ErrorBoundaryState {
    // 次のレンダーでフォールバックUIを表示するために、エラーが発生した状態を更新
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // エラーロギングサービスにエラーを記録
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // エラーが発生した場合に表示するフォールバックUI
      return <h1>何か問題が発生しました。</h1>;
    }

    // 問題がなければ通常の子コンポーネントをレンダー
    return this.props.children;
  }
}

export default ErrorBoundary;
