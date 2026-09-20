import { Component } from 'react';
import i18n from '../i18n';
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error('Page failed to render', error); }
  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="mx-auto min-h-[70svh] max-w-xl px-5 pb-16 pt-36 text-center" role="alert"><h1 className="text-3xl font-bold">{i18n.t('common.recovery_title')}</h1><p className="mt-4">{i18n.t('common.recovery_desc')}</p><button onClick={() => window.location.reload()} className="mt-6 rounded-lg bg-primary px-5 py-3 text-white">{i18n.t('common.reload')}</button><a href="mailto:rojagatrafie@gmail.com" className="mt-4 block text-primary">rojagatrafie@gmail.com</a></main>;
  }
}
