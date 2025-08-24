import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 3秒後にホームページにリダイレクト（オプション）
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h1>404 - ページが見つかりません</h1>
      <p>3秒後にホームページに戻ります...</p>
      <button onClick={() => navigate('/')}>
        今すぐホームに戻る
      </button>
    </div>
  );
}

export default NotFoundPage;
