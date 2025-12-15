import { useState, useEffect, useRef } from 'react';

/**
 * Hook para inputs com debounce - evita múltiplas chamadas de API ao digitar
 *
 * @param initialValue - Valor inicial (vem do config/prop)
 * @param onUpdate - Função de atualização (chamada apenas após o delay)
 * @param delay - Tempo em ms para esperar antes de chamar onUpdate (default: 500ms)
 * @returns [localValue, setLocalValue] - Estado local para controlar o input
 */
export function useDebouncedUpdate<T>(
  initialValue: T,
  onUpdate: (value: T) => void,
  delay: number = 500
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [localValue, setLocalValue] = useState<T>(initialValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialValueRef = useRef<T>(initialValue);
  const hasChangedRef = useRef(false);

  // Sync with external value changes (when config is updated from elsewhere)
  useEffect(() => {
    // Only sync if the external value changed AND we don't have pending local changes
    if (initialValue !== initialValueRef.current && !hasChangedRef.current) {
      setLocalValue(initialValue);
    }
    initialValueRef.current = initialValue;
  }, [initialValue]);

  // Debounced save
  useEffect(() => {
    // Don't trigger on initial mount
    if (localValue === initialValueRef.current) {
      hasChangedRef.current = false;
      return;
    }

    hasChangedRef.current = true;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onUpdate(localValue);
      hasChangedRef.current = false;
      initialValueRef.current = localValue;
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localValue, delay, onUpdate]);

  return [localValue, setLocalValue];
}

/**
 * Hook para múltiplos campos com debounce - usa um único timer para todo o objeto
 * Útil quando você tem vários campos que precisam ser salvos juntos
 */
export function useDebouncedConfig<T extends Record<string, any>>(
  config: T,
  onUpdate: (config: T) => void,
  delay: number = 500
): [T, (key: keyof T, value: T[keyof T]) => void, (updates: Partial<T>) => void] {
  const [localConfig, setLocalConfig] = useState<T>(config);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const configRef = useRef<T>(config);
  const hasChangedRef = useRef(false);

  // Sync with external config changes
  useEffect(() => {
    if (!hasChangedRef.current) {
      setLocalConfig(config);
    }
    configRef.current = config;
  }, [config]);

  // Debounced save
  useEffect(() => {
    if (!hasChangedRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onUpdate(localConfig);
      hasChangedRef.current = false;
      configRef.current = localConfig;
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localConfig, delay, onUpdate]);

  const updateField = (key: keyof T, value: T[keyof T]) => {
    hasChangedRef.current = true;
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateFields = (updates: Partial<T>) => {
    hasChangedRef.current = true;
    setLocalConfig(prev => ({ ...prev, ...updates }));
  };

  return [localConfig, updateField, updateFields];
}
