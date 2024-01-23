const keyUpFunctions = () => {
  const onKeyEnter = (key) => {
    if (key.key === "Enter") {
      key.preventDefault();
    }
  };

  return { onKeyEnter };
};

export const { onKeyEnter } = keyUpFunctions();
