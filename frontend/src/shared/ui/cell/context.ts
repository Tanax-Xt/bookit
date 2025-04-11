import { createContext, useContext } from "solid-js";

export type CellContextValue = {
  /**
   * The `role` attribute of the dialog element.
   */
  role: "group" | "region";

  /**
   * The `id` attribute of the dialog element.
   */
  groupId: string;

  /**
   * The `id` attribute of the dialog label element. Is undefined if no `Dialog.Label` is present.
   */
  labelId: string | undefined;

  /**
   * The `id` attribute of the dialog description element. Is undefined if no `Dialog.Description` is present.
   */
  descriptionId: string | undefined;
};

export const CellContext = createContext<CellContextValue>();

export const useCellContext = () => {
  const context = useContext(CellContext);

  if (context === undefined) {
    throw new Error("The cell context must be used within a <Cell> component.");
  }

  return context;
};

export type CellPrivateContextValue = CellContextValue & {
  registerLabelId: VoidFunction;
  unregisterLabelId: VoidFunction;
  registerDescriptionId: VoidFunction;
  unregisterDescriptionId: VoidFunction;
};

export const CellPrivateContext = createContext<CellPrivateContextValue>();

export const useCellPrivateContext = () => {
  const context = useContext(CellPrivateContext);

  if (context === undefined) {
    throw new Error("The cell context must be used within a <Cell> component.");
  }

  return context;
};

export default useCellContext;
