import { ParentComponent } from "solid-js";

import { ThemeContext } from "../model/context";
import { createTheme } from "../model/create";

export const ThemeProvider: ParentComponent = (props) => {
  const context = createTheme();

  return <ThemeContext.Provider value={context}>{props.children}</ThemeContext.Provider>;
};
