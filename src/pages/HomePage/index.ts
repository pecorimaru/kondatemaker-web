// HomePageのメインコンポーネントをエクスポート
export { HomePage } from './HomePage';

// HomePageをデフォルトエクスポートとしても提供（ルーティング時に便利）
export { HomePage as default } from './HomePage';

// ページ専用コンポーネントをre-export（components/index.tsを通して）
export * from './components'; 