Исправь импорты authStore во всех файлах. Было `export default`, стало `export const useAuthStore`.

Найди и исправь во всех файлах:

// Было (неправильно):
import authStore from '../stores/authStore';
// или
import useAuthStore from '../stores/authStore';

// Стало (правильно):
import { useAuthStore } from '../stores/authStore';

Файлы для исправления:
- src/api/client.ts
- src/components/layout/BottomNav.tsx
- src/components/layout/ProtectedRoute.tsx
- src/hooks/useAuth.ts
- src/pages/OrderDetailPage.tsx
- src/pages/OrderFormPage.tsx
- src/pages/OrdersPage.tsx
- src/pages/ProfilePage.tsx

И любые другие файлы где используется authStore.

Также исправь использование селекторов с типами:

// Было (неправильно):
const isAdmin = useAuthStore((state) => state.isAdmin);

// Стало (правильно):
const isAdmin = useAuthStore((state: { isAdmin: boolean }) => state.isAdmin);

// Или ещё лучше - используй весь стор:
const { isAdmin, isInstaller, user } = useAuthStore();