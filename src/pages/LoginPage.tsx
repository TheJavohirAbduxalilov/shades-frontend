import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageTransition from '../components/ui/PageTransition';
import { toast } from '../components/ui/Toast';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginMutation } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await loginMutation.mutateAsync({ username, password });
      toast.success(t('common.success'));
      navigate('/orders');
    } catch {
      const message = t('auth.loginError');
      setError(message);
      toast.error(message);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-10">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{t('auth.login')}</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label={t('auth.username')}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder={t('auth.username')}
          />
          <Input
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t('auth.password')}
          />
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <Button type="submit" fullWidth isLoading={loginMutation.isPending}>
            {t('auth.loginButton')}
          </Button>
        </form>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
