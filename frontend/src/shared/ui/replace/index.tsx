import { ComponentProps } from "solid-js";
import { Transition } from "solid-transition-group";

const Replace = (props: ComponentProps<"div">) => {
  return (
    <div
      style={{
        position: "relative",
      }}
      {...props}
    >
      <Transition
        exitActiveClass="absolute transition duration-300 ease-in-out"
        enterActiveClass="ease-spring absolute transition duration-500"
        exitToClass="scale-50 opacity-0"
        enterClass="scale-0 opacity-0"
      >
        {props.children}
      </Transition>
    </div>
  );
};

export default Replace;
