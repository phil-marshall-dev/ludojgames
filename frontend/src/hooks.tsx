import { useState, ChangeEvent, useEffect, useRef } from "react";

type UseFormInput<T> = {
  state: T;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const useFormInput = <T extends {}>(initialState: T): UseFormInput<T> => {
  const [state, setState] = useState<T>(initialState);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    } as T));
  };

  return {
    state,
    handleInputChange
  };
};
