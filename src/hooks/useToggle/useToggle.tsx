import { useState } from 'react';

type UseToggleReturnType = [boolean, () => void];

const useToggle = (initialValue: boolean): UseToggleReturnType => {
  const [value, setValue] = useState<boolean>(initialValue);
  const toggleValue = (): void => setValue((value) => !value);

  return [value, toggleValue];
};

export default useToggle;
